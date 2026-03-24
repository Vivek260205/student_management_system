package com.example.sms.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BulkStudentImportDto {
    private String name;
    private String email;
    private String phoneNumber;
    private String courseName;
    private String enrollmentNumber;
}
