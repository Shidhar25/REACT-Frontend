package com.REACT.backend.userService.controller;

import com.REACT.backend.userService.dto.UpdateUserProfileDto;
import com.REACT.backend.userService.dto.UserProfileDto;
import com.REACT.backend.userService.service.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private UserServiceImpl userService;


    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getProfile(){
        log.info("UserProfileDto fetched:");
        System.out.println("HOIHSH");
       return ResponseEntity.ok(userService.getProfileOfCurrentUser());
    }

    @PutMapping("/profile")

    public ResponseEntity<UserProfileDto> updateProfile(@RequestBody UpdateUserProfileDto updateRequest) {
        return ResponseEntity.ok(userService.updateUserProfile(updateRequest));
    }


    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileDto> getUserById(@PathVariable Long userId){
        log.info("Fetching user details for userId={}",userId);
        return ResponseEntity.ok(userService.getUserById(userId));
    }

}
