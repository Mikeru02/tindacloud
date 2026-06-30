'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import OrderDetailsModal from './OrderDetailsModal';
import { useStore } from '../../store/useStore';

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
  items?: any[];
}

interface PaginatedResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toFixed(2);
};

export default function OrdersPage() {
  const { currentStore } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginatedResponse | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const fetchOrders = async (page: number = 1) => {
    if (!currentStore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/orders', {
        params: {
          merchantId: currentStore.id,
          page,
          limit: ITEMS_PER_PAGE,
        },
      });
      
      const data: PaginatedResponse = response.data;
      setOrders(data.orders);
      setPagination(data);
      setCurrentPage(data.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStore) {
      fetchOrders(currentPage);
    }
  }, [currentPage, currentStore]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

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
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCustomerName = (order: Order) => {
    if (order.user) {
      return `${order.user.first_name || ''} ${order.user.last_name || ''}`.trim() || order.user.email;
    }
    return 'Unknown';
  };

  const handleViewDetails = async (orderId: number) => {
    setLoadingOrderDetails(true);
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      setSelectedOrder(response.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error fetching order details:', err);
      alert('Failed to load order details');
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#22c55e' }}>
          Orders
        </h1>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
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

      {loading ? (
        <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden">
          <div className="p-4 border-b border-[#333] flex gap-4">
            <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-[#333] rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border-b border-[#333] flex gap-4">
              <div className="h-4 w-20 bg-[#333] rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-[#333] rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-[#333] rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
              <div className="h-8 w-24 bg-[#333] rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {orders.length === 0 ? (
            <div className="bg-[#222] rounded-xl border border-[#333] p-12 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-4"
                style={{ color: '#333' }}
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#9ca3af' }}>
                No orders yet
              </h3>
              <p className="mb-6" style={{ color: '#666' }}>
                Orders will appear here once customers start purchasing.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden responsive-table">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#333]">
                      <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#9ca3af' }}>Order ID</th>
                      <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#9ca3af' }}>Customer</th>
                      <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base hidden sm:table-cell" style={{ color: '#9ca3af' }}>Date</th>
                      <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#9ca3af' }}>Amount</th>
                      <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#9ca3af' }}>Status</th>
                      <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#9ca3af' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-[#333] hover:bg-[#333] transition-colors">
                        <td className="p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#22c55e' }}>#{order.id}</td>
                        <td className="p-3 sm:p-4 text-sm sm:text-base" style={{ color: '#9ca3af' }}>{getCustomerName(order)}</td>
                        <td className="p-3 sm:p-4 text-sm sm:text-base hidden sm:table-cell" style={{ color: '#9ca3af' }}>{formatDate(order.created_at)}</td>
                        <td className="p-3 sm:p-4 text-sm sm:text-base" style={{ color: '#22c55e' }}>₱{formatNumber(Number(order.amount))}</td>
                        <td className="p-3 sm:p-4">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3 sm:p-4">
                          <button 
                            onClick={() => handleViewDetails(order.id)}
                            disabled={loadingOrderDetails}
                            className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-[#333] hover:bg-[#444] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ color: '#22c55e' }}
                          >
                            {loadingOrderDetails ? 'Loading...' : 'View Details'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {pagination && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs sm:text-sm text-center sm:text-left" style={{ color: '#9ca3af' }}>
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, pagination.total)} of {pagination.total} orders
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 sm:px-4 py-2 rounded-lg border border-[#333] bg-[#222] text-[#9ca3af] hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 sm:px-4 py-2 rounded-lg border transition-colors text-xs sm:text-sm ${
                            currentPage === pageNum
                              ? 'bg-[#22c55e] text-[#1a1a1a] border-[#22c55e]'
                              : 'bg-[#222] text-[#9ca3af] border-[#333] hover:bg-[#333]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className="px-3 sm:px-4 py-2 rounded-lg border border-[#333] bg-[#222] text-[#9ca3af] hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      <OrderDetailsModal 
        order={selectedOrder} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}
