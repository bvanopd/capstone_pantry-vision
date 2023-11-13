# pantry-vision
This is the repository for Pantry Vision, an application that helps you manage your pantry. It is in its proof of concept stage, and is currently only 
set up to validate the technology stack.

## Development
The project is composed of an Angular front end application, supported by a Spring Boot back end connected to a MYSQL database.

### Dependency set up
To set up the project to contribute, you will need the following:
- A MySQL database server (8.0 or higher)
- Java JDK-17
- Apache Maven 3.9.5

After these tools have been installed, make sure they are added to your Path environment variables (User)

### Create a local Repository
- Fork this repo
- Clone your forked repo

### Set up the local database
- Access your local MySQL server, either through a terminal or a tool like MYSQL Workbench
- Create the Pantry Vision database ```CREATE DATABASE pantry_db;```
- NOTE the back end data connection is set up to connect to mysql with the user 'root' and a password of 'password', if this is not your setup, either change the root password or edit the application.properties and application-dev.properties files in the Spring Boot project. TODO add these to gitignore?
- NOTE Make sure your MYSQL80 service is running. Sometimes this can fail to start up on system restart.

### Start up the back end
- Navigate to the */backend/pantryVision-core/* directory and run ```mvn clean install```
- Run the Spring Boot application by running the *PantryVisionCoreApplication.java* file. If you're using IntelliJ it probably made a run configuration for this and you can just click the green start button. Otherwise it can be run with ```java -jar target/pantryVision-core-0.0.1-SNAPSHOT.jar```
    - NOTE that if you you run with this command, the jar is a snapshot of the application we created with mvn clean install
- The back end should be running at this point. Check the terminal for errors.
- NOTE The back end listens on localhost:8080, you can verify it's running by hitting an endpoint in your browser: ```http://localhost:8080/api/users/listAll.do```

### Start up the front end
- Navigate to the */frontend/pantryVision/* directory and ensure front end dependencies are installed by running ```npm install```
- Start the front end by running ```npm start```
  - The ```npm start``` script is configured to fire up a local development server for Angular with a proxy to allow cross-origin resource sharing. Essentially it redirects HTTP requests to trick Angular into thinking it's on the same domain as the back end.
- The application should be running now at ```http://localhost:4200/```
