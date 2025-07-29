package com.REACT.backend.booking.service;

import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
import com.REACT.backend.booking.dto.DashboardStatsDto;
import com.REACT.backend.booking.model.EmergencyRequestStatus;
import com.REACT.backend.booking.repository.EmergencyRequestRepository;
import com.REACT.backend.ambulanceService.repository.AmbulanceRepository;
import com.REACT.backend.fireService.model.FireTruckStatus;
import com.REACT.backend.fireService.repository.FireTruckRepository;
import com.REACT.backend.policeService.repository.PoliceStationRepository;
import com.REACT.backend.hospitalService.repository.HospitalRepository;
import com.REACT.backend.users.repository.UserRepository;
import com.REACT.backend.users.repository.PoliceOfficerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EmergencyRequestRepository emergencyRequestRepository;
    private final AmbulanceRepository ambulanceRepository;
    private final FireTruckRepository fireTruckRepository;
    private final PoliceStationRepository policeStationRepository;
    private final HospitalRepository hospitalRepository;
    private final UserRepository userRepository;
    private final PoliceOfficerRepository policeOfficerRepository;

    public DashboardStatsDto getDashboardStatistics() {
        log.info("Starting dashboard statistics calculation");

        try {
            // Total bookings
            long totalBookings = safeRepoCall(() -> emergencyRequestRepository.count(), "Total bookings");
            long ambulanceBookings = safeRepoCall(() -> emergencyRequestRepository.countByNeedAmbulance(true), "Ambulance bookings");
            long fireServiceBookings = safeRepoCall(() -> emergencyRequestRepository.countByNeedFireBrigade(true), "Fire service bookings");
            long policeServiceBookings = safeRepoCall(() -> emergencyRequestRepository.countByNeedPolice(true), "Police service bookings");

            // Request status
            long pendingBookings = safeRepoCall(() -> emergencyRequestRepository.countByEmergencyRequestStatus(EmergencyRequestStatus.PENDING), "Pending bookings");
            long inProgressBookings = safeRepoCall(() -> emergencyRequestRepository.countByEmergencyRequestStatus(EmergencyRequestStatus.IN_PROGRESS), "In-progress bookings");
            long completedBookings = safeRepoCall(() -> emergencyRequestRepository.countByEmergencyRequestStatus(EmergencyRequestStatus.COMPLETED), "Completed bookings");
            long partiallyAssignedBookings = safeRepoCall(() -> emergencyRequestRepository.countByEmergencyRequestStatus(EmergencyRequestStatus.PARTIALLY_ASSIGNED), "Partially assigned bookings");

            // Completion Time
            double averageCompletionTimeMinutes = safeRepoCall(() ->
                            emergencyRequestRepository.findAll().stream()
                                    .filter(er -> er.getEmergencyRequestStatus() == EmergencyRequestStatus.COMPLETED)
                                    .mapToLong(er -> Duration.between(er.getCreatedAt(), Instant.now()).toMinutes())
                                    .average()
                                    .orElse(0),
                    "Average completion time"
            );

            // Ambulance status
            long totalAmbulances = safeRepoCall(() -> ambulanceRepository.count(), "Total ambulances");
            long busyAmbulances = safeRepoCall(() -> ambulanceRepository.countByStatus(AmbulanceStatus.BUSY), "Busy ambulances");
            long availableAmbulances = Math.max(0, totalAmbulances - busyAmbulances);

            // Fire truck status
            long totalFireTrucks = safeRepoCall(() -> fireTruckRepository.count(), "Total fire trucks");
            long busyFireTrucks = safeRepoCall(() -> fireTruckRepository.countByStatus(FireTruckStatus.BUSY), "Busy fire trucks");
            long availableFireTrucks = Math.max(0, totalFireTrucks - busyFireTrucks);

            // Infra stats
            long totalFireStations = safeRepoCall(() -> fireTruckRepository.countDistinctByFireStationId(), "Fire stations");
            long totalHospitals = safeRepoCall(() -> hospitalRepository.count(), "Hospitals");
            long totalPoliceOfficers = safeRepoCall(() -> policeStationRepository.countTotalPoliceOfficers(), "Police officers");
            long totalPoliceStations = safeRepoCall(() -> policeStationRepository.count(), "Police stations");
            long totalUsers = safeRepoCall(() -> userRepository.count(), "Users");

            DashboardStatsDto stats = DashboardStatsDto.builder()
                    .timestamp(Instant.now())
                    .totalBookings(totalBookings)
                    .ambulanceBookings(ambulanceBookings)
                    .fireServiceBookings(fireServiceBookings)
                    .policeServiceBookings(policeServiceBookings)
                    .pendingBookings(pendingBookings)
                    .inProgressBookings(inProgressBookings)
                    .completedBookings(completedBookings)
                    .partiallyAssignedBookings(partiallyAssignedBookings)
                    .averageCompletionTimeMinutes(averageCompletionTimeMinutes)
                    .totalAmbulances(totalAmbulances)
                    .availableAmbulances(availableAmbulances)
                    .busyAmbulances(busyAmbulances)
                    .totalFireTrucks(totalFireTrucks)
                    .availableFireTrucks(availableFireTrucks)
                    .busyFireTrucks(busyFireTrucks)
                    .totalFireStations(totalFireStations)
                    .totalHospitals(totalHospitals)
                    .totalPoliceOfficers(totalPoliceOfficers)
                    .totalPoliceStations(totalPoliceStations)
                    .totalUsers(totalUsers)
                    .build();

            log.info("Dashboard statistics calculation completed successfully");
            return stats;

        } catch (Exception e) {
            log.error("Unexpected error while calculating dashboard statistics", e);
            throw new RuntimeException("Something went wrong while processing dashboard data", e);
        }
    }

    private <T> T safeRepoCall(RepoSupplier<T> supplier, String context) {
        try {
            return supplier.get();
        } catch (Exception ex) {
            log.warn("Error during [{}]: {}", context, ex.getMessage(), ex);
            return handleDefaultFor(context);
        }
    }

    @SuppressWarnings("unchecked")
    private <T> T handleDefaultFor(String context) {
        // Customize default returns here based on context
        if (context.contains("Average")) return (T) Double.valueOf(0);
        return (T) Long.valueOf(0);
    }

    @FunctionalInterface
    interface RepoSupplier<T> {
        T get() throws Exception;
    }
}
