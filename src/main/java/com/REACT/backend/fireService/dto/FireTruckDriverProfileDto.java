package com.REACT.backend.fireService.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FireTruckDriverProfileDto {

    private long userId;
    private String name;
    private String email;
    private String mobile;
    private String licenseNumber;
    private String govId;
    private String Role;
    private String fireTruckRegNumber;
}
