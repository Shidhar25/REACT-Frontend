package com.REACT.backend.fireService.service;

import com.REACT.backend.fireService.dto.FireTruckDriverProfileDto;

import java.util.Optional;

public interface FireService {

    FireTruckDriverProfileDto getProfile(Long truckId);
}
