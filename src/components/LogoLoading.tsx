import React from 'react';
import { LogoIcon } from './Logo';

interface LogoLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  showText?: boolean;
}

export function LogoLoading({ size = 'md', text = 'Carregando...', showText = true }: LogoLoadingProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <LogoIcon size={size} className="animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${sizeClasses[size]} border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin`}></div>
        </div>
      </div>
      {showText && (
        <p className={`text-gray-600 font-medium ${textSizes[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
}

// Versão compacta para espaços pequenos
export function LogoLoadingCompact({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <LogoIcon size={size} className="animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${sizeClasses[size]} border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin`}></div>
        </div>
      </div>
    </div>
  );
} 