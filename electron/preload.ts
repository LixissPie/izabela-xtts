import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  storeGet: (key: string) => ipcRenderer.invoke('electron-store-get', key),
  storeSet: (key: string, value: any) => ipcRenderer.invoke('electron-store-set', { key, value }),
  storeDelete: (key: string) => ipcRenderer.invoke('electron-store-delete', key),
  storeHas: (key: string) => ipcRenderer.invoke('electron-store-has', key),
});