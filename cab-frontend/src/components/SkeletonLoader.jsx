import React from 'react';

/**
 * Skeleton Loader Component providing shimmer states for asynchronous content
 */
export function SkeletonLoader({ type = 'card', count = 1, className = '' }) {
  const items = Array.from({ length: count });

  if (type === 'vehicle-card') {
    return (
      <div className="space-y-2">
        {items.map((_, i) => (
          <div
            key={i}
            className="p-3 rounded-xl border border-gray-200 bg-white flex items-center justify-between animate-pulse"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gray-200" />
              <div className="space-y-1.5">
                <div className="w-24 h-3.5 bg-gray-200 rounded" />
                <div className="w-36 h-2.5 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="w-12 h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'driver-card') {
    return (
      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div className="space-y-1.5">
            <div className="w-28 h-4 bg-gray-200 rounded" />
            <div className="w-20 h-3 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="w-16 h-6 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded animate-pulse w-full"
        />
      ))}
    </div>
  );
}

export default SkeletonLoader;
