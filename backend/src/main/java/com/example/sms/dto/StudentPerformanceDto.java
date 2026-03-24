package com.example.sms.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentPerformanceDto {
    private Long studentId;
    private String name;
    private double attendance;
    private double assignments;
    private double performanceScore;
    private String performanceLevel;  // Excellent, Good, Average, Poor
    private String courseName;
}
