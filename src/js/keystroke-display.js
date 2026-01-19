/**
 * Keystroke Display Component
 * Shows keyboard presses on screen with two filter modes:
 * - all: Shows all keystrokes
 * - nonPrintable: Shows only non-printable keys (Ctrl+C, Enter, Escape, etc.)
 */

class KeystrokeDisplay {
    constructor() {
        this.container = null;
        this.isEnabled = false;
        this.filterMode = 'nonPrintable'; // 'all' or 'nonPrintable'
        this.currentKeys = new Map(); // Track currently pressed keys
        this.keyDisplayTimeout = null;
        this.fadeOutDelay = 1500; // ms before key display fades out

        // Non-printable keys that should always be shown
        this.nonPrintableKeys = new Set([
            'Enter', 'Tab', 'Escape', 'Backspace', 'Delete',
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'Home', 'End', 'PageUp', 'PageDown',
            'Insert', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
            'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
            'CapsLock', 'NumLock', 'ScrollLock', 'Pause', 'PrintScreen'
        ]);

        // Modifier keys
        this.modifierKeys = new Set(['Control', 'Alt', 'Meta', 'Shift']);

        // Key display names mapping
        this.keyNames = {
            'Control': 'Ctrl',
            'Meta': navigator.platform.includes('Mac') ? '⌘' : 'Win',
            'Alt': navigator.platform.includes('Mac') ? '⌥' : 'Alt',
            'Shift': '⇧',
            'Enter': '↵',
            'Backspace': '⌫',
            'Delete': 'Del',
            'Escape': 'Esc',
            'ArrowUp': '↑',
            'ArrowDown': '↓',
            'ArrowLeft': '←',
            'ArrowRight': '→',
            'Tab': '⇥',
            ' ': 'Space'
        };

        this.init();
    }

    /**
     * Initialize the keystroke display
     */
    init() {
        // Create container
        this.container = document.createElement('div');
        this.container.id = 'keystrokeDisplay';
        this.container.className = 'keystroke-display';
        this.container.style.display = 'none';
        document.body.appendChild(this.container);

        // Load saved preferences
        const savedEnabled = localStorage.getItem('keystrokeDisplayEnabled');
        const savedMode = localStorage.getItem('keystrokeDisplayMode');

        if (savedEnabled === 'true') {
            this.isEnabled = true;
            this.container.style.display = 'flex';
        }

        if (savedMode && ['all', 'nonPrintable'].includes(savedMode)) {
            this.filterMode = savedMode;
        }

        // Setup keyboard event listeners
        this.setupEventListeners();

        console.log('KeystrokeDisplay initialized');
    }

    /**
     * Setup keyboard event listeners
     */
    setupEventListeners() {
        // Listen to keydown events
        document.addEventListener('keydown', (e) => {
            if (!this.isEnabled) return;

            // Check if we should display this key
            if (this.shouldDisplayKey(e)) {
                this.displayKey(e);
            }
        });

        // Track key releases for modifier keys
        document.addEventListener('keyup', (e) => {
            if (!this.isEnabled) return;

            if (this.modifierKeys.has(e.key)) {
                // Clear display when modifiers are released
                this.scheduleHide();
            }
        });
    }

    /**
     * Check if a key should be displayed based on current filter mode
     * @param {KeyboardEvent} event - Keyboard event
     * @returns {boolean}
     */
    shouldDisplayKey(event) {
        const key = event.key;

        // In 'all' mode, show everything
        if (this.filterMode === 'all') {
            return true;
        }

        // In 'nonPrintable' mode, only show:
        // 1. Keys with modifiers (except Shift with single char for typing)
        // 2. Non-printable keys
        // 3. Function keys

        const hasModifier = event.ctrlKey || event.metaKey || event.altKey;
        const isNonPrintable = this.nonPrintableKeys.has(key);
        const isFunctionKey = key.startsWith('F') && key.length <= 3;
        const isModifierOnly = this.modifierKeys.has(key);

        // Don't show single characters without modifiers (normal typing)
        if (key.length === 1 && !hasModifier) {
            return false;
        }

        // Don't show Shift alone (it's for typing capitals)
        if (key === 'Shift' && !event.ctrlKey && !event.metaKey && !event.altKey) {
            return false;
        }

        return hasModifier || isNonPrintable || isFunctionKey || isModifierOnly;
    }

    /**
     * Display a key press on screen
     * @param {KeyboardEvent} event - Keyboard event
     */
    displayKey(event) {
        // Build key combination string
        const parts = [];

        if (event.ctrlKey && event.key !== 'Control') {
            parts.push(this.keyNames['Control']);
        }
        if (event.altKey && event.key !== 'Alt') {
            parts.push(this.keyNames['Alt']);
        }
        if (event.metaKey && event.key !== 'Meta') {
            parts.push(this.keyNames['Meta']);
        }
        if (event.shiftKey && event.key !== 'Shift' && event.key.length > 1) {
            parts.push(this.keyNames['Shift']);
        }

        // Add the main key
        const mainKey = this.keyNames[event.key] || event.key;
        if (!this.modifierKeys.has(event.key) || parts.length === 0) {
            parts.push(mainKey);
        }

        const keyText = parts.join(' + ');

        // Update display
        this.container.innerHTML = `
            <div class="keystroke-keys">
                ${parts.map(key => `<span class="keystroke-key">${this.escapeHtml(key)}</span>`).join('<span class="keystroke-plus">+</span>')}
            </div>
        `;

        // Reset fade out timer
        this.scheduleHide();
    }

    /**
     * Schedule hiding the display after delay
     */
    scheduleHide() {
        if (this.keyDisplayTimeout) {
            clearTimeout(this.keyDisplayTimeout);
        }

        // Add visible class for animation
        this.container.classList.add('visible');

        this.keyDisplayTimeout = setTimeout(() => {
            this.container.classList.remove('visible');
        }, this.fadeOutDelay);
    }

    /**
     * Toggle keystroke display on/off
     * @returns {boolean} New enabled state
     */
    toggle() {
        this.isEnabled = !this.isEnabled;

        if (this.isEnabled) {
            this.container.style.display = 'flex';
        } else {
            this.container.style.display = 'none';
            this.container.classList.remove('visible');
        }

        // Save preference
        localStorage.setItem('keystrokeDisplayEnabled', this.isEnabled);

        return this.isEnabled;
    }

    /**
     * Set filter mode
     * @param {string} mode - 'all' or 'nonPrintable'
     */
    setFilterMode(mode) {
        if (!['all', 'nonPrintable'].includes(mode)) {
            console.error('Invalid filter mode:', mode);
            return;
        }

        this.filterMode = mode;
        localStorage.setItem('keystrokeDisplayMode', mode);
        console.log('Keystroke filter mode set to:', mode);
    }

    /**
     * Get current filter mode
     * @returns {string}
     */
    getFilterMode() {
        return this.filterMode;
    }

    /**
     * Check if display is enabled
     * @returns {boolean}
     */
    isDisplayEnabled() {
        return this.isEnabled;
    }

    /**
     * Escape HTML special characters
     * @param {string} text
     * @returns {string}
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KeystrokeDisplay;
}
