import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]';
  
  const variantStyles = {
    primary: 'bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] focus:ring-[#22c55e]',
    secondary: 'bg-[#333] text-[#22c55e] hover:bg-[#444] focus:ring-[#22c55e]',
    outline: 'border-2 border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-[#1a1a1a] focus:ring-[#22c55e]'
  };

  const disabledStyles = disabled 
    ? 'opacity-40 cursor-not-allowed hover:opacity-40 hover:bg-[#22c55e] hover:text-[#1a1a1a]' 
    : '';

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
