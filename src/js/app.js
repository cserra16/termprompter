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
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Only handle navigation if not typing in terminal
            const isTerminalFocused = document.activeElement?.closest('.terminal-container');

            // Use Page Up/Down for navigation even when terminal is focused
            if (e.key === 'PageDown') {
                e.preventDefault();
                this.sidebar.nextStep();
                return;
            }
            if (e.key === 'PageUp') {
                e.preventDefault();
                this.sidebar.previousStep();
                return;
            }

            // Skip other shortcuts if terminal is focused
            if (isTerminalFocused) return;

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
    }

    /**
     * Load default demo on startup
     */
    async loadDefaultDemo() {
        const result = await window.electronAPI.loadDemo();

        if (result.success) {
            this.processDemo(result.content, result.filePath);
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
            this.processDemo(result.content, result.filePath);
        }
    }

    /**
     * Process and render loaded demo content
     * @param {string} content - Markdown content
     * @param {string} filePath - Path to the file
     */
    processDemo(content, filePath) {
        const parsed = MarkdownParser.parse(content);

        if (!MarkdownParser.isValid(parsed)) {
            console.error('Invalid demo format');
            this.demoTitle.textContent = 'Error: formato inválido';
            return;
        }

        this.currentDemo = parsed;
        this.demoTitle.textContent = parsed.title || this.getFileNameFromPath(filePath);

        // Render components
        this.sidebar.render(parsed.steps);
        this.timeline.render(parsed.steps.length);
    }

    /**
     * Extract filename from path
     * @param {string} filePath 
     * @returns {string}
     */
    getFileNameFromPath(filePath) {
        return filePath.split(/[/\\]/).pop().replace('.md', '');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TermPrompterApp();
});
