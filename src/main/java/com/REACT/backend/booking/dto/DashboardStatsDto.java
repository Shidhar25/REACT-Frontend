package com.REACT.backend.booking.dto;

import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.Instant;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DashboardStatsDto {
    
    @JsonProperty("timestamp")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private Instant timestamp;
    
    // Total system counts
    @NotNull
    @PositiveOrZero
    @JsonProperty("total_bookings")
    private Long totalBookings;
    
    @NotNull
    @PositiveOrZero
    @JsonProperty("total_ambulances")
    private Long totalAmbulances;
    
    @NotNull
    @PositiveOrZero
    @JsonProperty("total_fire_trucks")
    private Long totalFireTrucks;
    
    @NotNull
    @PositiveOrZero
    @JsonProperty("total_fire_stations")
    private Long totalFireStations;
    
    @NotNull
    @PositiveOrZero
    @JsonProperty("total_hospitals")
    private Long totalHospitals;
    
    @NotNull
    @PositiveOrZero
    @JsonProperty("total_police_officers")
    private Long totalPoliceOfficers;
    
    @NotNull
    @PositiveOrZero
    @JsonProperty("total_police_stations")
    private Long totalPoliceStations;
    
    @NotNull
    @PositiveOrZero
    @JsonProperty("total_users")
    private Long totalUsers;
    
    // Service-specific booking counts
    @NotNull
    @PositiveOrZero
    @JsonProperty("ambulance_bookings")
    private Long ambulanceBookings;
    
    @NotNull
    @PositiveOrZero
    @JsonProperty("fire_service_bookings")
    private Long fireServiceBookings;
    
    @NotNull
    @PositiveOrZero
    @JsonProperty("police_service_bookings")
    private Long policeServiceBookings;
    
    // Status-based booking counts
    @NotNull
    @PositiveOrZero
    @JsonProperty("pending_bookings")
    private Long pendingBookings;
    
    @NotNull
    @PositiveOrZero
    @JsonProperty("in_progress_bookings")
    private Long inProgressBookings;
    
    @NotNull
    @PositiveOrZero
    @JsonProperty("completed_bookings")
    private Long completedBookings;
    
    @NotNull
    @PositiveOrZero
    @JsonProperty("partially_assigned_bookings")
    private Long partiallyAssignedBookings;
    
    // Performance metrics
    @PositiveOrZero
    @JsonProperty("average_completion_time_minutes")
    private Double averageCompletionTimeMinutes;
    
    // Service availability metrics
    @NotNull
    @PositiveOrZero
    @JsonProperty("available_ambulances")
    private Long availableAmbulances;
    
    @NotNull
    @PositiveOrZero
    @JsonProperty("available_fire_trucks")
    private Long availableFireTrucks;
    
    @NotNull
    @PositiveOrZero
    @JsonProperty("busy_ambulances")
    private Long busyAmbulances;
    
    @NotNull
    @PositiveOrZero
    @JsonProperty("busy_fire_trucks")
    private Long busyFireTrucks;
    
    // Calculated efficiency metrics
    @JsonProperty("ambulance_utilization_rate")
    public Double getAmbulanceUtilizationRate() {
        if (totalAmbulances == null || totalAmbulances == 0) return 0.0;
        return (busyAmbulances.doubleValue() / totalAmbulances.doubleValue()) * 100;
    }
    
    @JsonProperty("fire_truck_utilization_rate")
    public Double getFireTruckUtilizationRate() {
        if (totalFireTrucks == null || totalFireTrucks == 0) return 0.0;
        return (busyFireTrucks.doubleValue() / totalFireTrucks.doubleValue()) * 100;
    }
    
    @JsonProperty("booking_completion_rate")
    public Double getBookingCompletionRate() {
        if (totalBookings == null || totalBookings == 0) return 0.0;
        return (completedBookings.doubleValue() / totalBookings.doubleValue()) * 100;
    }
}
