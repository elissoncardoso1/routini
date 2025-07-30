import React from 'react';

// Loading Spinner Básico
export const LoadingSpinner = ({ size = 'md', color = 'primary' }: { size?: 'sm' | 'md' | 'lg'; color?: 'primary' | 'green' | 'red' | 'gray' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'border-primary-500',
    green: 'border-green-500',
    red: 'border-red-500',
    gray: 'border-gray-500'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-200 ${sizeClasses[size]} ${colorClasses[color]} border-t-transparent`} />
  );
};

// Loading com Texto
export const LoadingWithText = ({ text = 'Carregando...', size = 'md' }: { text?: string; size?: 'sm' | 'md' | 'lg' }) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <LoadingSpinner size={size} />
      <span className="text-gray-600">{text}</span>
    </div>
  );
};

// Loading Skeleton para Cards
export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton para Lista
export const ListSkeleton = ({ items = 3 }: { items?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-16 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Loading Skeleton para Tabela
export const TableSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Loading Skeleton para Formulário
export const FormSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="space-y-6">
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/5 mb-2"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
        <div className="flex space-x-3 pt-4">
          <div className="h-10 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

// Loading Overlay
export const LoadingOverlay = ({ 
  isVisible, 
  text = 'Carregando...',
  backdrop = true 
}: { 
  isVisible: boolean; 
  text?: string; 
  backdrop?: boolean;
}) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${backdrop ? 'bg-black bg-opacity-50' : ''}`}>
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  );
};

// Loading Progress
export const LoadingProgress = ({ 
  progress, 
  text = 'Carregando...',
  showPercentage = true 
}: { 
  progress: number; 
  text?: string; 
  showPercentage?: boolean;
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{text}</span>
        {showPercentage && (
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Loading com Dots
export const LoadingDots = ({ text = 'Carregando' }: { text?: string }) => {
  return (
    <div className="flex items-center space-x-1">
      <span className="text-gray-600">{text}</span>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

// Loading com Pulse
export const LoadingPulse = ({ text = 'Carregando...' }: { text?: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 bg-primary-500 rounded-full animate-pulse"></div>
      <span className="text-gray-600">{text}</span>
    </div>
  );
}; 