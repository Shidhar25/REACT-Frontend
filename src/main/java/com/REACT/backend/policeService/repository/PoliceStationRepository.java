package com.REACT.backend.policeService.repository;

import com.REACT.backend.policeService.model.PoliceStationEntity;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PoliceStationRepository extends JpaRepository<PoliceStationEntity, Long> {

    @Query(value = """
    SELECT * 
    FROM police_station_entity p
    ORDER BY ST_Distance(p.location, CAST(ST_MakePoint(:lng, :lat) AS geography))
    """, nativeQuery = true)
    List<PoliceStationEntity> findAllByProximity(
            @Param("lat") double lat,
            @Param("lng") double lng
    );

    Optional<PoliceStationEntity> findByStationName(String stationName);
    
    @Query("SELECT SUM(p.availableOfficers) FROM PoliceStationEntity p")
    long countTotalPoliceOfficers();

}
