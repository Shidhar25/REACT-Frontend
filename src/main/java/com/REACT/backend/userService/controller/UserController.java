package com.REACT.backend.userService.controller;

import com.REACT.backend.userService.dto.UpdateUserProfileDto;
import com.REACT.backend.userService.dto.UserProfileDto;
import com.REACT.backend.userService.service.impl.UserServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/user")

public class UserController {
    @Autowired
    private UserServiceImpl userService;


    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile(){
        log.info("UserProfileDto fetched:");
       return ResponseEntity.ok(userService.getProfileOfCurrentUser());
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<UserProfileDto> updateProfile(@RequestBody UpdateUserProfileDto updateRequest) {
        return ResponseEntity.ok(userService.updateUserProfile(updateRequest));
    }

}
