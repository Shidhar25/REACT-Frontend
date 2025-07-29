package com.REACT.backend.booking.repository;

import com.REACT.backend.booking.model.BookingLogEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingLogRepository extends JpaRepository<BookingLogEntity, Long> {
        @Modifying
        @Transactional
        @Query(value = "INSERT INTO booking_log_fire_trucks (booking_log_id, fire_truck_id) VALUES (:logId, :truckId)", nativeQuery = true)
        void insertFireTruckToLog(@Param("logId") Long logId, @Param("truckId") Long truckId);

        @Modifying
        @Transactional
        @Query(value = "INSERT INTO booking_log_police_allocations (booking_log_id, station_id, officers_assigned) VALUES (:logId, :stationId, :officers)", nativeQuery = true)
        void insertPoliceAllocation(@Param("logId") Long logId, @Param("stationId") Long stationId, @Param("officers") Integer officers);
        Optional<BookingLogEntity> findByEmergencyRequest_Id(Long emergencyRequestId);

        @Query("SELECT b FROM BookingLogEntity b JOIN b.assignedFireTruckEntities t WHERE t.fireTruckId = :truckId")
        List<BookingLogEntity> findAllByFireTruckId(@Param("truckId") Long truckId);

        @Query("SELECT DISTINCT b FROM BookingLogEntity b JOIN b.assignedFireTruckEntities t WHERE t.fireStationEntity.id = :stationId")
        List<BookingLogEntity> findAllByStationId(@Param("stationId") Long stationId);

        @Query("SELECT DISTINCT b FROM BookingLogEntity b WHERE b.emergencyRequest.id IN " +
                "(SELECT er.id FROM EmergencyRequestEntity er WHERE er.assignedPoliceMap IS NOT EMPTY " +
                "AND KEY(er.assignedPoliceMap).id = :policeStationId)")
        List<BookingLogEntity> findAllByPoliceStationId(@Param("policeStationId") Long policeStationId);



}
