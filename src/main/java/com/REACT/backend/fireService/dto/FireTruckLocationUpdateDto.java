package com.REACT.backend.fireService.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class FireTruckLocationUpdateDto {

    @NotNull(message = "Ambulance ID is required")
    private Long truckId;
    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90.0")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90.0")
    @Digits(integer = 2, fraction = 4, message = "Latitude must have up to 4 decimal places")
    private double latitude;

    @DecimalMin(value = "-180.0", message = "Longitude must be >= -180.0")
    @DecimalMax(value = "180.0", message = "Longitude must be <= 180.0")
    @Digits(integer = 3, fraction = 4, message = "Longitude must have up to 4 decimal places")
    private double longitude;
}
