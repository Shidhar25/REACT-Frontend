package com.REACT.backend.ambulanceService.service.impl;

import com.REACT.backend.ambulanceService.dto.AmbulanceBookingHistoryResponseDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceDriverProfileDto;
import com.REACT.backend.ambulanceService.dto.LocationUpdateByDriver;
import com.REACT.backend.common.dto.CompleteAssignmentResponseDto;
import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
import com.REACT.backend.ambulanceService.repository.AmbulanceRepository;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.repository.EmergencyRequestRepository;
import com.REACT.backend.common.dto.LocationDto;
import com.REACT.backend.common.exception.ResourceNotFoundException;
import com.REACT.backend.common.util.LocationUtils;
import com.REACT.backend.common.util.LoggedUserUtil;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.model.AmbulanceDriver;
import com.REACT.backend.fireService.model.FireTruckStatus;
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
public class AmbulanceDriverServiceImpl {

    private final EmergencyRequestRepository emergencyRequestRepo;
    private final AmbulanceRepository ambulanceRepository;
    private final LoggedUserUtil loggedUserUtil;
    private final LocationUtils locationUtils;

    public List<AmbulanceBookingHistoryResponseDto> getAllHistory(Object obj) {
        log.info("Received request to fetch ambulance booking history");

        if (!(obj instanceof AmbulanceDriver driver)) {
            log.error("Invalid user type: expected AmbulanceDriver but got {}", obj == null ? "null" : obj.getClass().getSimpleName());
            throw new IllegalArgumentException("Invalid access. This operation is allowed only for Ambulance Drivers.");
        }


        AmbulanceEntity ambulance = driver.getAmbulance();
        if (ambulance == null) {
            log.warn("AmbulanceDriver {} has no assigned ambulance", driver.getDriverId());
            return List.of(); // or throw, depending on your design
        }

        log.debug("Fetching booking history for ambulance ID: {}", ambulance.getId());

        List<EmergencyRequestEntity> bookings = emergencyRequestRepo.findByAssignedAmbulance(ambulance);

        log.info("Found {} bookings for ambulance ID: {}", bookings.size(), ambulance.getId());

        List<AmbulanceBookingHistoryResponseDto> response = bookings.stream()
                .map(req -> {
                    log.debug("Mapping booking ID {} to response DTO", req.getId());
                    return AmbulanceBookingHistoryResponseDto.builder()
                            .id(req.getId())
                            .userId(req.getRequestedBy().getUserId())
                            .emailOfRequester(req.getRequestedBy().getUserEmail())
                            .requestedAt(req.getCreatedAt())
                            .latitude(req.getLatitude())
                            .status(req.getAmbulanceStatusMap().get(ambulance))
                            .longitude(req.getLongitude())
                            .build();
                })
                .toList();

        log.info("Returning {} booking DTOs for response", response.size());
        return response;
    }

    // Add this method somewhere in your AmbulanceDriverServiceImpl

    public LocationDto getLocationOfCurrentBooking(Object driverObject) {
        log.info("Location fetch request init");

        if (!(driverObject instanceof AmbulanceDriver driver)) {
            log.error("Invalid object passed to getLocationOfCurrentBooking: {}", driverObject == null ? "null" : driverObject.getClass().getSimpleName());
            throw new IllegalArgumentException("Only Ambulance Drivers can access location data.");
        }

        AppUser appUser = driver.getDriver();
        if (appUser == null) {
            log.error("Driver object has no linked AppUser");
            throw new ResourceNotFoundException("Ambulance driver not linked to a user account.");
        }

        AmbulanceEntity ambulance = ambulanceRepository.findByDriver(appUser);
        if (ambulance == null) {
            log.error("No ambulance assigned to AppUser: {}", appUser.getUserId());
            throw new ResourceNotFoundException("No ambulance assigned to this driver.");
        }

        log.info("Found associated ambulance {} of {} ",ambulance.getAmbulanceRegNumber(),ambulance.getAmbulanceDriverName());

        List< EmergencyRequestEntity> activeEntity= emergencyRequestRepo.findByAssignedAmbulance(ambulance);
        log.info("Fetched {} requests where ambulance where involved.",activeEntity.size());

        return activeEntity.stream().filter( req -> AmbulanceStatus.EN_ROUTE.equals(req.getAmbulanceStatusMap().get(ambulance)))
                .findFirst()
                .map(req -> new LocationDto(req.getLatitude(), req.getLongitude()))
                .orElseThrow(() -> {
                    log.warn("No EN_ROUTE booking found for ambulance ID {}", ambulance.getId());
                    return new ResourceNotFoundException("No active EN_ROUTE request for this ambulance");
                });


    }

