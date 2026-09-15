import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.simulationInterval = null;
  }

  connect() {
    if (this.socket) return this.socket;

    try {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 2000,
        timeout: 5000,
      });

      this.socket.on('connect', () => {
        console.log('⚡ WebSocket Connected to Gateway:', this.socket.id);
        this.emitLocal('connection:status', { connected: true, id: this.socket.id });
      });

      this.socket.on('connect_error', (err) => {
        console.warn('WebSocket server unreachable, falling back to client-side real-time simulator:', err.message);
        this.emitLocal('connection:status', { connected: false, error: err.message });
      });

      this.socket.on('disconnect', (reason) => {
        console.log('WebSocket Disconnected:', reason);
        this.emitLocal('connection:status', { connected: false, reason });
      });

      // Forward server events to local subscribers
      const events = [
        'driver:assigned',
        'driver:location_update',
        'trip:status_update',
        'trip:arrived',
        'trip:completed',
        'ride:cancelled',
      ];

      events.forEach((event) => {
        this.socket.on(event, (data) => this.emitLocal(event, data));
      });
    } catch (err) {
      console.warn('Socket.io initialization skipped or failed:', err);
    }

    return this.socket;
  }

  disconnect() {
    this.stopSimulation();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Also register on actual socket if connected
    if (this.socket && typeof this.socket.on === 'function') {
      this.socket.on(event, callback);
    }

    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
    if (this.socket && typeof this.socket.off === 'function') {
      this.socket.off(event, callback);
    }
  }

  emitLocal(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in socket listener for ${event}:`, e);
        }
      });
    }
  }

  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      // Local broadcast fallback
      this.emitLocal(event, data);
    }
  }

  /**
   * Real-time Driver GPS Interpolation Simulator
   * Smoothly animates driver coordinates from origin to destination at 1-second intervals.
   */
  startDriverMovementSimulation(startCoords, endCoords, onUpdate, durationSeconds = 12) {
    this.stopSimulation();

    const totalSteps = durationSeconds * 2; // update every 500ms
    let currentStep = 0;

    this.simulationInterval = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / totalSteps, 1);

      // Linear interpolation between start and end coordinates
      const currentLat = startCoords.lat + (endCoords.lat - startCoords.lat) * progress;
      const currentLng = startCoords.lng + (endCoords.lng - startCoords.lng) * progress;

      const updateData = {
        lat: Number(currentLat.toFixed(6)),
        lng: Number(currentLng.toFixed(6)),
        progress: Math.round(progress * 100),
        bearing: this.calculateBearing(startCoords, endCoords),
      };

      if (onUpdate) onUpdate(updateData);
      this.emitLocal('driver:location_update', updateData);

      if (progress >= 1) {
        this.stopSimulation();
      }
    }, 500);
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  calculateBearing(start, end) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;

    const y = Math.sin(toRad(end.lng - start.lng)) * Math.cos(toRad(end.lat));
    const x =
      Math.cos(toRad(start.lat)) * Math.sin(toRad(end.lat)) -
      Math.sin(toRad(start.lat)) * Math.cos(toRad(end.lat)) * Math.cos(toRad(end.lng - start.lng));

    return (toDeg(Math.atan2(y, x)) + 360) % 360;
  }
}

export const socketService = new SocketService();
export default socketService;
