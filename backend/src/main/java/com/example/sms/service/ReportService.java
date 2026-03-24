package com.example.sms.service;

import com.example.sms.dto.StudentPerformanceDto;
import com.example.sms.entity.Attendance;
import com.example.sms.entity.Student;
import com.example.sms.repository.AttendanceRepository;
import com.example.sms.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final AnalyticsService analyticsService;

    public String generateAttendanceReport(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Attendance> attendances = attendanceRepository.findByStudentId(studentId);
        
        StringBuilder report = new StringBuilder();
        report.append("ATTENDANCE REPORT\n");
        report.append("=================\n\n");
        report.append("Student: ").append(student.getFirstName()).append(" ").append(student.getLastName() != null ? student.getLastName() : "").append("\n");
        report.append("Email: ").append(student.getEmail()).append("\n");
        report.append("Course: ").append(student.getCourse() != null ? student.getCourse() : "N/A").append("\n\n");
        
        double presentCount = attendances.stream().filter(Attendance::isPresent).count();
        double percentage = attendances.isEmpty() ? 0 : (presentCount / attendances.size()) * 100;
        
        report.append("Total Days: ").append(attendances.size()).append("\n");
        report.append("Present: ").append((int)presentCount).append("\n");
        report.append("Absent: ").append(attendances.size() - (int)presentCount).append("\n");
        report.append("Attendance %: ").append(String.format("%.2f%%", percentage)).append("\n");
        
        return report.toString();
    }

    public String generateStudentPerformanceReport(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<StudentPerformanceDto> allPerformance = analyticsService.getStudentPerformance();
        StudentPerformanceDto studentPerf = allPerformance.stream()
                .filter(p -> p.getStudentId().equals(studentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Performance data not found"));

        StringBuilder report = new StringBuilder();
        report.append("PERFORMANCE REPORT\n");
        report.append("==================\n\n");
        report.append("Student: ").append(studentPerf.getName()).append("\n");
        report.append("Course: ").append(studentPerf.getCourseName()).append("\n\n");
        
        report.append("Metrics:\n");
        report.append("--------\n");
        report.append("Attendance: ").append(String.format("%.2f%%", studentPerf.getAttendance())).append("\n");
        report.append("Assignments: ").append(String.format("%.2f%%", studentPerf.getAssignments())).append("\n");
        report.append("Overall Score: ").append(String.format("%.2f%%", studentPerf.getPerformanceScore())).append("\n");
        report.append("Performance Level: ").append(studentPerf.getPerformanceLevel()).append("\n");
        
        return report.toString();
    }

    public String generateMonthlyReport() {
        StringBuilder report = new StringBuilder();
        report.append("MONTHLY ATTENDANCE REPORT\n");
        report.append("=========================\n\n");
        
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysAgo = today.minusDays(29);
        
        List<Attendance> monthlyAttendances = attendanceRepository.findByDateBetween(thirtyDaysAgo, today);
        long present = monthlyAttendances.stream().filter(Attendance::isPresent).count();
        long total = monthlyAttendances.size();
        
        report.append("Period: ").append(thirtyDaysAgo).append(" to ").append(today).append("\n\n");
        report.append("School Metrics:\n");
        report.append("---------------\n");
        report.append("Total Days: ").append((int)total).append("\n");
        report.append("Total Present: ").append((int)present).append("\n");
        report.append("Total Absent: ").append((int)(total - present)).append("\n");
        report.append("Average Attendance: ").append(String.format("%.2f%%", total > 0 ? (present * 100.0) / total : 0)).append("\n");
        
        return report.toString();
    }
}
