package com.REACT.backend.ambulanceService.service.impl;

import com.REACT.backend.ambulanceService.dto.AmbulanceBookingHistoryResponseDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceDriverProfileDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceLocationUpdateDto;
import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.ambulanceService.repository.AmbulanceRepository;
import com.REACT.backend.ambulanceService.service.AmbulanceService;
import com.REACT.backend.auth.dto.AmbulanceRegisterRequestDto;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.repository.EmergencyRequestRepository;
import com.REACT.backend.common.exception.ResourceNotFoundException;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.model.AmbulanceDriver;
import com.REACT.backend.users.repository.AmbulanceDriverRepository;
import com.REACT.backend.users.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class AmbulanceServiceImpl implements AmbulanceService {

    private final SimpMessagingTemplate messagingTemplate;
    private final AmbulanceRepository ambulanceRepository;
    private final EmergencyRequestRepository requestRepository;
    private final AmbulanceDriverRepository ambulanceDriverRepository;
    private final AppUserRepository appUserRepository;

    @Override
    public List<AmbulanceDto> getAllAmbulances() {
        return ambulanceRepository.findAll().stream()
                .map(AmbulanceDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public AmbulanceDto getAmbulanceById(Long id) {
        AmbulanceEntity entity = ambulanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ambulance not found with id: " + id));
        return new AmbulanceDto(entity);
    }

    @Override
    public List<AmbulanceDto> getAmbulancesByHospitalId(Long hospitalId) {
        return ambulanceRepository.findByHospitalId(hospitalId).stream()
                .map(AmbulanceDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<AmbulanceBookingHistoryResponseDto> getHistoryOfAmbulance(Long ambulanceId) {
        AmbulanceEntity ambulanceEntity = ambulanceRepository.findById(ambulanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found with id: " + ambulanceId));

        if (ambulanceEntity == null) {
            throw new ResourceNotFoundException("No such ambulance with id exist");
        }

        List<EmergencyRequestEntity> entityList = requestRepository.findByAssignedAmbulance(ambulanceEntity);

        // Add proper log with safe null handling
        log.info("Getting booking history for Ambulance ID: {}", ambulanceId);
        entityList.forEach(request -> {
            log.debug("Request ID: {}, Lat: {}, Long: {}",
                    request.getId(),
                    Objects.toString(request.getLatitude(), "null"),
                    Objects.toString(request.getLongitude(), "null")
            );
        });

        return entityList.stream()
                .map(request -> AmbulanceBookingHistoryResponseDto.builder()
                        .id(request.getId())
                        .userId(request.getRequestedBy().getUserId())
                        .emailOfRequester(request.getRequestedBy().getUserEmail())
                        .requestedAt(request.getCreatedAt())
                        .latitude(request.getLatitude())
                        .longitude(request.getLongitude())
                        .status(request.getAmbulanceStatusMap().get(ambulanceEntity)) // ensure ambulance key is present
                        .build())
                .toList();
    }


    @Override
    public AmbulanceDriverProfileDto getProfile(Long ambulanceId){
        // Step 1: Find ambulance by ID
        AmbulanceEntity ambulance = ambulanceRepository.findById(ambulanceId)
                .orElseThrow(() -> new ResourceNotFoundException("No such Ambulance exists with ID: " + ambulanceId));

        // Step 2: Get driver from that ambulance
        AmbulanceDriver driver = ambulanceDriverRepository.findByAmbulance(ambulance)
                .orElseThrow(() -> new ResourceNotFoundException("No driver assigned to this ambulance."));

        // Step 3: Get user (AppUser) from that driver
        AppUser driverUser = driver.getDriver(); // no need to re-fetch — already available




        // Step 4: Build DTO
        return AmbulanceDriverProfileDto.builder()
                .userID(driverUser.getUserId())
                .name(driverUser.getUserFullName())
                .email(driverUser.getUserEmail())
                .mobile(driverUser.getPhoneNumber())
                .licenseNumber(driver.getLicenseNumber())
                .govId(driverUser.getGovernmentId())
                .Role(driverUser.getRole().name())
                .ambulanceRegNumber(ambulance.getAmbulanceRegNumber())
                .build();
    }
}
