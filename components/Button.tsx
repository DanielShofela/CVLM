import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-lg";
  
  const variants = {
    primary: "bg-gradient-to-r from-electric-600 to-electric-500 text-white shadow-electric-500/30 hover:shadow-electric-500/50",
    secondary: "bg-white text-slate-800 border border-slate-100 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 shadow-none hover:bg-slate-100/50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};