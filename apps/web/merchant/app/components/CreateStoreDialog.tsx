'use client';

import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import apiClient from '../api/client';

interface CreateStoreDialogProps {
  show: boolean;
  onClose: () => void;
}

export default function CreateStoreDialog({ show, onClose }: CreateStoreDialogProps) {
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
      
      // Reset form
      setStoreName('');
      setStoreType('');
      setStoreAddress('');
      setStorePhone('');
      setStoreEmail('');
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create store');
    } finally {
      setIsCreating(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#222] rounded-xl border border-[#333] w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#22c55e' }}>
          Create New Store
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Store Name *
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
              style={{ borderColor: '#333' }}
              placeholder="Enter store name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Store Type *
            </label>
            <input
              type="text"
              value={storeType}
              onChange={(e) => setStoreType(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
              style={{ borderColor: '#333' }}
              placeholder="e.g., Retail, Restaurant, Wholesale"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Address
            </label>
            <input
              type="text"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
              style={{ borderColor: '#333' }}
              placeholder="Enter store address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Phone
            </label>
            <input
              type="text"
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
              style={{ borderColor: '#333' }}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Email
            </label>
            <input
              type="email"
              value={storeEmail}
              onChange={(e) => setStoreEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
              style={{ borderColor: '#333' }}
              placeholder="Enter email address"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="flex-1 px-4 py-3 rounded-lg font-medium border border-[#333] bg-[#222] text-[#9ca3af] hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 px-4 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? 'Creating...' : 'Create Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
