#!/bin/bash

echo "🧪 Testando PWA do Routini..."

# 1. Verificar se o servidor está rodando
echo "🌐 Verificando servidor..."
if curl -s http://localhost:8000 > /dev/null; then
    echo "✅ Servidor rodando em http://localhost:8000"
else
    echo "❌ Servidor não está rodando"
    echo "💡 Execute: cd web && python3 server.py"
    exit 1
fi

# 2. Verificar se os arquivos principais existem
echo "📁 Verificando arquivos..."
if [ -f "web/index.html" ]; then
    echo "✅ index.html encontrado"
else
    echo "❌ index.html não encontrado"
fi

if [ -f "web/manifest.json" ]; then
    echo "✅ manifest.json encontrado"
else
    echo "❌ manifest.json não encontrado"
fi

if [ -f "web/sw.js" ]; then
    echo "✅ service worker encontrado"
else
    echo "❌ service worker não encontrado"
fi

# 3. Verificar se os assets existem
echo "📦 Verificando assets..."
if [ -f "web/assets/index-BTVIKfVS.js" ]; then
    echo "✅ JavaScript principal encontrado"
else
    echo "❌ JavaScript principal não encontrado"
fi

if [ -f "web/assets/index-D2CgPU_D.css" ]; then
    echo "✅ CSS principal encontrado"
else
    echo "❌ CSS principal não encontrado"
fi

# 4. Verificar manifest.json
echo "📋 Verificando manifest.json..."
if grep -q '"name"' web/manifest.json; then
    echo "✅ Manifest válido"
else
    echo "❌ Manifest inválido"
fi

# 5. Testar carregamento da página
echo "🌐 Testando carregamento..."
RESPONSE=$(curl -s http://localhost:8000)
if echo "$RESPONSE" | grep -q "Routini"; then
    echo "✅ Página carrega corretamente"
else
    echo "❌ Página não carrega"
fi

echo ""
echo "🎯 Teste da PWA concluído!"
echo ""
echo "📱 Para testar no navegador:"
echo "1. Abra: http://localhost:8000"
echo "2. Abra DevTools (F12)"
echo "3. Vá para aba Application"
echo "4. Verifique se o Service Worker está registrado"
echo ""
echo "📲 Para instalar como PWA:"
echo "1. Abra no Chrome/Edge"
echo "2. Clique em 'Instalar' na barra de endereços"
echo "3. O app será instalado como PWA nativo"
echo ""
echo "🔍 Para verificar logs:"
echo "1. Abra DevTools (F12)"
echo "2. Vá para aba Console"
echo "3. Procure por 'Service Worker registrado'" 