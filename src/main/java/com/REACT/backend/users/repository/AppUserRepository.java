package com.REACT.backend.users.repository;

import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface AppUserRepository extends JpaRepository<AppUser,Long> {
    Optional<AppUser> findByUserEmail(String email);
    Optional<AppUser> findByUserId(Long id);
    Optional<AppUser> findByRole(Role role);
    boolean existsByGovernmentId(String governmentId);
    boolean existsByPhoneNumber(String phoneNumber);

}
