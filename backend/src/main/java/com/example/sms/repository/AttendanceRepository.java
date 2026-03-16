package com.example.sms.repository;

import com.example.sms.entity.Attendance;
import com.example.sms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByStudentAndDateBetween(Student student, LocalDate start, LocalDate end);
    Optional<Attendance> findByStudentAndDate(Student student, LocalDate date);
    List<Attendance> findByDateBetween(LocalDate start, LocalDate end);
}
