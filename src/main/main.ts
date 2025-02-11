import { app, BrowserWindow, screen, globalShortcut, ipcMain } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
let isClickThrough = true;
let isOverlayVisible = true;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.setIgnoreMouseEvents(isClickThrough, { forward: true });
  
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    isClickThrough = !isClickThrough;
    mainWindow?.setIgnoreMouseEvents(isClickThrough, { forward: true });
    mainWindow?.webContents.send('click-through-changed', isClickThrough);
  });

  globalShortcut.register('CommandOrControl+Shift+O', () => {
    isOverlayVisible = !isOverlayVisible;
    mainWindow?.webContents.send('overlay-visibility-changed', isOverlayVisible);
    console.log('Visibility toggled:', isOverlayVisible);  // デバッグ用
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.loadFile('dist/index.html');
}

app.whenReady().then(createWindow);

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
