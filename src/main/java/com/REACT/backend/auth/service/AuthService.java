package com.REACT.backend.auth.service;

import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
import com.REACT.backend.ambulanceService.repository.AmbulanceRepository;
import com.REACT.backend.auth.dto.*;
import com.REACT.backend.common.exception.BadRequestException;
import com.REACT.backend.common.exception.ConflictException;
import com.REACT.backend.common.exception.ResourceNotFoundException;
import com.REACT.backend.common.exception.UnauthorizedException;
import com.REACT.backend.common.util.LoggedUserUtil;
import com.REACT.backend.fireService.model.FireStationEntity;
import com.REACT.backend.fireService.model.FireTruckStatus;
import com.REACT.backend.fireService.repository.FireStationRepository;
import com.REACT.backend.fireService.repository.FireTruckRepository;
import com.REACT.backend.hospitalService.model.Hospital;
import com.REACT.backend.hospitalService.repository.HospitalRepository;
import com.REACT.backend.policeService.model.PoliceStationEntity;
import com.REACT.backend.policeService.repository.PoliceStationRepository;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.fireService.model.FireTruckEntity;
import com.REACT.backend.users.Role;
import com.REACT.backend.users.UserType;
import com.REACT.backend.users.model.AmbulanceDriver;
import com.REACT.backend.users.model.FireTruckDriver;
import com.REACT.backend.users.model.PoliceOfficer;
import com.REACT.backend.users.repository.*;
import com.REACT.backend.Jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService{

    private final UserRepository userRepo;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    private final FireStationRepository fireStationRepo;
    private final FireTruckDriverRepository fireTruckDriverRepo;
    private final FireTruckRepository fireTruckRepository;

    private final AmbulanceDriverRepository ambulanceDriverRepo;
    private final AmbulanceRepository ambulanceRepository;
    private final HospitalRepository hospitalRepo;

    private final PoliceStationRepository policeStationRepo;
    private final PoliceOfficerRepository policeOfficerRepo;
    private final LoggedUserUtil loggedUserUtil;

    public AuthResponse register(RegisterRequest request) {

        if(request.getEmail().isBlank()){
            log.error("Blank email id provided {}",request.getEmail());
            throw new IllegalArgumentException("Email cannot be blank");
        }
        if (request.getFullName().isBlank()) {
            log.error("Blank full name provided {}", request.getFullName());
            throw new IllegalArgumentException("Full name cannot be blank");
        }


        if (request.getSecurityQuestion() == null || request.getSecurityAnswer() == null || request.getSecurityAnswer().isBlank()) {
            throw new IllegalArgumentException("Security question and answer are required");
        }

        checkUserConflict(request.getGovernmentId(),request.getPhoneNumber(),request.getEmail());
        log.info("Registering new user: {}", request.getEmail());




        AppUser newUser = AppUser.builder()
                .userFullName(request.getFullName())
                .userEmail(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .governmentId(request.getGovernmentId())
                .userPassword(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .securityQuestion(request.getSecurityQuestion())
                .securityAnswer(passwordEncoder.encode(request.getSecurityAnswer()))
                .verified(true)
                .build();

        AppUser savedUser = userRepo.save(newUser);
        log.info("User registered successfully: {} (Role: {})", savedUser.getUserEmail(), savedUser.getRole());

        return buildAuthResponse(savedUser);
    }

    public AuthResponse registerFireDriver(FireDriverRegisterRequestDto request) {
        log.info("Registering fire truck driver: {}", request.getEmail());

        checkUserConflict(request.getGovernmentId(),request.getPhoneNumber(),request.getEmail());
        checkFireDriverConflict(request.getVehicleRegNumber(),request.getLicenseNumber());


        AppUser newUser = AppUser.builder()
                .userFullName(request.getFullName())
                .userEmail(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .governmentId(request.getGovernmentId())
                .userPassword(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .securityQuestion(request.getSecurityQuestion())
                .securityAnswer(passwordEncoder.encode(request.getSecurityAnswer()))
                .verified(true)
                .build();

        FireStationEntity station = fireStationRepo.findById(request.getFireStationId())
                .orElseThrow(() -> {
                    log.error("No fire station with ID: {}", request.getFireStationId());
                    return new ResourceNotFoundException("Station does not exist with id:" + request.getFireStationId());
                });

        log.info("Assigning driver {} to fire station: {}", request.getFullName(), station.getStationName());

        FireTruckEntity fireTruckEntity = FireTruckEntity.builder()
                .driverName(request.getFullName())
                .status(FireTruckStatus.AVAILABLE)
                .lastUpdated(Instant.now().plusSeconds(330 * 3600))
                .location(station.getLocation())
                .fireStationEntity(station)
                .driverPhoneNumber(request.getPhoneNumber())
                .vehicleRegNumber(request.getVehicleRegNumber())
                .build();

        FireTruckDriver fireTruckDriver = FireTruckDriver.builder()
                .driver(newUser)
                .fireTruckEntity(fireTruckEntity)
                .licenseNumber(request.getLicenseNumber())
                .build();
        fireTruckEntity.setDriver(fireTruckDriver);

        AppUser savedUser = userRepo.save(newUser);
        fireTruckDriverRepo.save(fireTruckDriver);
        log.info("Fire truck driver registered: {}, assigned truck: {}", savedUser.getUserEmail(), request.getVehicleRegNumber());

        return buildAuthResponse(savedUser);
    }

    public AuthResponse registerAmbulanceDriver(AmbulanceRegisterRequestDto request) {
        log.info("Registering ambulance driver: {}", request.getEmail());

        checkUserConflict(request.getGovernmentId(),request.getPhoneNumber(),request.getEmail());
        checkAmbulanceDriverConflict(request.getVehicleRegNumber(),request.getLicenseNumber());

        AppUser user = AppUser.builder()
                .userFullName(request.getFullName())
                .userEmail(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .governmentId(request.getGovernmentId())
                .userPassword(passwordEncoder.encode(request.getPassword()))
                .role(Role.AMBULANCE_DRIVER)
                .securityQuestion(request.getSecurityQuestion())
                .securityAnswer(passwordEncoder.encode(request.getSecurityAnswer()))
                .verified(true)
                .build();

        Hospital hospital = hospitalRepo.findById(request.getHospitalID())
                .orElseThrow(() -> {
                    log.error("Invalid hospital ID: {}", request.getHospitalID());
                    return new ResourceNotFoundException("No hospital with this id exist: " + request.getHospitalID());
                });

        AmbulanceEntity ambulance = AmbulanceEntity.builder()
                .ambulanceRegNumber(request.getVehicleRegNumber())
                .ambulanceDriverName(request.getFullName())
                .status(AmbulanceStatus.AVAILABLE)
                .phoneNumber(request.getPhoneNumber())
                .location(hospital.getLocation())
                .lastUpdated(Instant.now())
                .driver(user)
                .hospital(hospital)
                .build();

        AmbulanceDriver driver = AmbulanceDriver.builder()
                .driver(user)
                .ambulance(ambulance)
                .licenseNumber(request.getLicenseNumber())
                .build();

        AppUser savedUser = userRepo.save(user);
        ambulanceDriverRepo.save(driver);
        log.info("Ambulance driver registered: {}, vehicle: {}", savedUser.getUserEmail(), request.getVehicleRegNumber());

        return buildAuthResponse(savedUser);
    }

    public AuthResponse registerPoliceOfficer(PoliceOfficerRegisterRequestDto request) {
        log.info("Registering police officer: {}", request.getEmail());

        checkUserConflict(request.getGovernmentId(),request.getPhoneNumber(),request.getEmail());

        AppUser user = AppUser.builder()
                .userFullName(request.getFullName())
                .userEmail(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .governmentId(request.getGovernmentId())
                .userPassword(passwordEncoder.encode(request.getPassword()))
                .role(Role.POLICE_OFFICER)
                .securityQuestion(request.getSecurityQuestion())
                .securityAnswer(passwordEncoder.encode(request.getSecurityAnswer()))
                .verified(true)
                .build();

        PoliceStationEntity station = policeStationRepo.findById(request.getPoliceStationId())
                .orElseThrow(() -> {
                    log.error("No police station found with ID: {}", request.getPoliceStationId());
                    return new ResourceNotFoundException("No such Police Station exist");
                });

        log.info("Assigning officer {} to station {}", request.getFullName(), station.getStationName());

        PoliceOfficer officer = PoliceOfficer.builder()
                .fullName(request.getFullName())
                .policeStation(station)
                .policeOfficer(user)
                .build();

        AppUser savedUser = userRepo.save(user);
        policeOfficerRepo.save(officer);
        log.info("Police officer registered: {}", savedUser.getUserEmail());

        return buildAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {

        log.info("Login attempt for {}", request.getEmail());

        if(!userRepo.existsByUserEmail(request.getEmail())){
            log.warn("No user with this email {} exist",request.getEmail());
            throw new UnauthorizedException("Please create account first!");
        }

        AppUser user = userRepo.findByUserEmail(request.getEmail());
        if(user == null){
            log.warn("Invalid login attempt for with null credentials");
            throw new UnauthorizedException("Invalid login attempt for with null credentials");
        }
        if(!passwordEncoder.matches(request.getPassword(), user.getUserPassword())){
            log.warn("Invalid password entered for  email {}",request.getEmail());
            throw new UnauthorizedException("Invalid login attempt with incorrect password");
        }
        log.info("Login successful for {}", request.getEmail());
        return buildAuthResponse(user);

    }

    // ------------------ Helpers ------------------------

    private void checkUserConflict(String govId, String phone, String email) {
        if (userRepo.existsByGovernmentId(govId)) {
            log.error("Duplicate government ID: {}", govId);
            throw new ConflictException("User already exists with this Government ID");
        }

        if (userRepo.existsByUserEmail(email)) {
            log.error("Duplicate email exists: {}", email);
            throw new ConflictException("Email already registered");
        }

        if (userRepo.existsByPhoneNumber(phone)) {
            log.error("Duplicate phone number: {}", phone);
            throw new ConflictException("Phone number already registered");
        }
    }

    private void checkFireDriverConflict(String numberPlate, String license){
        if(fireTruckDriverRepo.existsByLicenseNumber(license)){
            log.error("Fire Driver with this license exist {}",license);
            throw new ConflictException("Fire Driver with this license exist");
        }

        if(fireTruckRepository.existsByVehicleRegNumber(numberPlate)){
            log.error("Fire Truck with number platen {} already exist",numberPlate);
            throw  new ConflictException("Fire Truck with this number plate exist");
        }
    }


    public void checkAmbulanceDriverConflict(String numberPlate, String license){
        if(ambulanceDriverRepo.existsByLicenseNumber(license)){
            log.error("Ambulance Driver with this license exist {}",license);
            throw new ConflictException("Ambulance Driver with this license exist");
        }

        if(ambulanceRepository.existsByAmbulanceRegNumber(numberPlate)){
            log.error("Ambulance with number plate {} already exist",numberPlate);
            throw  new ConflictException("Ambulance with this number plate exist");
        }
    }


    private AuthResponse buildAuthResponse(AppUser user) {
        return AuthResponse.builder()
                .token(jwtUtils.generateTokenFromEmail(user))
                .email(user.getUserEmail())
                .userId(user.getUserId())
                .role(user.getRole())
                .build();
    }
    public Map<String, String> getSecurityQuestion(String email) {
       AppUser user = userRepo.findByUserEmail(email);
        return Map.of("securityQuestion", user.getSecurityQuestion().toString());
    }

    public void resetPassword(ForgotPasswordDto dto) {
        AppUser user = userRepo.findByUserEmail(dto.getEmail());
        if(user==null){
            throw new ResourceNotFoundException("User with email " + dto.getEmail() + " not found.");
        }

        if (!passwordEncoder.matches(dto.getSecurityAnswer(), user.getSecurityAnswer())) {
            throw new IllegalArgumentException("Incorrect security answer");
        }

        user.setUserPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepo.save(user);
    }


    public void changePassword( ResetPasswordDto dto) {
        AppUser user = loggedUserUtil.getCurrentUser();
        log.info("Fetched user {}",user.getUserEmail());
        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getUserPassword())) {
            log.error("Incorrect current Password");
            throw new IllegalArgumentException("Incorrect current password.");
        }

        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            log.error("New password and confirm password do not match.");
            throw new IllegalArgumentException("New password and confirm password do not match.");
        }

        if (dto.getNewPassword().equals(dto.getCurrentPassword())) {
            log.error("New password cannot be same as current password.");
            throw new IllegalArgumentException("New password cannot be same as current password.");
        }
        log.warn("User password changed for email {}",user.getUserEmail());
        user.setUserPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepo.save(user);

    }


}
