package com.REACT.backend.ambulanceService.service;

import com.REACT.backend.ambulanceService.dto.AmbulanceLocationUpdateDto;

public interface AmbulanceLocationService {
    void updateLocation(AmbulanceLocationUpdateDto locationUpdateDto);
}
