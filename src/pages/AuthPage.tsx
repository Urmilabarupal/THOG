/**
 * @file src/pages/AuthPage.tsx
 * @purpose Authentication portal handling Login, Customer Registration, and Password Recovery.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Features role-based sign in, instant developer test login shortcuts,
 * password recovery simulation, and input sanitization.
 */

import React, { useState } from 'react';
import { Lock, Mail, User as UserIcon, Phone, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'forgot-password';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const { currentView, navigate, login, quickLoginAs, showToast } = useStore();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>(
    currentView === 'register' ? 'register' : currentView === 'forgot-password' ? 'forgot-password' : initialMode
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to sign in.');

        login(data.data);
        if (data.data.role === 'admin') {
          navigate('admin');
        } else {
          navigate('customer-dashboard');
        }
      } else if (mode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed.');

        login(data.data);
        showToast('Account created successfully! Welcome to The House of Gaunt.');
        navigate('customer-dashboard');
      } else if (mode === 'forgot-password') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Password reset request failed.');
        setInfoMessage(data.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#FBFBFA]">
      <div className="max-w-md w-full bg-white border border-stone-200 rounded p-8 shadow-xs space-y-6">
        {/* Back Link */}
        <button
          onClick={() => navigate('home')}
          className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Storefront</span>
        </button>

        {/* Heading */}
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold text-[#0D3B2E] uppercase tracking-wider">
            The House of Gaunt
          </span>
          <h1 className="text-2xl font-serif-display font-bold text-stone-900">
            {mode === 'login' && 'Sign in to Your Account'}
            {mode === 'register' && 'Create Customer Account'}
            {mode === 'forgot-password' && 'Reset Account Password'}
          </h1>
          <p className="text-xs text-stone-500">
            {mode === 'login' && 'Access past orders, saved specifications, and custom fitting records.'}
            {mode === 'register' && 'Join the premier Indian golfers club for exclusive tour equipment allocations.'}
            {mode === 'forgot-password' && 'Enter your registered email to receive password recovery instructions.'}
          </p>
        </div>

        {/* Feedback alerts */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
            {errorMessage}
          </div>
        )}
        {infoMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800">
            {infoMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Full Legal Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sandeep Rao"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Mobile Phone (India)</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                />
              </div>
            </div>
          )}

          {mode !== 'forgot-password' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-stone-700 font-semibold">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot-password');
                      setErrorMessage('');
                    }}
                    className="text-[#0D3B2E] hover:underline text-[11px]"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#0D3B2E] hover:bg-[#092b21] text-white font-semibold rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>
              {isLoading
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In to Account'
                : mode === 'register'
                ? 'Complete Registration'
                : 'Send Password Reset Email'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Mode Switcher */}
        <div className="border-t border-stone-100 pt-4 text-center text-xs text-stone-500">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                }}
                className="text-[#0D3B2E] font-semibold hover:underline"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
                className="text-[#0D3B2E] font-semibold hover:underline"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>

        {/* Quick Demo Credentials */}
        <div className="border-t border-stone-200 pt-4 bg-stone-50/70 p-3.5 rounded text-[11px] text-stone-600 space-y-2">
          <p className="font-semibold text-stone-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0D3B2E]" />
            <span>Developer Test Accounts (1-Click)</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => quickLoginAs('customer')}
              className="py-1.5 px-2 bg-white border border-stone-200 rounded text-stone-800 hover:border-stone-400 font-medium text-center"
            >
              Sign in as Customer
            </button>
            <button
              type="button"
              onClick={() => quickLoginAs('admin')}
              className="py-1.5 px-2 bg-[#0D3B2E] text-white rounded hover:bg-[#092b21] font-medium text-center"
            >
              Sign in as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
