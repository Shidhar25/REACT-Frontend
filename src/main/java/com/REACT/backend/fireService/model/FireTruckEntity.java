package com.REACT.backend.fireService.model;

import com.REACT.backend.users.model.FireTruckDriver;
import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Builder
public class FireTruckEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long fireTruckId;

    private String driverName;

    @OneToOne(mappedBy = "fireTruckEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private FireTruckDriver driver;


    private String vehicleRegNumber;

    @Column(nullable = true)
    private String driverPhoneNumber;

    @Enumerated(EnumType.STRING)
    private FireTruckStatus status;

    @Column(columnDefinition = "GEOGRAPHY(Point,4326)")
    private Point location;

    private Instant lastUpdated;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fire_station_id", nullable = false)
    private FireStationEntity fireStationEntity;
}
