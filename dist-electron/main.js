import { BrowserWindow, Menu, Tray, app, ipcMain, screen } from "electron";
import path from "path";
import { fileURLToPath } from "url";
//#region electron/main.ts
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var mainWindow = null;
var overlayWindow = null;
var tray = null;
var isQuitting = false;
var VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 1e3,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, "preload.mjs"),
			nodeIntegration: false,
			contextIsolation: true
		}
	});
	if (VITE_DEV_SERVER_URL) mainWindow.loadURL(VITE_DEV_SERVER_URL);
	else mainWindow.loadFile(path.join(__dirname, "../dist/client/index.html"));
	mainWindow.on("close", (event) => {
		if (!isQuitting) {
			event.preventDefault();
			mainWindow?.hide();
		}
	});
	mainWindow.on("closed", () => {
		mainWindow = null;
		if (overlayWindow) overlayWindow.close();
	});
}
function createTray() {
	const iconPath = path.join(__dirname, "../public/favicon.ico");
	tray = new Tray(iconPath);
	const contextMenu = Menu.buildFromTemplate([
		{
			label: "Show Tiny Komal",
			click: () => {
				if (mainWindow) mainWindow.show();
				else createMainWindow();
			}
		},
		{ type: "separator" },
		{
			label: "Quit",
			click: () => {
				isQuitting = true;
				app.quit();
			}
		}
	]);
	tray.setToolTip("Tiny Komal");
	tray.setContextMenu(contextMenu);
	tray.on("click", () => {
		if (mainWindow) {
			if (mainWindow.isVisible()) mainWindow.hide();
			else mainWindow.show();
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
		show: false,
		webPreferences: {
			preload: path.join(__dirname, "preload.mjs"),
			nodeIntegration: false,
			contextIsolation: true
		}
	});
	overlayWindow.setIgnoreMouseEvents(true, { forward: true });
	if (VITE_DEV_SERVER_URL) overlayWindow.loadURL(`${VITE_DEV_SERVER_URL}/overlay`);
	else overlayWindow.loadFile(path.join(__dirname, "../dist/client/index.html"), { hash: "overlay" });
	overlayWindow.on("closed", () => {
		overlayWindow = null;
	});
}
app.whenReady().then(() => {
	createMainWindow();
	createOverlayWindow();
	createTray();
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createMainWindow();
			createOverlayWindow();
		}
	});
});
app.on("window-all-closed", () => {
	if (process.platform !== "darwin" && isQuitting) app.quit();
});
ipcMain.on("restore-main-window", () => {
	if (mainWindow) {
		mainWindow.show();
		if (mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.focus();
	} else createMainWindow();
});
ipcMain.on("show-overlay", () => {
	if (overlayWindow) {
		overlayWindow.setIgnoreMouseEvents(false);
		overlayWindow.showInactive();
	}
});
ipcMain.on("hide-overlay", () => {
	if (overlayWindow) overlayWindow.hide();
});
ipcMain.on("overlay-task-completed", () => {
	if (mainWindow) mainWindow.webContents.send("task-completed-from-overlay");
	if (overlayWindow) overlayWindow.hide();
});
ipcMain.on("overlay-task-snoozed", () => {
	if (mainWindow) mainWindow.webContents.send("task-snoozed-from-overlay");
	if (overlayWindow) overlayWindow.hide();
});
//#endregion
export {};
