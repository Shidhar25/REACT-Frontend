package com.REACT.backend.users.repository;

import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.model.FireTruckDriver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FireTruckDriverRepository extends JpaRepository<FireTruckDriver,Long> {

    Optional<FireTruckDriver> findByDriver(AppUser user);

//    FireTruckDriver findByDriver(AppUser user);

    boolean existsByLicenseNumber(String license);

}
