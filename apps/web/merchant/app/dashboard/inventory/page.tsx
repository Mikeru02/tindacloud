'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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

interface ProductEdit {
  id: number;
  name: string;
  newStock: number;
  originalStock: number;
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
  const [editedProducts, setEditedProducts] = useState<Map<number, ProductEdit>>(new Map());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState<'SALE' | 'RESTOCK' | 'DAMAGED' | 'EXPIRED' | 'LOST' | 'ADJUSTMENT' | null>(null);
  const [remarks, setRemarks] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const ITEMS_PER_PAGE = 10;
  const isFirstRender = useRef(true);

  const fetchProducts = useCallback(async (page: number = 1, search?: string) => {
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
  }, []);

  useEffect(() => {
    console.log('[Inventory] Component MOUNTED', new Date().toISOString());
    return () => {
      console.log('[Inventory] Component UNMOUNTED', new Date().toISOString());
      isFirstRender.current = true; // Reset for React Strict Mode double-mount
    };
  }, []);

  useEffect(() => {
    console.log('[Inventory] FETCH EFFECT - currentPage:', currentPage, 'time:', new Date().toISOString());
    fetchProducts(currentPage, searchQuery || undefined);
  }, [currentPage, searchQuery, fetchProducts]);

  // Debounced search effect
  useEffect(() => {
    console.log('[Inventory] SEARCH EFFECT - searchQuery:', searchQuery, 'time:', new Date().toISOString());
    
    // Skip the initial render to prevent flickering
    if (isFirstRender.current) {
      console.log('[Inventory] SEARCH EFFECT skipped - initial render');
      isFirstRender.current = false;
      return;
    }

    const debounceTimer = setTimeout(() => {
      console.log('[Inventory] SEARCH DEBOUNCE fired - fetching with search:', searchQuery, 'time:', new Date().toISOString());
      if (currentPage === 1) {
        fetchProducts(1, searchQuery || undefined);
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => {
      console.log('[Inventory] SEARCH EFFECT cleanup - clearing timer');
      clearTimeout(debounceTimer);
    };
  }, [searchQuery, fetchProducts]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
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

  const handleStockChange = (productId: number, newStock: string) => {
    const stockValue = parseInt(newStock);
    if (isNaN(stockValue) || stockValue < 0) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newMap = new Map(editedProducts);
    if (stockValue === product.stock) {
      newMap.delete(productId);
    } else {
      newMap.set(productId, {
        id: productId,
        name: product.name,
        newStock: stockValue,
        originalStock: product.stock,
      });
    }
    setEditedProducts(newMap);
  };

  const handleSaveClick = () => {
    if (editedProducts.size === 0) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    if (!selectedReason) return;

    setIsSaving(true);
    try {
      const items = Array.from(editedProducts.values()).map(edit => ({
        product_id: edit.id,
        new_stock: edit.newStock,
      }));

      await apiClient.post('/inventory/batch-update', {
        items,
        reason: selectedReason,
        remarks: remarks || undefined,
      });

      // Reset state and refetch
      setEditedProducts(new Map());
      setShowConfirmDialog(false);
      setSelectedReason(null);
      setRemarks('');
      await fetchProducts(currentPage, searchQuery || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update inventory');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProducts(new Map());
    setShowConfirmDialog(false);
    setSelectedReason(null);
    setRemarks('');
  };

  const hasChanges = editedProducts.size > 0;

  if (loading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#22c55e' }}>
            Inventory
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search products..."
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
            <button 
              onClick={() => router.push('/dashboard/inventory/add')}
              className="px-4 sm:px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors text-sm sm:text-base"
            >
              Add Product
            </button>
            {hasChanges && (
              <button
                onClick={handleSaveClick}
                className="px-4 sm:px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors text-sm sm:text-base"
              >
                Save Changes ({editedProducts.size})
              </button>
            )}
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#22c55e' }}>
          Inventory
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search products..."
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
          <button 
            onClick={() => router.push('/dashboard/inventory/add')}
            className="px-4 sm:px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors text-sm sm:text-base"
          >
            Add Product
          </button>
          {hasChanges && (
            <button
              onClick={handleSaveClick}
              className="px-4 sm:px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors text-sm sm:text-base"
            >
              Save Changes ({editedProducts.size})
            </button>
          )}
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
              <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: '#9ca3af' }}>
                No products yet
              </h3>
              <p className="mb-6 text-sm sm:text-base" style={{ color: '#666' }}>
                Get started by adding your first product to the inventory.
              </p>
              <button
                onClick={() => router.push('/dashboard/inventory/add')}
                className="px-4 sm:px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors text-sm sm:text-base"
              >
                Add Your First Product
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden responsive-table">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#333]">
                  <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#9ca3af' }}>Product</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base hidden sm:table-cell" style={{ color: '#9ca3af' }}>SKU</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#9ca3af' }}>Stock</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#9ca3af' }}>Price</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base hidden sm:table-cell" style={{ color: '#9ca3af' }}>Status</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#9ca3af' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const edit = editedProducts.get(product.id);
                  const isEdited = !!edit;
                  return (
                    <tr key={product.id} className="border-b border-[#333] hover:bg-[#333] transition-colors">
                      <td className="p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#22c55e' }}>{product.name}</td>
                      <td className="p-3 sm:p-4 text-sm sm:text-base hidden sm:table-cell" style={{ color: '#9ca3af' }}>{product.sku}</td>
                      <td className="p-3 sm:p-4">
                        <input
                          type="number"
                          min="0"
                          value={isEdited ? edit.newStock : product.stock}
                          onChange={(e) => handleStockChange(product.id, e.target.value)}
                          className={`w-16 sm:w-20 px-2 py-1 rounded bg-[#1a1a1a] text-[#22c55e] focus:outline-none focus:border-[#22c55e] border-2 text-sm ${
                            isEdited ? 'border-[#22c55e]' : 'border-[#333]'
                          }`}
                        />
                      </td>
                      <td className="p-3 sm:p-4 text-sm sm:text-base" style={{ color: '#22c55e' }}>₱{Number(product.price).toFixed(2)}</td>
                      <td className="p-3 sm:p-4 hidden sm:table-cell">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(getStatusLabel(isEdited ? edit.newStock : product.stock))}`}>
                          {getStatusLabel(isEdited ? edit.newStock : product.stock)}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4">
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
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-center sm:text-left" style={{ color: '#9ca3af' }}>
                <span className="font-medium">Page {currentPage} of {pagination.totalPages}</span>
                <span className="mx-2">•</span>
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, pagination.total)} of {pagination.total} products
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

      {/* Inventory Adjustment Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#222] rounded-xl border border-[#333] p-4 sm:p-6 max-w-lg w-full mx-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowConfirmDialog(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-[#333] transition-colors"
              style={{ color: '#9ca3af' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
              Inventory Update Summary
            </h2>
            
            <div className="mb-4" style={{ color: '#9ca3af' }}>
              Products affected: {editedProducts.size}
            </div>

            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {Array.from(editedProducts.values()).map((edit) => {
                const difference = edit.newStock - edit.originalStock;
                return (
                  <div key={edit.id} className="bg-[#1a1a1a] rounded-lg p-3">
                    <div className="font-medium" style={{ color: '#22c55e' }}>{edit.name}</div>
                    <div className="text-sm" style={{ color: '#9ca3af' }}>
                      {edit.originalStock} → {edit.newStock}
                    </div>
                    <div className={`text-sm ${difference < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      Difference: {difference > 0 ? '+' : ''}{difference}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                Reason for Adjustment
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'SALE', label: 'Sale' },
                  { value: 'RESTOCK', label: 'Restock' },
                  { value: 'DAMAGED', label: 'Damaged' },
                  { value: 'EXPIRED', label: 'Expired' },
                  { value: 'LOST', label: 'Lost' },
                  { value: 'ADJUSTMENT', label: 'Count Correction' },
                ].map((reason) => (
                  <label key={reason.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="reason"
                      value={reason.value}
                      checked={selectedReason === reason.value}
                      onChange={(e) => setSelectedReason(e.target.value as any)}
                      className="accent-[#22c55e]"
                    />
                    <span style={{ color: '#9ca3af' }}>{reason.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                Remarks (optional)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] text-[#22c55e] border-2 border-[#333] focus:outline-none focus:border-[#22c55e] resize-none"
                rows={2}
                placeholder="Add any additional notes..."
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg border border-[#333] bg-[#222] text-[#9ca3af] hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={!selectedReason || isSaving}
                className="px-4 py-2 rounded-lg bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
