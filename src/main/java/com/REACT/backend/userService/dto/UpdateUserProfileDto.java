package com.REACT.backend.userService.dto;

import lombok.Data;

@Data
public class UpdateUserProfileDto {
    private  String userFullName;
    private String phoneNumber;
}
