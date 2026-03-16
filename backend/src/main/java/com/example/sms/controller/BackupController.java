package com.example.sms.controller;

import com.example.sms.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/backup")
public class BackupController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository assignmentSubmissionRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;

    public BackupController(UserRepository userRepository,
                            StudentRepository studentRepository,
                            AttendanceRepository attendanceRepository,
                            AssignmentRepository assignmentRepository,
                            AssignmentSubmissionRepository assignmentSubmissionRepository,
                            CourseRepository courseRepository,
                            SubjectRepository subjectRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.assignmentRepository = assignmentRepository;
        this.assignmentSubmissionRepository = assignmentSubmissionRepository;
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
    }

    @GetMapping
    public Map<String, Object> backup() {
        return Map.of(
                "users", userRepository.findAll(),
                "students", studentRepository.findAll(),
                "attendance", attendanceRepository.findAll(),
                "assignments", assignmentRepository.findAll(),
                "submissions", assignmentSubmissionRepository.findAll(),
                "courses", courseRepository.findAll(),
                "subjects", subjectRepository.findAll()
        );
    }
}
