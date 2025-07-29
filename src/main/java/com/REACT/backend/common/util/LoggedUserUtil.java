package com.REACT.backend.common.util;

import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.repository.AmbulanceDriverRepository;
import com.REACT.backend.users.repository.AppUserRepository;
import com.REACT.backend.users.repository.FireTruckDriverRepository;
import com.REACT.backend.users.repository.PoliceOfficerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LoggedUserUtil {
    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private AmbulanceDriverRepository ambulanceDriverRepository;

    @Autowired
    private PoliceOfficerRepository policeOfficerRepository;

    @Autowired
    private FireTruckDriverRepository fireTruckDriverRepository;

    public AppUser getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof AppUser appUser)) {
            throw new RuntimeException("Invalid principal type: " + principal.getClass());
        }

        return appUser;
    }

    public Object getCurrentLoggedUserDetails() {
        AppUser appUser = getCurrentUser();

        return switch (appUser.getRole()) {
            case AMBULANCE_DRIVER -> ambulanceDriverRepository.findByDriver(appUser)
                    .orElseThrow(() -> new RuntimeException("Ambulance driver details not found"));
            case POLICE_OFFICER -> policeOfficerRepository.findByPoliceOfficer(appUser)
             .orElseThrow(() -> new RuntimeException("Police details not found"));
            case FIRE_DRIVER -> fireTruckDriverRepository.findByDriver(appUser)
                    .orElseThrow(() -> new RuntimeException("Truck driver details not found"));
            default -> throw new RuntimeException("Unsupported role: " + appUser.getRole());
        };
    }
    public <T> T getUserAs(Class<T> type) {
        Object user = getCurrentLoggedUserDetails();
        if (!type.isInstance(user)) {
            throw new RuntimeException("Current user is not of type: " + type.getSimpleName());
        }
        return type.cast(user);
    }

}
