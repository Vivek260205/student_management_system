package com.example.sms.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceChartDto {
    private LocalDate date;
    private int present;
    private int absent;
    private double percentage;
}
