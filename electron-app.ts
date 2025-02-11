// main.ts
import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

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

  // クリックスルーを有効化
  mainWindow.setIgnoreMouseEvents(true, { forward: true });

  // 開発時はDevToolsを開く
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  // ホットキーの設定（後で実装）
  setupHotkeys();
}

function setupHotkeys() {
  // TODO: グローバルホットキーの実装
  // - オーバーレイの表示/非表示
  // - マウス操作の有効/無効
  // - 翻訳の実行
}

app.whenReady().then(createWindow);

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

// index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Game Translation Overlay</title>
  <style>
    body {
      margin: 0;
      background: transparent;
    }
    #overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
    }
    .translation-box {
      position: absolute;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px;
      border-radius: 5px;
      pointer-events: auto;
    }
  </style>
</head>
<body>
  <div id="overlay"></div>
  <script src="./dist/renderer.js"></script>
</body>
</html>

// package.json
{
  "name": "game-translation-overlay",
  "version": "0.1.0",
  "main": "dist/main.js",
  "scripts": {
    "start": "electron .",
    "dev": "NODE_ENV=development electron .",
    "build": "tsc"
  },
  "devDependencies": {
    "electron": "latest",
    "typescript": "latest",
    "@types/node": "latest"
  }
}