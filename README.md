<h1 align="center">📚 LMS Pro - Enterprise Library Management System</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.0-brightgreen.svg" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-18.0-blue.svg" alt="React">
  <img src="https://img.shields.io/badge/MySQL-8.0-orange.svg" alt="MySQL">
  <img src="https://img.shields.io/badge/Security-Spring%20Security-red.svg" alt="Spring Security">
</p>

> A modern, enterprise-grade Full-Stack Library Management System designed with a premium Glassmorphism UI, Database-backed Authentication, and automated business logic for due dates and late fines.

## 🎯 About This Project
This project was developed to showcase a complete **Full-Stack Application lifecycle** — from designing a relational database schema in MySQL to securing REST APIs with Spring Security, and building a highly responsive, modern React frontend. It goes beyond basic CRUD operations by implementing real-world business requirements like **Automated Overdue Fines**, **Data Exports**, and **Database-Backed Authentication**.


## ✨ Key Features

- **🔐 Robust Security (Authentication & Authorization):**
  - Custom Database-backed Authentication using **Spring Security**.
  - Secure **Bcrypt Password Encryption**.
  - Built-in User Registration and Forgot Password functionality.
  - Protected React Routing to prevent unauthorized access.
  
- **💼 Advanced Business Logic:**
  - Automated tracking of **Due Dates** (default 14 days) when a book is issued.
  - Automatic calculation of **Late Fines ($2/day)** for overdue returns.
  - Real-time book availability status tracking (ISSUED / RETURNED).

- **📊 Data Analytics & Reporting:**
  - Interactive Dashboard with visual metrics using **Recharts**.
  - 1-Click **CSV/Excel Data Exports** for Administrative reporting.

- **🎨 Premium UI/UX:**
  - Highly responsive **Dark Emerald Glassmorphism** design.
  - Interactive Book Grid layout displaying Book Cover images.
  - Real-time toast notifications and dynamic search filtering.

---

## 🛠️ Technology Stack

### **Frontend**
*   **Library:** React.js
*   **Routing:** React Router DOM
*   **Styling:** Custom CSS Variables (Glassmorphism design system)
*   **Icons & Charts:** Lucide-React, Recharts
*   **Notifications:** React-Hot-Toast

### **Backend**
*   **Framework:** Java Spring Boot
*   **Security:** Spring Security (HTTP Basic Auth)
*   **Database:** MySQL Server
*   **ORM:** Hibernate / Spring Data JPA

---

## 🚀 Local Setup Instructions

### 1. Database Configuration
1. Ensure MySQL is running on your machine on port `3306`.
2. Create a new database named `library_db`:
   ```sql
   CREATE DATABASE library_db;
   ```
3. Update the credentials in `libraryapi/src/main/resources/application.properties` if your MySQL username/password differs from `root`/`Jinalmore@19`.

### 2. Backend Setup (Spring Boot)
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd libraryapi
   ```
2. Run the Spring Boot application (skipping tests):
   ```bash
   ./mvnw spring-boot:run "-Dmaven.test.skip=true"
   ```
*(The database tables will be automatically generated via Hibernate DDL)*

### 3. Frontend Setup (React)
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the necessary NPM packages:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

---

## 📖 Usage Guide

1. Navigate to `http://localhost:3000` in your web browser.
2. You will be redirected to the **Login Page**.
3. **First Time Users:** Click on the **Register** tab to create your first Admin account.
4. **Login:** Switch back to the Login tab and enter your newly created credentials.
5. Explore the Dashboard, manage Books, add Students, and try issuing a book with an older due date to see the Fine Calculation system in action!

---
*This project was developed as a comprehensive demonstration of Full-Stack capabilities, specifically focusing on merging beautiful frontend interfaces with robust, secure backend architectures.*
