
# 📱 Expense Tracker App (Expo + MERN Stack)

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

<h3 align="center">A Premium, OLED-Ready Financial Companion</h3>

</div>

---

## 📖 Overview

**Expense Tracker** is a modern, cross-platform mobile application designed to verify your spending habits with style. Built using **React Native (Expo)** for the frontend and a robust **Node.js/Express/MongoDB** backend, features a stunning **OLED Dark Mode** UI, **Poppins typography**, and meaningful data visualizations.

## ✨ Key Features

- **🎨 Premium OLED UI**: Deep black theme (`#000000`) optimized for modern screens, saving battery and looking sleek.
- **🔐 Secure Authentication**: JWT-based secure Login and Registration flow.
- **📊 Interactive Dashboard**:
  - **Dynamic Pie Charts**: Visualize spending distribution with vibrant, distinct colors.
  - **Time Filtering**: Toggle between **Daily**, **Monthly**, and **Yearly** views instantly.
  - **Transactions List**: Clean, scrollable history of your expenses.
- **� Expense Management**:
  - Add new transactions with categories (Food, Transport, etc.).
  - Edit or Delete existing entries.
  - Real-time total calculation.
- **👤 Profile System**:
  - View user details.
  - **Edit Profile**: Update name and email.
  - **Export Data**: Share functionality for your records.
  - Custom Avatar visualization.
- **� Animated & Responsive**: Smooth entry animations using `react-native-animatable` and a responsive layout.

---

## 📸 Screenshots

<div align="center">
  <img src="./Screenshots/login.png" width="200" alt="Login Screen" />
  <img src="./Screenshots/signup.png" width="200" alt="Register Screen" />
  <img src="./Screenshots/Dashboard.png" width="200" alt="Dashboard" />
  <img src="./Screenshots/Add.png" width="200" alt="Add Expense" />
  <img src="./Screenshots/profile.png" width="200" alt="Profile" />
</div>

---

## 🛠️ Tech Stack

### Frontend (Mobile App)
- **Framework**: React Native (via Expo)
- **Styling**: Standard StyleSheet, Expo Linear Gradient
- **Navigation**: React Navigation (Stack)
- **Animations**: `react-native-animatable`, `react-native-reanimated`
- **Charts**: `react-native-chart-kit`
- **Fonts**: `@expo-google-fonts/poppins`
- **Networking**: Axios

### Backend (API)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **Auth**: JSON Web Token (JWT) + bcryptjs
- **Validation**: Mongoose Models

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Expo Go app on your phone (or an emulator)

### 1. Backend Setup

```bash
cd backend
npm install
# Create a .env file with:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
npm start
```

### 2. Mobile App Setup

```bash
cd mobile-app
npm install
npx expo start
```

- Scan the QR code with **Expo Go** (Android/iOS) to run on your device.
- Press `w` to run in the web browser.

---

## � Project Structure

```
Expense-Tracker/
├── backend/                 # Node.js API
│   ├── models/             # Mongoose Schemas (User, Expense)
│   ├── routes/             # API Endpoints (Auth, Expenses)
│   └── server.js           # Entry point
│
├── mobile-app/             # React Native App
│   ├── api/                # Axios configuration
│   ├── context/            # Auth Context (Global State)
│   ├── screens/            # Application Screens (Login, Dashboard, etc.)
│   ├── theme.js            # Centralized Theme & Colors
│   └── App.js              # Main Component
│
└── Screenshots/            # Project previews
```

---

## 🔗 Author
Developed by **Hemachand Ravulapalli**

---
