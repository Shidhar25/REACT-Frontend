package com.REACT.backend.policeService.service.impl;

import com.REACT.backend.booking.dto.BookingDto;
import com.REACT.backend.booking.model.BookingLogEntity;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.repository.BookingLogRepository;
import com.REACT.backend.booking.repository.EmergencyRequestRepository;
import com.REACT.backend.common.dto.LocationDto;
import com.REACT.backend.common.exception.ResourceNotFoundException;
import com.REACT.backend.policeService.dto.PoliceOfficerResponseDto;
import com.REACT.backend.policeService.model.PoliceStationEntity;
import com.REACT.backend.policeService.repository.PoliceStationRepository;
import com.REACT.backend.policeService.service.PoliceAdminService;
import com.REACT.backend.users.model.PoliceOfficer;
import com.REACT.backend.users.repository.PoliceOfficerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PoliceAdminServiceImpl implements PoliceAdminService {

    private final PoliceStationRepository policeStationRepository;
    private final PoliceOfficerRepository policeOfficerRepository;
    private final BookingLogRepository bookingLogRepository;
    private final EmergencyRequestRepository emergencyRequestRepository;

    @Override
    public List<BookingDto> getBookingHistoryByStation(Long stationId) {
        log.info("Fetching booking history for police station ID: {}", stationId);

        // Verify the police station exists
        PoliceStationEntity station = policeStationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Police Station not found with ID: " + stationId));

        log.info("Found police station: {}", station.getStationName());

        // Get all booking logs for this police station
        List<BookingLogEntity> bookings = bookingLogRepository.findAllByPoliceStationId(stationId);

        log.info("Found {} bookings for police station ID: {}", bookings.size(), stationId);

        return bookings.stream()
                .map(BookingDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public LocationDto getRequestLocation(Long requestId) {
        log.info("Fetching location for emergency request ID: {}", requestId);

        EmergencyRequestEntity request = emergencyRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Emergency request not found with ID: " + requestId));

        log.info("Found emergency request with location: lat={}, lng={}",
                request.getLatitude(), request.getLongitude());

        return LocationDto.builder()
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();
    }

    @Override
    public List<PoliceOfficerResponseDto> getAllOfficersOfStation(Long stationId) {
        log.info("Fetching all police officers for station ID {}", stationId);

        PoliceStationEntity station = policeStationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("No police station found with id " + stationId));

        List<PoliceOfficer> officers = policeOfficerRepository.findByPoliceStation(station);

        return officers.stream()
                .map(PoliceOfficerResponseDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<PoliceOfficerResponseDto> getAllOfficers() {
        log.info("Get all police officers init");
        List<PoliceOfficer> list =  policeOfficerRepository.findAll();
        List<PoliceOfficerResponseDto> dto = new ArrayList<>();
        for(PoliceOfficer officer : list){
            dto.add(new PoliceOfficerResponseDto(officer));
        }
        return dto;
    }

    @Override
    public PoliceOfficerResponseDto getOfficer(Long policeId) {
        log.info("Police officer init {}",policeId);
        PoliceOfficer officer = policeOfficerRepository.findById(policeId)
                .orElseThrow(()-> new ResourceNotFoundException("No such police exist"));

        log.info("Police officer with given id found {}",officer.getPoliceOfficer().getUserEmail());
        return new PoliceOfficerResponseDto(officer);
    }
}
