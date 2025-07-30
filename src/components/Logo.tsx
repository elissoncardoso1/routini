import React from 'react';
import logo from '../assets/logo.svg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img 
        src={logo} 
        alt="Routini Logo" 
        className={`${sizeClasses[size]} object-contain`}
        onError={(e) => {
          // Fallback para um ícone simples se a logo não carregar
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.className = `${sizeClasses[size]} bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold`;
          fallback.textContent = 'R';
          target.parentNode?.insertBefore(fallback, target);
        }}
      />
      {showText && (
        <span className={`font-bold text-purple-600 ${textSizes[size]}`}>
          Routini
        </span>
      )}
    </div>
  );
}

// Componente apenas com o ícone (sem texto)
export function LogoIcon({ size = 'md', className = '' }: Omit<LogoProps, 'showText'>) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <img 
      src={logo} 
      alt="Routini" 
      className={`${sizeClasses[size]} object-contain ${className}`}
      onError={(e) => {
        // Fallback para um ícone simples se a logo não carregar
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = `${sizeClasses[size]} bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold ${className}`;
        fallback.textContent = 'R';
        target.parentNode?.insertBefore(fallback, target);
      }}
    />
  );
} 