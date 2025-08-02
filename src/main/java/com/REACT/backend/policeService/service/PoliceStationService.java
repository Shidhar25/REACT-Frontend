package com.REACT.backend.policeService.service;

import com.REACT.backend.policeService.dto.PoliceStationDto;

import java.util.List;

public interface PoliceStationService {
    PoliceStationDto addPoliceStation(PoliceStationDto dto);
    List<PoliceStationDto> getAll();
    PoliceStationDto getStation(Long stationId);
}