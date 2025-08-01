import { app, BrowserWindow } from 'electron';
import path from 'path';
function createWindow() {
    var win = new BrowserWindow({
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
        var indexPath = path.join(__dirname, '../dist/index.html');
        console.log('Carregando arquivo:', indexPath);
        // Verificar se o arquivo existe
        var fs = require('fs');
        if (fs.existsSync(indexPath)) {
            console.log('✅ Arquivo index.html encontrado');
            win.loadFile(indexPath);
            // Abrir DevTools em produção para debug
            win.webContents.openDevTools();
            // Log de erros
            win.webContents.on('did-fail-load', function (event, errorCode, errorDescription) {
                console.error('❌ Erro ao carregar:', errorCode, errorDescription);
            });
            win.webContents.on('did-finish-load', function () {
                console.log('✅ Página carregada com sucesso');
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
