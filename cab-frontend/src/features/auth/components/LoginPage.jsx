import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-yellow-50/50 to-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8 transition-all">
        {/* Brand Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-yellow-400 flex items-center justify-center text-3xl shadow-md transform -rotate-3">
            🚖
          </div>
        </div>

        {isRegisterMode ? (
          <RegisterForm onToggleLogin={() => setIsRegisterMode(false)} />
        ) : (
          <LoginForm onToggleRegister={() => setIsRegisterMode(true)} />
        )}
      </div>
    </div>
  );
}
