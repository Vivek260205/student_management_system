package com.example.sms.controller;

import com.example.sms.entity.Activity;
import com.example.sms.repository.ActivityRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityRepository activityRepository;

    public ActivityController(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT')")
    public List<Activity> list() {
        return activityRepository.findAllByOrderByTimestampDesc();
    }
}
