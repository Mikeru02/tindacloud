'use client';

import React, { useState } from 'react';
import Input from './components/Input';
import Button from './components/Button';
import AuthForm from './components/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

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
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt:', formData);
      setIsLoading(false);
      // Add your actual login logic here
    }, 1000);
  };

  return (
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
  );
}
