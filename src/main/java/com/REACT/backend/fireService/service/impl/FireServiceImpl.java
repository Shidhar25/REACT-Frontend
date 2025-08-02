package com.REACT.backend.fireService.service.impl;

import com.REACT.backend.ambulanceService.dto.AmbulanceBookingHistoryResponseDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceDriverProfileDto;
import com.REACT.backend.ambulanceService.dto.LocationUpdateByDriver;
import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
import com.REACT.backend.booking.dto.BookingDto;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.model.EmergencyRequestStatus;
import com.REACT.backend.booking.repository.EmergencyRequestRepository;
import com.REACT.backend.common.dto.CompleteAssignmentResponseDto;
import com.REACT.backend.common.dto.LocationDto;
import com.REACT.backend.common.exception.ResourceNotFoundException;
import com.REACT.backend.common.util.LocationUtils;
import com.REACT.backend.common.util.LoggedUserUtil;
import com.REACT.backend.fireService.dto.FireTruckDriverProfileDto;
import com.REACT.backend.fireService.dto.FireTruckDto;
import com.REACT.backend.fireService.dto.FireTruckHistoryResponseDto;
import com.REACT.backend.fireService.model.FireTruckEntity;
import com.REACT.backend.fireService.model.FireTruckStatus;
import com.REACT.backend.fireService.repository.FireTruckRepository;
import com.REACT.backend.fireService.service.FireService;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.model.AmbulanceDriver;
import com.REACT.backend.users.model.FireTruckDriver;
import com.REACT.backend.users.repository.AppUserRepository;
import com.REACT.backend.users.repository.FireTruckDriverRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FireServiceImpl  implements FireService {
    private final FireTruckRepository fireTruckRepository;
    private final FireTruckDriverRepository fireTruckDriverRepository;
    private final AppUserRepository appUserRepository;
    private final EmergencyRequestRepository emergencyRequestRepo;

    private final LoggedUserUtil loggedUserUtil;
    private final LocationUtils locationUtils;


    public LocationDto getLocationOfCurrentBooking(Object driverObject) {
        log.info("Location of current booking init");

        if (!(driverObject instanceof FireTruckDriver driver)) {
            log.error("Invalid object passed to getLocationOfCurrentBooking: {}", driverObject == null ? "null" : driverObject.getClass().getSimpleName());
            throw new IllegalArgumentException("Only Fire truck Drivers can access location data.");
        }

        AppUser appUser = driver.getDriver();
        if (appUser == null) {
            log.error("Driver object has no linked AppUser");
            throw new ResourceNotFoundException("Fire Truck driver not linked to a user account.");
        }
        log.info("found user who is requesting {}",appUser.getUserEmail());

        FireTruckEntity truck = fireTruckRepository.findByDriver(driver);
        if (truck == null) {
            log.error("No ambulance assigned to AppUser: {}", appUser.getUserId());
            throw new ResourceNotFoundException("No ambulance assigned to this driver.");
        }

        log.info("Found associated fire truck {} of {} ",truck.getVehicleRegNumber(),truck.getDriverName());

        List<EmergencyRequestEntity> activeEntity= emergencyRequestRepo.findByAssignedFireTruckEntities(truck);
        log.info("Fetched {} requests where Fire Truck where involved.",activeEntity.size());

        return activeEntity.stream()
                .filter(req -> FireTruckStatus.EN_ROUTE.equals(req.getFireTruckStatusMap().get(truck)))
                .findFirst()
                .map(req -> new LocationDto(req.getLatitude(), req.getLongitude()))
                .orElseThrow(() -> new RuntimeException("No active EN_ROUTE request for this fire truck"));


    }

    public CompleteAssignmentResponseDto completeBooking(Object driverObject){
        log.info("Started with COMPLETE status update process");

        if (!(driverObject instanceof FireTruckDriver driver)) {
            log.error("Invalid object passed to getLocationOfCurrentBooking: {}", driverObject == null ? "null" : driverObject.getClass().getSimpleName());
            throw new IllegalArgumentException("Only Fire truck Drivers can access location data.");
        }

        AppUser appUser = driver.getDriver();
        if (appUser == null) {
            log.error("Driver object has no linked AppUser");
            throw new ResourceNotFoundException("Fire Truck driver not linked to a user account.");
        }
        log.info("found user who is requesting {}",appUser.getUserEmail());

        FireTruckEntity truck = fireTruckRepository.findByDriver(driver);
        if (truck == null) {
            log.error("No ambulance assigned to AppUser: {}", appUser.getUserId());
            throw new ResourceNotFoundException("No ambulance assigned to this driver.");
        }
        log.info("found ambulance {}",truck.getFireTruckId());

        truck.setStatus(FireTruckStatus.AVAILABLE);

        fireTruckRepository.save(truck);

        List<EmergencyRequestEntity> entity = emergencyRequestRepo.findByAssignedFireTruckEntities(truck);
        EmergencyRequestEntity thisEntity = null;

        for(EmergencyRequestEntity e : entity){
            FireTruckStatus status = e.getFireTruckStatusMap().get(truck);
            if(status==FireTruckStatus.EN_ROUTE){
                thisEntity = e;
                break;
            }
        }
        thisEntity.getFireTruckStatusMap().put(truck,FireTruckStatus.COMPLETED);
        log.info("Completed the assignment {}",thisEntity.getId());
        emergencyRequestRepo.save(thisEntity);

        // Check if all services are completed
        checkAndCompleteBooking(thisEntity);

        Duration duration = Duration.between(thisEntity.getCreatedAt(), Instant.now());
        long time = duration.toMinutes();

        return CompleteAssignmentResponseDto.builder()
                .completedAt(Instant.now())
                .duration(time)
                .build();
    }

    private void checkAndCompleteBooking(EmergencyRequestEntity requestEntity) {
        log.info("Checking if all services for request {} have completed", requestEntity.getId());

        // Check if all ambulance statuses are completed
        boolean ambulancesCompleted = true;

        // Check if all fire truck statuses are completed
        boolean fireTrucksCompleted = requestEntity.getFireTruckStatusMap().values().stream()
                .allMatch(status -> status == FireTruckStatus.COMPLETED);

        // Check if police assignments are completed (all stations have 0 assigned officers)
        boolean policeCompleted = true;

        log.info("Service completion status - Ambulances: {}, Fire: {}, Police: {}",
                ambulancesCompleted, fireTrucksCompleted, policeCompleted);

        if (ambulancesCompleted && fireTrucksCompleted && policeCompleted) {
            requestEntity.setEmergencyRequestStatus(EmergencyRequestStatus.COMPLETED);
            emergencyRequestRepo.save(requestEntity);
            log.info("Emergency request {} marked as COMPLETED", requestEntity.getId());
        }
    }

    @Override
    public FireTruckDriverProfileDto getProfile(Long truckId) {
        log.info("Fetching FireTruck driver profile for truckId: {}", truckId);

        FireTruckEntity fireTruck = fireTruckRepository.findByFireTruckId(truckId)
                .orElseThrow(() -> {
                    log.warn("No FireTruck found for truckId: {}", truckId);
                    return new ResourceNotFoundException("FireTruck with ID " + truckId + " not found");
                });

        FireTruckDriver driver = fireTruck.getDriver();
        if (driver == null) {
            log.warn("No FireTruckDriver assigned to fireTruckId: {}", truckId);
            throw new ResourceNotFoundException("No driver assigned to FireTruck with ID " + truckId);
        }

        AppUser user = driver.getDriver();
        if (user == null) {
            log.warn("No AppUser associated with FireTruckDriver for truckId: {}", truckId);
            throw new ResourceNotFoundException("User not found for driver of FireTruck with ID " + truckId);
        }

        log.debug("Driver found: {} | Email: {} | Truck Reg: {}",
                user.getUserFullName(), user.getUserEmail(), fireTruck.getVehicleRegNumber());


        FireTruckDriverProfileDto profile = FireTruckDriverProfileDto.builder()
                .userId(user.getUserId())
                .name(user.getUserFullName())
                .email(user.getUserEmail())
                .mobile(user.getPhoneNumber())
                .licenseNumber(driver.getLicenseNumber())
                .govId(user.getGovernmentId())
                .Role(user.getRole().toString())
                .fireTruckRegNumber(fireTruck.getVehicleRegNumber())
                .build();


        log.info("Successfully built driver profile for truckId: {}", truckId);
        return profile;
    }


    public FireTruckDriverProfileDto getMe(){
        AppUser user = loggedUserUtil.getCurrentUser();
//         .ambulanceRegNumber(ambulanceRepository.findByDriver(user).getAmbulanceRegNumber())
//                .licenseNumber(ambulanceRepository.findByDriver(user).getAmbulanceRegNumber())
        FireTruckDriver driver = fireTruckDriverRepository.findByDriver(user)
                .orElseThrow(() -> new RuntimeException("Truck driver details not found"));
        FireTruckDriverProfileDto profile = FireTruckDriverProfileDto.builder()
                .userId(user.getUserId())
                .name(user.getUserFullName())
                .email(user.getUserEmail())
                .mobile(user.getPhoneNumber())
                .fireTruckRegNumber(driver.getFireTruckEntity().getVehicleRegNumber())
                .govId(user.getGovernmentId())
                .Role(user.getRole().toString())
                .licenseNumber(driver.getLicenseNumber())
                .build();

        return profile;
    }


    public  String updateLocation(LocationUpdateByDriver dto){
        AppUser user  = loggedUserUtil.getCurrentUser();

        FireTruckDriver driver = fireTruckDriverRepository.findByDriver(user)
                .orElseThrow(() -> new RuntimeException("Truck driver details not found"));;
        FireTruckEntity entity = fireTruckRepository.findByDriver(driver);


        entity.setLocation(
                locationUtils.createPoint(dto.getLatitude(),dto.getLongitude())
        );
        fireTruckRepository.save(entity);

        return "Location Updated successfully";

    }

    public List<FireTruckHistoryResponseDto> fireTruckHistory(String vehicleRegNumber) {
        FireTruckEntity entity = fireTruckRepository.findByVehicleRegNumber(vehicleRegNumber);
        List<EmergencyRequestEntity> emergencyRequestEntity = emergencyRequestRepo.findByAssignedFireTruckEntities(entity);
        List<FireTruckHistoryResponseDto> list = new ArrayList<>();

        for(EmergencyRequestEntity em : emergencyRequestEntity){
            FireTruckHistoryResponseDto dto = FireTruckHistoryResponseDto.builder()
                    .id(em.getId())
                    .emailOfRequester(em.getRequestedBy().getUserEmail())
                    .requestedAt(em.getCreatedAt())
                    .latitude(em.getLatitude())
                    .longitude(em.getLongitude())
                    .status(em.getFireTruckStatusMap().get(entity))
                    .build();
            list.add(dto);
        }
        return list;
    }

}
