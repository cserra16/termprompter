/**
 * Sidebar Component for TermPrompter
 * Handles rendering and interaction of command cards
 */

class Sidebar {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.steps = [];
        this.currentStepIndex = 0;
        this.onStepChange = null;
        this.onInsertCommand = null; // Callback for inserting command to terminal
    }

    /**
     * Render all step cards
     * @param {Array} steps - Array of step objects
     */
    render(steps) {
        this.steps = steps;
        this.container.innerHTML = '';

        if (!steps || steps.length === 0) {
            this.renderEmptyState();
            return;
        }

        steps.forEach((step, index) => {
            const card = this.createCard(step, index);
            this.container.appendChild(card);
        });

        // Activate first step by default
        this.setActiveStep(0);
    }

    /**
     * Create a single command card element
     * @param {Object} step - Step data
     * @param {number} index - Step index
     * @returns {HTMLElement}
     */
    createCard(step, index) {
        const card = document.createElement('div');
        card.className = 'command-card';
        card.dataset.stepIndex = index;

        card.innerHTML = `
      <div class="card-header">
        <div class="step-badge">
          <span class="step-number">${step.stepNumber}</span>
          <span class="step-title">${this.escapeHtml(step.title)}</span>
        </div>
        <div class="card-actions">
          <button class="insert-btn" title="Insertar en terminal" data-command="${this.escapeHtml(step.command)}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <button class="copy-btn" title="Copiar comando" data-command="${this.escapeHtml(step.command)}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="card-command">
        <div class="command-line">
          <span class="prompt-symbol">$</span>
          <code class="command-text">${this.escapeHtml(step.command)}</code>
        </div>
      </div>
      ${step.notes ? `
        <div class="card-notes">
          <div class="notes-content">${this.formatNotes(step.notes)}</div>
        </div>
      ` : ''}
    `;

        // Click handler for card
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking buttons
            if (e.target.closest('.copy-btn') || e.target.closest('.insert-btn')) return;
            this.setActiveStep(index);
        });

        // Copy button handler
        const copyBtn = card.querySelector('.copy-btn');
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.copyCommand(step.command, copyBtn);
        });

        // Insert button handler
        const insertBtn = card.querySelector('.insert-btn');
        insertBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onInsertCommand) {
                this.onInsertCommand(step.command);
                insertBtn.classList.add('inserted');
                setTimeout(() => insertBtn.classList.remove('inserted'), 500);
            }
        });

        // Double-click on command to insert
        const commandSection = card.querySelector('.card-command');
        commandSection.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            if (this.onInsertCommand) {
                this.onInsertCommand(step.command);
            }
        });

        return card;
    }

    /**
     * Render empty state when no steps are loaded
     */
    renderEmptyState() {
        this.container.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
          <path d="M12 11v6M9 14h6"/>
        </svg>
        <h3 class="empty-state-title">No hay demo cargada</h3>
        <p class="empty-state-text">Haz clic en el icono de carpeta para abrir un archivo de demostración (.md)</p>
      </div>
    `;
    }

    /**
     * Set the active step and update UI
     * @param {number} index - Step index to activate
     */
    setActiveStep(index) {
        if (index < 0 || index >= this.steps.length) return;

        const previousIndex = this.currentStepIndex;
        this.currentStepIndex = index;

        // Update card states
        const cards = this.container.querySelectorAll('.command-card');
        cards.forEach((card, i) => {
            card.classList.remove('active', 'completed');
            if (i < index) {
                card.classList.add('completed');
            } else if (i === index) {
                card.classList.add('active');
            }
        });

        // Scroll active card into view
        const activeCard = cards[index];
        if (activeCard) {
            activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Notify change
        if (this.onStepChange && previousIndex !== index) {
            this.onStepChange(index, this.steps[index]);
        }
    }

    /**
     * Move to next step
     */
    nextStep() {
        if (this.currentStepIndex < this.steps.length - 1) {
            this.setActiveStep(this.currentStepIndex + 1);
        }
    }

    /**
     * Move to previous step
     */
    previousStep() {
        if (this.currentStepIndex > 0) {
            this.setActiveStep(this.currentStepIndex - 1);
        }
    }

    /**
     * Go to first step
     */
    firstStep() {
        this.setActiveStep(0);
    }

    /**
     * Go to last step
     */
    lastStep() {
        this.setActiveStep(this.steps.length - 1);
    }

    /**
     * Copy command to clipboard
     * @param {string} command - Command to copy
     * @param {HTMLElement} button - Copy button element
     */
    async copyCommand(command, button) {
        try {
            await navigator.clipboard.writeText(command);
            button.classList.add('copied');

            // Reset after animation
            setTimeout(() => {
                button.classList.remove('copied');
            }, 1500);
        } catch (err) {
            console.error('Failed to copy command:', err);
        }
    }

    /**
     * Format notes text with basic HTML
     * @param {string} notes 
     * @returns {string}
     */
    formatNotes(notes) {
        // Split by lines and wrap in paragraphs
        return notes
            .split('\n')
            .filter(line => line.trim())
            .map(line => `<p>${this.escapeHtml(line)}</p>`)
            .join('');
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

    /**
     * Get current step index
     * @returns {number}
     */
    getCurrentStepIndex() {
        return this.currentStepIndex;
    }

    /**
     * Get total number of steps
     * @returns {number}
     */
    getTotalSteps() {
        return this.steps.length;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Sidebar;
}
