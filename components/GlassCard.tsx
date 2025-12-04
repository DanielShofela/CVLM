import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-glass-surface backdrop-blur-xl border border-glass-border shadow-glass rounded-2xl p-5 ${onClick ? 'cursor-pointer active:scale-95 transition-transform duration-200' : ''} ${className}`}
    >
      {children}
    </div>
  );
};