FROM maven:3.9.6-eclipse-temurin-17

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

EXPOSE 10000

CMD ["java", "-jar", "target/student-management-backend-0.0.1-SNAPSHOT.jar"]
