'use client';

import React, { useState } from 'react';

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#22c55e' }}>
          Customers
        </h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
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
            Add Customer
          </button>
        </div>
      </div>
      
      <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Customer</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Email</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Total Orders</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Total Spent</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Status</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'John Doe', email: 'john@example.com', orders: 12, spent: '$1,450.00', status: 'Active' },
              { name: 'Jane Smith', email: 'jane@example.com', orders: 8, spent: '$890.50', status: 'Active' },
              { name: 'Bob Johnson', email: 'bob@example.com', orders: 5, spent: '$320.00', status: 'Inactive' },
              { name: 'Alice Brown', email: 'alice@example.com', orders: 15, spent: '$2,100.00', status: 'Active' },
              { name: 'Charlie Wilson', email: 'charlie@example.com', orders: 3, spent: '$180.00', status: 'Inactive' },
            ].map((customer) => (
              <tr key={customer.email} className="border-b border-[#333] hover:bg-[#333] transition-colors">
                <td className="p-4 font-medium" style={{ color: '#22c55e' }}>{customer.name}</td>
                <td className="p-4" style={{ color: '#9ca3af' }}>{customer.email}</td>
                <td className="p-4" style={{ color: '#9ca3af' }}>{customer.orders}</td>
                <td className="p-4" style={{ color: '#22c55e' }}>{customer.spent}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    customer.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium bg-[#333] hover:bg-[#444] transition-colors" style={{ color: '#22c55e' }}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
