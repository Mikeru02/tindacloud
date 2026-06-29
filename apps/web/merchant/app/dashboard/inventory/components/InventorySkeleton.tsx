import React from 'react';

export default function InventorySkeleton() {
  return (
    <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden">
      <div className="p-4 border-b border-[#333] flex gap-4">
        <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
        <div className="h-4 w-20 bg-[#333] rounded animate-pulse"></div>
        <div className="h-4 w-16 bg-[#333] rounded animate-pulse"></div>
        <div className="h-4 w-20 bg-[#333] rounded animate-pulse"></div>
        <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
        <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 border-b border-[#333] flex gap-4">
          <div className="h-4 w-32 bg-[#333] rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-[#333] rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-[#333] rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-[#333] rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-[#333] rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-[#333] rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
