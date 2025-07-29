package com.REACT.backend.ambulanceService.controller;

import com.REACT.backend.ambulanceService.dto.AmbulanceDriverProfileDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceLocationUpdateDto;
import com.REACT.backend.ambulanceService.service.AmbulanceService;
import com.REACT.backend.ambulanceService.service.impl.AmbulanceLocationServiceImplementation;
import com.REACT.backend.ambulanceService.service.impl.AmbulanceServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@Validated

@RequestMapping("/ambulance/location")
@RequiredArgsConstructor

public class AmbulanceController {

    @Autowired
    AmbulanceLocationServiceImplementation ambulanceLocationServiceImplementation;

    @Autowired
    private final AmbulanceServiceImpl ambulanceService;

    /**
     * Update ambulance location - for admin if location of ambulance needs to be updated manually
     * @param dto Location update dto
     * @return Response String
     */

    @PostMapping("/update-location")
    @PreAuthorize("hasAuthority('AMBULANCE_ADMIN')")
    public ResponseEntity<String> updateAmbulanceLocation(@Valid @RequestBody AmbulanceLocationUpdateDto dto) {
        log.info("Location update request fetched for ambulance {}",dto.getAmbulanceId());
        ambulanceLocationServiceImplementation.updateLocation(dto);
        return ResponseEntity.ok("Location updated and broadcasted");
    }


    /**
     * Get ambulance by id
     * @param id ambulance id
     * @return ambulance dto
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('AMBULANCE_DRIVER') or hasAuthority('AMBULANCE_ADMIN')")
    public ResponseEntity<AmbulanceDto> getAmbulance(@PathVariable Long id) {
        log.info("Get Request fetched for ambulance");
        AmbulanceDto dto = ambulanceLocationServiceImplementation.getAmbulanceById(id);
        return ResponseEntity.ok(dto);
    }






}
