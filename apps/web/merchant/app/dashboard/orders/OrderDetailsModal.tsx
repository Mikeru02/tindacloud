'use client';

import React from 'react';

interface OrderItem {
  id: number;
  product_id: number | null;
  menu_item_id: number | null;
  quantity: number;
  price: number;
  item_type: string;
  product?: {
    id: number;
    name: string;
    sku: string;
  };
  menuItem?: {
    id: number;
    name: string;
  };
}

interface Order {
  id: number;
  user_id: number;
  amount: number;
  status: string;
  source: string;
  created_at: Date;
  updated_at: Date;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  items?: OrderItem[];
}

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-500';
      case 'processing':
        return 'bg-blue-500/20 text-blue-500';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-500';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCustomerName = () => {
    if (order.user) {
      return `${order.user.first_name || ''} ${order.user.last_name || ''}`.trim() || order.user.email;
    }
    return 'Unknown';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#222] rounded-xl border border-[#333] max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#333] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#22c55e]">Order #{order.id}</h2>
            <p className="text-sm text-[#9ca3af]">{formatDate(order.created_at)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#333]">
              <p className="text-xs text-[#9ca3af] mb-1">Customer</p>
              <p className="text-sm font-medium text-[#22c55e]">{getCustomerName()}</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#333]">
              <p className="text-xs text-[#9ca3af] mb-1">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#333]">
              <p className="text-xs text-[#9ca3af] mb-1">Source</p>
              <p className="text-sm font-medium text-[#22c55e]">{order.source}</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#333]">
              <p className="text-xs text-[#9ca3af] mb-1">Total Amount</p>
              <p className="text-sm font-bold text-[#22c55e]">₱{Number(order.amount).toFixed(2)}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#22c55e] mb-3">Order Items</h3>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-2">
                {order.items.map((item) => {
                  const isMenuItem = item.item_type === 'menu_item';
                  const itemName = isMenuItem ? item.menuItem?.name : item.product?.name;
                  const itemSku = isMenuItem ? 'Menu Item' : item.product?.sku;

                  return (
                    <div key={item.id} className="bg-[#1a1a1a] rounded-lg p-3 border border-[#333] flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#22c55e]">{itemName || 'Unknown'}</p>
                        <p className="text-xs text-[#9ca3af]">{itemSku || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#9ca3af]">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-[#22c55e]">₱{Number(item.price).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[#9ca3af] text-sm">No items found</p>
            )}
          </div>

          {/* Customer Details */}
          {order.user && (
            <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#333]">
              <h3 className="text-lg font-semibold text-[#22c55e] mb-3">Customer Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-[#9ca3af]">Name:</span>
                  <span className="text-sm text-[#22c55e]">{getCustomerName()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#9ca3af]">Email:</span>
                  <span className="text-sm text-[#22c55e]">{order.user.email}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#333] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#333] hover:bg-[#444] text-[#22c55e] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
