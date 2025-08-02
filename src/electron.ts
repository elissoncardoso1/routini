import { app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';

// Informações do aplicativo
const APP_NAME = 'Routini';
const APP_VERSION = process.env.npm_package_version || '0.1.3-pwa';
const APP_REPOSITORY = 'https://github.com/elissoncardoso1/routini';

function createWindow() {
  const win = new BrowserWindow({
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
  } else {
    // Em produção, carrega do arquivo local
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('Carregando arquivo:', indexPath);
    
    // Verificar se o arquivo existe
    if (fs.existsSync(indexPath)) {
      console.log('✅ Arquivo index.html encontrado');
      
      // Usar protocolo file:// para melhor compatibilidade
      const fileUrl = `file://${indexPath}`;
      console.log('🌐 Carregando URL:', fileUrl);
      
      win.loadURL(fileUrl);
      
      // Abrir DevTools em produção para debug
      win.webContents.openDevTools();
      
      // Log de erros
      win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('❌ Erro ao carregar:', errorCode, errorDescription);
      });
      
      win.webContents.on('did-finish-load', () => {
        console.log('✅ Página carregada com sucesso');
      });
      
      // Log de console para debug
      win.webContents.on('console-message', (event, level, message) => {
        console.log(`📝 Console [${level}]:`, message);
      });
      
    } else {
      console.error('❌ Arquivo index.html não encontrado em:', indexPath);
    }
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 