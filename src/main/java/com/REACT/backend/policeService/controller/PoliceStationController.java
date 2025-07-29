package com.REACT.backend.policeService.controller;

import com.REACT.backend.policeService.dto.PoliceStationDto;
import com.REACT.backend.policeService.service.PoliceStationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/police/station")
public class PoliceStationController {

    private final PoliceStationService policeStationService;

    @PostMapping("/add")
    public ResponseEntity<PoliceStationDto> addPoliceStation(@RequestBody PoliceStationDto dto) {
        PoliceStationDto saved = policeStationService.addPoliceStation(dto);
        return ResponseEntity.ok(saved);
    }

    
}