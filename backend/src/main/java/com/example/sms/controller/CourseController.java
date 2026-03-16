package com.example.sms.controller;

import com.example.sms.entity.*;
import com.example.sms.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public CourseController(CourseRepository courseRepository,
                            SubjectRepository subjectRepository,
                            UserRepository userRepository,
                            StudentRepository studentRepository) {
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT')")
    public List<Course> listCourses() {
        return courseRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Course createCourse(@Valid @RequestBody Course course) {
        return courseRepository.save(course);
    }

    @PostMapping("/subjects")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addSubject(@Valid @RequestBody SubjectRequest req) {
        Course course = courseRepository.findById(req.getCourseId()).orElseThrow();
        User teacher = userRepository.findById(req.getTeacherId()).orElseThrow();
        Subject subject = Subject.builder().name(req.getName()).course(course).teacher(teacher).build();
        subjectRepository.save(subject);
        return ResponseEntity.ok(subject);
    }

    @PostMapping("/subjects/enroll")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<?> enrollStudent(@Valid @RequestBody EnrollmentRequest req) {
        Student student = studentRepository.findById(req.getStudentId()).orElseThrow();
        Subject subject = subjectRepository.findById(req.getSubjectId()).orElseThrow();
        student.getSubjects().add(subject);
        studentRepository.save(student);
        return ResponseEntity.ok(Map.of("status", "enrolled"));
    }

    @GetMapping("/subjects")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT')")
    public List<Subject> listSubjects() {
        return subjectRepository.findAll();
    }

    public static class SubjectRequest {
        private Long courseId;
        private String name;
        private Long teacherId;

        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Long getTeacherId() { return teacherId; }
        public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }
    }

    public static class EnrollmentRequest {
        private Long studentId;
        private Long subjectId;

        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        public Long getSubjectId() { return subjectId; }
        public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    }
}
