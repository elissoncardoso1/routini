# Guia de Problemas Específicos do Windows

## Problemas Identificados e Soluções

### 1. Problemas de DPI/Scaling

**Problema:** O Windows tem diferentes configurações de DPI (125%, 150%, 200%) que podem causar problemas de renderização.

**Sintomas:**
- Interface cortada ou incompleta
- Elementos com tamanho incorreto
- Texto borrado ou muito pequeno

**Soluções Implementadas:**
```css
/* Correções para DPI scaling no Windows */
@media screen and (min-resolution: 120dpi) {
  * {
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }
  
  .fc {
    font-size: 14px !important;
  }
}
```

### 2. Problemas de Viewport

**Problema:** O Windows pode ter problemas com `calc(100vh)` e outras unidades de viewport.

**Sintomas:**
- Layout quebrado
- Elementos fora da tela
- Scroll incorreto

**Soluções Implementadas:**
```css
/* Garantir que elementos com calc() funcionem no Windows */
.h-\[calc\(100vh-12rem\)\] {
  height: calc(100vh - 12rem) !important;
  min-height: 400px !important;
}

/* Fallback para problemas de viewport */
@media screen and (max-width: 768px) {
  .h-\[calc\(100vh-12rem\)\] {
    height: calc(100vh - 8rem) !important;
  }
}
```

### 3. Problemas de Fontes

**Problema:** Fontes podem não carregar corretamente no Windows ou ter fallbacks inadequados.

**Sintomas:**
- Texto com fonte incorreta
- Caracteres quebrados
- Layout shifts

**Soluções Implementadas:**
```css
/* Fallbacks para fontes no Windows */
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
```

### 4. Problemas de Layout/Flexbox

**Problema:** Flexbox pode ter comportamento diferente no Windows.

**Sintomas:**
- Elementos não se alinham corretamente
- Layout quebrado
- Espaçamento incorreto

**Soluções Implementadas:**
```css
/* Correções para problemas de layout no Windows */
.flex {
  display: flex !important;
}

.flex-1 {
  flex: 1 1 0% !important;
}

/* Garantir que o root seja sempre visível */
#root {
  min-height: 100vh !important;
  height: 100vh !important;
  width: 100vw !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
}
```

### 5. Problemas de CSS/IE/Edge

**Problema:** IE e Edge podem ter problemas específicos com CSS moderno.

**Sintomas:**
- Estilos não aplicados
- Layout quebrado
- JavaScript não funcionando

**Soluções Implementadas:**
```css
/* Correções específicas do Windows */
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  /* IE/Edge specific fixes */
  #root {
    min-height: 100vh !important;
    height: 100vh !important;
  }
  
  .fc {
    height: 100% !important;
    min-height: 400px !important;
  }
}
```

## Utilitário de Debug

### WindowsDebugger

Criamos um utilitário específico para detectar e corrigir problemas do Windows:

```typescript
import { WindowsDebugger, initializeWindowsDebug } from './utils/windowsDebug';

// Inicializar automaticamente
initializeWindowsDebug();

// Ou usar manualmente
const debugger = WindowsDebugger.getInstance();
debugger.applyWindowsFixes();
```

### Funcionalidades do Debugger:

1. **Detecção Automática de Problemas:**
   - DPI scaling issues
   - Viewport problems
   - Rendering issues
   - Font problems

2. **Correções Automáticas:**
   - Aplicar CSS fixes
   - Corrigir viewport
   - Ajustar fontes
   - Corrigir layout

3. **Relatórios de Debug:**
   - Informações do sistema
   - Problemas detectados
   - Resultados de testes

## Componente de Teste

### WindowsTestPanel

Um painel de teste que aparece automaticamente no Windows:

- **Informações do Sistema:** DPI, resolução, viewport
- **Testes Automáticos:** Verificar elementos críticos
- **Correções em Tempo Real:** Aplicar fixes sem recarregar
- **Relatórios Detalhados:** Problemas específicos encontrados

## Como Usar

### 1. Detecção Automática

O sistema detecta automaticamente se está rodando no Windows e aplica as correções necessárias.

### 2. Debug Manual

Se houver problemas, use o painel de debug:

1. Abra o aplicativo no Windows
2. O painel de debug aparecerá no canto inferior direito
3. Clique em "Executar Testes" para diagnosticar problemas
4. Clique em "Aplicar Correções" para resolver automaticamente

### 3. Logs de Debug

Verifique o console do navegador para logs detalhados:

```javascript
// Logs automáticos
🔍 Windows Debug Info: { ... }
🔧 Aplicando correções específicas do Windows...
⚠️ Problemas detectados no Windows: { ... }
```

## Testes Específicos

### 1. Teste de DPI

```javascript
// Verificar se há scaling ativo
if (window.devicePixelRatio > 1) {
  console.log('DPI Scaling detectado:', window.devicePixelRatio);
}
```

### 2. Teste de Viewport

```javascript
// Verificar discrepâncias de viewport
const screenRatio = window.screen.width / window.screen.availWidth;
if (Math.abs(screenRatio - window.devicePixelRatio) > 0.1) {
  console.log('Discrepância de DPI detectada');
}
```

### 3. Teste de Elementos

```javascript
// Verificar se elementos críticos estão visíveis
const root = document.getElementById('root');
const calendar = document.querySelector('.fc');

if (!root || root.offsetWidth === 0) {
  console.log('Problema com elemento #root');
}

if (!calendar || calendar.offsetWidth === 0) {
  console.log('Problema com calendário');
}
```

## Configurações Recomendadas

### 1. Configuração do Vite

```typescript
// vite.config.ts
export default defineConfig({
  base: './', // Importante para Electron
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar bibliotecas grandes
        }
      }
    }
  }
})
```

### 2. Configuração do Electron

```javascript
// electron.ts
const win = new BrowserWindow({
  webPreferences: {
    webSecurity: false, // Permite carregar recursos locais
    devTools: true // Sempre habilitar DevTools para debug
  }
});
```

### 3. CSS Fallbacks

```css
/* Garantir compatibilidade */
html, body {
  height: 100%;
  overflow: hidden;
}

#root {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}
```

## Troubleshooting

### Problema: Interface não renderiza

1. **Verificar Console:** Pressione F12 e verifique erros
2. **Verificar Arquivos:** Confirme que os assets estão carregando
3. **Aplicar Correções:** Use o painel de debug
4. **Recarregar:** Force um reload da página

### Problema: Layout quebrado

1. **Verificar DPI:** Use o painel de debug para verificar scaling
2. **Aplicar CSS Fixes:** Use as correções automáticas
3. **Testar Viewport:** Verifique se calc() está funcionando
4. **Verificar Fontes:** Confirme que as fontes estão carregando

### Problema: Performance ruim

1. **Verificar DevTools:** Use o profiler para identificar gargalos
2. **Otimizar CSS:** Remova estilos desnecessários
3. **Verificar DPI:** High DPI pode causar problemas de performance
4. **Testar Hardware Acceleration:** Desabilite se necessário

## Próximos Passos

1. **Monitoramento Contínuo:** Implementar telemetria para capturar problemas em produção
2. **Testes Automatizados:** Criar testes específicos para Windows
3. **Otimizações:** Melhorar performance em diferentes configurações de DPI
4. **Documentação:** Manter este guia atualizado com novos problemas encontrados 