package com.example.sms.controller;

import com.example.sms.entity.*;
import com.example.sms.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final ActivityRepository activityRepository;

    public AssignmentController(AssignmentRepository assignmentRepository,
                                AssignmentSubmissionRepository submissionRepository,
                                UserRepository userRepository,
                                SubjectRepository subjectRepository,
                                ActivityRepository activityRepository) {
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.activityRepository = activityRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT')")
    public List<AssignmentDto> listAssignments() {
        return assignmentRepository.findAll().stream().map(a -> new AssignmentDto(
                a.getId(),
                a.getTitle(),
                a.getDescription(),
                a.getDueDate(),
                a.getSubject() != null ? a.getSubject().getName() : "",
                a.getTeacher() != null ? a.getTeacher().getUsername() : ""
        )).collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<?> createAssignment(@Valid @RequestBody AssignmentRequest req, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();
        Subject subject = subjectRepository.findById(req.getSubjectId()).orElseThrow();
        Assignment assignment = Assignment.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .dueDate(req.getDueDate())
                .teacher(user)
                .subject(subject)
                .build();
        assignmentRepository.save(assignment);
        activityRepository.save(Activity.builder()
                .timestamp(LocalDateTime.now())
                .type("ASSIGNMENT")
                .message(String.format("%s created assignment '%s'", user.getUsername(), assignment.getTitle()))
                .build());
        return ResponseEntity.ok(assignment);
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitAssignment(@PathVariable Long id, @Valid @RequestBody SubmissionRequest req, Authentication auth) {
        Assignment assignment = assignmentRepository.findById(id).orElseThrow();
        User student = userRepository.findByUsername(auth.getName()).orElseThrow();
        AssignmentSubmission submission = submissionRepository.findByAssignmentId(id).stream()
                .filter(s -> s.getStudent().getId().equals(student.getId()))
                .findFirst()
                .orElse(AssignmentSubmission.builder().assignment(assignment).student(student).build());
        submission.setSubmitted(true);
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setComments(req.getComments());
        submissionRepository.save(submission);
        activityRepository.save(Activity.builder()
                .timestamp(LocalDateTime.now())
                .type("SUBMISSION")
                .message(String.format("%s submitted assignment '%s'", student.getUsername(), assignment.getTitle()))
                .build());
        return ResponseEntity.ok(submission);
    }

    @GetMapping("/submissions")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public List<AssignmentSubmission> listSubmissions() {
        return submissionRepository.findAll();
    }

    public static class AssignmentRequest {
        private String title;
        private String description;
        private LocalDate dueDate;
        private Long subjectId;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public LocalDate getDueDate() { return dueDate; }
        public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
        public Long getSubjectId() { return subjectId; }
        public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    }

    public static class SubmissionRequest {
        private String comments;

        public String getComments() { return comments; }
        public void setComments(String comments) { this.comments = comments; }
    }

    public static class AssignmentDto {
        private Long id;
        private String title;
        private String description;
        private LocalDate dueDate;
        private String subject;
        private String teacher;

        public AssignmentDto(Long id, String title, String description, LocalDate dueDate, String subject, String teacher) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.dueDate = dueDate;
            this.subject = subject;
            this.teacher = teacher;
        }

        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public LocalDate getDueDate() { return dueDate; }
        public String getSubject() { return subject; }
        public String getTeacher() { return teacher; }
    }
}
