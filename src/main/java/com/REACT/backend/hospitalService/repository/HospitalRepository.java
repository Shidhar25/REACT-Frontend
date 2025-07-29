package com.REACT.backend.hospitalService.repository;

import com.REACT.backend.hospitalService.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalRepository extends JpaRepository<Hospital,Long> {
}
