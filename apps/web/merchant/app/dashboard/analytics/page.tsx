'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';

interface AnalyticsData {
  revenue: {
    revenue: number;
    percentageChange: string;
  };
  averageOrderValue: {
    averageOrderValue: number;
    percentageChange: string;
  };
  conversionRate: {
    conversionRate: number;
    percentageChange: string;
  };
  dailySales: Record<string, number>;
  salesByCategory: Array<{
    category: string;
    amount: number;
    percentage: string;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toFixed(2);
};

const sanitizeCategoryName = (category: string | null | undefined): string => {
  if (!category) return '';
  // Replace hyphens with spaces and convert to title case
  return category
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await apiClient.get('/analytics');
        setAnalytics(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8" style={{ color: '#22c55e' }}>
          Analytics
        </h1>
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8" style={{ color: '#22c55e' }}>
        Analytics
      </h1>

      {loading ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333]">
                <div className="h-5 sm:h-6 w-28 sm:w-32 bg-[#333] rounded animate-pulse mb-2"></div>
                <div className="h-8 sm:h-10 w-20 sm:w-24 bg-[#333] rounded animate-pulse mb-2"></div>
                <div className="h-3 sm:h-4 w-36 sm:w-40 bg-[#333] rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          <div className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333] mb-6 sm:mb-6">
            <div className="h-6 sm:h-7 w-40 sm:w-48 bg-[#333] rounded animate-pulse mb-4"></div>
            <div className="h-48 sm:h-64 bg-[#333] rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333]">
              <div className="h-6 sm:h-7 w-36 sm:w-40 bg-[#333] rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-3 sm:h-4 w-28 sm:w-32 bg-[#333] rounded animate-pulse"></div>
                      <div className="h-3 sm:h-4 w-14 sm:w-16 bg-[#333] rounded animate-pulse"></div>
                    </div>
                    <div className="h-2 w-full bg-[#333] rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333]">
              <div className="h-6 sm:h-7 w-28 sm:w-32 bg-[#333] rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-[#333]">
                    <div className="flex-1">
                      <div className="h-4 sm:h-5 w-20 sm:w-24 bg-[#333] rounded animate-pulse mb-2"></div>
                      <div className="h-3 sm:h-4 w-14 sm:w-16 bg-[#333] rounded animate-pulse"></div>
                    </div>
                    <div className="h-4 sm:h-5 w-14 sm:w-16 bg-[#333] rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333]">
              <h3 className="text-base sm:text-lg font-medium mb-2" style={{ color: '#9ca3af' }}>
                Revenue This Month
              </h3>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#22c55e' }}>
                ₱{formatNumber(analytics.revenue.revenue)}
              </p>
              <p className={`text-xs sm:text-sm mt-2 ${parseFloat(analytics.revenue.percentageChange) >= 0 ? 'text-[#16a34a]' : 'text-[#ef4444]'}`}>
                {parseFloat(analytics.revenue.percentageChange) >= 0 ? '+' : ''}{analytics.revenue.percentageChange}% from last month
              </p>
            </div>

            <div className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333]">
              <h3 className="text-base sm:text-lg font-medium mb-2" style={{ color: '#9ca3af' }}>
                Average Order Value
              </h3>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#22c55e' }}>
                ₱{formatNumber(analytics.averageOrderValue.averageOrderValue)}
              </p>
              <p className={`text-xs sm:text-sm mt-2 ${parseFloat(analytics.averageOrderValue.percentageChange) >= 0 ? 'text-[#16a34a]' : 'text-[#ef4444]'}`}>
                {parseFloat(analytics.averageOrderValue.percentageChange) >= 0 ? '+' : ''}{analytics.averageOrderValue.percentageChange}% from last month
              </p>
            </div>

            <div className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333]">
              <h3 className="text-base sm:text-lg font-medium mb-2" style={{ color: '#9ca3af' }}>
                Conversion Rate
              </h3>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#22c55e' }}>
                {analytics.conversionRate.conversionRate}
              </p>
              <p className={`text-xs sm:text-sm mt-2 ${parseFloat(analytics.conversionRate.percentageChange) >= 0 ? 'text-[#16a34a]' : 'text-[#ef4444]'}`}>
                {parseFloat(analytics.conversionRate.percentageChange) >= 0 ? '+' : ''}{analytics.conversionRate.percentageChange}% from last month
              </p>
            </div>
          </div>

