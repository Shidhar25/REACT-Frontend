package com.REACT.backend.ambulanceService.dto;

import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Duration;
import java.time.Instant;

@Data
@Builder
public class AmbulanceBookingHistoryResponseDto {
    private Long id;
    private Long userId;
    private String emailOfRequester;
    private Instant requestedAt;
    private double latitude;
    private AmbulanceStatus status;
    private double longitude;
}
