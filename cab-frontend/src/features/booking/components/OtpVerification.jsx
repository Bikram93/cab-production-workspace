import React, { useState } from 'react';
import Button from '../../../components/Button';

export default function OtpVerification({ otp, onVerify }) {
  const [inputOtp, setInputOtp] = useState('');
  const [error, setError] = useState('');

  const handleSimulateAutoFill = () => {
    if (onVerify) {
      onVerify(otp);
    }
  };

  const handleManualVerify = (e) => {
    e.preventDefault();
    if (inputOtp === otp) {
      setError('');
      if (onVerify) onVerify(inputOtp);
    } else {
      setError('Invalid PIN code. Please enter the matching 4-digit code.');
    }
  };

  return (
    <div className="bg-yellow-50/70 border border-yellow-300 rounded-2xl p-5 text-center shadow-sm">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-400 text-2xl rounded-full mb-2 shadow-xs">
        🔐
      </div>

      <h3 className="text-base font-bold text-gray-900">Your Ride Start PIN (OTP)</h3>
      <p className="text-xs text-gray-600 mt-1 max-w-xs mx-auto">
        Share this 4-digit verification code with your driver once you enter the vehicle.
      </p>

      {/* Digits Display */}
      <div className="my-4 flex items-center justify-center space-x-2">
        {otp.split('').map((digit, idx) => (
          <div
            key={idx}
            className="w-12 h-14 bg-white border-2 border-yellow-500 rounded-xl flex items-center justify-center text-2xl font-black text-gray-900 shadow-sm"
          >
            {digit}
          </div>
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-600 font-semibold mb-3">{error}</p>
      )}

      {/* Driver Simulation Action */}
      <div className="pt-2 border-t border-yellow-200">
        <p className="text-[11px] text-gray-500 mb-2 font-medium">
          ⚡ Demo Testing: Simulate driver verifying this code
        </p>
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={handleSimulateAutoFill}
        >
          ✅ Driver Validates PIN & Starts Trip
        </Button>
      </div>
    </div>
  );
}
