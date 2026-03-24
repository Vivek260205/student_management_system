package com.example.sms.controller;

import com.example.sms.dto.DashboardStatsDto;
import com.example.sms.dto.AttendanceChartDto;
import com.example.sms.dto.StudentPerformanceDto;
import com.example.sms.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }

    @GetMapping("/weekly-attendance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AttendanceChartDto>> getWeeklyAttendance() {
        return ResponseEntity.ok(analyticsService.getWeeklyAttendance());
    }

    @GetMapping("/monthly-attendance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AttendanceChartDto>> getMonthlyAttendance() {
        return ResponseEntity.ok(analyticsService.getMonthlyAttendance());
    }

    @GetMapping("/student-performance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentPerformanceDto>> getStudentPerformance() {
        return ResponseEntity.ok(analyticsService.getStudentPerformance());
    }

    @GetMapping("/course-distribution")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Integer>> getCourseDistribution() {
        return ResponseEntity.ok(analyticsService.getCourseDistribution());
    }
}
