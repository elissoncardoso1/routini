// Utilitário para detectar e corrigir problemas específicos do Windows
export class WindowsDebugger {
  private static instance: WindowsDebugger;
  private isWindows: boolean;
  private devicePixelRatio: number;
  private screenInfo: {
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

  constructor() {
    this.isWindows = this.detectWindows();
    this.devicePixelRatio = window.devicePixelRatio || 1;
    this.screenInfo = this.getScreenInfo();
  }

  static getInstance(): WindowsDebugger {
    if (!WindowsDebugger.instance) {
      WindowsDebugger.instance = new WindowsDebugger();
    }
    return WindowsDebugger.instance;
  }

  private detectWindows(): boolean {
    return navigator.platform.indexOf('Win') !== -1 || 
           navigator.userAgent.indexOf('Windows') !== -1;
  }

  private getScreenInfo() {
    return {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      devicePixelRatio: this.devicePixelRatio,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      clientWidth: document.documentElement.clientWidth,
      clientHeight: document.documentElement.clientHeight
    };
  }

  // Detectar problemas de DPI/Scaling
  detectDPIIssues(): string[] {
    const issues: string[] = [];
    
    if (this.isWindows) {
      // Verificar se há scaling ativo
      if (this.devicePixelRatio > 1) {
        issues.push(`DPI Scaling detectado: ${this.devicePixelRatio}x`);
      }

      // Verificar discrepâncias entre screen e client dimensions
      const screenRatio = this.screenInfo.width / this.screenInfo.availWidth;
      if (Math.abs(screenRatio - this.devicePixelRatio) > 0.1) {
        issues.push(`Discrepância de DPI detectada: screen=${screenRatio}, device=${this.devicePixelRatio}`);
      }

      // Verificar se há problemas com viewport
      if (this.screenInfo.innerWidth !== this.screenInfo.clientWidth) {
        issues.push('Problema de viewport detectado');
      }
    }

    return issues;
  }

  // Aplicar correções de CSS para Windows
  applyWindowsFixes(): void {
    if (!this.isWindows) return;

    console.log('🔧 Aplicando correções específicas do Windows...');

    // 1. Corrigir problemas de viewport
    this.fixViewportIssues();

    // 2. Corrigir problemas de fontes
    this.fixFontIssues();

    // 3. Corrigir problemas de layout
    this.fixLayoutIssues();

    // 4. Corrigir problemas de DPI
    this.fixDPIIssues();
  }

  private fixViewportIssues(): void {
    // Garantir que o viewport seja correto
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    // Forçar recálculo do layout
    document.body.style.width = '100vw';
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';
  }

  private fixFontIssues(): void {
    // Adicionar fontes específicas do Windows
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'WindowsFallback';
        src: local('Segoe UI'), local('Tahoma'), local('Arial');
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'WindowsFallback', sans-serif !important;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
      
      /* Corrigir problemas de fonte no calendário */
      .fc {
        font-family: inherit !important;
      }
      
      .fc .fc-button {
        font-family: inherit !important;
      }
    `;
    document.head.appendChild(style);
  }

  private fixLayoutIssues(): void {
    // Corrigir problemas de layout específicos do Windows
    const style = document.createElement('style');
    style.textContent = `
      /* Garantir que o root seja sempre visível */
      #root {
        min-height: 100vh !important;
        height: 100vh !important;
        width: 100vw !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
      }

      /* Corrigir problemas de flexbox no Windows */
      .flex {
        display: flex !important;
      }

      /* Garantir que o calendário seja visível */
      .fc {
        height: 100% !important;
        min-height: 400px !important;
      }

      .fc-view-harness {
        height: 100% !important;
      }

      /* Corrigir problemas de calc() no Windows */
      .h-\\[calc\\(100vh-12rem\\)\\] {
        height: calc(100vh - 12rem) !important;
        min-height: 400px !important;
      }

      /* Fallback para problemas de viewport */
      @media screen and (max-width: 768px) {
        .h-\\[calc\\(100vh-12rem\\)\\] {
          height: calc(100vh - 8rem) !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  private fixDPIIssues(): void {
    // Aplicar correções de DPI
    const style = document.createElement('style');
    style.textContent = `
      /* Corrigir problemas de DPI no Windows */
      * {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        text-size-adjust: 100%;
      }

      /* Garantir que imagens sejam nítidas */
      img {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
      }

      /* Corrigir problemas de ícones */
      svg {
        shape-rendering: geometricPrecision;
      }
    `;
    document.head.appendChild(style);
  }

  // Detectar problemas de renderização
  detectRenderingIssues(): string[] {
    const issues: string[] = [];

    // Verificar se o root está visível
    const root = document.getElementById('root');
    if (!root) {
      issues.push('Elemento #root não encontrado');
    } else {
      const rect = root.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        issues.push('Elemento #root tem dimensões zero');
      }
    }

    // Verificar se o calendário está visível
    const calendar = document.querySelector('.fc');
    if (!calendar) {
      issues.push('Calendário não encontrado');
    } else {
      const rect = calendar.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        issues.push('Calendário tem dimensões zero');
      }
    }

    // Verificar se há problemas de CSS carregado
    const stylesheets = document.styleSheets;
    if (stylesheets.length === 0) {
      issues.push('Nenhum stylesheet carregado');
    }

    return issues;
  }

  // Gerar relatório completo
  generateReport(): {
    isWindows: boolean;
    devicePixelRatio: number;
    screenInfo: typeof this.screenInfo;
    dpiIssues: string[];
    renderingIssues: string[];
    userAgent: string;
    platform: string;
    language: string;
  } {
    return {
      isWindows: this.isWindows,
      devicePixelRatio: this.devicePixelRatio,
      screenInfo: this.screenInfo,
      dpiIssues: this.detectDPIIssues(),
      renderingIssues: this.detectRenderingIssues(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language
    };
  }

  // Log de debug
  logDebugInfo(): void {
    console.log('🔍 Windows Debug Info:', this.generateReport());
  }
}

// Função de inicialização automática
export function initializeWindowsDebug(): void {
  const debuggerInstance = WindowsDebugger.getInstance();
  
  // Aplicar correções automaticamente
  debuggerInstance.applyWindowsFixes();
  
  // Log de debug
  debuggerInstance.logDebugInfo();
  
  // Verificar problemas
  const dpiIssues = debuggerInstance.detectDPIIssues();
  const renderingIssues = debuggerInstance.detectRenderingIssues();
  
  if (dpiIssues.length > 0 || renderingIssues.length > 0) {
    console.warn('⚠️ Problemas detectados no Windows:', {
      dpiIssues,
      renderingIssues
    });
  }
} 