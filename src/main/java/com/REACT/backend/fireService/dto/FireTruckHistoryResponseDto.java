package com.REACT.backend.fireService.dto;

import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.fireService.model.FireTruckStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class FireTruckHistoryResponseDto {

    private Long id;
    private Long userId;
    private String emailOfRequester;
    private Instant requestedAt;
    private double latitude;
    private FireTruckStatus status;
    private double longitude;
}
