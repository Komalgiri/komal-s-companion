export interface ElectronAPI {
  showOverlay: () => void;
  hideOverlay: () => void;
  taskCompleted: () => void;
  taskSnoozed: () => void;
  onTaskCompletedFromOverlay: (callback: () => void) => void;
  onTaskSnoozedFromOverlay: (callback: () => void) => void;
  removeTaskCompletedListener: () => void;
  removeTaskSnoozedListener: () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
