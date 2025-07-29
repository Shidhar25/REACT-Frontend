package com.REACT.backend.fireService.dto;

import lombok.Builder;
import lombok.Data;
import org.locationtech.jts.geom.Point;

@Data
@Builder
public class FireStationResponseDto {

    private long id;

    private String fireStationName;

    private double latitude;
    private double longitude;
}
