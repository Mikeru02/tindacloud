'use client';

import React, { useState } from 'react';

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#22c55e' }}>
          Orders
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
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
      </div>
      
      <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Order ID</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Customer</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Date</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Amount</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Status</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: '#ORD-001', customer: 'John Doe', date: '2024-01-15', amount: '$125.00', status: 'Completed' },
              { id: '#ORD-002', customer: 'Jane Smith', date: '2024-01-14', amount: '$89.50', status: 'Processing' },
              { id: '#ORD-003', customer: 'Bob Johnson', date: '2024-01-14', amount: '$210.00', status: 'Pending' },
              { id: '#ORD-004', customer: 'Alice Brown', date: '2024-01-13', amount: '$45.00', status: 'Completed' },
              { id: '#ORD-005', customer: 'Charlie Wilson', date: '2024-01-13', amount: '$156.00', status: 'Shipped' },
            ].map((order) => (
              <tr key={order.id} className="border-b border-[#333] hover:bg-[#333] transition-colors">
                <td className="p-4 font-medium" style={{ color: '#22c55e' }}>{order.id}</td>
                <td className="p-4" style={{ color: '#9ca3af' }}>{order.customer}</td>
                <td className="p-4" style={{ color: '#9ca3af' }}>{order.date}</td>
                <td className="p-4" style={{ color: '#22c55e' }}>{order.amount}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                    order.status === 'Processing' ? 'bg-blue-500/20 text-blue-500' :
                    order.status === 'Shipped' ? 'bg-purple-500/20 text-purple-500' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {order.status}
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
