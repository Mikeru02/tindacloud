import React from 'react';
import { Product } from '../types';

interface ProductSalesData {
  productId: number;
  totalSold: number;
  totalRevenue: number;
  dailySalesVelocity: number;
}

interface BuySuggestion {
  product: Product;
  suggestedQuantity: number;
  totalCost: number;
  dailySalesVelocity: number;
  daysOfStock: number;
}

interface BuySuggestionsDialogProps {
  show: boolean;
  products: Product[];
  productSalesData: ProductSalesData[];
  onConfirm: () => void;
  onCancel: () => void;
}

export default function BuySuggestionsDialog({
  show,
  products,
  productSalesData,
  onConfirm,
  onCancel,
}: BuySuggestionsDialogProps) {
  if (!show) return null;

  // Calculate buy suggestions for products below their low stock threshold
  const suggestions: BuySuggestion[] = products
    .filter(product => product.stock < product.low_stock_threshold)
    .map(product => {
      const salesData = productSalesData.find(s => s.productId === product.id);
      const dailySalesVelocity = salesData?.dailySalesVelocity || 0;
      
      // Calculate days of stock remaining at current sales velocity
      const daysOfStock = dailySalesVelocity > 0 ? product.stock / dailySalesVelocity : Infinity;
      
      // Calculate suggested quantity based on sales velocity
      // If product sells fast (less than 7 days of stock), buy for 30 days
      // If product sells moderately (7-14 days of stock), buy for 21 days
      // Otherwise, buy to reach 2x threshold
      let suggestedQuantity;
      if (dailySalesVelocity > 0 && daysOfStock < 7) {
        // Fast selling: buy enough for 30 days
        suggestedQuantity = Math.ceil((dailySalesVelocity * 30) - product.stock);
      } else if (dailySalesVelocity > 0 && daysOfStock < 14) {
        // Moderate selling: buy enough for 21 days
        suggestedQuantity = Math.ceil((dailySalesVelocity * 21) - product.stock);
      } else {
        // Slow selling or no sales data: use threshold-based calculation
        suggestedQuantity = (product.low_stock_threshold * 2) - product.stock;
      }
      
      // Ensure minimum suggested quantity of at least the threshold
      suggestedQuantity = Math.max(suggestedQuantity, product.low_stock_threshold - product.stock);
      
      const totalCost = suggestedQuantity * Number(product.cost);
      
      return {
        product,
        suggestedQuantity,
        totalCost,
        dailySalesVelocity,
        daysOfStock: Math.round(daysOfStock * 10) / 10, // Round to 1 decimal
      };
    })
    .sort((a, b) => b.totalCost - a.totalCost);

  const grandTotal = suggestions.reduce((sum, s) => sum + s.totalCost, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#222] rounded-xl border border-[#333] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#333]">
          <h2 className="text-2xl font-bold" style={{ color: '#22c55e' }}>
            Buy Suggestions
          </h2>
          <p className="mt-2" style={{ color: '#666' }}>
            Based on your current inventory levels, here are suggested purchases to restock items below their low stock threshold.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {suggestions.length === 0 ? (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-4"
                style={{ color: '#22c55e' }}
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#9ca3af' }}>
                All stocks are healthy!
              </h3>
              <p style={{ color: '#666' }}>
                No products are currently below their low stock threshold.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-[#1a1a1a] rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span style={{ color: '#9ca3af' }}>Estimated Total Cost:</span>
                  <span className="text-2xl font-bold" style={{ color: '#22c55e' }}>
                    ₱{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {suggestions.map(({ product, suggestedQuantity, totalCost, dailySalesVelocity, daysOfStock }) => (
                  <div
                    key={product.id}
                    className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333] hover:border-[#22c55e] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover border border-[#333]"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-[#333] border border-[#333] flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ color: '#666' }}
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg" style={{ color: '#22c55e' }}>
                          {product.name}
                        </h3>
                        <p className="text-sm" style={{ color: '#9ca3af' }}>
                          SKU: {product.sku}
                        </p>
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span style={{ color: '#666' }}>Current Stock:</span>
                            <span className="ml-2 font-medium" style={{ color: '#ef4444' }}>
                              {product.stock}
                            </span>
                          </div>
                          <div>
                            <span style={{ color: '#666' }}>Threshold:</span>
                            <span className="ml-2 font-medium" style={{ color: '#9ca3af' }}>
                              {product.low_stock_threshold}
                            </span>
                          </div>
                          <div>
                            <span style={{ color: '#666' }}>Daily Sales:</span>
                            <span className="ml-2 font-medium" style={{ color: '#22c55e' }}>
                              {dailySalesVelocity.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span style={{ color: '#666' }}>Days of Stock:</span>
                            <span className="ml-2 font-medium" style={{ color: daysOfStock < 7 ? '#ef4444' : '#22c55e' }}>
                              {daysOfStock === Infinity ? 'N/A' : daysOfStock}
                            </span>
                          </div>
                          <div>
                            <span style={{ color: '#666' }}>Suggested Buy:</span>
                            <span className="ml-2 font-medium" style={{ color: '#22c55e' }}>
                              {suggestedQuantity}
                            </span>
                          </div>
                          <div>
                            <span style={{ color: '#666' }}>Cost:</span>
                            <span className="ml-2 font-medium" style={{ color: '#22c55e' }}>
                              ₱{totalCost.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-6 border-t border-[#333] flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-lg font-medium border border-[#333] bg-[#222] text-[#9ca3af] hover:bg-[#333] transition-colors"
          >
            Close
          </button>
          {suggestions.length > 0 && (
            <button
              onClick={onConfirm}
              className="px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors"
            >
              Download List
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
