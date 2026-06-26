import React from 'react';

interface AuthFormProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthForm({ title, subtitle, children, footer }: AuthFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-[#222] rounded-2xl p-6 shadow-2xl border border-[#333]">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#22c55e' }}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                {subtitle}
              </p>
            )}
          </div>
          
          {children}
        </div>
        
        {footer && (
          <div className="text-center">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
