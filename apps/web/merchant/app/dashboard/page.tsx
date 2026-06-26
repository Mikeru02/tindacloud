import React from 'react';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8" style={{ color: '#22c55e' }}>
        Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
          <h3 className="text-lg font-medium mb-2" style={{ color: '#9ca3af' }}>
            Total Sales
          </h3>
          <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>
            $12,450
          </p>
          <p className="text-sm mt-2" style={{ color: '#16a34a' }}>
            +12.5% from last month
          </p>
        </div>
        
        <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
          <h3 className="text-lg font-medium mb-2" style={{ color: '#9ca3af' }}>
            Total Orders
          </h3>
          <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>
            156
          </p>
          <p className="text-sm mt-2" style={{ color: '#16a34a' }}>
            +8.2% from last month
          </p>
        </div>
        
        <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
          <h3 className="text-lg font-medium mb-2" style={{ color: '#9ca3af' }}>
            Total Customers
          </h3>
          <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>
            892
          </p>
          <p className="text-sm mt-2" style={{ color: '#16a34a' }}>
            +5.1% from last month
          </p>
        </div>
        
        <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
          <h3 className="text-lg font-medium mb-2" style={{ color: '#9ca3af' }}>
            Products
          </h3>
          <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>
            48
          </p>
          <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>
            In inventory
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
            Recent Orders
          </h3>
          <div className="space-y-4">
            {[
              { id: '#ORD-001', customer: 'John Doe', amount: '$125.00', status: 'Completed' },
              { id: '#ORD-002', customer: 'Jane Smith', amount: '$89.50', status: 'Processing' },
              { id: '#ORD-003', customer: 'Bob Johnson', amount: '$210.00', status: 'Pending' },
              { id: '#ORD-004', customer: 'Alice Brown', amount: '$45.00', status: 'Completed' },
              { id: '#ORD-005', customer: 'Charlie Wilson', amount: '$156.00', status: 'Processing' },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-[#333] last:border-0">
                <div>
                  <p className="font-medium" style={{ color: '#22c55e' }}>{order.id}</p>
                  <p className="text-sm" style={{ color: '#9ca3af' }}>{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium" style={{ color: '#22c55e' }}>{order.amount}</p>
                  <p className="text-sm" style={{ color: '#9ca3af' }}>{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-[#222] rounded-xl p-6 border border-[#333]">
          <h3 className="text-xl font-bold mb-4" style={{ color: '#22c55e' }}>
            Low Stock Alerts
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Product A', stock: 5, threshold: 10 },
              { name: 'Product B', stock: 8, threshold: 15 },
              { name: 'Product C', stock: 3, threshold: 10 },
              { name: 'Product D', stock: 12, threshold: 20 },
            ].map((product) => (
              <div key={product.name} className="flex items-center justify-between py-3 border-b border-[#333] last:border-0">
                <div>
                  <p className="font-medium" style={{ color: '#22c55e' }}>{product.name}</p>
                  <p className="text-sm" style={{ color: '#9ca3af' }}>
                    Stock: {product.stock} / Threshold: {product.threshold}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-500">
                  Low Stock
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
