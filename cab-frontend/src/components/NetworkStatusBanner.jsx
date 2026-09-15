import React, { useState, useEffect } from 'react';

export default function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      setTimeout(() => setShowRestored(false), 3500);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="bg-amber-500 text-gray-950 px-4 py-1.5 text-xs font-bold flex items-center justify-center space-x-2 text-center sticky top-0 z-50 shadow-sm animate-pulse">
        <span>⚠️</span>
        <span>You are currently offline. Real-time driver updates are paused until reconnection.</span>
      </div>
    );
  }

  if (showRestored) {
    return (
      <div className="bg-green-600 text-white px-4 py-1.5 text-xs font-bold flex items-center justify-center space-x-2 text-center sticky top-0 z-50 shadow-sm transition-all duration-500">
        <span>⚡</span>
        <span>Network connection restored! Live vehicle synchronization active.</span>
      </div>
    );
  }

  return null;
}
