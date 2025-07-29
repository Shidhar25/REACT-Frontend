package com.REACT.backend.ambulanceService.service.impl;

import com.REACT.backend.ambulanceService.dto.AmbulanceDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceLocationUpdateDto;
import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.ambulanceService.repository.AmbulanceRepository;
import com.REACT.backend.ambulanceService.service.AmbulanceLocationService;
import com.REACT.backend.common.exception.ResourceNotFoundException;
import com.REACT.backend.common.util.LocationUtils;
import com.REACT.backend.locationService.model.LocationBroadcastDto;
import com.REACT.backend.locationService.model.UnitType;
import com.REACT.backend.locationService.service.LocationBroadcastService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class AmbulanceLocationServiceImplementation implements AmbulanceLocationService {

    private final AmbulanceRepository ambulanceRepositoryRepo;
    private final LocationUtils locationUtils;
    private final LocationBroadcastService broadcastService;

    @Override
    @Transactional
    public void updateLocation(AmbulanceLocationUpdateDto dto) {
        if (dto == null || dto.getAmbulanceId() == null) {
            log.error("Invalid DTO: {}", dto);
            throw new IllegalArgumentException("Ambulance ID must not be null.");
        }

        log.info("Received location update for Ambulance ID: {}, lat: {}, long: {}",
                dto.getAmbulanceId(),
                Objects.toString(dto.getLatitude(), "null"),
                Objects.toString(dto.getLongitude(), "null"));


        AmbulanceEntity entity = ambulanceRepositoryRepo.findById(dto.getAmbulanceId())
                .orElseThrow(() -> {
                    log.warn("Ambulance ID {} not found in DB", dto.getAmbulanceId());
                    return new ResourceNotFoundException("Ambulance not found with ID: " + dto.getAmbulanceId());
                });

        entity.setLocation(locationUtils.createPoint(dto.getLongitude(), dto.getLatitude()));
        ambulanceRepositoryRepo.save(entity);
        log.debug("Updated location in DB for Ambulance ID: {}", entity.getId());

        LocationBroadcastDto broadcastDto = new LocationBroadcastDto(
                entity.getId(),
                UnitType.AMBULANCE,
                dto.getLongitude(),
                dto.getLatitude()
        );

        broadcastService.broadcastLocation(broadcastDto);
        log.info("Broadcasted location for Ambulance ID: {}", entity.getId());
    }

    public AmbulanceDto getAmbulanceById(Long id) {
        if (id == null) {
            log.error("Null ID passed to getAmbulanceById()");
            throw new IllegalArgumentException("Ambulance ID cannot be null");
        }

        log.info("Fetching ambulance with ID: {}", id);

        AmbulanceEntity entity = ambulanceRepositoryRepo.findById(id)
                .orElseThrow(() -> {
                    log.warn("No ambulance found with ID: {}", id);
                    return new ResourceNotFoundException("Ambulance not found with ID: " + id);
                });

        log.debug("Returning DTO for Ambulance ID: {}", entity.getId());
        return new AmbulanceDto(entity);
    }
}
