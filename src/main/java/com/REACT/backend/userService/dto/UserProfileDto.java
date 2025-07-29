package com.REACT.backend.userService.dto;


import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.Role;
import lombok.*;
import lombok.extern.slf4j.Slf4j;


@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class UserProfileDto {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String governmentId;
    private boolean verified;
    private Role role;

    public static  UserProfileDto from(AppUser user){
        return UserProfileDto.builder()
                .id(user.getUserId())
                .fullName(user.getUserFullName())
                .email(user.getUserEmail())
                .phoneNumber(user.getPhoneNumber())
                .governmentId(user.getGovernmentId())
                .verified(user.isVerified())
                .role(user.getRole())
                .build();
    }

}
