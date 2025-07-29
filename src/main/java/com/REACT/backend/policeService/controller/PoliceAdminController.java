package com.REACT.backend.policeService.controller;

import com.REACT.backend.booking.dto.BookingDto;
import com.REACT.backend.common.dto.LocationDto;
import com.REACT.backend.policeService.dto.PoliceOfficerResponseDto;
import com.REACT.backend.policeService.service.PoliceAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/police/admin")
public class PoliceAdminController {

    private final PoliceAdminService policeAdminService;

    /**
     * Get all booking history for a police station
     * @param stationId - ID of the police station
     * @return List of booking history
     */
    @GetMapping("/station/{stationId}/history")
    @PreAuthorize("hasAuthority('POLICE_STATION_ADMIN')")
    public ResponseEntity<List<BookingDto>> getStationHistory(@PathVariable Long stationId) {
        log.info("Fetching booking history for police station ID: {}", stationId);
        List<BookingDto> history = policeAdminService.getBookingHistoryByStation(stationId);
        return ResponseEntity.ok(history);
    }

    /**
     * Get location details of an emergency request by ID
     * @param requestId - ID of the emergency request
     * @return Location details of the request
     */
    @GetMapping("/request/{requestId}/location")
    public ResponseEntity<LocationDto> getRequestLocation(@PathVariable Long requestId) {
        log.info("Fetching location for emergency request ID: {}", requestId);
        LocationDto location = policeAdminService.getRequestLocation(requestId);
        return ResponseEntity.ok(location);
    }



    //officers by station

    @GetMapping("/station/officers/{stationId}")
    @PreAuthorize("hasAuthority('POLICE_STATION_ADMIN')")
    public ResponseEntity<List<PoliceOfficerResponseDto>> getAllOfficersByStation(@Valid @PathVariable Long stationId){
        log.info("fetched request to fetched all police officers of stations");
        return ResponseEntity.ok(policeAdminService.getAllOfficersOfStation(stationId));
    }


    // all police officers
    @GetMapping("/station/officers")
    @PreAuthorize("hasAuthority('POLICE_STATION_ADMIN')")
    public ResponseEntity<List<PoliceOfficerResponseDto>> getAllOfficers(){
        log.info("fetched request to fetched all police officers");
        return ResponseEntity.ok(policeAdminService.getAllOfficers());
    }

    // get officer by id

    @GetMapping("/station/officer/{id}")
    @PreAuthorize("hasAuthority('POLICE_STATION_ADMIN') or hasAuthority('POLICE_OFFICER')")
    public ResponseEntity<PoliceOfficerResponseDto> getOfficer(@Valid @PathVariable Long id){
        log.info("fetched request to fetched police officer");
        return ResponseEntity.ok(policeAdminService.getOfficer(id));
    }


    //
}
