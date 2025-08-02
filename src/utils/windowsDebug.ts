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

  // Detectar problemas de roteamento específicos do Windows
  detectRoutingIssues(): string[] {
    const issues: string[] = [];
    
    if (this.isWindows) {
      // Verificar se está usando HashRouter
      const currentUrl = window.location.href;
      if (!currentUrl.includes('#')) {
        issues.push('BrowserRouter detectado - deve usar HashRouter no Windows');
      }

      // Verificar se há problemas com protocolo file://
      if (currentUrl.startsWith('file://')) {
        console.log('✅ Protocolo file:// detectado - compatível com Windows');
      }

      // Verificar se o React Router está funcionando
      const routerElements = document.querySelectorAll('[data-router]');
      if (routerElements.length === 0) {
        issues.push('React Router não detectado - verificar configuração');
      }
    }

    return issues;
  }

  // Detectar problemas de carregamento de componentes
  detectLoadingIssues(): string[] {
    const issues: string[] = [];
    
    // Verificar se o root está carregado
    const root = document.getElementById('root');
    if (!root) {
      issues.push('Elemento #root não encontrado');
    } else {
      const rect = root.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        issues.push('Elemento #root tem dimensões zero');
      }
    }

    // Verificar se há elementos React renderizados
    const reactElements = document.querySelectorAll('[data-reactroot]');
    if (reactElements.length === 0) {
      // Tentar outros seletores
      const appElements = document.querySelectorAll('[id*="app"], [class*="app"]');
      if (appElements.length === 0) {
        issues.push('Nenhum elemento React detectado');
      }
    }

    // Verificar se há problemas com CSS
    const stylesheets = document.styleSheets;
    if (stylesheets.length === 0) {
      issues.push('Nenhum stylesheet carregado');
    } else {
      // Verificar se há erros de carregamento de CSS
      for (let i = 0; i < stylesheets.length; i++) {
        try {
          const rules = stylesheets[i].cssRules;
          if (!rules) {
            issues.push(`Stylesheet ${i} não carregou corretamente`);
          }
        } catch (e) {
          issues.push(`Erro ao acessar stylesheet ${i}: ${e}`);
        }
      }
    }

    return issues;
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

    // 5. Corrigir problemas de roteamento
    this.fixRoutingIssues();
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

  private fixRoutingIssues(): void {
    // Corrigir problemas específicos de roteamento no Windows
    const style = document.createElement('style');
    style.textContent = `
      /* Garantir que rotas sejam visíveis */
      [data-router] {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
      }

      /* Corrigir problemas de navegação */
      nav {
        z-index: 1000 !important;
      }

      /* Garantir que links funcionem */
      a {
        cursor: pointer !important;
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

    // Verificar se o calendário está visível - múltiplos seletores para Windows
    const calendarSelectors = [
      '.fc',
      '[data-testid="calendar"]',
      '.fullcalendar',
      '.calendar-container',
      'div[class*="fc"]',
      'div[class*="calendar"]'
    ];
    
    let calendar = null;
    for (const selector of calendarSelectors) {
      calendar = document.querySelector(selector);
      if (calendar) break;
    }
    
    if (!calendar) {
      // Tentar encontrar por texto ou atributos
      const allDivs = document.querySelectorAll('div');
      for (const div of allDivs) {
        if (div.innerHTML.includes('fc-') || div.innerHTML.includes('calendar')) {
          calendar = div;
          break;
        }
      }
    }
    
    if (!calendar) {
      issues.push('Calendário não encontrado - tentando correção automática');
      // Tentar corrigir automaticamente
      this.fixCalendarRendering();
    } else {
      const rect = calendar.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        issues.push('Calendário tem dimensões zero - aplicando correção');
        this.fixCalendarRendering();
      }
    }

    // Verificar se há problemas de CSS carregado
    const stylesheets = document.styleSheets;
    if (stylesheets.length === 0) {
      issues.push('Nenhum stylesheet carregado');
    }

    return issues;
  }

  // Corrigir problemas específicos de renderização do calendário no Windows
  private fixCalendarRendering(): void {
    console.log('🔧 Aplicando correções específicas do calendário para Windows...');
    
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
      // Forçar re-renderização do calendário
      const calendarElements = document.querySelectorAll('[class*="fc"]');
      calendarElements.forEach(element => {
        if (element instanceof HTMLElement) {
          // Forçar reflow
          element.style.display = 'none';
          element.offsetHeight; // Trigger reflow
          element.style.display = '';
          
          // Aplicar estilos específicos para Windows
          element.style.transform = 'translateZ(0)'; // Force hardware acceleration
          element.style.willChange = 'transform';
        }
      });

      // Corrigir problemas de DPI específicos do calendário
      const dpi = window.devicePixelRatio || 1;
      if (dpi > 1) {
        const calendarContainer = document.querySelector('.fc') as HTMLElement;
        if (calendarContainer) {
          calendarContainer.style.transform = `scale(${1/dpi})`;
          calendarContainer.style.transformOrigin = 'top left';
          calendarContainer.style.width = `${calendarContainer.offsetWidth * dpi}px`;
          calendarContainer.style.height = `${calendarContainer.offsetHeight * dpi}px`;
        }
      }

      // Garantir que o CSS do calendário está carregado
      this.ensureCalendarCSS();
    }, 100);
  }

  // Garantir que o CSS do calendário está carregado corretamente
  private ensureCalendarCSS(): void {
    const existingCSS = document.getElementById('calendar-windows-fix');
    if (!existingCSS) {
      const style = document.createElement('style');
      style.id = 'calendar-windows-fix';
      style.textContent = `
        /* Correções específicas para Windows */
        .fc {
          transform: translateZ(0) !important;
          will-change: transform !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
        
        .fc .fc-toolbar {
          transform: translateZ(0) !important;
        }
        
        .fc .fc-view-harness {
          transform: translateZ(0) !important;
        }
        
        .fc-event {
          transform: translateZ(0) !important;
          backface-visibility: hidden !important;
        }
        
        /* Correções para DPI alto no Windows */
        @media screen and (-webkit-min-device-pixel-ratio: 2) {
          .fc {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Gerar relatório completo
  generateReport(): {
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
    routingIssues: string[];
    loadingIssues: string[];
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
      routingIssues: this.detectRoutingIssues(),
      loadingIssues: this.detectLoadingIssues(),
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
  const routingIssues = debuggerInstance.detectRoutingIssues();
  const loadingIssues = debuggerInstance.detectLoadingIssues();
  
  if (dpiIssues.length > 0 || renderingIssues.length > 0 || routingIssues.length > 0 || loadingIssues.length > 0) {
    console.warn('⚠️ Problemas detectados no Windows:', {
      dpiIssues,
      renderingIssues,
      routingIssues,
      loadingIssues
    });
  }
} 