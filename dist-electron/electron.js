"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path_1 = __importDefault(require("path"));
function createWindow() {
    var win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false, // Permite carregar recursos locais
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
        var indexPath = path_1.default.join(__dirname, '../dist/index.html');
        console.log('Carregando arquivo:', indexPath);
        // Verificar se o arquivo existe
        var fs = require('fs');
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
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
