const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Load a demo file
    loadDemo: (filePath) => ipcRenderer.invoke('load-demo', filePath),

    // Open file dialog to select a demo
    openDemoDialog: () => ipcRenderer.invoke('open-demo-dialog'),

    // Window controls
    closeWindow: () => ipcRenderer.send('close-window'),
    minimizeWindow: () => ipcRenderer.send('minimize-window')
});
