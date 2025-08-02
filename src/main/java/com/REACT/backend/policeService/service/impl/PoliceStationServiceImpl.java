package com.REACT.backend.policeService.service.impl;

import com.REACT.backend.common.exception.ResourceNotFoundException;
import com.REACT.backend.policeService.dto.PoliceStationDto;
import com.REACT.backend.policeService.model.PoliceStationEntity;
import com.REACT.backend.policeService.repository.PoliceStationRepository;
import com.REACT.backend.policeService.service.PoliceStationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PoliceStationServiceImpl implements PoliceStationService {

    private final PoliceStationRepository policeStationRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Override
    public PoliceStationDto addPoliceStation(PoliceStationDto dto) {
        log.info("Add police station request fetched");
        Point location = geometryFactory.createPoint(new Coordinate(dto.getLongitude(), dto.getLatitude()));
        log.info("coordinates converted into point");
        PoliceStationEntity entity = PoliceStationEntity.builder()
                .stationName(dto.getStationName())
                .location(location)
                .availableOfficers(dto.getAvailableOfficers())
                .build();

        PoliceStationEntity saved = policeStationRepository.save(entity);
        log.info("Police Station created");
        dto.setId(saved.getId()); // ensure saved ID is returned
        return dto;
    }

    @Override
    public List<PoliceStationDto> getAll() {
        log.info("Request fetched to get all stations");
        List<PoliceStationEntity> entityList = policeStationRepository.findAll();
        log.debug("All police stations fetched");
        List<PoliceStationDto> dto = new ArrayList<>();
        for(PoliceStationEntity entity: entityList){
            PoliceStationDto temp = PoliceStationDto.builder()
                    .id(entity.getId())
                    .longitude(entity.getLocation().getX())
                    .latitude(entity.getLocation().getY())
                    .availableOfficers(entity.getAvailableOfficers())
                    .stationName(entity.getStationName())
                    .build();
            log.debug("Police station {} entity converted to dto",entity.getStationName());
            dto.add(temp);
            log.debug("Police station {} dto saved",entity.getStationName());
        }
        log.debug("Police station dto of size {} is ready",dto.size());
        return dto;
    }

    @Override
    public PoliceStationDto getStation(Long stationId) {
        log.info("Searching for police stationId {}",stationId);
        PoliceStationEntity entity = policeStationRepository.findById(stationId)
                .orElseThrow(()-> new ResourceNotFoundException("No such Station exist"));
        log.info("Found police station {}",entity.getStationName());
        PoliceStationDto temp = PoliceStationDto.builder()
                .id(entity.getId())
                .longitude(entity.getLocation().getX())
                .latitude(entity.getLocation().getY())
                .availableOfficers(entity.getAvailableOfficers())
                .stationName(entity.getStationName())
                .build();
        log.info("Police station dto returned");
        return temp;
    }
}