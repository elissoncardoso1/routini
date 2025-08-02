#!/bin/bash

# Script para build e upload da versão 0.1.5 com correções do Windows
echo "🚀 Preparando nova versão 0.1.5 com correções do Windows..."
echo ""

# Verificar se estamos na branch main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️ Não está na branch main. Branch atual: $CURRENT_BRANCH"
    echo "Mudando para a branch main..."
    git checkout main
fi

# Atualizar dependências se necessário
echo "📦 Verificando dependências..."
npm install

# Fazer build completo
echo ""
echo "🔨 Fazendo build da versão 0.1.5..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build do Vite"
    exit 1
fi

# Build do Electron
echo ""
echo "⚡ Fazendo build do Electron..."
npm run electron:build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build do Electron"
    exit 1
fi

# Verificar se os arquivos foram gerados
echo ""
echo "📁 Verificando arquivos gerados..."

if [ -f "release/Routini-0.1.5-arm64.dmg" ]; then
    echo "✅ DMG para macOS encontrado"
    DMG_SIZE=$(ls -lh release/Routini-0.1.5-arm64.dmg | awk '{print $5}')
    echo "   Tamanho: $DMG_SIZE"
else
    echo "❌ DMG para macOS não encontrado"
fi

if [ -f "release/Routini-Setup-0.1.5.exe" ]; then
    echo "✅ Instalador para Windows encontrado"
    EXE_SIZE=$(ls -lh release/Routini-Setup-0.1.5.exe | awk '{print $5}')
    echo "   Tamanho: $EXE_SIZE"
else
    echo "❌ Instalador para Windows não encontrado"
fi

if [ -f "release/Routini-0.1.5-portable.exe" ]; then
    echo "✅ Versão portátil para Windows encontrada"
    PORTABLE_SIZE=$(ls -lh release/Routini-0.1.5-portable.exe | awk '{print $5}')
    echo "   Tamanho: $PORTABLE_SIZE"
else
    echo "❌ Versão portátil para Windows não encontrada"
fi

echo ""
echo "📝 Preparando commit e tag..."

# Adicionar mudanças ao git
git add .

# Fazer commit
git commit -m "feat: versão 0.1.5 com correções críticas para Windows

- Sistema completo de debug automático para Windows
- Correções de DPI e scaling para telas de alta resolução
- Correções de layout e viewport específicas do Windows
- Correções de renderização do calendário
- Interface de debug visual para diagnóstico
- Persistência de correções aplicadas
- HashRouter configurado para compatibilidade com file://
- Imports diretos removendo lazy loading problemático

Fixes:
- Calendário não encontrado no Windows
- Problemas de carregamento da interface
- Erro de roteamento com BrowserRouter
- Problemas de DPI/scaling
- React Router não detectado

Esta versão resolve os problemas críticos reportados no Windows."

# Criar tag
git tag -a v0.1.5 -m "Versão 0.1.5 - Correções críticas para Windows

Esta versão inclui:
- Sistema de debug automático específico para Windows
- Correções de compatibilidade com protocolo file://
- Resolução de problemas de DPI e scaling
- Interface de diagnóstico visual
- Correções de renderização do calendário
- Melhor estabilidade no Windows

Arquivos incluídos:
- Routini-Setup-0.1.5.exe (Instalador Windows)
- Routini-0.1.5-portable.exe (Versão portátil Windows)
- Routini-0.1.5-arm64.dmg (macOS)"

echo ""
echo "🔄 Fazendo push para o GitHub..."

# Push do código
git push origin main

# Push das tags
git push origin v0.1.5

echo ""
echo "✅ Versão 0.1.5 preparada com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse: https://github.com/elissoncardoso1/routini/releases"
echo "2. Clique em 'Create a new release'"
echo "3. Selecione a tag: v0.1.5"
echo "4. Título: 'Versão 0.1.5 - Correções Críticas para Windows'"
echo "5. Adicione os seguintes arquivos:"
echo "   - release/Routini-Setup-0.1.5.exe"
echo "   - release/Routini-0.1.5-portable.exe"
echo "   - release/Routini-0.1.5-arm64.dmg"
echo ""
echo "📝 Descrição sugerida para o release:"
echo "---"
cat << 'EOF'
## 🪟 Correções Críticas para Windows

Esta versão resolve problemas críticos reportados no Windows, incluindo:

### ✅ Problemas Resolvidos
- **Calendário não encontrado** - Sistema agora detecta e corrige automaticamente
- **Problemas de carregamento da interface** - Implementado debug automático
- **Erro de roteamento** - Migrado para HashRouter (compatível com protocolo file://)
- **Problemas de DPI/scaling** - Correções automáticas para telas de alta resolução
- **React Router não detectado** - Diagnóstico e correção automática

### 🔧 Novos Recursos
- **Sistema de Debug Automático**: Detecta e corrige problemas automaticamente
- **Interface de Diagnóstico Visual**: Painel de debug no canto inferior direito
- **Correções Persistentes**: As correções são salvas e reaplicadas automaticamente
- **Diagnóstico Avançado**: Identifica problemas críticos, avisos e sugere correções

### 📱 Como Usar
1. Baixe e instale a versão para seu sistema
2. No Windows, o painel de debug aparecerá automaticamente se houver problemas
3. Use "Executar Testes" para diagnosticar problemas
4. Use "Aplicar Correções" para resolver automaticamente

### 📥 Downloads
- **Windows**: `Routini-Setup-0.1.5.exe` (Instalador) ou `Routini-0.1.5-portable.exe` (Portátil)
- **macOS**: `Routini-0.1.5-arm64.dmg`

### 🔗 Mais Informações
Consulte `WINDOWS_FIXES_GUIDE.md` no repositório para detalhes técnicos das correções aplicadas.
EOF
echo "---"
echo ""
echo "🎉 Pronto para criar o release no GitHub!"
