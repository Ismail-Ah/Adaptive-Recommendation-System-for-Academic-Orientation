# Adaptive Recommendation System for Academic Orientation

## Description
This repository contains the implementation of an **Adaptive Recommendation System for Academic Orientation**, developed as part of the **Federated Project (PFA)** in the Software Engineering program at the National Engineering School of Computer Science and Systems Analysis (ENSIAS), Mohammed V University, Rabat. The system is designed to guide Moroccan students, particularly those in their 1st and 2nd years of baccalaureate, by providing personalized academic and career pathway recommendations. It leverages a **microservices architecture** with technologies like **Neo4j** and **Graph Neural Networks (GNN)**.

**Academic Year**: 2024-2025  
**Developed by**: Mr. Ayman ANNA, Mr. Ismail AHAKAY  
**Supervised by**: Prof. Mrs. Bouchra EL ASRI, Mrs. Zineb ELKAIMBILLAH  

---

## Objectives
- **Problem Addressed**: Help students navigate post-baccalaureate options (fields of study, courses, certifications) with tailored recommendations based on their profiles (interests, skills, performance).
- **Key Features**:
  - Suggest courses and highlight missing prerequisites.
  - Propose academic and professional pathways.
  - Adapt recommendations dynamically to changing student data or external factors (e.g., new programs or career opportunities).

---

## Project Structure
```
C:\Users\zoro\Documents\ENSIAS\projects\pfa
├── backend/                # Backend microservices implementation
├── frontend/               # Frontend application
├── conception_pfa.pdf      # Project conception document (design and specifications)
└── README.md               # This file
```

- **backend/**: Contains the microservices (e.g., UserService, KnowledgeGraphService, RecommendationService) built with Spring Boot.
- **frontend/**: User interface for interacting with the system (technology to be specified).
- **conception_pfa.pdf**: Detailed project documentation, including use case diagrams, architecture design, and technology choices.

---

## Architecture
The system is based on a **microservices architecture**:
1. **UserService**: Manages student profiles, stored in Neo4j.
2. **KnowledgeGraphService**: Models relationships (students, skills, pathways) in a Neo4j graph.
3. **RecommendationService**: Generates adaptive recommendations using GNN.
4. **API Gateway**: Routes requests between the frontend and backend services.

---

## Technologies Used
- **Neo4j**: Graph database for managing complex relationships.
- **Graph Neural Networks (GNN)**: For intelligent, context-aware recommendations.
- **Spring Boot**: Backend framework for microservices with REST APIs.
- **Frontend**: [To be specified, e.g., React, Angular, etc.]
- **Maven**: Dependency management for the backend.

---

## Installation and Setup
### Prerequisites
- Java 17+
- Maven
- Neo4j Desktop or Server
- [Frontend dependencies, e.g., Node.js, if applicable]
- Docker (optional, for containerization)

### Steps
1. **Clone the repository** (if hosted on GitHub/GitLab):
   ```bash
   git clone https://github.com/Ismail-Ah/Adaptive-Recommendation-System-for-Academic-Orientation.git
   cd repo-name
   ```
   *Note*: If not yet hosted, initialize a Git repository locally:
   ```bash
   git init
   ```

2. **Backend Setup**:
   - Navigate to the `backend/` directory:
     ```bash
     cd backend
     ```
   - Configure Neo4j credentials in `application.properties`.
   - Build and run:
     ```bash
     mvn clean install
     mvn spring-boot:run
     ```

3. **Frontend Setup**:
   - Navigate to the `frontend/` directory:
     ```bash
     cd frontend
     ```
   - [Add specific instructions based on frontend tech, e.g., `npm install && npm run dev` for Node.js-based frameworks.]

4. **Access the System**:
   - Backend API: `http://localhost:8080` (default port, adjust as needed).
   - Frontend: [Specify URL, e.g., `http://localhost:3000`].

---

## Usage
1. **Register**: Create a student profile with initial data (name, interests, grades).
2. **Update Profile**: Modify your profile to refine recommendations.
3. **View Recommendations**: Access suggested academic and career pathways.

---

## Documentation
- Refer to `conception_pfa.pdf` for detailed design, including:
  - Use Case Diagram
  - Entity-Relationship Diagram (Neo4j graph)
  - Microservices Architecture Diagram

---

## Contributions
Contributions are welcome! Please fork the repository and submit a Pull Request, or contact the developers for collaboration.

---
