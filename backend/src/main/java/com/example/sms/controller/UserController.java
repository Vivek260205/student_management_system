package com.example.sms.controller;

import com.example.sms.entity.User;
import com.example.sms.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> list() {
        return userRepository.findAll();
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public User updateProfile(@RequestBody ProfileUpdate req, org.springframework.security.core.Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();
        if (req.getUsername() != null) user.setUsername(req.getUsername());
        if (req.getEmail() != null) user.setEmail(req.getEmail());
        if (req.getDisplayName() != null) user.setDisplayName(req.getDisplayName());
        if (req.getAvatarUrl() != null) user.setAvatarUrl(req.getAvatarUrl());
        userRepository.save(user);
        return user;
    }

    public static class ProfileUpdate {
        private String username;
        private String email;
        private String displayName;
        private String avatarUrl;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }
        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    }
}
