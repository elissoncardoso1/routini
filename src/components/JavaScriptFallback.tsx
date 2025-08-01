import React, { useEffect, useState } from 'react';

export function JavaScriptFallback() {
  const [jsLoaded, setJsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se o React está disponível
    const checkReact = () => {
      try {
        // Verificar se React está carregado
        if (typeof React !== 'undefined') {
          console.log('✅ React carregado');
          setJsLoaded(true);
        } else {
          throw new Error('React não está disponível');
        }
      } catch (err) {
        console.error('❌ Erro ao carregar React:', err);
        setError('JavaScript não carregou corretamente');
      }
    };

    // Aguardar um pouco e verificar
    const timer = setTimeout(checkReact, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              JavaScript Não Carregou
            </h2>
            <p className="text-gray-600 mb-4">
              O aplicativo não conseguiu carregar corretamente. Isso pode ser devido a:
            </p>
            <ul className="text-sm text-gray-600 mb-6 text-left">
              <li>• Bloqueio de scripts pelo sistema</li>
              <li>• Arquivos JavaScript corrompidos</li>
              <li>• Problema de compatibilidade</li>
              <li>• Antivírus bloqueando execução</li>
            </ul>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Tentar Novamente
              </button>
              <button
                onClick={() => {
                  // Tentar carregar manualmente
                  const script = document.createElement('script');
                  script.src = './assets/index-DTqseqlP.js';
                  script.type = 'module';
                  document.head.appendChild(script);
                }}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Carregar JavaScript Manualmente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!jsLoaded) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Carregando JavaScript...
          </h2>
          <p className="text-gray-600 mb-4">
            Aguardando carregamento dos scripts
          </p>
          <div className="text-xs text-gray-500">
            Verificando compatibilidade...
          </div>
        </div>
      </div>
    );
  }

  return null;
} 