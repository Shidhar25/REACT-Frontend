package com.REACT.backend.booking.service;

import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
import com.REACT.backend.ambulanceService.repository.AmbulanceRepository;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.model.EmergencyRequestStatus;
import com.REACT.backend.booking.repository.EmergencyRequestRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverBookingServiceImpl {
    private final EmergencyRequestRepository requestRepo;
    private final AmbulanceRepository ambulanceRepository;

    /**
     * Driver accepts a booking: updates ambulance & request status.
     */
    @Transactional
    public void acceptBooking(Long bookingId, Long driverId) {
        // find request
        EmergencyRequestEntity request = requestRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        // check assigned ambulance & driver
        AmbulanceEntity ambulance = request.getAmbulance();

        if (ambulance == null) {
            throw new RuntimeException("No ambulance assigned to this request.");
        }

        if (ambulance.getDriver() == null || !ambulance.getDriver().getUserId().equals(driverId)) {
            throw new RuntimeException("This booking is not assigned to this driver.");
        }


        // update ambulance & request
        ambulance.setStatus(AmbulanceStatus.EN_ROUTE);
        ambulance.setLastUpdated(Instant.now());
        ambulanceRepository.save(ambulance);

        request.setEmergencyRequestStatus(EmergencyRequestStatus.IN_PROGRESS);
        requestRepo.save(request);
    }

    /**
     * Get all pending requests assigned to a driver.
     */
    public List<EmergencyRequestEntity> getPendingRequestsForDriver(Long driverId) {
        return requestRepo.findByDriver_UserIdAndEmergencyRequestStatus(
                driverId,
                EmergencyRequestStatus.PENDING
        );
    }

}