package com.example.sms.controller;

import com.example.sms.dto.ImportResultDto;
import com.example.sms.service.ExcelImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/import")
@RequiredArgsConstructor
public class ImportController {

    private final ExcelImportService excelImportService;

    @PostMapping("/students/excel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ImportResultDto> importStudentsFromExcel(@RequestParam("file") MultipartFile file) throws IOException {
        if (!file.getOriginalFilename().endsWith(".xlsx")) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(excelImportService.importStudentsFromExcel(file));
    }
}
