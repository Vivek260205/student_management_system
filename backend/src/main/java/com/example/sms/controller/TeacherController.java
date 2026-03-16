package com.example.sms.controller;

import com.example.sms.entity.Role;
import com.example.sms.entity.User;
import com.example.sms.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TeacherController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> list() {
        return userRepository.findAll().stream().filter(u -> u.getRoles().contains(Role.TEACHER)).toList();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(@Valid @RequestBody TeacherRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        User teacher = User.builder()
                .username(req.getUsername())
                .password(passwordEncoder.encode(req.getPassword()))
                .roles(Set.of(Role.TEACHER))
                .build();
        userRepository.save(teacher);
        return ResponseEntity.ok(teacher);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            if (user.getRoles().contains(Role.TEACHER)) {
                userRepository.delete(user);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.badRequest().body("Not a teacher");
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public static class TeacherRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
