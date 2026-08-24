import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow: BrowserWindow | null = null;
let overlayWindow: BrowserWindow | null = null;

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/client/index.html'));
  }

  // When main window loses focus, maybe we want to trigger the overlay?
  // But we let the React app handle this logic and tell us via IPC.
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (overlayWindow) {
      overlayWindow.close();
    }
  });
}

function createOverlayWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  overlayWindow = new BrowserWindow({
    width: 300,
    height: 400,
    x: width - 320,
    y: height - 420,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    show: false, // Initially hidden
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  overlayWindow.setIgnoreMouseEvents(true, { forward: true });

  if (VITE_DEV_SERVER_URL) {
    overlayWindow.loadURL(`${VITE_DEV_SERVER_URL}/overlay`);
  } else {
    overlayWindow.loadFile(path.join(__dirname, '../dist/client/index.html'), { hash: 'overlay' });
  }

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });
}

app.whenReady().then(() => {
  createMainWindow();
  createOverlayWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
      createOverlayWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.on('show-overlay', () => {
  if (overlayWindow) {
    // Make sure it can receive mouse events when it's showing interactive elements
    overlayWindow.setIgnoreMouseEvents(false);
    overlayWindow.showInactive(); // Show without taking focus
  }
});

ipcMain.on('hide-overlay', () => {
  if (overlayWindow) {
    overlayWindow.hide();
  }
});

ipcMain.on('overlay-task-completed', () => {
  // Pass the message to the main window
  if (mainWindow) {
    mainWindow.webContents.send('task-completed-from-overlay');
  }
  if (overlayWindow) {
    overlayWindow.hide();
  }
});

ipcMain.on('overlay-task-snoozed', () => {
  if (mainWindow) {
    mainWindow.webContents.send('task-snoozed-from-overlay');
  }
  if (overlayWindow) {
    overlayWindow.hide();
  }
});
