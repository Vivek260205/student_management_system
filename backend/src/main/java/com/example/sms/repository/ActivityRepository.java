package com.example.sms.repository;

import com.example.sms.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findAllByOrderByTimestampDesc();
}
