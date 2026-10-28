# CampusFind — Spring Boot + MySQL Backend

A modern, beginner-friendly REST API for the **CampusFind Campus Lost-and-Found Portal**, built with **Java 21**, **Spring Boot 3.5.0**, **Spring Data JPA**, **Hibernate**, and **MySQL 8.x**.

---

## 1. Prerequisites
- **Java Development Kit (JDK) 21** or higher
- **Apache Maven 3.8+**
- **MySQL Server 8.0+** running on `localhost:3306`
- **Postman** (optional, for API testing)

---

## 2. MySQL Database Setup

1. Open your MySQL client (MySQL Workbench or command line) and run:
   \`\`\`sql
   CREATE DATABASE campusfind_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE campusfind_db;
   \`\`\`
2. Hibernate is set to \`spring.jpa.hibernate.ddl-auto=update\` in \`application.properties\`, so all tables and indexes will be automatically generated on first launch.

---

## 3. Environment Variable Configuration

To keep credentials secure, the database password is read from \`DB_PASSWORD\`:

### Windows PowerShell:
\`\`\`powershell
$env:DB_PASSWORD="your_mysql_password"
\`\`\`

### Windows Command Prompt (CMD):
\`\`\`cmd
set DB_PASSWORD=your_mysql_password
\`\`\`

### Linux / macOS / Bash:
\`\`\`bash
export DB_PASSWORD="your_mysql_password"
\`\`\`

---

## 4. How to Build & Run the Backend

Navigate to the \`backend\` folder in your terminal:

\`\`\`bash
# Build the project
mvn clean package -DskipTests

# Run the Spring Boot application
mvn spring-boot:run
\`\`\`

The server will start at:
\`\`\`
http://localhost:8080
\`\`\`

---

## 5. REST API Contract & Postman Guide

### Base URL:
\`http://localhost:8080/api/items\`

| Method | Endpoint | Description |
|---|---|---|
| **GET** | \`/api/items\` | List reports with search, type, category, location, status filters |
| **GET** | \`/api/items/{id}\` | Get single report by ID (404 if not found) |
| **POST** | \`/api/items\` | Create a report with \`multipart/form-data\` (item JSON + optional image) |
| **PUT** | \`/api/items/{id}\` | Update report fields & optional replacement image |
| **PATCH** | \`/api/items/{id}/resolve\` | Mark report as RESOLVED |
| **DELETE** | \`/api/items/{id}\` | Delete report and purge uploaded photo (204 No Content) |

### Sample Postman Requests:

#### 1. Fetch Items with Filters
- **Method:** \`GET\`
- **URL:** \`http://localhost:8080/api/items?search=calculator&type=LOST&page=0&size=10\`
- **Response:** \`200 OK\`
  \`\`\`json
  {
    "content": [
      {
        "id": 1,
        "itemName": "TI-84 Plus CE Graphing Calculator",
        "description": "Left on row 4 desk after Calculus lecture.",
        "type": "LOST",
        "category": "ELECTRONICS",
        "location": "Science Complex, Room 204",
        "incidentDate": "2026-10-25",
        "contactName": "Rohan Sharma",
        "contactEmail": "rohan.s@campus.edu",
        "contactPhone": "555-019-4821",
        "imageUrl": null,
        "status": "ACTIVE",
        "createdAt": "2026-10-25T14:30:00"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0,
    "first": true,
    "last": true
  }
  \`\`\`

#### 2. Create a Report
- **Method:** \`POST\`
- **URL:** \`http://localhost:8080/api/items\`
- **Headers:** None (do not set Content-Type manually; Postman will add boundary)
- **Body:** \`form-data\`
  - Key: \`item\` (Type: Text)
    \`\`\`json
    {
      "itemName": "Blue Hydro Flask 32oz",
      "description": "Left on the bleachers during basketball practice.",
      "type": "LOST",
      "category": "ACCESSORIES",
      "location": "Sports Arena",
      "incidentDate": "2026-10-27",
      "contactName": "David Miller",
      "contactEmail": "david.m@campus.edu",
      "contactPhone": "555-018-9922"
    }
    \`\`\`
  - Key: \`image\` (Type: File, optional JPG/PNG image)
- **Response:** \`201 Created\`

#### 3. Mark as Resolved
- **Method:** \`PATCH\`
- **URL:** \`http://localhost:8080/api/items/1/resolve\`
- **Response:** \`200 OK\`

---

## 6. Connecting the React Frontend

The React app communicates with the backend via Axios.
In your React \`.env\` file or terminal:
\`\`\`env
VITE_API_BASE_URL=http://localhost:8080/api
\`\`\`

When the backend is running, the top banner in CampusFind will show **"Spring Boot Backend Connected"** in green!
