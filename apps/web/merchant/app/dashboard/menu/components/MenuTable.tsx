'use client';

import React from 'react';
import { MenuItem } from '../types';

interface MenuTableProps {
  menuItems: MenuItem[];
  onEditClick: (menuItem: MenuItem) => void;
  onDeleteClick: (menuItem: MenuItem) => void;
}

export default function MenuTable({ menuItems, onEditClick, onDeleteClick }: MenuTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-500/20 text-green-500';
      case 'unavailable':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: '#9ca3af' }}>
                Image
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: '#9ca3af' }}>
                Menu Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: '#9ca3af' }}>
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: '#9ca3af' }}>
                Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: '#9ca3af' }}>
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: '#9ca3af' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((menuItem) => (
              <tr key={menuItem.id} className="border-b border-[#333] hover:bg-[#333] transition-colors">
                <td className="px-4 py-3">
                  {menuItem.image_url ? (
                    <img
                      src={menuItem.image_url}
                      alt={menuItem.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[#333] flex items-center justify-center">
                      <span className="text-2xl">🍽️</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{menuItem.name}</div>
                  {menuItem.description && (
                    <div className="text-sm mt-1" style={{ color: '#666' }}>
                      {menuItem.description}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3" style={{ color: '#9ca3af' }}>
                  {menuItem.category || '-'}
                </td>
                <td className="px-4 py-3 font-medium text-white">
                  ₱{Number(menuItem.price).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(menuItem.status)}`}>
                    {menuItem.status.charAt(0).toUpperCase() + menuItem.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditClick(menuItem)}
                      className="p-2 rounded-lg hover:bg-[#444] transition-colors"
                      style={{ color: '#9ca3af' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteClick(menuItem)}
                      className="p-2 rounded-lg hover:bg-[#ef4444]/10 transition-colors text-red-500"
                    >
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
