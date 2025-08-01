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
