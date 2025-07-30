import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LogoLoading } from './components/LogoLoading';
// Lazy loading dos componentes principais
const Calendar = lazy(() => import('./components/Calendar').then(module => ({ default: module.Calendar })))
const Dashboard = lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })))
const Cadastro = lazy(() => import('./pages/Cadastro').then(module => ({ default: module.Cadastro })))

// Componente de loading melhorado
const AppLoadingSpinner = () => (
  <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
    <LogoLoading size="lg" text="Carregando Routini..." />
  </div>
)

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<AppLoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Calendar />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cadastro" element={<Cadastro />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
