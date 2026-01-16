/**
 * Markdown Parser for TermPrompter
 * Parses demo markdown files into structured step objects
 */

class MarkdownParser {
    /**
     * Parse a markdown string into demo steps
     * @param {string} content - The markdown content
     * @returns {{ title: string, steps: Array<{stepNumber: number, title: string, command: string, notes: string}> }}
     */
    static parse(content) {
        const lines = content.split('\n');
        const result = {
            title: '',
            steps: []
        };

        let currentStep = null;
        let inCodeBlock = false;
        let codeBlockContent = [];
        let notesContent = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Parse main title (# Title)
            if (line.startsWith('# ') && !result.title) {
                result.title = line.substring(2).trim();
                continue;
            }

            // Parse step header (## Paso N: Description or ## Step N: Description)
            const stepMatch = line.match(/^##\s+(?:Paso|Step)\s*(\d+)[:\s]*(.*)$/i);
            if (stepMatch) {
                // Save previous step if exists
                if (currentStep) {
                    currentStep.notes = notesContent.join('\n').trim();
                    result.steps.push(currentStep);
                }

                // Start new step
                currentStep = {
                    stepNumber: parseInt(stepMatch[1], 10),
                    title: stepMatch[2].trim() || `Paso ${stepMatch[1]}`,
                    command: '',
                    notes: ''
                };
                notesContent = [];
                continue;
            }

            // Code block start/end
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    // Starting code block
                    inCodeBlock = true;
                    codeBlockContent = [];
                } else {
                    // Ending code block
                    inCodeBlock = false;
                    if (currentStep) {
                        currentStep.command = codeBlockContent.join('\n').trim();
                    }
                }
                continue;
            }

            // Inside code block - collect command lines
            if (inCodeBlock) {
                codeBlockContent.push(line);
                continue;
            }

            // Collect notes (any text after the code block within a step)
            if (currentStep && line.trim() && !line.startsWith('#')) {
                notesContent.push(line);
            }
        }

        // Don't forget the last step
        if (currentStep) {
            currentStep.notes = notesContent.join('\n').trim();
            result.steps.push(currentStep);
        }

        // If no steps were found with headers, try alternative parsing
        if (result.steps.length === 0) {
            return this.parseAlternative(content);
        }

        return result;
    }

    /**
     * Alternative parsing for simpler markdown formats
     * Treats each code block as a step
     * @param {string} content 
     * @returns {{ title: string, steps: Array }}
     */
    static parseAlternative(content) {
        const result = {
            title: 'Demo',
            steps: []
        };

        const lines = content.split('\n');
        let inCodeBlock = false;
        let codeBlockContent = [];
        let notesBuffer = [];
        let stepNumber = 0;

        // Get title from first heading
        for (const line of lines) {
            if (line.startsWith('# ')) {
                result.title = line.substring(2).trim();
                break;
            }
        }

        for (const line of lines) {
            // Skip title line
            if (line.startsWith('# ')) continue;

            // Code block handling
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    codeBlockContent = [];
                } else {
                    inCodeBlock = false;
                    stepNumber++;
                    result.steps.push({
                        stepNumber,
                        title: `Paso ${stepNumber}`,
                        command: codeBlockContent.join('\n').trim(),
                        notes: notesBuffer.join('\n').trim()
                    });
                    notesBuffer = [];
                }
                continue;
            }

            if (inCodeBlock) {
                codeBlockContent.push(line);
            } else if (line.trim() && !line.startsWith('#')) {
                // Collect notes before next code block
                if (result.steps.length === 0 || notesBuffer.length === 0) {
                    notesBuffer.push(line);
                }
            }
        }

        return result;
    }

    /**
     * Validate that the parsed result has valid steps
     * @param {{ title: string, steps: Array }} parsed 
     * @returns {boolean}
     */
    static isValid(parsed) {
        return parsed && parsed.steps && parsed.steps.length > 0;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownParser;
}
