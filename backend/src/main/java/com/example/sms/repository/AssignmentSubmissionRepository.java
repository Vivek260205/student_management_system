package com.example.sms.repository;

import com.example.sms.entity.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    List<AssignmentSubmission> findByStudentId(Long studentId);
    List<AssignmentSubmission> findByAssignmentId(Long assignmentId);
}
