# 🚨 Emergency Dispatch System - Backend

This is the backend service for a **real-time emergency coordination system** built in Java using Spring Boot. It handles **ambulance, fire truck, and police dispatch**, booking logic, live GPS tracking, and system-wide monitoring.

> Built for large-scale, modular emergency response automation.

---

## 🚀 Features

- 🔐 Role-based user registration and login (Ambulance Driver, Police Officer, Fire Driver, Admin)
- 📞 Emergency booking with service-specific dispatch
- 📍 Real-time location updates for units via WebSocket-ready APIs
- 🧠 Intelligent unit assignment (nearest available unit logic)
- 📊 Admin dashboard for system metrics, unit availability, and active cases
- 🗺️ Map APIs for visual tracking of assigned units per request
- 🧾 Booking history for users and stations
- ✅ JWT-based authentication and session management

---

## 📦 Tech Stack

| Layer        | Tech                            |
|-------------|----------------------------------|
| Language     | Java 17                         |
| Framework    | Spring Boot, Spring Security    |
| DB           | PostgreSQL                      |
| Auth         | JWT                             |
| Docs         | Swagger (OpenAPI 3.0)           |
| Testing      | JUnit 5, Mockito                |
| Dev Tools    | Lombok, MapStruct, SLF4J        |
| API Client   | Postman                         |

---

## 🧱 Project Structure

```plaintext
📦 src/main/java/com/REACT/backend/
│
├── ambulanceService/
│   ├── controller/
│   ├── model/
│   ├── repository/
│   └── service/
│
├── fireService/
├── policeService/
├── booking/
├── hospitalService/
├── users/
├── locationUtils/
├── common/
└── Jwt/
