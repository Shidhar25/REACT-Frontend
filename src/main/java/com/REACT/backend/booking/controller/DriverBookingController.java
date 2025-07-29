package com.REACT.backend.booking.controller;

import com.REACT.backend.booking.dto.BookingDto;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.service.BookingServiceImpl;
import com.REACT.backend.booking.service.DriverBookingServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/driver")
@RequiredArgsConstructor
public class DriverBookingController {

//    private final DriverBookingServiceImpl driverBookingService;
//
//    @PostMapping("/booking/accept")
//    public ResponseEntity<String> acceptBooking(@RequestParam Long bookingId,
//                                                @RequestParam Long driverId) {
//
//        driverBookingService.acceptBooking(bookingId, driverId);
//        return ResponseEntity.ok("Booking accepted successfully!");
//    }
//
//    @GetMapping("/{driverId}/pending-requests")
//    public ResponseEntity<List<BookingDto>> getPendingRequests(@PathVariable Long driverId) {
//        List<EmergencyRequestEntity> pending = driverBookingService.getPendingRequestsForDriver(driverId);
//        List<BookingDto> response = pending.stream().map(BookingDto::new).toList();
//        return ResponseEntity.ok(response);
//    }
}

