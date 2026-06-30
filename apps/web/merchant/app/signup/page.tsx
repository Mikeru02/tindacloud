'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../api/client';
import Input from '../components/Input';
import Button from '../components/Button';
import AuthForm from '../components/AuthForm';
import Checkbox from '../components/Checkbox';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    storeType: '',
    storeName: '',
    storeDescription: '',
    storeAddress: '',
    storePhone: '',
    storeEmail: '',
    publicity: false,
    emailOrders: true,
    emailLowStock: true,
    emailInquiries: false,
    smsUrgent: false,
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string; phone?: string; storeType?: string; storeName?: string; storeDescription?: string; storeAddress?: string; storePhone?: string; storeEmail?: string; password?: string; confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Password strength validation
  const getPasswordStrength = (password: string) => {
    const strength = {
      score: 0,
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    strength.score = Object.values(strength).filter(Boolean).length - 1; // Exclude score itself
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const isStep1Valid = formData.firstName !== '' && 
                      formData.firstName.length >= 2 &&
                      formData.lastName !== '' && 
                      formData.lastName.length >= 2 &&
                      formData.email !== '' && 
                      /\S+@\S+\.\S+/.test(formData.email) &&
                      formData.phone !== '' &&
                      formData.phone.length >= 8 &&
                      formData.password !== '' && 
                      formData.password.length >= 8 &&
                      passwordStrength.score >= 3 &&
                      formData.confirmPassword !== '' && 
                      formData.password === formData.confirmPassword;

  const isStep2Valid = formData.storeType !== '' &&
                      formData.storeName !== '' && 
                      formData.storeName.length >= 2 &&
                      formData.storeDescription !== '' &&
                      formData.storeAddress !== '';

  const isStep3Valid = termsAccepted;

  const totalSteps = 3;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
    
    // Real-time validation for confirm password
    if (name === 'confirmPassword' && value !== '') {
      if (value !== formData.password) {
        setErrors({
          ...errors,
          confirmPassword: 'Passwords do not match',
        });
      } else {
        setErrors({
          ...errors,
          confirmPassword: undefined,
        });
      }
    }
  };

  const validateStep1 = () => {
    const newErrors: { firstName?: string; lastName?: string; email?: string; phone?: string; password?: string; confirmPassword?: string } = {};
    
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
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Password is too weak. Please include uppercase, lowercase, numbers, and special characters.';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: { storeType?: string; storeName?: string; storeDescription?: string; storeAddress?: string } = {};
    
    if (!formData.storeType) {
      newErrors.storeType = 'Store type is required';
    }
    
    if (!formData.storeName) {
      newErrors.storeName = 'Store name is required';
    } else if (formData.storeName.length < 2) {
      newErrors.storeName = 'Store name must be at least 2 characters';
    }
    
    if (!formData.storeDescription) {
      newErrors.storeDescription = 'Store description is required';
    } else if (formData.storeDescription.length < 10) {
      newErrors.storeDescription = 'Store description must be at least 10 characters';
    }
    
    if (!formData.storeAddress) {
      newErrors.storeAddress = 'Store address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: {} = {};
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      setApiError(null);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      setApiError(null);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setApiError(null);
    } else if (currentStep === 3) {
      setCurrentStep(2);
      setApiError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await apiClient.post('/auth/signup', {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        store_type: formData.storeType,
        store_name: formData.storeName,
        store_description: formData.storeDescription,
        store_address: formData.storeAddress,
        store_phone: formData.storePhone,
        store_email: formData.storeEmail,
        publicity: formData.publicity,
        notification_settings: {
          email_orders: formData.emailOrders,
          email_low_stock: formData.emailLowStock,
          email_inquiries: formData.emailInquiries,
          sms_urgent: formData.smsUrgent,
        },
      });
      
      const data = response.data;
      
      // Save JWT token to localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('merchant', JSON.stringify(data.merchant));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
      {/* Google Forms-style Progression Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                currentStep >= 1 
                  ? 'bg-[#22c55e] text-white' 
                  : 'bg-[#333] text-gray-500'
              }`}
            >
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-white' : 'text-gray-500'}`}>
              Account Details
            </span>
          </div>
          <div className="flex-1 mx-4 h-1 bg-[#333] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#22c55e] transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-2">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                currentStep >= 2 
                  ? 'bg-[#22c55e] text-white' 
                  : 'bg-[#333] text-gray-500'
              }`}
            >
              {currentStep > 2 ? '✓' : '2'}
            </div>
            <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-white' : 'text-gray-500'}`}>
              Store Details
            </span>
          </div>
          <div className="flex-1 mx-4 h-1 bg-[#333] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#22c55e] transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-2">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                currentStep >= 3 
                  ? 'bg-[#22c55e] text-white' 
                  : 'bg-[#333] text-gray-500'
              }`}
            >
              {currentStep > 3 ? '✓' : '3'}
            </div>
            <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-white' : 'text-gray-500'}`}>
              Store Settings
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg col-span-2">
            {apiError}
          </div>
        )}
        
        {/* Step 1: Account Details */}
        {currentStep === 1 && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
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
            <div className="col-span-2 space-y-3">
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
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength.score >= level
                            ? passwordStrength.score <= 2
                              ? 'bg-red-500'
                              : passwordStrength.score <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-[#333]'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className={`flex items-center gap-2 ${passwordStrength.hasMinLength ? 'text-green-500' : 'text-red-500'}`}>
                      <span>{passwordStrength.hasMinLength ? '✓' : '✗'}</span>
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.hasUpperCase ? 'text-green-500' : 'text-red-500'}`}>
                      <span>{passwordStrength.hasUpperCase ? '✓' : '✗'}</span>
                      <span>Contains uppercase letter</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.hasLowerCase ? 'text-green-500' : 'text-red-500'}`}>
                      <span>{passwordStrength.hasLowerCase ? '✓' : '✗'}</span>
                      <span>Contains lowercase letter</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.hasNumber ? 'text-green-500' : 'text-red-500'}`}>
                      <span>{passwordStrength.hasNumber ? '✓' : '✗'}</span>
                      <span>Contains number</span>
                    </div>
                    <div className={`flex items-center gap-2 col-span-2 ${passwordStrength.hasSpecialChar ? 'text-green-500' : 'text-red-500'}`}>
                      <span>{passwordStrength.hasSpecialChar ? '✓' : '✗'}</span>
                      <span>Contains special character</span>
                    </div>
                  </div>
                </div>
              )}
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
          </div>
        )}

        {/* Step 2: Store Details */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                  Store Type
                </label>
                <select
                  name="storeType"
                  value={formData.storeType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors cursor-pointer"
                  style={{ borderColor: errors.storeType ? '#ef4444' : '#333' }}
                >
                  <option value="" disabled>Select store type</option>
                  <option value="Retail">Retail</option>
                  <option value="Restaurant">Restaurant</option>
                </select>
                {errors.storeType && (
                  <p className="mt-1 text-sm text-red-500">{errors.storeType}</p>
                )}
              </div>
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
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                  Store Description
                </label>
                <textarea
                  name="storeDescription"
                  rows={3}
                  placeholder="Tell us about your store..."
                  value={formData.storeDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                  style={{ borderColor: errors.storeDescription ? '#ef4444' : '#333' }}
                />
                {errors.storeDescription && (
                  <p className="mt-1 text-sm text-red-500">{errors.storeDescription}</p>
                )}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                  Store Address
                </label>
                <textarea
                  name="storeAddress"
                  rows={2}
                  placeholder="123 Main St, City, Country"
                  value={formData.storeAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                  style={{ borderColor: errors.storeAddress ? '#ef4444' : '#333' }}
                />
                {errors.storeAddress && (
                  <p className="mt-1 text-sm text-red-500">{errors.storeAddress}</p>
                )}
              </div>
              <Input
                label="Store Phone (Optional)"
                type="tel"
                name="storePhone"
                placeholder="09123456789"
                value={formData.storePhone}
                onChange={handleChange}
                error={errors.storePhone}
                autoComplete="tel"
              />
              <Input
                label="Store Email (Optional)"
                type="email"
                name="storeEmail"
                placeholder="store@example.com"
                value={formData.storeEmail}
                onChange={handleChange}
                error={errors.storeEmail}
                autoComplete="email"
              />
            </div>
          </div>
        )}

        {/* Step 3: Store Settings */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
                Store Visibility
              </h3>
              <div className="space-y-4">
                <Checkbox
                  id="publicity"
                  label="Show store to marketplace"
                  checked={formData.publicity}
                  onChange={(e) => setFormData({ ...formData, publicity: e.target.checked })}
                />
                <p className="text-sm" style={{ color: '#9ca3af' }}>
                  When enabled, your store will be visible to customers browsing the marketplace.
                </p>
              </div>
            </div>

            <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
                Notification Settings
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Email notifications for new orders', checked: formData.emailOrders, name: 'emailOrders' },
                  { label: 'Email notifications for low stock', checked: formData.emailLowStock, name: 'emailLowStock' },
                  { label: 'Email notifications for customer inquiries', checked: formData.emailInquiries, name: 'emailInquiries' },
                  { label: 'SMS notifications for urgent orders', checked: formData.smsUrgent, name: 'smsUrgent' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-3 border-b border-[#333] last:border-0">
                    <span style={{ color: '#9ca3af' }}>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => setFormData({ ...formData, [item.name]: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 bg-[#1a1a1a] text-[#22c55e] focus:ring-[#22c55e] cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Terms and Conditions - Only show on Step 3 */}
        {currentStep === 3 && (
          <div className="flex items-start animate-in fade-in slide-in-from-bottom-4 duration-300">
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
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-2">
          {currentStep === 1 && (
            <Button
              type="button"
              onClick={handleNext}
              fullWidth
              disabled={!isStep1Valid}
            >
              Next
            </Button>
          )}
          
          {currentStep === 2 && (
            <>
              <Button
                type="button"
                onClick={handleBack}
                variant="secondary"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                fullWidth
                disabled={!isStep2Valid}
                className="flex-1"
              >
                Next
              </Button>
            </>
          )}
          
          {currentStep === 3 && (
            <>
              <Button
                type="button"
                onClick={handleBack}
                variant="secondary"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                fullWidth
                disabled={!isStep3Valid}
                className="flex-1"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </>
          )}
        </div>
      </form>
    </AuthForm>
  );
}
