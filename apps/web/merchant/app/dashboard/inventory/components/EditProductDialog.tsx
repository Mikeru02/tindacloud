import React from 'react';
import { Product, EditProductForm } from '../types';

interface EditProductDialogProps {
  show: boolean;
  product: Product | null;
  formData: EditProductForm;
  isUpdating: boolean;
  onFormChange: (field: keyof EditProductForm, value: string | number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function EditProductDialog({
  show,
  product,
  formData,
  isUpdating,
  onFormChange,
  onConfirm,
  onCancel,
}: EditProductDialogProps) {
  if (!show || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#222] rounded-xl border border-[#333] p-4 sm:p-6 max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded hover:bg-[#333] transition-colors"
          style={{ color: '#9ca3af' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
          Edit Product
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Product Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => onFormChange('name', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] text-[#22c55e] border-2 border-[#333] focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              SKU
            </label>
            <input
              type="text"
              value={formData.sku || ''}
              onChange={(e) => onFormChange('sku', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] text-[#22c55e] border-2 border-[#333] focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Category
            </label>
            <input
              type="text"
              value={formData.category || ''}
              onChange={(e) => onFormChange('category', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] text-[#22c55e] border-2 border-[#333] focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                Price (₱)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price || ''}
                onChange={(e) => onFormChange('price', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] text-[#22c55e] border-2 border-[#333] focus:outline-none focus:border-[#22c55e]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                Cost (₱)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.cost || ''}
                onChange={(e) => onFormChange('cost', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] text-[#22c55e] border-2 border-[#333] focus:outline-none focus:border-[#22c55e]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                Wholesale Price (₱)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.wholesale_price || ''}
                onChange={(e) => onFormChange('wholesale_price', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] text-[#22c55e] border-2 border-[#333] focus:outline-none focus:border-[#22c55e]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                Wholesale Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.wholesale_count || ''}
                onChange={(e) => onFormChange('wholesale_count', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] text-[#22c55e] border-2 border-[#333] focus:outline-none focus:border-[#22c55e]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                Low Stock Threshold
              </label>
              <input
                type="number"
                min="0"
                value={formData.low_stock_threshold || ''}
                onChange={(e) => onFormChange('low_stock_threshold', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] text-[#22c55e] border-2 border-[#333] focus:outline-none focus:border-[#22c55e]"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                Status
              </label>
              <select
                value={formData.status || ''}
                onChange={(e) => onFormChange('status', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] text-[#22c55e] border-2 border-[#333] focus:outline-none focus:border-[#22c55e]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Current Stock
            </label>
            <input
              type="number"
              value={product.stock}
              disabled
              className="w-full px-3 py-2 rounded-lg bg-[#333] text-[#666] border-2 border-[#333] cursor-not-allowed"
            />
            <p className="text-xs mt-1" style={{ color: '#666' }}>
              Stock cannot be edited here. Use the stock input in the table.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onCancel}
            disabled={isUpdating}
            className="px-4 py-2 rounded-lg border border-[#333] bg-[#222] text-[#9ca3af] hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isUpdating}
            className="px-4 py-2 rounded-lg bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
