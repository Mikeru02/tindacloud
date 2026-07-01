'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from './api/client';
import Input from './components/Input';
import Button from './components/Button';
import AuthForm from './components/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showInactiveModal, setShowInactiveModal] = useState(false);

  const isFormValid = formData.email !== '' && 
                      formData.password !== '' && 
                      /\S+@\S+\.\S+/.test(formData.email) &&
                      formData.password.length >= 6;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [e.target.name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await apiClient.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      
      const data = response.data;
      
      // Save JWT token to localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('merchant', JSON.stringify(data.merchant));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      
      // Check if the error is due to inactive account
      if (errorMessage.includes('inactive') || error.response?.status === 403) {
        setShowInactiveModal(true);
      } else {
        setApiError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthForm
        title="Welcome Back"
        subtitle="Sign in to your merchant account"
        footer={
          <p style={{ color: '#9ca3af' }}>
            Don't have an account?{' '}
            <Link href="/signup" className="hover:underline" style={{ color: '#22c55e' }}>
              Sign up
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {apiError && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
              {apiError}
            </div>
          )}
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="merchant@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />
          
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
            showPasswordToggle
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 bg-[#1a1a1a] text-[#22c55e] focus:ring-[#22c55e]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm" style={{ color: '#9ca3af' }}>
                Remember me
              </label>
            </div>
            
            <Link href="/forgot-password" className="text-sm hover:underline" style={{ color: '#22c55e' }}>
              Forgot password?
            </Link>
          </div>
          
          <Button
            type="submit"
            fullWidth
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </AuthForm>

      {/* Inactive Account Modal */}
      {showInactiveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#222] rounded-2xl border border-[#333] w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Account Inactive</h2>
                <p className="text-sm text-gray-400">Your account has been deactivated</p>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6">
              <p className="text-sm">
                Your account is currently inactive. Please contact the owner or manager for assistance if this is a mistake.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowInactiveModal(false)}
                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white hover:from-[#16a34a] hover:to-[#15803d] transition-all shadow-lg shadow-[#22c55e]/20"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
