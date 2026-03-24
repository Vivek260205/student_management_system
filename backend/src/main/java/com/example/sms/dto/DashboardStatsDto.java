package com.example.sms.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
    private long totalStudents;
    private long totalTeachers;
    private long presentToday;
    private long absentToday;
    private long pendingAssignments;
    private double attendancePercentage;
    private double averagePerformance;
}
