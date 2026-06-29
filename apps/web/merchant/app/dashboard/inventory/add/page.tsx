'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../api/client';
import Input from '../../../components/Input';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    cost: '',
    stock: '0',
    low_stock_threshold: '10',
    wholesale_price: '',
    wholesale_count: '',
    category_id: '',
    category_name: '',
    status: 'active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const normalizeCategoryName = (category: string | null | undefined): string => {
    if (!category) return '';
    // Convert to lowercase and replace spaces with hyphens for database storage
    return category
      .toLowerCase()
      .replace(/\s+/g, '-');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.cost || parseFloat(formData.cost) < 0) {
      newErrors.cost = 'Cost must be a positive number';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }

    if (!formData.low_stock_threshold || parseInt(formData.low_stock_threshold) < 0) {
      newErrors.low_stock_threshold = 'Low stock threshold must be a non-negative number';
    }

    if (formData.wholesale_price && parseFloat(formData.wholesale_price) < 0) {
      newErrors.wholesale_price = 'Wholesale price must be a positive number';
    }

    if (formData.wholesale_count && parseInt(formData.wholesale_count) < 0) {
      newErrors.wholesale_count = 'Wholesale count must be a non-negative number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stock: parseInt(formData.stock),
        low_stock_threshold: parseInt(formData.low_stock_threshold),
        status: formData.status,
        ...(formData.wholesale_price && { wholesale_price: parseFloat(formData.wholesale_price) }),
        ...(formData.wholesale_count && { wholesale_count: parseInt(formData.wholesale_count) }),
        ...(formData.category_id && { category_id: parseInt(formData.category_id) }),
        ...(formData.category_name && { category_name: normalizeCategoryName(formData.category_name) }),
      };

      await apiClient.post('/products', payload);
      router.push('/dashboard/inventory');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to create product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => router.push('/dashboard/inventory')}
          className="flex items-center gap-2 text-sm mb-4 hover:opacity-80 transition-opacity"
          style={{ color: '#9ca3af' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Inventory
        </button>
        <h1 className="text-3xl font-bold" style={{ color: '#22c55e' }}>
          Add New Product
        </h1>
        <p style={{ color: '#666' }}>
          Fill in the details below to add a new product to your inventory.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#222] rounded-xl border border-[#333] p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Product Name *"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            required
          />

          <Input
            label="SKU *"
            placeholder="Enter SKU (e.g., PROD-001)"
            value={formData.sku}
            onChange={(e) => handleInputChange('sku', e.target.value)}
            error={errors.sku}
            required
          />

          <Input
            label="Price *"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            error={errors.price}
            required
          />

          <Input
            label="Cost *"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.cost}
            onChange={(e) => handleInputChange('cost', e.target.value)}
            error={errors.cost}
            required
          />

          <Input
            label="Stock *"
            type="number"
            min="0"
            placeholder="0"
            value={formData.stock}
            onChange={(e) => handleInputChange('stock', e.target.value)}
            error={errors.stock}
            required
          />

          <Input
            label="Low Stock Threshold"
            type="number"
            min="0"
            placeholder="10"
            value={formData.low_stock_threshold}
            onChange={(e) => handleInputChange('low_stock_threshold', e.target.value)}
            error={errors.low_stock_threshold}
          />

          <Input
            label="Wholesale Price (Optional)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.wholesale_price}
            onChange={(e) => handleInputChange('wholesale_price', e.target.value)}
            error={errors.wholesale_price}
          />

          <Input
            label="Wholesale Count (Optional)"
            type="number"
            min="0"
            placeholder="0"
            value={formData.wholesale_count}
            onChange={(e) => handleInputChange('wholesale_count', e.target.value)}
            error={errors.wholesale_count}
          />

          <div className="md:col-span-2">
            <Input
              label="Category (Optional)"
              type="text"
              placeholder="Enter category name (e.g., Canned Goods)"
              value={formData.category_name}
              onChange={(e) => handleInputChange('category_name', e.target.value)}
              error={errors.category_name}
            />
            <p className="mt-1 text-sm" style={{ color: '#666' }}>
              Category will be automatically sanitized (e.g., "Canned Goods" → "canned-goods")
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: '#22c55e' }}>
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] focus:outline-none focus:border-[#22c55e] transition-colors"
              style={{ borderColor: '#333' }}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard/inventory')}
            className="px-6 py-3 rounded-lg font-medium border border-[#333] bg-[#222] text-[#9ca3af] hover:bg-[#333] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
