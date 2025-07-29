package com.REACT.backend.fireService.controller;

import com.REACT.backend.ambulanceService.dto.AmbulanceDriverProfileDto;
import com.REACT.backend.fireService.dto.*;
import com.REACT.backend.fireService.service.FireAdminService;
import com.REACT.backend.fireService.service.impl.FireServiceImpl;
import com.REACT.backend.fireService.service.impl.FireStationServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Validated

@RequestMapping("/fire/admin")
@Slf4j
public class FireAdminController {

    private final FireAdminService fireAdminService;

    private final FireStationServiceImpl fireStationServiceImpl;

    private final FireServiceImpl fireService;

    // Get all trucks of a fire station
    @GetMapping("/station/{stationId}/trucks")
    @PreAuthorize("hasAuthority('FIRE_STATION_ADMIN')")
    public ResponseEntity<List<FireTruckDto>> getTrucksByStation(@Valid @PathVariable Long stationId) {
        log.info("Trucks by station requested by {}",stationId);
        return ResponseEntity.ok(fireAdminService.getTrucksByStation(stationId));
    }

    //  Get booking history of a fire station
    @PreAuthorize("hasAuthority('FIRE_STATION_ADMIN')")
    @GetMapping("/station/{stationId}/history")
    public ResponseEntity<?> getStationHistory(@Valid @PathVariable Long stationId) {
        log.info("Station History for station {}",stationId);
        return ResponseEntity.ok(fireAdminService.getBookingHistoryByStation(stationId));
    }

    // Get booking history of a fire truck
    @GetMapping("/truck/{truckId}/history")
    @PreAuthorize("hasAuthority('FIRE_DRIVER') or hasAuthority('FIRE_STATION_ADMIN')")
    public ResponseEntity<?> getTruckHistory(@Valid @PathVariable Long truckId) {
        log.info("Truck history for truck {} requested ",truckId);
        return ResponseEntity.ok(fireAdminService.getBookingHistoryByTruck(truckId));
    }


    //update location

    @PostMapping("/update-location")
    @PreAuthorize("hasAuthority('FIRE_STATION_ADMIN')")
    public ResponseEntity<String> updateLocation(@Valid @RequestBody FireTruckLocationUpdateDto  dto ){
        log.info("Update location request fetched for fire truck {}",dto.getTruckId());
        return ResponseEntity.ok(fireAdminService.updateLocation(dto));
    }


    //get profile
    /**
     * Get pofile of an ambulance driver by ambulance-id
     * @param truckId
     * @return truckDriver profile dto;
     */

    @GetMapping("/profile/{truckId}")
    @PreAuthorize("hasAuthority('FIRE_DRIVER') or hasAuthority('FIRE_STATION_ADMIN')")
    public ResponseEntity<FireTruckDriverProfileDto> getProfile(@Valid @PathVariable Long truckId){
        log.info("Get profile request fetched for truckId={}",truckId);
        return ResponseEntity.ok(fireService.getProfile(truckId));
    }


    @GetMapping("/getAll/fireStation")
    @PreAuthorize("hasAuthority('FIRE_STATION_ADMIN')")
    public ResponseEntity<List<FireStationResponseDto>> getAllStation(){
        log.info("Requesting all stations from DB");
        return ResponseEntity.ok(fireStationServiceImpl.getAllFireStations());

    }

    @GetMapping("/get/fire-station/{stationId}")
    @PreAuthorize("hasAuthority('FIRE_STATION_ADMIN')")
    public ResponseEntity<FireStationResponseDto> getStation(@Valid @PathVariable Long stationId){
        log.info("Get station request fetched for fire station {}",stationId);
        return ResponseEntity.ok(fireStationServiceImpl.getStation(stationId));
    }

    @GetMapping("/get/all-trucks")
    @PreAuthorize("hasAuthority('FIRE_STATION_ADMIN')")
    public ResponseEntity<List<FireTruckDto>> getAllTrucks(){
        log.info("Fetching all fire trucks");
        return ResponseEntity.ok(fireStationServiceImpl.getAllTrucks());
    }


    @GetMapping("get/truck/{id}")
    @PreAuthorize("hasAuthority('FIRE_STATION_ADMIN') or hasAuthority('FIRE_DRIVER')")
    public ResponseEntity<FireTruckDto> getTruck(@Valid @PathVariable Long id){
        log.info("Fetching fire truck {}",id);
        return ResponseEntity.ok(fireStationServiceImpl.getTruck(id));
    }

}
