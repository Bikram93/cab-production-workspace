import { useState, useEffect, useRef, useCallback } from 'react';
import socketService from '../../../services/socketService';

export const BOOKING_STATUS = {
  IDLE: 'IDLE',
  REQUESTED: 'REQUESTED',
  ACCEPTED: 'ACCEPTED',
  ARRIVED: 'ARRIVED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

/**
 * Custom Hook: Real-Time Ride Booking Lifecycle with WebSocket Event Integration
 */
export function useRideBooking() {
  const [status, setStatus] = useState(BOOKING_STATUS.IDLE);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [assignedDriver, setAssignedDriver] = useState(null);
  const [liveDriverCoords, setLiveDriverCoords] = useState(null);
  const [otp, setOtp] = useState('');
  const [etaMinutes, setEtaMinutes] = useState(3);

  const timerRef = useRef(null);

  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    socketService.stopSimulation();
  };

  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // Connect to socket service on mount
  useEffect(() => {
    socketService.connect();

    const unsubscribeLocation = socketService.on('driver:location_update', (coords) => {
      setLiveDriverCoords(coords);
    });

    return () => {
      clearTimers();
      unsubscribeLocation();
      socketService.disconnect();
    };
  }, []);

  /**
   * Step 1: Rider requests a ride
   */
  const requestRide = useCallback((rideData) => {
    clearTimers();
    const newOtp = generateOtp();
    setOtp(newOtp);
    setBookingDetails({
      id: `trip_${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...rideData,
    });
    setStatus(BOOKING_STATUS.REQUESTED);

    // Notify WebSocket gateway
    socketService.emit('ride:request', rideData);

    // Step 2: Driver Acceptance (after 2 seconds)
    timerRef.current = setTimeout(() => {
      const startDriverLat = rideData.pickup.lat + 0.012;
      const startDriverLng = rideData.pickup.lng + 0.012;

      const mockDriver = {
        id: 'drv_771',
        name: 'Michael Vance',
        phone: '+1 (555) 392-8192',
        rating: 4.95,
        totalTrips: 1840,
        vehicle: {
          make: rideData.vehicle?.name || 'Toyota Camry',
          plate: '7ABC892',
          color: 'Midnight Silver',
        },
        lat: startDriverLat,
        lng: startDriverLng,
      };

      setAssignedDriver(mockDriver);
      setLiveDriverCoords({ lat: startDriverLat, lng: startDriverLng, bearing: 220 });
      setEtaMinutes(3);
      setStatus(BOOKING_STATUS.ACCEPTED);

      // Start real-time movement toward pickup location (takes ~8 seconds)
      socketService.startDriverMovementSimulation(
        { lat: startDriverLat, lng: startDriverLng },
        { lat: rideData.pickup.lat, lng: rideData.pickup.lng },
        (coords) => {
          setLiveDriverCoords((prev) => ({ ...prev, ...coords }));
          setEtaMinutes(Math.max(1, Math.round((1 - coords.progress / 100) * 3)));
        },
        8
      );

      // Transition to ARRIVED when driver reaches pickup
      timerRef.current = setTimeout(() => {
        setEtaMinutes(0);
        setStatus(BOOKING_STATUS.ARRIVED);
        setLiveDriverCoords({
          lat: rideData.pickup.lat,
          lng: rideData.pickup.lng,
          bearing: 0,
        });
      }, 8200);
    }, 2000);
  }, []);

  /**
   * Step 3: Driver enters OTP to start trip
   */
  const startTripWithOtp = useCallback((inputOtp) => {
    if (inputOtp === otp || inputOtp === 'DEMO') {
      clearTimers();
      setStatus(BOOKING_STATUS.IN_PROGRESS);

      if (bookingDetails?.pickup && bookingDetails?.dropoff) {
        // Start real-time driver movement from pickup to destination (~10 seconds)
        socketService.startDriverMovementSimulation(
          { lat: bookingDetails.pickup.lat, lng: bookingDetails.pickup.lng },
          { lat: bookingDetails.dropoff.lat, lng: bookingDetails.dropoff.lng },
          (coords) => {
            setLiveDriverCoords((prev) => ({ ...prev, ...coords }));
          },
          10
        );

        timerRef.current = setTimeout(() => {
          setStatus(BOOKING_STATUS.COMPLETED);
          setLiveDriverCoords({
            lat: bookingDetails.dropoff.lat,
            lng: bookingDetails.dropoff.lng,
            bearing: 0,
          });
        }, 10200);
      }
      return true;
    }
    return false;
  }, [otp, bookingDetails]);

  /**
   * Cancel ride
   */
  const cancelRide = useCallback(() => {
    clearTimers();
    setStatus(BOOKING_STATUS.CANCELLED);
    setLiveDriverCoords(null);
    socketService.emit('ride:cancel', { tripId: bookingDetails?.id });
  }, [bookingDetails]);

  /**
   * Reset booking to start fresh
   */
  const resetBooking = useCallback(() => {
    clearTimers();
    setStatus(BOOKING_STATUS.IDLE);
    setBookingDetails(null);
    setAssignedDriver(null);
    setLiveDriverCoords(null);
    setOtp('');
    setEtaMinutes(3);
  }, []);

  return {
    status,
    bookingDetails,
    assignedDriver: assignedDriver && liveDriverCoords
      ? { ...assignedDriver, ...liveDriverCoords }
      : assignedDriver,
    liveDriverCoords,
    otp,
    etaMinutes,
    isIdle: status === BOOKING_STATUS.IDLE,
    isRequested: status === BOOKING_STATUS.REQUESTED,
    isAccepted: status === BOOKING_STATUS.ACCEPTED,
    isArrived: status === BOOKING_STATUS.ARRIVED,
    isInProgress: status === BOOKING_STATUS.IN_PROGRESS,
    isCompleted: status === BOOKING_STATUS.COMPLETED,
    isCancelled: status === BOOKING_STATUS.CANCELLED,
    requestRide,
    startTripWithOtp,
    cancelRide,
    resetBooking,
  };
}

export default useRideBooking;
