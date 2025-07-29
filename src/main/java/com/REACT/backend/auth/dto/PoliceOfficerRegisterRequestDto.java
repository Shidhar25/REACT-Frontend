package com.REACT.backend.auth.dto;

import com.REACT.backend.users.Role;
import com.REACT.backend.users.model.SecurityQuestion;
import jakarta.validation.constraints.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PoliceOfficerRegisterRequestDto {


    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone number must be a valid 10-digit Indian number starting with 6-9")
    private String phoneNumber;

    @NotBlank(message = "Government ID is required")
    @Pattern(
            regexp = "^[A-Z]{5}[0-9]{4}[A-Z]$",
            message = "PAN number must be in valid format (e.g. ABCDE1234F)"
    )
    private String governmentId;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    private Role role = Role.POLICE_OFFICER;

    @NotNull(message = "Police station ID must be provided")
    @Min(value = 1, message = "Police station ID must be a positive number")
    private Long policeStationId;

    @NotNull(message = "Security question must be provided")
    private SecurityQuestion securityQuestion;

    @NotBlank(message = "Security answer must be provided")
    private String securityAnswer;

}
