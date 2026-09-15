import React, { useState, useEffect } from 'react';
import MapContainer from '../../maps/components/MapContainer';
import useGeolocation from '../../../hooks/useGeolocation';
import useRideBooking from '../hooks/useRideBooking';
import RideEstimator from './RideEstimator';
import TripStatus from './TripStatus';
import SkeletonLoader from '../../../components/SkeletonLoader';
import {
  haversineDistance,
  estimateTravelTime,
  generateMockDrivers,
  PRESET_LOCATIONS,
} from '../../maps/utils/geoHelpers';
import Button from '../../../components/Button';

export default function RiderMapPage() {
  const { location: userGeo, isLoading: geoLoading, refreshLocation } = useGeolocation();
  const booking = useRideBooking();

  // Selected trip points
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [selectionMode, setSelectionMode] = useState('pickup');

  // Nearby simulated drivers
  const [drivers, setDrivers] = useState([]);

  // Initialize pickup to user's geolocation once detected
  useEffect(() => {
    if (userGeo && !pickup) {
      setPickup({
        lat: userGeo.lat,
        lng: userGeo.lng,
        label: userGeo.label || 'Current Location',
      });
      setDrivers(generateMockDrivers(userGeo, 4));
    }
  }, [userGeo]);

  // Handle clicking on map to place pins
  const handleMapClick = (coords) => {
    if (!booking.isIdle) return; // Lock pins during active ride

    if (selectionMode === 'pickup') {
      setPickup({
        lat: coords.lat,
        lng: coords.lng,
        label: `Custom Pickup (${coords.lat}, ${coords.lng})`,
      });
      setSelectionMode('dropoff');
    } else {
      setDropoff({
        lat: coords.lat,
        lng: coords.lng,
        label: `Custom Destination (${coords.lat}, ${coords.lng})`,
      });
    }
  };

  const handleSelectPreset = (preset, type) => {
    if (!booking.isIdle) return;

    if (type === 'pickup') {
      setPickup({
        lat: preset.lat,
        lng: preset.lng,
        label: preset.name,
      });
      setSelectionMode('dropoff');
    } else {
      setDropoff({
        lat: preset.lat,
        lng: preset.lng,
        label: preset.name,
      });
    }
  };

  const handleResetPoints = () => {
    setDropoff(null);
    setSelectionMode('pickup');
  };

  // Distance & time calculation
  const distanceKm = pickup && dropoff ? haversineDistance(pickup, dropoff) : 0;
  const estTimeMin = estimateTravelTime(distanceKm);

  // Trigger Booking Request (Step 1 of Lifecycle)
  const handleRequestRide = (selectedData) => {
    booking.requestRide({
      pickup,
      dropoff,
      distanceKm: selectedData.distanceKm,
      durationMin: selectedData.durationMin,
      vehicle: selectedData.vehicle,
      fare: selectedData.fare,
    });
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-65px)] overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col h-auto md:h-full z-10 shadow-lg overflow-y-auto">
        {/* Header Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🚖</span>
            <h2 className="text-lg font-bold text-gray-900">
              {booking.isIdle ? 'Ride Planner' : 'Trip in Progress'}
            </h2>
          </div>

          {booking.isIdle && (
            <button
              type="button"
              onClick={refreshLocation}
              disabled={geoLoading}
              title="Locate via GPS"
              className="text-xs px-2.5 py-1 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200 hover:bg-yellow-100 font-medium flex items-center space-x-1"
            >
              <span>{geoLoading ? '⌛' : '🎯'}</span>
              <span>GPS</span>
            </button>
          )}
        </div>

        {/* ── Active Ride Lifecycle View ── */}
        {!booking.isIdle ? (
          <TripStatus
            status={booking.status}
            bookingDetails={booking.bookingDetails}
            assignedDriver={booking.assignedDriver}
            otp={booking.otp}
            etaMinutes={booking.etaMinutes}
            onVerifyOtp={booking.startTripWithOtp}
            onCancel={booking.cancelRide}
            onReset={() => {
              booking.resetBooking();
              handleResetPoints();
            }}
          />
        ) : (
          /* ── Idle Ride Planning View ── */
          <div className="p-4 space-y-4 flex-1 flex flex-col">
            {/* Mode Toggle Buttons */}
            <div className="bg-gray-100 p-1 rounded-lg flex space-x-1 border border-gray-200">
              <button
                type="button"
                onClick={() => setSelectionMode('pickup')}
                className={`flex-1 py-1.5 px-2.5 rounded-md text-xs font-semibold flex items-center justify-center space-x-1 transition ${
                  selectionMode === 'pickup'
                    ? 'bg-green-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>📍</span>
                <span>Pickup</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectionMode('dropoff')}
                className={`flex-1 py-1.5 px-2.5 rounded-md text-xs font-semibold flex items-center justify-center space-x-1 transition ${
                  selectionMode === 'dropoff'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>🏁</span>
                <span>Drop-off</span>
              </button>
            </div>

            {/* Address Cards */}
            <div className="space-y-2">
              <div className="p-2.5 bg-green-50/70 border border-green-200 rounded-xl">
                <div className="flex justify-between items-center text-[11px] font-bold text-green-800 uppercase">
                  <span>Pickup</span>
                  {pickup && <span className="text-[10px] text-green-600 font-normal">Selected</span>}
                </div>
                <p className="text-xs font-semibold text-gray-900 truncate mt-0.5">
                  {pickup?.label || 'Click map to select pickup'}
                </p>
              </div>

              <div className="p-2.5 bg-red-50/70 border border-red-200 rounded-xl">
                <div className="flex justify-between items-center text-[11px] font-bold text-red-800 uppercase">
                  <span>Destination</span>
                  {dropoff && <span className="text-[10px] text-red-600 font-normal">Selected</span>}
                </div>
                <p className="text-xs font-semibold text-gray-900 truncate mt-0.5">
                  {dropoff?.label || 'Click map to select drop-off'}
                </p>
              </div>
            </div>

            {/* Location Presets */}
            <div>
              <span className="text-[11px] font-bold uppercase text-gray-500 tracking-wider block mb-1.5">
                Quick Shortcuts:
              </span>
              <div className="flex flex-wrap gap-1">
                {PRESET_LOCATIONS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset, selectionMode)}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-yellow-100 border border-gray-200 rounded-md text-gray-800 transition"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimator & Vehicle Tier Selection */}
            {pickup && dropoff ? (
              <div className="pt-2 border-t border-gray-100 flex-1">
                <RideEstimator
                  baseFare={5.0}
                  distanceKm={distanceKm}
                  durationMin={estTimeMin}
                  onRequestRide={handleRequestRide}
                />
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center text-xs text-gray-500 my-auto">
                <p className="text-2xl mb-1">🗺️</p>
                Select both a <b>Pickup</b> and a <b>Destination</b> point to view vehicle options and fare quotes.
              </div>
            )}

            {dropoff && (
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={handleResetPoints}
                className="mt-auto"
              >
                Clear Destination
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Right Map Canvas with Real-Time Active Driver Marker */}
      <div className="flex-1 h-96 md:h-full relative">
        <MapContainer
          center={userGeo}
          zoom={13}
          pickup={pickup}
          dropoff={dropoff}
          drivers={drivers}
          activeDriver={booking.assignedDriver}
          selectionMode={booking.isIdle ? selectionMode : null}
          onMapClick={handleMapClick}
        />
      </div>
    </div>
  );
}
