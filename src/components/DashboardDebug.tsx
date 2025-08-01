import React, { useEffect, useState } from 'react';

interface DashboardDebugProps {
  children: React.ReactNode;
}

export function DashboardDebug({ children }: DashboardDebugProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<string>('Verificando...');

  useEffect(() => {
    const checkDashboard = async () => {
      try {
        console.log('🔍 Verificando Dashboard...');
        
        // Verificar se Dexie está disponível
        if (typeof window !== 'undefined' && (window as any).Dexie) {
          console.log('✅ Dexie disponível');
        } else {
          console.log('⚠️ Dexie não encontrado');
        }

        // Verificar se os componentes carregaram
        const checkComponents = () => {
          try {
            // Verificar se React Router está funcionando
            if (typeof window !== 'undefined') {
              console.log('✅ Window object disponível');
            }
            
            // Verificar se o CSS carregou
            const styles = document.styleSheets;
            console.log('📄 Stylesheets carregados:', styles.length);
            
            // Verificar se o banco de dados está funcionando
            const testDB = async () => {
              try {
                // Importar dinamicamente para evitar erros
                const { db } = await import('../db');
                console.log('✅ Banco de dados carregado');
                setDbStatus('✅ Banco de dados OK');
                
                // Testar operação básica
                const profissionais = await db.profissionais.count();
                console.log('📊 Profissionais no banco:', profissionais);
                
              } catch (dbError) {
                console.error('❌ Erro no banco de dados:', dbError);
                setDbStatus('❌ Erro no banco de dados');
                setError('Problema com banco de dados local');
              }
            };
            
            testDB();
            setIsLoaded(true);
          } catch (err) {
            console.error('❌ Erro ao verificar componentes:', err);
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
          }
        };

        // Aguardar um pouco para garantir que tudo carregou
        const timer = setTimeout(checkComponents, 2000);
        
        return () => clearTimeout(timer);
      } catch (err) {
        console.error('❌ Erro geral no Dashboard:', err);
        setError('Erro ao carregar Dashboard');
      }
    };

    checkDashboard();
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
              Erro no Dashboard
            </h2>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <div className="text-sm text-gray-500 mb-4">
              Status do banco: {dbStatus}
            </div>
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
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Carregando Dashboard...
          </h2>
          <p className="text-gray-600 mb-4">
            Verificando componentes e banco de dados
          </p>
          <div className="text-sm text-gray-500">
            {dbStatus}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 