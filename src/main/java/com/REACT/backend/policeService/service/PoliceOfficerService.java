package com.REACT.backend.policeService.service;

import com.REACT.backend.common.dto.CompleteAssignmentResponseDto;
import com.REACT.backend.common.dto.LocationDto;
import com.REACT.backend.policeService.dto.PoliceOfficerResponseDto;

public interface PoliceOfficerService {

    /**
     * Get location details of current emergency request assigned to the officer
     * @param officer - The logged-in police officer
     * @return Location details of the current request
     */
    LocationDto getLocationOfCurrentBooking(Object officer);

    /**
     * Mark the current police assignment as completed
     * @param officer - The logged-in police officer
     * @return Assignment completion details with duration
     */
    CompleteAssignmentResponseDto completeAssignment(Object officer);

    PoliceOfficerResponseDto getMe();
}
