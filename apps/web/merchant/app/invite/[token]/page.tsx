'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '../../api/client';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AuthForm from '../../components/AuthForm';
import Link from 'next/link';

interface InvitationData {
  id: number;
  merchant_id: number;
  email: string;
  role: string;
  merchant: {
    id: number;
    store_name: string;
  };
}

export default function InviteAcceptPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; password?: string; confirmPassword?: string }>({});

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
    
    strength.score = Object.values(strength).filter(Boolean).length - 1;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  useEffect(() => {
    const validateInvitation = async () => {
      try {
        const response = await apiClient.get(`/merchant-invitations/${token}`);
        setInvitation(response.data);
        setFormData(prev => ({ ...prev, email: response.data.email }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid or expired invitation');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      validateInvitation();
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
    
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

  const validateForm = () => {
    const newErrors: { firstName?: string; lastName?: string; password?: string; confirmPassword?: string } = {};
    
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
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Password is too weak';
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
    
    setSubmitting(true);
    setError(null);
    
    try {
      await apiClient.post(`/merchant-invitations/${token}/accept-with-registration`, {
        email: invitation?.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      
      // Redirect to login page
      router.push('/?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AuthForm title="Validating Invitation" subtitle="Please wait...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22c55e]"></div>
        </div>
      </AuthForm>
    );
  }

  if (error) {
    return (
      <AuthForm title="Invalid Invitation" subtitle="This invitation is no longer valid">
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
        <Link href="/">
          <Button fullWidth>Back to Login</Button>
        </Link>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Join the Team"
      subtitle={`You've been invited to join ${invitation?.merchant.store_name} as a ${invitation?.role}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="bg-[#222] rounded-lg p-4 border border-[#333]">
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Email
            </label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={invitation?.email}
                disabled
                className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-gray-400 cursor-not-allowed"
                style={{ borderColor: '#333' }}
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <p className="text-xs mt-2" style={{ color: '#666' }}>
              Email is locked to the invitation
            </p>
          </div>

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
          
          <div className="space-y-3">
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
                    <span>Contains uppercase</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.hasLowerCase ? 'text-green-500' : 'text-red-500'}`}>
                    <span>{passwordStrength.hasLowerCase ? '✓' : '✗'}</span>
                    <span>Contains lowercase</span>
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

        <Button
          type="submit"
          fullWidth
          disabled={submitting}
        >
          {submitting ? 'Creating Account...' : 'Accept Invitation & Create Account'}
        </Button>
        
        <div className="text-center">
          <Link href="/" className="text-sm hover:underline" style={{ color: '#9ca3af' }}>
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </AuthForm>
  );
}
