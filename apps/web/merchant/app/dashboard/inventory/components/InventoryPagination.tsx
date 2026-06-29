import React from 'react';
import { PaginatedResponse } from '../types';

interface InventoryPaginationProps {
  pagination: PaginatedResponse;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (newPage: number) => void;
}

export default function InventoryPagination({
  pagination,
  currentPage,
  itemsPerPage,
  onPageChange,
}: InventoryPaginationProps) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-xs sm:text-sm text-center sm:text-left" style={{ color: '#9ca3af' }}>
        <span className="font-medium">Page {currentPage} of {pagination.totalPages}</span>
        <span className="mx-2">•</span>
        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} products
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 sm:px-4 py-2 rounded-lg border border-[#333] bg-[#222] text-[#9ca3af] hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
        >
          Previous
        </button>
        {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
          let pageNum;
          if (pagination.totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= pagination.totalPages - 2) {
            pageNum = pagination.totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 sm:px-4 py-2 rounded-lg border transition-colors text-xs sm:text-sm ${
                currentPage === pageNum
                  ? 'bg-[#22c55e] text-[#1a1a1a] border-[#22c55e]'
                  : 'bg-[#222] text-[#9ca3af] border-[#333] hover:bg-[#333]'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === pagination.totalPages}
          className="px-3 sm:px-4 py-2 rounded-lg border border-[#333] bg-[#222] text-[#9ca3af] hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}
