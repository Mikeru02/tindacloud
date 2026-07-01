'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../store/useStore';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const currentStore = useStore((state) => state.currentStore);

  useEffect(() => {
    if (!currentStore) {
      router.push('/');
      return;
    }

    if (!allowedRoles.includes(currentStore.role)) {
      // Redirect to POS if cashier tries to access restricted pages
      if (currentStore.role === 'cashier') {
        router.push('/dashboard/pos');
      } else {
        router.push('/dashboard');
      }
    }
  }, [currentStore, allowedRoles, router]);

  if (!currentStore || !allowedRoles.includes(currentStore.role)) {
    return null;
  }

  return <>{children}</>;
}
