package com.REACT.backend.fireService.service.impl;

import com.REACT.backend.booking.dto.BookingDto;
import com.REACT.backend.booking.dto.BookingRequestDto;
import com.REACT.backend.booking.dto.BookingResponseDto;
import com.REACT.backend.booking.model.BookingLogEntity;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.repository.BookingLogRepository;
import com.REACT.backend.booking.repository.EmergencyRequestRepository;
import com.REACT.backend.common.exception.ResourceNotFoundException;
import com.REACT.backend.common.util.LocationUtils;
import com.REACT.backend.fireService.dto.FireTruckDto;
import com.REACT.backend.fireService.dto.FireTruckLocationUpdateDto;
import com.REACT.backend.fireService.model.FireStationEntity;
import com.REACT.backend.fireService.model.FireTruckEntity;
import com.REACT.backend.fireService.repository.FireStationRepository;
import com.REACT.backend.fireService.repository.FireTruckRepository;
import com.REACT.backend.fireService.service.FireAdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FireAdminServiceImpl implements FireAdminService {

    private final FireStationRepository fireStationRepository;
    private final FireTruckRepository fireTruckRepository;
    private final BookingLogRepository bookingLogRepository;
    private final EmergencyRequestRepository emergencyRequestRepository;

    private final LocationUtils locationUtils;

    @Override
    public List<FireTruckDto> getTrucksByStation(Long stationId) {
        FireStationEntity station = fireStationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException("Fire Station not found"));

        return station.getFireTruckEntities().stream()
                .map(FireTruckDto::new)
                .collect(Collectors.toList());
    }

    public List<BookingDto> getBookingHistoryByStation(Long stationId) {
        log.info("Fetching booking history for fire station ID: {}", stationId);

        try {
            FireStationEntity station = fireStationRepository.findById(stationId)
                    .orElseThrow(() -> {
                        log.warn("Fire Station with ID {} not found", stationId);
                        return new ResourceNotFoundException("Fire Station not found");
                    });

            // Step 1: Get all fire trucks for this station
            List<FireTruckEntity> trucksFromStation = fireTruckRepository.findByFireStationEntity_Id(stationId);
            log.debug("Found {} fire trucks for station {}", trucksFromStation.size(), stationId);

            // Step 2: Get all emergency requests involving those trucks
            Set<EmergencyRequestEntity> emergenciesWithStationTrucks = new HashSet<>();
            for (FireTruckEntity truck : trucksFromStation) {
                List<EmergencyRequestEntity> assignedRequests = emergencyRequestRepository.findByAssignedFireTruckEntities(truck);
                log.debug("Found {} emergency requests for fire truck ID {}", assignedRequests.size(), truck.getFireTruckId());
                emergenciesWithStationTrucks.addAll(assignedRequests);
            }

            // Step 3: Convert EmergencyRequests to DTOs
            List<BookingDto> bookingDtos = new ArrayList<>();
            for (EmergencyRequestEntity emergency : emergenciesWithStationTrucks) {
                bookingDtos.add(new BookingDto(emergency));
            }
            log.debug("Total emergency-based bookings collected: {}", bookingDtos.size());

            // Step 4: Add BookingLog-based DTOs
            List<BookingLogEntity> logs = bookingLogRepository.findAllByStationId(stationId);
            log.debug("Found {} booking logs for station {}", logs.size(), stationId);
            for (BookingLogEntity logEntity : logs) {
                bookingDtos.add(new BookingDto(logEntity));
            }

            // Step 5: Sort by createdAt DESC
            bookingDtos.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
            log.info("Total combined bookings returned: {}", bookingDtos.size());

            return bookingDtos;

        } catch (ResourceNotFoundException ex) {
            // Already logged inside orElseThrow block
            throw ex;
        } catch (Exception ex) {
            log.error("Failed to fetch booking history for station ID {} due to unexpected error", stationId, ex);
            throw new RuntimeException("Internal error occurred while fetching booking history.");
        }
    }


    @Override
    public List<BookingDto> getBookingHistoryByTruck(Long truckId) {
        log.debug("Searching for truck:{}",truckId);
        FireTruckEntity entity = fireTruckRepository.findById(truckId)
                .orElseThrow(()-> new ResourceNotFoundException("No such fire truck exist"));
        log.debug("gathering Booking History for truck:{}",truckId);
        List<EmergencyRequestEntity> bookings = emergencyRequestRepository.findByAssignedFireTruckEntities(entity);
        log.debug("found {} associated emergencies",bookings.size());
        return bookings.stream().map(BookingDto::new).toList();
    }

    @Override
    public String updateLocation(FireTruckLocationUpdateDto dto) {
        FireTruckEntity entity = fireTruckRepository.findById(dto.getTruckId())
                .orElseThrow(()-> new ResourceNotFoundException("No such fire truck exist"));

        entity.setLocation(locationUtils.createPoint(dto.getLatitude(),dto.getLongitude()));
        fireTruckRepository.save(entity);
        return "Location of truck updated";
    }

}
