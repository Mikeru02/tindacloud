'use client';

import React, { useState } from 'react';

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#22c55e' }}>
          Staff
        </h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
              style={{ borderColor: '#333' }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <button className="px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors">
            Add Staff
          </button>
        </div>
      </div>
      
      <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Staff Member</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Email</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Role</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Status</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Alice Johnson', email: 'alice@tindacloud.com', role: 'Manager', status: 'Active' },
              { name: 'Bob Smith', email: 'bob@tindacloud.com', role: 'Staff', status: 'Active' },
              { name: 'Carol Williams', email: 'carol@tindacloud.com', role: 'Staff', status: 'Inactive' },
              { name: 'David Brown', email: 'david@tindacloud.com', role: 'Admin', status: 'Active' },
              { name: 'Eva Martinez', email: 'eva@tindacloud.com', role: 'Staff', status: 'Active' },
            ].map((staff) => (
              <tr key={staff.email} className="border-b border-[#333] hover:bg-[#333] transition-colors">
                <td className="p-4 font-medium" style={{ color: '#22c55e' }}>{staff.name}</td>
                <td className="p-4" style={{ color: '#9ca3af' }}>{staff.email}</td>
                <td className="p-4" style={{ color: '#9ca3af' }}>{staff.role}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    staff.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                  }`}>
                    {staff.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="p-2 rounded hover:bg-[#444] transition-colors" style={{ color: '#22c55e' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button className="p-2 rounded hover:bg-[#444] transition-colors" style={{ color: '#ef4444' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
