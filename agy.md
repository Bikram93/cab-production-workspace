# 🚀 Google Antigravity (AGY) Project Guide

Welcome to the **Cab Production Workspace** Antigravity integration guide. This document outlines the project environment, pairing workflow, agent operational boundaries, and development tooling.

---

## 🧭 Workspace Identity & Working Agreement

* **Workspace Name**: `cab-production-workspace`
* **Operating System**: Windows (PowerShell Shell Environment)
* **Active Working Protocol**:
  1. **User-Driven Implementation**: The developer writes the core application code directly across both backend and frontend.
  2. **Agent Focus**: Antigravity is engaged primarily for:
     * Error diagnosis and root-cause analysis.
     * Runtime and build error debugging.
     * Architectural sanity checks and pattern validation.
     * Environment and dependency management.
  3. **No Unsolicited Code**: The assistant must avoid writing full unsolicited boilerplate or implementation code unless explicitly requested.

---

## 📁 Repository Blueprint

```text
cab-production-workspace/
├── cab-backend/                  # 🐍 FASTAPI + SQL DATABASE ECOSYSTEM
│   ├── cab_service.db            # SQLite local database
│   ├── database.py               # Engine & session pool
│   ├── main.py                   # FastAPI server entry point & CORS
│   ├── models.py                 # SQLAlchemy Declarative Models
│   ├── schemas.py                # Pydantic Schemas
│   ├── security.py               # Password hashing & JWT signing
│   └── venv/                     # Python 3.11 virtual environment
│
├── cab-frontend/                 # ⚛️ REACT CORE UTILITIES (Vite Engine)
│   ├── .env.local                # Local API gateway routing (Port 8000)
│   ├── package.json              # Node dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── index.html                # Entry HTML mount
│   └── src/
│       ├── assets/               # Static icons, images, fonts
│       ├── components/           # Global atomic components (Button, Input, Modal)
│       ├── context/              # Global state contexts (AuthContext, ThemeContext)
│       ├── features/             # Feature-driven domain modules
│       │   ├── auth/             # Login, register, auth hooks & services
│       │   ├── booking/          # Ride booking, estimators, trip status, OTP
│       │   ├── dashboard/        # Driver management views
│       │   └── maps/             # Map containers, route polylines, geo helpers
│       ├── hooks/                # Global utilities (useDebounce, useLocalStorage)
│       ├── layouts/              # Shell layouts (AppLayout, AuthLayout)
│       ├── routes/               # Route definitions & ProtectedRoute guard
│       ├── services/             # Axios HTTP client & token interceptors
│       ├── store/                # Optional Redux / Zustand store
│       ├── App.jsx               # Main application element
│       └── main.jsx              # React DOM render script
│
├── .gitignore                    # Git exclusions (venv, node_modules, .db, secrets)
├── README.md                     # Main project documentation
├── READ.md                       # Quick link index
└── agy.md                        # This Antigravity Guide
```

---

## ⚡ Useful Antigravity Slash Commands

You can use the following interactive slash commands in the Antigravity chat:

* `/plan`: Formulate a structured step-by-step technical plan before touching complex workflows.
* `/goal`: Run an autonomous, goal-oriented session that ensures end-to-end task completion without stopping prematurely.
* `/grill-me`: Conduct an interactive Q&A interview to resolve architecture and design choices before writing code.
* `/boost`: Leverage deep multi-perspective reasoning and verification for complex bugs or tricky system logic.
* `/schedule`: Set one-time timers or recurring health-check cron jobs in the background.

---

## 🛠️ Common Operations & Commands

### Backend Virtual Environment & Server
```powershell
# Activate backend virtualenv (from repository root)
.\cab-backend\venv\Scripts\Activate.ps1

# Run FastAPI server with auto-reload
cd cab-backend
uvicorn main:app --reload --port 8000
```

### Frontend Dev Server
```powershell
# Run Vite development server
cd cab-frontend
npm run dev
```

---

## 📋 Best Practices for Agent Interactions

1. **Error Assistance**: When encountering a compiler, linter, or runtime error, paste the stack trace or describe the symptom. The assistant will pinpoint the exact file, line, and rationale for the fix.
2. **Path Navigation**: All paths in responses are hyperlinked using the `file:///` standard for one-click access in your workspace.
3. **Clean Git Hygiene**: Local virtual environments (`venv/`), SQLite database files (`*.db`), and Node packages (`node_modules/`) are strictly tracked by [.gitignore](./.gitignore) to keep the repository lean.

---

## 🗺️ Frontend Development Roadmap

Strictly follow these 5 phases in order:

### 🔹 Phase 1: Foundation & Static Shell (Week 1)
- Set up the folder structure.
- Configure routing (`react-router-dom`) with empty placeholder pages.
- Build the Shared UI components (buttons, input fields).

### 🔹 Phase 2: Authentication & State (Week 2)
- Implement the `AuthContext`.
- Build the Login and Registration UI forms.
- Hook up mock API services to simulate login, token saving, and route blocking based on roles.

### 🔹 Phase 3: The Map Integration (Week 3)
- Integrate map provider (e.g., Google Maps API or Mapbox React wrappers).
- Implement basic device geolocation tracking.
- Practice rendering static pins (markers) for pickup and drop-off addresses.

### 🔹 Phase 4: Core Booking Lifecycle (Week 4)
- Build the rider's booking workflow using mock data:
  `Select Locations -> View Fare -> Click Request -> Simulate Driver Acceptance -> Show OTP screen -> Trip Completed`.

### 🔹 Phase 5: Real-Time & Polish (Week 5+)
- Introduce WebSockets (`Socket.io` client) to replace mock polling for real-time driver movement and status transitions.
- Integrate error handling, loading skeletons, and edge cases (e.g., ride cancellations).

