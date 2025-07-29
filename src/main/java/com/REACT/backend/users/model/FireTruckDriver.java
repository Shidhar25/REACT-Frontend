package com.REACT.backend.users.model;

import com.REACT.backend.fireService.model.FireTruckEntity;
import com.REACT.backend.users.AppUser;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Builder
public class FireTruckDriver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long driverId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser driver;

    private String licenseNumber;

    // ✅ Cascade only if you create FireTruck at registration
    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "fire_truck_id", nullable = false)
    private FireTruckEntity fireTruckEntity;
}
