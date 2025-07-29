package com.REACT.backend.ambulanceService.controller;

import com.REACT.backend.ambulanceService.dto.AmbulanceBookingHistoryResponseDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceDriverProfileDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceDto;
import com.REACT.backend.ambulanceService.service.AmbulanceService;
import com.REACT.backend.ambulanceService.service.impl.AmbulanceLocationServiceImplementation;
import com.REACT.backend.ambulanceService.service.impl.AmbulanceServiceImpl;
import com.REACT.backend.common.dto.LocationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@Slf4j
@RestController
@Validated

@RequestMapping("/ambulance")
@RequiredArgsConstructor

public class AmbulanceAdminController
{
   private final AmbulanceLocationServiceImplementation ambulanceLocationServiceImplementation;
    private final AmbulanceServiceImpl service;

    @Autowired
    private final AmbulanceService ambulanceService;

    /**
     * get all ambulances
     * @return List of ambulance Dto's
     */
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('AMBULANCE_ADMIN')")
    public ResponseEntity<List<AmbulanceDto>> getAllAmbulances() {
        return ResponseEntity.ok(ambulanceService.getAllAmbulances());
    }

    /**
     * get particular ambulance By id
     * @param id
     * @return ambulance dto
     */

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('AMBULANCE_ADMIN')")
    public ResponseEntity<AmbulanceDto> getAmbulanceById(@PathVariable Long id) {
        return ResponseEntity.ok(ambulanceService.getAmbulanceById(id));
    }

    /**
     *  get all ambulances associated to the hospital
     * @param hospitalId
     * @return list of ambulance dto's
     */

    @GetMapping("/by-hospital/{hospitalId}")
    @PreAuthorize("hasAuthority('AMBULANCE_ADMIN')")
    public ResponseEntity<List<AmbulanceDto>> getAmbulancesByHospital(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(ambulanceService.getAmbulancesByHospitalId(hospitalId));
    }


    /**
     * gets history of an ambulance
     * @return
     */
    @GetMapping("/get-history/{ambulanceId}")
    @PreAuthorize("hasAuthority('AMBULANCE_ADMIN')")
    public ResponseEntity<List<AmbulanceBookingHistoryResponseDto>> getHistory(@PathVariable Long ambulanceId){
        log.info("Request for all history of ambulance id={} fetched by admin.",ambulanceId);
        return ResponseEntity.ok(service.getHistoryOfAmbulance(ambulanceId));

    }

    /**
     * Get pofile of an ambulance driver by ambulance-id
     * @param ambulanceId
     * @return ambulance profile dto;
     */

    @GetMapping("/profile/{ambulanceId}")
    @PreAuthorize("hasAuthority('AMBULANCE_DRIVER') or hasAuthority('AMBULANCE_ADMIN')")
    public ResponseEntity<AmbulanceDriverProfileDto> getProfile(@PathVariable Long ambulanceId){
        log.info("Get profile request fetched for ambulanceId={}",ambulanceId);
        return ResponseEntity.ok(ambulanceService.getProfile(ambulanceId));
    }


}