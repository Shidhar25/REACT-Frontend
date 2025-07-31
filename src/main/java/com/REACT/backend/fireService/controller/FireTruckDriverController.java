package com.REACT.backend.fireService.controller;


import com.REACT.backend.ambulanceService.dto.AmbulanceDriverProfileDto;
import com.REACT.backend.ambulanceService.dto.LocationUpdateByDriver;
import com.REACT.backend.booking.dto.BookingDto;
import com.REACT.backend.common.dto.CompleteAssignmentResponseDto;
import com.REACT.backend.common.dto.LocationDto;
import com.REACT.backend.common.util.LoggedUserUtil;
import com.REACT.backend.fireService.dto.FireTruckDriverProfileDto;
import com.REACT.backend.fireService.dto.FireTruckHistoryResponseDto;
import com.REACT.backend.fireService.dto.FireTruckLocationUpdateDto;
import com.REACT.backend.fireService.service.FireService;
import com.REACT.backend.fireService.service.impl.FireServiceImpl;
import com.REACT.backend.fireService.service.impl.FireTruckLocationUpdateServiceImplementation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@Validated

@RequestMapping("/fire/truck-driver/v1")
@RequiredArgsConstructor
public class FireTruckDriverController {

    @Autowired
    private final FireTruckLocationUpdateServiceImplementation fireTruckLocationUpdateServiceImplementation;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private final LoggedUserUtil loggedUserUtil;

    @Autowired
    private final FireServiceImpl fireService;

    @PostMapping("/update-location")
    @PreAuthorize("hasAuthority('FIRE_DRIVER')")
    public ResponseEntity<String> updateLocation(@Valid @RequestBody FireTruckLocationUpdateDto dto) {
        fireTruckLocationUpdateServiceImplementation.updateLocation(dto);
        log.info("Location update request fetched for fire truck {}",dto.getTruckId());
        messagingTemplate.convertAndSend("/topic/location", dto);
        return ResponseEntity.ok("Location updated and broadcasted");
    }

    @GetMapping("/current-request")
    @PreAuthorize("hasAuthority('FIRE_DRIVER') or hasAuthority('FIRE_STATION_ADMIN')")
    public ResponseEntity<LocationDto> getBookingLocation(){
        log.info("Location fetched request for ");
        Object driver = loggedUserUtil.getCurrentLoggedUserDetails();
        LocationDto response= fireService.getLocationOfCurrentBooking(driver);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/complete-booking")
    @PreAuthorize("hasAuthority('FIRE_DRIVER') or hasAuthority('FIRE_STATION_ADMIN')")
    public ResponseEntity<CompleteAssignmentResponseDto> completeBooking(){
        log.info("Status update COMPLETE request fetched:");
        Object driver = loggedUserUtil.getCurrentLoggedUserDetails();
        return ResponseEntity.ok(fireService.completeBooking(driver));
    }


    @GetMapping("/me")
    @PreAuthorize(("hasAuthority('FIRE_DRIVER')"))
    public ResponseEntity<FireTruckDriverProfileDto> getMe(){
        log.info("Getting details of logged user");
        return ResponseEntity.ok(fireService.getMe());
    }

    @PatchMapping("/update-location")
    public ResponseEntity<String> updateLocation(@RequestBody LocationUpdateByDriver dto){
        log.info("Location chnage request fetched for the current user");

        return ResponseEntity.ok(fireService.updateLocation(dto));
    }

    @GetMapping("/get-History/{vehicleRegNumber}")
    public ResponseEntity<List<FireTruckHistoryResponseDto>> getHistory(@PathVariable String vehicleRegNumber) {
        log.info("Fire Truck function is called");
        return ResponseEntity.ok(fireService.fireTruckHistory(vehicleRegNumber));
    }








}
