/**
 * AIGenerator - Handles AI-powered demo generation
 * Supports OpenAI and Anthropic (Claude) APIs
 */
class AIGenerator {
  constructor() {
    this.modal = null;
    this.provider = 'openai';
    this.config = {
      provider: 'openai',
      model: 'gpt-5',
      apiToken: '',
      temperature: 0.7,
      maxTokens: 2000
    };

    this.init();
  }

  init() {
    this.modal = document.getElementById('aiGeneratorModal');
    this.setupEventListeners();
    this.loadSavedConfig();
  }

  setupEventListeners() {
    // Open modal button
    const aiBtn = document.getElementById('aiGeneratorBtn');
    if (aiBtn) {
      aiBtn.addEventListener('click', () => this.openModal());
    }

    // Close modal buttons
    const closeBtn = document.getElementById('closeAiModal');
    const cancelBtn = document.getElementById('cancelAiModal');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.closeModal());
    }

    // Close on outside click
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });
    }

    // Provider change
    const providerSelect = document.getElementById('aiProvider');
    if (providerSelect) {
      providerSelect.addEventListener('change', (e) => {
        this.onProviderChange(e.target.value);
      });
    }

    // Temperature slider
    const temperatureInput = document.getElementById('temperature');
    const temperatureValue = document.getElementById('temperatureValue');
    if (temperatureInput && temperatureValue) {
      temperatureInput.addEventListener('input', (e) => {
        temperatureValue.textContent = e.target.value;
      });
    }

    // Generate button
    const generateBtn = document.getElementById('generateDemoBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateDemo());
    }

    // Update user prompt when topic changes
    const topicInput = document.getElementById('demoTopic');
    const userPromptInput = document.getElementById('userPrompt');
    if (topicInput && userPromptInput) {
      topicInput.addEventListener('input', (e) => {
        const topic = e.target.value;
        if (topic) {
          const basePrompt = `Genera un tutorial de terminal sobre ${topic} con 5-8 pasos progresivos. Cada paso debe incluir un comando bash práctico y notas explicativas. Usa el siguiente formato markdown:

# Título del Tutorial

## Paso 1: Descripción
\`\`\`bash
comando
\`\`\`
Notas explicativas sobre el comando`;
          userPromptInput.value = basePrompt;
        }
      });
    }
  }

  openModal() {
    if (this.modal) {
      this.modal.style.display = 'flex';
      document.getElementById('aiGeneratorBtn')?.classList.add('active');
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.style.display = 'none';
      document.getElementById('aiGeneratorBtn')?.classList.remove('active');
    }
  }

  onProviderChange(provider) {
    this.provider = provider;

    // Show/hide models based on provider
    const openaiModels = document.querySelectorAll('.openai-model');
    const anthropicModels = document.querySelectorAll('.anthropic-model');
    const modelSelect = document.getElementById('aiModel');

    if (provider === 'openai') {
      openaiModels.forEach(opt => opt.style.display = 'block');
      anthropicModels.forEach(opt => opt.style.display = 'none');
      if (modelSelect) modelSelect.value = 'gpt-5';
    } else {
      openaiModels.forEach(opt => opt.style.display = 'none');
      anthropicModels.forEach(opt => opt.style.display = 'block');
      if (modelSelect) modelSelect.value = 'claude-opus-4-5-20251124';
    }
  }

  loadSavedConfig() {
    try {
      // Load API tokens from localStorage (secure storage)
      const savedTokens = localStorage.getItem('ai_api_tokens');
      if (savedTokens) {
        const tokens = JSON.parse(savedTokens);
        const provider = localStorage.getItem('ai_last_provider') || 'openai';

        const tokenInput = document.getElementById('apiToken');
        if (tokenInput && tokens[provider]) {
          tokenInput.value = tokens[provider];
        }

        const providerSelect = document.getElementById('aiProvider');
        if (providerSelect) {
          providerSelect.value = provider;
          this.onProviderChange(provider);
        }
      }
    } catch (error) {
      console.error('Error loading saved config:', error);
    }
  }

  saveConfig() {
    try {
      const provider = document.getElementById('aiProvider').value;
      const apiToken = document.getElementById('apiToken').value;

      // Save tokens securely in localStorage
      let tokens = {};
      const savedTokens = localStorage.getItem('ai_api_tokens');
      if (savedTokens) {
        tokens = JSON.parse(savedTokens);
      }

      if (apiToken) {
        tokens[provider] = apiToken;
        localStorage.setItem('ai_api_tokens', JSON.stringify(tokens));
        localStorage.setItem('ai_last_provider', provider);
      }
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }

  async generateDemo() {
    const generateBtn = document.getElementById('generateDemoBtn');
    const provider = document.getElementById('aiProvider').value;
    const model = document.getElementById('aiModel').value;
    const apiToken = document.getElementById('apiToken').value;
    const topic = document.getElementById('demoTopic').value;
    const systemPrompt = document.getElementById('systemPrompt').value;
    const userPrompt = document.getElementById('userPrompt').value;
    const temperature = parseFloat(document.getElementById('temperature').value);
    const maxTokens = parseInt(document.getElementById('maxTokens').value);

    // Validation
    if (!apiToken) {
      alert('Por favor, ingresa tu API Token');
      return;
    }

    if (!topic && !userPrompt) {
      alert('Por favor, ingresa un tema o un prompt personalizado');
      return;
    }

    // Save config
    this.saveConfig();

    // Disable button and show loading
    const originalContent = generateBtn.innerHTML;
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span class="loading-spinner"></span>Generando...';

    try {
      let markdown;

      if (provider === 'openai') {
        markdown = await this.generateWithOpenAI({
          model,
          apiToken,
          systemPrompt,
          userPrompt,
          temperature,
          maxTokens
        });
      } else {
        markdown = await this.generateWithAnthropic({
          model,
          apiToken,
          systemPrompt,
          userPrompt,
          temperature,
          maxTokens
        });
      }

      // Load the generated demo into the app
      await this.loadGeneratedDemo(markdown, topic);

      // Close modal
      this.closeModal();

      // Show success message
      alert('✨ Demo generada exitosamente!');

    } catch (error) {
      console.error('Error generating demo:', error);
      alert(`Error al generar demo: ${error.message}`);
    } finally {
      // Restore button
      generateBtn.disabled = false;
      generateBtn.innerHTML = originalContent;
    }
  }

  async generateWithOpenAI(config) {
    // Use IPC to call API from main process (bypasses CSP)
    const result = await window.electronAPI.generateWithOpenAI(config);

    if (!result.success) {
      throw new Error(result.error || 'Error en la API de OpenAI');
    }

    return result.content;
  }

  async generateWithAnthropic(config) {
    // Use IPC to call API from main process (bypasses CSP)
    const result = await window.electronAPI.generateWithAnthropic(config);

    if (!result.success) {
      throw new Error(result.error || 'Error en la API de Anthropic');
    }

    return result.content;
  }

  async loadGeneratedDemo(markdown, topic) {
    // Parse the markdown
    const demo = MarkdownParser.parse(markdown);

    if (!demo || !demo.steps || demo.steps.length === 0) {
      throw new Error('El markdown generado no tiene el formato correcto');
    }

    // Save to library using the existing save functionality
    const filename = this.sanitizeFilename(topic || demo.title);
    const result = await window.electronAPI.saveToLibrary(filename, markdown);

    if (!result.success) {
      throw new Error(result.error || 'Error al guardar el archivo');
    }

    // Load the demo in the app (trigger the app to reload the demo)
    if (window.app) {
      window.app.loadDemo(demo, result.filePath);
    }
  }

  sanitizeFilename(name) {
    // Remove invalid characters and create a safe filename
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50) + '.md';
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.aiGenerator = new AIGenerator();
  });
} else {
  window.aiGenerator = new AIGenerator();
}
