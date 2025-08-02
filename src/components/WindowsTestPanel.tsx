import React, { useState, useEffect } from 'react';
import { WindowsDebugger } from '../utils/windowsDebug';

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

interface TestResults {
  viewport?: {
    screen: string;
    inner: string;
    client: string;
    devicePixelRatio: number;
  };
  elements?: {
    rootExists: boolean;
    rootDimensions: string;
    calendarExists: boolean;
    calendarDimensions: string;
  };
  css?: {
    stylesheetsCount: number;
    bodyFontFamily: string;
    rootDisplay: string;
  };
  dpiIssues?: string[];
  renderingIssues?: string[];
  diagnosis?: {
    critical: string[];
    warnings: string[];
    info: string[];
    fixes: string[];
  };
}

export function WindowsTestPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [testResults, setTestResults] = useState<TestResults>({});

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
    const debuggerInstance = WindowsDebugger.getInstance();
    setDebugInfo(debuggerInstance.generateReport());
  };

  const runTests = () => {
    const results: TestResults = {};
    
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
      calendarDimensions: calendar ? `${(calendar as HTMLElement).offsetWidth}x${(calendar as HTMLElement).offsetHeight}` : 'N/A'
    };

    // Teste 3: Verificar CSS
    results.css = {
      stylesheetsCount: document.styleSheets.length,
      bodyFontFamily: getComputedStyle(document.body).fontFamily,
      rootDisplay: root ? getComputedStyle(root).display : 'N/A'
    };

    // Teste 4: Verificar problemas específicos
    const debuggerInstance = WindowsDebugger.getInstance();
    results.dpiIssues = debuggerInstance.detectDPIIssues();
    results.renderingIssues = debuggerInstance.detectRenderingIssues();
    
    // Teste 5: Diagnóstico avançado
    results.diagnosis = debuggerInstance.diagnoseProblems();

    setTestResults(results);
  };

  const applyFixes = () => {
    const debuggerInstance = WindowsDebugger.getInstance();
    console.log('🔧 Aplicando correções do Windows...');
    
    // Mostrar feedback visual
    const button = document.querySelector('button[data-action="apply-fixes"]') as HTMLButtonElement;
    if (button) {
      button.textContent = 'Aplicando...';
      button.disabled = true;
    }
    
    // Aplicar correções
    debuggerInstance.applyWindowsFixes();
    
    // Aguardar um pouco para as correções serem aplicadas
    setTimeout(() => {
      // Atualizar informações de debug
      updateDebugInfo();
      
      // Executar testes novamente
      runTests();
      
      // Mostrar que as correções foram aplicadas
      if (button) {
        button.textContent = 'Correções Aplicadas!';
        button.style.backgroundColor = '#10b981'; // Verde
      }
      
      // Forçar recarregamento da página após um breve delay
      setTimeout(() => {
        console.log('🔄 Recarregando página para aplicar correções...');
        
        // Salvar estado antes de recarregar
        localStorage.setItem('windowsFixesApplied', 'true');
        localStorage.setItem('windowsFixesTimestamp', Date.now().toString());
        
        window.location.reload();
      }, 1500);
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-80 max-h-96 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Windows Debug Panel</h3>
          <p className="text-sm text-gray-600">Teste e correções para Windows</p>
          
          {/* Status de problemas */}
          {Object.keys(testResults).length > 0 && testResults.diagnosis && (
            <div className="mt-2">
              {testResults.diagnosis.critical.length > 0 && (
                <div className="text-sm text-red-600 font-medium">
                  🚨 {testResults.diagnosis.critical.length} problema(s) crítico(s) detectado(s)
                </div>
              )}
              {testResults.diagnosis.warnings.length > 0 && (
                <div className="text-sm text-yellow-600 font-medium">
                  ⚠️ {testResults.diagnosis.warnings.length} aviso(s) detectado(s)
                </div>
              )}
              {testResults.diagnosis.critical.length === 0 && testResults.diagnosis.warnings.length === 0 && (
                <div className="text-sm text-green-600 font-medium">
                  ✅ Nenhum problema crítico detectado
                </div>
              )}
            </div>
          )}
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
              {testResults.dpiIssues && testResults.dpiIssues.length > 0 && (
                <div className="text-sm">
                  <div className="font-medium text-red-600">Problemas DPI:</div>
                  <div className="ml-2">
                    {testResults.dpiIssues.map((issue: string, i: number) => (
                      <div key={i} className="text-red-600">• {issue}</div>
                    ))}
                  </div>
                </div>
              )}

              {testResults.renderingIssues && testResults.renderingIssues.length > 0 && (
                <div className="text-sm">
                  <div className="font-medium text-red-600">Problemas de Renderização:</div>
                  <div className="ml-2">
                    {testResults.renderingIssues.map((issue: string, i: number) => (
                      <div key={i} className="text-red-600">• {issue}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Diagnóstico Avançado */}
              {testResults.diagnosis && (
                <div className="text-sm space-y-2">
                  {testResults.diagnosis.critical.length > 0 && (
                    <div>
                      <div className="font-medium text-red-600">Problemas Críticos:</div>
                      <div className="ml-2">
                        {testResults.diagnosis.critical.map((issue: string, i: number) => (
                          <div key={i} className="text-red-600">🚨 {issue}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {testResults.diagnosis.warnings.length > 0 && (
                    <div>
                      <div className="font-medium text-yellow-600">Avisos:</div>
                      <div className="ml-2">
                        {testResults.diagnosis.warnings.map((warning: string, i: number) => (
                          <div key={i} className="text-yellow-600">⚠️ {warning}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {testResults.diagnosis.info.length > 0 && (
                    <div>
                      <div className="font-medium text-blue-600">Informações:</div>
                      <div className="ml-2">
                        {testResults.diagnosis.info.map((info: string, i: number) => (
                          <div key={i} className="text-blue-600">ℹ️ {info}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {testResults.diagnosis.fixes.length > 0 && (
                    <div>
                      <div className="font-medium text-green-600">Correções Sugeridas:</div>
                      <div className="ml-2">
                        {testResults.diagnosis.fixes.map((fix: string, i: number) => (
                          <div key={i} className="text-green-600">🔧 {fix}</div>
                        ))}
                      </div>
                    </div>
                  )}
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
              data-action="apply-fixes"
              className="w-full bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 font-semibold"
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