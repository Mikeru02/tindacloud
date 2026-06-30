'use client';

import React from 'react';
import { MenuItem } from '../types';

interface DeleteMenuItemDialogProps {
  show: boolean;
  menuItem: MenuItem | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteMenuItemDialog({
  show,
  menuItem,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteMenuItemDialogProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#222] rounded-xl border border-[#333] p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Delete Menu Item</h2>
        <p className="mb-6" style={{ color: '#9ca3af' }}>
          Are you sure you want to delete "{menuItem?.name}"? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg bg-[#333] text-white hover:bg-[#444] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
