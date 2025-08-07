package com.REACT.backend.booking.service;

import com.REACT.backend.ambulanceService.dto.AmbulanceDto;
import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
import com.REACT.backend.ambulanceService.repository.AmbulanceRepository;

import com.REACT.backend.booking.dto.BookingRequestDto;
import com.REACT.backend.booking.dto.BookingResponseDto;
import com.REACT.backend.booking.dto.BookingSummeryDto;
import com.REACT.backend.booking.dto.BookingDto;
import com.REACT.backend.booking.model.EmergencyRequestEntity;
import com.REACT.backend.booking.model.BookingLogEntity;
import com.REACT.backend.booking.model.EmergencyRequestStatus;
import com.REACT.backend.booking.repository.BookingLogRepository;
import com.REACT.backend.booking.repository.EmergencyRequestRepository;
import com.REACT.backend.common.util.DispatchUtils;

import com.REACT.backend.fireService.dto.FireTruckDto;

import com.REACT.backend.fireService.model.FireTruckEntity;

import com.REACT.backend.fireService.model.FireTruckStatus;
import com.REACT.backend.fireService.repository.FireTruckRepository;

import com.REACT.backend.policeService.model.PoliceStationEntity;
import com.REACT.backend.policeService.repository.PoliceStationRepository;

import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final AmbulanceRepository ambulanceRepository;
    private final PoliceStationRepository policeStationRepository;
    private final FireTruckRepository fireTruckRepository;
    private final UserRepository userRepository;
    private final EmergencyRequestRepository requestRepo;
    private final BookingLogRepository logRepo;
    private static final int MAX_RADIUS_KM = 25;

    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto requestDto, Long requestedById) {

        if(!requestDto.isNeedPolice() && !requestDto.isNeedAmbulance() && !requestDto.isNeedFireBrigade()
        ){
            throw new IllegalArgumentException("None of the service requested");
        }

        log.info("🚨 New booking request received from userId {} for issue '{}'", requestedById, requestDto.getIssueType());


        // 🏥 1. Assign ambulances
        List<AmbulanceEntity> assignedAmbulances = new ArrayList<>();
        if (requestDto.isNeedAmbulance()) {
            log.info("Ambulance required: Searching for {} ambulances near [{}, {}]",
                    requestDto.getRequestedAmbulanceCount(), requestDto.getLatitude(), requestDto.getLongitude());
            assignedAmbulances = findNearestAmbulances(
                    requestDto.getLatitude(),
                    requestDto.getLongitude(),
                    requestDto.getRequestedAmbulanceCount()

            );
            log.info("Ambulances assigned: {}", assignedAmbulances.stream().map(AmbulanceEntity::getId).toList());

        }
        Map<AmbulanceEntity, AmbulanceStatus> ambulanceStatusMap = new HashMap<>();
        for (AmbulanceEntity amb : assignedAmbulances) {
            ambulanceStatusMap.put(amb, AmbulanceStatus.EN_ROUTE);
        }


        // 🚓 2. Assign police
        String policeStatus = "";
        Map<PoliceStationEntity,Integer> assignedPoliceMap = new HashMap<>();
        if (requestDto.isNeedPolice()) {
            log.info("Police required: {} officers near [{}, {}]",
                    requestDto.getRequestedPoliceCount(), requestDto.getLatitude(), requestDto.getLongitude());
            assignedPoliceMap = assignPoliceOfficers(
                    requestDto.getLatitude(),
                    requestDto.getLongitude(),
                    requestDto.getRequestedPoliceCount()
            );



            if (!assignedPoliceMap.isEmpty()) {
                policeStatus = (calculateTotalOfficers(assignedPoliceMap) == requestDto.getRequestedPoliceCount())
                        ? "FULLY_ASSIGNED"
                        : "PARTIALLY_ASSIGNED";
            }
            else{
                policeStatus = "NOT_REQUESTED";
            }
            log.info("Police assignment: {}", assignedPoliceMap.entrySet()
                    .stream().map(e -> e.getKey().getStationName() + "=" + e.getValue()).toList());
        }

        // 🔥 3. Assign fire trucks
        List<FireTruckEntity> assignedFireTruckEntities = new ArrayList<>();
        if (requestDto.isNeedFireBrigade()) {
            log.info("Fire truck required: {} units near [{}, {}]",
                    requestDto.getRequestedFireTruckCount(), requestDto.getLatitude(), requestDto.getLongitude());
            assignedFireTruckEntities = findAvailableFireTrucks(
                    requestDto.getLatitude(),
                    requestDto.getLongitude(),
                    requestDto.getRequestedFireTruckCount()
            );

        }
        Map<FireTruckEntity, FireTruckStatus> fireTruckStatusMap = new HashMap<>();
        for (FireTruckEntity truck : assignedFireTruckEntities) {
            fireTruckStatusMap.put(truck, FireTruckStatus.EN_ROUTE);
        }



        // 👮‍♂️ 4. Resolve user
        AppUser requestedBy = userRepository.findById(requestedById)
                .orElseThrow(()->new RuntimeException("No suh user exist"));

        // 📌 5. Save Emergency Request
        EmergencyRequestEntity requestEntity = EmergencyRequestEntity.builder()
                //location
                .latitude(requestDto.getLatitude())
                .longitude(requestDto.getLongitude())
                .issueType(requestDto.getIssueType())
                //requirements
                .needAmbulance(requestDto.isNeedAmbulance())
                .needPolice(requestDto.isNeedPolice())
                .needFireBrigade(requestDto.isNeedFireBrigade())
                // requirement count
                .requestedFireTruckCount(requestDto.getRequestedFireTruckCount())
                .requestedPoliceCount(requestDto.getRequestedPoliceCount())
                .requestedAmbulancesCount(requestDto.getRequestedAmbulanceCount())
                //general details
                .isForSelf(requestDto.isForSelf())
                .victimPhoneNumber(requestDto.isForSelf() ? null : requestDto.getVictimPhoneNumber())
                .notes(requestDto.getNotes())
                // request knowledge
                .emergencyRequestStatus(EmergencyRequestStatus.PENDING)
                .requestedBy(requestedBy)
                .createdAt(Instant.now())
                //fulfillment fro request
                .assignedAmbulances(assignedAmbulances)
                .assignedFireTruckEntities(assignedFireTruckEntities)
                .assignedPoliceMap(assignedPoliceMap)
                .ambulanceStatusMap(ambulanceStatusMap)
                .fireTruckStatusMap(fireTruckStatusMap)
                .build();

        requestRepo.save(requestEntity);
        log.info("Emergency Request saved with id:"+requestEntity.getId());

        // 🧯 6. Update statuses
        assignedAmbulances.forEach(amb -> {
            amb.setStatus(AmbulanceStatus.EN_ROUTE);
            amb.setLastUpdated(Instant.now());
            ambulanceRepository.save(amb);
        });

        assignedFireTruckEntities.forEach(truck -> {
            truck.setStatus(FireTruckStatus.EN_ROUTE);
            truck.setLastUpdated(Instant.now());
            fireTruckRepository.save(truck);
        });

        log.info("Status update for each service");

        // Update police station availability




        // ✅ 7. Compute status messages
        String ambStatus = DispatchUtils.ambulanceStatus(
                assignedAmbulances.size(), requestDto.getRequestedAmbulanceCount()
        );
        String fireStatus = DispatchUtils.fireTruckStatus(
                assignedFireTruckEntities.size(), requestDto.getRequestedFireTruckCount()
        );
        log.info("Ambulance assignment status {} || Fire brigade Assignment status{}",ambStatus,fireStatus);


        // 📖 8. Booking log
        BookingLogEntity logg = BookingLogEntity.builder()
                .createdAt(Instant.now())
                .statusMessage("Ambulance: " + ambStatus + ", Police: " + policeStatus+ ", Fire: " + fireStatus)
                .emergencyRequest(requestEntity)
                .assignedAmbulance(assignedAmbulances) // keep for now
                .assignedFireTruckEntities(assignedFireTruckEntities)
                .assignedPoliceMap(assignedPoliceMap)
                .build();

        BookingLogEntity savedLog = logRepo.save(logg);
        log.info("Booking log saved with id {}",logg.getId());




        log.info("Started building booking Response dto");

        Map<String, Integer> policeDtoMap = assignedPoliceMap.entrySet().stream()
                .collect(Collectors.toMap(
                        e -> e.getKey().getStationName(),  // or getName()
                        Map.Entry::getValue
                ));

        log.info("Booking process completed successfully for user {}. Returning response.", requestedBy.getUserEmail());


        // 🧾 9. Build response
        return BookingResponseDto.builder()
                .issueType(requestDto.getIssueType())
                .victimPhoneNumber(requestDto.isForSelf() ? null : requestDto.getVictimPhoneNumber())
                .ambulanceStatus(ambStatus)
                .assignedAmbulances(assignedAmbulances
                        .stream()
                        .map(AmbulanceDto::new)
                        .collect(Collectors.toList()))
                .policeStatus(policeStatus)
                .assignedPoliceMap(policeDtoMap)
                .fireTruckStatus(fireStatus)
                .assignedFireTrucks(assignedFireTruckEntities
                        .stream()
                        .map(FireTruckDto::new)
                        .toList()
                )
                .notes(String.format("Ambulances assigned %s, Police Assigned %s, Fire Trucks Assigned %s",
                        ambStatus, policeStatus, fireStatus))
                .build();
    }

    public List<AmbulanceEntity> findNearestAmbulances(double lat, double lng, int requiredCount) {
        List<AmbulanceEntity> assigned = new ArrayList<>();

        for (int radius = 1000; radius <= MAX_RADIUS_KM * 1000; radius += 1000) {
            List<AmbulanceEntity> ambulances = ambulanceRepository.findAvailableWithinRadius(lat, lng, radius);
            System.out.println("🚑 Found " + ambulances.size() + " ambulances within radius " + radius);

            for (AmbulanceEntity amb : ambulances) {
                if (!assigned.contains(amb)) {
                    assigned.add(amb);
                    if (assigned.size() == requiredCount) {
                        return assigned;
                    }
                }
            }
        }
        log.info("Ambulances assigned: {}", assigned.stream().map(AmbulanceEntity::getId).toList());
        return assigned;
    }

    public List<PoliceStationEntity> getStationsByProximity(double lat, double lng) {
        return policeStationRepository.findAllByProximity(lat, lng);
    }

    public List<FireTruckEntity> findAvailableFireTrucks(double lat, double lng, int requiredCount) {
        List<FireTruckEntity> assigned = new ArrayList<>();
        for (int radius = 1000; radius <= MAX_RADIUS_KM * 1000; radius += 1000) {
            List<FireTruckEntity> trucks = fireTruckRepository.findAvailableWithinRadius(lat, lng, radius);
            System.out.println("🚑 Found " + trucks.size() + " ambulances within radius " + radius);
            for (FireTruckEntity truck : trucks) {
                if (!assigned.contains(truck)) {
                    assigned.add(truck);
                    if (assigned.size() == requiredCount) {
                        return assigned;
                    }
                }
            }
        }
        return assigned;
    }

    private Map<PoliceStationEntity, Integer> assignPoliceOfficers(double lat, double lng, int requiredCount) {
        Map<PoliceStationEntity, Integer> result = new LinkedHashMap<>();
        int remaining = requiredCount;

        List<PoliceStationEntity> nearbyStations = policeStationRepository.findAllByProximity(lat, lng);

        for (PoliceStationEntity station : nearbyStations) {
            int available = station.getAvailableOfficers();
            if (available <= 0) continue;

            int toAssign = Math.min(available, remaining);
            result.put(station, toAssign);
            remaining -= toAssign;

            if (remaining <= 0) break;
        }

        return result;
    }

    private int calculateTotalOfficers(Map<PoliceStationEntity, Integer> map) {
        return map.values().stream().mapToInt(Integer::intValue).sum();
    }

    private String determineStatus(int assigned, int requested) {
        if (requested == 0) return "N/A";
        if (assigned == 0) return "NONE";
        if (assigned < requested) return "PARTIAL";
        return "FULL";
    }

    @Override
    public List<BookingSummeryDto> getBookingHistoryForUser(Long userId){
        log.debug("User requested booking history {}",requestRepo.findAllByRequestedById(userId));
        return requestRepo.findAllByRequestedById(userId).stream()
                .map((this::mapToSummaryDto))
                .toList();

    }

    @Override
    public BookingResponseDto getBookingDetailsByBookingId(Long bookingId) {
        EmergencyRequestEntity entity = requestRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not Found"));
        return mapToDetailedDto(entity);

    }

    @Override
    public BookingResponseDto deleteBookingById(Long bookingId, Long userId) throws AccessDeniedException {
        EmergencyRequestEntity entity = requestRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!entity.getRequestedBy().getUserId().equals(userId)) {
            throw  new AccessDeniedException("You are now owner of this request");
        }
        requestRepo.delete(entity);

        return mapToDetailedDto(requestRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not Found")));
    }



    private  BookingSummeryDto mapToSummaryDto(EmergencyRequestEntity entity){

        return BookingSummeryDto.builder()
                .requestId(entity.getId())
                .issueType(entity.getIssueType())
                .createdAt(entity.getCreatedAt())
                .status(entity.getEmergencyRequestStatus())
                .victimPhoneNumber(entity.getVictimPhoneNumber())
                .build();
    }

    private BookingResponseDto mapToDetailedDto(EmergencyRequestEntity entity) {
        return BookingResponseDto.builder()
                .issueType(entity.getIssueType())
                .victimPhoneNumber(entity.isForSelf() ? null : entity.getVictimPhoneNumber())

                // Ambulance status and assignment
                .ambulanceStatus(DispatchUtils.ambulanceStatus(
                        entity.getAssignedAmbulances().size(),
                        entity.getRequestedAmbulancesCount()))
                .assignedAmbulances(entity.getRequestedAmbulancesCount() > 0
                        ? entity.getAssignedAmbulances().stream()
                        .map(AmbulanceDto::new)
                        .collect(Collectors.toList())
                        : null)

                // Police status and assignment
                .policeStatus(DispatchUtils.policeStatus(
                        entity.getAssignedPoliceMap().values().stream().mapToInt(i -> i).sum(),
                        entity.getRequestedPoliceCount()))
                .assignedPoliceMap(entity.getRequestedPoliceCount() > 0
                        ? entity.getAssignedPoliceMap().entrySet().stream()
                        .collect(Collectors.toMap(
                                e -> e.getKey().getStationName(),
                                Map.Entry::getValue))
                        : null)

                // Fire truck status and assignment
                .fireTruckStatus(DispatchUtils.fireTruckStatus(
                        entity.getAssignedFireTruckEntities().size(),
                        entity.getRequestedFireTruckCount()))
                .assignedFireTrucks(entity.getRequestedFireTruckCount() > 0
                        ? entity.getAssignedFireTruckEntities().stream()
                        .map(FireTruckDto::new)
                        .collect(Collectors.toList())
                        : null)

                .notes(entity.getNotes())
                .build();
    }


    @Autowired
    EmergencyRequestRepository emergencyRequestRepository;

    public List<EmergencyRequestEntity> getActiveRequestsForAmbulance(AmbulanceEntity ambulance) {
        EmergencyRequestStatus targetStatus = EmergencyRequestStatus.PENDING;

        log.info("🔍 Fetching requests for ambulance {} with status {}", ambulance.getId(), targetStatus);
        List<EmergencyRequestEntity> result = emergencyRequestRepository.findByAssignedAmbulanceAndStatus(ambulance, targetStatus);

        log.info("✅ Found {} requests for ambulance {}", result.size(), ambulance.getId());
        return result;
    }

    private void ensureBookingCompletion(EmergencyRequestEntity requestEntity) {
        log.info("Checking if all services for request {} have completed", requestEntity.getId());

        // Check if all ambulance statuses are completed
        boolean ambulancesCompleted = requestEntity.getAmbulanceStatusMap().values().stream()
                .allMatch(status -> status == AmbulanceStatus.COMPLETED);

        // Check if all fire truck statuses are completed
        boolean fireTrucksCompleted = requestEntity.getFireTruckStatusMap().values().stream()
                .allMatch(status -> status == FireTruckStatus.COMPLETED);

        // Check if police assignments are fulfilled
        boolean policeCompleted = requestEntity.getAssignedPoliceMap().entrySet().stream()
                .allMatch(e -> e.getValue() >= 0);

        if (ambulancesCompleted && fireTrucksCompleted && policeCompleted) {
            requestEntity.setEmergencyRequestStatus(EmergencyRequestStatus.COMPLETED);
            log.info("Request {} is now marked as completed.", requestEntity.getId());
            requestRepo.save(requestEntity);
        }
    }

    // Dashboard API implementations
    @Override
    public List<BookingDto> getAllBookings() {
        log.info("Fetching all bookings from database");
        
        try {
            List<BookingDto> bookings = requestRepo.findAll().stream()
                    .map(BookingDto::new)
                    .collect(Collectors.toList());
            
            log.info("Successfully retrieved {} total bookings", bookings.size());
            return bookings;
        } catch (Exception e) {
            log.error("Error retrieving all bookings", e);
            throw new RuntimeException("Failed to retrieve all bookings", e);
        }
    }

    @Override
    public List<BookingDto> getAmbulanceBookings() {
        log.info("Fetching ambulance service bookings from database");
        
        try {
            List<BookingDto> ambulanceBookings = requestRepo.findAll().stream()
                    .filter(request -> request.isNeedAmbulance())
                    .map(BookingDto::new)
                    .collect(Collectors.toList());
                    
            log.info("Successfully retrieved {} ambulance bookings", ambulanceBookings.size());
            return ambulanceBookings;
        } catch (Exception e) {
            log.error("Error retrieving ambulance bookings", e);
            throw new RuntimeException("Failed to retrieve ambulance bookings", e);
        }
    }

    @Override
    public List<BookingDto> getFireServiceBookings() {
        log.info("Fetching fire service bookings from database");
        
        try {
            List<BookingDto> fireBookings = requestRepo.findAll().stream()
                    .filter(request -> request.isNeedFireBrigade())
                    .map(BookingDto::new)
                    .collect(Collectors.toList());
                    
            log.info("Successfully retrieved {} fire service bookings", fireBookings.size());
            return fireBookings;
        } catch (Exception e) {
            log.error("Error retrieving fire service bookings", e);
            throw new RuntimeException("Failed to retrieve fire service bookings", e);
        }
    }

    @Override
    public List<BookingDto> getPoliceServiceBookings() {
        log.info("Fetching police service bookings from database");
        
        try {
            List<BookingDto> policeBookings = requestRepo.findAll().stream()
                    .filter(request -> request.isNeedPolice())
                    .map(BookingDto::new)
                    .collect(Collectors.toList());
                    
            log.info("Successfully retrieved {} police service bookings", policeBookings.size());
            return policeBookings;
        } catch (Exception e) {
            log.error("Error retrieving police service bookings", e);
            throw new RuntimeException("Failed to retrieve police service bookings", e);
        }
    }

}
