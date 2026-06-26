'use client';

import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import AuthForm from '../components/AuthForm';
import Checkbox from '../components/Checkbox';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    storeName: '',
    publicity: false,
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string; phone?: string; storeName?: string; password?: string; confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const isFormValid = formData.firstName !== '' && 
                      formData.firstName.length >= 2 &&
                      formData.lastName !== '' && 
                      formData.lastName.length >= 2 &&
                      formData.email !== '' && 
                      /\S+@\S+\.\S+/.test(formData.email) &&
                      formData.phone !== '' &&
                      formData.phone.length >= 8 &&
                      formData.storeName !== '' && 
                      formData.storeName.length >= 2 &&
                      formData.password !== '' && 
                      formData.password.length >= 6 &&
                      formData.confirmPassword !== '' && 
                      formData.password === formData.confirmPassword &&
                      termsAccepted;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    const newErrors: { firstName?: string; lastName?: string; email?: string; phone?: string; storeName?: string; password?: string; confirmPassword?: string } = {};
    
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length < 8) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.storeName) {
      newErrors.storeName = 'Store name is required';
    } else if (formData.storeName.length < 2) {
      newErrors.storeName = 'Store name must be at least 2 characters';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      console.log('Signup attempt:', formData);
      setIsLoading(false);
      // Add your actual signup logic here
    }, 1000);
  };

  return (
    <AuthForm
      title="Create Account"
      subtitle="Join our merchant platform today"
      footer={
        <p style={{ color: '#9ca3af' }}>
          Already have an account?{' '}
          <Link href="/" className="hover:underline" style={{ color: '#22c55e' }}>
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            autoComplete="given-name"
          />
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            autoComplete="family-name"
          />
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
            label="Phone"
            type="tel"
            name="phone"
            placeholder="09123456789"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            autoComplete="tel"
          />
          <div className="col-span-2">
            <Input
              label="Store Name"
              type="text"
              name="storeName"
              placeholder="My Awesome Store"
              value={formData.storeName}
              onChange={handleChange}
              error={errors.storeName}
              autoComplete="organization"
            />
            <Checkbox
              id="publicity"
              label="Show store to marketplace"
              checked={formData.publicity}
              onChange={(e) => setFormData({ ...formData, publicity: e.target.checked })}
              className="mt-2"
            />
          </div>
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
            showPasswordToggle
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
            showPasswordToggle
          />
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-[#1a1a1a] text-[#22c55e] accent-[#22c55e] focus:ring-[#22c55e] focus:ring-offset-0 focus:ring-offset-[#222] cursor-pointer transition-colors duration-200"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="cursor-pointer transition-colors duration-200" style={{ color: '#9ca3af' }}>
              I agree to the{' '}
              <Link href="/terms" className="hover:underline" style={{ color: '#22c55e' }}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="hover:underline" style={{ color: '#22c55e' }}>
                Privacy Policy
              </Link>
            </label>
          </div>
        </div>
        
        <Button
          type="submit"
          fullWidth
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
    </AuthForm>
  );
}
