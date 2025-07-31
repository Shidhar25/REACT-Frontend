package com.REACT.backend.ambulanceService.model;

import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.hospitalService.model.Hospital;
import com.REACT.backend.users.AppUser;
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
@Table(name = "ambulance_entity")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class AmbulanceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private String ambulanceRegNumber;

    private String phoneNumber;

    private String ambulanceDriverName;

    @Enumerated(EnumType.STRING)
    private AmbulanceStatus status;

    private String license;

    @Column(columnDefinition = "GEOGRAPHY(Point,4326)")
    private Point location;

    private Instant lastUpdated;

    @OneToOne
    @JoinColumn(name = "driver_id")
    private AppUser driver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;




}
