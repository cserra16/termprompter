/**
 * KeyStroke Display Component for TermPrompter
 * Similar to keyviz - visualizes keyboard input in real-time
 */

class KeyStrokeDisplay {
    constructor() {
        this.enabled = false;
        this.container = null;
        this.currentKeys = new Set();
        this.displayTimeout = null;
        this.fadeOutTimeout = null;
        this.displayDuration = 2000; // Show for 2 seconds
        this.fadeOutDuration = 500; // Fade out over 500ms

        // Keys to ignore when pressed alone (without modifiers)
        this.ignoreKeysAlone = new Set([
            'Shift', 'Control', 'Alt', 'Meta', 'CapsLock',
            'NumLock', 'ScrollLock', 'Fn', 'FnLock'
        ]);

        // Special key mappings for better display
        this.keyMappings = {
            ' ': 'Space',
            'Enter': '↵',
            'Backspace': '⌫',
            'Delete': 'Del',
            'Escape': 'Esc',
            'ArrowUp': '↑',
            'ArrowDown': '↓',
            'ArrowLeft': '←',
            'ArrowRight': '→',
            'Tab': '⇥',
            'Home': 'Home',
            'End': 'End',
            'PageUp': 'PgUp',
            'PageDown': 'PgDn',
            'Insert': 'Ins',
            'ContextMenu': 'Menu'
        };

        this.init();
    }

    /**
     * Initialize the keystroke display
     */
    init() {
        this.createContainer();
        this.attachEventListeners();
    }

    /**
     * Create the display container
     */
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'keystroke-display';
        this.container.style.display = 'none';
        document.body.appendChild(this.container);
    }

    /**
     * Attach keyboard event listeners
     */
    attachEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.enabled) {
                this.handleKeyDown(e);
            }
        });

        document.addEventListener('keyup', (e) => {
            if (this.enabled) {
                this.handleKeyUp(e);
            }
        });
    }

    /**
     * Handle keydown event
     */
    handleKeyDown(e) {
        // Don't capture if typing in certain contexts
        if (this.shouldIgnoreEvent(e)) {
            return;
        }

        const key = e.key;

        // Check if this is a modifier-only press
        if (this.ignoreKeysAlone.has(key) && !this.hasModifiers(e)) {
            return;
        }

        // Check if only modifier keys are pressed
        const onlyModifiers = this.ignoreKeysAlone.has(key);
        if (onlyModifiers && !this.hasOtherKeysPressed()) {
            return;
        }

        // Format and display the keystroke
        this.displayKeystroke(e);
    }

    /**
     * Handle keyup event
     */
    handleKeyUp(e) {
        this.currentKeys.delete(e.key);
    }

    /**
     * Check if event should be ignored
     */
    shouldIgnoreEvent(e) {
        // Ignore if in certain input contexts (but not terminal)
        const target = e.target;
        const isContentEditable = target.contentEditable === 'true';
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

        // Don't ignore if it's in the terminal container
        const isTerminal = target.closest('.terminal-container');

        return (isContentEditable || isInput) && !isTerminal;
    }

    /**
     * Check if event has any modifiers
     */
    hasModifiers(e) {
        return e.ctrlKey || e.altKey || e.shiftKey || e.metaKey;
    }

    /**
     * Check if there are other keys pressed besides modifiers
     */
    hasOtherKeysPressed() {
        for (const key of this.currentKeys) {
            if (!this.ignoreKeysAlone.has(key)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Format and display the keystroke
     */
    displayKeystroke(e) {
        const parts = [];

        // Add modifiers
        if (e.ctrlKey) parts.push('Ctrl');
        if (e.altKey) parts.push('Alt');
        if (e.shiftKey && !this.isSingleShiftedChar(e)) parts.push('Shift');
        if (e.metaKey) parts.push('Meta');

        // Add main key
        let mainKey = e.key;

        // Use mapping if available
        if (this.keyMappings[mainKey]) {
            mainKey = this.keyMappings[mainKey];
        } else if (mainKey.length === 1) {
            // Single character - display uppercase
            mainKey = mainKey.toUpperCase();
        } else if (mainKey.startsWith('Key')) {
            // Handle KeyA, KeyB, etc.
            mainKey = mainKey.slice(3);
        }

        // Only add main key if it's not a standalone modifier
        if (!this.ignoreKeysAlone.has(e.key)) {
            parts.push(mainKey);
        }

        // Don't display if only modifiers
        if (parts.length === 0 || (parts.length === 1 && this.ignoreKeysAlone.has(e.key))) {
            return;
        }

        this.showDisplay(parts);
        this.currentKeys.add(e.key);
    }

    /**
     * Check if this is just a single shifted character (like ! or @)
     */
    isSingleShiftedChar(e) {
        return e.shiftKey && e.key.length === 1 && e.key !== e.key.toLowerCase();
    }

    /**
     * Show the keystroke display
     */
    showDisplay(parts) {
        // Clear existing timeouts
        if (this.displayTimeout) clearTimeout(this.displayTimeout);
        if (this.fadeOutTimeout) clearTimeout(this.fadeOutTimeout);

        // Build display HTML
        const html = parts.map((part, index) => {
            const isModifier = ['Ctrl', 'Alt', 'Shift', 'Meta'].includes(part);
            const className = isModifier ? 'keystroke-key modifier' : 'keystroke-key main';
            const separator = index < parts.length - 1 ? '<span class="keystroke-separator">+</span>' : '';
            return `<span class="${className}">${part}</span>${separator}`;
        }).join('');

        this.container.innerHTML = html;
        this.container.style.display = 'flex';
        this.container.classList.remove('fade-out');
        this.container.classList.add('fade-in');

        // Set timeout to start fade out
        this.displayTimeout = setTimeout(() => {
            this.startFadeOut();
        }, this.displayDuration);
    }

    /**
     * Start fade out animation
     */
    startFadeOut() {
        this.container.classList.remove('fade-in');
        this.container.classList.add('fade-out');

        this.fadeOutTimeout = setTimeout(() => {
            this.container.style.display = 'none';
            this.currentKeys.clear();
        }, this.fadeOutDuration);
    }

    /**
     * Enable keystroke display
     */
    enable() {
        this.enabled = true;
    }

    /**
     * Disable keystroke display
     */
    disable() {
        this.enabled = false;
        this.container.style.display = 'none';
        this.currentKeys.clear();
        if (this.displayTimeout) clearTimeout(this.displayTimeout);
        if (this.fadeOutTimeout) clearTimeout(this.fadeOutTimeout);
    }

    /**
     * Toggle keystroke display
     */
    toggle() {
        if (this.enabled) {
            this.disable();
        } else {
            this.enable();
        }
        return this.enabled;
    }

    /**
     * Check if enabled
     */
    isEnabled() {
        return this.enabled;
    }
}
