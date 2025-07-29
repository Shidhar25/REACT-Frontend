package com.REACT.backend.ambulanceService.controller;

import com.REACT.backend.ambulanceService.dto.AmbulanceBookingHistoryResponseDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceDriverProfileDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceLocationUpdateDto;
import com.REACT.backend.ambulanceService.dto.LocationUpdateByDriver;
import com.REACT.backend.common.dto.CompleteAssignmentResponseDto;
import com.REACT.backend.ambulanceService.service.AmbulanceService;
import com.REACT.backend.ambulanceService.service.impl.AmbulanceDriverServiceImpl;
import com.REACT.backend.common.dto.LocationDto;
import com.REACT.backend.common.util.LoggedUserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/ambulance-driver/v1")
public class AmbulanceDriverController {

    private final AmbulanceDriverServiceImpl service;
    private final LoggedUserUtil loggedUserUtil;
    private final AmbulanceService ambulanceService;


    /**
     * get history of an ambulance
     * @return Ambulannce Booking History Dto's
     */
    @GetMapping("/get-history")
    @PreAuthorize("hasAuthority('AMBULANCE_DRIVER') or hasAuthority('AMBULANCE_ADMIN')")
    public ResponseEntity<List<AmbulanceBookingHistoryResponseDto>> getHistory(){
        log.info("Request for all history of ambulance fetched");
        Object driver = loggedUserUtil.getCurrentLoggedUserDetails();
        List<AmbulanceBookingHistoryResponseDto> response = service.getAllHistory(driver);
        return ResponseEntity.ok(response);
    }

    /**
     * to get location of current booking
     * @return lo
     */

    @GetMapping("/get/current-request/location")
    @PreAuthorize("hasAuthority('AMBULANCE_DRIVER')")
    public ResponseEntity<LocationDto> getBookingLocation(){
        log.info("Location fetched request for ");
        Object driver = loggedUserUtil.getCurrentLoggedUserDetails();
        LocationDto response= service.getLocationOfCurrentBooking(driver);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/complete-booking")
    @PreAuthorize(("hasAuthority('AMBULANCE_DRIVER')"))
    public ResponseEntity<CompleteAssignmentResponseDto> completeBooking(){
        log.info("Status update to COMPLETE request fetched:");
        Object driver = loggedUserUtil.getCurrentLoggedUserDetails();
        return ResponseEntity.ok(service.completeBooking(driver));
    }



    @GetMapping("/me")
    @PreAuthorize(("hasAuthority('AMBULANCE_DRIVER')"))
    public ResponseEntity<AmbulanceDriverProfileDto> getMe(){
        log.info("Getting details of logged user");
        return ResponseEntity.ok(service.getMe());
    }

    @PatchMapping("/update-location")
    @PreAuthorize(("hasAuthority('AMBULANCE_DRIVER')"))
    public ResponseEntity<String> updateLoc(@RequestBody LocationUpdateByDriver dto){
        log.info("Update location request fetched for current ambulance");
        return ResponseEntity.ok(service.updateLocation(dto));
    }

}
