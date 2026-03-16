package com.example.sms.controller;

import com.example.sms.entity.Attendance;
import com.example.sms.entity.Student;
import com.example.sms.repository.AttendanceRepository;
import com.example.sms.repository.StudentRepository;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceController(AttendanceRepository attendanceRepository, StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public List<AttendanceRecord> getForDate(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate target = date != null ? date : LocalDate.now();
        List<Attendance> records = attendanceRepository.findByDate(target);
        Map<Long, Attendance> byStudent = records.stream().collect(Collectors.toMap(a -> a.getStudent().getId(), a -> a));

        // Return all students with default absent if no record exists
        return studentRepository.findAll().stream()
                .map(student -> {
                    Attendance attendance = byStudent.get(student.getId());
                    return new AttendanceRecord(student.getId(), student.getFirstName(), student.getLastName(), student.getEmail(), student.getCourse(), target, attendance != null && attendance.isPresent());
                })
                .collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<?> setForDate(@Valid @RequestBody AttendanceSubmission submission) {
        LocalDate date = submission.getDate() != null ? submission.getDate() : LocalDate.now();

        for (AttendanceEntry entry : submission.getEntries()) {
            studentRepository.findById(entry.getStudentId()).ifPresent(student -> {
                Attendance attendance = attendanceRepository.findByStudentAndDate(student, date)
                        .orElseGet(() -> {
                            Attendance a = new Attendance();
                            a.setStudent(student);
                            a.setDate(date);
                            return a;
                        });
                attendance.setPresent(entry.isPresent());
                attendanceRepository.save(attendance);
            });
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public AttendanceStats stats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        LocalDate endDate = end != null ? end : LocalDate.now();
        LocalDate startDate = start != null ? start : endDate.minusDays(29);

        List<Attendance> records = attendanceRepository.findByDateBetween(startDate, endDate);
        long totalDays = startDate.datesUntil(endDate.plusDays(1)).count();

        Map<Long, List<Attendance>> byStudent = records.stream().collect(Collectors.groupingBy(a -> a.getStudent().getId()));

        double averageAttendance = 0;
        if (!byStudent.isEmpty()) {
            double sum = byStudent.values().stream()
                    .mapToDouble(list -> list.stream().filter(Attendance::isPresent).count() / (double) totalDays)
                    .sum();
            averageAttendance = sum / byStudent.size() * 100.0;
        }

        Optional<Map.Entry<Long, Double>> best = byStudent.entrySet().stream()
                .map(e -> Map.entry(e.getKey(), e.getValue().stream().filter(Attendance::isPresent).count() / (double) totalDays))
                .max(Map.Entry.comparingByValue());

        Optional<Map.Entry<Long, Double>> worst = byStudent.entrySet().stream()
                .map(e -> Map.entry(e.getKey(), e.getValue().stream().filter(Attendance::isPresent).count() / (double) totalDays))
                .min(Map.Entry.comparingByValue());

        String bestStudent = best.flatMap(b -> studentRepository.findById(b.getKey()).map(s -> s.getFirstName() + " " + (s.getLastName() == null ? "" : s.getLastName()))).orElse("-");
        String worstStudent = worst.flatMap(b -> studentRepository.findById(b.getKey()).map(s -> s.getFirstName() + " " + (s.getLastName() == null ? "" : s.getLastName()))).orElse("-");

        return new AttendanceStats(
                Math.round(averageAttendance * 100.0) / 100.0,
                bestStudent,
                worstStudent
        );
    }

    @GetMapping("/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public List<DailyAttendance> daily(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        LocalDate endDate = end != null ? end : LocalDate.now();
        LocalDate startDate = start != null ? start : endDate.minusDays(29);

        long totalStudents = studentRepository.count();
        Map<LocalDate, Long> presentByDate = attendanceRepository.findByDateBetween(startDate, endDate).stream()
                .filter(Attendance::isPresent)
                .collect(Collectors.groupingBy(Attendance::getDate, Collectors.counting()));

        List<DailyAttendance> result = new ArrayList<>();
        startDate.datesUntil(endDate.plusDays(1)).forEach(date -> {
            long present = presentByDate.getOrDefault(date, 0L);
            long absent = Math.max(0, totalStudents - present);
            result.add(new DailyAttendance(date, present, absent));
        });
        return result;
    }

    @GetMapping("/percentages")
    @PreAuthorize("hasRole('ADMIN')")
    public List<StudentAttendancePercentage> percentages(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        LocalDate endDate = end != null ? end : LocalDate.now();
        LocalDate startDate = start != null ? start : endDate.minusDays(29);

        long totalDays = startDate.datesUntil(endDate.plusDays(1)).count();
        List<Attendance> records = attendanceRepository.findByDateBetween(startDate, endDate);

        Map<Long, Long> presentByStudent = records.stream()
                .filter(Attendance::isPresent)
                .collect(Collectors.groupingBy(a -> a.getStudent().getId(), Collectors.counting()));

        return studentRepository.findAll().stream()
                .map(student -> {
                    long present = presentByStudent.getOrDefault(student.getId(), 0L);
                    double percent = totalDays > 0 ? (present * 100.0 / totalDays) : 0;
                    return new StudentAttendancePercentage(student.getId(), student.getFirstName(), student.getLastName(), student.getCourse(), percent);
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/insights")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT')")
    public AttendanceCoach insights(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        LocalDate endDate = end != null ? end : LocalDate.now();
        LocalDate startDate = start != null ? start : endDate.minusDays(29);
        long totalDays = startDate.datesUntil(endDate.plusDays(1)).count();

        List<Attendance> records = attendanceRepository.findByDateBetween(startDate, endDate);
        Map<Long, List<Attendance>> byStudent = records.stream().collect(Collectors.groupingBy(a -> a.getStudent().getId()));

        double avgAttendance = byStudent.values().stream()
                .mapToDouble(list -> list.stream().filter(Attendance::isPresent).count() / (double) totalDays)
                .average().orElse(0) * 100;

        StudentAttendancePercentage best = byStudent.entrySet().stream().map(e -> {
            double a = e.getValue().stream().filter(Attendance::isPresent).count() / (double) totalDays * 100;
            return new StudentAttendancePercentage(e.getKey(), "", "", "", a);
        }).max(Comparator.comparingDouble(StudentAttendancePercentage::getPercentage)).map(p -> {
            Student s = studentRepository.findById(p.getStudentId()).orElse(null);
            return s == null ? null : new StudentAttendancePercentage(s.getId(), s.getFirstName(), s.getLastName(), s.getCourse(), p.getPercentage());
        }).orElse(null);

        StudentAttendancePercentage worst = byStudent.entrySet().stream().map(e -> {
            double a = e.getValue().stream().filter(Attendance::isPresent).count() / (double) totalDays * 100;
            return new StudentAttendancePercentage(e.getKey(), "", "", "", a);
        }).min(Comparator.comparingDouble(StudentAttendancePercentage::getPercentage)).map(p -> {
            Student s = studentRepository.findById(p.getStudentId()).orElse(null);
            return s == null ? null : new StudentAttendancePercentage(s.getId(), s.getFirstName(), s.getLastName(), s.getCourse(), p.getPercentage());
        }).orElse(null);

        List<StudentAttendancePercentage> risk = studentRepository.findAll().stream()
                .map(student -> {
                    double percent = byStudent.getOrDefault(student.getId(), Collections.emptyList()).stream().filter(Attendance::isPresent).count() / (double) totalDays * 100;
                    return new StudentAttendancePercentage(student.getId(), student.getFirstName(), student.getLastName(), student.getCourse(), percent);
                })
                .filter(s -> s.getPercentage() < 60)
                .collect(Collectors.toList());

        return new AttendanceCoach(
                Math.round(avgAttendance * 100.0) / 100.0,
                best == null ? "-" : best.getFirstName() + " " + best.getLastName(),
                worst == null ? "-" : worst.getFirstName() + " " + worst.getLastName(),
                risk
        );
    }

    public static class AttendanceCoach {
        private final double averageAttendance;
        private final String mostRegularStudent;
        private final String lowestAttendanceStudent;
        private final List<StudentAttendancePercentage> riskStudents;

        public AttendanceCoach(double averageAttendance, String mostRegularStudent, String lowestAttendanceStudent, List<StudentAttendancePercentage> riskStudents) {
            this.averageAttendance = averageAttendance;
            this.mostRegularStudent = mostRegularStudent;
            this.lowestAttendanceStudent = lowestAttendanceStudent;
            this.riskStudents = riskStudents;
        }

        public double getAverageAttendance() { return averageAttendance; }
        public String getMostRegularStudent() { return mostRegularStudent; }
        public String getLowestAttendanceStudent() { return lowestAttendanceStudent; }
        public List<StudentAttendancePercentage> getRiskStudents() { return riskStudents; }
    }

    public static class DailyAttendance {
        private LocalDate date;
        private long present;
        private long absent;

        public DailyAttendance(LocalDate date, long present, long absent) {
            this.date = date;
            this.present = present;
            this.absent = absent;
        }

        public LocalDate getDate() { return date; }
        public long getPresent() { return present; }
        public long getAbsent() { return absent; }
    }

    public static class StudentAttendancePercentage {
        private Long studentId;
        private String firstName;
        private String lastName;
        private String course;
        private double percentage;

        public StudentAttendancePercentage(Long studentId, String firstName, String lastName, String course, double percentage) {
            this.studentId = studentId;
            this.firstName = firstName;
            this.lastName = lastName;
            this.course = course;
            this.percentage = percentage;
        }

        public Long getStudentId() { return studentId; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public String getCourse() { return course; }
        public double getPercentage() { return percentage; }
    }

    public static class AttendanceRecord {
        private Long studentId;
        private String firstName;
        private String lastName;
        private String email;
        private String course;
        private LocalDate date;
        private boolean present;

        public AttendanceRecord(Long studentId, String firstName, String lastName, String email, String course, LocalDate date, boolean present) {
            this.studentId = studentId;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.course = course;
            this.date = date;
            this.present = present;
        }

        public Long getStudentId() { return studentId; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public String getEmail() { return email; }
        public String getCourse() { return course; }
        public LocalDate getDate() { return date; }
        public boolean isPresent() { return present; }
    }

    public static class AttendanceSubmission {
        private LocalDate date;
        private List<AttendanceEntry> entries;

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public List<AttendanceEntry> getEntries() { return entries; }
        public void setEntries(List<AttendanceEntry> entries) { this.entries = entries; }
    }

    public static class AttendanceEntry {
        private Long studentId;
        private boolean present;

        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        public boolean isPresent() { return present; }
        public void setPresent(boolean present) { this.present = present; }
    }

    public static class AttendanceStats {
        private double averageAttendance;
        private String mostRegularStudent;
        private String lowestAttendanceStudent;

        public AttendanceStats(double averageAttendance, String mostRegularStudent, String lowestAttendanceStudent) {
            this.averageAttendance = averageAttendance;
            this.mostRegularStudent = mostRegularStudent;
            this.lowestAttendanceStudent = lowestAttendanceStudent;
        }

        public double getAverageAttendance() { return averageAttendance; }
        public String getMostRegularStudent() { return mostRegularStudent; }
        public String getLowestAttendanceStudent() { return lowestAttendanceStudent; }
    }
}
