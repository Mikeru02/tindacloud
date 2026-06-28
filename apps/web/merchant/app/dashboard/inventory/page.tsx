'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../api/client';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  status: string;
}

interface PaginatedResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function InventoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginatedResponse | null>(null);
  const ITEMS_PER_PAGE = 10;

  const fetchProducts = async (page: number = 1, search?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/products', {
        params: {
          page,
          limit: ITEMS_PER_PAGE,
          ...(search && { search }),
        },
      });

      const data: PaginatedResponse = response.data;
      setProducts(data.products);
      setPagination(data);
      setCurrentPage(data.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on new search
      fetchProducts(1, searchQuery || undefined);
    }, 1500); // 1.5 second debounce

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
      fetchProducts(newPage, searchQuery || undefined);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'in stock':
        return 'bg-green-500/20 text-green-500';
      case 'low stock':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'out of stock':
      case 'inactive':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getStatusLabel = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'In Stock';
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-24 bg-[#333] rounded animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-12 w-64 bg-[#333] rounded animate-pulse"></div>
            <div className="h-12 w-32 bg-[#333] rounded animate-pulse"></div>
          </div>
        </div>
        <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden">
          <div className="p-4 border-b border-[#333] flex gap-4">
            <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-[#333] rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-[#333] rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-[#333] rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border-b border-[#333] flex gap-4">
              <div className="h-4 w-32 bg-[#333] rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-[#333] rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-[#333] rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-[#333] rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-[#333] rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-[#333] rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

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
          <button 
            onClick={() => router.push('/dashboard/inventory/add')}
            className="px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors"
          >
            Add Product
          </button>
        </div>
      </div>
      
      {products.length === 0 ? (
        <div className="bg-[#222] rounded-xl border border-[#333] p-12 text-center">
          {searchQuery ? (
            <>
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
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#9ca3af' }}>
                No products found
              </h3>
              <p className="mb-6" style={{ color: '#666' }}>
                No products match your search "{searchQuery}". Try a different search term.
              </p>
            </>
          ) : (
            <>
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
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#9ca3af' }}>
                No products yet
              </h3>
              <p className="mb-6" style={{ color: '#666' }}>
                Get started by adding your first product to the inventory.
              </p>
              <button
                onClick={() => router.push('/dashboard/inventory/add')}
                className="px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors"
              >
                Add Your First Product
              </button>
            </>
          )}
        </div>
      ) : (
        <>
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
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-[#333] hover:bg-[#333] transition-colors">
                    <td className="p-4 font-medium" style={{ color: '#22c55e' }}>{product.name}</td>
                    <td className="p-4" style={{ color: '#9ca3af' }}>{product.sku}</td>
                    <td className="p-4" style={{ color: '#9ca3af' }}>{product.stock}</td>
                    <td className="p-4" style={{ color: '#22c55e' }}>₱{Number(product.price).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(getStatusLabel(product.stock))}`}>
                        {getStatusLabel(product.stock)}
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

          {pagination && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm" style={{ color: '#9ca3af' }}>
                <span className="font-medium">Page {currentPage} of {pagination.totalPages}</span>
                <span className="mx-2">•</span>
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, pagination.total)} of {pagination.total} products
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-[#333] bg-[#222] text-[#9ca3af] hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      currentPage === page
                        ? 'bg-[#22c55e] text-[#1a1a1a] border-[#22c55e]'
                        : 'bg-[#222] text-[#9ca3af] border-[#333] hover:bg-[#333]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 rounded-lg border border-[#333] bg-[#222] text-[#9ca3af] hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
