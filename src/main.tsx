import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'

// Função para renderizar com fallback
function renderApp() {
  try {
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      console.error('❌ Elemento root não encontrado');
      return;
    }

    console.log('✅ Elemento root encontrado, renderizando app...');
    
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('✅ App renderizado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao renderizar app:', error);
    
    // Fallback básico se React falhar
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        ">
          <div style="
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
          ">
            <h2 style="color: #1f2937; margin-bottom: 1rem;">Routini</h2>
            <p style="color: #6b7280; margin-bottom: 1rem;">
              Erro ao carregar a aplicação. Verifique se o JavaScript está habilitado.
            </p>
            <button onclick="window.location.reload()" style="
              background: #3b82f6;
              color: white;
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 0.25rem;
              cursor: pointer;
            ">
              Recarregar
            </button>
          </div>
        </div>
      `;
    }
  }
}

// Registrar service worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado:', registration);
      })
      .catch((error) => {
        console.log('❌ Service Worker falhou:', error);
      });
  });
}

// Aguardar DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
