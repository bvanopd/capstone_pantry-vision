# Stage 1: Build the Angular application
FROM node:18.18.0 AS build-angular
WORKDIR /app
COPY ./frontend/pantryVision/package*.json ./
COPY ./frontend/pantryVision/package-lock.json ./
RUN npm cache clean --force
RUN npm install
ENV PATH /root/.npm-global/bin:$PATH
COPY ./frontend/pantryVision ./frontend/pantryVision
RUN npm --prefix ./frontend/pantryVision run build --output-path=./frontend/pantryVision/dist

# Stage 2: Build the Spring Boot application
FROM maven:3.8.1-openjdk-17 AS build-spring
WORKDIR /app
COPY ./backend/pantryVision-core/pom.xml ./backend/pantryVision-core/
RUN mvn --file ./backend/pantryVision-core/pom.xml dependency:go-offline
COPY ./backend/pantryVision-core/src ./backend/pantryVision-core/src
RUN mvn --file ./backend/pantryVision-core/pom.xml clean install -DskipTests

# Stage 3: Run the Spring Boot application with the Angular static files
FROM openjdk:17
WORKDIR /app
# Copy the built Angular application
COPY --from=build-angular /app/frontend/pantryVision/dist/pantry-pal ./static
# Copy the built Spring Boot application
COPY --from=build-spring /app/backend/pantryVision-core/target/pantryVision-core-0.0.1-SNAPSHOT.jar pantryPal.jar
EXPOSE 8080
# Set the Spring profile
ARG SPRING_PROFILE
ENV SPRING_PROFILES_ACTIVE=${SPRING_PROFILE}
ENTRYPOINT ["java", "-jar", "pantryPal.jar"]