import React from 'react';
import { ProductEdit, InventoryAdjustmentReason } from '../types';

interface InventoryAdjustmentDialogProps {
  show: boolean;
  editedProducts: Map<number, ProductEdit>;
  selectedReason: InventoryAdjustmentReason | null;
  remarks: string;
  isSaving: boolean;
  onReasonChange: (reason: InventoryAdjustmentReason) => void;
  onRemarksChange: (remarks: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function InventoryAdjustmentDialog({
  show,
  editedProducts,
  selectedReason,
  remarks,
  isSaving,
  onReasonChange,
  onRemarksChange,
  onConfirm,
  onCancel,
}: InventoryAdjustmentDialogProps) {
  if (!show) return null;

  const reasons: { value: InventoryAdjustmentReason; label: string }[] = [
    { value: 'SALE', label: 'Sale' },
    { value: 'RESTOCK', label: 'Restock' },
    { value: 'DAMAGED', label: 'Damaged' },
    { value: 'EXPIRED', label: 'Expired' },
    { value: 'LOST', label: 'Lost' },
    { value: 'ADJUSTMENT', label: 'Count Correction' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#222] rounded-xl border border-[#333] p-4 sm:p-6 max-w-lg w-full mx-4 relative max-h-[90vh] overflow-y-auto">
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
            {reasons.map((reason) => (
              <label key={reason.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="reason"
                  value={reason.value}
                  checked={selectedReason === reason.value}
                  onChange={(e) => onReasonChange(e.target.value as InventoryAdjustmentReason)}
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
            onChange={(e) => onRemarksChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] text-[#22c55e] border-2 border-[#333] focus:outline-none focus:border-[#22c55e] resize-none"
            rows={2}
            placeholder="Add any additional notes..."
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg border border-[#333] bg-[#222] text-[#9ca3af] hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!selectedReason || isSaving}
            className="px-4 py-2 rounded-lg bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
