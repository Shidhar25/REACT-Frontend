package com.REACT.backend.users.model;

import com.REACT.backend.policeService.model.PoliceStationEntity;
import com.REACT.backend.users.AppUser;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Builder
public class PoliceOfficer {

    private String fullName;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "police_station_id")
    private PoliceStationEntity policeStation;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser policeOfficer;


}
