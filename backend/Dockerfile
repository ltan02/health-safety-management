# Stage 1: Build the application
FROM eclipse-temurin:17-jdk-jammy as builder

WORKDIR /opt/app

# Copy Maven configuration and cache dependencies
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

# Copy the source code and build the application
COPY src/ src/
RUN ./mvnw clean install

# Stage 2: Create the final runtime image
FROM eclipse-temurin:17-jre-jammy

WORKDIR /opt/app

# Expose port 8080 for the web application
EXPOSE 8080

# Copy the built application from the builder stage
COPY --from=builder /opt/app/target/*.jar /opt/app/app.jar

# Command to run the application
ENTRYPOINT ["java", "-jar", "/opt/app/app.jar"]