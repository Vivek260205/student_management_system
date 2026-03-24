package com.example.sms.controller;

import com.example.sms.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/attendance/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getAttendanceReport(@PathVariable Long studentId) {
        return ResponseEntity.ok(reportService.generateAttendanceReport(studentId));
    }

    @GetMapping("/performance/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getPerformanceReport(@PathVariable Long studentId) {
        return ResponseEntity.ok(reportService.generateStudentPerformanceReport(studentId));
    }

    @GetMapping("/monthly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getMonthlyReport() {
        return ResponseEntity.ok(reportService.generateMonthlyReport());
    }
}
