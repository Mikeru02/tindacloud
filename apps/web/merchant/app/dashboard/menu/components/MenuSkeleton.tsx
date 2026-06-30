'use client';

import React from 'react';

export default function MenuSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-[#222] rounded animate-pulse"></div>
      <div className="h-12 bg-[#222] rounded animate-pulse"></div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-[#222] rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}
