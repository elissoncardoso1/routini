#!/bin/bash

# Script para fazer upload da versão 0.1.1 com DMG e EXE
# Requer: gh CLI (GitHub CLI)

echo "🚀 Fazendo upload da versão 0.1.1..."

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
if [ ! -f "release/Routini-Setup-0.1.1.exe" ]; then
    echo "❌ Executável Windows não encontrado."
    exit 1
fi

if [ ! -f "release/Routini-0.1.1-portable.exe" ]; then
    echo "❌ Executável portátil não encontrado."
    exit 1
fi

if [ ! -f "release/Routini-0.1.1-arm64.dmg" ]; then
    echo "❌ Executável macOS DMG não encontrado."
    exit 1
fi

if [ ! -f "release/Routini-0.1.1-arm64-mac.zip" ]; then
    echo "❌ Executável macOS ZIP não encontrado."
    exit 1
fi

echo "✅ Todos os executáveis encontrados!"

# Fazer upload dos executáveis
echo "📤 Fazendo upload dos executáveis..."

# Windows Setup
gh release upload v0.1.1 release/Routini-Setup-0.1.1.exe \
    --repo elissoncardoso1/routini \
    --clobber

# Windows Portable
gh release upload v0.1.1 release/Routini-0.1.1-portable.exe \
    --repo elissoncardoso1/routini \
    --clobber

# macOS DMG
gh release upload v0.1.1 release/Routini-0.1.1-arm64.dmg \
    --repo elissoncardoso1/routini \
    --clobber

# macOS ZIP
gh release upload v0.1.1 release/Routini-0.1.1-arm64-mac.zip \
    --repo elissoncardoso1/routini \
    --clobber

echo "✅ Upload concluído!"
echo "🌐 Acesse: https://github.com/elissoncardoso1/routini/releases/tag/v0.1.1" 