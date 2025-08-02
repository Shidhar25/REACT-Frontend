package com.REACT.backend.policeService.controller;

import com.REACT.backend.common.dto.CompleteAssignmentResponseDto;
import com.REACT.backend.common.dto.LocationDto;
import com.REACT.backend.common.util.LoggedUserUtil;
import com.REACT.backend.fireService.dto.FireTruckDriverProfileDto;
import com.REACT.backend.policeService.dto.PoliceOfficerResponseDto;
import com.REACT.backend.policeService.service.PoliceOfficerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/police-officer/v1")
public class PoliceOfficerController {

    private final PoliceOfficerService policeOfficerService;
    private final LoggedUserUtil loggedUserUtil;

    /**
     * Get location details of current emergency request assigned to the officer
     * @return Location details of the current request
     */
    @GetMapping("/current-request/location")

    public ResponseEntity<LocationDto> getCurrentRequestLocation() {
        log.info("Location fetch request for current police assignment");
        Object officer = loggedUserUtil.getCurrentLoggedUserDetails();
        LocationDto location = policeOfficerService.getLocationOfCurrentBooking(officer);
        return ResponseEntity.ok(location);
    }

    /**
     * Mark the current police assignment as completed
     * @return Assignment completion details
     */
    @PatchMapping("/complete-assignment")
    public ResponseEntity<CompleteAssignmentResponseDto> completeAssignment() {
        log.info("Complete assignment request received from police officer");
        Object officer = loggedUserUtil.getCurrentLoggedUserDetails();
        CompleteAssignmentResponseDto response = policeOfficerService.completeAssignment(officer);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all emergency requests history for this police officer
     * @return List of assignment history
     */
    @GetMapping("/assignment-history")

    public ResponseEntity<?> getAssignmentHistory() {
        log.info("Assignment history request received from police officer");
        Object officer = loggedUserUtil.getCurrentLoggedUserDetails();
        // This can be implemented later when you need detailed history
        return ResponseEntity.ok("Assignment history - to be implemented");
    }

    @GetMapping("/me")
    @PreAuthorize(("hasAuthority('POLICE_OFFICER') or hasAuthority('POLICE_STATION_ADMIN')"))
    public ResponseEntity<PoliceOfficerResponseDto> getMe(){
        log.info("Getting details of logged user");
        return ResponseEntity.ok(policeOfficerService.getMe());
    }
}
