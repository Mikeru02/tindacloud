'use client';

import React from 'react';
import { MenuItem, EditMenuItemForm } from '../types';

interface EditMenuItemDialogProps {
  show: boolean;
  menuItem: MenuItem | null;
  formData: EditMenuItemForm;
  isUpdating: boolean;
  onFormChange: (field: keyof EditMenuItemForm, value: string | number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function EditMenuItemDialog({
  show,
  menuItem,
  formData,
  isUpdating,
  onFormChange,
  onConfirm,
  onCancel,
}: EditMenuItemDialogProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#222] rounded-xl border border-[#333] p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Edit Menu Item</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormChange('name', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#333] border border-[#444] text-white focus:outline-none focus:border-[#22c55e]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-[#333] border border-[#444] text-white focus:outline-none focus:border-[#22c55e]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Price
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => onFormChange('price', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 rounded-lg bg-[#333] border border-[#444] text-white focus:outline-none focus:border-[#22c55e]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => onFormChange('category', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#333] border border-[#444] text-white focus:outline-none focus:border-[#22c55e]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => onFormChange('status', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#333] border border-[#444] text-white focus:outline-none focus:border-[#22c55e]"
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg bg-[#333] text-white hover:bg-[#444] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isUpdating}
            className="flex-1 px-4 py-2 rounded-lg bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors disabled:opacity-50"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
