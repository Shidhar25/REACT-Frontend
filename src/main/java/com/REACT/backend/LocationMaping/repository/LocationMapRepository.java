package com.REACT.backend.LocationMaping.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class LocationMapRepository {

    @PersistenceContext
    private EntityManager em;

    public Object[] findLocationsByEmergencyRequestId(Long emergencyRequestId) {
        return (Object[]) em.createNativeQuery("""
            SELECT 
                er.id AS emergency_request_id,
                er.latitude AS emergency_latitude,
                er.longitude AS emergency_longitude,
                ae.id AS ambulance_id,
                ST_Y(ae.location::geometry) AS ambulance_latitude,
                ST_X(ae.location::geometry) AS ambulance_longitude
            FROM emergency_request_assigned_ambulances era
            JOIN emergency_request er ON era.emergency_request_id = er.id
            JOIN ambulance_entity ae ON era.ambulance_id = ae.id
            WHERE er.id = :emergencyRequestId
            LIMIT 1
        """)
                .setParameter("emergencyRequestId", emergencyRequestId)
                .getSingleResult();
    }
}
