package com.REACT.backend.users.repository;

import com.REACT.backend.users.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser,Long> {

    AppUser findByUserEmail(String email);
    boolean existsByGovernmentId(String governmentId);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByUserEmail(String userEmail);



}
