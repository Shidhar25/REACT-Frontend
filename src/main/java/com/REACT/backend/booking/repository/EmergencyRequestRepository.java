package com.REACT.backend.booking.repository;

import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
import com.REACT.backend.booking.dto.BookingResponseDto;
import com.REACT.backend.booking.dto.BookingSummeryDto;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.model.EmergencyRequestStatus;
import com.REACT.backend.fireService.model.FireTruckEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequestEntity, Long> {

    // Dashboard statistics methods
    long countByNeedAmbulance(boolean needAmbulance);
    long countByNeedFireBrigade(boolean needFireBrigade);
    long countByNeedPolice(boolean needPolice);
    long countByEmergencyRequestStatus(EmergencyRequestStatus status);

    @Query("SELECT e FROM EmergencyRequestEntity e WHERE e.requestedBy.id = :userId ORDER BY e.createdAt DESC")
    List<EmergencyRequestEntity> findAllByRequestedById(@Param("userId") Long userId);


    List<EmergencyRequestEntity> findByDriver_UserIdAndEmergencyRequestStatus(
            Long driverId, EmergencyRequestStatus status);

    List<EmergencyRequestEntity> findByRequestedBy_UserIdAndEmergencyRequestStatus(
            Long userId, EmergencyRequestStatus status);

    @Query("SELECT er FROM EmergencyRequestEntity er JOIN er.assignedAmbulances a WHERE a = :ambulance")
    List<EmergencyRequestEntity> findByAssignedAmbulance(@Param("ambulance") AmbulanceEntity ambulance);

//    @Query("SELECT er FROM EmergencyRequestEntity er JOIN er.assignedAmbulances a " +
//            "WHERE a = :ambulance AND er.emergencyRequestStatus = :status")
//    List<EmergencyRequestEntity> findByAssignedAmbulanceAndStatus(@Param("ambulance") AmbulanceEntity ambulance,
//                                                                  @Param("status") EmergencyRequestStatus status);
//
//
//
//
//    @Query("SELECT e FROM EmergencyRequestEntity e JOIN e.assignedAmbulances a WHERE a = :ambulance AND e.status != 'COMPLETED'")
//    List<EmergencyRequestEntity> findActiveByAmbulance(@Param("ambulance") AmbulanceEntity ambulance);

    @Query("SELECT er FROM EmergencyRequestEntity er JOIN er.assignedAmbulances a " +
            "WHERE a = :ambulance AND er.emergencyRequestStatus = :status")
    List<EmergencyRequestEntity> findByAssignedAmbulanceAndStatus(@Param("ambulance") AmbulanceEntity ambulance,
                                                                  @Param("status") EmergencyRequestStatus status);



    @Query("SELECT er FROM EmergencyRequestEntity er JOIN er.assignedFireTruckEntities t where t=:truck")
    List<EmergencyRequestEntity> findByAssignedFireTruckEntities(@Param("truck") FireTruckEntity truck);

}
