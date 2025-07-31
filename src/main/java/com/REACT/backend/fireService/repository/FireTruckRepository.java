package com.REACT.backend.fireService.repository;

import com.REACT.backend.booking.dto.BookingDto;
import com.REACT.backend.fireService.dto.FireTruckDto;
import com.REACT.backend.fireService.dto.FireTruckHistoryResponseDto;
import com.REACT.backend.fireService.model.FireTruckEntity;

import com.REACT.backend.fireService.model.FireTruckStatus;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.model.FireTruckDriver;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FireTruckRepository extends JpaRepository<FireTruckEntity, Long> {

    @Query(value = """
        SELECT * FROM fire_truck_entity f
        WHERE f.status = 'AVAILABLE'
          AND ST_DWithin(f.location, CAST(ST_MakePoint(:lng, :lat) AS geography), :radius)
        ORDER BY ST_Distance(f.location, CAST(ST_MakePoint(:lng, :lat) AS geography))
        """, nativeQuery = true)
    List<FireTruckEntity> findAvailableWithinRadius(
            @Param("lat") double latitude,
            @Param("lng") double longitude,
            @Param("radius") double radiusMeters
    );

    List<FireTruckEntity> findByFireStationEntityId(Long stationId);

    FireTruckEntity findByDriver(FireTruckDriver driver);

    
    @Query("SELECT COUNT(f) FROM FireTruckEntity f WHERE f.status = :status")
    long countByStatus(@Param("status") FireTruckStatus status);
    
    @Query("SELECT COUNT(DISTINCT f.fireStationEntity.id) FROM FireTruckEntity f")
    long countDistinctByFireStationId();

    public FireTruckEntity findByVehicleRegNumber(String vehicleRegNumber);
    boolean existsByVehicleRegNumber(String numberPlate);

    Optional<FireTruckEntity> findByFireTruckId(Long fireTruckId);
}
