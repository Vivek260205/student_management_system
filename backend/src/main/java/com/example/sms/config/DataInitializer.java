package com.example.sms.config;

import com.example.sms.entity.Attendance;
import com.example.sms.entity.Assignment;
import com.example.sms.entity.Course;
import com.example.sms.entity.Role;
import com.example.sms.entity.Student;
import com.example.sms.entity.Subject;
import com.example.sms.entity.User;
import com.example.sms.repository.ActivityRepository;
import com.example.sms.repository.AssignmentRepository;
import com.example.sms.repository.AssignmentSubmissionRepository;
import com.example.sms.repository.AttendanceRepository;
import com.example.sms.repository.CourseRepository;
import com.example.sms.repository.StudentRepository;
import com.example.sms.repository.SubjectRepository;
import com.example.sms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.Set;

/**
 * Initializes default data (users, students, attendance records) on application startup.
 * 
 * CRITICAL: This CommandLineRunner MUST NOT throw uncaught exceptions.
 * If initialization fails for any reason, the application must continue running.
 * The web server should stay alive even if data initialization fails.
 */
@Configuration
@Slf4j
public class DataInitializer {

    @Bean
    CommandLineRunner init(UserRepository userRepository,
                           StudentRepository studentRepository,
                           AttendanceRepository attendanceRepository,
                           AssignmentRepository assignmentRepository,
                           AssignmentSubmissionRepository assignmentSubmissionRepository,
                           CourseRepository courseRepository,
                           SubjectRepository subjectRepository,
                           ActivityRepository activityRepository,
                           PasswordEncoder passwordEncoder,
                           RequestMappingHandlerMapping requestMappingHandlerMapping) {
        return args -> {
            try {
                log.info("Starting data initialization...");
                
                // Initialize default users
                initializeDefaultUsers(userRepository, passwordEncoder);
                
                // Initialize sample students and attendance records
                initializeSampleStudents(studentRepository, attendanceRepository);
                
                // Initialize courses and assignments
                initializeCourses(courseRepository, subjectRepository, assignmentRepository, userRepository);
                
                log.info("Data initialization completed successfully");
                
                // Log all registered request mappings
                logRequestMappings(requestMappingHandlerMapping);
            } catch (Exception e) {
                // CRITICAL: Log the error but DO NOT rethrow
                // The application must continue running even if data init fails
                log.error("Data initialization failed: {}", e.getMessage(), e);
                log.warn("Application will continue running without initial data. This is non-critical.");
            }
        };
    }

    private void initializeDefaultUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("adminpass"))
                    .email("admin@example.com")
                    .displayName("Platform Admin")
                    .roles(Set.of(Role.ADMIN))
                    .build();
            userRepository.save(admin);
            log.debug("Created default admin user");
        }

        if (!userRepository.existsByUsername("teacher")) {
            User teacher = User.builder()
                    .username("teacher")
                    .password(passwordEncoder.encode("teacherpass"))
                    .email("teacher@example.com")
                    .displayName("Lead Teacher")
                    .roles(Set.of(Role.TEACHER))
                    .build();
            userRepository.save(teacher);
            log.debug("Created default teacher user");
        }

        if (!userRepository.existsByUsername("student")) {
            User student = User.builder()
                    .username("student")
                    .password(passwordEncoder.encode("studentpass"))
                    .email("student@example.com")
                    .displayName("Student User")
                    .roles(Set.of(Role.STUDENT))
                    .build();
            userRepository.save(student);
            log.debug("Created default student user");
        }
    }

    private void initializeSampleStudents(StudentRepository studentRepository, AttendanceRepository attendanceRepository) {
        if (studentRepository.count() == 0) {
            List<Student> students = List.of(
                    Student.builder().firstName("Ava").lastName("Singh").email("ava.singh@example.com").course("Mathematics").dob(LocalDate.of(2005, 3, 22)).build(),
                    Student.builder().firstName("Noah").lastName("Patel").email("noah.patel@example.com").course("Computer Science").dob(LocalDate.of(2004, 7, 14)).build(),
                    Student.builder().firstName("Mia").lastName("Roy").email("mia.roy@example.com").course("Chemistry").dob(LocalDate.of(2005, 11, 8)).build(),
                    Student.builder().firstName("Arjun").lastName("Mehta").email("arjun.mehta@example.com").course("Physics").dob(LocalDate.of(2003, 5, 19)).build(),
                    Student.builder().firstName("Sofia").lastName("Verma").email("sofia.verma@example.com").course("Biology").dob(LocalDate.of(2004, 1, 30)).build()
            );

            studentRepository.saveAll(students);
            log.debug("Created {} sample students", students.size());

            Random random = new Random(123);
            LocalDate today = LocalDate.now();
            int attendanceRecordsCreated = 0;
            for (int i = 0; i < 30; i++) {
                LocalDate date = today.minusDays(i);
                for (Student student : students) {
                    boolean present = random.nextDouble() > 0.1;
                    Attendance attendance = Attendance.builder()
                            .date(date)
                            .present(present)
                            .student(student)
                            .build();
                    attendanceRepository.save(attendance);
                    attendanceRecordsCreated++;
                }
            }
            log.debug("Created {} attendance records", attendanceRecordsCreated);
        } else {
            log.debug("Students already exist, skipping student initialization");
        }
    }

    private void initializeCourses(CourseRepository courseRepository,
                                   SubjectRepository subjectRepository,
                                   AssignmentRepository assignmentRepository,
                                   UserRepository userRepository) {
        if (courseRepository.count() == 0) {
            Course course = Course.builder().name("Computer Science").description("CS course").build();
            courseRepository.save(course);
            log.debug("Created default course");

            Subject subject = Subject.builder()
                    .name("Data Structures")
                    .course(course)
                    .teacher(userRepository.findByUsername("teacher").orElse(null))
                    .build();
            subjectRepository.save(subject);
            log.debug("Created default subject");

            Assignment assignment = Assignment.builder()
                    .title("LinkedList Implementation")
                    .description("Implement singly linked list operations")
                    .dueDate(LocalDate.now().plusDays(7))
                    .teacher(userRepository.findByUsername("teacher").orElse(null))
                    .subject(subject)
                    .build();
            assignmentRepository.save(assignment);
            log.debug("Created default assignment");
        } else {
            log.debug("Courses already exist, skipping course initialization");
        }
    }
    
    private void logRequestMappings(RequestMappingHandlerMapping requestMappingHandlerMapping) {
        log.info("Registered Request Mappings:");
        requestMappingHandlerMapping.getHandlerMethods().forEach((mapping, handlerMethod) -> {
            log.info("  {} -> {}", mapping, handlerMethod.getMethod().toGenericString());
        });
    }
}
