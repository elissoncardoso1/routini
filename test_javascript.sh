#!/bin/bash

echo "🧪 Testando carregamento de JavaScript..."

# 1. Verificar se o arquivo principal existe
echo "📦 Verificando arquivo principal..."
if [ -f "dist/assets/index-B_AN0Jja.js" ]; then
    echo "✅ Arquivo JavaScript principal encontrado"
    echo "📏 Tamanho: $(ls -lh dist/assets/index-B_AN0Jja.js | awk '{print $5}')"
else
    echo "❌ Arquivo JavaScript principal não encontrado"
    exit 1
fi

# 2. Verificar se o HTML referencia o arquivo correto
echo "🔗 Verificando referências no HTML..."
if grep -q "index-B_AN0Jja.js" dist/index.html; then
    echo "✅ HTML referencia o arquivo JavaScript correto"
else
    echo "❌ HTML não referencia o arquivo JavaScript correto"
    echo "📄 Referências encontradas:"
    grep -o 'index-[^"]*\.js' dist/index.html
fi

# 3. Verificar se todos os assets existem
echo "📁 Verificando todos os assets..."
for asset in $(grep -o 'href="[^"]*"' dist/index.html | sed 's/href="//' | sed 's/"//'); do
    if [ -f "dist/$asset" ]; then
        echo "✅ $asset"
    else
        echo "❌ $asset (não encontrado)"
    fi
done

# 4. Verificar se os scripts existem
echo "📜 Verificando scripts..."
for script in $(grep -o 'src="[^"]*"' dist/index.html | sed 's/src="//' | sed 's/"//'); do
    if [ -f "dist/$script" ]; then
        echo "✅ $script"
    else
        echo "❌ $script (não encontrado)"
    fi
done

# 5. Verificar configurações do Electron
echo "⚙️ Verificando configurações do Electron..."
if grep -q "loadURL" src/electron.ts; then
    echo "✅ Electron usando loadURL"
else
    echo "❌ Electron não configurado com loadURL"
fi

if grep -q "webSecurity: false" src/electron.ts; then
    echo "✅ webSecurity desabilitado"
else
    echo "❌ webSecurity não desabilitado"
fi

# 6. Verificar logs de console
echo "📝 Verificando logs de console..."
if grep -q "console.log" src/electron.ts; then
    echo "✅ Logs de console habilitados"
else
    echo "❌ Logs de console não encontrados"
fi

echo ""
echo "🎯 Teste de JavaScript concluído!"
echo ""
echo "📋 Para testar no Windows:"
echo "1. Execute: release/Routini-Setup-0.1.2.exe"
echo "2. Abra DevTools (F12)"
echo "3. Verifique a aba Console"
echo "4. Procure por mensagens de erro"
echo "5. Verifique se o React carrega" 