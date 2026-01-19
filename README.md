<p align="center">
  <img src="img/TP-name-long.png" alt="screenshot">
</p>

Herramienta didáctica en Electron para realizar demostraciones interactivas usando la terminal.

## 🎬 Demo

<video src="https://github.com/cserra16/termprompter/raw/main/img/termprompter-demo.mp4" controls width="100%">
  Tu navegador no soporta la etiqueta de vídeo. <a href="img/termprompter-demo.mp4">Descargar vídeo</a>
</video>


## Descripción

TermPrompter es una aplicación de escritorio que combina una terminal integrada con un sistema de guiones paso a paso. Ideal para:

- 📚 **Formadores y profesores** - Presenta demos técnicas sin perder el hilo
- 🎥 **Creadores de contenido** - Graba tutoriales siguiendo un guión estructurado
- 🎤 **Ponentes** - Realiza demostraciones en conferencias sin improvisar
- 🤖 **Generación con IA** - Crea demos automáticamente con GPT-5 o Claude

## Características

### Terminal Integrada
- 🖥️ **Terminal real xterm.js** - Terminal completa con soporte PTY
- 🔤 **Control de fuente** - Aumenta/reduce el tamaño con botones +/-
- 🧹 **Limpiar terminal** - Botón para limpiar la pantalla

### Guión de Comandos
- 📋 **Tarjetas de pasos** - Cada paso con comando y notas explicativas
- 🚇 **Timeline visual** - Progreso tipo "línea de metro"
- ⌨️ **Navegación por teclado** - Flechas, Page Up/Down, Home/End
- 📝 **Modo edición** - Edita y reordena pasos directamente en la app
- 🔄 **Auto-tracking** - Avanza automáticamente cuando ejecutas el comando correcto

### Generación con IA
- 🤖 **OpenAI GPT-5** - Genera demos con los últimos modelos de OpenAI
- 🧠 **Anthropic Claude** - Soporte para Claude Opus 4.5, Sonnet y Haiku
- ⚙️ **Configurable** - Ajusta temperatura, tokens y prompts personalizados

### Grabación
- 🎬 **Grabación de sesiones** - Captura todo lo que ocurre en terminal
- 📼 **Formato asciicast v2** - Compatible con asciinema player
- ⏱️ **Indicador de tiempo** - Muestra duración de la grabación

## Demos Incluidas

El proyecto incluye cursos completos listos para usar:

### Docker (8 demos)
- Introducción, Imágenes, Contenedores avanzados
- Volúmenes, Redes, Dockerfile
- Docker Compose, Proyecto final

### Linux (6 demos)
- Comandos básicos, Gestión de archivos
- Permisos, Procesos, Redes, Avanzado

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/cserra16/termprompter.git
cd termprompter

# Instalar dependencias
npm install

# Ejecutar la aplicación
npm start
```

## Uso

### Crear un archivo de demo

Crea un archivo Markdown con el siguiente formato:

````markdown
# Mi Demo

## Paso 1: Descripción del paso
```bash
comando_a_ejecutar
```
Notas para el presentador sobre este paso.

## Paso 2: Siguiente paso
```bash
otro_comando
```
Más notas explicativas aquí.
````

### Generar demos con IA

1. Haz clic en el botón ⭐ (estrella) en la barra de título
2. Selecciona el proveedor (OpenAI o Anthropic)
3. Introduce tu API key
4. Escribe el tema de la demo
5. Haz clic en "Generar Demo"

### Controles de teclado

| Tecla | Acción |
|-------|--------|
| `Page Down` | Siguiente paso (funciona siempre) |
| `Page Up` | Paso anterior (funciona siempre) |
| `↓` `→` | Siguiente paso |
| `↑` `←` | Paso anterior |
| `Home` | Ir al primer paso |
| `End` | Ir al último paso |
| `Ctrl+Z` | Deshacer (en modo edición) |

## Estructura del proyecto

```
termprompter/
├── main.js              # Proceso principal Electron + API handlers
├── preload.js           # Bridge IPC seguro
├── recorder.js          # Grabador de terminal
├── src/
│   ├── index.html       # HTML principal
│   ├── styles/          # Estilos CSS
│   └── js/
│       ├── app.js       # Aplicación principal
│       ├── terminal.js  # Componente de terminal
│       ├── sidebar.js   # Panel de tarjetas
│       ├── timeline.js  # Línea de progreso
│       ├── ai-generator.js  # Generador de demos con IA
│       └── recorder-ui.js   # UI de grabación
├── demos/               # Demos de ejemplo (Docker, Linux)
└── library/             # Demos generadas por IA
```

## Desarrollo

```bash
# Modo desarrollo con DevTools
npm run dev
```

## Tecnologías

- [Electron](https://www.electronjs.org/) - Framework de aplicación de escritorio
- [xterm.js](https://xtermjs.org/) - Emulador de terminal
- [node-pty](https://github.com/microsoft/node-pty) - Pseudo terminal bindings
- [OpenAI API](https://platform.openai.com/) - GPT-5 para generación de demos
- [Anthropic API](https://www.anthropic.com/) - Claude para generación de demos

## Documentación adicional

- [RECORDING.md](RECORDING.md) - Detalles sobre grabación de terminal
- [AI_GENERATOR_README.md](AI_GENERATOR_README.md) - Guía del generador de IA

## Licencia

MIT
