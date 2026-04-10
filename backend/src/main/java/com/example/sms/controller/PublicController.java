package com.example.sms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class PublicController {

    @GetMapping("/")
    public ResponseEntity<String> root() {
        return ResponseEntity.ok("Student Management System Backend is Running");
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "ok",
            "message", "Backend is running"
        ));
    }
}