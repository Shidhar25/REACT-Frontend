package com.REACT.backend.LocationMaping.services;

import com.REACT.backend.LocationMaping.dto.FireTruckLocationMapDto;
import com.REACT.backend.LocationMaping.repository.FireTruckLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FireTruckLocationService {
    private final FireTruckLocationRepository repository;

    public FireTruckLocationMapDto getLocation(Long emergencyRequestId) {
        Object[] row = repository.findLocations(emergencyRequestId);

        if (row == null) throw new RuntimeException("No mapping found for emergency_request_id: " + emergencyRequestId);

        FireTruckLocationMapDto.EmergencyRequestLocation er = FireTruckLocationMapDto.EmergencyRequestLocation.builder()
                .id(((Number) row[0]).longValue())
                .latitude(((Number) row[1]).doubleValue())
                .longitude(((Number) row[2]).doubleValue())
                .build();

        FireTruckLocationMapDto.FireTruckLocation ft = FireTruckLocationMapDto.FireTruckLocation.builder()
                .id(((Number) row[3]).longValue())
                .latitude(((Number) row[4]).doubleValue())
                .longitude(((Number) row[5]).doubleValue())
                .build();

        return FireTruckLocationMapDto.builder()
                .emergencyRequest(er)
                .fireTruck(ft)
                .build();
    }
}
