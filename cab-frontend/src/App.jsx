import React from 'react';
import { BrowserRouter, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import NetworkStatusBanner from './components/NetworkStatusBanner';

function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🚖</span>
          <span className="font-bold text-lg tracking-tight text-yellow-600">
            CabService
          </span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link
            to="/rider"
            className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition"
          >
            Rider Dashboard
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-2.5 py-1 bg-gray-100 rounded-full text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-medium text-gray-800">{user?.name}</span>
                <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-yellow-200 text-yellow-800 font-bold">
                  {user?.role}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-700 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium px-3.5 py-1.5 rounded-md bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold transition shadow-sm"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
            <NetworkStatusBanner />
            <NavBar />
            <main className="flex-1 flex flex-col">
              <AppRoutes />
            </main>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
