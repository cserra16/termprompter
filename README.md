# TermPrompter

Herramienta didáctica en Electron para realizar demostraciones interactivas usando la terminal.

![screenshot](screenshot.png)

## Descripción

TermPrompter es una aplicación de escritorio que se acopla a la ventana de tu terminal como una barra lateral, mostrando un guión de comandos paso a paso. Ideal para:

- 📚 **Formadores y profesores** - Presenta demos técnicas sin perder el hilo
- 🎥 **Creadores de contenido** - Graba tutoriales siguiendo un guión estructurado
- 🎤 **Ponentes** - Realiza demostraciones en conferencias sin improvisar

## Características

- 📋 **Tarjetas de comandos** - Visualiza cada paso con su comando y notas explicativas
- 🚇 **Timeline visual** - Seguimiento del progreso tipo "línea de metro"
- ⌨️ **Navegación por teclado** - Avanza con las flechas o Enter
- 📄 **Formato Markdown** - Define tus demos en archivos `.md` fáciles de editar
- 🎨 **Tema oscuro** - Diseñado para combinar con cualquier terminal
- 📋 **Copiar comandos** - Un clic para copiar el comando al portapapeles
- 🎬 **Grabación de terminal** - Captura sesiones completas en formato asciicast (compatible con asciinema)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/usuario/termprompter.git
cd termprompter

# Instalar dependencias
npm install

# Ejecutar la aplicación
npm start
```

## Uso

### Crear un archivo de demo

Crea un archivo Markdown con el siguiente formato:

```markdown
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
```

### Controles de teclado

| Tecla | Acción |
|-------|--------|
| `↓` `→` `Enter` `Espacio` | Siguiente paso |
| `↑` `←` | Paso anterior |
| `Home` | Ir al primer paso |
| `End` | Ir al último paso |

## Estructura del proyecto

```
termprompter/
├── main.js           # Proceso principal Electron
├── preload.js        # Script de precarga IPC
├── src/
│   ├── index.html    # HTML principal
│   ├── styles/       # Estilos CSS
│   └── js/           # Módulos JavaScript
└── demos/            # Demos de ejemplo
```

## Desarrollo

```bash
# Modo desarrollo con DevTools
npm run dev
```

## Grabación de Terminal

TermPrompter incluye funcionalidad de grabación similar a asciinema. Puedes:
- Grabar sesiones de terminal completas
- Guardar en formato asciicast v2 (.cast)
- Reproducir con asciinema player o cualquier herramienta compatible

Consulta [RECORDING.md](RECORDING.md) para más información sobre la funcionalidad de grabación.

## Tecnologías

- [Electron](https://www.electronjs.org/) - Framework de aplicación de escritorio
- [Marked](https://marked.js.org/) - Parser de Markdown
- [xterm.js](https://xtermjs.org/) - Terminal emulator para el navegador
- [node-pty](https://github.com/microsoft/node-pty) - Pseudo terminal bindings

## Licencia

MIT
