/**
 * Recording UI Component
 * Handles terminal recording controls and status
 */

class RecorderUI {
    constructor() {
        this.startBtn = null;
        this.stopBtn = null;
        this.saveBtn = null;
        this.indicator = null;
        this.timeDisplay = null;
        this.isRecording = false;
        this.recordingStartTime = null;
        this.timerInterval = null;
    }

    /**
     * Initialize the recorder UI
     */
    init() {
        // Get UI elements
        this.startBtn = document.getElementById('startRecordingBtn');
        this.stopBtn = document.getElementById('stopRecordingBtn');
        this.saveBtn = document.getElementById('saveRecordingBtn');
        this.indicator = document.getElementById('recordingIndicator');
        this.timeDisplay = document.getElementById('recordingTime');

        // Add event listeners
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.startRecording());
        }

        if (this.stopBtn) {
            this.stopBtn.addEventListener('click', () => this.stopRecording());
        }

        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => this.saveRecording());
        }

        console.log('RecorderUI initialized');
    }

    /**
     * Start recording
     */
    async startRecording() {
        try {
            const result = await window.electronAPI.startRecording({
                title: 'TermPrompter Recording'
            });

            if (result.success) {
                this.isRecording = true;
                this.recordingStartTime = Date.now();
                this.updateUI();
                this.startTimer();
                this.showNotification('Grabación iniciada', 'success');
            } else {
                this.showNotification(result.message || 'Error al iniciar grabación', 'error');
            }
        } catch (error) {
            console.error('Error starting recording:', error);
            this.showNotification('Error al iniciar grabación', 'error');
        }
    }

    /**
     * Stop recording
     */
    async stopRecording() {
        try {
            const result = await window.electronAPI.stopRecording();

            if (result.success) {
                this.isRecording = false;
                this.stopTimer();
                this.updateUI();
                this.showNotification(
                    `Grabación detenida (${result.stats?.duration}s, ${result.stats?.totalEvents} eventos)`,
                    'success'
                );
            } else {
                this.showNotification(result.message || 'Error al detener grabación', 'error');
            }
        } catch (error) {
            console.error('Error stopping recording:', error);
            this.showNotification('Error al detener grabación', 'error');
        }
    }

    /**
     * Save recording to file
     */
    async saveRecording() {
        try {
            const result = await window.electronAPI.saveRecording();

            if (result.success) {
                this.showNotification(`Grabación guardada: ${result.filePath}`, 'success');
                // Hide save button after successful save
                if (this.saveBtn) {
                    this.saveBtn.style.display = 'none';
                }
            } else if (!result.canceled) {
                this.showNotification(result.error || 'Error al guardar grabación', 'error');
            }
        } catch (error) {
            console.error('Error saving recording:', error);
            this.showNotification('Error al guardar grabación', 'error');
        }
    }

    /**
     * Update UI based on recording state
     */
    updateUI() {
        if (this.isRecording) {
            // Recording in progress
            if (this.startBtn) this.startBtn.style.display = 'none';
            if (this.stopBtn) this.stopBtn.style.display = 'inline-block';
            if (this.saveBtn) this.saveBtn.style.display = 'none';
            if (this.indicator) this.indicator.style.display = 'flex';
        } else {
            // Not recording
            if (this.startBtn) this.startBtn.style.display = 'inline-block';
            if (this.stopBtn) this.stopBtn.style.display = 'none';
            if (this.indicator) this.indicator.style.display = 'none';

            // Show save button if there's a recording available
            this.checkRecordingAvailable();
        }
    }

    /**
     * Check if a recording is available to save
     */
    async checkRecordingAvailable() {
        try {
            const result = await window.electronAPI.getRecordingStats();
            if (result.success && result.stats && this.saveBtn) {
                this.saveBtn.style.display = 'inline-block';
            }
        } catch (error) {
            console.error('Error checking recording stats:', error);
        }
    }

    /**
     * Start the recording timer
     */
    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            if (this.timeDisplay) {
                this.timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    /**
     * Stop the recording timer
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Show a notification message
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info)
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#00d9a5' : type === 'error' ? '#e94560' : '#0f3460'};
            color: white;
            border-radius: 6px;
            font-size: 13px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Add animations via style element
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    .recording-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-left: 8px;
        padding: 4px 10px;
        background: rgba(233, 69, 96, 0.2);
        border-radius: 4px;
        font-size: 12px;
        color: #e94560;
    }

    .recording-dot {
        width: 8px;
        height: 8px;
        background: #e94560;
        border-radius: 50%;
        animation: pulse 1.5s ease-in-out infinite;
    }

    #recordingTime {
        font-family: 'Fira Code', 'Cascadia Code', monospace;
        font-size: 11px;
        font-weight: 500;
    }

    .terminal-btn:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    #startRecordingBtn:hover {
        color: #00d9a5;
    }

    #stopRecordingBtn {
        color: #e94560;
    }

    #stopRecordingBtn:hover {
        color: #ff6b6b;
    }

    #saveRecordingBtn:hover {
        color: #ffc107;
    }
`;
document.head.appendChild(style);
