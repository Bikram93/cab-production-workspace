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



## 🏗️ Complete Phase-by-Phase Work Breakdown

### 🔹 Phase 1: Foundation & Static Shell (Completed)
* **Vite + React 19 Project Foundation**: Configured bundler, Tailwind CSS v4, and root HTML canvas.
* **Declarative Client-Side Routing**: Set up `react-router-dom` v7 with `/login`, `/rider`, and catch-all redirects.
* **Atomic Shared UI Components**:
  * `src/components/Button.jsx`: Flexible button supporting variants (`primary`, `secondary`, `outline`, `danger`), sizes, loading spinners, and full-width mode.
  * `src/components/Input.jsx`: Standardized input field supporting labels, error feedback, required indicators, and helper text.

### 🔹 Phase 2: Authentication & State (Completed)
* **Global Authentication State (`src/context/AuthContext.jsx`)**: Central context managing `user`, `token`, `isAuthenticated`, and session persistence in `localStorage`.
* **Feature Hook (`src/features/auth/hooks/useAuth.js`)**: Clean consumer hook for authentication actions throughout the application.
* **Mock Authentication API (`src/features/auth/services/authApi.js`)**: Async service simulating backend delay, JWT issuance, and seeded demo accounts (`rider@cab.com`, `driver@cab.com`).
* **Domain UI Forms**: `LoginForm.jsx` and `RegisterForm.jsx` with driver vehicle inputs.
* **Security & Role Route Guard (`src/routes/ProtectedRoute.jsx`)**: Enforces authentication on `/rider`.
* **Dynamic Navigation Header (`src/App.jsx`)**: Displays user avatar, name, role badge, and **Sign Out** button.

### 🔹 Phase 3: The Map Integration (Completed)
* **Map Engine (`src/features/maps/components/MapContainer.jsx`)**: Leaflet + OpenStreetMap canvas rendering interactive tiles and zoom controls.
* **Device GPS Tracking (`src/hooks/useGeolocation.js`)**: Browser Geolocation API hook with fallback to city center.
* **Custom Pin & Marker Factory (`src/features/maps/components/DriverMarker.jsx`)**: Custom HTML `L.divIcon` designs for drivers (🚕), pickup (📍), and drop-off (🏁).
* **Route Polyline Renderer (`src/features/maps/components/RoutePolyline.jsx`)**: Yellow dashed route trajectory connecting pickup and destination with auto-bounds zoom.
* **Geo Calculation Helpers (`src/features/maps/utils/geoHelpers.js`)**: Haversine distance formula, travel time estimation, and fare calculation.

### 🔹 Phase 4: Core Booking Lifecycle (Completed)
* **Booking State Machine (`src/features/booking/hooks/useRideBooking.js`)**:
  Manages complete state transitions: `IDLE` ➔ `REQUESTED` ➔ `ACCEPTED` ➔ `ARRIVED` ➔ `IN_PROGRESS` ➔ `COMPLETED`.
* **Vehicle Tier Estimator (`src/features/booking/components/RideEstimator.jsx`)**:
  Interactive selection of vehicle categories (Cab Economy, Cab Comfort, Cab XL, Cab Premier) with live price multipliers and detailed fare breakdowns.
* **Trip Status Drawer (`src/features/booking/components/TripStatus.jsx`)**:
  Context-sensitive drawer for matching radar, driver card, OTP prompt, journey meter, and final receipt.
* **OTP Verification Screen (`src/features/booking/components/OtpVerification.jsx`)**:
  4-digit security PIN for driver validation.

### 🔹 Phase 5: Real-Time & Polish (Completed)
* **WebSocket & Socket.io Service (`src/services/socketService.js`)**:
  Connects to backend WebSocket gateway (`driver:location_update`, `trip:status_update`, `ride:cancel`). Includes an autonomous client-side GPS interpolation engine providing smooth real-time telemetry simulation when offline or standalone.
* **Live Animated Driver Marker (`src/features/maps/components/DriverMarker.jsx`)**:
  Renders a glowing, pulsing active driver marker (`createAssignedDriverIcon`) with dynamic bearing rotation (`rotate(deg)`) as the vehicle turns along the street grid.
* **Real-Time Map Synchronization (`src/features/maps/components/MapContainer.jsx`)**:
  Live coordinates stream into the map, smoothly translating the driver car marker from origin to destination.
* **Global Error Boundary (`src/components/ErrorBoundary.jsx`)**:
  Catches unexpected React rendering errors and displays a friendly recovery UI with instant reload capabilities.
* **Network Status Monitor (`src/components/NetworkStatusBanner.jsx`)**:
  Detects internet drops in real-time and warns users if live GPS synchronization is paused.
* **Shimmer Skeleton Loaders (`src/components/SkeletonLoader.jsx`)**:
  Smooth skeleton loading states for vehicle tiers and driver profiles.

---

## 🔄 End-to-End System Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                APPLICATION ERROR BOUNDARY                                   │
│                                (src/components/ErrorBoundary.jsx)                           │
│                                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                     NETWORK STATUS MONITOR (NetworkStatusBanner.jsx)                  │  │
│  └───────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                          AUTHENTICATION CONTEXT (AuthContext.jsx)                     │  │
│  │      - user, token, isAuthenticated | localStorage persistence                        │  │
│  └───────────────────────────────────────────┬───────────────────────────────────────────┘  │
│                                              │                                              │
│                                              ▼                                              │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                              ROUTER MATRIX (AppRoutes.jsx)                            │  │
│  │                                                                                       │  │
│  │   /login  ──► LoginPage.jsx (LoginForm + RegisterForm)                                │  │
│  │   /rider  ──► ProtectedRoute.jsx                                                      │  │
│  │               └── RiderMapPage.jsx                                                    │  │
│  │                   ├── MapContainer.jsx (Leaflet + OSM Tiles)                          │  │
│  │                   │   ├── Custom Pins (Pickup 📍, Dropoff 🏁, Fleet 🚕)               │  │
│  │                   │   ├── Live Animated Driver Marker (Pulse + Bearing Rotation)      │  │
│  │                   │   └── RoutePolyline.jsx (Auto-bounds yellow dashed path)          │  │
│  │                   │                                                                   │  │
│  │                   ├── useGeolocation.js (Browser GPS Tracking)                        │  │
│  │                   ├── socketService.js (WebSocket telemetry stream & GPS simulator)   │  │
│  │                   └── useRideBooking.js (Lifecycle State Machine)                     │  │
│  │                       ├── [IDLE]        ➔ RideEstimator.jsx (Tier Selection)         │  │
│  │                       ├── [REQUESTED]   ➔ TripStatus (Pulsing Radar Search)          │  │
│  │                       ├── [ACCEPTED]    ➔ TripStatus (Live Driver Telemetry Card)    │  │
│  │                       ├── [ARRIVED]     ➔ OtpVerification.jsx (4-Digit Security PIN) │  │
│  │                       ├── [IN_PROGRESS] ➔ TripStatus (Live Route Progress Bar)       │  │
│  │                       └── [COMPLETED]   ➔ TripStatus (Trip Receipt & 5-Star Rating)  │  │
│  └───────────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Demo Credentials (Ready to Test)

| Account Type | Email | Password | Role | Features |
| :--- | :--- | :--- | :--- | :--- |
| **👤 Rider Demo** | `rider@cab.com` | `password123` | `rider` | Interactive map, vehicle tiers, real-time live trip tracking |
| **🚗 Driver Demo** | `driver@cab.com` | `password123` | `driver` | Vehicle details & driver dashboard |

- **Rider**: `rider@cab.com` / `password123`
- **Driver**: `driver@cab.com` / `password123`
