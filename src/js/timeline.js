/**
 * Timeline Component for TermPrompter
 * Renders the progress indicator at the bottom
 */

class Timeline {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.totalSteps = 0;
        this.currentStepIndex = 0;
        this.onPointClick = null;
    }

    /**
     * Render timeline points for the given number of steps
     * @param {number} totalSteps - Total number of steps
     */
    render(totalSteps) {
        this.totalSteps = totalSteps;
        this.container.innerHTML = '';

        if (totalSteps === 0) return;

        // Add compact class if many steps
        if (totalSteps > 10) {
            this.container.classList.add('compact');
        } else {
            this.container.classList.remove('compact');
        }

        for (let i = 0; i < totalSteps; i++) {
            const point = this.createPoint(i);
            this.container.appendChild(point);
        }

        // Set initial state
        this.setActivePoint(0);
    }

    /**
     * Create a single timeline point
     * @param {number} index - Step index
     * @returns {HTMLElement}
     */
    createPoint(index) {
        const point = document.createElement('div');
        point.className = 'timeline-point pending';
        point.dataset.stepIndex = index;

        point.innerHTML = `
      <div class="timeline-dot"></div>
      <span class="timeline-label">${index + 1}</span>
    `;

        point.addEventListener('click', () => {
            if (this.onPointClick) {
                this.onPointClick(index);
            }
        });

        return point;
    }

    /**
     * Update the active point and states
     * @param {number} index - Active step index
     */
    setActivePoint(index) {
        if (index < 0 || index >= this.totalSteps) return;

        this.currentStepIndex = index;
        const points = this.container.querySelectorAll('.timeline-point');

        points.forEach((point, i) => {
            point.classList.remove('active', 'completed', 'pending');

            if (i < index) {
                point.classList.add('completed');
            } else if (i === index) {
                point.classList.add('active');
            } else {
                point.classList.add('pending');
            }
        });
    }

    /**
     * Get current active point index
     * @returns {number}
     */
    getCurrentIndex() {
        return this.currentStepIndex;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Timeline;
}
