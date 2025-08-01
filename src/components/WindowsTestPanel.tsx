import React, { useState, useEffect } from 'react';
import { WindowsDebugger } from '../utils/windowsDebug';

export function WindowsTestPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    // Mostrar painel apenas no Windows
    const isWindows = navigator.platform.indexOf('Win') !== -1 || 
                     navigator.userAgent.indexOf('Windows') !== -1;
    
    if (isWindows) {
      setIsVisible(true);
      updateDebugInfo();
    }
  }, []);

  const updateDebugInfo = () => {
    const debugger = WindowsDebugger.getInstance();
    setDebugInfo(debugger.generateReport());
  };

  const runTests = () => {
    const results: any = {};
    
    // Teste 1: Verificar viewport
    results.viewport = {
      screen: `${window.screen.width}x${window.screen.height}`,
      inner: `${window.innerWidth}x${window.innerHeight}`,
      client: `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`,
      devicePixelRatio: window.devicePixelRatio
    };

    // Teste 2: Verificar elementos críticos
    const root = document.getElementById('root');
    const calendar = document.querySelector('.fc');
    
    results.elements = {
      rootExists: !!root,
      rootDimensions: root ? `${root.offsetWidth}x${root.offsetHeight}` : 'N/A',
      calendarExists: !!calendar,
      calendarDimensions: calendar ? `${calendar.offsetWidth}x${calendar.offsetHeight}` : 'N/A'
    };

    // Teste 3: Verificar CSS
    results.css = {
      stylesheetsCount: document.styleSheets.length,
      bodyFontFamily: getComputedStyle(document.body).fontFamily,
      rootDisplay: root ? getComputedStyle(root).display : 'N/A'
    };

    // Teste 4: Verificar problemas específicos
    const debugger = WindowsDebugger.getInstance();
    results.dpiIssues = debugger.detectDPIIssues();
    results.renderingIssues = debugger.detectRenderingIssues();

    setTestResults(results);
  };

  const applyFixes = () => {
    const debugger = WindowsDebugger.getInstance();
    debugger.applyWindowsFixes();
    updateDebugInfo();
    runTests();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-80 max-h-96 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Windows Debug Panel</h3>
          <p className="text-sm text-gray-600">Teste e correções para Windows</p>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Informações básicas */}
          {debugInfo && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Informações do Sistema</h4>
              <div className="text-sm space-y-1">
                <div><strong>DPI:</strong> {debugInfo.devicePixelRatio}x</div>
                <div><strong>Resolução:</strong> {debugInfo.screenInfo.width}x{debugInfo.screenInfo.height}</div>
                <div><strong>Viewport:</strong> {debugInfo.screenInfo.innerWidth}x{debugInfo.screenInfo.innerHeight}</div>
                <div><strong>Plataforma:</strong> {debugInfo.platform}</div>
              </div>
            </div>
          )}

          {/* Resultados dos testes */}
          {Object.keys(testResults).length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Resultados dos Testes</h4>
              
              {/* Viewport */}
              <div className="text-sm">
                <div className="font-medium">Viewport:</div>
                <div className="ml-2 space-y-1">
                  <div>Screen: {testResults.viewport?.screen}</div>
                  <div>Inner: {testResults.viewport?.inner}</div>
                  <div>Client: {testResults.viewport?.client}</div>
                </div>
              </div>

              {/* Elementos */}
              <div className="text-sm">
                <div className="font-medium">Elementos:</div>
                <div className="ml-2 space-y-1">
                  <div>Root: {testResults.elements?.rootExists ? '✅' : '❌'} {testResults.elements?.rootDimensions}</div>
                  <div>Calendar: {testResults.elements?.calendarExists ? '✅' : '❌'} {testResults.elements?.calendarDimensions}</div>
                </div>
              </div>

              {/* Problemas */}
              {testResults.dpiIssues?.length > 0 && (
                <div className="text-sm">
                  <div className="font-medium text-red-600">Problemas DPI:</div>
                  <div className="ml-2">
                    {testResults.dpiIssues.map((issue: string, i: number) => (
                      <div key={i} className="text-red-600">• {issue}</div>
                    ))}
                  </div>
                </div>
              )}

              {testResults.renderingIssues?.length > 0 && (
                <div className="text-sm">
                  <div className="font-medium text-red-600">Problemas de Renderização:</div>
                  <div className="ml-2">
                    {testResults.renderingIssues.map((issue: string, i: number) => (
                      <div key={i} className="text-red-600">• {issue}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botões de ação */}
          <div className="space-y-2">
            <button
              onClick={runTests}
              className="w-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Executar Testes
            </button>
            
            <button
              onClick={applyFixes}
              className="w-full bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700"
            >
              Aplicar Correções
            </button>
            
            <button
              onClick={() => setIsVisible(false)}
              className="w-full bg-gray-600 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 