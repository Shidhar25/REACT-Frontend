package com.REACT.backend.booking.service;

import com.REACT.backend.booking.dto.BookingRequestDto;
import com.REACT.backend.booking.dto.BookingResponseDto;
import com.REACT.backend.booking.dto.BookingSummeryDto;
import com.REACT.backend.booking.dto.BookingDto;

import java.nio.file.AccessDeniedException;
import java.util.List;

public interface BookingService {
    /**
     * Core entry point for any booking—HTTP API or NLP hook.
     *
     * @param requestDto     user’s booking details
     * @param requestedById  AppUser.userId of the caller
     * @return fully-populated response DTO
     */
    BookingResponseDto createBooking(BookingRequestDto requestDto, Long requestedById);

    List<BookingSummeryDto> getBookingHistoryForUser(Long userId);

    BookingResponseDto getBookingDetailsByBookingId(Long bookingId);

    BookingResponseDto deleteBookingById(Long bookingId, Long userId) throws AccessDeniedException;

    // Dashboard APIs
    List<BookingDto> getAllBookings();
    List<BookingDto> getAmbulanceBookings();
    List<BookingDto> getFireServiceBookings();
    List<BookingDto> getPoliceServiceBookings();

}
