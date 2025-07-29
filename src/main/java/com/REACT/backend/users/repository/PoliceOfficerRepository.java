package com.REACT.backend.users.repository;

import com.REACT.backend.policeService.model.PoliceStationEntity;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.model.PoliceOfficer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PoliceOfficerRepository  extends JpaRepository<PoliceOfficer,Long> {
    Optional<PoliceOfficer> findByPoliceOfficer(AppUser user);
    List<PoliceOfficer> findByPoliceStation(PoliceStationEntity policeStation);

//    PoliceOfficer findByPoliceOfficer(AppUser user);
}
