'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import { useStore } from '../store/useStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentStore = useStore((state) => state.currentStore);

  useEffect(() => {
    if (!currentStore) return;

    const userRole = currentStore.role.toLowerCase();

    // Route protection for cashier role - only allow POS
    if (userRole === 'cashier') {
      const allowedRoutes = ['/dashboard/pos'];
      const isAllowed = allowedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
      
      if (!isAllowed) {
        router.push('/dashboard/pos');
      }
    }

    // Route protection for manager role - forbid POS
    if (userRole === 'manager') {
      if (pathname === '/dashboard/pos' || pathname.startsWith('/dashboard/pos/')) {
        router.push('/dashboard');
      }
    }

    // Owner and co-owner have full access - no restrictions
  }, [currentStore, pathname, router]);

  return (
    <div className="flex min-h-screen bg-[#1a1a1a]">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg bg-[#222] border border-[#333] hover:bg-[#333] transition-colors"
          style={{ color: '#22c55e' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <img src="/favicon.ico" alt="TindaCloud" className="w-10 h-10" />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto pt-16 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
