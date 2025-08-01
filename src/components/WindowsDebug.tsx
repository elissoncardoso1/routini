import React, { useEffect, useState } from 'react';
import { initializeWindowsDebug, WindowsDebugger } from '../utils/windowsDebug';

interface WindowsDebugProps {
  children: React.ReactNode;
}

interface DebugInfo {
  isWindows: boolean;
  devicePixelRatio: number;
  screenInfo: {
    width: number;
    height: number;
    availWidth: number;
    availHeight: number;
    devicePixelRatio: number;
    innerWidth: number;
    innerHeight: number;
    clientWidth: number;
    clientHeight: number;
  };
  dpiIssues: string[];
  renderingIssues: string[];
  userAgent: string;
  platform: string;
  language: string;
}

export function WindowsDebug({ children }: WindowsDebugProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  useEffect(() => {
    // Inicializar debug do Windows
    try {
      initializeWindowsDebug();
      
      // Aguardar um pouco para garantir que tudo carregou
      const timer = setTimeout(() => {
        const debuggerInstance = WindowsDebugger.getInstance();
        const info = debuggerInstance.generateReport();
        setDebugInfo(info);
        
        // Verificar se há problemas críticos
        const renderingIssues = debuggerInstance.detectRenderingIssues();
        
        if (renderingIssues.length > 0) {
          setError(`Problemas de renderização detectados: ${renderingIssues.join(', ')}`);
        } else {
          setIsLoaded(true);
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    } catch (err) {
      console.error('❌ Erro ao inicializar debug do Windows:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  }, []);

  // Se há erro, mostrar tela de erro
  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Problema Detectado no Windows
            </h2>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            
            {/* Informações de debug */}
            {debugInfo && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
                <h3 className="font-semibold mb-2">Informações de Debug:</h3>
                <div className="text-sm space-y-1">
                  <div><strong>DPI:</strong> {debugInfo.devicePixelRatio}x</div>
                  <div><strong>Resolução:</strong> {debugInfo.screenInfo.width}x{debugInfo.screenInfo.height}</div>
                  <div><strong>Viewport:</strong> {debugInfo.screenInfo.innerWidth}x{debugInfo.screenInfo.innerHeight}</div>
                  {debugInfo.dpiIssues.length > 0 && (
                    <div><strong>Problemas DPI:</strong> {debugInfo.dpiIssues.join(', ')}</div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-6 space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Recarregar
              </button>
              <button
                onClick={() => {
                  const debuggerInstance = WindowsDebugger.getInstance();
                  debuggerInstance.applyWindowsFixes();
                  window.location.reload();
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Aplicar Correções
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se ainda está carregando
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Carregando Routini...
          </h2>
          <p className="text-gray-600">
            Verificando compatibilidade com Windows
          </p>
          
          {/* Informações de debug durante carregamento */}
          {debugInfo && (
            <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
              <div>DPI: {debugInfo.devicePixelRatio}x</div>
              <div>Resolução: {debugInfo.screenInfo.width}x{debugInfo.screenInfo.height}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Se tudo está OK, renderizar normalmente
  return <>{children}</>;
} 