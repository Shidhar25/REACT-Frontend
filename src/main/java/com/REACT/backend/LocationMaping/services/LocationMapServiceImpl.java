package com.REACT.backend.LocationMaping.services;

import com.REACT.backend.LocationMaping.dto.LocationMapDto;
import com.REACT.backend.LocationMaping.repository.LocationMapRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LocationMapServiceImpl implements LocationMapService {

    private final LocationMapRepository repository;

    @Override
    public LocationMapDto getLocationMap(Long emergencyRequestId) {
        Object[] row = repository.findLocationsByEmergencyRequestId(emergencyRequestId);

        if (row == null) throw new RuntimeException("No mapping found for emergency_request_id: " + emergencyRequestId);

        LocationMapDto.EmergencyRequestLocation er = LocationMapDto.EmergencyRequestLocation.builder()
                .id(((Number) row[0]).longValue())
                .latitude(((Number) row[1]).doubleValue())
                .longitude(((Number) row[2]).doubleValue())
                .build();

        LocationMapDto.AmbulanceLocation amb = LocationMapDto.AmbulanceLocation.builder()
                .id(((Number) row[3]).longValue())
                .latitude(((Number) row[4]).doubleValue())
                .longitude(((Number) row[5]).doubleValue())
                .build();

        return LocationMapDto.builder()
                .emergencyRequest(er)
                .ambulance(amb)
                .build();
    }
}
