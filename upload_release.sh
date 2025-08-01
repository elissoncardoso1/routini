#!/bin/bash

# Script para fazer upload dos executáveis para o release no GitHub
# Requer: gh CLI (GitHub CLI)

echo "🚀 Fazendo upload dos executáveis para o release..."

# Verificar se o gh CLI está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) não está instalado."
    echo "Instale em: https://cli.github.com/"
    exit 1
fi

# Verificar se está logado no GitHub
if ! gh auth status &> /dev/null; then
    echo "❌ Não está logado no GitHub CLI."
    echo "Execute: gh auth login"
    exit 1
fi

# Verificar se os executáveis existem
if [ ! -f "release/Routini-Setup-0.1.0-alpha.1.exe" ]; then
    echo "❌ Executável Windows não encontrado. Execute: npm run electron:build:win"
    exit 1
fi

if [ ! -f "release/Routini-0.1.0-alpha.1-portable.exe" ]; then
    echo "❌ Executável portátil não encontrado. Execute: npm run electron:build:win"
    exit 1
fi

echo "✅ Executáveis encontrados!"

# Fazer upload dos executáveis
echo "📤 Fazendo upload dos executáveis..."

# Windows Setup
gh release upload v0.1.0-alpha.1 release/Routini-Setup-0.1.0-alpha.1.exe \
    --repo elissoncardoso1/routini \
    --clobber

# Windows Portable
gh release upload v0.1.0-alpha.1 release/Routini-0.1.0-alpha.1-portable.exe \
    --repo elissoncardoso1/routini \
    --clobber

# macOS DMG (se existir)
if [ -f "release/Routini-0.1.0-alpha.1-arm64.dmg" ]; then
    gh release upload v0.1.0-alpha.1 release/Routini-0.1.0-alpha.1-arm64.dmg \
        --repo elissoncardoso1/routini \
        --clobber
fi

# macOS ZIP (se existir)
if [ -f "release/Routini-0.1.0-alpha.1-arm64-mac.zip" ]; then
    gh release upload v0.1.0-alpha.1 release/Routini-0.1.0-alpha.1-arm64-mac.zip \
        --repo elissoncardoso1/routini \
        --clobber
fi

echo "✅ Upload concluído!"
echo "🌐 Acesse: https://github.com/elissoncardoso1/routini/releases/tag/v0.1.0-alpha.1" 