import React from 'react';
import { Product, ProductEdit } from '../types';

interface InventoryTableProps {
  products: Product[];
  editedProducts: Map<number, ProductEdit>;
  onStockChange: (productId: number, newStock: string) => void;
  onEditClick: (product: Product) => void;
  onDeleteClick: (product: Product) => void;
}

export default function InventoryTable({
  products,
  editedProducts,
  onStockChange,
  onEditClick,
  onDeleteClick,
}: InventoryTableProps) {
  return (
    <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden responsive-table">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#333]">
            <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#9ca3af' }}>Product</th>
            <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base hidden sm:table-cell" style={{ color: '#9ca3af' }}>SKU</th>
            <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#9ca3af' }}>Stock</th>
            <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base hidden sm:table-cell" style={{ color: '#9ca3af' }}>Price</th>
            <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#9ca3af' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const edit = editedProducts.get(product.id);
            const isEdited = !!edit;
            return (
              <tr 
                key={product.id} 
                className="border-b border-[#333] hover:bg-[#333] transition-colors"
                style={{ 
                  backgroundColor: (isEdited ? edit.newStock : product.stock) === 0 
                    ? 'rgba(239, 68, 68, 0.1)' 
                    : (isEdited ? edit.newStock : product.stock) < 10 
                      ? 'rgba(234, 179, 8, 0.1)' 
                      : 'transparent' 
                }}
              >
                <td className="p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#22c55e' }}>{product.name}</td>
                <td className="p-3 sm:p-4 text-sm sm:text-base hidden sm:table-cell" style={{ color: '#9ca3af' }}>{product.sku}</td>
                <td className="p-3 sm:p-4">
                  <input
                    type="number"
                    min="0"
                    value={isEdited ? edit.newStock : product.stock}
                    onChange={(e) => onStockChange(product.id, e.target.value)}
                    className={`w-16 sm:w-20 px-2 py-1 rounded bg-[#1a1a1a] text-[#22c55e] focus:outline-none focus:border-[#22c55e] border-2 text-sm ${
                      isEdited ? 'border-[#22c55e]' : 'border-[#333]'
                    }`}
                  />
                </td>
                <td className="p-3 sm:p-4 text-sm sm:text-base hidden sm:table-cell" style={{ color: '#22c55e' }}>₱{Number(product.price).toFixed(2)}</td>
                <td className="p-3 sm:p-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEditClick(product)}
                      className="p-2 rounded hover:bg-[#444] transition-colors" 
                      style={{ color: '#22c55e' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button 
                      onClick={() => onDeleteClick(product)}
                      className="p-2 rounded hover:bg-[#444] transition-colors" 
                      style={{ color: '#ef4444' }}
                    >
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
  );
}