          <div className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333] mb-6 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
              Sales - Last 7 Days
            </h3>
            <div className="h-48 sm:h-64 responsive-table">
              <svg viewBox="0 0 800 250" className="w-full h-full">
                {/* Grid lines */}
                {[0, 50, 100, 150, 200].map((y) => (
                  <line
                    key={y}
                    x1="50"
                    y1={y + 25}
                    x2="750"
                    y2={y + 25}
                    stroke="#333"
                    strokeWidth="1"
                  />
                ))}

                {/* Y-axis labels */}
                {[0, 50, 100, 150, 200].map((value, index) => (
                  <text
                    key={value}
                    x="40"
                    y={value + 30}
                    textAnchor="end"
                    fill="#9ca3af"
                    fontSize="12"
                  >
                    ₱{200 - value * 2}
                  </text>
                ))}

                {/* X-axis labels */}
                {Object.keys(analytics.dailySales).map((date, index) => {
                  const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                  return (
                    <text
                      key={date}
                      x={80 + index * 100}
                      y="240"
                      textAnchor="middle"
                      fill="#9ca3af"
                      fontSize="12"
                    >
                      {dayName}
                    </text>
                  );
                })}

                {/* Line chart */}
                {Object.values(analytics.dailySales).length > 0 && (() => {
                  const values = Object.values(analytics.dailySales);
                  const maxValue = Math.max(...values, 1);
                  const points = values.map((value, index) => {
                    const x = 80 + index * 100;
                    const y = 225 - (value / maxValue) * 200;
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <polyline
                      points={points}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                })()}

                {/* Data points */}
                {Object.entries(analytics.dailySales).map(([date, value], index) => {
                  const maxValue = Math.max(...Object.values(analytics.dailySales), 1);
                  const x = 80 + index * 100;
                  const y = 225 - (value / maxValue) * 200;
                  return (
                    <circle
                      key={date}
                      cx={x}
                      cy={y}
                      r="6"
                      fill="#22c55e"
                      className="hover:r-8 transition-all cursor-pointer"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333]">
              <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
                Sales by Category
              </h3>
              <div className="space-y-4">
                {analytics.salesByCategory.length > 0 ? (
                  analytics.salesByCategory.map((item) => (
                    <div key={item.category}>
                      <div className="flex justify-between mb-2 text-sm sm:text-base">
                        <span style={{ color: '#9ca3af' }}>{sanitizeCategoryName(item.category)}</span>
                        <span style={{ color: '#22c55e' }}>₱{formatNumber(item.amount)}</span>
                      </div>
                      <div className="w-full bg-[#333] rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: '#22c55e'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#666' }}>No sales data available</p>
                )}
              </div>
            </div>

            <div className="bg-[#222] rounded-xl p-4 sm:p-6 border border-[#333]">
              <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
                Top Products
              </h3>
              <div className="space-y-4">
                {analytics.topProducts.length > 0 ? (
                  analytics.topProducts.map((product) => (
                    <div key={product.name} className="flex items-center justify-between py-3 border-b border-[#333] last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate" style={{ color: '#22c55e' }}>{product.name}</p>
                        <p className="text-xs sm:text-sm" style={{ color: '#9ca3af' }}>{product.sales} sold</p>
                      </div>
                      <p className="font-medium text-sm sm:text-base ml-2" style={{ color: '#22c55e' }}>₱{formatNumber(product.revenue)}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#666' }}>No product data available</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
