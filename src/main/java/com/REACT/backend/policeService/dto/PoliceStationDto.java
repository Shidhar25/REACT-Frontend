package com.REACT.backend.policeService.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PoliceStationDto {

    private Long id;
    private String stationName;
    private Double latitude;
    private Double longitude;
    private int availableOfficers;
}