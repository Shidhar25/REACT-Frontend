package com.REACT.backend.policeService.dto;


import com.REACT.backend.users.model.PoliceOfficer;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class PoliceOfficerResponseDto {

    private long userId;
    private String name;
    private long policeId;
    private String policeStationName;
    private String email;
    private String phoneNumber;
    private String govId;

    public PoliceOfficerResponseDto(PoliceOfficer officer){
        this.userId = officer.getPoliceOfficer().getUserId();
        this.name = officer.getFullName();
        this.policeId = officer.getId();
        this.policeStationName = officer.getPoliceStation().getStationName();
        this.email = officer.getPoliceOfficer().getUserEmail();
        this.phoneNumber = officer.getPoliceOfficer().getPhoneNumber();
        this.govId = officer.getPoliceOfficer().getGovernmentId();
    }
}
