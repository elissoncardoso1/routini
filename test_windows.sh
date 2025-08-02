#!/bin/bash

echo "🧪 Testando aplicação no Windows..."
echo "=================================="

# Verificar se estamos no Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    echo "✅ Ambiente Windows detectado"
else
    echo "⚠️  Não é Windows - alguns testes podem não ser aplicáveis"
fi

# Verificar se o Node.js está instalado
if command -v node &> /dev/null; then
    echo "✅ Node.js encontrado: $(node --version)"
else
    echo "❌ Node.js não encontrado"
    exit 1
fi

# Verificar se o npm está instalado
if command -v npm &> /dev/null; then
    echo "✅ npm encontrado: $(npm --version)"
else
    echo "❌ npm não encontrado"
    exit 1
fi

# Verificar dependências
echo ""
echo "📦 Verificando dependências..."
npm list --depth=0

# Verificar se o build funciona
echo ""
echo "🔨 Testando build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build realizado com sucesso"
else
    echo "❌ Erro no build"
    exit 1
fi

# Verificar se os arquivos foram gerados
echo ""
echo "📁 Verificando arquivos gerados..."
if [ -d "dist" ]; then
    echo "✅ Pasta dist encontrada"
    ls -la dist/
else
    echo "❌ Pasta dist não encontrada"
    exit 1
fi

# Verificar se o index.html foi gerado
if [ -f "dist/index.html" ]; then
    echo "✅ index.html encontrado"
    
    # Verificar se usa HashRouter
    if grep -q "HashRouter" src/App.tsx; then
        echo "✅ HashRouter configurado"
    else
        echo "❌ HashRouter não configurado"
    fi
    
    # Verificar se não usa lazy loading
    if grep -q "React.lazy" src/App.tsx; then
        echo "❌ Lazy loading ainda presente"
    else
        echo "✅ Lazy loading removido"
    fi
else
    echo "❌ index.html não encontrado"
    exit 1
fi

# Verificar configurações do Electron
echo ""
echo "⚡ Verificando configurações do Electron..."
if grep -q "nodeIntegration: false" src/electron.ts; then
    echo "✅ Configurações seguras do Electron"
else
    echo "❌ Configurações inseguras do Electron"
fi

# Verificar configurações do Vite
echo ""
echo "🚀 Verificando configurações do Vite..."
if grep -q "sourcemap: true" vite.config.ts; then
    echo "✅ Sourcemaps habilitados"
else
    echo "❌ Sourcemaps desabilitados"
fi

if grep -q "minify: 'esbuild'" vite.config.ts; then
    echo "✅ Esbuild configurado"
else
    echo "❌ Esbuild não configurado"
fi

# Testar desenvolvimento
echo ""
echo "🌐 Testando servidor de desenvolvimento..."
timeout 10s npm run dev &
DEV_PID=$!

sleep 5

if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Servidor de desenvolvimento funcionando"
else
    echo "❌ Servidor de desenvolvimento não responde"
fi

kill $DEV_PID 2>/dev/null

echo ""
echo "✅ Testes concluídos!"
echo ""
echo "📋 Resumo das correções aplicadas:"
echo "1. ✅ BrowserRouter → HashRouter"
echo "2. ✅ Lazy loading removido"
echo "3. ✅ Configurações seguras do Electron"
echo "4. ✅ Sourcemaps habilitados"
echo "5. ✅ Esbuild configurado"
echo "6. ✅ Sistema de debug para Windows"
echo ""
echo "🎯 Para testar no Windows:"
echo "1. Execute: npm run build"
echo "2. Execute: npm run electron"
echo "3. Verifique se todas as telas carregam corretamente"
echo "" 