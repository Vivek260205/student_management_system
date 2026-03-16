package com.example.sms.controller;

import com.example.sms.entity.Role;
import com.example.sms.entity.User;
import com.example.sms.repository.UserRepository;
import com.example.sms.security.JwtUtils;
import jakarta.validation.Valid;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        return userRepository.findByUsername(req.username)
                .map(user -> {
                    if (passwordEncoder.matches(req.password, user.getPassword())) {
                        Set<String> roles = user.getRoles().stream().map(Role::name).collect(Collectors.toSet());
                        String token = jwtUtils.generateToken(user.getUsername(), roles);
                        return ResponseEntity.ok(Map.of("token", token, "roles", roles, "username", user.getUsername()));
                    } else {
                        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
                    }
                })
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .map(user -> ResponseEntity.ok(Map.of(
                        "username", user.getUsername(),
                        "displayName", user.getDisplayName(),
                        "email", user.getEmail(),
                        "roles", user.getRoles()
                )))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }

    @Data
    static class LoginRequest {
        private String username;
        private String password;
    }
}
