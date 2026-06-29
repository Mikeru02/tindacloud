'use client';

import React from 'react';

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function Checkbox({ id, label, checked, onChange, className = '' }: CheckboxProps) {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 rounded border-gray-600 bg-[#1a1a1a] text-[#22c55e] accent-[#22c55e] focus:ring-[#22c55e] focus:ring-offset-0 focus:ring-offset-[#222] cursor-pointer transition-colors duration-200"
        />
      </div>
      <div className="ml-3 text-sm">
        <label
          htmlFor={id}
          className="font-medium cursor-pointer transition-colors duration-200"
          style={{ color: '#9ca3af' }}
        >
          {label}
        </label>
      </div>
    </div>
  );
}
