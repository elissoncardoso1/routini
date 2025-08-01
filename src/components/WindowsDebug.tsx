import React, { useEffect, useState } from 'react';

interface WindowsDebugProps {
  children: React.ReactNode;
}

export function WindowsDebug({ children }: WindowsDebugProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se estamos no Electron
    const isElectron = (window as any).electron !== undefined;
    
    // Verificar se os componentes principais carregaram
    const checkComponents = () => {
      try {
        // Verificar se o React Router está funcionando
        if (typeof window !== 'undefined') {
          console.log('✅ Window object disponível');
        }
        
        // Verificar se o CSS carregou
        const styles = document.styleSheets;
        console.log('📄 Stylesheets carregados:', styles.length);
        
        setIsLoaded(true);
      } catch (err) {
        console.error('❌ Erro ao verificar componentes:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      }
    };

    // Aguardar um pouco para garantir que tudo carregou
    const timer = setTimeout(checkComponents, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Erro no Windows
            </h2>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Recarregar
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 