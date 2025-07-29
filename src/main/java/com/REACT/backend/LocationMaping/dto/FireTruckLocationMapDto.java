package com.REACT.backend.LocationMaping.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FireTruckLocationMapDto {
    private EmergencyRequestLocation emergencyRequest;
    private FireTruckLocation fireTruck;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class EmergencyRequestLocation {
        private Long id;
        private double latitude;
        private double longitude;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FireTruckLocation {
        private Long id;
        private double latitude;
        private double longitude;
    }
}
