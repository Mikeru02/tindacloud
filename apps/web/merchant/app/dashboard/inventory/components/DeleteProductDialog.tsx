import React from 'react';
import { Product } from '../types';

interface DeleteProductDialogProps {
  show: boolean;
  product: Product | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteProductDialog({
  show,
  product,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteProductDialogProps) {
  if (!show || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#222] rounded-xl border border-[#333] p-4 sm:p-6 max-w-md w-full mx-4 relative">
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
          Delete Product
        </h2>
        
        <div className="mb-6" style={{ color: '#9ca3af' }}>
          Are you sure you want to delete <span className="font-medium" style={{ color: '#22c55e' }}>{product.name}</span>? This action cannot be undone.
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg border border-[#333] bg-[#222] text-[#9ca3af] hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
