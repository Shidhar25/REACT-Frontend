package com.REACT.backend.LocationMaping.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class FireTruckLocationRepository {
    @PersistenceContext
    private EntityManager em;

    public Object[] findLocations(Long emergencyRequestId) {
        return (Object[]) em.createNativeQuery("""
        SELECT 
            er.id AS emergency_request_id,
            er.latitude AS emergency_latitude,
            er.longitude AS emergency_longitude,
            ft.fire_truck_id AS fire_truck_id,
            ST_Y(ft.location::geometry) AS fire_truck_latitude,
            ST_X(ft.location::geometry) AS fire_truck_longitude
        FROM emergency_request_assigned_fire_trucks erf
        JOIN emergency_request er ON erf.emergency_request_id = er.id
        JOIN fire_truck_entity ft ON erf.fire_truck_id = ft.fire_truck_id
        WHERE er.id = :emergencyRequestId
        LIMIT 1
    """)
                .setParameter("emergencyRequestId", emergencyRequestId)
                .getSingleResult();
    }

}

