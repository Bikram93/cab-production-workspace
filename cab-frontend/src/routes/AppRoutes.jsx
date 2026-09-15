import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/components/LoginPage';
import RiderMapPage from '../features/booking/components/RiderMapPage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Authentication Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Rider Route */}
      <Route
        path="/rider"
        element={
          <ProtectedRoute allowedRoles={['rider', 'driver', 'admin']}>
            <RiderMapPage />
          </ProtectedRoute>
        }
      />

      {/* Default route redirect */}
      <Route path="/" element={<Navigate to="/rider" replace />} />

      {/* Catch-all 404 redirect */}
      <Route path="*" element={<Navigate to="/rider" replace />} />
    </Routes>
  );
}
