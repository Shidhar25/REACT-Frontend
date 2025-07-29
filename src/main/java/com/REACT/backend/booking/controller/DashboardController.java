package com.REACT.backend.booking.controller;

import com.REACT.backend.booking.dto.DashboardStatsDto;
import com.REACT.backend.booking.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        log.info("Dashboard statistics requested");
        
        try {
            DashboardStatsDto stats = dashboardService.getDashboardStatistics();
            log.info("Dashboard statistics generated successfully");
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error generating dashboard statistics", e);
            throw e;
        }
    }
}
