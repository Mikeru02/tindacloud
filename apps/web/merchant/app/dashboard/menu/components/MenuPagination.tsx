'use client';

import React from 'react';
import { PaginatedMenuResponse } from '../types';

interface MenuPaginationProps {
  pagination: PaginatedMenuResponse;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function MenuPagination({
  pagination,
  currentPage,
  itemsPerPage,
  onPageChange,
}: MenuPaginationProps) {
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm" style={{ color: '#9ca3af' }}>
        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} menu items
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-[#222] border border-[#333] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#333] transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === pagination.totalPages}
          className="px-4 py-2 rounded-lg bg-[#222] border border-[#333] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#333] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
