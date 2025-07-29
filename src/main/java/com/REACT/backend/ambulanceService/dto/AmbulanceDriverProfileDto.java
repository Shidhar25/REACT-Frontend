package com.REACT.backend.ambulanceService.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AmbulanceDriverProfileDto {

    private long userID;
    private String name;
    private String email;
    private String mobile;
    private String licenseNumber;
    private String govId;
    private String Role;
    private String ambulanceRegNumber;
}
