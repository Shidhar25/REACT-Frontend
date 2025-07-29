package com.REACT.backend.userService.service.impl;

import com.REACT.backend.common.exception.ResourceNotFoundException;
import com.REACT.backend.userService.dto.UpdateUserProfileDto;
import com.REACT.backend.userService.dto.UserProfileDto;
import com.REACT.backend.userService.service.UserService;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.Role;
import com.REACT.backend.users.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final com.REACT.backend.common.util.LoggedUserUtil loggedUserUtil;
    private final AppUserRepository appUserRepository;

    @Override
    public UserProfileDto getProfileOfCurrentUser() {
        try {
            AppUser user = loggedUserUtil.getCurrentUser();

            if (user == null) {
                log.error("Logged-in user not found");
                throw new ResourceNotFoundException("Logged-in user not found");
            }

            log.info("User found with email={} and userId={}", user.getUserEmail(), user.getUserId());


            return UserProfileDto.from(user);
        } catch (SecurityException ex) {
            log.warn("Security exception in getProfileOfCurrentUser: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Unexpected error in getProfileOfCurrentUser: {}", ex.getMessage(), ex);
            throw new RuntimeException("Failed to fetch user profile");
        }
    }

    @Override
    public UserProfileDto updateUserProfile(UpdateUserProfileDto updateRequest) {
        try {
            AppUser user = loggedUserUtil.getCurrentUser();

            if (user == null) {
                log.error("Logged-in user not found");
                throw new ResourceNotFoundException("User not found");
            }

            log.info("Updating profile for userId={}, oldName={}, oldPhone={}",
                    user.getUserId(), user.getUserFullName(), user.getPhoneNumber());

            user.setUserFullName(updateRequest.getUserFullName());
            user.setPhoneNumber(updateRequest.getPhoneNumber());

            AppUser saved = appUserRepository.save(user);

            log.info("Updated profile: newName={}, newPhone={}",
                    saved.getUserFullName(), saved.getPhoneNumber());

            return UserProfileDto.from(saved);
        } catch (Exception ex) {
            log.error("Error updating user profile: {}", ex.getMessage(), ex);
            throw new RuntimeException("Failed to update user profile");
        }
    }
}
