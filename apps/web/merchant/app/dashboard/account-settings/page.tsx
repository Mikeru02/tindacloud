'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';

export default function AccountSettingsPage() {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      setUserData({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setSaveMessage({ type: 'error', message: 'Failed to load user data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      await apiClient.put('/auth/me', userData);
      setSaveMessage({ type: 'success', message: 'Profile updated successfully' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveMessage({ type: 'error', message: 'Failed to save profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.current_password || !passwordData.new_password) {
      setPasswordError('Please fill in both password fields');
      return;
    }

    if (passwordData.new_password.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      await apiClient.put('/auth/password', passwordData);
      setPasswordSuccess('Password updated successfully');
      setPasswordData({ current_password: '', new_password: '' });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (error: any) {
      console.error('Failed to update password:', error);
      setPasswordError(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8" style={{ color: '#22c55e' }}>
        Account Settings
      </h1>

      {isLoading ? (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333]">
            <div className="h-5 sm:h-6 w-40 sm:w-48 mb-4 bg-[#333] rounded animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-10 bg-[#333] rounded animate-pulse"></div>
              <div className="h-10 bg-[#333] rounded animate-pulse"></div>
              <div className="h-10 bg-[#333] rounded animate-pulse"></div>
              <div className="h-10 bg-[#333] rounded animate-pulse"></div>
            </div>
          </div>
          <div className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333]">
            <div className="h-5 sm:h-6 w-40 sm:w-48 mb-4 bg-[#333] rounded animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-10 bg-[#333] rounded animate-pulse"></div>
              <div className="h-10 bg-[#333] rounded animate-pulse"></div>
              <div className="h-10 bg-[#333] rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {saveMessage && (
            <div className={`mb-4 px-4 py-3 rounded-lg ${
              saveMessage.type === 'success'
                ? 'bg-green-500/10 border border-green-500 text-green-500'
                : 'bg-red-500/10 border border-red-500 text-red-500'
            }`}>
              {saveMessage.message}
            </div>
          )}

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333]">
              <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
                Profile Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={userData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                    style={{ borderColor: '#333' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={userData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                    style={{ borderColor: '#333' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#333] text-[#9ca3af] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors disabled:opacity-50"
                    style={{ borderColor: '#333' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                    style={{ borderColor: '#333' }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333]">
              <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
                Change Password
              </h3>
              <div className="space-y-4">
                {passwordError && (
                  <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
                    {passwordSuccess}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                    style={{ borderColor: '#333' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                    style={{ borderColor: '#333' }}
                  />
                </div>
                <button
                  onClick={handleUpdatePassword}
                  disabled={isUpdatingPassword}
                  className="px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button
                onClick={fetchUserData}
                className="px-4 sm:px-6 py-3 rounded-lg font-medium bg-[#333] hover:bg-[#444] transition-colors text-sm sm:text-base"
                style={{ color: '#22c55e' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 sm:px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
