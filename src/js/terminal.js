/**
 * Terminal Component for TermPrompter
 * Integrates xterm.js with node-pty backend
 * Note: xterm and xterm-addon-fit are loaded via script tags in index.html
 */

class TerminalComponent {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.terminal = null;
        this.fitAddon = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the terminal
     */
    async init() {
        // Terminal and FitAddon are loaded globally from script tags
        this.terminal = new Terminal({
            theme: {
                background: '#0d0d0d',
                foreground: '#e0e0e0',
                cursor: '#e94560',
                cursorAccent: '#0d0d0d',
                selection: 'rgba(233, 69, 96, 0.3)',
                black: '#1a1a2e',
                red: '#e94560',
                green: '#00d9a5',
                yellow: '#ffc107',
                blue: '#0f3460',
                magenta: '#533483',
                cyan: '#00b4d8',
                white: '#e0e0e0',
                brightBlack: '#6c7589',
                brightRed: '#ff6b6b',
                brightGreen: '#51cf66',
                brightYellow: '#ffd43b',
                brightBlue: '#4dabf7',
                brightMagenta: '#cc5de8',
                brightCyan: '#22b8cf',
                brightWhite: '#ffffff'
            },
            fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", Consolas, monospace',
            fontSize: 14,
            lineHeight: 1.2,
            cursorBlink: true,
            cursorStyle: 'bar',
            scrollback: 5000,
            allowTransparency: true
        });

        this.fitAddon = new FitAddon.FitAddon();
        this.terminal.loadAddon(this.fitAddon);

        // Mount terminal to container
        this.terminal.open(this.container);
        this.fit();

        // Handle terminal input -> send to PTY
        this.terminal.onData((data) => {
            window.electronAPI.terminalInput(data);
        });

        // Handle PTY output -> display in terminal
        window.electronAPI.onTerminalData((data) => {
            this.terminal.write(data);
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.fit();
        });

        // Use ResizeObserver for container resize
        const resizeObserver = new ResizeObserver(() => {
            this.fit();
        });
        resizeObserver.observe(this.container);

        this.isInitialized = true;

        // Focus terminal
        this.terminal.focus();
    }

    /**
     * Fit terminal to container size
     */
    fit() {
        if (this.fitAddon && this.container.offsetWidth > 0) {
            try {
                this.fitAddon.fit();
                const dims = this.fitAddon.proposeDimensions();
                if (dims) {
                    window.electronAPI.terminalResize(dims.cols, dims.rows);
                }
            } catch (e) {
                // Ignore fit errors during initialization
            }
        }
    }

    /**
     * Write command to terminal (for auto-insertion)
     * @param {string} command - Command to write
     * @param {boolean} execute - Whether to execute immediately
     */
    writeCommand(command, execute = false) {
        if (this.terminal) {
            window.electronAPI.terminalWriteCommand(command + (execute ? '\n' : ''));
            this.terminal.focus();
        }
    }

    /**
     * Clear the terminal
     */
    clear() {
        if (this.terminal) {
            this.terminal.clear();
            // Also send Ctrl+L to shell
            window.electronAPI.terminalInput('\x0c');
        }
    }

    /**
     * Focus the terminal
     */
    focus() {
        if (this.terminal) {
            this.terminal.focus();
        }
    }
}
