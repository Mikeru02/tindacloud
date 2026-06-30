'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../api/client';
import { Product, ProductEdit, PaginatedResponse, EditProductForm, InventoryAdjustmentReason } from './types';
import InventoryHeader from './components/InventoryHeader';
import InventoryTable from './components/InventoryTable';
import InventoryPagination from './components/InventoryPagination';
import InventorySkeleton from './components/InventorySkeleton';
import EditProductDialog from './components/EditProductDialog';
import DeleteProductDialog from './components/DeleteProductDialog';
import InventoryAdjustmentDialog from './components/InventoryAdjustmentDialog';
import { useStore } from '../../store/useStore';

const ITEMS_PER_PAGE = 10;

export default function InventoryPage() {
  const router = useRouter();
  const { currentStore } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginatedResponse | null>(null);
  const [editedProducts, setEditedProducts] = useState<Map<number, ProductEdit>>(new Map());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState<InventoryAdjustmentReason | null>(null);
  const [remarks, setRemarks] = useState('');
  const [isSavingInventory, setIsSavingInventory] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState<EditProductForm>({
    name: '',
    sku: '',
    category: '',
    price: 0,
    cost: 0,
    wholesale_price: 0,
    wholesale_count: 0,
    low_stock_threshold: 0,
    status: 'active',
  });
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);

  const fetchProducts = useCallback(async (page: number = 1, search?: string) => {
    if (!currentStore) return;

    setIsFetchingProducts(true);
    setError(null);

    try {
      const response = await apiClient.get('/products', {
        params: {
          merchantId: currentStore.id,
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
      setIsFetchingProducts(false);
      setIsInitialLoading(false);
    }
  }, [currentStore]);

  // Initial load effect
  useEffect(() => {
    if (currentStore) {
      fetchProducts(1);
    }
  }, [fetchProducts, currentStore]);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Fetch when debounced search query or page changes
  useEffect(() => {
    if (currentPage === 1) {
      fetchProducts(1, debouncedSearchQuery || undefined);
    } else {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery, fetchProducts]);

  // Fetch when page changes (with current search)
  useEffect(() => {
    fetchProducts(currentPage, debouncedSearchQuery || undefined);
  }, [currentPage, fetchProducts]);

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

  const sanitizeCategoryName = (category: string | null | undefined): string => {
    if (!category) return '';
    // Replace hyphens with spaces and convert to title case
    return category
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const normalizeCategoryName = (category: string | null | undefined): string => {
    if (!category) return '';
    // Convert to lowercase and replace spaces with hyphens for database storage
    return category
      .toLowerCase()
      .replace(/\s+/g, '-');
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
    if (!selectedReason || !currentStore) return;

    setIsSavingInventory(true);
    try {
      const items = Array.from(editedProducts.values()).map(edit => ({
        product_id: edit.id,
        new_stock: edit.newStock,
      }));

      await apiClient.post('/inventory/batch-update', {
        merchantId: currentStore.id,
        items,
        reason: selectedReason,
        remarks: remarks || undefined,
      });

      // Reset state and refetch
      setEditedProducts(new Map());
      setShowConfirmDialog(false);
      setSelectedReason(null);
      setRemarks('');
      await fetchProducts(currentPage, debouncedSearchQuery || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update inventory');
    } finally {
      setIsSavingInventory(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProducts(new Map());
    setShowConfirmDialog(false);
    setSelectedReason(null);
    setRemarks('');
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete || !currentStore) return;

    setIsDeletingProduct(true);
    try {
      await apiClient.delete(`/products/${productToDelete.id}`, {
        params: { merchantId: currentStore.id }
      });
      setShowDeleteDialog(false);
      setProductToDelete(null);
      await fetchProducts(currentPage, debouncedSearchQuery || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setIsDeletingProduct(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setProductToDelete(null);
  };

  const handleEditClick = (product: Product) => {
    setProductToEdit(product);
    setEditFormData({
      name: product.name,
      sku: product.sku,
      price: product.price,
      cost: product.cost,
      wholesale_price: product.wholesale_price,
      wholesale_count: product.wholesale_count,
      low_stock_threshold: product.low_stock_threshold,
      category: sanitizeCategoryName(product.category?.name || ''),
      status: product.status,
    });
    setShowEditDialog(true);
  };

  const handleEditFormChange = (field: keyof EditProductForm, value: string | number) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmEdit = async (imageFile?: File) => {
    if (!productToEdit || !currentStore) return;

    setIsUpdatingProduct(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', editFormData.name);
      formDataToSend.append('sku', editFormData.sku);
      formDataToSend.append('price', String(editFormData.price));
      formDataToSend.append('cost', String(editFormData.cost));
      formDataToSend.append('wholesale_price', String(editFormData.wholesale_price));
      formDataToSend.append('wholesale_count', String(editFormData.wholesale_count));
      formDataToSend.append('low_stock_threshold', String(editFormData.low_stock_threshold));
      formDataToSend.append('category', normalizeCategoryName(editFormData.category));
      formDataToSend.append('status', editFormData.status);

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await apiClient.put(`/products/${productToEdit.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          merchantId: currentStore.id,
        },
      });
      setShowEditDialog(false);
      setProductToEdit(null);
      setEditFormData({
        name: '',
        sku: '',
        category: '',
        price: 0,
        cost: 0,
        wholesale_price: 0,
        wholesale_count: 0,
        low_stock_threshold: 0,
        status: 'active',
      });
      await fetchProducts(currentPage, debouncedSearchQuery || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setIsUpdatingProduct(false);
    }
  };

  const handleCancelEditDialog = () => {
    setShowEditDialog(false);
    setProductToEdit(null);
    setEditFormData({
      name: '',
      sku: '',
      category: '',
      price: 0,
      cost: 0,
      wholesale_price: 0,
      wholesale_count: 0,
      low_stock_threshold: 0,
      status: 'active',
    });
  };

  const hasChanges = editedProducts.size > 0;

  return (
    <div>
      <InventoryHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddProduct={() => router.push('/dashboard/inventory/add')}
        hasChanges={hasChanges}
        editedCount={editedProducts.size}
        onSaveChanges={handleSaveClick}
      />

      {isInitialLoading ? (
        <InventorySkeleton />
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : products.length === 0 ? (

        <div className="bg-[#222] rounded-xl border border-[#333] p-12 text-center">
          {debouncedSearchQuery ? (
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
                No products match your search "{debouncedSearchQuery}". Try a different search term.
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
          <InventoryTable
            products={products}
            editedProducts={editedProducts}
            onStockChange={handleStockChange}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />

          {pagination && (
            <InventoryPagination
              pagination={pagination}
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <EditProductDialog
        show={showEditDialog}
        product={productToEdit}
        formData={editFormData}
        isUpdating={isUpdatingProduct}
        onFormChange={handleEditFormChange}
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEditDialog}
      />

      <DeleteProductDialog
        show={showDeleteDialog}
        product={productToDelete}
        isDeleting={isDeletingProduct}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <InventoryAdjustmentDialog
        show={showConfirmDialog}
        editedProducts={editedProducts}
        selectedReason={selectedReason}
        remarks={remarks}
        isSaving={isSavingInventory}
        onReasonChange={setSelectedReason}
        onRemarksChange={setRemarks}
        onConfirm={handleConfirmSave}
        onCancel={handleCancelEdit}
      />
    </div>
  );
}
