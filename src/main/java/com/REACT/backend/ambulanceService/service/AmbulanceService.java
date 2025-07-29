package com.REACT.backend.ambulanceService.service;

import com.REACT.backend.ambulanceService.dto.AmbulanceBookingHistoryResponseDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceDriverProfileDto;
import com.REACT.backend.ambulanceService.dto.AmbulanceDto;

import java.util.List;

public interface AmbulanceService {
    // define service methods here if needed

    List<AmbulanceDto> getAllAmbulances();
    AmbulanceDto getAmbulanceById(Long id);
    List<AmbulanceDto> getAmbulancesByHospitalId(Long hospitalId);

    List<AmbulanceBookingHistoryResponseDto> getHistoryOfAmbulance(Long ambulanceId);
    AmbulanceDriverProfileDto getProfile(Long ambulanceId);

}
