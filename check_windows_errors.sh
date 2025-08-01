#!/bin/bash

# Script para verificar erros específicos do Windows
# Executar no macOS para testar compatibilidade Windows

echo "🔍 Verificando erros específicos do Windows..."

# 1. Verificar TypeScript
echo "📝 Verificando erros TypeScript..."
npx tsc --noEmit
if [ $? -eq 0 ]; then
    echo "✅ TypeScript sem erros"
else
    echo "❌ Erros encontrados no TypeScript"
fi

# 2. Verificar ESLint
echo "🔍 Verificando erros ESLint..."
npx eslint src/ --ext .ts,.tsx
if [ $? -eq 0 ]; then
    echo "✅ ESLint sem erros"
else
    echo "❌ Erros encontrados no ESLint"
fi

# 3. Verificar dependências
echo "📦 Verificando dependências..."
npm audit
if [ $? -eq 0 ]; then
    echo "✅ Dependências seguras"
else
    echo "⚠️ Vulnerabilidades encontradas"
fi

# 4. Verificar build para Windows
echo "🪟 Verificando build para Windows..."
npm run electron:build:win
if [ $? -eq 0 ]; then
    echo "✅ Build para Windows bem-sucedido"
else
    echo "❌ Erro no build para Windows"
fi

# 5. Verificar arquivos gerados
echo "📁 Verificando arquivos gerados..."
if [ -f "release/Routini-Setup-0.1.2.exe" ]; then
    echo "✅ Executável Windows gerado"
else
    echo "❌ Executável Windows não encontrado"
fi

if [ -f "release/Routini-0.1.2-portable.exe" ]; then
    echo "✅ Executável portátil gerado"
else
    echo "❌ Executável portátil não encontrado"
fi

# 6. Verificar configurações específicas do Windows
echo "⚙️ Verificando configurações do Windows..."

# Verificar se o base está configurado corretamente
if grep -q 'base: "./"' vite.config.ts; then
    echo "✅ Base configurado para caminhos relativos"
else
    echo "❌ Base não configurado corretamente"
fi

# Verificar se webSecurity está desabilitado
if grep -q 'webSecurity: false' src/electron.ts; then
    echo "✅ webSecurity desabilitado para Windows"
else
    echo "❌ webSecurity não configurado"
fi

echo "🎯 Verificação concluída!" 