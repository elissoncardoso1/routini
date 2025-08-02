import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SimpleFallback } from './components/ErrorFallback';
import { WindowsDebug } from './components/WindowsDebug';
import { DashboardSimple } from './components/DashboardSimple';
import { WindowsTestPanel } from './components/WindowsTestPanel';
// Imports diretos para evitar problemas de lazy loading no Windows
import { Calendar } from './components/Calendar';
import { Cadastro } from './pages/Cadastro';

// Componente de loading melhorado
const AppLoadingSpinner = () => (
  <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Carregando Routini...</p>
    </div>
  </div>
)

export function App() {
  return (
    <ErrorBoundary fallback={<SimpleFallback />}>
      <WindowsDebug>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Calendar />} />
              <Route path="/dashboard" element={<DashboardSimple />} />
              <Route path="/cadastro" element={<Cadastro />} />
            </Routes>
          </Layout>
        </HashRouter>
        <WindowsTestPanel />
      </WindowsDebug>
    </ErrorBoundary>
  );
}

export default App;
