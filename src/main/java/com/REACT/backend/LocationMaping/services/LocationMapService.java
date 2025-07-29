package com.REACT.backend.LocationMaping.services;

import com.REACT.backend.LocationMaping.dto.LocationMapDto;

public interface LocationMapService {
    LocationMapDto getLocationMap(Long emergencyRequestId);
}
