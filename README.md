# 🚀 Sales Co-worker — AI-Powered Sales Assistant Hub

Welcome to the **Sales Co-worker** project! This repository is organized as a unified monorepo containing three core components: an AI-driven **Backend API**, a Next.js **Web Dashboard (Frontend)**, and an Expo/React Native **Mobile Client**.

Together, they form a state-of-the-art AI agent hub that helps sales teams manage leads, schedule meetings, automate emails, and approve tasks on the go.

---

## 📁 Repository Structure

```
coworker/
├── backend/       # Express + TypeScript API, Prisma ORM, Graph/AI Task Engine
├── frontend/      # Next.js Web CRM dashboard with Leads & Settings UI
└── mobile/        # Expo & React Native mobile client for Leads, Inbox & Approvals
```

---

## 🛠️ Prerequisites

Before you get started, ensure you have the following installed on your machine:
* **Node.js** (v18.x or newer recommended)
* **NPM** or **Yarn**
* **Git**
* A running database instance (e.g., PostgreSQL, SQLite, or MySQL) supported by Prisma.

---

## 🚀 Getting Started & Execution Instructions

Follow these instructions to set up and run each service locally:

### 1. ⚙️ Backend API (`/backend`)
The backend is a robust Express service built using TypeScript, featuring Prisma ORM and custom AI workflow schedulers.

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   * Create a `.env` file in `/backend` if it does not already exist:
     ```env
     DATABASE_URL="file:./dev.db" # Or your remote database connection string
     JWT_SECRET="your-super-secret-jwt-key"
     PORT=5000
     ```
4. **Apply Database Schema:**
   ```bash
   npx prisma db push
   ```
5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   *The API will be available at `http://localhost:5000`.*

---

### 2. 💻 Web Dashboard (`/frontend`)
The web panel is a modern CRM interface built using Next.js, custom CSS variables, and tailwind/ui components.

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.*

---

### 3. 📱 Mobile Application (`/mobile`)
The mobile application is a high-performance Expo & React Native app built to track follow-ups, leads, and workflow approvals on the go.

1. **Navigate to the mobile directory:**
   ```bash
   cd mobile
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start Expo Go Developer Portal:**
   ```bash
   npx expo start
   ```
4. **Run on Device / Emulator:**
   * Press **`a`** to open in an Android Emulator.
   * Press **`i`** to open in an iOS Simulator.
   * Scan the QR code using your phone's **Expo Go** application (Android) or Camera app (iOS) to test on your physical device.

---

## 🧠 Key Features & Workflows

* **AI Task Engine & Graph Executor (`backend/src/services/`)**: Implements complex graph-based task structures to autonomously manage customer outreach, follow-ups, and calendar schedules.
* **Intelligent Leads Panel (`frontend/src/app/(dashboard)/leads/`)**: A rich, responsive UI dashboard displaying active sales funnels, custom lead details, and priority badges.
* **Unified Sales Inbox & Approvals (`mobile/app/(tabs)/`)**: Let's managers approve automated outreach and check inbox conversations directly from their smartphones.

---

## 💾 Git Monorepo Guidelines
This repository is configured as a single Git project:
* **Branches:** Work primarily on feature branches and merge them into `main`.
* **Deployment/CI:** When deploying (e.g., to Vercel or Render), specify the root subdirectory path for build context (e.g., `frontend` or `backend`).
* **Secrets:** `.env` and certificate key files are ignored automatically by the root `.gitignore` to prevent secret leaks. Never commit sensitive keys!
