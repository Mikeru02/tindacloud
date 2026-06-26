import React from 'react';

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8" style={{ color: '#22c55e' }}>
        Analytics
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
          <h3 className="text-lg font-medium mb-2" style={{ color: '#9ca3af' }}>
            Revenue This Month
          </h3>
          <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>
            $24,580
          </p>
          <p className="text-sm mt-2" style={{ color: '#16a34a' }}>
            +18.2% from last month
          </p>
        </div>
        
        <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
          <h3 className="text-lg font-medium mb-2" style={{ color: '#9ca3af' }}>
            Average Order Value
          </h3>
          <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>
            $89.50
          </p>
          <p className="text-sm mt-2" style={{ color: '#16a34a' }}>
            +5.4% from last month
          </p>
        </div>
        
        <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
          <h3 className="text-lg font-medium mb-2" style={{ color: '#9ca3af' }}>
            Conversion Rate
          </h3>
          <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>
            3.2%
          </p>
          <p className="text-sm mt-2" style={{ color: '#ef4444' }}>
            -0.8% from last month
          </p>
        </div>
      </div>
      
      <div className="bg-[#222] rounded-xl p-6 border border-[#333] mb-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
          Sales - Last 7 Days
        </h3>
        <div className="h-64">
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
                ${200 - value * 2}
              </text>
            ))}
            
            {/* X-axis labels */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <text
                key={day}
                x={80 + index * 100}
                y="240"
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="12"
              >
                {day}
              </text>
            ))}
            
            {/* Line chart */}
            <polyline
              points="80,150 180,100 280,120 380,80 480,60 580,90 680,50"
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {[
              { x: 80, y: 150, value: '$100' },
              { x: 180, y: 100, value: '$200' },
              { x: 280, y: 120, value: '$160' },
              { x: 380, y: 80, value: '$240' },
              { x: 480, y: 60, value: '$280' },
              { x: 580, y: 90, value: '$220' },
              { x: 680, y: 50, value: '$300' },
            ].map((point) => (
              <circle
                key={point.x}
                cx={point.x}
                cy={point.y}
                r="6"
                fill="#22c55e"
                className="hover:r-8 transition-all cursor-pointer"
              />
            ))}
          </svg>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
            Sales by Category
          </h3>
          <div className="space-y-4">
            {[
              { category: 'Electronics', percentage: 35, amount: '$8,603' },
              { category: 'Clothing', percentage: 28, amount: '$6,882' },
              { category: 'Home & Garden', percentage: 20, amount: '$4,916' },
              { category: 'Sports', percentage: 12, amount: '$2,950' },
              { category: 'Other', percentage: 5, amount: '$1,229' },
            ].map((item) => (
              <div key={item.category}>
                <div className="flex justify-between mb-2">
                  <span style={{ color: '#9ca3af' }}>{item.category}</span>
                  <span style={{ color: '#22c55e' }}>{item.amount}</span>
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
            ))}
          </div>
        </div>
        
        <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
            Top Products
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Product A', sales: 234, revenue: '$7,017' },
              { name: 'Product B', sales: 189, revenue: '$9,445' },
              { name: 'Product C', sales: 156, revenue: '$3,119' },
              { name: 'Product D', sales: 134, revenue: '$5,359' },
              { name: 'Product E', sales: 98, revenue: '$5,878' },
            ].map((product) => (
              <div key={product.name} className="flex items-center justify-between py-3 border-b border-[#333] last:border-0">
                <div>
                  <p className="font-medium" style={{ color: '#22c55e' }}>{product.name}</p>
                  <p className="text-sm" style={{ color: '#9ca3af' }}>{product.sales} sold</p>
                </div>
                <p className="font-medium" style={{ color: '#22c55e' }}>{product.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
