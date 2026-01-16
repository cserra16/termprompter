const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Window takes ~35% width on the left side
  const windowWidth = Math.floor(width * 0.35);
  const windowHeight = height;

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: 0,
    y: 0,
    frame: false,
    transparent: false,
    backgroundColor: '#1a1a2e',
    resizable: true,
    alwaysOnTop: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

// IPC Handlers
ipcMain.handle('load-demo', async (event, filePath) => {
  try {
    let demoPath = filePath;
    
    // If no path provided, use default demo
    if (!demoPath) {
      demoPath = path.join(__dirname, 'demos', 'example-demo.md');
    }
    
    const content = fs.readFileSync(demoPath, 'utf-8');
    return { success: true, content, filePath: demoPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('open-demo-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown', extensions: ['md'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const content = fs.readFileSync(filePath, 'utf-8');
    return { success: true, content, filePath };
  }

  return { success: false, canceled: true };
});

ipcMain.on('close-window', () => {
  mainWindow.close();
});

ipcMain.on('minimize-window', () => {
  mainWindow.minimize();
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
