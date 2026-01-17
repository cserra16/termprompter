/**
 * Asciinema-like Terminal Recorder
 * Implements asciicast v2 format
 * https://docs.asciinema.org/manual/asciicast/v2/
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

class TerminalRecorder {
    constructor() {
        this.isRecording = false;
        this.events = [];
        this.startTime = null;
        this.header = null;
        this.cols = 80;
        this.rows = 24;
    }

    /**
     * Start recording a terminal session
     * @param {Object} options - Recording options
     * @param {number} options.cols - Terminal columns
     * @param {number} options.rows - Terminal rows
     * @param {string} options.title - Recording title
     * @param {Object} options.env - Environment variables
     */
    startRecording(options = {}) {
        if (this.isRecording) {
            console.warn('Recording already in progress');
            return false;
        }

        this.cols = options.cols || 80;
        this.rows = options.rows || 24;
        this.events = [];
        this.startTime = Date.now();
        this.isRecording = true;

        // Create asciicast v2 header
        this.header = {
            version: 2,
            width: this.cols,
            height: this.rows,
            timestamp: Math.floor(this.startTime / 1000), // Unix timestamp
            title: options.title || 'TermPrompter Recording',
            env: {
                TERM: options.env?.TERM || 'xterm-256color',
                SHELL: options.env?.SHELL || process.env.SHELL || '/bin/bash'
            }
        };

        console.log('Recording started:', this.header);
        return true;
    }

    /**
     * Stop recording
     */
    stopRecording() {
        if (!this.isRecording) {
            console.warn('No recording in progress');
            return false;
        }

        this.isRecording = false;
        console.log(`Recording stopped. Captured ${this.events.length} events`);
        return true;
    }

    /**
     * Record terminal output event
     * @param {string} data - Terminal output data
     */
    recordOutput(data) {
        if (!this.isRecording) return;

        const timestamp = (Date.now() - this.startTime) / 1000; // Seconds with decimals
        this.events.push([timestamp, 'o', data]);
    }

    /**
     * Record terminal input event
     * @param {string} data - Terminal input data
     */
    recordInput(data) {
        if (!this.isRecording) return;

        const timestamp = (Date.now() - this.startTime) / 1000; // Seconds with decimals
        this.events.push([timestamp, 'i', data]);
    }

    /**
     * Update terminal dimensions during recording
     * @param {number} cols - New columns
     * @param {number} rows - New rows
     */
    updateDimensions(cols, rows) {
        if (!this.isRecording) return;

        this.cols = cols;
        this.rows = rows;

        // Record resize event (custom extension to v2 format)
        const timestamp = (Date.now() - this.startTime) / 1000;
        this.events.push([timestamp, 'r', `${cols}x${rows}`]);
    }

    /**
     * Get recording data in asciicast v2 format
     * @returns {string} Recording data as newline-delimited JSON
     */
    getRecording() {
        if (!this.header) {
            throw new Error('No recording available');
        }

        // First line: header
        const lines = [JSON.stringify(this.header)];

        // Following lines: events
        this.events.forEach(event => {
            lines.push(JSON.stringify(event));
        });

        return lines.join('\n');
    }

    /**
     * Save recording to file
     * @param {string} filePath - Path to save the .cast file
     * @returns {Promise<string>} Promise resolving to the file path
     */
    async saveRecording(filePath) {
        if (!this.header) {
            throw new Error('No recording available');
        }

        const recording = this.getRecording();

        // Ensure .cast extension
        if (!filePath.endsWith('.cast')) {
            filePath += '.cast';
        }

        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, recording, 'utf8', (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`Recording saved to: ${filePath}`);
                    resolve(filePath);
                }
            });
        });
    }

    /**
     * Generate a default filename for the recording
     * @returns {string} Default filename with timestamp
     */
    generateFilename() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        return `termprompter-${timestamp}.cast`;
    }

    /**
     * Get recording statistics
     * @returns {Object} Recording stats
     */
    getStats() {
        if (!this.header) {
            return null;
        }

        const duration = this.events.length > 0
            ? this.events[this.events.length - 1][0]
            : 0;

        const inputEvents = this.events.filter(e => e[1] === 'i').length;
        const outputEvents = this.events.filter(e => e[1] === 'o').length;

        return {
            duration: duration.toFixed(2),
            totalEvents: this.events.length,
            inputEvents,
            outputEvents,
            dimensions: `${this.cols}x${this.rows}`,
            startTime: new Date(this.startTime).toISOString()
        };
    }

    /**
     * Reset the recorder
     */
    reset() {
        this.isRecording = false;
        this.events = [];
        this.startTime = null;
        this.header = null;
    }
}

module.exports = TerminalRecorder;
