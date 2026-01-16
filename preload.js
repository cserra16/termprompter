const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Load a demo file
    loadDemo: (filePath) => ipcRenderer.invoke('load-demo', filePath),

    // Open file dialog to select a demo
    openDemoDialog: () => ipcRenderer.invoke('open-demo-dialog'),

    // Window controls
    closeWindow: () => ipcRenderer.send('close-window'),
    minimizeWindow: () => ipcRenderer.send('minimize-window'),

    // Terminal API
    terminalInput: (data) => ipcRenderer.send('terminal-input', data),
    terminalResize: (cols, rows) => ipcRenderer.send('terminal-resize', { cols, rows }),
    terminalWriteCommand: (command) => ipcRenderer.send('terminal-write-command', command),
    onTerminalData: (callback) => {
        ipcRenderer.on('terminal-data', (event, data) => callback(data));
    },
    removeTerminalListeners: () => {
        ipcRenderer.removeAllListeners('terminal-data');
    }
});
