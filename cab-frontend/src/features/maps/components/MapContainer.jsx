import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  createDriverIcon,
  createAssignedDriverIcon,
  createPickupIcon,
  createDropoffIcon,
} from './DriverMarker';
import { drawRoutePolyline } from './RoutePolyline';

export default function MapContainer({
  center = { lat: 37.7749, lng: -122.4194 },
  zoom = 13,
  pickup = null,
  dropoff = null,
  drivers = [],
  activeDriver = null,
  selectionMode = 'pickup',
  onMapClick,
  className = '',
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const activeDriverMarkerRef = useRef(null);
  const polylineRef = useRef(null);

  // Initialize map instance
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    markersGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update click handler on map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleClick = (e) => {
      if (onMapClick) {
        onMapClick({
          lat: Math.round(e.latlng.lat * 10000) / 10000,
          lng: Math.round(e.latlng.lng * 10000) / 10000,
        });
      }
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [onMapClick]);

  // Center pan when center changes and no route exists
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && center && !pickup && !dropoff && !activeDriver) {
      map.panTo([center.lat, center.lng], { animate: true });
    }
  }, [center, pickup, dropoff, activeDriver]);

  // Render static markers and route polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group) return;

    // Clear previous markers and polylines
    group.clearLayers();
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    const boundsPoints = [];

    // Render idle nearby drivers only when no active assigned driver
    if (!activeDriver) {
      drivers.forEach((driver) => {
        const driverMarker = L.marker([driver.lat, driver.lng], {
          icon: createDriverIcon(driver),
        });

        driverMarker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 140px; padding: 2px;">
            <h4 style="margin: 0 0 4px; font-size: 13px; font-weight: 700; color: #111827;">${driver.name}</h4>
            <p style="margin: 0 0 2px; font-size: 11px; color: #4b5563;">⭐ ${driver.rating} • ${driver.car}</p>
            <span style="display: inline-block; background: #fef08a; color: #854d0e; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
              ${driver.plate}
            </span>
          </div>
        `);

        group.addLayer(driverMarker);
      });
    }

    // Render Pickup pin
    if (pickup) {
      const pickupMarker = L.marker([pickup.lat, pickup.lng], {
        icon: createPickupIcon(),
      }).bindPopup(`<b>Pickup:</b> ${pickup.label || 'Selected Location'}`);

      group.addLayer(pickupMarker);
      boundsPoints.push([pickup.lat, pickup.lng]);
    }

    // Render Drop-off pin
    if (dropoff) {
      const dropoffMarker = L.marker([dropoff.lat, dropoff.lng], {
        icon: createDropoffIcon(),
      }).bindPopup(`<b>Destination:</b> ${dropoff.label || 'Selected Destination'}`);

      group.addLayer(dropoffMarker);
      boundsPoints.push([dropoff.lat, dropoff.lng]);
    }

    // Render route polyline between pickup and dropoff
    if (pickup && dropoff) {
      polylineRef.current = drawRoutePolyline(map, pickup, dropoff);

      if (boundsPoints.length >= 2) {
        map.fitBounds(L.latLngBounds(boundsPoints), {
          padding: [60, 60],
          animate: true,
        });
      }
    }
  }, [pickup, dropoff, drivers, Boolean(activeDriver)]);

  // Live Assigned Driver Marker Update
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (activeDriver && activeDriver.lat && activeDriver.lng) {
      if (!activeDriverMarkerRef.current) {
        activeDriverMarkerRef.current = L.marker([activeDriver.lat, activeDriver.lng], {
          icon: createAssignedDriverIcon(activeDriver, activeDriver.bearing),
          zIndexOffset: 1000,
        }).addTo(map);
      } else {
        activeDriverMarkerRef.current.setLatLng([activeDriver.lat, activeDriver.lng]);
        activeDriverMarkerRef.current.setIcon(
          createAssignedDriverIcon(activeDriver, activeDriver.bearing)
        );
      }
    } else if (activeDriverMarkerRef.current) {
      activeDriverMarkerRef.current.remove();
      activeDriverMarkerRef.current = null;
    }
  }, [activeDriver]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Map Target Canvas */}
      <div ref={mapRef} className="w-full h-full z-0" />

      {/* Mode Status Badge */}
      <div className="absolute top-3 left-3 z-[400] pointer-events-none">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-semibold text-gray-800 shadow-md border border-gray-200">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              activeDriver
                ? 'bg-yellow-500 animate-ping'
                : selectionMode === 'pickup'
                ? 'bg-green-500 animate-pulse'
                : selectionMode === 'dropoff'
                ? 'bg-red-500 animate-pulse'
                : 'bg-gray-400'
            }`}
          />
          <span>
            {activeDriver
              ? `Live Tracking: ${activeDriver.name || 'Driver'} En Route 🚗`
              : selectionMode === 'pickup'
              ? 'Click map to set Pickup (📍)'
              : selectionMode === 'dropoff'
              ? 'Click map to set Destination (🏁)'
              : 'Viewing Map'}
          </span>
        </span>
      </div>
    </div>
  );
}
