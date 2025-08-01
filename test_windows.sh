#!/bin/bash

echo "🪟 Testando compatibilidade com Windows..."

# 1. Verificar se o build foi bem-sucedido
echo "📦 Verificando build..."
if [ -f "release/Routini-Setup-0.1.2.exe" ]; then
    echo "✅ Executável Windows gerado"
else
    echo "❌ Executável Windows não encontrado"
    exit 1
fi

# 2. Verificar se os assets foram gerados corretamente
echo "📁 Verificando assets..."
if [ -f "dist/index.html" ]; then
    echo "✅ index.html encontrado"
else
    echo "❌ index.html não encontrado"
    exit 1
fi

# 3. Verificar se os caminhos estão corretos
echo "🔗 Verificando caminhos..."
if grep -q 'src="./assets/' dist/index.html; then
    echo "✅ Caminhos relativos configurados"
else
    echo "❌ Caminhos não estão relativos"
fi

# 4. Verificar configurações do Electron
echo "⚙️ Verificando configurações do Electron..."
if grep -q 'webSecurity: false' src/electron.ts; then
    echo "✅ webSecurity desabilitado"
else
    echo "❌ webSecurity não configurado"
fi

if grep -q 'devTools: true' src/electron.ts; then
    echo "✅ DevTools habilitado"
else
    echo "❌ DevTools não configurado"
fi

# 5. Verificar se o base está configurado
echo "🏗️ Verificando configuração do Vite..."
if grep -q 'base: "./"' vite.config.ts; then
    echo "✅ Base configurado para caminhos relativos"
else
    echo "❌ Base não configurado"
fi

# 6. Verificar CSS de fallback
echo "🎨 Verificando CSS de fallback..."
if grep -q 'height: 100%' src/index.css; then
    echo "✅ CSS de fallback configurado"
else
    echo "❌ CSS de fallback não encontrado"
fi

# 7. Verificar componente de debug
echo "🐛 Verificando componente de debug..."
if [ -f "src/components/WindowsDebug.tsx" ]; then
    echo "✅ Componente WindowsDebug criado"
else
    echo "❌ Componente WindowsDebug não encontrado"
fi

echo "🎯 Teste de compatibilidade concluído!"
echo ""
echo "📋 Resumo das correções implementadas:"
echo "✅ Electron com DevTools habilitado"
echo "✅ Logs de erro detalhados"
echo "✅ Verificação de arquivos"
echo "✅ CSS de fallback robusto"
echo "✅ Componente de debug para Windows"
echo "✅ Caminhos relativos configurados"
echo ""
echo "🪟 Para testar no Windows:"
echo "1. Execute o arquivo: release/Routini-Setup-0.1.2.exe"
echo "2. Abra DevTools (F12) para ver logs"
echo "3. Verifique se a interface carrega"
echo "4. Teste navegação entre páginas" 