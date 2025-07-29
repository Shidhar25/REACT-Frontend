package com.REACT.backend.fireService.service;

import com.REACT.backend.fireService.dto.FireStationDto;
import com.REACT.backend.fireService.dto.FireStationResponseDto;
import com.REACT.backend.fireService.dto.FireTruckDto;

import java.util.List;

public interface FireStationService {
    FireStationDto addFireStation(FireStationDto dto);

    List<FireStationResponseDto> getAllFireStations();

    FireStationResponseDto getStation(Long stationId);

    FireTruckDto getTruck(Long id);

    List<FireTruckDto> getAllTrucks();

}