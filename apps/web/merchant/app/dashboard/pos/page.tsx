'use client';

import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../../api/client';
import { useStore } from '../../store/useStore';

interface Product {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
  cost: number;
  wholesale_price?: number;
  wholesale_count?: number;
  image_url?: string;
  category: { id: number; name: string } | null;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface HeldOrder {
  id: string;
  cart: CartItem[];
  timestamp: Date;
}

export default function POSPage() {
  const currentStore = useStore((state) => state.currentStore);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [cashReceived, setCashReceived] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ordersToday, setOrdersToday] = useState<number>(0);
  const [salesToday, setSalesToday] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(new Date());
    fetchProducts();
    fetchDailyStats();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [currentStore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setSearchQuery('');
        setSelectedCategory('All');
      }
      if (e.key === 'F2') {
        e.preventDefault();
        handleCheckout();
      }
      if (e.key === 'F4') {
        e.preventDefault();
        holdOrder();
      }
      if (e.key === 'F6') {
        e.preventDefault();
        if (heldOrders.length > 0) {
          resumeOrder(heldOrders[0].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, heldOrders]);

  const fetchProducts = async () => {
    if (!currentStore?.id) return;
    try {
      const response = await apiClient.get('/products', { params: { merchantId: currentStore.id, limit: 1000 } });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDailyStats = async () => {
    if (!currentStore?.id) return;
    try {
      const response = await apiClient.get('/orders/dashboard/stats', { params: { merchantId: currentStore.id, dateRange: 'today' } });
      setOrdersToday(response.data.totalOrders);
      setSalesToday(response.data.totalSales);
    } catch (error) {
      console.error('Error fetching daily stats:', error);
    }
  };

  const categories: string[] = ['All', ...Array.from(new Set(products.map(p => p.category?.name).filter((name): name is string => Boolean(name))))];

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku === searchQuery);
    const matchesCategory = selectedCategory === 'All' || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevCart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return prevCart;
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCart(prevCart => {
      const item = prevCart.find(item => item.product.id === productId);
      if (!item) return prevCart;
      
      if (quantity <= 0) {
        return prevCart.filter(i => i.product.id !== productId);
      }
      
      if (quantity > item.product.stock) {
        return prevCart;
      }
      
      return prevCart.map(i =>
        i.product.id === productId ? { ...i, quantity } : i
      );
    });
  };

  const holdOrder = () => {
    if (cart.length === 0) return;
    const newHeldOrder: HeldOrder = {
      id: Date.now().toString(),
      cart: [...cart],
      timestamp: new Date(),
    };
    setHeldOrders(prev => [newHeldOrder, ...prev]);
    setCart([]);
  };

  const resumeOrder = (orderId: string) => {
    const orderToResume = heldOrders.find(o => o.id === orderId);
    if (orderToResume) {
      setCart(orderToResume.cart);
      setHeldOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  const getEffectivePrice = (product: Product, quantity: number) => {
    if (product.wholesale_price && product.wholesale_count && quantity >= product.wholesale_count) {
      return Number(product.wholesale_price);
    }
    return Number(product.price);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (getEffectivePrice(item.product, item.quantity) * item.quantity), 0);
  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = cartTotal * (discount / 100);
  const total = cartTotal - discountAmount;
  const change = Number(cashReceived) - total;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: getEffectivePrice(item.product, item.quantity),
        })),
        total_amount: total,
        discount,
      };

      await apiClient.post('/orders', orderData);
      setCart([]);
      setDiscount(0);
      setCashReceived('');
      // alert('Order created successfully!');
      fetchProducts();
      fetchDailyStats();
      searchInputRef.current?.focus();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' };
    if (stock <= 5) return { label: `Only ${stock} left`, color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a]">
      {/* Header */}
      <header className="bg-[#222] border-b border-[#333] px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-[#22c55e]">POS</h1>
            <div className="flex items-center gap-2 hidden sm:flex">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-sm text-[#9ca3af] hidden sm:inline">Store Open</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm hidden md:block">
              <span className="text-[#9ca3af]">Cashier:</span>
              <span className="ml-1 font-medium text-[#22c55e]">John Doe</span>
            </div>
            <div className="text-sm hidden lg:block">
              <span className="text-[#9ca3af]">Orders Today:</span>
              <span className="ml-1 font-medium text-[#22c55e]">{ordersToday}</span>
            </div>
            <div className="text-sm hidden lg:block">
              <span className="text-[#9ca3af]">Sales Today:</span>
              <span className="ml-1 font-medium text-[#22c55e]">₱{salesToday.toFixed(2)}</span>
            </div>
            <div className="text-sm font-medium text-[#22c55e]">
              {isMounted && currentTime ? currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
            </div>
          </div>
        </div>
      </header>

      {/* Quick Actions Toolbar */}
      <div className="bg-[#222] border-b border-[#333] px-4 py-2 relative">
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="px-3 py-1.5 text-sm font-medium text-[#22c55e] bg-[#333] rounded hover:bg-[#444] transition-colors"
          >
            ☰ Menu
          </button>
          
          {/* Mobile Overflow Menu */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#222] border border-[#333] rounded-lg shadow-xl z-50 p-2 space-y-1">
              <button className="w-full text-left px-3 py-2 text-sm font-medium text-[#22c55e] hover:bg-[#333] rounded transition-colors">
                New Customer
              </button>
              <button 
                onClick={() => {
                  holdOrder();
                  setIsMenuOpen(false);
                }}
                disabled={cart.length === 0}
                className="w-full text-left px-3 py-2 text-sm font-medium text-[#22c55e] hover:bg-[#333] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hold Order (F4)
              </button>
              {heldOrders.length > 0 && (
                <button 
                  onClick={() => {
                    resumeOrder(heldOrders[0].id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-[#22c55e] hover:bg-[#333] rounded transition-colors"
                >
                  Resume Order (F6)
                </button>
              )}
              <button className="w-full text-left px-3 py-2 text-sm font-medium text-[#22c55e] hover:bg-[#333] rounded transition-colors">
                Transaction History
              </button>
              <button className="w-full text-left px-3 py-2 text-sm font-medium text-[#22c55e] hover:bg-[#333] rounded transition-colors">
                Refund
              </button>
              <button className="w-full text-left px-3 py-2 text-sm font-medium text-[#22c55e] hover:bg-[#333] rounded transition-colors">
                Reprint Receipt
              </button>
            </div>
          )}
        </div>
        
        {/* Desktop Toolbar */}
        <div className="hidden lg:flex items-center gap-2 overflow-x-auto pb-1">
          <button className="px-3 py-1.5 text-sm font-medium text-[#22c55e] bg-[#333] rounded hover:bg-[#444] transition-colors whitespace-nowrap">
            New Customer
          </button>
          <button 
            onClick={holdOrder}
            disabled={cart.length === 0}
            className="px-3 py-1.5 text-sm font-medium text-[#22c55e] bg-[#333] rounded hover:bg-[#444] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Hold Order (F4)
          </button>
          {heldOrders.length > 0 && (
            <button 
              onClick={() => resumeOrder(heldOrders[0].id)}
              className="px-3 py-1.5 text-sm font-medium text-[#22c55e] bg-[#333] rounded hover:bg-[#444] transition-colors whitespace-nowrap"
            >
              Resume Order (F6)
            </button>
          )}
          <button className="px-3 py-1.5 text-sm font-medium text-[#22c55e] bg-[#333] rounded hover:bg-[#444] transition-colors whitespace-nowrap">
            Transaction History
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-[#22c55e] bg-[#333] rounded hover:bg-[#444] transition-colors whitespace-nowrap">
            Refund
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-[#22c55e] bg-[#333] rounded hover:bg-[#444] transition-colors whitespace-nowrap">
            Reprint Receipt
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Product Catalog - 60% */}
        <div className="flex-1 lg:flex-[3] flex flex-col bg-[#1a1a1a] overflow-hidden">
          {/* Search and Categories */}
          <div className="bg-[#222] border-b border-[#333] p-2 lg:p-4 sticky top-0 z-10">
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search product, SKU, or barcode... (Ctrl+F)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 lg:px-4 lg:py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] text-[#22c55e] text-sm lg:text-base"
                />
              </div>
            </div>
            
            {/* Category Chips */}
            <div className="flex items-center gap-2 mt-2 lg:mt-4 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-2 py-1 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#22c55e] text-[#1a1a1a]'
                      : 'bg-[#333] text-[#22c55e] hover:bg-[#444]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-2 lg:p-6">
            {isLoading ? (
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-[#222] rounded-xl p-2 lg:p-4 border border-[#333]">
                    <div className="aspect-square bg-[#333] rounded-lg mb-2 lg:mb-3 animate-pulse"></div>
                    <div className="h-3 lg:h-4 bg-[#333] rounded mb-1 lg:mb-2 animate-pulse"></div>
                    <div className="h-3 lg:h-4 bg-[#333] rounded w-2/3 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <p className="text-center text-[#9ca3af]">
                  No products found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <div
                      key={product.id}
                      onClick={() => product.stock > 0 && addToCart(product)}
                      className={`bg-[#222] rounded-xl border border-[#333] overflow-hidden cursor-pointer transition-all hover:border-[#22c55e] ${
                        product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="aspect-square bg-[#333] flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        )}
                      </div>
                      <div className="p-2 lg:p-4">
                        <h3 className="font-medium text-[#22c55e] mb-1 truncate text-xs lg:text-base">
                          {product.name}
                        </h3>
                        <p className="text-sm lg:text-2xl font-bold text-[#22c55e] mb-1 lg:mb-2">
                          ₱{Number(product.price).toFixed(2)}
                        </p>
                        {product.wholesale_price && product.wholesale_count && (
                          <p className="text-[10px] lg:text-xs text-[#3b82f6] mb-1 lg:mb-2">
                            ₱{Number(product.wholesale_price).toFixed(2)} each ({product.wholesale_count}+)
                          </p>
                        )}
                        {product.category && (
                          <p className="text-[10px] lg:text-xs text-[#9ca3af] mb-1 lg:mb-2 hidden sm:block">
                            {product.category.name}
                          </p>
                        )}
                        {product.stock <= 5 && (
                          <span className={`inline-block px-1.5 py-0.5 lg:px-2 lg:py-1 text-[10px] lg:text-xs font-medium rounded ${stockStatus.color}`}>
                            {stockStatus.label}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Checkout Panel - 40% */}
        <div className="hidden lg:flex flex-1 lg:flex-[2] flex-col bg-[#222] border-t lg:border-t-0 lg:border-l border-[#333] overflow-hidden h-64 lg:h-auto">
          {/* Cart Header */}
          <div className="p-3 lg:p-4 border-b border-[#333]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg lg:text-xl font-bold text-[#22c55e]">Current Order</h2>
              <span className="text-sm text-[#9ca3af]">
                {cartTotalItems} {cartTotalItems === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-3 lg:p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <p className="text-center text-[#9ca3af]">
                  Cart is empty
                </p>
              </div>
            ) : (
              <div className="space-y-2 lg:space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="border border-[#333] rounded-lg p-3 lg:p-4 bg-[#1a1a1a]">
                    <div className="flex items-start justify-between mb-2 lg:mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-[#22c55e] mb-1 text-sm lg:text-base">
                          {item.product.name}
                        </h4>
                        <p className="text-xs lg:text-sm text-[#9ca3af]">
                          ₱{getEffectivePrice(item.product, item.quantity).toFixed(2)} each
                          {item.product.wholesale_price && item.product.wholesale_count && item.quantity >= item.product.wholesale_count && (
                            <span className="ml-2 text-[#3b82f6] text-[10px]">(wholesale)</span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded bg-[#333] hover:bg-[#444] transition-colors flex items-center justify-center text-[#22c55e] font-medium"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium text-[#22c55e]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-8 h-8 rounded bg-[#333] hover:bg-[#444] transition-colors flex items-center justify-center text-[#22c55e] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-bold text-[#22c55e] text-sm lg:text-base">
                        ₱{(getEffectivePrice(item.product, item.quantity) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Section */}
          <div className="border-t border-[#333] p-3 lg:p-4 space-y-3 lg:space-y-4 bg-[#1a1a1a]">
            {/* Discount */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-[#9ca3af] w-20">Discount:</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                min="0"
                max="100"
                className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] text-[#22c55e] text-sm"
                placeholder="0"
              />
              <span className="text-sm text-[#9ca3af]">%</span>
            </div>

            {/* Summary */}
            <div className="space-y-2 pt-2 border-t border-[#333]">
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#9ca3af]">Discount ({discount}%)</span>
                  <span className="text-red-500">-₱{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#333]">
                <span className="text-[#22c55e]">TOTAL</span>
                <span className="text-[#22c55e]">₱{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Cash Received */}
            <div className="space-y-2">
              <label className="text-sm text-[#9ca3af]">Cash Received</label>
              <input
                type="number"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                className="w-full px-3 py-2 lg:px-4 lg:py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] text-[#22c55e] text-base lg:text-lg font-medium"
                placeholder="Enter amount..."
              />
              {cashReceived && Number(cashReceived) >= total && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#9ca3af]">Change</span>
                  <span className="font-bold text-[#22c55e]">₱{change.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Payment Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setCashReceived(total.toFixed(2))}
                className="py-2 lg:py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#22c55e]/90 transition-colors text-sm lg:text-base"
              >
                CASH
              </button>
              <button
                className="py-2 lg:py-3 rounded-lg font-medium bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition-colors text-sm lg:text-base"
              >
                CARD
              </button>
              <button
                className="py-2 lg:py-3 rounded-lg font-medium bg-[#3b82f6] text-white hover:bg-[#3b82f6]/90 transition-colors text-sm lg:text-base"
              >
                GCASH
              </button>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || isProcessing}
              className="w-full py-3 lg:py-4 rounded-lg font-bold text-base lg:text-lg bg-[#22c55e] text-[#1a1a1a] hover:bg-[#22c55e]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Checkout (F2)'}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Cart Button - Mobile */}
      {cart.length > 0 && (
        <button
          onClick={() => setIsMobileCartOpen(true)}
          className="lg:hidden fixed bottom-4 right-4 bg-[#22c55e] text-[#1a1a1a] rounded-full shadow-lg px-4 py-3 flex items-center gap-2 z-40 hover:bg-[#22c55e]/90 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span className="font-medium">{cartTotalItems}</span>
          <span className="font-bold">• ₱{total.toFixed(2)}</span>
        </button>
      )}

      {/* Mobile Cart Bottom Sheet */}
      {isMobileCartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileCartOpen(false)}
          />
          
          {/* Bottom Sheet */}
          <div className="relative bg-[#222] w-full max-h-[85vh] rounded-t-2xl flex flex-col shadow-2xl">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-[#444] rounded-full" />
            </div>
            
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#333] flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#22c55e]">Current Order</h2>
              <button
                onClick={() => setIsMobileCartOpen(false)}
                className="text-[#9ca3af] hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <p className="text-center text-[#9ca3af]">
                    Cart is empty
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="border border-[#333] rounded-lg p-3 bg-[#1a1a1a]">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-[#22c55e] mb-1 text-sm">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-[#9ca3af]">
                            ₱{getEffectivePrice(item.product, item.quantity).toFixed(2)} each
                            {item.product.wholesale_price && item.product.wholesale_count && item.quantity >= item.product.wholesale_count && (
                              <span className="ml-2 text-[#3b82f6] text-[10px]">(wholesale)</span>
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded bg-[#333] hover:bg-[#444] transition-colors flex items-center justify-center text-[#22c55e] font-medium"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium text-[#22c55e]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-8 h-8 rounded bg-[#333] hover:bg-[#444] transition-colors flex items-center justify-center text-[#22c55e] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-bold text-[#22c55e] text-sm">
                          ₱{(getEffectivePrice(item.product, item.quantity) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Checkout Section */}
            <div className="border-t border-[#333] p-4 space-y-3 bg-[#1a1a1a]">
              {/* Discount */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-[#9ca3af] w-20">Discount:</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  min="0"
                  max="100"
                  className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] text-[#22c55e] text-sm"
                  placeholder="0"
                />
                <span className="text-sm text-[#9ca3af]">%</span>
              </div>

              {/* Summary */}
              <div className="space-y-2 pt-2 border-t border-[#333]">
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9ca3af]">Discount ({discount}%)</span>
                    <span className="text-red-500">-₱{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#333]">
                  <span className="text-[#22c55e]">TOTAL</span>
                  <span className="text-[#22c55e]">₱{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Cash Received */}
              <div className="space-y-2">
                <label className="text-sm text-[#9ca3af]">Cash Received</label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="w-full px-3 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] text-[#22c55e] text-lg font-medium"
                  placeholder="Enter amount..."
                />
                {cashReceived && Number(cashReceived) >= total && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9ca3af]">Change</span>
                    <span className="font-bold text-[#22c55e]">₱{change.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Payment Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setCashReceived(total.toFixed(2))}
                  className="py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#22c55e]/90 transition-colors text-sm"
                >
                  CASH
                </button>
                <button
                  className="py-3 rounded-lg font-medium bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition-colors text-sm"
                >
                  CARD
                </button>
                <button
                  className="py-3 rounded-lg font-medium bg-[#3b82f6] text-white hover:bg-[#3b82f6]/90 transition-colors text-sm"
                >
                  GCASH
                </button>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || isProcessing}
                className="w-full py-4 rounded-lg font-bold text-lg bg-[#22c55e] text-[#1a1a1a] hover:bg-[#22c55e]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Summary - Desktop */}
      {cart.length > 0 && (
        <div className="hidden lg:block fixed bottom-6 left-6 bg-[#222] rounded-lg shadow-lg px-4 py-3 border border-[#333]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9ca3af]">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="text-sm text-[#9ca3af]">{cartTotalItems} items</span>
            </div>
            <div className="text-lg font-bold text-[#22c55e]">
              ₱{total.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