    @Transactional
    public CompleteAssignmentResponseDto completeBooking(Object obj){
        log.info("Started with COMPLETE status update process");
        if (!(obj instanceof AmbulanceDriver driver)) {
            log.error("Invalid user type for completeBooking: {}", obj == null ? "null" : obj.getClass().getSimpleName());
            throw new IllegalArgumentException("Only Ambulance Drivers can complete bookings.");
        }

        AppUser appUser = driver.getDriver();
        AmbulanceEntity ambulance = ambulanceRepository.findByDriver(appUser);
        log.info("found ambulance {}",ambulance.getId());

        List<EmergencyRequestEntity> entity = emergencyRequestRepo.findByAssignedAmbulance(ambulance);

        EmergencyRequestEntity thisEntity = entity.stream()
                .filter(e -> AmbulanceStatus.EN_ROUTE.equals(e.getAmbulanceStatusMap().get(ambulance)))
                .findFirst()
                .orElseThrow(() -> {
                    log.warn("No EN_ROUTE request found for ambulance ID {}", ambulance.getId());
                    return new ResourceNotFoundException("No active EN_ROUTE booking found for completion.");
                });
        ambulance.setStatus(AmbulanceStatus.AVAILABLE);
        ambulanceRepository.save(ambulance);

        log.info("Completed the assignment {}",thisEntity.getId());
        if (thisEntity.getAmbulanceStatusMap() == null) {
            log.error("Ambulance status map is null for booking ID {}", thisEntity.getId());
            throw new IllegalStateException("Invalid booking state: no ambulance status map present.");
        }
        thisEntity.getAmbulanceStatusMap().put(ambulance,AmbulanceStatus.COMPLETED);
        emergencyRequestRepo.save(thisEntity);
        log.info("done updating status");

        // Check if all services are completed
        checkAndCompleteBooking(thisEntity);

        Duration duration = Duration.between(thisEntity.getCreatedAt(), Instant.now());
        long time = duration.toMinutes();
        return CompleteAssignmentResponseDto.builder()
                .completedAt(Instant.now())
                .duration(time)
                .build();
    }

    @Transactional
    private void checkAndCompleteBooking(EmergencyRequestEntity requestEntity) {
        log.info("Checking if all services for request {} have completed", requestEntity.getId());

        // Check if all ambulance statuses are completed
        boolean ambulancesCompleted = requestEntity.getAmbulanceStatusMap().values().stream()
                .allMatch(status -> status == AmbulanceStatus.COMPLETED);

        // Check if all fire truck statuses are completed
        boolean fireTrucksCompleted = requestEntity.getFireTruckStatusMap() == null ||
                requestEntity.getFireTruckStatusMap().values().stream()
                        .allMatch(status -> status == FireTruckStatus.COMPLETED);

        // Check if police assignments are completed (all stations have 0 assigned officers)
        boolean policeCompleted = requestEntity.getAssignedPoliceMap() == null ||
                requestEntity.getAssignedPoliceMap().values().stream()
                        .allMatch(count -> count == 0);

        log.info("Service completion status - Ambulances: {}, Fire: {}, Police: {}",
                ambulancesCompleted, fireTrucksCompleted, policeCompleted);

        if (ambulancesCompleted && fireTrucksCompleted && policeCompleted) {
            requestEntity.setEmergencyRequestStatus(
                    com.REACT.backend.booking.model.EmergencyRequestStatus.COMPLETED);
            emergencyRequestRepo.save(requestEntity);
            log.info("Emergency request {} marked as COMPLETED", requestEntity.getId());
        }
    }



    public AmbulanceDriverProfileDto getMe(){
        AppUser user = loggedUserUtil.getCurrentUser();

        return AmbulanceDriverProfileDto
                .builder()
                .email(user.getUserEmail())
                .govId(user.getGovernmentId()).userID(user.getUserId())
                .ambulanceRegNumber(ambulanceRepository.findByDriver(user).getAmbulanceRegNumber())
                .licenseNumber(ambulanceRepository.findByDriver(user).getAmbulanceRegNumber())
                .name(user.getUserFullName())
                .mobile(user.getPhoneNumber())
                .build();
    }

    public String updateLocation(LocationUpdateByDriver dto){
        AppUser user = loggedUserUtil.getCurrentUser();
        AmbulanceEntity entity =  ambulanceRepository.findByDriver(user);
        entity.setLocation(
                locationUtils.createPoint(dto.getLatitude(), dto.getLongitude())
        );

        ambulanceRepository.save(entity);
        return "Location updated ";
    }

}
