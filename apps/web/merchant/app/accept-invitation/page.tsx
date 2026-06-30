'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import apiClient from '../api/client';
import AuthForm from '../components/AuthForm';
import Button from '../components/Button';

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

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const checkAuthAndInvitation = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        // Not logged in, redirect to registration page
        router.push(`/invite/${searchParams.get('token')}`);
        return;
      }

      try {
        // Validate invitation
        const invitationResponse = await apiClient.get(`/merchant-invitations/${searchParams.get('token')}`);
        setInvitation(invitationResponse.data);
        
        // Get current user
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        if (!user) {
          setError('User session not found. Please log in again.');
          return;
        }

        // Check if email matches
        if (user.email.toLowerCase() !== invitationResponse.data.email.toLowerCase()) {
          setError(`This invitation is for ${invitationResponse.data.email}, but you're logged in as ${user.email}. Please log out and sign in with the correct account.`);
          return;
        }

        // Accept invitation
        setAccepting(true);
        await apiClient.post(`/merchant-invitations/${searchParams.get('token')}/accept`);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to accept invitation');
      } finally {
        setLoading(false);
        setAccepting(false);
      }
    };

    if (token) {
      checkAuthAndInvitation();
    } else {
      setError('No invitation token provided');
      setLoading(false);
    }
  }, [token, router, searchParams]);

  if (loading) {
    return (
      <AuthForm title="Accepting Invitation" subtitle="Please wait...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22c55e]"></div>
        </div>
      </AuthForm>
    );
  }

  if (error) {
    return (
      <AuthForm title="Invitation Error" subtitle="Could not accept invitation">
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
        <Button fullWidth onClick={() => router.push('/dashboard')}>
          Go to Dashboard
        </Button>
      </AuthForm>
    );
  }

  return (
    <AuthForm title="Accepting Invitation" subtitle="Joining the team...">
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22c55e]"></div>
      </div>
    </AuthForm>
  );
}
