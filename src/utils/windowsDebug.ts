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

    // Remover estilos anteriores para evitar duplicação
    this.removeExistingFixes();

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

    // 6. Forçar re-renderização após aplicar correções
    this.forceRerender();

    // 7. Salvar estado das correções aplicadas
    localStorage.setItem('windowsFixesApplied', 'true');
    
    console.log('✅ Correções do Windows aplicadas com sucesso!');
  }

  private fixViewportIssues(): void {
    // Garantir que o viewport seja correto
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    // Aplicar correções CSS permanentes
    const style = document.createElement('style');
    style.id = 'windows-fix-viewport';
    style.textContent = `
      /* Correções de viewport para Windows */
      html, body {
        width: 100% !important;
        height: 100% !important;
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      #root {
        width: 100vw !important;
        height: 100vh !important;
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);
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
    style.id = 'windows-fix-layout';
    style.textContent = `
      /* Garantir que o root seja sempre visível */
      #root {
        min-height: 100vh !important;
        height: 100vh !important;
        width: 100vw !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
        position: relative !important;
      }

      /* Corrigir problemas de flexbox no Windows */
      .flex {
        display: flex !important;
      }
      
      .flex-col {
        flex-direction: column !important;
      }
      
      .flex-1 {
        flex: 1 1 0% !important;
      }

      /* Garantir que o calendário seja visível */
      .fc {
        height: 100% !important;
        min-height: 400px !important;
        visibility: visible !important;
        opacity: 1 !important;
      }

      .fc-view-harness {
        height: 100% !important;
        min-height: 400px !important;
      }
      
      /* Garantir que componentes React sejam visíveis */
      [data-reactroot] {
        height: 100% !important;
        width: 100% !important;
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
      
      /* Forçar visibilidade de elementos importantes */
      .bg-white, .bg-gray-50, .bg-blue-50 {
        background-color: inherit !important;
        visibility: visible !important;
      }
      
      /* Corrigir problemas de z-index no Windows */
      .fixed {
        z-index: 9999 !important;
      }
    `;
    document.head.appendChild(style);
  }

  private fixDPIIssues(): void {
    // Aplicar correções de DPI
    const style = document.createElement('style');
    style.id = 'windows-fix-dpi';
    style.textContent = `
      /* Corrigir problemas de DPI no Windows */
      * {
        -webkit-text-size-adjust: 100% !important;
        -ms-text-size-adjust: 100% !important;
        text-size-adjust: 100% !important;
        box-sizing: border-box !important;
      }

      /* Garantir que imagens sejam nítidas */
      img {
        image-rendering: -webkit-optimize-contrast !important;
        image-rendering: crisp-edges !important;
        max-width: 100% !important;
        height: auto !important;
      }

      /* Corrigir problemas de ícones */
      svg {
        shape-rendering: geometricPrecision !important;
        max-width: 100% !important;
        height: auto !important;
      }
      
      /* Forçar aceleração de hardware */
      body, #root {
        transform: translateZ(0) !important;
        will-change: transform !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
      }
      
      /* Corrigir problemas de scaling em telas de alta DPI */
      @media screen and (-webkit-min-device-pixel-ratio: 1.5) {
        * {
          transform: translateZ(0) !important;
        }
      }
      
      /* Corrigir problemas específicos do calendário com DPI alto */
      .fc * {
        transform: translateZ(0) !important;
        will-change: transform !important;
      }
    `;
    document.head.appendChild(style);
    
    // Aplicar correções diretas no DOM para DPI
    const dpi = window.devicePixelRatio || 1;
    if (dpi > 1) {
      document.body.style.zoom = `${1/dpi}`;
      document.body.style.transform = `scale(${dpi})`;
      document.body.style.transformOrigin = 'top left';
    }
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
          void element.offsetHeight; // Trigger reflow
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

  // Remover correções existentes para evitar duplicação
  private removeExistingFixes(): void {
    const existingStyles = document.querySelectorAll('style[id*="windows-fix"]');
    existingStyles.forEach(style => style.remove());
  }

  // Forçar re-renderização completa
  private forceRerender(): void {
    // Forçar reflow de elementos críticos
    const root = document.getElementById('root');
    if (root) {
      const display = root.style.display;
      root.style.display = 'none';
      void root.offsetHeight; // Trigger reflow
      root.style.display = display || '';
    }

    // Forçar re-renderização do calendário
    const calendar = document.querySelector('.fc');
    if (calendar) {
      const element = calendar as HTMLElement;
      const display = element.style.display;
      element.style.display = 'none';
      void element.offsetHeight; // Trigger reflow
      element.style.display = display || '';
    }

    // Disparar evento de resize para forçar recálculos
    window.dispatchEvent(new Event('resize'));
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

  // Diagnóstico avançado para identificar problemas específicos
  diagnoseProblems(): {
    critical: string[];
    warnings: string[];
    info: string[];
    fixes: string[];
  } {
    const diagnosis = {
      critical: [] as string[],
      warnings: [] as string[],
      info: [] as string[],
      fixes: [] as string[]
    };

    // Verificações críticas
    const root = document.getElementById('root');
    if (!root) {
      diagnosis.critical.push('Elemento #root não encontrado');
      diagnosis.fixes.push('Verificar se o React está inicializando corretamente');
    } else {
      const rootRect = root.getBoundingClientRect();
      if (rootRect.width === 0 || rootRect.height === 0) {
        diagnosis.critical.push('Elemento #root tem dimensões zero');
        diagnosis.fixes.push('Aplicar correções de layout');
      }
    }

    // Verificar calendário
    const calendar = document.querySelector('.fc');
    if (!calendar) {
      diagnosis.warnings.push('Calendário não detectado');
      diagnosis.fixes.push('Verificar se o FullCalendar está carregando');
    } else {
      const calRect = calendar.getBoundingClientRect();
      if (calRect.width === 0 || calRect.height === 0) {
        diagnosis.warnings.push('Calendário tem dimensões zero');
        diagnosis.fixes.push('Aplicar correções de renderização do calendário');
      }
    }

    // Verificar CSS
    if (document.styleSheets.length === 0) {
      diagnosis.critical.push('Nenhum stylesheet carregado');
      diagnosis.fixes.push('Verificar se o CSS está sendo carregado corretamente');
    }

    // Verificar DPI
    if (this.devicePixelRatio > 1) {
      diagnosis.info.push(`DPI alto detectado: ${this.devicePixelRatio}x`);
      diagnosis.fixes.push('Aplicar correções de DPI');
    }

    // Verificar roteamento
    if (!window.location.href.includes('#')) {
      diagnosis.warnings.push('HashRouter não detectado');
      diagnosis.fixes.push('Verificar se está usando HashRouter em vez de BrowserRouter');
    }

    return diagnosis;
  }

  // Verificar se é Windows (público)
  isWindowsSystem(): boolean {
    return this.isWindows;
  }

  // Log de debug
  logDebugInfo(): void {
    console.log('🔍 Windows Debug Info:', this.generateReport());
  }
}

// Função de inicialização automática
export function initializeWindowsDebug(): void {
  const debuggerInstance = WindowsDebugger.getInstance();
  
  // Verificar se as correções já foram aplicadas anteriormente
  const fixesApplied = localStorage.getItem('windowsFixesApplied');
  
  if (debuggerInstance.isWindowsSystem()) {
    // Aplicar correções automaticamente no Windows
    debuggerInstance.applyWindowsFixes();
    
    // Se é a primeira vez ou se foram requisitadas novamente
    if (!fixesApplied || fixesApplied !== 'true') {
      console.log('🔧 Aplicando correções automáticas do Windows...');
    }
  }
  
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
    
    // Se há problemas, aplicar correções automaticamente
    if (debuggerInstance.isWindowsSystem()) {
      console.log('🔧 Aplicando correções automáticas devido a problemas detectados...');
      debuggerInstance.applyWindowsFixes();
    }
  }
} 