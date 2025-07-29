package com.REACT.backend.booking.controller;

import com.REACT.backend.booking.dto.BookingRequestDto;
import com.REACT.backend.booking.dto.BookingResponseDto;
import com.REACT.backend.booking.dto.BookingDto;
import com.REACT.backend.booking.service.BookingServiceImpl;
import com.REACT.backend.users.AppUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingServiceImpl bookingService;

    @PostMapping("/request")
    public ResponseEntity<BookingResponseDto> handleBooking(@RequestBody BookingRequestDto requestDto) {
        // 🔒 Get currently authenticated user

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AppUser user = (AppUser) authentication.getPrincipal(); // Cast it to your AppUser

        log.info("Booking request fetched from user with email: {}",user.getUserEmail());
        BookingResponseDto response = bookingService.createBooking(requestDto, user.getUserId());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<BookingDto>> getAllBookings() {
        log.info("Request received to fetch all bookings");
        
        try {
            List<BookingDto> allBookings = bookingService.getAllBookings();
            log.info("Successfully retrieved {} bookings", allBookings.size());
            return ResponseEntity.ok(allBookings);
        } catch (Exception e) {
            log.error("Error fetching all bookings", e);
            throw e;
        }
    }

    @GetMapping("/ambulance")
    public ResponseEntity<List<BookingDto>> getAmbulanceBookings() {
        log.info("Request received to fetch ambulance service bookings");
        
        try {
            List<BookingDto> ambulanceBookings = bookingService.getAmbulanceBookings();
            log.info("Successfully retrieved {} ambulance bookings", ambulanceBookings.size());
            return ResponseEntity.ok(ambulanceBookings);
        } catch (Exception e) {
            log.error("Error fetching ambulance bookings", e);
            throw e;
        }
    }

    @GetMapping("/fire")
    public ResponseEntity<List<BookingDto>> getFireServiceBookings() {
        log.info("Request received to fetch fire service bookings");
        
        try {
            List<BookingDto> fireBookings = bookingService.getFireServiceBookings();
            log.info("Successfully retrieved {} fire service bookings", fireBookings.size());
            return ResponseEntity.ok(fireBookings);
        } catch (Exception e) {
            log.error("Error fetching fire service bookings", e);
            throw e;
        }
    }

    @GetMapping("/police")
    public ResponseEntity<List<BookingDto>> getPoliceServiceBookings() {
        log.info("Request received to fetch police service bookings");
        
        try {
            List<BookingDto> policeBookings = bookingService.getPoliceServiceBookings();
            log.info("Successfully retrieved {} police service bookings", policeBookings.size());
            return ResponseEntity.ok(policeBookings);
        } catch (Exception e) {
            log.error("Error fetching police service bookings", e);
            throw e;
        }
    }

}

