/**
 * Geolocation & Map Utility Functions
 */

// Default map center (San Francisco / Tech Hub, fallback when GPS is not active)
export const DEFAULT_CENTER = {
  lat: 37.7749,
  lng: -122.4194,
  label: 'Downtown Center',
};

// Quick preset locations for testing pickup & drop-off
export const PRESET_LOCATIONS = [
  { name: 'City Center Hub', lat: 37.7749, lng: -122.4194 },
  { name: 'International Airport (SFO)', lat: 37.6213, lng: -122.379 },
  { name: 'Financial District', lat: 37.7946, lng: -122.4014 },
  { name: 'Golden Gate Park', lat: 37.7694, lng: -122.4862 },
  { name: 'Tech Innovation Park', lat: 37.7833, lng: -122.4167 },
];

/**
 * Calculate accurate Haversine distance between two coordinates in Kilometers
 */
export function haversineDistance(coord1, coord2) {
  if (!coord1 || !coord2) return 0;

  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // 2 decimal places
}

/**
 * Estimate travel duration in minutes based on distance
 */
export function estimateTravelTime(distanceKm, averageSpeedKmh = 32) {
  if (!distanceKm || distanceKm <= 0) return 0;
  const hours = distanceKm / averageSpeedKmh;
  const minutes = Math.round(hours * 60);
  return Math.max(minutes, 3); // Minimum 3 minutes
}

/**
 * Calculate estimated ride fare
 */
export function calculateFare(distanceKm, baseFare = 5.0, perKmRate = 1.8) {
  if (!distanceKm || distanceKm <= 0) return 0;
  const total = baseFare + distanceKm * perKmRate;
  return Math.round(total * 100) / 100;
}

/**
 * Generate simulated nearby drivers around a center point
 */
export function generateMockDrivers(center, count = 4) {
  const drivers = [];
  const names = ['David K.', 'Elena R.', 'Marcus T.', 'Sarah L.'];
  const plates = ['CAB-402', 'CAB-819', 'CAB-115', 'CAB-674'];
  const cars = ['Toyota Camry', 'Honda Civic', 'Hyundai Ioniq', 'Tesla Model 3'];

  for (let i = 0; i < count; i++) {
    // Random offset ~ 0.5km to 2km
    const latOffset = (Math.random() - 0.5) * 0.02;
    const lngOffset = (Math.random() - 0.5) * 0.02;

    drivers.push({
      id: `driver_${i + 1}`,
      name: names[i] || `Driver #${i + 1}`,
      plate: plates[i] || 'CAB-000',
      car: cars[i] || 'Sedan',
      rating: (4.7 + Math.random() * 0.3).toFixed(1),
      lat: center.lat + latOffset,
      lng: center.lng + lngOffset,
    });
  }

  return drivers;
}
