#!/bin/bash

echo "🌐 Criando build web simples..."

# 1. Build do projeto
echo "📦 Fazendo build..."
npm run build

# 2. Copiar para pasta web
echo "📁 Copiando arquivos..."
mkdir -p web
cp -r dist/* web/
cp public/manifest.json web/
cp public/sw.js web/

# 3. Criar index.html otimizado
echo "📄 Criando index.html otimizado..."
cat > web/index.html << 'EOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Sistema de gerenciamento de escalas e agendamentos - Routini" />
    <meta name="theme-color" content="#3b82f6" />
    <link rel="manifest" href="./manifest.json" />
    <title>Routini - Gerenciamento de Escalas</title>
    <link rel="stylesheet" crossorigin href="./assets/index-D2CgPU_D.css">
</head>
<body>
    <div id="root"></div>
    <script type="module" crossorigin src="./assets/index-BTVIKfVS.js"></script>
    <script>
        // Registrar service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then((registration) => {
                        console.log('✅ Service Worker registrado');
                    })
                    .catch((error) => {
                        console.log('❌ Service Worker falhou:', error);
                    });
            });
        }
    </script>
</body>
</html>
EOF

# 4. Criar servidor local simples
echo "🚀 Criando servidor local..."
cat > web/server.py << 'EOF'
#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"🌐 Servidor rodando em http://localhost:{PORT}")
    print("📱 Abra no navegador para testar")
    print("💡 Pressione Ctrl+C para parar")
    httpd.serve_forever()
EOF

chmod +x web/server.py

echo "✅ Build web criado!"
echo ""
echo "📋 Para testar:"
echo "1. cd web"
echo "2. python3 server.py"
echo "3. Abra http://localhost:8000"
echo ""
echo "📱 Para instalar como PWA:"
echo "1. Abra no Chrome/Edge"
echo "2. Clique em 'Instalar' na barra de endereços"
echo "3. O app será instalado como PWA" 