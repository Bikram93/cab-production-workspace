import L from 'leaflet';

/**
 * Draws or updates an animated-style route polyline between pickup and dropoff
 */
export function drawRoutePolyline(mapInstance, pickup, dropoff) {
  if (!mapInstance || !pickup || !dropoff) return null;

  const latlngs = [
    [pickup.lat, pickup.lng],
    [dropoff.lat, dropoff.lng],
  ];

  // Primary route line
  const polyline = L.polyline(latlngs, {
    color: '#eab308', // Tailwind yellow-500
    weight: 5,
    opacity: 0.85,
    smoothFactor: 1,
    dashArray: '8, 8',
  }).addTo(mapInstance);

  return polyline;
}

export default drawRoutePolyline;
