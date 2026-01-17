const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const pty = require('node-pty');
const TerminalRecorder = require('./recorder');

let mainWindow;
let ptyProcess = null;
let recorder = new TerminalRecorder();

// Determine shell based on platform
function getShell() {
  if (process.platform === 'win32') {
    return process.env.COMSPEC || 'cmd.exe';
  }
  return process.env.SHELL || '/bin/bash';
}

function createWindow() {
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Window now takes full width for sidebar + terminal
  const windowWidth = Math.floor(width * 0.9);
  const windowHeight = Math.floor(height * 0.9);

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: Math.floor((width - windowWidth) / 2),
    y: Math.floor((height - windowHeight) / 2),
    frame: false,
    transparent: false,
    backgroundColor: '#1a1a2e',
    resizable: true,
    alwaysOnTop: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Create PTY process
  createPty();

  mainWindow.on('closed', () => {
    if (ptyProcess) {
      ptyProcess.kill();
      ptyProcess = null;
    }
  });
}

function createPty() {
  const shell = getShell();
  const homeDir = os.homedir();

  // Determine shell arguments for minimal prompt
  let shellArgs = [];

  if (shell.includes('zsh')) {
    // For zsh: start interactive shell, then set prompt
    shellArgs = ['-i'];
  } else if (shell.includes('bash')) {
    // For bash: use --norc to skip .bashrc, set PS1 via --init-file or argument
    shellArgs = ['--norc', '--noprofile'];
  }

  // Create environment with minimal prompt settings
  const minimalEnv = {
    ...process.env,
    // Minimal prompt for bash
    PS1: '\\[\\033[32m\\]$\\[\\033[0m\\] ',
    // Minimal prompt for zsh (green $ )
    PROMPT: '%F{green}$%f ',
    // Disable right prompt in zsh
    RPROMPT: '',
    RPS1: '',
    // Ensure colors work
    TERM: 'xterm-256color',
    CLICOLOR: '1',
  };

  ptyProcess = pty.spawn(shell, shellArgs, {
    name: 'xterm-256color',
    cols: 80,
    rows: 24,
    cwd: homeDir,
    env: minimalEnv
  });

  // For zsh, send command to override prompt after shell starts
  if (shell.includes('zsh')) {
    setTimeout(() => {
      if (ptyProcess) {
        ptyProcess.write('PROMPT="%F{green}$%f " && RPROMPT="" && clear\n');
      }
    }, 100);
  }

  // Forward PTY output to renderer
  ptyProcess.onData((data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('terminal-data', data);
    }

    // Record output if recording is active
    recorder.recordOutput(data);
  });

  ptyProcess.onExit(({ exitCode }) => {
    console.log(`PTY exited with code ${exitCode}`);
  });
}

// IPC Handlers
ipcMain.handle('load-demo', async (event, filePath) => {
  try {
    let demoPath = filePath;

    // If no path provided, use default demo
    if (!demoPath) {
      demoPath = path.join(__dirname, 'demos', 'example-demo.md');
    }

    const content = fs.readFileSync(demoPath, 'utf-8');
    return { success: true, content, filePath: demoPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('open-demo-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    defaultPath: path.join(__dirname, 'library'),
    properties: ['openFile'],
    filters: [
      { name: 'Markdown', extensions: ['md'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const content = fs.readFileSync(filePath, 'utf-8');
    return { success: true, content, filePath };
  }

  return { success: false, canceled: true };
});

ipcMain.handle('save-demo', async (event, filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true, filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Terminal IPC
ipcMain.on('terminal-input', (event, data) => {
  if (ptyProcess) {
    ptyProcess.write(data);

    // Record input if recording is active
    recorder.recordInput(data);
  }
});

ipcMain.on('terminal-resize', (event, { cols, rows }) => {
  if (ptyProcess) {
    ptyProcess.resize(cols, rows);

    // Update recording dimensions if recording is active
    recorder.updateDimensions(cols, rows);
  }
});

ipcMain.on('terminal-write-command', (event, command) => {
  if (ptyProcess) {
    // Write command to terminal (user can press Enter to execute)
    ptyProcess.write(command);
  }
});

// Recording IPC handlers
ipcMain.handle('start-recording', async (event, options = {}) => {
  try {
    // Get current terminal dimensions if not provided
    if (!options.cols || !options.rows) {
      const dims = await mainWindow.webContents.executeJavaScript(
        'window.terminalComponent?.fitAddon?.proposeDimensions() || {cols: 80, rows: 24}'
      );
      options.cols = options.cols || dims.cols;
      options.rows = options.rows || dims.rows;
    }

    // Set environment info
    options.env = {
      TERM: process.env.TERM || 'xterm-256color',
      SHELL: getShell()
    };

    const success = recorder.startRecording(options);
    return { success, message: success ? 'Recording started' : 'Recording already in progress' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('stop-recording', async () => {
  try {
    const success = recorder.stopRecording();
    const stats = recorder.getStats();
    return { success, stats, message: success ? 'Recording stopped' : 'No recording in progress' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-recording', async (event, customPath = null) => {
  try {
    let filePath = customPath;

    if (!filePath) {
      // Show save dialog
      const result = await dialog.showSaveDialog(mainWindow, {
        title: 'Save Terminal Recording',
        defaultPath: path.join(os.homedir(), 'Downloads', recorder.generateFilename()),
        filters: [
          { name: 'Asciinema Cast', extensions: ['cast'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (result.canceled) {
        return { success: false, canceled: true };
      }

      filePath = result.filePath;
    }

    const savedPath = await recorder.saveRecording(filePath);
    return { success: true, filePath: savedPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-recording-stats', async () => {
  try {
    const stats = recorder.getStats();
    const isRecording = recorder.isRecording;
    return { success: true, stats, isRecording };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.on('close-window', () => {
  mainWindow.close();
});

ipcMain.on('minimize-window', () => {
  mainWindow.minimize();
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (ptyProcess) {
    ptyProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
