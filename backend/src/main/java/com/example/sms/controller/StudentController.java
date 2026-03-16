package com.example.sms.controller;

import com.example.sms.entity.Student;
import com.example.sms.repository.StudentRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public List<Student> list(@RequestParam(required = false) String search) {
        if (search == null || search.isBlank()) {
            return studentRepository.findAll();
        }
        String term = search.toLowerCase();
        return studentRepository.findAll().stream()
                .filter(s -> s.getFirstName().toLowerCase().contains(term)
                        || (s.getLastName() != null && s.getLastName().toLowerCase().contains(term))
                        || (s.getEmail() != null && s.getEmail().toLowerCase().contains(term))
                        || (s.getCourse() != null && s.getCourse().toLowerCase().contains(term)))
                .toList();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Student create(@Valid @RequestBody Student s) {
        return studentRepository.save(s);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<Student> get(@PathVariable Long id) {
        return studentRepository.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Student> update(@PathVariable Long id, @Valid @RequestBody Student s) {
        return studentRepository.findById(id).map(existing -> {
            existing.setFirstName(s.getFirstName());
            existing.setLastName(s.getLastName());
            existing.setEmail(s.getEmail());
            existing.setCourse(s.getCourse());
            existing.setDob(s.getDob());
            studentRepository.save(existing);
            return ResponseEntity.ok(existing);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return studentRepository.findById(id).map(existing -> {
            studentRepository.delete(existing);
            return ResponseEntity.ok().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
