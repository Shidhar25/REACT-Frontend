package com.REACT.backend.fireService.controller;

import com.REACT.backend.fireService.dto.FireStationDto;
import com.REACT.backend.fireService.service.impl.FireStationServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fire/station")
@Validated

public class FireStationController {
    @Autowired
    private final FireStationServiceImpl fireStationService;

    @PostMapping("/add")
    public ResponseEntity<FireStationDto> addFireStation(@Valid @RequestBody FireStationDto fireStationDto) {
        FireStationDto savedStation = fireStationService.addFireStation(fireStationDto);
        return ResponseEntity.ok(savedStation);
    }
}