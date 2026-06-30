'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../api/client';
import { useStore } from '../../../store/useStore';

interface Product {
  id: number;
  name: string;
  stock: number;
}

interface Ingredient {
  product_id: number;
  quantity: number;
}

export default function AddMenuItemPage() {
  const router = useRouter();
  const { currentStore } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    status: 'available',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [ingredientQuantity, setIngredientQuantity] = useState<string>('1');

  useEffect(() => {
    if (currentStore) {
      if (currentStore.store_type.toLowerCase() !== 'restaurant') {
        router.push('/dashboard');
        return;
      }
      fetchCategories();
      fetchProducts();
    }
  }, [currentStore, router]);

  const fetchCategories = async () => {
    if (!currentStore) return;

    try {
      const response = await apiClient.get('/menu-items/categories', {
        params: { merchantId: currentStore.id },
      });
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchProducts = async () => {
    if (!currentStore) return;

    try {
      const response = await apiClient.get('/products', {
        params: { merchantId: currentStore.id, limit: 1000 },
      });
      setProducts(response.data.products);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddIngredient = () => {
    if (!selectedProductId || !ingredientQuantity) return;

    const productId = parseInt(selectedProductId);
    const quantity = parseFloat(ingredientQuantity);

    if (isNaN(productId) || isNaN(quantity) || quantity <= 0) return;

    // Check if ingredient already exists
    if (ingredients.some(ing => ing.product_id === productId)) {
      setError('This ingredient is already added');
      return;
    }

    setIngredients([...ingredients, { product_id: productId, quantity }]);
    setSelectedProductId('');
    setIngredientQuantity('1');
    setError(null);
  };

  const handleRemoveIngredient = (productId: number) => {
    setIngredients(ingredients.filter(ing => ing.product_id !== productId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStore) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('merchantId', currentStore.id.toString());
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('ingredients', JSON.stringify(ingredients));

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await apiClient.post('/menu-items', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: { merchantId: currentStore.id },
      });

      router.push('/dashboard/menu');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm hover:text-[#22c55e] transition-colors"
          style={{ color: '#9ca3af' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Menu
        </button>
        <h1 className="text-2xl font-bold text-white mt-4">Add Menu Item</h1>
        <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
          Create a new menu item for your restaurant
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#222] rounded-xl border border-[#333] p-6">
        <div className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Image
            </label>
            <div className="flex items-start gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-[#444] flex items-center justify-center">
                  <span className="text-4xl">🍽️</span>
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block px-4 py-2 rounded-lg bg-[#333] border border-[#444] text-white hover:bg-[#444] transition-colors cursor-pointer"
                >
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </label>
                <p className="text-xs mt-2" style={{ color: '#666' }}>
                  Recommended: Square image, max 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#333] border border-[#444] text-white focus:outline-none focus:border-[#22c55e]"
              placeholder="e.g., Sisig"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-[#333] border border-[#444] text-white focus:outline-none focus:border-[#22c55e]"
              placeholder="Describe your menu item..."
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Price (₱) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              step="0.01"
              min="0"
              className="w-full px-4 py-2 rounded-lg bg-[#333] border border-[#444] text-white focus:outline-none focus:border-[#22c55e]"
              placeholder="0.00"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Category
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                list="category-list"
                className="flex-1 px-4 py-2 rounded-lg bg-[#333] border border-[#444] text-white focus:outline-none focus:border-[#22c55e]"
                placeholder="e.g., Main Course"
              />
              <datalist id="category-list">
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-[#333] border border-[#444] text-white focus:outline-none focus:border-[#22c55e]"
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          {/* Ingredients */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Ingredients (from Inventory)
            </label>
            
            {/* Add Ingredient Form */}
            <div className="flex gap-2 mb-4">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-[#333] border border-[#444] text-white focus:outline-none focus:border-[#22c55e]"
              >
                <option value="">Select ingredient from inventory...</option>
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
                className="w-24 px-4 py-2 rounded-lg bg-[#333] border border-[#444] text-white focus:outline-none focus:border-[#22c55e]"
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-4 py-2 rounded-lg bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors font-medium"
              >
                Add
              </button>
            </div>

            {/* Ingredients List */}
            {ingredients.length > 0 && (
              <div className="bg-[#333] rounded-lg p-4 border border-[#444]">
                <h4 className="text-sm font-medium mb-3" style={{ color: '#9ca3af' }}>
                  Added Ingredients:
                </h4>
                <div className="space-y-2">
                  {ingredients.map((ingredient) => {
                    const product = products.find(p => p.id === ingredient.product_id);
                    return (
                      <div
                        key={ingredient.product_id}
                        className="flex items-center justify-between bg-[#222] rounded-lg px-3 py-2"
                      >
                        <span className="text-white">
                          {product?.name || 'Unknown'} - Qty: {ingredient.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(ingredient.product_id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <p className="text-sm mt-2" style={{ color: '#666' }}>
                No products in inventory. Add products to your inventory first to select them as ingredients.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-2 rounded-lg bg-[#333] text-white hover:bg-[#444] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 rounded-lg bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Menu Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
