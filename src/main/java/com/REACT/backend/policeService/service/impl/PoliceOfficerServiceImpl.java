package com.REACT.backend.policeService.service.impl;

import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.repository.EmergencyRequestRepository;
import com.REACT.backend.booking.service.BookingServiceImpl;
import com.REACT.backend.common.dto.CompleteAssignmentResponseDto;
import com.REACT.backend.common.dto.LocationDto;
import com.REACT.backend.common.util.LoggedUserUtil;
import com.REACT.backend.policeService.dto.PoliceOfficerResponseDto;
import com.REACT.backend.policeService.model.PoliceStationEntity;
import com.REACT.backend.policeService.repository.PoliceStationRepository;
import com.REACT.backend.policeService.service.PoliceOfficerService;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.model.PoliceOfficer;
import com.REACT.backend.users.repository.PoliceOfficerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PoliceOfficerServiceImpl implements PoliceOfficerService {

    private final EmergencyRequestRepository emergencyRequestRepository;
    private final PoliceStationRepository policeStationRepository;
    private final BookingServiceImpl bookingService;
    private final PoliceOfficerRepository policeOfficerRepository;

    private final LoggedUserUtil loggedUserUtil;
    @Override
    public LocationDto getLocationOfCurrentBooking(Object officerObject) {
        log.info("Fetching location for current police assignment");

        PoliceOfficer officer = (PoliceOfficer) officerObject;
        AppUser appUser = officer.getPoliceOfficer();
        PoliceStationEntity station = officer.getPoliceStation();

        log.info("Officer {} from station {} requesting location",
                appUser.getUserEmail(), station.getStationName());

        // Find emergency requests where this police station is assigned
        List<EmergencyRequestEntity> activeRequests = emergencyRequestRepository.findAll().stream()
                .filter(request -> request.getAssignedPoliceMap() != null &&
                        request.getAssignedPoliceMap().containsKey(station) &&
                        request.getAssignedPoliceMap().get(station) > 0)
                .toList();

        log.info("Found {} active requests for police station {}",
                activeRequests.size(), station.getStationName());

        // Return the location of the most recent active request
        EmergencyRequestEntity currentRequest = activeRequests.stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active assignment found for this police officer"));

        return LocationDto.builder()
                .latitude(currentRequest.getLatitude())
                .longitude(currentRequest.getLongitude())
                .build();
    }

    @Transactional
    @Override
    public CompleteAssignmentResponseDto completeAssignment(Object officerObject) {
        log.info("Starting police assignment completion process");

        PoliceOfficer officer = (PoliceOfficer) officerObject;
        AppUser appUser = officer.getPoliceOfficer();
        PoliceStationEntity station = officer.getPoliceStation();

        log.info("Officer {} from station {} completing assignment",
                appUser.getUserEmail(), station.getStationName());

        // Find the current active request
        List<EmergencyRequestEntity> activeRequests = emergencyRequestRepository.findAll().stream()
                .filter(request -> request.getAssignedPoliceMap() != null &&
                        request.getAssignedPoliceMap().containsKey(station) &&
                        request.getAssignedPoliceMap().get(station) > 0)
                .toList();

        EmergencyRequestEntity currentRequest = activeRequests.stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active assignment found for this police officer"));

        log.info("Found active request {} to complete", currentRequest.getId());

        // Mark police assignment as completed by setting officers back to station
        // This effectively completes the police portion of the emergency
        currentRequest.getAssignedPoliceMap().put(station, 0); // Mark as completed

        // Update station availability
        station.setAvailableOfficers(station.getAvailableOfficers() + 1);
        policeStationRepository.save(station);

        // Save the request
        emergencyRequestRepository.save(currentRequest);

        log.info("Police assignment completed for request {}", currentRequest.getId());

        // Check if all services are completed and update overall booking status
        checkAndCompleteBooking(currentRequest);

        // Calculate duration
        Duration duration = Duration.between(currentRequest.getCreatedAt(), Instant.now());
        long minutes = duration.toMinutes();

        return CompleteAssignmentResponseDto.builder()
                .completedAt(Instant.now())
                .duration(minutes)
                .build();
    }

    @Override
    public PoliceOfficerResponseDto getMe() {

        log.info("fetching current police officers details");
        AppUser user = loggedUserUtil.getCurrentUser();
        PoliceOfficer policeOfficer = policeOfficerRepository.findByPoliceOfficer(user)
                .orElseThrow(() -> new RuntimeException("Police Officer details not found"));
//
        return PoliceOfficerResponseDto.builder()
                .policeId(policeOfficer.getId())
                .email(user.getUserEmail())
                .govId(user.getGovernmentId())
                .name(user.getUserFullName())
                .policeStationName(policeOfficer.getPoliceStation().getStationName())
                .phoneNumber(user.getPhoneNumber())
                .userId(user.getUserId())
                .build();

    }

    @Transactional
    private void checkAndCompleteBooking(EmergencyRequestEntity requestEntity) {
        log.info("Checking if all services for request {} have completed", requestEntity.getId());

        // Check if all ambulance statuses are completed
        boolean ambulancesCompleted = requestEntity.getAmbulanceStatusMap() == null ||
                requestEntity.getAmbulanceStatusMap().values().stream()
                        .allMatch(status -> status.name().equals("COMPLETED"));

        // Check if all fire truck statuses are completed
        boolean fireTrucksCompleted = requestEntity.getFireTruckStatusMap() == null ||
                requestEntity.getFireTruckStatusMap().values().stream()
                        .allMatch(status -> status.name().equals("COMPLETED"));

        // Check if police assignments are completed (all stations have 0 assigned officers)
        boolean policeCompleted = requestEntity.getAssignedPoliceMap() == null ||
                requestEntity.getAssignedPoliceMap().values().stream()
                        .allMatch(count -> count == 0);

        log.info("Service completion status - Ambulances: {}, Fire: {}, Police: {}",
                ambulancesCompleted, fireTrucksCompleted, policeCompleted);

        if (ambulancesCompleted && fireTrucksCompleted && policeCompleted) {
            requestEntity.setEmergencyRequestStatus(
                    com.REACT.backend.booking.model.EmergencyRequestStatus.COMPLETED);
            emergencyRequestRepository.save(requestEntity);
            log.info("Emergency request {} marked as COMPLETED", requestEntity.getId());
        }
    }
}
