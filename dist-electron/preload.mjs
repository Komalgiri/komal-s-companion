let electron = require("electron");
//#region electron/preload.ts
electron.contextBridge.exposeInMainWorld("electronAPI", {
	showOverlay: () => electron.ipcRenderer.send("show-overlay"),
	hideOverlay: () => electron.ipcRenderer.send("hide-overlay"),
	taskCompleted: () => electron.ipcRenderer.send("overlay-task-completed"),
	taskSnoozed: () => electron.ipcRenderer.send("overlay-task-snoozed"),
	onTaskCompletedFromOverlay: (callback) => {
		electron.ipcRenderer.on("task-completed-from-overlay", callback);
	},
	onTaskSnoozedFromOverlay: (callback) => {
		electron.ipcRenderer.on("task-snoozed-from-overlay", callback);
	},
	removeTaskCompletedListener: () => {
		electron.ipcRenderer.removeAllListeners("task-completed-from-overlay");
	},
	removeTaskSnoozedListener: () => {
		electron.ipcRenderer.removeAllListeners("task-snoozed-from-overlay");
	}
});
//#endregion
