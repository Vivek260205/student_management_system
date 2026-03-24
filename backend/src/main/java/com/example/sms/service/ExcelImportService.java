package com.example.sms.service;

import com.example.sms.dto.BulkStudentImportDto;
import com.example.sms.dto.ImportResultDto;
import com.example.sms.entity.Student;
import com.example.sms.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelImportService {

    private final StudentRepository studentRepository;

    public ImportResultDto importStudentsFromExcel(MultipartFile file) throws IOException {
        List<String> errors = new ArrayList<>();
        int successfulImports = 0;
        int totalRecords = 0;

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                totalRecords++;

                try {
                    BulkStudentImportDto studentData = parseRowToStudent(row);
                    
                    if (validateStudentData(studentData)) {
                        Student student = Student.builder()
                                .firstName(studentData.getName())
                                .email(studentData.getEmail())
                                .course(studentData.getCourseName())
                                .build();
                        
                        studentRepository.save(student);
                        successfulImports++;
                    } else {
                        errors.add("Row " + (i + 1) + ": Invalid data - missing required fields");
                    }
                } catch (Exception e) {
                    errors.add("Row " + (i + 1) + ": " + e.getMessage());
                }
            }
        } catch (IOException e) {
            errors.add("Error reading Excel file: " + e.getMessage());
        }

        int failedImports = totalRecords - successfulImports;

        return ImportResultDto.builder()
                .totalRecords(totalRecords)
                .successfulImports(successfulImports)
                .failedImports(failedImports)
                .errors(errors)
                .message(String.format("Import completed: %d successful, %d failed", successfulImports, failedImports))
                .build();
    }

    private BulkStudentImportDto parseRowToStudent(Row row) {
        return BulkStudentImportDto.builder()
                .name(getCellStringValue(row, 0))
                .email(getCellStringValue(row, 1))
                .phoneNumber(getCellStringValue(row, 2))
                .courseName(getCellStringValue(row, 3))
                .enrollmentNumber(getCellStringValue(row, 4))
                .build();
    }

    private String getCellStringValue(Row row, int cellIndex) {
        try {
            if (row.getCell(cellIndex) == null) {
                return "";
            }
            return row.getCell(cellIndex).getStringCellValue();
        } catch (Exception e) {
            return "";
        }
    }

    private boolean validateStudentData(BulkStudentImportDto data) {
        return data.getName() != null && !data.getName().trim().isEmpty()
                && data.getEmail() != null && !data.getEmail().trim().isEmpty();
    }
}
