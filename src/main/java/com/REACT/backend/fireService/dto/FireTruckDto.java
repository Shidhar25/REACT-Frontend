package com.REACT.backend.fireService.dto;

import com.REACT.backend.fireService.model.FireTruckEntity;
import com.REACT.backend.fireService.model.FireTruckStatus;
import jakarta.validation.constraints.*;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FireTruckDto {

    @NotNull(message = "Ambulance ID is required")
    private Long id;

    @NotBlank(message = "Registration number cannot be blank")
    @Size(max = 50, message = "Registration number must be at most 50 characters")
    private String registrationNumber;

    @NotBlank(message = "Driver name cannot be blank")
    @Size(max = 100, message = "Driver name must be at most 100 characters")
    private String driverName;

    @NotBlank(message = "Driver phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian phone number format")
    private String driverPhoneNumber;

    @NotNull(message = "Fire truck status is required")
    private FireTruckStatus status;

    private Instant lastUpdated;

    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90.0")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90.0")
    private double latitude;

    @DecimalMin(value = "-180.0", message = "Longitude must be >= -180.0")
    @DecimalMax(value = "180.0", message = "Longitude must be <= 180.0")
    private double longitude;



    public FireTruckDto(FireTruckEntity entity) {
        this.id = entity.getFireTruckId();
        this.registrationNumber = entity.getVehicleRegNumber();
        if (entity.getDriver() != null && entity.getDriver().getDriver() != null) {
            this.driverName = entity.getDriver().getDriver().getUserFullName();
            this.driverPhoneNumber = entity.getDriver().getDriver().getPhoneNumber();
        }
        this.status = entity.getStatus();
        this.lastUpdated = entity.getLastUpdated();
        this.latitude = entity.getLocation().getY();
        this.longitude = entity.getLocation().getX();

    }
}
