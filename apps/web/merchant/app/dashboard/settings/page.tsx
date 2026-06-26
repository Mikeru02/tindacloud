import React from 'react';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8" style={{ color: '#22c55e' }}>
        Settings
      </h1>
      
      <div className="space-y-6">
        <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
            Store Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                Store Name
              </label>
              <input
                type="text"
                defaultValue="My Store"
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
                defaultValue="store@example.com"
                className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                style={{ borderColor: '#333' }}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                Store Description
              </label>
              <textarea
                rows={3}
                defaultValue="Welcome to our store!"
                className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                style={{ borderColor: '#333' }}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
            Notification Settings
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Email notifications for new orders', checked: true },
              { label: 'Email notifications for low stock', checked: true },
              { label: 'Email notifications for customer inquiries', checked: false },
              { label: 'SMS notifications for urgent orders', checked: false },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-[#333] last:border-0">
                <span style={{ color: '#9ca3af' }}>{item.label}</span>
                <input
                  type="checkbox"
                  defaultChecked={item.checked}
                  className="h-4 w-4 rounded border-gray-300 bg-[#1a1a1a] text-[#22c55e] focus:ring-[#22c55e]"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
            Security
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                Current Password
              </label>
              <input
                type="password"
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
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                style={{ borderColor: '#333' }}
              />
            </div>
            <button className="px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors">
              Update Password
            </button>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <button className="px-6 py-3 rounded-lg font-medium bg-[#333] hover:bg-[#444] transition-colors" style={{ color: '#22c55e' }}>
            Cancel
          </button>
          <button className="px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
