package com.REACT.backend.auth.Controller;

import com.REACT.backend.auth.dto.*;
import com.REACT.backend.auth.service.AuthService;
import com.REACT.backend.users.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@Validated
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository repo;
    private final AuthService authService;

    @GetMapping("/home")
    public String homeTrial() {
        return "Hola amigo";
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("register requested fetched for userEmail {} for Role: {}", request.getEmail(), request.getRole());
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/fire-driver")
    public ResponseEntity<AuthResponse> registerFireDriver(@Valid @RequestBody FireDriverRegisterRequestDto request) {
        log.info("register requested fetched for userEmail {} for Role: {}", request.getEmail(), request.getRole());
        AuthResponse response = authService.registerFireDriver(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/ambulance-driver")
    public ResponseEntity<AuthResponse> registerAmbulanceDriver(@Valid @RequestBody AmbulanceRegisterRequestDto request) {
        log.info("register requested fetched for userEmail {} for Role: {}", request.getEmail(), request.getRole());
        AuthResponse response = authService.registerAmbulanceDriver(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/police-officer")
    public ResponseEntity<AuthResponse> registerPoliceOfficer(@Valid @RequestBody PoliceOfficerRegisterRequestDto request) {
        log.info("register requested fetched for userEmail {} for Role: {}", request.getEmail(), request.getRole());
        AuthResponse response = authService.registerPoliceOfficer(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login requested fetched for userEmail {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password/request")
    public ResponseEntity<?> getSecurityQuestion(@Valid @RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        return ResponseEntity.ok(authService.getSecurityQuestion(email));
    }

    @PostMapping("/forgot-password/verify")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ForgotPasswordDto dto) {
        authService.resetPassword(dto);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
    }

    @PostMapping("/reset-password")
    public String changePassword(@Valid @RequestBody ResetPasswordDto request) {
        log.info("Reset password request fetched");
        authService.changePassword(request);
        return "Password changed successfully.";
    }
}
