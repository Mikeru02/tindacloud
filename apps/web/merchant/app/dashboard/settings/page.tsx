'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useStore } from '../../store/useStore';

export default function SettingsPage() {
  const { currentStore } = useStore();
  const [merchantData, setMerchantData] = useState({
    store_name: '',
    store_email: '',
    store_description: '',
    store_type: '',
    store_address: '',
    store_phone: '',
    publicity: false,
    notification_settings: {
      email_orders: true,
      email_low_stock: true,
      email_inquiries: false,
      sms_urgent: false,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (currentStore) {
      fetchMerchantData();
    }
  }, [currentStore]);

  const fetchMerchantData = async () => {
    if (!currentStore) return;

    try {
      const response = await apiClient.get(`/merchants/${currentStore.id}`);
      setMerchantData(response.data);
    } catch (error) {
      console.error('Failed to fetch merchant data:', error);
      setSaveMessage({ type: 'error', message: 'Failed to load merchant data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name.startsWith('notification_')) {
        const settingName = name.replace('notification_', '');
        setMerchantData({
          ...merchantData,
          notification_settings: {
            ...merchantData.notification_settings,
            [settingName]: checkbox.checked,
          },
        });
      } else {
        setMerchantData({ ...merchantData, [name]: checkbox.checked });
      }
    } else {
      setMerchantData({ ...merchantData, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!currentStore) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await apiClient.put(`/merchants/${currentStore.id}`, merchantData);
      setSaveMessage({ type: 'success', message: 'Settings saved successfully' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage({ type: 'error', message: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8" style={{ color: '#22c55e' }}>
        Settings
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
              <div className="sm:col-span-2 h-20 bg-[#333] rounded animate-pulse"></div>
              <div className="sm:col-span-2 h-24 bg-[#333] rounded animate-pulse"></div>
            </div>
          </div>
          <div className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333]">
            <div className="h-5 sm:h-6 w-40 sm:w-48 mb-4 bg-[#333] rounded animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-[#333] last:border-0">
                  <div className="h-4 bg-[#333] rounded w-48 sm:w-64 animate-pulse"></div>
                  <div className="h-4 w-4 bg-[#333] rounded animate-pulse"></div>
                </div>
              ))}
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
                Store Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                    Store Name
                  </label>
                  <input
                    type="text"
                    name="store_name"
                    value={merchantData.store_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                    style={{ borderColor: '#333' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                    Store Type
                  </label>
                  <input
                    type="text"
                    name="store_type"
                    value={merchantData.store_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                    style={{ borderColor: '#333' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                    Store Phone
                  </label>
                  <input
                    type="tel"
                    name="store_phone"
                    value={merchantData.store_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                    style={{ borderColor: '#333' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                    Store Email
                  </label>
                  <input
                    type="email"
                    name="store_email"
                    value={merchantData.store_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                    style={{ borderColor: '#333' }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                    Store Address
                  </label>
                  <textarea
                    name="store_address"
                    rows={2}
                    value={merchantData.store_address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                    style={{ borderColor: '#333' }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                    Store Description
                  </label>
                  <textarea
                    name="store_description"
                    rows={3}
                    value={merchantData.store_description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                    style={{ borderColor: '#333' }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333]">
              <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
                Store Visibility
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <span style={{ color: '#9ca3af' }}>Show store to marketplace</span>
                  <input
                    type="checkbox"
                    name="publicity"
                    checked={merchantData.publicity}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 bg-[#1a1a1a] text-[#22c55e] focus:ring-[#22c55e] cursor-pointer"
                  />
                </div>
                <p className="text-sm" style={{ color: '#9ca3af' }}>
                  When enabled, your store will be visible to customers browsing the marketplace.
                </p>
              </div>
            </div>

            <div className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333]">
              <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
                Notification Settings
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Email notifications for new orders', key: 'email_orders' },
                  { label: 'Email notifications for low stock', key: 'email_low_stock' },
                  { label: 'Email notifications for customer inquiries', key: 'email_inquiries' },
                  { label: 'SMS notifications for urgent orders', key: 'sms_urgent' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-[#333] last:border-0">
                    <span style={{ color: '#9ca3af' }}>{item.label}</span>
                    <input
                      type="checkbox"
                      name={`notification_${item.key}`}
                      checked={merchantData.notification_settings[item.key as keyof typeof merchantData.notification_settings] || false}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 bg-[#1a1a1a] text-[#22c55e] focus:ring-[#22c55e] cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button
                onClick={fetchMerchantData}
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
