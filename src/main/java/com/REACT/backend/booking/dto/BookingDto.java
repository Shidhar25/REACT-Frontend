package com.REACT.backend.booking.dto;

import com.REACT.backend.booking.model.BookingLogEntity;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import java.time.Instant;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BookingDto {
    
    @NotNull
    @JsonProperty("booking_id")
    private Long bookingId;
    
    @NotNull
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    @JsonProperty("pickup_latitude")
    private Double pickupLatitude;
    
    @NotNull
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    @JsonProperty("pickup_longitude")
    private Double pickupLongitude;
    
    @NotBlank
    @JsonProperty("issue_type")
    private String issueType;
    
    @NotBlank
    @JsonProperty("status")
    private String status;
    
    @JsonProperty("created_at")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private Instant createdAt;
    
    @JsonProperty("victim_phone_number")
    private String victimPhoneNumber;
    
    @JsonProperty("requested_by_user_id")
    private Long requestedByUserId;
    
    @JsonProperty("is_for_self")
    private Boolean isForSelf;
    
    // Service requirements
    @JsonProperty("needs_ambulance")
    private Boolean needsAmbulance;
    
    @JsonProperty("needs_police")
    private Boolean needsPolice;
    
    @JsonProperty("needs_fire_brigade")
    private Boolean needsFireBrigade;
    
    @JsonProperty("requested_ambulance_count")
    private Integer requestedAmbulanceCount;
    
    @JsonProperty("requested_police_count")
    private Integer requestedPoliceCount;
    
    @JsonProperty("requested_fire_truck_count")
    private Integer requestedFireTruckCount;

    public BookingDto(EmergencyRequestEntity request) {
        this.bookingId = request.getId();
        this.pickupLatitude = request.getLatitude();
        this.pickupLongitude = request.getLongitude();
        this.issueType = request.getIssueType();
        this.status = request.getEmergencyRequestStatus().name();
        this.createdAt = request.getCreatedAt();
        this.victimPhoneNumber = request.getVictimPhoneNumber();
        this.requestedByUserId = request.getRequestedBy().getUserId();
        this.isForSelf = request.isForSelf();
        this.needsAmbulance = request.isNeedAmbulance();
        this.needsPolice = request.isNeedPolice();
        this.needsFireBrigade = request.isNeedFireBrigade();
        this.requestedAmbulanceCount = request.getRequestedAmbulancesCount();
        this.requestedPoliceCount = request.getRequestedPoliceCount();
        this.requestedFireTruckCount = request.getRequestedFireTruckCount();
    }
    
    public BookingDto(BookingLogEntity entity) {
        EmergencyRequestEntity request = entity.getEmergencyRequest();
        this.bookingId = entity.getId();
        this.pickupLatitude = request.getLatitude();
        this.pickupLongitude = request.getLongitude();
        this.issueType = request.getIssueType();
        this.status = request.getEmergencyRequestStatus().name();
        this.createdAt = request.getCreatedAt();
        this.victimPhoneNumber = request.getVictimPhoneNumber();
        this.requestedByUserId = request.getRequestedBy().getUserId();
        this.isForSelf = request.isForSelf();
        this.needsAmbulance = request.isNeedAmbulance();
        this.needsPolice = request.isNeedPolice();
        this.needsFireBrigade = request.isNeedFireBrigade();
        this.requestedAmbulanceCount = request.getRequestedAmbulancesCount();
        this.requestedPoliceCount = request.getRequestedPoliceCount();
        this.requestedFireTruckCount = request.getRequestedFireTruckCount();
    }
}
