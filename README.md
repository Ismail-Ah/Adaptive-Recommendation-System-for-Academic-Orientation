
# Adaptive Recommendation System for Academic Orientation

## Description
This repository contains the implementation of an **Adaptive Recommendation System for Academic Orientation**, developed as part of the **Federated Project (PFA)** in the Software Engineering program at the National Engineering School of Computer Science and Systems Analysis (ENSIAS), Mohammed V University, Rabat. The system is designed to guide Moroccan students, particularly those in their post-baccalaureate phase, by providing personalized academic and career pathway recommendations based on their preferences, favorite subjects, academic performance, and professional aspirations. It leverages a **microservices architecture** with technologies like **Neo4j**, **Graph Neural Networks (GNN)**, **Spring Boot**, **Django**, and **React**.

**Academic Year**: 2024-2025  
**Developed by**: Mr. Ayman ANNA, Mr. Ismail AHAKAY  
**Supervised by**: Prof. Mrs. Bouchra EL ASRI, Mrs. Zineb ELKAIMBILLAH  

---

## Objectives
- **Problem Addressed**: Assist students in navigating post-baccalaureate academic and career options by addressing challenges such as lack of information, social pressures, and limited awareness of opportunities.
- **Key Features**:
  - Personalized recommendations for fields of study, courses, and certifications based on student profiles (interests, skills, grades, and aspirations).
  - Highlight missing prerequisites for suggested academic pathways.
  - Provide transparent feedback on why specific recommendations are made, enabling students to visualize strengths and adjust preferences.
  - Offer an administrative interface for educational institutions to manage and analyze diploma offerings.

---

## Project Structure
```
C:\Users\zoro\Documents\ENSIAS\projects\pfa
├── backend/                # Backend microservices implementation
├── frontend/               # Frontend application (React)
├── data.csv                # Dataset of diplomas used to train the GNN model
└── README.md               # This file
```
- **backend/**: Contains microservices (e.g., UserService, FeedbackService, GNNService, RecommendationService, AdminService, DetectionChangementService, ChangementService) built with **Spring Boot** and **Django**.
- **frontend/**: User interface built with **React** for student and admin interactions.
- **data.csv**: Dataset of diplomas used to train the GNN model.

---

## Architecture
The system is based on a **microservices architecture**:
1. **UserService**: Manages student profiles, stored in Neo4j.
2. **GNNService**: Models relationships (students, skills, pathways, diplomas) using Graph Neural Networks in a Neo4j graph.
3. **RecommendationService**: Generates adaptive, context-aware recommendations using GNN.
4. **FeedbackService**: Provides explanations for recommendations to enhance transparency.
5. **AdminService**: Allows administrators to add, modify, and analyze diploma offerings.
6. **DetectionChangementService**: Detects changes in student data or external factors (e.g., new programs).
7. **ChangementService**: Manages updates to recommendations based on detected changes.
8. **API Gateway**: Routes requests between the frontend and backend services.

---

## Technologies Used
- **Neo4j**: Graph database for managing complex relationships between students, skills, and pathways.
- **Graph Neural Networks (GNN)**: For intelligent, context-aware recommendations.
- **Spring Boot**: Backend framework for microservices with REST APIs.
- **Django**: Backend framework for the GNNService microservice.
- **React**: Frontend framework for the user interface.
- **Maven**: Dependency management for Spring Boot microservices.
- **Docker**: For running Neo4j instances.

---

## Installation and Setup
### Prerequisites
- **Java 17+**
- **Maven**
- **Node.js** (for React frontend)
- **Python 3.8+** (for Django microservice)
- **Neo4j Desktop or Server**
- **Docker** (for Neo4j instances)

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ismail-Ah/Adaptive-Recommendation-System-for-Academic-Orientation.git
   cd Adaptive-Recommendation-System-for-Academic-Orientation
   ```
   > Note: If not yet hosted, initialize a Git repository locally:
   ```bash
   git init
   ```

2. **Backend Setup**:  
   Navigate to the backend/ directory:
   ```bash
   cd backend
   ```
   Configure Neo4j credentials in `application.properties` for Spring Boot microservices.

   For Spring Boot microservices:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   For the Django-based GNNService (located in `backend/django/GnnService`):
   ```bash
   cd django/GnnService
   pip install -r requirements.txt
   python manage.py runserver
   ```

3. **Frontend Setup**:  
   Navigate to the frontend/ directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Access the System:
- Backend API: `http://localhost:8080` (default port for Spring Boot)
- Django GNNService: `http://localhost:8000` (default port for Django)
- Frontend: `http://localhost:5173`

---

## Usage
### Admin Setup:
- Create an admin account with email, password, and role=`ADMIN`.
- Log in to add or modify diploma offerings via the admin interface.

### Student Usage:
- Register: Create a student profile with initial data (name, interests, grades, aspirations).
- Update Profile: Modify profile to refine recommendations.
- View Recommendations: Access suggested academic and career pathways with explanations of why they were recommended.

---

## Contributions
Contributions are welcome! Please fork the repository and submit a Pull Request, or contact the developers for collaboration.
