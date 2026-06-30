'use client';

import React, { useState, useEffect } from 'react';
import { MenuItem, EditMenuItemForm } from '../types';

interface Product {
  id: number;
  name: string;
  stock: number;
}

interface EditMenuItemDialogProps {
  show: boolean;
  menuItem: MenuItem | null;
  formData: EditMenuItemForm;
  isUpdating: boolean;
  onFormChange: (field: keyof EditMenuItemForm, value: string | number) => void;
  onConfirm: () => void;
  onCancel: () => void;
  products?: Product[];
}

export default function EditMenuItemDialog({
  show,
  menuItem,
  formData,
  isUpdating,
  onFormChange,
  onConfirm,
  onCancel,
  products = [],
}: EditMenuItemDialogProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [ingredientQuantity, setIngredientQuantity] = useState<string>('1');
  const [localIngredients, setLocalIngredients] = useState<Array<{ product_id: number; quantity: number }>>([]);

  useEffect(() => {
    if (formData.ingredients) {
      setLocalIngredients(formData.ingredients);
    } else {
      setLocalIngredients([]);
    }
  }, [formData.ingredients, show]);

  const handleAddIngredient = () => {
    if (!selectedProductId || !ingredientQuantity) return;

    const productId = parseInt(selectedProductId);
    const quantity = parseFloat(ingredientQuantity);

    if (isNaN(productId) || isNaN(quantity) || quantity <= 0) return;

    if (localIngredients.some(ing => ing.product_id === productId)) {
      return;
    }

    const newIngredients = [...localIngredients, { product_id: productId, quantity }];
    setLocalIngredients(newIngredients);
    onFormChange('ingredients', newIngredients as any);
    setSelectedProductId('');
    setIngredientQuantity('1');
  };

  const handleRemoveIngredient = (productId: number) => {
    const newIngredients = localIngredients.filter(ing => ing.product_id !== productId);
    setLocalIngredients(newIngredients);
    onFormChange('ingredients', newIngredients as any);
  };

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

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Ingredients (from Inventory)
            </label>
            
            {/* Add Ingredient Form */}
            <div className="flex gap-2 mb-3">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[#333] border border-[#444] text-white focus:outline-none focus:border-[#22c55e] text-sm"
              >
                <option value="">Select ingredient...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stock: {product.stock})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={ingredientQuantity}
                onChange={(e) => setIngredientQuantity(e.target.value)}
                min="0.01"
                step="0.01"
                placeholder="Qty"
                className="w-20 px-3 py-2 rounded-lg bg-[#333] border border-[#444] text-white focus:outline-none focus:border-[#22c55e] text-sm"
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-3 py-2 rounded-lg bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors font-medium text-sm"
              >
                Add
              </button>
            </div>

            {/* Ingredients List */}
            {localIngredients.length > 0 && (
              <div className="bg-[#333] rounded-lg p-3 border border-[#444]">
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {localIngredients.map((ingredient) => {
                    const product = products.find(p => p.id === ingredient.product_id);
                    return (
                      <div
                        key={ingredient.product_id}
                        className="flex items-center justify-between bg-[#222] rounded-lg px-3 py-2"
                      >
                        <span className="text-white text-sm">
                          {product?.name || 'Unknown'} - Qty: {ingredient.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(ingredient.product_id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {products.length === 0 && (
              <p className="text-xs mt-2" style={{ color: '#666' }}>
                No products in inventory.
              </p>
            )}
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
