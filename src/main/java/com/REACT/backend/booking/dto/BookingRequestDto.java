package com.REACT.backend.booking.dto;

import com.REACT.backend.users.AppUser;
import jakarta.persistence.Entity;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BookingRequestDto {
    private double latitude;
    private double longitude;
    private String issueType;
    private boolean needAmbulance;
    private boolean needPolice;
    private int requestedAmbulanceCount;
    private int requestedPoliceCount;
    private boolean needFireBrigade;
    private int requestedFireTruckCount;
    private boolean isForSelf;
    private String victimPhoneNumber;       // if isForSelf == false
    private String notes;
    private Long requestId;
    private Long bookingLogId;
}


