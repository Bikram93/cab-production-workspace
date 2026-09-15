import React, { useState } from 'react';
import Button from '../../../components/Button';

export const VEHICLE_TIERS = [
  {
    id: 'tier_economy',
    name: 'Cab Economy',
    description: 'Affordable, everyday reliable rides',
    multiplier: 1.0,
    seats: 4,
    icon: '🚗',
    etaMin: 3,
  },
  {
    id: 'tier_comfort',
    name: 'Cab Comfort',
    description: 'Spacious legroom & newer vehicles',
    multiplier: 1.35,
    seats: 4,
    icon: '🚙',
    etaMin: 5,
  },
  {
    id: 'tier_xl',
    name: 'Cab XL',
    description: 'SUVs for groups up to 6 riders',
    multiplier: 1.65,
    seats: 6,
    icon: '🚐',
    etaMin: 6,
  },
  {
    id: 'tier_premier',
    name: 'Cab Premier',
    description: 'High-end luxury electric & sedans',
    multiplier: 2.1,
    seats: 4,
    icon: '✨',
    etaMin: 4,
  },
];

export default function RideEstimator({
  baseFare = 5.0,
  distanceKm = 0,
  durationMin = 0,
  onRequestRide,
}) {
  const [selectedTierId, setSelectedTierId] = useState('tier_economy');

  const selectedTier =
    VEHICLE_TIERS.find((t) => t.id === selectedTierId) || VEHICLE_TIERS[0];

  const calculateTierFare = (tier) => {
    const raw = (baseFare + distanceKm * 1.8) * tier.multiplier;
    return Math.round(raw * 100) / 100;
  };

  const currentFare = calculateTierFare(selectedTier);

  const handleConfirm = () => {
    if (onRequestRide) {
      onRequestRide({
        vehicle: selectedTier,
        fare: currentFare,
        distanceKm,
        durationMin,
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="pb-3 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-900">Choose a Ride</h3>
        <p className="text-xs text-gray-500">
          Trip distance: <span className="font-semibold text-gray-700">{distanceKm} km</span> •{' '}
          Est. time: <span className="font-semibold text-gray-700">~{durationMin} min</span>
        </p>
      </div>

      {/* Vehicle Tier List */}
      <div className="space-y-2 py-3 overflow-y-auto max-h-60 pr-1">
        {VEHICLE_TIERS.map((tier) => {
          const isSelected = tier.id === selectedTierId;
          const fare = calculateTierFare(tier);

          return (
            <div
              key={tier.id}
              onClick={() => setSelectedTierId(tier.id)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                isSelected
                  ? 'border-yellow-500 bg-yellow-50/60 ring-2 ring-yellow-400/50 shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                  {tier.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-sm font-bold text-gray-900">{tier.name}</h4>
                    <span className="text-[10px] text-gray-500 font-medium">
                      👤 {tier.seats}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{tier.etaMin} min away • {tier.description}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-extrabold text-gray-900">
                  ${fare}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fare Summary Breakdown */}
      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1 my-2 text-xs">
        <div className="flex justify-between text-gray-600">
          <span>Base Fare:</span>
          <span>${baseFare.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Distance Rate ({distanceKm} km):</span>
          <span>${(distanceKm * 1.8).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Vehicle Class Multiplier:</span>
          <span>×{selectedTier.multiplier}</span>
        </div>
        <div className="pt-1.5 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-sm">
          <span>Total Estimated Fare:</span>
          <span className="text-yellow-600 font-extrabold">${currentFare}</span>
        </div>
      </div>

      {/* Request Button */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleConfirm}
          className="shadow-md"
        >
          Confirm {selectedTier.name} (${currentFare})
        </Button>
      </div>
    </div>
  );
}
