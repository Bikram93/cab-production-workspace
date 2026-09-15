import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

export default function RegisterForm({ onToggleLogin }) {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState('rider');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleMake: '',
    vehicleModel: '',
    plateNumber: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role,
        ...(role === 'driver'
          ? {
              vehicle: {
                make: formData.vehicleMake,
                model: formData.vehicleModel,
                plate: formData.plateNumber,
              },
            }
          : {}),
      };

      await register(payload);
      navigate('/rider');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Create an Account</h2>
      <p className="text-sm text-gray-600 mb-6">
        Join CabService as a rider or apply to drive with us.
      </p>

      {/* Role Selector Tabs */}
      <div className="flex rounded-lg bg-gray-100 p-1 mb-5 border border-gray-200">
        <button
          type="button"
          onClick={() => setRole('rider')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
            role === 'rider'
              ? 'bg-white text-yellow-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          👤 I'm a Rider
        </button>
        <button
          type="button"
          onClick={() => setRole('driver')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
            role === 'driver'
              ? 'bg-white text-yellow-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🚗 I'm a Driver
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Full Name"
          name="name"
          placeholder="Jane Doe"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="jane@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="+1 555-0123"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Dynamic Driver Vehicle Fields */}
        {role === 'driver' && (
          <div className="p-3.5 bg-yellow-50/60 border border-yellow-200 rounded-lg space-y-3 mt-2">
            <h4 className="text-xs font-bold uppercase text-yellow-800 tracking-wider">
              Vehicle Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Input
                label="Make"
                name="vehicleMake"
                placeholder="Toyota"
                value={formData.vehicleMake}
                onChange={handleChange}
                required
              />
              <Input
                label="Model"
                name="vehicleModel"
                placeholder="Prius"
                value={formData.vehicleModel}
                onChange={handleChange}
                required
              />
              <Input
                label="License Plate"
                name="plateNumber"
                placeholder="7ABC123"
                value={formData.plateNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isSubmitting}
          className="mt-4"
        >
          Complete Registration
        </Button>
      </form>

      {onToggleLogin && (
        <div className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggleLogin}
            className="font-semibold text-yellow-600 hover:text-yellow-700 underline"
          >
            Sign In instead
          </button>
        </div>
      )}
    </div>
  );
}
