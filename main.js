const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const pty = require('node-pty');
const yaml = require('js-yaml');
const TerminalRecorder = require('./recorder');
const DockerManager = require('./docker-manager');

let mainWindow;
let terminalWindow = null;
let isTerminalDetached = false;
let ptyProcess = null;
let recorder = new TerminalRecorder();
let dockerManager = new DockerManager();
let isDockerSession = false; // Track if current session is Docker-based

/**
 * Parse YAML frontmatter from markdown content
 * @param {string} content - The markdown content
 * @returns {{ frontmatter: object|null, content: string }}
 */
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (match) {
        try {
            const frontmatter = yaml.load(match[1]);
            return {
                frontmatter,
                content: match[2]
            };
        } catch (error) {
            console.error('[Frontmatter] Error parsing YAML:', error.message);
            return { frontmatter: null, content };
        }
    }

    return { frontmatter: null, content };
}

// Determine shell based on platform
function getShell() {
  if (process.platform === 'win32') {
    // Use PowerShell on Windows for better integration
    return 'powershell.exe';
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

  mainWindow.on('closed', async () => {
    if (ptyProcess) {
      ptyProcess.kill();
      ptyProcess = null;
    }
    // Stop Docker container if active
    if (dockerManager.hasActiveSession()) {
      await dockerManager.stopContainer();
    }
  });
}

function createPty() {
  const shell = getShell();
  const homeDir = os.homedir();

  // Determine shell arguments for minimal prompt
  let shellArgs = [];

  if (shell.includes('powershell')) {
    // For PowerShell: use -NoLogo and -NoProfile for faster startup
    shellArgs = ['-NoLogo', '-NoProfile', '-ExecutionPolicy', 'Bypass'];
  } else if (shell.includes('zsh')) {
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

  // For PowerShell, set a minimal prompt
  if (shell.includes('powershell')) {
    setTimeout(() => {
      if (ptyProcess) {
        ptyProcess.write('function prompt { "PS> " }; cls\n');
      }
    }, 200);
  }

  // Forward PTY output to the appropriate window
  ptyProcess.onData((data) => {
    if (isTerminalDetached && terminalWindow && !terminalWindow.isDestroyed()) {
      terminalWindow.webContents.send('terminal-data', data);
    } else if (mainWindow && !mainWindow.isDestroyed()) {
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

    const rawContent = fs.readFileSync(demoPath, 'utf-8');
    const { frontmatter, content } = parseFrontmatter(rawContent);

    return {
      success: true,
      content,
      filePath: demoPath,
      dockerConfig: frontmatter?.docker || null
    };
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
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, content } = parseFrontmatter(rawContent);

    return {
      success: true,
      content,
      filePath,
      dockerConfig: frontmatter?.docker || null
    };
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

ipcMain.handle('save-to-library', async (event, filename, content) => {
  try {
    const libraryPath = path.join(__dirname, 'library');

    // Create library directory if it doesn't exist
    if (!fs.existsSync(libraryPath)) {
      fs.mkdirSync(libraryPath, { recursive: true });
    }

    const filePath = path.join(libraryPath, filename);
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true, filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-to-gtp-files', async (event, filename, content) => {
  try {
    const gtpPath = path.join(__dirname, 'gtp-files');

    // Create gtp-files directory if it doesn't exist
    if (!fs.existsSync(gtpPath)) {
      fs.mkdirSync(gtpPath, { recursive: true });
    }

    const filePath = path.join(gtpPath, filename);
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true, filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Terminal IPC
ipcMain.on('terminal-input', (event, data) => {
  if (isDockerSession && dockerManager.hasActiveSession()) {
    // Send to Docker container
    dockerManager.write(data);
    recorder.recordInput(data);
  } else if (ptyProcess) {
    ptyProcess.write(data);
    recorder.recordInput(data);
  }
});

ipcMain.on('terminal-resize', async (event, { cols, rows }) => {
  if (isDockerSession && dockerManager.hasActiveSession()) {
    // Resize Docker exec
    await dockerManager.resize(cols, rows);
    recorder.updateDimensions(cols, rows);
  } else if (ptyProcess) {
    ptyProcess.resize(cols, rows);
    recorder.updateDimensions(cols, rows);
  }
});

ipcMain.on('terminal-write-command', (event, command) => {
  if (isDockerSession && dockerManager.hasActiveSession()) {
    dockerManager.write(command);
  } else if (ptyProcess) {
    ptyProcess.write(command);
  }
});

// Forward command execution from detached terminal to main window (for auto-advance)
ipcMain.on('command-executed', (event, command) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('command-executed', command);
  }
});

// Detach terminal to separate window
ipcMain.handle('detach-terminal', async () => {
  if (isTerminalDetached) {
    return { success: false, error: 'Terminal already detached' };
  }

  try {
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    terminalWindow = new BrowserWindow({
      width: Math.floor(width * 0.5),
      height: Math.floor(height * 0.6),
      x: Math.floor(width * 0.25),
      y: Math.floor(height * 0.2),
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

    terminalWindow.loadFile(path.join(__dirname, 'src', 'terminal-window.html'));

    terminalWindow.on('closed', () => {
      terminalWindow = null;
      isTerminalDetached = false;
      // Notify main window that terminal was attached (closed)
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('terminal-attached');
      }
    });

    isTerminalDetached = true;

    // Notify main window
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('terminal-detached');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Attach terminal back to main window
ipcMain.handle('attach-terminal', async () => {
  if (!isTerminalDetached) {
    return { success: false, error: 'Terminal not detached' };
  }

  try {
    if (terminalWindow && !terminalWindow.isDestroyed()) {
      terminalWindow.close();
    }
    terminalWindow = null;
    isTerminalDetached = false;

    // Notify main window
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('terminal-attached');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
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

// Docker IPC handlers
ipcMain.handle('start-docker-session', async (event, dockerConfig, basePath) => {
  try {
    // Check Docker availability first
    const dockerAvailable = await dockerManager.checkDockerAvailable();
    if (!dockerAvailable) {
      return {
        success: false,
        error: 'Docker no está disponible. Asegúrate de que Docker está instalado y ejecutándose.'
      };
    }

    // Notify renderer about pull progress
    const onProgress = (event) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('docker-pull-progress', event);
      }
    };

    // Start the container
    const containerInfo = await dockerManager.startContainer(dockerConfig, basePath, onProgress);

    // Get terminal dimensions
    const dims = await mainWindow.webContents.executeJavaScript(
      'window.terminalComponent?.fitAddon?.proposeDimensions() || {cols: 80, rows: 24}'
    );

    // Create exec stream
    const { stream } = await dockerManager.createExecStream(dims.cols, dims.rows);

    // Kill existing PTY if any
    if (ptyProcess) {
      ptyProcess.kill();
      ptyProcess = null;
    }

    // Set up Docker stream handlers
    stream.on('data', (data) => {
      const output = data.toString();
      if (isTerminalDetached && terminalWindow && !terminalWindow.isDestroyed()) {
        terminalWindow.webContents.send('terminal-data', output);
      } else if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('terminal-data', output);
      }
      recorder.recordOutput(output);
    });

    stream.on('end', () => {
      console.log('[Docker] Stream ended');
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('docker-session-ended');
      }
    });

    stream.on('error', (error) => {
      console.error('[Docker] Stream error:', error.message);
    });

    isDockerSession = true;

    return {
      success: true,
      containerId: containerInfo.containerId,
      containerName: containerInfo.name,
      reused: containerInfo.reused
    };
  } catch (error) {
    console.error('[Docker] Error starting session:', error.message);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('stop-docker-session', async () => {
  try {
    if (dockerManager.hasActiveSession()) {
      await dockerManager.stopContainer();
    }

    isDockerSession = false;

    // Recreate local PTY
    createPty();

    return { success: true };
  } catch (error) {
    console.error('[Docker] Error stopping session:', error.message);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-docker-status', async () => {
  try {
    const status = await dockerManager.getContainerStatus();
    const dockerAvailable = await dockerManager.checkDockerAvailable();
    return {
      success: true,
      isDockerSession,
      dockerAvailable,
      container: status
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('check-docker-available', async () => {
  try {
    const available = await dockerManager.checkDockerAvailable();
    return { success: true, available };
  } catch (error) {
    return { success: false, available: false, error: error.message };
  }
});

// AI API handlers (to bypass CSP restrictions in renderer)
ipcMain.handle('ai-generate-openai', async (event, config) => {
  try {
    // GPT-5 models have special requirements:
    // - Use max_completion_tokens instead of max_tokens
    // - Don't support custom temperature (must be 1 or omitted)
    // - Need more tokens because they use internal reasoning
    const isGpt5 = config.model.startsWith('gpt-5');
    const tokenParam = isGpt5 ? 'max_completion_tokens' : 'max_tokens';
    // GPT-5 needs more tokens for reasoning, minimum 8000
    const tokenCount = isGpt5 ? Math.max(config.maxTokens, 8000) : config.maxTokens;

    const requestBody = {
      model: config.model,
      messages: [
        { role: 'system', content: config.systemPrompt },
        { role: 'user', content: config.userPrompt }
      ],
      [tokenParam]: tokenCount
    };

    // Only add temperature for non-GPT-5 models
    if (!isGpt5) {
      requestBody.temperature = config.temperature;
    }

    console.log('[OpenAI API] Request model:', config.model);
    console.log('[OpenAI API] Request body:', JSON.stringify(requestBody, null, 2).substring(0, 500));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiToken}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('[OpenAI API] Response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.log('[OpenAI API] Error response:', JSON.stringify(error));
      return { success: false, error: error.error?.message || 'Error en la API de OpenAI' };
    }

    const data = await response.json();
    console.log('[OpenAI API] Response keys:', Object.keys(data));
    console.log('[OpenAI API] Choices:', JSON.stringify(data.choices, null, 2).substring(0, 1000));

    const content = data.choices?.[0]?.message?.content;
    console.log('[OpenAI API] Content type:', typeof content);
    console.log('[OpenAI API] Content length:', content?.length || 0);
    console.log('[OpenAI API] Content preview:', content?.substring(0, 200) || '(empty)');

    return { success: true, content: content };
  } catch (error) {
    console.log('[OpenAI API] Exception:', error.message);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ai-generate-anthropic', async (event, config) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiToken,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        system: config.systemPrompt,
        messages: [
          { role: 'user', content: config.userPrompt }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error?.message || 'Error en la API de Anthropic' };
    }

    const data = await response.json();
    return { success: true, content: data.content[0].text };
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

app.on('window-all-closed', async () => {
  if (ptyProcess) {
    ptyProcess.kill();
  }
  // Stop Docker container if active
  if (dockerManager.hasActiveSession()) {
    await dockerManager.stopContainer();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
