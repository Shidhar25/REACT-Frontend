package com.REACT.backend.common.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor

public class LocationDto {
    private double latitude;
    private double longitude;
}
