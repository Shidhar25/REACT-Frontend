package com.REACT.backend.booking.model;


import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.fireService.model.FireTruckEntity;
import com.REACT.backend.policeService.model.PoliceStationEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "booking_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"assignedPoliceMap", "assignedFireTrucks"})
public class BookingLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "emergency_request_id", unique = true)
    private EmergencyRequestEntity emergencyRequest;


    @JoinTable(
            name = "booking_log_assigned_ambulances",
            joinColumns = @JoinColumn(name = "booking_log_id"),
            inverseJoinColumns = @JoinColumn(name = "ambulance_id")
    )
    @ManyToMany
    private List<AmbulanceEntity> assignedAmbulance;


    /**
     * stationId → number of officers assigned from that station
     */

    @ElementCollection
    @CollectionTable(name = "booking_log_police_map", joinColumns = @JoinColumn(name = "booking_log_id"))
    @MapKeyJoinColumn(name = "station_id")
    @Column(name = "officer_count")
    private Map<PoliceStationEntity, Integer> assignedPoliceMap;




    /**
     * list of individual fire trucks dispatched
     */

    @JoinTable(
            name = "booking_log_assigned_fire_trucks",
            joinColumns = @JoinColumn(name = "booking_log_id"),
            inverseJoinColumns = @JoinColumn(name = "fire_truck_id")
    )
    @ManyToMany
    private List<FireTruckEntity> assignedFireTruckEntities;

    @Column(length = 1024)
    private String statusMessage;

    private Instant createdAt = Instant.now();
}
