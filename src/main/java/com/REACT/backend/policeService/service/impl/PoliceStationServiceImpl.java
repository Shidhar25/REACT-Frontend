package com.REACT.backend.policeService.service.impl;

import com.REACT.backend.policeService.dto.PoliceStationDto;
import com.REACT.backend.policeService.model.PoliceStationEntity;
import com.REACT.backend.policeService.repository.PoliceStationRepository;
import com.REACT.backend.policeService.service.PoliceStationService;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PoliceStationServiceImpl implements PoliceStationService {

    private final PoliceStationRepository policeStationRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Override
    public PoliceStationDto addPoliceStation(PoliceStationDto dto) {
        Point location = geometryFactory.createPoint(new Coordinate(dto.getLongitude(), dto.getLatitude()));

        PoliceStationEntity entity = PoliceStationEntity.builder()
                .stationName(dto.getStationName())
                .location(location)
                .availableOfficers(dto.getAvailableOfficers())
                .build();

        PoliceStationEntity saved = policeStationRepository.save(entity);

        dto.setId(saved.getId()); // ensure saved ID is returned
        return dto;
    }
}