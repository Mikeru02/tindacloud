'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../api/client';
import Input from '../../../components/Input';
import { useStore } from '../../../store/useStore';

export default function AddProductPage() {
  const router = useRouter();
  const { currentStore } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

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

    if (!currentStore) {
      setError('No store selected. Please select a store first.');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('sku', formData.sku);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('cost', formData.cost);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('low_stock_threshold', formData.low_stock_threshold);
      formDataToSend.append('status', formData.status);

      if (formData.wholesale_price) {
        formDataToSend.append('wholesale_price', formData.wholesale_price);
      }
      if (formData.wholesale_count) {
        formDataToSend.append('wholesale_count', formData.wholesale_count);
      }
      if (formData.category_id) {
        formDataToSend.append('category_id', formData.category_id);
      }
      if (formData.category_name) {
        formDataToSend.append('category_name', normalizeCategoryName(formData.category_name));
      }
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await apiClient.post('/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          merchantId: currentStore.id,
        },
      });
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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setVideoStream(stream);
      setShowCamera(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    
    // Check if video has valid dimensions and is ready
    if (video.videoWidth > 0 && video.videoHeight > 0 && video.readyState >= 2) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            setImageFile(file);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            setImagePreview(dataUrl);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  // Attach stream to video element when both are available
  useEffect(() => {
    if (showCamera && videoStream && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = videoStream;
      
      const playVideo = async () => {
        try {
          await video.play();
        } catch (err) {
          console.error('Error playing video:', err);
        }
      };
      
      playVideo();
    }
  }, [showCamera, videoStream]);

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);

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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: '#22c55e' }}>
              Product Image (Optional)
            </label>
            {showCamera ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  onLoadedMetadata={() => videoRef.current?.play()}
                  className="w-64 h-64 object-cover rounded-lg border-2 border-[#333] mx-auto"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="bg-[#22c55e] text-white px-4 py-2 rounded-lg hover:bg-[#16a34a] transition-colors"
                  >
                    Capture
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-64 h-64 object-cover rounded-lg border-2 border-[#333] mx-auto"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-[#333] rounded-lg p-6 text-center hover:border-[#22c55e] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mx-auto mb-2"
                      style={{ color: '#666' }}
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <p style={{ color: '#666' }}>Upload from device</p>
                    <p className="text-xs mt-1" style={{ color: '#444' }}>
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={startCamera}
                  className="border-2 border-dashed border-[#333] rounded-lg p-6 text-center hover:border-[#22c55e] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-2"
                    style={{ color: '#666' }}
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                  <p style={{ color: '#666' }}>Take photo with camera</p>
                </button>
              </div>
            )}
          </div>

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
