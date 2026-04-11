package com.example.sms;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.sms")
public class StudentManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudentManagementApplication.class, args);
    }

    @Bean
    public CommandLineRunner printRequestMappings(RequestMappingHandlerMapping handlerMapping) {
        return args -> {
            handlerMapping.getHandlerMethods().forEach((key, value) -> {
                System.out.println("Mapped " + key + " to " + value);
            });
        };
    }
}