# 🔌 Expense Tracker Pro - API Documentation

This document provides a comprehensive guide to the REST API endpoints powering the Expense Tracker Pro ecosystem.

## **Base URL**
- **Local Development**: `http://localhost:5000/api`
- **Mobile LAN**: `http://<YOUR_IP>:5000/api`

---

## **1. Authentication (`/auth`)**

### **POST /register**
Registers a new user.
- **Body**: `{ "name": "...", "email": "...", "password": "..." }`
- **Response**: `201 Created` with `{ "token": "...", "user": { ... } }`

### **POST /login**
Authenticates a user and returns a 30-day token.
- **Body**: `{ "email": "...", "password": "..." }`
- **Response**: `200 OK` with `{ "token": "...", "user": { ... } }`

### **GET /me** (Protected)
Verifies the current token and performs a **Silent Refresh**.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` with fresh User data and a **New 30-day Token**.

### **PUT /profile** (Protected)
Updates user settings (Theme, Currency, Budgets).
- **Body**: `{ "theme": "dark", "currency": "USD", "monthlyBudget": 5000, ... }`
- **Response**: `200 OK` with updated user object and rotated token.

---

## **2. Expenses (`/expenses`)**

### **GET /all** (Protected)
Retrieves all expenses for the authenticated user.
- **Response**: Array of Expense objects.

### **POST /add** (Protected)
Adds a new expense transaction.
- **Body**: `{ "title": "...", "amount": 100, "category": "Food", "date": "..." }`
- **Response**: `201 Created` with the new Expense object.

### **DELETE /:id** (Protected)
Removes an expense record.
- **Response**: `200 OK` on success.

### **GET /stats** (Protected)
Retrieves summarized statistics for the Dashboard pie charts.
- **Response**: Category-wise totals and percentage breakdowns.

---

## **Error Handling**
The API uses standard HTTP status codes:
- `200/201`: Success.
- `400`: Bad Request (Invalid details).
- `401`: Unauthorized (Invalid/Expired Token).
- `404`: Not Found.
- `500`: Internal Server Error.

---
<sub>Designated for the AppDost Recruitment Task - January 2026</sub>
