"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
// Informações do aplicativo
var APP_NAME = 'Routini';
var APP_VERSION = process.env.npm_package_version || '0.1.3-pwa';
var APP_REPOSITORY = 'https://github.com/elissoncardoso1/routini';
function createWindow() {
    var win = new electron_1.BrowserWindow({
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
        var indexPath = path_1.default.join(__dirname, '../dist/index.html');
        console.log('Carregando arquivo:', indexPath);
        // Verificar se o arquivo existe
        if (fs_1.default.existsSync(indexPath)) {
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
