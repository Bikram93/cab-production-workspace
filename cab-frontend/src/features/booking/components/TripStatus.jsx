import React, { useState } from 'react';
import { BOOKING_STATUS } from '../hooks/useRideBooking';
import OtpVerification from './OtpVerification';
import Button from '../../../components/Button';

export default function TripStatus({
  status,
  bookingDetails,
  assignedDriver,
  otp,
  etaMinutes,
  onVerifyOtp,
  onCancel,
  onReset,
}) {
  const [rating, setRating] = useState(5);
  const [tip, setTip] = useState(0);

  // 1. REQUESTING DRIVER (SEARCHING RADAR)
  if (status === BOOKING_STATUS.REQUESTED) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 animate-ping" />
          <div className="relative w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-3xl shadow-md">
            🚕
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900">Connecting to Nearby Drivers...</h3>
          <p className="text-xs text-gray-500 mt-1">
            Dispatching live WebSocket request to available fleet.
          </p>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1 text-left">
          <div className="flex justify-between">
            <span className="font-semibold">Pickup:</span>
            <span className="truncate max-w-[200px]">{bookingDetails?.pickup?.label}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Vehicle:</span>
            <span>{bookingDetails?.vehicle?.name}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900">
            <span>Estimated Fare:</span>
            <span className="text-yellow-600">${bookingDetails?.fare}</span>
          </div>
        </div>

        <Button variant="outline" size="sm" fullWidth onClick={onCancel}>
          Cancel Request
        </Button>
      </div>
    );
  }

  // 2. DRIVER ACCEPTED (ON THE WAY)
  if (status === BOOKING_STATUS.ACCEPTED) {
    const progress = assignedDriver?.progress || 0;

    return (
      <div className="p-5 space-y-4">
        {/* Status Pill */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Driver Approaching</span>
            </span>
            <h3 className="text-base font-bold text-gray-900 mt-1">
              Live GPS Tracking Active
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Arriving in</span>
            <p className="text-xl font-black text-yellow-600">~{etaMinutes} min</p>
          </div>
        </div>

        {/* Live Approaching Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold text-gray-600">
            <span>Driver Distance Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Driver Profile Card */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-2xl font-bold border-2 border-white shadow-sm">
              👨‍✈️
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">{assignedDriver?.name}</h4>
              <p className="text-xs text-gray-500">⭐ {assignedDriver?.rating} ({assignedDriver?.totalTrips} trips)</p>
              <span className="text-xs font-semibold text-gray-700">{assignedDriver?.vehicle?.make}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-2 py-1 rounded bg-yellow-200 text-yellow-900 font-mono font-bold text-xs tracking-wider border border-yellow-300">
              {assignedDriver?.vehicle?.plate}
            </span>
            <p className="text-[10px] text-gray-500 mt-1">{assignedDriver?.vehicle?.color}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${assignedDriver?.phone}`}
            className="text-center py-2 px-3 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition flex items-center justify-center space-x-1"
          >
            <span>📞</span>
            <span>Call Driver</span>
          </a>
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel Ride
          </Button>
        </div>
      </div>
    );
  }

  // 3. DRIVER ARRIVED AT PICKUP (SHOW OTP)
  if (status === BOOKING_STATUS.ARRIVED) {
    return (
      <div className="p-5 space-y-4">
        <div className="text-center pb-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-xs">
            🚖 Driver Has Arrived at Pickup!
          </span>
          <p className="text-xs text-gray-500 mt-1">
            {assignedDriver?.name} is waiting at your location.
          </p>
        </div>

        {/* Driver Snapshot */}
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-800">{assignedDriver?.name} ({assignedDriver?.vehicle?.make})</span>
          <span className="font-mono font-bold text-yellow-800 bg-yellow-200 px-2 py-0.5 rounded">
            {assignedDriver?.vehicle?.plate}
          </span>
        </div>

        {/* Embedded OTP verification screen */}
        <OtpVerification otp={otp} onVerify={onVerifyOtp} />
      </div>
    );
  }

  // 4. IN PROGRESS (TRIP ONGOING WITH REAL-TIME MOVEMENT)
  if (status === BOOKING_STATUS.IN_PROGRESS) {
    const progress = assignedDriver?.progress || 0;

    return (
      <div className="p-6 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-3xl mx-auto shadow-lg animate-pulse">
          🛣️
        </div>

        <div>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-green-100 text-green-800 font-bold text-xs rounded-full uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span>Trip in Progress</span>
          </span>
          <h3 className="text-xl font-bold text-gray-900">Heading to Destination</h3>
          <p className="text-xs text-gray-500 mt-1">
            Live GPS telemetry streaming car position directly on map.
          </p>
        </div>

        {/* Live Trip Progress Bar */}
        <div className="space-y-1 text-left">
          <div className="flex justify-between text-xs font-bold text-gray-700">
            <span>Route Completion</span>
            <span className="text-green-600">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-left text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Destination:</span>
            <span className="font-bold text-gray-900 truncate max-w-[200px]">
              {bookingDetails?.dropoff?.label}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Driver:</span>
            <span className="font-semibold text-gray-800">{assignedDriver?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Trip Fare:</span>
            <span className="font-extrabold text-yellow-600">${bookingDetails?.fare}</span>
          </div>
        </div>
      </div>
    );
  }

  // 5. TRIP COMPLETED (RECEIPT & FEEDBACK)
  if (status === BOOKING_STATUS.COMPLETED) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl mx-auto border-2 border-green-500">
          ✓
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900">You have arrived!</h3>
          <p className="text-xs text-gray-500 mt-0.5">Thank you for riding with CabService.</p>
        </div>

        {/* Receipt Box */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs text-left">
          <div className="flex justify-between text-gray-500">
            <span>Trip ID:</span>
            <span className="font-mono text-gray-800">{bookingDetails?.id}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Distance:</span>
            <span className="font-semibold text-gray-800">{bookingDetails?.distanceKm} km</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Payment Method:</span>
            <span className="font-semibold text-gray-800">💳 Card (•• 4242)</span>
          </div>
          <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-extrabold text-gray-900">
            <span>Total Paid:</span>
            <span className="text-green-600">${bookingDetails?.fare + tip}</span>
          </div>
        </div>

        {/* Driver Rating */}
        <div className="py-1">
          <p className="text-xs font-bold text-gray-700 mb-2">
            Rate your ride with {assignedDriver?.name}:
          </p>
          <div className="flex justify-center space-x-2 text-2xl cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={`transition transform hover:scale-125 ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <Button variant="primary" size="md" fullWidth onClick={onReset}>
          Book Another Ride
        </Button>
      </div>
    );
  }

  // 6. CANCELLED
  if (status === BOOKING_STATUS.CANCELLED) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto">
          ✕
        </div>
        <h3 className="text-lg font-bold text-gray-900">Ride Cancelled</h3>
        <p className="text-xs text-gray-500">
          Your ride request has been cancelled. No cancellation fees applied.
        </p>
        <Button variant="primary" size="sm" fullWidth onClick={onReset}>
          Plan New Ride
        </Button>
      </div>
    );
  }

  return null;
}
