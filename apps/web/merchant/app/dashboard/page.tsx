'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';

interface DashboardStats {
  totalOrders: number;
  totalSales: number;
}

interface Order {
  id: number;
  amount: number;
  status: string;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface Product {
  id: number;
  name: string;
  stock: number;
  low_stock_threshold: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'all' | '7days' | 'month'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, productsRes, ordersRes, lowStockRes] = await Promise.all([
          apiClient.get('/orders/dashboard/stats', { params: { dateRange } }),
          apiClient.get('/products/total/count'),
          apiClient.get('/orders?limit=5', { params: { dateRange } }),
          apiClient.get('/products/low-stock/alerts'),
        ]);

        setStats(statsRes.data);
        setTotalProducts(productsRes.data);
        setRecentOrders(ordersRes.data.orders);
        setLowStockProducts(lowStockRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#22c55e' }}>
          Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: '#9ca3af' }}>Filter:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as 'all' | '7days' | 'month')}
            className="bg-[#222] border border-[#333] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
            style={{ color: '#22c55e' }}
          >
            <option value="all">All time</option>
            <option value="7days">Last 7 days</option>
            <option value="month">Last month</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#222] rounded-xl p-6 border border-[#333]">
                <div className="h-5 w-24 bg-[#333] rounded mb-2 animate-pulse"></div>
                <div className="h-10 w-20 bg-[#333] rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-16 bg-[#333] rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-[#222] rounded-xl p-6 border border-[#333]">
                <div className="h-7 w-32 bg-[#333] rounded mb-4 animate-pulse"></div>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="flex items-center justify-between py-3 border-b border-[#333]">
                      <div className="flex-1">
                        <div className="h-5 w-16 bg-[#333] rounded mb-2 animate-pulse"></div>
                        <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
                      </div>
                      <div className="text-right">
                        <div className="h-5 w-16 bg-[#333] rounded mb-2 animate-pulse"></div>
                        <div className="h-4 w-12 bg-[#333] rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
              <h3 className="text-lg font-medium mb-2" style={{ color: '#9ca3af' }}>
                Total Sales
              </h3>
              <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>
                ₱{stats?.totalSales.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>
                All time
              </p>
            </div>
            
            <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
              <h3 className="text-lg font-medium mb-2" style={{ color: '#9ca3af' }}>
                Total Orders
              </h3>
              <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>
                {stats?.totalOrders || 0}
              </p>
              <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>
                All time
              </p>
            </div>
            
            <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
              <h3 className="text-lg font-medium mb-2" style={{ color: '#9ca3af' }}>
                Products
              </h3>
              <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>
                {totalProducts}
              </p>
              <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>
                In inventory
              </p>
            </div>
            
            <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
              <h3 className="text-lg font-medium mb-2" style={{ color: '#9ca3af' }}>
                Low Stock Items
              </h3>
              <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>
                {lowStockProducts.length}
              </p>
              <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>
                Need attention
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
                Recent Orders
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {recentOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    <p className="text-center" style={{ color: '#9ca3af' }}>
                      No orders yet
                    </p>
                  </div>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-[#333] last:border-0">
                      <div>
                        <p className="font-medium" style={{ color: '#22c55e' }}>#{order.id}</p>
                        <p className="text-sm" style={{ color: '#9ca3af' }}>
                          {order.user?.first_name} {order.user?.last_name || order.user?.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium" style={{ color: '#22c55e' }}>₱{Number(order.amount).toFixed(2)}</p>
                        <p className="text-sm" style={{ color: '#9ca3af' }}>{order.status}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
                Low Stock Alerts
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {lowStockProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                      <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
                      <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
                    </svg>
                    <p className="text-center" style={{ color: '#9ca3af' }}>
                      No products yet
                    </p>
                  </div>
                ) : (
                  lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between py-3 border-b border-[#333] last:border-0">
                      <div>
                        <p className="font-medium" style={{ color: '#22c55e' }}>{product.name}</p>
                        <p className="text-sm" style={{ color: '#9ca3af' }}>
                          Stock: {product.stock} / Threshold: {product.low_stock_threshold}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-500">
                        Low Stock
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
