package com.REACT.backend.fireService.service.impl;
import com.REACT.backend.common.exception.ResourceNotFoundException;
import com.REACT.backend.fireService.dto.FireStationDto;
import com.REACT.backend.fireService.dto.FireStationResponseDto;
import com.REACT.backend.fireService.dto.FireTruckDto;
import com.REACT.backend.fireService.model.FireStationEntity;
import com.REACT.backend.fireService.model.FireTruckEntity;
import com.REACT.backend.fireService.repository.FireStationRepository;
import com.REACT.backend.fireService.repository.FireTruckRepository;
import com.REACT.backend.fireService.service.FireStationService;
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
public class FireStationServiceImpl implements FireStationService {

    private final FireStationRepository fireStationRepository;
    private final FireTruckRepository fireTruckRepository;

    private final GeometryFactory geometryFactory = new GeometryFactory(); // reuse this

    @Override
    public FireStationDto addFireStation(FireStationDto dto) {

        log.info("Request for add fire station fetched");
        Point location = geometryFactory.createPoint(new Coordinate(dto.getLongitude(), dto.getLatitude()));
        log.info("latitude and longitude converted into point {}",location.toString());
        FireStationEntity entity = FireStationEntity.builder()
                .stationName(dto.getName())
                .location(location)
                .build();

        log.info("Fire station created with for location {}",location.toString());
        FireStationEntity saved = fireStationRepository.save(entity);
        log.info("Fire Station saved in DB with id {}",saved.getId());
        return dto;
    }

    @Override
    public List<FireStationResponseDto> getAllFireStations() {
        log.info("Fetching all fire stations from DB");
        List<FireStationEntity> stations = fireStationRepository.findAll();

        return stations.stream().map(station -> FireStationResponseDto.builder()
                .id(station.getId())
                .fireStationName(station.getStationName())
                .latitude(station.getLocation().getY())  // Y = latitude
                .longitude(station.getLocation().getX()) // X = longitude
                .build()
        ).toList();
    }

    @Override
    public FireStationResponseDto getStation(Long stationId) {
        log.info("Fetching fire station details:");
        FireStationEntity station = fireStationRepository.findById(stationId)
                .orElseThrow(()-> new ResourceNotFoundException("No such station exist"));
        return FireStationResponseDto.builder()
                .fireStationName(station.getStationName())
                .id(stationId)
                .longitude(station.getLocation().getX())
                .latitude(station.getLocation().getY())
                .build();
    }

    @Override
    public FireTruckDto getTruck(Long id) {
        log.info("Request fetched for get truck id {}",id);
        FireTruckEntity entity= fireTruckRepository.findByFireTruckId(id)
                .orElseThrow(()-> new ResourceNotFoundException("No such truck with id exist"));

        FireTruckDto dto = new FireTruckDto(entity);

        return dto;
    }

    @Override
    public List<FireTruckDto> getAllTrucks() {
        log.info("Request received for fetching all the fire trucks");

        List<FireTruckEntity> trucks = fireTruckRepository.findAll();
        List<FireTruckDto> dtos  = new ArrayList<>();
        for(FireTruckEntity entity: trucks){
            dtos.add(new FireTruckDto(entity));
        }
        return dtos;
    }


}