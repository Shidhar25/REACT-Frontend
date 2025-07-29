package com.REACT.backend.auth.dto;

import jakarta.validation.constraints.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter @NoArgsConstructor @AllArgsConstructor

public class LoginRequest {
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

}
