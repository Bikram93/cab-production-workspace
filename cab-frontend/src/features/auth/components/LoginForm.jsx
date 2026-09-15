import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

export default function LoginForm({ onToggleRegister }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim()) {
      setFormError('Please enter your email address.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await login(email, password);
      // Navigate based on role
      if (user.role === 'driver') {
        navigate('/rider'); // or driver dashboard
      } else {
        navigate('/rider');
      }
    } catch (err) {
      setFormError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (testEmail, testPassword) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setFormError('');
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
      <p className="text-sm text-gray-600 mb-6">
        Sign in with your credentials to access your rides and dashboard.
      </p>

      {formError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          id="login-email"
          name="email"
          type="email"
          placeholder="rider@cab.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          id="login-password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </form>

      {/* Demo Credentials Helper */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-2 text-center">
          ⚡ Quick Test Accounts (Demo)
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('rider@cab.com', 'password123')}
            className="text-xs py-1.5 px-2.5 rounded bg-gray-100 hover:bg-yellow-100 text-gray-800 border border-gray-200 hover:border-yellow-400 transition text-center font-medium"
          >
            👤 Rider Demo
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('driver@cab.com', 'password123')}
            className="text-xs py-1.5 px-2.5 rounded bg-gray-100 hover:bg-yellow-100 text-gray-800 border border-gray-200 hover:border-yellow-400 transition text-center font-medium"
          >
            🚗 Driver Demo
          </button>
        </div>
      </div>

      {onToggleRegister && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={onToggleRegister}
            className="font-semibold text-yellow-600 hover:text-yellow-700 underline"
          >
            Create an Account
          </button>
        </div>
      )}
    </div>
  );
}
