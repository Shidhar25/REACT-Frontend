package com.REACT.backend.auth.dto;

import com.REACT.backend.users.Role;
import com.REACT.backend.users.UserType;
import com.REACT.backend.users.model.SecurityQuestion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String email;
    private Long userId;
    private Role role;
}

