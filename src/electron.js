import { app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
// Informações do aplicativo
var APP_NAME = 'Routini';
var APP_VERSION = process.env.npm_package_version || '0.1.3-pwa';
var APP_REPOSITORY = 'https://github.com/elissoncardoso1/routini';
function createWindow() {
    var win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false, // Segurança: desabilitar integração Node.js
            contextIsolation: true, // Segurança: isolar contexto
            webSecurity: true, // Segurança: habilitar web security
            devTools: true // Sempre habilitar DevTools para debug
        }
    });
    // Em desenvolvimento, carrega do servidor Vite
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173');
        // Abrir DevTools em desenvolvimento
        win.webContents.openDevTools();
    }
    else {
        // Em produção, carrega do arquivo local
        var indexPath = path.join(__dirname, '../dist/index.html');
        console.log('Carregando arquivo:', indexPath);
        // Verificar se o arquivo existe
        if (fs.existsSync(indexPath)) {
            console.log('✅ Arquivo index.html encontrado');
            // Usar protocolo file:// para melhor compatibilidade
            var fileUrl = "file://".concat(indexPath);
            console.log('🌐 Carregando URL:', fileUrl);
            win.loadURL(fileUrl);
            // Abrir DevTools em produção para debug
            win.webContents.openDevTools();
            // Log de erros
            win.webContents.on('did-fail-load', function (event, errorCode, errorDescription) {
                console.error('❌ Erro ao carregar:', errorCode, errorDescription);
            });
            win.webContents.on('did-finish-load', function () {
                console.log('✅ Página carregada com sucesso');
            });
            // Log de console para debug
            win.webContents.on('console-message', function (event, level, message) {
                console.log("\uD83D\uDCDD Console [".concat(level, "]:"), message);
            });
        }
        else {
            console.error('❌ Arquivo index.html não encontrado em:', indexPath);
        }
    }
}
app.whenReady().then(createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
