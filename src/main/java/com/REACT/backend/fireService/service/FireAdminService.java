package com.REACT.backend.fireService.service;

import com.REACT.backend.booking.dto.BookingDto;
import com.REACT.backend.booking.dto.BookingRequestDto;
import com.REACT.backend.fireService.dto.FireTruckDto;
import com.REACT.backend.fireService.dto.FireTruckLocationUpdateDto;

import java.util.List;
import java.util.Optional;

public interface FireAdminService {
    List<FireTruckDto> getTrucksByStation(Long stationId);
    List<BookingDto> getBookingHistoryByStation(Long stationId); // Replace Object with Booking DTO list if you have
    List<BookingDto> getBookingHistoryByTruck(Long truckId);

    String updateLocation(FireTruckLocationUpdateDto dto);

}
