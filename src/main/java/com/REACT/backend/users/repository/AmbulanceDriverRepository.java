package com.REACT.backend.users.repository;

import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.model.AmbulanceDriver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AmbulanceDriverRepository extends JpaRepository<AmbulanceDriver, Long> {
    Optional<?> findByDriver(AppUser user);

    boolean existsByLicenseNumber(String license);

    Optional<AmbulanceDriver> findByAmbulance(AmbulanceEntity ambulance);




}
