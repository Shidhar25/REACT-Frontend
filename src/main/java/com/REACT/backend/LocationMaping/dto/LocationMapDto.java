package com.REACT.backend.LocationMaping.dto;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LocationMapDto {

    private EmergencyRequestLocation emergencyRequest;
    private AmbulanceLocation ambulance;

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
    public static class AmbulanceLocation {
        private Long id;
        private double latitude;
        private double longitude;
    }
}

