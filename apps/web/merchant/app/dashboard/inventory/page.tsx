'use client';

import React, { useState } from 'react';

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#22c55e' }}>
          Inventory
        </h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
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
            Add Product
          </button>
        </div>
      </div>
      
      <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Product</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>SKU</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Stock</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Price</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Status</th>
              <th className="text-left p-4 font-medium" style={{ color: '#9ca3af' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Product A', sku: 'SKU-001', stock: 45, price: '$29.99', status: 'In Stock' },
              { name: 'Product B', sku: 'SKU-002', stock: 8, price: '$49.99', status: 'Low Stock' },
              { name: 'Product C', sku: 'SKU-003', stock: 0, price: '$19.99', status: 'Out of Stock' },
              { name: 'Product D', sku: 'SKU-004', stock: 120, price: '$39.99', status: 'In Stock' },
              { name: 'Product E', sku: 'SKU-005', stock: 15, price: '$59.99', status: 'In Stock' },
            ].map((product) => (
              <tr key={product.sku} className="border-b border-[#333] hover:bg-[#333] transition-colors">
                <td className="p-4 font-medium" style={{ color: '#22c55e' }}>{product.name}</td>
                <td className="p-4" style={{ color: '#9ca3af' }}>{product.sku}</td>
                <td className="p-4" style={{ color: '#9ca3af' }}>{product.stock}</td>
                <td className="p-4" style={{ color: '#22c55e' }}>{product.price}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.status === 'In Stock' ? 'bg-green-500/20 text-green-500' :
                    product.status === 'Low Stock' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {product.status}
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
