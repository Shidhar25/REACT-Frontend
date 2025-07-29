package com.REACT.backend.fireService.repository;

import com.REACT.backend.fireService.dto.FireStationDto;
import com.REACT.backend.fireService.model.FireStationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FireStationRepository extends JpaRepository<FireStationEntity,Long> {
}
