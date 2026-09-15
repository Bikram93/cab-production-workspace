import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_CENTER } from '../features/maps/utils/geoHelpers';

/**
 * Custom Hook: Accesses device GPS geolocation with graceful fallback
 */
export function useGeolocation() {
  const [location, setLocation] = useState(DEFAULT_CENTER);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const fetchLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);

    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      setLocation(DEFAULT_CENTER);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'My Current Location (GPS)',
        });
        setPermissionDenied(false);
        setIsLoading(false);
      },
      (err) => {
        console.warn('Geolocation access issue, using default map center:', err.message);
        setError(err.message);
        setPermissionDenied(err.code === 1); // 1 = PERMISSION_DENIED
        setLocation(DEFAULT_CENTER);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return {
    location,
    isLoading,
    error,
    permissionDenied,
    refreshLocation: fetchLocation,
  };
}

export default useGeolocation;
