# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.1.5] - 2025-08-01

### Corrigido
- **Correções críticas para problemas do Windows**
  - Calendário não encontrado - sistema agora detecta e corrige automaticamente
  - Problemas de carregamento da interface - implementado debug automático robusto
  - Erro de roteamento persistente - melhorado sistema HashRouter
  - Problemas de DPI/scaling - correções automáticas para telas de alta resolução
  - React Router não detectado - diagnóstico e correção automática aprimorados
  - Botão "Aplicar Correções" agora funciona efetivamente com recarregamento automático

### Adicionado
- **Sistema de Debug Automático Avançado**
  - Diagnóstico completo com categorização (crítico, aviso, informação)
  - Interface visual de debug no canto inferior direito (apenas no Windows)
  - Correções persistentes salvas no localStorage
  - Feedback visual durante aplicação de correções
  - Recarregamento automático após aplicar correções
  - Detecção automática de problemas na inicialização

- **Correções Específicas Implementadas**
  - Correções de viewport forçando dimensões corretas
  - Correções de layout garantindo visibilidade de elementos React
  - Correções de DPI com scaling automático para telas de alta resolução
  - Correções de renderização do calendário com re-renderização forçada
  - Remoção de estilos duplicados antes de aplicar novos
  - Forçar aceleração de hardware para melhor performance

- **Documentação Técnica**
  - `WINDOWS_FIXES_GUIDE.md` - Guia completo de correções
  - `test_windows_fixes.sh` - Script de verificação automática
  - Diagnóstico avançado com sugestões de correções

### Melhorado
- **Interface de Debug**
  - Status visual de problemas detectados
  - Categorização clara de problemas (🚨 críticos, ⚠️ avisos, ℹ️ informações)
  - Botão "Aplicar Correções" com feedback visual e estado
  - Contadores de problemas detectados
  - Informações detalhadas do sistema (DPI, resolução, viewport)

- **Sistema de Correções**
  - Aplicação automática na inicialização para sistemas Windows
  - Persistência das correções aplicadas
  - Re-aplicação automática quando problemas são detectados
  - Verificação de timestamps para evitar correções desnecessárias

## [0.1.4] - 2024-08-01

### Corrigido
- **Problemas críticos de renderização no Windows**
  - Corrigido problema de roteamento com BrowserRouter → HashRouter
  - Removido lazy loading problemático que falhava no Electron/Windows
  - Corrigidas configurações inseguras do Electron
  - Otimizada configuração do Vite para melhor compatibilidade com desktop
  - Implementado sistema de debug específico para Windows

### Adicionado
- **Sistema de debug avançado para Windows**
  - Detecção automática de problemas de roteamento
  - Verificação de carregamento de componentes
  - Correções automáticas de DPI/Scaling
  - Interface visual de debug
  - Logs detalhados para troubleshooting

- **Script de teste automatizado**
  - Verificação de ambiente Windows
  - Teste de build completo
  - Validação de configurações
  - Relatório detalhado de correções

### Melhorado
- **Configurações de segurança do Electron**
  - `nodeIntegration: false` (segurança)
  - `contextIsolation: true` (segurança)
  - `webSecurity: true` (segurança)

- **Configurações do Vite otimizadas**
  - `sourcemap: true` (debug melhorado)
  - `minify: 'esbuild'` (melhor compatibilidade)
  - `target: 'esnext'` (performance otimizada)

### Arquivos Modificados
- `src/App.tsx` - HashRouter e imports diretos
- `src/electron.ts` - Configurações seguras
- `vite.config.ts` - Otimizações para desktop
- `src/utils/windowsDebug.ts` - Sistema de debug melhorado
- `src/components/WindowsDebug.tsx` - Interface de debug
- `test_windows.sh` - Script de teste automatizado
- `WINDOWS_SOLUTIONS_SUMMARY.md` - Documentação completa

### Compatibilidade
- ✅ Windows 10/11 com diferentes configurações de DPI
- ✅ Electron com protocolo file://
- ✅ Navegação entre rotas funcionando corretamente
- ✅ Todas as telas carregando sem tela branca/cinza
- ✅ Debug automático de problemas específicos do Windows

## [0.1.0-alpha.1] - 2024-03-XX

### Adicionado
- Sistema de agendamento com calendário interativo
- Dashboard com estatísticas e visão geral
- Gerenciamento de profissionais e pacientes
- Mini calendário na sidebar
- Lista de próximos atendimentos
- Funcionalidade de cancelamento de atendimentos
- Suporte a cancelamento de atendimentos futuros
- Interface responsiva com Tailwind CSS
- Armazenamento local com IndexedDB (Dexie)

### Recursos Principais
- Visualização de agenda por dia, semana e mês
- Cadastro e edição de profissionais
- Cadastro e edição de pacientes
- Agendamento de atendimentos
- Cancelamento de atendimentos individuais ou em série
- Estatísticas e gráficos no dashboard
- Navegação intuitiva com sidebar e top navigation
- Design moderno e responsivo

### Tecnologias
- React 19
- TypeScript
- Vite
- Tailwind CSS
- FullCalendar
- Dexie (IndexedDB)
- React Router
- HeadlessUI
- Date-fns 