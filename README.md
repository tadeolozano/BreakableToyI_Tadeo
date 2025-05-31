# Inventory Management System

A complete inventory management application built with **React**, **Spring Boot**, and **Maven**. The system allows you to manage products, filter and sort inventory, and track metrics—all with real-time UI and backend integration.

---

## Features

### Frontend (React + TypeScript + MUI)
-  Add, edit, and delete products
-  Filter by name, category, and availability
-  Sorting by columns (category, name, price, stock, expiration)
-  Inventory metrics (total value, stock, average price per category)
-  Pagination
-  Modern, responsive UI using Material UI
-  State management via React Context API
-  Unit tests with Vitest + Testing Library

### Backend (Spring Boot + Maven)
-  REST API for managing products and categories
-  In-memory or persistent database (e.g., H2, PostgreSQL)
-  Category auto-creation on product creation
-  Clean service/repository/controller architecture

---

## Project Structure

```text
 root
├── backend/            → Spring Boot App
│   ├── src/main/java/com/example/inventory
│   ├── src/test        → Unit tests
│   └── pom.xml         → Maven config
├── frontend/           → React + Vite + MUI
│   ├── src/
│   └── vite.config.ts
└── README.md
```

---

##  Installation

### 1. Clone the repository

```bash
git clone https://github.com/tadeolozano/BreakableToyI_Tadeo
cd BreakableToyI_Tadeo
```

---

### 2. Backend Setup

```bash
cd cd products_api
mvn spring-boot:run
```

If you use Windows:

```bash
cd cd products_api
mvnw.cmd spring-boot:run
```

---

### 3. Frontend Setup

```bash
cd cd products_front2
npm install
npm run dev
```

- Runs at: `http://localhost:8080`

---

##  Running Tests

### Frontend

```bash
cd products_front2
npx vitest
```

### Backend

```bash
cd products_front2
mvnw test
```

---

## Tech Stack

| Layer      | Tech Stack                                      |
|------------|--------------------------------------------------|
| Frontend   | React, TypeScript, Vite, Material UI            |
| Backend    | Spring Boot, Java, Maven                        |
| Database   | H2 (in-memory, optional PostgreSQL)             |
| Testing    | Vitest, Testing Library                         |
| Dev Tools  |  Prettier, Git, VS Code                  |

---

## Author

Made with ❤️ by Tadeo

---
