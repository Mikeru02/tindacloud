import React from 'react';

interface InventoryHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddProduct: () => void;
  hasChanges: boolean;
  editedCount: number;
  onSaveChanges: () => void;
}

export default function InventoryHeader({
  searchQuery,
  onSearchChange,
  onAddProduct,
  hasChanges,
  editedCount,
  onSaveChanges,
}: InventoryHeaderProps) {
  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
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
          onClick={onAddProduct}
          className="px-4 sm:px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors text-sm sm:text-base"
        >
          Add Product
        </button>
        {hasChanges && (
          <button
            onClick={onSaveChanges}
            className="px-4 sm:px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors text-sm sm:text-base"
          >
            Save Changes ({editedCount})
          </button>
        )}
      </div>
    </div>
  );
}
