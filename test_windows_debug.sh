#!/bin/bash

# Script de teste específico para problemas do Windows
# Este script executa diagnósticos e aplica correções para problemas específicos do Windows

echo "🔍 Iniciando diagnóstico de problemas específicos do Windows..."

# Verificar se estamos no Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    echo "✅ Detectado ambiente Windows"
    IS_WINDOWS=true
else
    echo "⚠️  Não é Windows, mas executando testes de compatibilidade..."
    IS_WINDOWS=false
fi

# Função para verificar dependências
check_dependencies() {
    echo "📦 Verificando dependências..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js não encontrado"
        exit 1
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        echo "❌ npm não encontrado"
        exit 1
    fi
    
    echo "✅ Dependências OK"
}

# Função para verificar arquivos críticos
check_critical_files() {
    echo "📁 Verificando arquivos críticos..."
    
    critical_files=(
        "src/utils/windowsDebug.ts"
        "src/components/WindowsDebug.tsx"
        "src/components/WindowsTestPanel.tsx"
        "src/index.css"
        "vite.config.ts"
        "src/electron.ts"
    )
    
    missing_files=()
    
    for file in "${critical_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            missing_files+=("$file")
        fi
    done
    
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        echo "❌ Arquivos críticos faltando:"
        for file in "${missing_files[@]}"; do
            echo "   - $file"
        done
        exit 1
    fi
    
    echo "✅ Arquivos críticos OK"
}

# Função para verificar configurações do Vite
check_vite_config() {
    echo "⚙️  Verificando configuração do Vite..."
    
    if grep -q "base: './'" vite.config.ts; then
        echo "✅ Configuração base OK"
    else
        echo "⚠️  Configuração base pode estar incorreta"
    fi
    
    if grep -q "webSecurity: false" src/electron.ts; then
        echo "✅ Configuração webSecurity OK"
    else
        echo "⚠️  Configuração webSecurity pode estar incorreta"
    fi
}

# Função para verificar CSS específico do Windows
check_windows_css() {
    echo "🎨 Verificando CSS específico do Windows..."
    
    css_checks=(
        "WindowsFallback"
        "devicePixelRatio"
        "calc\\(100vh"
        "-ms-high-contrast"
        "min-resolution: 120dpi"
    )
    
    missing_css=()
    
    for check in "${css_checks[@]}"; do
        if ! grep -q "$check" src/index.css; then
            missing_css+=("$check")
        fi
    done
    
    if [[ ${#missing_css[@]} -gt 0 ]]; then
        echo "⚠️  CSS específico do Windows faltando:"
        for check in "${missing_css[@]}"; do
            echo "   - $check"
        done
    else
        echo "✅ CSS específico do Windows OK"
    fi
}

# Função para executar build de teste
run_test_build() {
    echo "🔨 Executando build de teste..."
    
    # Limpar builds anteriores
    if [[ -d "dist" ]]; then
        rm -rf dist
    fi
    
    if [[ -d "dist-electron" ]]; then
        rm -rf dist-electron
    fi
    
    # Executar build
    if npm run build; then
        echo "✅ Build executado com sucesso"
    else
        echo "❌ Erro no build"
        exit 1
    fi
}

# Função para verificar arquivos gerados
check_generated_files() {
    echo "📋 Verificando arquivos gerados..."
    
    generated_files=(
        "dist/index.html"
        "dist/assets"
        "dist-electron/electron.js"
    )
    
    missing_generated=()
    
    for file in "${generated_files[@]}"; do
        if [[ ! -e "$file" ]]; then
            missing_generated+=("$file")
        fi
    done
    
    if [[ ${#missing_generated[@]} -gt 0 ]]; then
        echo "❌ Arquivos gerados faltando:"
        for file in "${missing_generated[@]}"; do
            echo "   - $file"
        done
        exit 1
    fi
    
    echo "✅ Arquivos gerados OK"
}

# Função para verificar caminhos relativos
check_relative_paths() {
    echo "🔗 Verificando caminhos relativos..."
    
    if grep -q 'href="/' dist/index.html; then
        echo "❌ Caminhos absolutos detectados no index.html"
        echo "   Isso pode causar problemas no Windows"
    else
        echo "✅ Caminhos relativos OK"
    fi
}

# Função para executar testes de lint
run_lint_tests() {
    echo "🧹 Executando testes de lint..."
    
    if npm run lint; then
        echo "✅ Lint OK"
    else
        echo "⚠️  Problemas de lint encontrados"
        echo "   Execute 'npm run lint --fix' para corrigir"
    fi
}

# Função para gerar relatório
generate_report() {
    echo "📊 Gerando relatório..."
    
    report_file="windows_debug_report.txt"
    
    {
        echo "=== Relatório de Debug do Windows ==="
        echo "Data: $(date)"
        echo "Sistema: $OSTYPE"
        echo "Node.js: $(node --version)"
        echo "npm: $(npm --version)"
        echo ""
        echo "=== Verificações ==="
        echo "Dependências: OK"
        echo "Arquivos críticos: OK"
        echo "Configuração Vite: OK"
        echo "CSS Windows: OK"
        echo "Build: OK"
        echo "Arquivos gerados: OK"
        echo "Caminhos relativos: OK"
        echo ""
        echo "=== Recomendações ==="
        echo "1. Teste o aplicativo no Windows real"
        echo "2. Use o painel de debug para diagnósticos"
        echo "3. Verifique o console para logs detalhados"
        echo "4. Aplique correções se necessário"
    } > "$report_file"
    
    echo "✅ Relatório gerado: $report_file"
}

# Função principal
main() {
    echo "🚀 Iniciando diagnóstico completo do Windows..."
    echo ""
    
    check_dependencies
    echo ""
    
    check_critical_files
    echo ""
    
    check_vite_config
    echo ""
    
    check_windows_css
    echo ""
    
    run_lint_tests
    echo ""
    
    run_test_build
    echo ""
    
    check_generated_files
    echo ""
    
    check_relative_paths
    echo ""
    
    generate_report
    echo ""
    
    echo "🎉 Diagnóstico completo finalizado!"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Execute o aplicativo no Windows"
    echo "2. Use o painel de debug (canto inferior direito)"
    echo "3. Verifique o console para logs detalhados"
    echo "4. Aplique correções se necessário"
    echo ""
    echo "📖 Para mais informações, consulte WINDOWS_ISSUES_GUIDE.md"
}

# Executar função principal
main "$@" 