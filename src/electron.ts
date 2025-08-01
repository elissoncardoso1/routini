import { app, BrowserWindow } from 'electron';
import path from 'path';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // Permite carregar recursos locais
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
    win.loadFile(indexPath);
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