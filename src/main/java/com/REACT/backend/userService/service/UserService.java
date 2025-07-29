package com.REACT.backend.userService.service;

import com.REACT.backend.userService.dto.UpdateUserProfileDto;
import com.REACT.backend.userService.dto.UserProfileDto;

public interface UserService {
    UserProfileDto getProfileOfCurrentUser();
    UserProfileDto updateUserProfile(UpdateUserProfileDto updateRequest);
}
