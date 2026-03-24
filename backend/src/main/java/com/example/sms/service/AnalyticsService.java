package com.example.sms.service;

import com.example.sms.dto.DashboardStatsDto;
import com.example.sms.dto.AttendanceChartDto;
import com.example.sms.dto.StudentPerformanceDto;
import com.example.sms.entity.*;
import com.example.sms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final CourseRepository courseRepository;

    public DashboardStatsDto getDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalTeachers = userRepository.countByRoles(Role.TEACHER);
        
        LocalDate today = LocalDate.now();
        long presentToday = attendanceRepository.countByDateAndPresent(today, true);
        long absentToday = attendanceRepository.countByDateAndPresent(today, false);
        
        double attendancePercentage = totalStudents > 0 ? (presentToday * 100.0) / totalStudents : 0;
        long pendingAssignments = assignmentRepository.count();
        double averagePerformance = calculateAveragePerformance();

        return DashboardStatsDto.builder()
                .totalStudents(totalStudents)
                .totalTeachers(totalTeachers)
                .presentToday(presentToday)
                .absentToday(absentToday)
                .pendingAssignments(pendingAssignments)
                .attendancePercentage(attendancePercentage)
                .averagePerformance(averagePerformance)
                .build();
    }

    public List<AttendanceChartDto> getWeeklyAttendance() {
        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(6);
        return getAttendanceChartData(sevenDaysAgo, today);
    }

    public List<AttendanceChartDto> getMonthlyAttendance() {
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysAgo = today.minusDays(29);
        return getAttendanceChartData(thirtyDaysAgo, today);
    }

    private List<AttendanceChartDto> getAttendanceChartData(LocalDate from, LocalDate to) {
        List<Attendance> attendances = attendanceRepository.findByDateBetween(from, to);
        Map<LocalDate, Long> presentCount = new HashMap<>();
        Map<LocalDate, Long> totalCount = new HashMap<>();

        attendances.forEach(a -> {
            presentCount.put(a.getDate(), presentCount.getOrDefault(a.getDate(), 0L) + (a.isPresent() ? 1 : 0));
            totalCount.put(a.getDate(), totalCount.getOrDefault(a.getDate(), 0L) + 1);
        });

        return presentCount.keySet().stream()
                .sorted()
                .map(date -> {
                    long present = presentCount.getOrDefault(date, 0L);
                    long total = totalCount.getOrDefault(date, 0L);
                    int absent = (int) (total - present);
                    double percentage = total > 0 ? (present * 100.0) / total : 0;

                    return AttendanceChartDto.builder()
                            .date(date)
                            .present((int) present)
                            .absent(absent)
                            .percentage(percentage)
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<StudentPerformanceDto> getStudentPerformance() {
        List<Student> students = studentRepository.findAll();
        return students.stream()
                .map(this::calculateStudentPerformance)
                .collect(Collectors.toList());
    }

    public Map<String, Integer> getCourseDistribution() {
        List<Student> students = studentRepository.findAll();
        return students.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getCourse() != null ? s.getCourse() : "Unassigned",
                        Collectors.summingInt(s -> 1)
                ));
    }

    private StudentPerformanceDto calculateStudentPerformance(Student student) {
        double attendancePercentage = calculateAttendancePercentage(student.getId());
        double assignmentPercentage = calculateAssignmentPercentage(student.getId());
        double performanceScore = (attendancePercentage * 0.7) + (assignmentPercentage * 0.3);
        String performanceLevel = getPerformanceLevel(performanceScore);

        return StudentPerformanceDto.builder()
                .studentId(student.getId())
                .name(student.getFirstName() + " " + (student.getLastName() != null ? student.getLastName() : ""))
                .attendance(Math.round(attendancePercentage * 100.0) / 100.0)
                .assignments(Math.round(assignmentPercentage * 100.0) / 100.0)
                .performanceScore(Math.round(performanceScore * 100.0) / 100.0)
                .performanceLevel(performanceLevel)
                .courseName(student.getCourse() != null ? student.getCourse() : "N/A")
                .build();
    }

    private double calculateAttendancePercentage(Long studentId) {
        List<Attendance> attendances = attendanceRepository.findByStudentId(studentId);
        if (attendances.isEmpty()) return 0;
        long present = attendances.stream().filter(Attendance::isPresent).count();
        return (present * 100.0) / attendances.size();
    }

    private double calculateAssignmentPercentage(Long studentId) {
        List<AssignmentSubmission> submissions = submissionRepository.findByStudentId(studentId);
        if (submissions.isEmpty()) return 0;
        long submitted = submissions.stream().filter(AssignmentSubmission::isSubmitted).count();
        return (submitted * 100.0) / submissions.size();
    }

    private String getPerformanceLevel(double score) {
        if (score >= 85) return "Excellent";
        if (score >= 70) return "Good";
        if (score >= 55) return "Average";
        return "Poor";
    }

    private double calculateAveragePerformance() {
        List<Student> students = studentRepository.findAll();
        if (students.isEmpty()) return 0;
        return students.stream()
                .mapToDouble(s -> {
                    double attendance = calculateAttendancePercentage(s.getId());
                    double assignments = calculateAssignmentPercentage(s.getId());
                    return (attendance * 0.7) + (assignments * 0.3);
                })
                .average()
                .orElse(0);
    }
}
