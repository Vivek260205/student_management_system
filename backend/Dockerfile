# Build stage
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/student-management-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080 for the web server
EXPOSE 8080

# Set JVM options for optimal startup and memory usage
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

# Health check to ensure app stays alive
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the Spring Boot application
# The application MUST stay in the foreground (do not use &)
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
