package com.REACT.backend.policeService.controller;

import com.REACT.backend.policeService.dto.PoliceStationDto;
import com.REACT.backend.policeService.service.PoliceStationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/police/station")
public class PoliceStationController {

    private final PoliceStationService policeStationService;

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('POLICE_STATION_ADMIN')")
    public ResponseEntity<PoliceStationDto> addPoliceStation(@RequestBody PoliceStationDto dto) {
        PoliceStationDto saved = policeStationService.addPoliceStation(dto);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('POLICE_STATION_ADMIN') or hasAuthority('POLICE_OFFICER')")
    public ResponseEntity<List<PoliceStationDto>> getPoliceStations(){
        List<PoliceStationDto> dto = policeStationService.getAll();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{stationId}")
    public ResponseEntity<PoliceStationDto> getStation(@PathVariable Long stationId){
        PoliceStationDto dto = policeStationService.getStation(stationId);
        return ResponseEntity.ok(dto);
    }

    
}