package com.REACT.backend.booking.dto;

import com.REACT.backend.booking.model.EmergencyRequestStatus;
import jakarta.persistence.Id;
import lombok.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class BookingSummeryDto {

    private Long requestId;
    private String issueType;
    private String victimPhoneNumber;
    private EmergencyRequestStatus status;
    private Instant createdAt;


}
