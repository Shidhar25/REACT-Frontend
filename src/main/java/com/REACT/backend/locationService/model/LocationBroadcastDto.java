package com.REACT.backend.locationService.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationBroadcastDto {
    private Long unitId;
    private UnitType unitType;
    private double latitude;
    private double longitude;

}
