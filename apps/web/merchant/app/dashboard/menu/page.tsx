'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import apiClient from '../../api/client';
import { MenuItem, PaginatedMenuResponse, EditMenuItemForm } from './types';
import { useStore } from '../../store/useStore';
import MenuHeader from './components/MenuHeader';
import MenuTable from './components/MenuTable';
import MenuPagination from './components/MenuPagination';
import MenuSkeleton from './components/MenuSkeleton';
import EditMenuItemDialog from './components/EditMenuItemDialog';
import DeleteMenuItemDialog from './components/DeleteMenuItemDialog';

const ITEMS_PER_PAGE = 10;

export default function MenuPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentStore } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingMenuItems, setIsFetchingMenuItems] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginatedMenuResponse | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [menuItemToEdit, setMenuItemToEdit] = useState<MenuItem | null>(null);
  const [editFormData, setEditFormData] = useState<EditMenuItemForm>({
    name: '',
    description: '',
    price: 0,
    category: '',
    status: 'available',
  });
  const [isUpdatingMenuItem, setIsUpdatingMenuItem] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [menuItemToDelete, setMenuItemToDelete] = useState<MenuItem | null>(null);
  const [isDeletingMenuItem, setIsDeletingMenuItem] = useState(false);

  const fetchMenuItems = useCallback(async (page: number = 1, search?: string, category?: string, status?: string) => {
    if (!currentStore) return;

    setIsFetchingMenuItems(true);
    setError(null);

    try {
      const response = await apiClient.get('/menu-items', {
        params: {
          merchantId: currentStore.id,
          page,
          limit: ITEMS_PER_PAGE,
          ...(search && { search }),
          ...(category && { category }),
          ...(status && { status }),
        },
      });

      const data: PaginatedMenuResponse = response.data;
      setMenuItems(data.menuItems);
      setPagination(data);
      setCurrentPage(data.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menu items');
    } finally {
      setIsFetchingMenuItems(false);
      setIsInitialLoading(false);
    }
  }, [currentStore]);

  const fetchCategories = useCallback(async () => {
    if (!currentStore) return;

    try {
      const response = await apiClient.get('/menu-items/categories', {
        params: { merchantId: currentStore.id },
      });
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, [currentStore]);

  // Initial load effect
  useEffect(() => {
    if (currentStore) {
      if (currentStore.store_type.toLowerCase() !== 'restaurant') {
        router.push('/dashboard');
        return;
      }
      fetchMenuItems(1);
      fetchCategories();
    }
  }, [fetchMenuItems, fetchCategories, currentStore, router]);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Fetch when filters change
  useEffect(() => {
    if (currentPage === 1) {
      fetchMenuItems(1, debouncedSearchQuery || undefined, categoryFilter || undefined, statusFilter || undefined);
    } else {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery, categoryFilter, statusFilter, fetchMenuItems]);

  // Fetch when page changes
  useEffect(() => {
    fetchMenuItems(currentPage, debouncedSearchQuery || undefined, categoryFilter || undefined, statusFilter || undefined);
  }, [currentPage, fetchMenuItems]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

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

  const handleEditClick = (menuItem: MenuItem) => {
    setMenuItemToEdit(menuItem);
    setEditFormData({
      name: menuItem.name,
      description: menuItem.description || '',
      price: menuItem.price,
      category: menuItem.category || '',
      status: menuItem.status,
    });
    setShowEditDialog(true);
  };

  const handleEditFormChange = (field: keyof EditMenuItemForm, value: string | number) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmEdit = async () => {
    if (!menuItemToEdit) return;

    setIsUpdatingMenuItem(true);
    try {
      await apiClient.put(`/menu-items/${menuItemToEdit.id}`, editFormData, {
        params: { merchantId: currentStore?.id },
      });
      setShowEditDialog(false);
      setMenuItemToEdit(null);
      setEditFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        status: 'available',
      });
      await fetchMenuItems(currentPage, debouncedSearchQuery || undefined, categoryFilter || undefined, statusFilter || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update menu item');
    } finally {
      setIsUpdatingMenuItem(false);
    }
  };

  const handleCancelEditDialog = () => {
    setShowEditDialog(false);
    setMenuItemToEdit(null);
    setEditFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      status: 'available',
    });
  };

  const handleDeleteClick = (menuItem: MenuItem) => {
    setMenuItemToDelete(menuItem);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!menuItemToDelete || !currentStore) return;

    setIsDeletingMenuItem(true);
    try {
      await apiClient.delete(`/menu-items/${menuItemToDelete.id}`, {
        params: { merchantId: currentStore.id }
      });
      setShowDeleteDialog(false);
      setMenuItemToDelete(null);
      await fetchMenuItems(currentPage, debouncedSearchQuery || undefined, categoryFilter || undefined, statusFilter || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete menu item');
    } finally {
      setIsDeletingMenuItem(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setMenuItemToDelete(null);
  };

  if (isInitialLoading) {
    return <MenuSkeleton />;
  }

  return (
    <div>
      <MenuHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categories={categories}
        onAddMenuItem={() => router.push('/dashboard/menu/add')}
      />

      {error ? (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      ) : menuItems.length === 0 ? (
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
            <path d="M8 6h13"></path>
            <path d="M8 12h13"></path>
            <path d="M8 18h13"></path>
            <path d="M3 6h.01"></path>
            <path d="M3 12h.01"></path>
            <path d="M3 18h.01"></path>
          </svg>
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#9ca3af' }}>
            No menu items yet
          </h3>
          <p className="mb-6 text-sm" style={{ color: '#666' }}>
            Get started by adding your first menu item.
          </p>
          <button
            onClick={() => router.push('/dashboard/menu/add')}
            className="px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors"
          >
            Add Your First Menu Item
          </button>
        </div>
      ) : (
        <>
          <MenuTable
            menuItems={menuItems}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />

          {pagination && pagination.totalPages > 1 && (
            <MenuPagination
              pagination={pagination}
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <EditMenuItemDialog
        show={showEditDialog}
        menuItem={menuItemToEdit}
        formData={editFormData}
        isUpdating={isUpdatingMenuItem}
        onFormChange={handleEditFormChange}
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEditDialog}
      />

      <DeleteMenuItemDialog
        show={showDeleteDialog}
        menuItem={menuItemToDelete}
        isDeleting={isDeletingMenuItem}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
