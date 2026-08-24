import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  showOverlay: () => ipcRenderer.send('show-overlay'),
  hideOverlay: () => ipcRenderer.send('hide-overlay'),
  restoreMainWindow: () => ipcRenderer.send('restore-main-window'),
  taskCompleted: () => ipcRenderer.send('overlay-task-completed'),
  taskSnoozed: () => ipcRenderer.send('overlay-task-snoozed'),
  onTaskCompletedFromOverlay: (callback: () => void) => {
    ipcRenderer.on('task-completed-from-overlay', callback);
  },
  onTaskSnoozedFromOverlay: (callback: () => void) => {
    ipcRenderer.on('task-snoozed-from-overlay', callback);
  },
  removeTaskCompletedListener: () => {
    ipcRenderer.removeAllListeners('task-completed-from-overlay');
  },
  removeTaskSnoozedListener: () => {
    ipcRenderer.removeAllListeners('task-snoozed-from-overlay');
  }
});
