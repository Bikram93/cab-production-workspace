# Cab Booking & Production Platform

A modern, production-grade cab booking application architected with a decoupled frontend and backend ecosystem.

---

## 🧭 Project Status: All 5 Phases Completed! 🎉

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 1** | **Foundation & Static Shell (Week 1)** | ✅ **COMPLETED** |
| **Phase 2** | **Authentication & State (Week 2)** | ✅ **COMPLETED** |
| **Phase 3** | **The Map Integration (Week 3)** | ✅ **COMPLETED** |
| **Phase 4** | **Core Booking Lifecycle (Week 4)** | ✅ **COMPLETED** |
| **Phase 5** | **Real-Time & Polish (Week 5+)** | ✅ **COMPLETED** |

For full architecture details, state machine diagrams, and phase documentation, see [READ.md](./READ.md).

---

## 🏗️ Architecture Overview

The workspace is organized into two primary sub-projects:

* **Backend (`cab-backend/`)**: FastAPI, SQLAlchemy, SQLite local database, Pydantic data validation, and JWT-based authentication/security.
* **Frontend (`cab-frontend/`)**: React 19, Vite build engine, React Router v7, Tailwind CSS v4, Socket.io client, Leaflet maps, and domain-driven feature modules.

---

## 🚀 Quick Start Guide

### Frontend (`cab-frontend`)

```powershell
cd cab-frontend
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

#### Demo Credentials:
- **Rider**: `rider@cab.com` / `password123`
- **Driver**: `driver@cab.com` / `password123`
