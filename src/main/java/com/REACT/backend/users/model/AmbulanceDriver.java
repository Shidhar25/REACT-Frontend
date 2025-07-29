package com.REACT.backend.users.model;



import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.users.AppUser;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Builder
public class AmbulanceDriver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long driverId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser driver;

    private String licenseNumber;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "ambulance_id", nullable = false)
    private AmbulanceEntity ambulance;
}
