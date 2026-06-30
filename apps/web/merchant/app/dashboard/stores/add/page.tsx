'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../store/useStore';
import apiClient from '../../../api/client';

export default function AddStorePage() {
  const router = useRouter();
  const { createStore, refreshStores } = useStore();
  const [storeName, setStoreName] = useState('');
  const [storeType, setStoreType] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!storeName || !storeType) {
      setError('Store name and type are required');
      return;
    }

    setIsCreating(true);
    try {
      const response = await apiClient.post('/merchants', {
        store_name: storeName,
        store_type: storeType,
        store_address: storeAddress || undefined,
        store_phone: storePhone || undefined,
        store_email: storeEmail || undefined,
      });

      const newStore = response.data;
      createStore(newStore);

      // Navigate back to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create store');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-[#222] border border-[#333] flex items-center justify-center hover:bg-[#333] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Create New Store</h1>
            <p className="text-sm text-gray-400">Set up a new location for your business</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#222] rounded-2xl border border-[#333] p-8 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                Store Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2">
                  <path d="M3 21h18"/>
                  <path d="M5 21V7l8-4 8 4v14"/>
                </svg>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-[#1a1a1a] text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
                  style={{ borderColor: '#333' }}
                  placeholder="Enter store name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                Store Type <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2">
                  <rect width="20" height="14" x="2" y="3" rx="2"/>
                  <line x1="8" x2="16" y1="21" y2="21"/>
                  <line x1="12" x2="12" y1="17" y2="21"/>
                </svg>
                <input
                  type="text"
                  value={storeType}
                  onChange={(e) => setStoreType(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-[#1a1a1a] text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
                  style={{ borderColor: '#333' }}
                  placeholder="e.g., Retail, Restaurant, Wholesale"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Address</label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <input
                  type="text"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-[#1a1a1a] text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
                  style={{ borderColor: '#333' }}
                  placeholder="Enter store address"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">Phone</label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <input
                    type="text"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-[#1a1a1a] text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
                    style={{ borderColor: '#333' }}
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">Email</label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input
                    type="email"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-[#1a1a1a] text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
                    style={{ borderColor: '#333' }}
                    placeholder="Email address"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isCreating}
                className="flex-1 px-6 py-3 rounded-xl font-semibold border border-[#444] bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white hover:from-[#16a34a] hover:to-[#15803d] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#22c55e]/20"
              >
                {isCreating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create Store'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
