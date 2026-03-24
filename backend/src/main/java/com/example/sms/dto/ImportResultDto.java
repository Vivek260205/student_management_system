package com.example.sms.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportResultDto {
    private int totalRecords;
    private int successfulImports;
    private int failedImports;
    private List<String> errors;
    private String message;
}
