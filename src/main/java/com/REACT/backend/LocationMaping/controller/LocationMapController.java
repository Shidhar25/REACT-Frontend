package com.REACT.backend.LocationMaping.controller;

import com.REACT.backend.LocationMaping.dto.FireTruckLocationMapDto;
import com.REACT.backend.LocationMaping.dto.LocationMapDto;
import com.REACT.backend.LocationMaping.services.FireTruckLocationService;
import com.REACT.backend.LocationMaping.services.LocationMapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/location-map")
@RequiredArgsConstructor
public class LocationMapController {

    private final LocationMapService service;
    private final FireTruckLocationService fireTruckService;
    @GetMapping("ambulance/{emergencyRequestId}")
    public ResponseEntity<LocationMapDto> getLocationMap(@PathVariable Long emergencyRequestId) {
        LocationMapDto dto = service.getLocationMap(emergencyRequestId);
        return ResponseEntity.ok(dto);
    }
    @GetMapping("/fire_truck/{emergencyRequestId}")
    public ResponseEntity<FireTruckLocationMapDto> getFireTruckMap(@PathVariable Long emergencyRequestId) {
        FireTruckLocationMapDto dto = fireTruckService.getLocation(emergencyRequestId);
        return ResponseEntity.ok(dto);
    }


}
