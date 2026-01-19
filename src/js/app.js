/**
 * TermPrompter Main Application
 * Coordinates all components and handles user interactions
 */

class TermPrompterApp {
    constructor() {
        this.sidebar = new Sidebar('#cardsContainer');
        this.timeline = new Timeline('#timelineContainer');
        this.terminal = new TerminalComponent('#terminalContainer');
        this.recorder = new RecorderUI();
        this.demoTitle = document.getElementById('demoTitle');
        this.currentDemo = null;
        this.editMode = false;
        this.currentFilePath = null;
        this.undoStack = [];

        // Docker session state
        this.isDockerSession = false;
        this.currentDockerConfig = null;

        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        await this.terminal.init();
        // Make terminal component globally accessible for recording
        window.terminalComponent = this.terminal;
        this.recorder.init();
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.setupDockerListeners();
        this.connectComponents();
        this.loadDefaultDemo();
    }

    /**
     * Setup UI event listeners
     */
    setupEventListeners() {
        // Open demo button
        const openBtn = document.getElementById('openDemoBtn');
        openBtn.addEventListener('click', () => this.openDemoDialog());

        // Edit mode button
        const editBtn = document.getElementById('editModeBtn');
        editBtn.addEventListener('click', () => this.toggleEditMode());

        // Window controls
        const closeBtn = document.getElementById('closeBtn');
        const minimizeBtn = document.getElementById('minimizeBtn');

        closeBtn.addEventListener('click', () => {
            window.electronAPI.closeWindow();
        });

        minimizeBtn.addEventListener('click', () => {
            window.electronAPI.minimizeWindow();
        });

        // Clear terminal button
        const clearTerminalBtn = document.getElementById('clearTerminalBtn');
        if (clearTerminalBtn) {
            clearTerminalBtn.addEventListener('click', () => {
                this.terminal.clear();
            });
        }

        // Font size controls
        const increaseFontBtn = document.getElementById('increaseFontBtn');
        if (increaseFontBtn) {
            increaseFontBtn.addEventListener('click', () => {
                this.terminal.increaseFontSize();
            });
        }

        const decreaseFontBtn = document.getElementById('decreaseFontBtn');
        if (decreaseFontBtn) {
            decreaseFontBtn.addEventListener('click', () => {
                this.terminal.decreaseFontSize();
            });
        }

        // Detach/Attach terminal buttons
        const detachBtn = document.getElementById('detachTerminalBtn');
        const attachBtn = document.getElementById('attachTerminalBtn');

        if (detachBtn) {
            detachBtn.addEventListener('click', async () => {
                const result = await window.electronAPI.detachTerminal();
                if (result.success) {
                    detachBtn.style.display = 'none';
                    attachBtn.style.display = 'flex';
                    document.querySelector('.right-panel').classList.add('terminal-detached');
                }
            });
        }

        if (attachBtn) {
            attachBtn.addEventListener('click', async () => {
                const result = await window.electronAPI.attachTerminal();
                if (result.success) {
                    attachBtn.style.display = 'none';
                    detachBtn.style.display = 'flex';
                    document.querySelector('.right-panel').classList.remove('terminal-detached');
                }
            });
        }

        // Listen for terminal attach/detach events (from main process)
        window.electronAPI.onTerminalDetached(() => {
            if (detachBtn) detachBtn.style.display = 'none';
            if (attachBtn) attachBtn.style.display = 'flex';
            document.querySelector('.right-panel').classList.add('terminal-detached');
        });

        window.electronAPI.onTerminalAttached(() => {
            if (attachBtn) attachBtn.style.display = 'none';
            if (detachBtn) detachBtn.style.display = 'flex';
            document.querySelector('.right-panel').classList.remove('terminal-detached');
            // Re-initialize terminal display
            this.terminal.fit();
        });

        // Listen for command execution from detached terminal (for auto-advance)
        window.electronAPI.onCommandExecuted((command) => {
            if (this.isAutoTrackEnabled()) {
                this.handleCommandTracking(command);
            }
        });
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Handle undo in edit mode
            if (this.editMode && (e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                this.undo();
                return;
            }

            // Only handle navigation if not typing in terminal or editable field
            const isTerminalFocused = document.activeElement?.closest('.terminal-container');
            const isEditingField = document.activeElement?.contentEditable === 'true';

            // Use Page Up/Down for navigation even when terminal is focused
            if (e.key === 'PageDown' && !isEditingField) {
                e.preventDefault();
                this.sidebar.nextStep();
                return;
            }
            if (e.key === 'PageUp' && !isEditingField) {
                e.preventDefault();
                this.sidebar.previousStep();
                return;
            }

            // Skip other shortcuts if terminal is focused or editing
            if (isTerminalFocused || isEditingField) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.sidebar.nextStep();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.sidebar.previousStep();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.sidebar.firstStep();
                    break;
                case 'End':
                    e.preventDefault();
                    this.sidebar.lastStep();
                    break;
            }
        });
    }

    /**
     * Connect sidebar and timeline to sync state
     */
    connectComponents() {
        // When sidebar step changes, update timeline
        this.sidebar.onStepChange = (index, step) => {
            this.timeline.setActivePoint(index);
        };

        // When timeline point is clicked, update sidebar
        this.timeline.onPointClick = (index) => {
            this.sidebar.setActiveStep(index);
        };

        // When insert button is clicked, write command to terminal
        this.sidebar.onInsertCommand = (command) => {
            this.terminal.writeCommand(command, false);
        };

        // Auto-tracking: when a command is executed in terminal
        this.terminal.onCommandExecuted = (command) => {
            if (this.isAutoTrackEnabled()) {
                this.handleCommandTracking(command);
            }
        };
    }

    /**
     * Load default demo on startup
     */
    async loadDefaultDemo() {
        const result = await window.electronAPI.loadDemo();

        if (result.success) {
            await this.processDemo(result.content, result.filePath, result.dockerConfig);
        } else {
            // No default demo, show empty state
            this.sidebar.render([]);
            this.demoTitle.textContent = 'TermPrompter';
        }
    }

    /**
     * Open file dialog to select a demo
     */
    async openDemoDialog() {
        const result = await window.electronAPI.openDemoDialog();

        if (result.success) {
            await this.processDemo(result.content, result.filePath, result.dockerConfig);
        }
    }

    /**
     * Process and render loaded demo content
     * @param {string} content - Markdown content
     * @param {string} filePath - Path to the file
     * @param {object|null} dockerConfig - Docker configuration from frontmatter
     */
    async processDemo(content, filePath, dockerConfig = null) {
        const parsed = MarkdownParser.parse(content);

        if (!MarkdownParser.isValid(parsed)) {
            console.error('Invalid demo format');
            this.demoTitle.textContent = 'Error: formato inválido';
            return;
        }

        // Stop any existing Docker session before loading new demo
        if (this.isDockerSession) {
            await this.stopDockerSession();
        }

        this.currentDemo = parsed;
        this.currentFilePath = filePath;
        this.currentDockerConfig = dockerConfig;
        this.demoTitle.textContent = parsed.title || this.getFileNameFromPath(filePath);

        // Render components
        this.sidebar.render(parsed.steps);
        this.timeline.render(parsed.steps.length);

        // Update Docker indicator in UI
        this.updateDockerIndicator(dockerConfig);

        // Start Docker session if configuration is present
        if (dockerConfig) {
            await this.startDockerSession(dockerConfig, filePath);
        }
    }

    /**
     * Extract filename from path
     * @param {string} filePath
     * @returns {string}
     */
    getFileNameFromPath(filePath) {
        return filePath.split(/[/\\]/).pop().replace('.md', '');
    }

    /**
     * Toggle edit mode
     */
    toggleEditMode() {
        this.editMode = !this.editMode;
        const editBtn = document.getElementById('editModeBtn');

        if (this.editMode) {
            editBtn.classList.add('active');
            document.body.classList.add('edit-mode');
            this.sidebar.enableEditMode(
                (steps) => this.onStepsReordered(steps),
                (index) => this.onStepAdded(index),
                (index, field, value) => this.onStepEdited(index, field, value)
            );
        } else {
            editBtn.classList.remove('active');
            document.body.classList.remove('edit-mode');
            this.sidebar.disableEditMode();
        }
    }

    /**
     * Handle steps reordering
     */
    onStepsReordered(newSteps) {
        this.saveToUndoStack();
        this.currentDemo.steps = newSteps;
        this.syncToMarkdown();
    }

    /**
     * Handle adding a new step
     */
    onStepAdded(index) {
        this.saveToUndoStack();
        const newStep = {
            stepNumber: index + 1,
            title: 'Nuevo paso',
            command: 'echo "Nuevo comando"',
            notes: 'Añade aquí las notas del paso'
        };

        this.currentDemo.steps.splice(index, 0, newStep);
        this.renumberSteps();
        this.syncToMarkdown();
        this.sidebar.render(this.currentDemo.steps);
        this.timeline.render(this.currentDemo.steps.length);
    }

    /**
     * Handle step editing
     */
    onStepEdited(index, field, value) {
        this.saveToUndoStack();
        this.currentDemo.steps[index][field] = value;
        this.syncToMarkdown();
    }

    /**
     * Renumber steps after insertion or deletion
     */
    renumberSteps() {
        this.currentDemo.steps.forEach((step, index) => {
            step.stepNumber = index + 1;
        });
    }

    /**
     * Save current state to undo stack
     */
    saveToUndoStack() {
        const state = JSON.parse(JSON.stringify(this.currentDemo));
        this.undoStack.push(state);

        // Limit undo stack to 50 items
        if (this.undoStack.length > 50) {
            this.undoStack.shift();
        }
    }

    /**
     * Undo last change
     */
    undo() {
        if (this.undoStack.length === 0) return;

        const previousState = this.undoStack.pop();
        this.currentDemo = previousState;
        this.syncToMarkdown();
        this.sidebar.render(this.currentDemo.steps);
        this.timeline.render(this.currentDemo.steps.length);
    }

    /**
     * Sync current demo state to markdown file
     */
    async syncToMarkdown() {
        if (!this.currentFilePath) return;

        let markdown = `# ${this.currentDemo.title}\n\n`;

        this.currentDemo.steps.forEach(step => {
            markdown += `## Paso ${step.stepNumber}: ${step.title}\n`;
            markdown += '```bash\n';
            markdown += `${step.command}\n`;
            markdown += '```\n';
            if (step.notes) {
                markdown += `${step.notes}\n`;
            }
            markdown += '\n';
        });

        await window.electronAPI.saveDemo(this.currentFilePath, markdown);
    }

    /**
     * Load a demo from parsed data (used by AI generator)
     * @param {Object} demo - Parsed demo object
     * @param {string} filePath - Path to the demo file
     */
    loadDemo(demo, filePath) {
        if (!MarkdownParser.isValid(demo)) {
            console.error('Invalid demo format');
            return false;
        }

        this.currentDemo = demo;
        this.currentFilePath = filePath;
        this.demoTitle.textContent = demo.title || this.getFileNameFromPath(filePath);

        // Render components
        this.sidebar.render(demo.steps);
        this.timeline.render(demo.steps.length);

        // Reset edit mode if active
        if (this.editMode) {
            this.toggleEditMode();
        }

        return true;
    }

    /**
     * Check if auto-tracking is enabled
     * @returns {boolean}
     */
    isAutoTrackEnabled() {
        const checkbox = document.getElementById('autoTrackCheckbox');
        return checkbox && checkbox.checked;
    }

    /**
     * Handle command tracking for auto-advance
     * @param {string} executedCommand - Command that was executed
     */
    handleCommandTracking(executedCommand) {
        const currentStep = this.sidebar.steps[this.sidebar.currentStepIndex];
        if (!currentStep) return;

        // Normalize commands for comparison (trim and normalize whitespace)
        const normalizeCommand = (cmd) => cmd.trim().replace(/\s+/g, ' ');

        const normalizedExecuted = normalizeCommand(executedCommand);
        const normalizedExpected = normalizeCommand(currentStep.command);

        if (normalizedExecuted === normalizedExpected) {
            // Auto-advance to next card with a small delay for better UX
            setTimeout(() => {
                this.sidebar.nextStep();
            }, 300);
        }
    }

    /**
     * Setup Docker-related event listeners
     */
    setupDockerListeners() {
        // Listen for Docker pull progress
        window.electronAPI.onDockerPullProgress((progress) => {
            if (progress.status) {
                this.showDockerStatus(`Descargando imagen: ${progress.status}`);
            }
        });

        // Listen for Docker session ending
        window.electronAPI.onDockerSessionEnded(() => {
            this.isDockerSession = false;
            this.updateDockerIndicator(null);
            this.showDockerStatus('Sesión Docker terminada');
        });
    }

    /**
     * Start a Docker session for the demo
     * @param {object} dockerConfig - Docker configuration
     * @param {string} filePath - Path to the demo file (for resolving relative volumes)
     */
    async startDockerSession(dockerConfig, filePath) {
        // Get the directory containing the demo file for resolving relative paths
        const basePath = filePath.substring(0, filePath.lastIndexOf('/'));

        this.showDockerStatus(`Iniciando contenedor Docker (${dockerConfig.image})...`);

        const result = await window.electronAPI.startDockerSession(dockerConfig, basePath);

        if (result.success) {
            this.isDockerSession = true;
            const status = result.reused
                ? `Contenedor reutilizado: ${result.containerName}`
                : `Contenedor iniciado: ${result.containerName}`;
            this.showDockerStatus(status);

            // Clear status after 3 seconds
            setTimeout(() => this.hideDockerStatus(), 3000);
        } else {
            this.showDockerStatus(`Error Docker: ${result.error}`, true);
            this.currentDockerConfig = null;
            this.updateDockerIndicator(null);
        }
    }

    /**
     * Stop the current Docker session
     */
    async stopDockerSession() {
        if (!this.isDockerSession) return;

        this.showDockerStatus('Deteniendo contenedor Docker...');

        const result = await window.electronAPI.stopDockerSession();

        if (result.success) {
            this.isDockerSession = false;
            this.currentDockerConfig = null;
            this.hideDockerStatus();
        } else {
            this.showDockerStatus(`Error al detener: ${result.error}`, true);
        }
    }

    /**
     * Update the Docker indicator in the UI
     * @param {object|null} dockerConfig - Docker configuration or null
     */
    updateDockerIndicator(dockerConfig) {
        let indicator = document.getElementById('dockerIndicator');

        if (dockerConfig) {
            if (!indicator) {
                // Create the indicator if it doesn't exist
                indicator = document.createElement('div');
                indicator.id = 'dockerIndicator';
                indicator.className = 'docker-indicator';
                indicator.innerHTML = `
                    <span class="docker-icon">🐳</span>
                    <span class="docker-info"></span>
                    <button class="docker-stop-btn" title="Detener contenedor">✕</button>
                `;

                // Add click handler for stop button
                indicator.querySelector('.docker-stop-btn').addEventListener('click', async (e) => {
                    e.stopPropagation();
                    await this.stopDockerSession();
                    this.updateDockerIndicator(null);
                });

                // Insert after the title bar
                const titleBar = document.querySelector('.title-bar');
                if (titleBar) {
                    titleBar.after(indicator);
                }
            }

            indicator.querySelector('.docker-info').textContent = dockerConfig.image;
            indicator.classList.add('active');
        } else if (indicator) {
            indicator.classList.remove('active');
        }
    }

    /**
     * Show Docker status message
     * @param {string} message - Status message
     * @param {boolean} isError - Whether this is an error message
     */
    showDockerStatus(message, isError = false) {
        let statusEl = document.getElementById('dockerStatus');

        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.id = 'dockerStatus';
            statusEl.className = 'docker-status';
            document.body.appendChild(statusEl);
        }

        statusEl.textContent = message;
        statusEl.classList.toggle('error', isError);
        statusEl.classList.add('visible');
    }

    /**
     * Hide Docker status message
     */
    hideDockerStatus() {
        const statusEl = document.getElementById('dockerStatus');
        if (statusEl) {
            statusEl.classList.remove('visible');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TermPrompterApp();
});
