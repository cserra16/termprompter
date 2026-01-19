const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Load a demo file
    loadDemo: (filePath) => ipcRenderer.invoke('load-demo', filePath),

    // Open file dialog to select a demo
    openDemoDialog: () => ipcRenderer.invoke('open-demo-dialog'),

    // Save demo file
    saveDemo: (filePath, content) => ipcRenderer.invoke('save-demo', filePath, content),

    // Save to library (AI-generated demos)
    saveToLibrary: (filename, content) => ipcRenderer.invoke('save-to-library', filename, content),

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
    },

    // Terminal detach/attach API
    detachTerminal: () => ipcRenderer.invoke('detach-terminal'),
    attachTerminal: () => ipcRenderer.invoke('attach-terminal'),
    onTerminalDetached: (callback) => {
        ipcRenderer.on('terminal-detached', () => callback());
    },
    onTerminalAttached: (callback) => {
        ipcRenderer.on('terminal-attached', () => callback());
    },

    // Command execution notification (for auto-advance with detached terminal)
    notifyCommandExecuted: (command) => ipcRenderer.send('command-executed', command),
    onCommandExecuted: (callback) => {
        ipcRenderer.on('command-executed', (event, command) => callback(command));
    },

    // Recording API
    startRecording: (options) => ipcRenderer.invoke('start-recording', options),
    stopRecording: () => ipcRenderer.invoke('stop-recording'),
    saveRecording: (filePath) => ipcRenderer.invoke('save-recording', filePath),
    getRecordingStats: () => ipcRenderer.invoke('get-recording-stats'),

    // AI Generation API
    generateWithOpenAI: (config) => ipcRenderer.invoke('ai-generate-openai', config),
    generateWithAnthropic: (config) => ipcRenderer.invoke('ai-generate-anthropic', config),

    // Debug: save to gtp-files
    saveToGtpFiles: (filename, content) => ipcRenderer.invoke('save-to-gtp-files', filename, content),

    // Docker API
    startDockerSession: (dockerConfig, basePath) => ipcRenderer.invoke('start-docker-session', dockerConfig, basePath),
    stopDockerSession: () => ipcRenderer.invoke('stop-docker-session'),
    getDockerStatus: () => ipcRenderer.invoke('get-docker-status'),
    checkDockerAvailable: () => ipcRenderer.invoke('check-docker-available'),
    onDockerPullProgress: (callback) => {
        ipcRenderer.on('docker-pull-progress', (event, progress) => callback(progress));
    },
    onDockerSessionEnded: (callback) => {
        ipcRenderer.on('docker-session-ended', () => callback());
    },
    removeDockerListeners: () => {
        ipcRenderer.removeAllListeners('docker-pull-progress');
        ipcRenderer.removeAllListeners('docker-session-ended');
    }
});
