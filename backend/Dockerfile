FROM openjdk:17-jdk-slim AS backend

WORKDIR /app

RUN apt-get update && \
    apt-get install -y maven && \
    rm -rf /var/lib/apt/lists/*

COPY . .

RUN mvn package

CMD ["java", "-jar", "target/myapp.jar"]