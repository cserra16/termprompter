# Terminal Recording Feature

## Descripción

TermPrompter ahora incluye funcionalidad de grabación de terminal similar a [asciinema](https://asciinema.org/), que permite capturar sesiones de terminal completas y reproducirlas posteriormente.

## Características

- **Formato asciicast v2**: Compatible con el formato estándar de asciinema
- **Captura completa**: Registra tanto entrada (input) como salida (output) del terminal
- **Timestamps precisos**: Cada evento incluye un timestamp relativo al inicio de la grabación
- **Archivos ligeros**: Los archivos .cast son archivos de texto JSON, muy compactos
- **Reproducción**: Los archivos pueden reproducirse con asciinema player o cualquier herramienta compatible

## Uso

### Controles de Grabación

En la barra de controles del terminal encontrarás los siguientes botones:

1. **Botón Grabar (⚫)**: Inicia una nueva grabación
2. **Botón Detener (⏹)**: Detiene la grabación actual
3. **Botón Guardar (💾)**: Guarda la grabación en un archivo .cast
4. **Indicador de Tiempo**: Muestra el tiempo transcurrido durante la grabación

### Flujo de Trabajo

1. Abre TermPrompter
2. Haz clic en el botón de grabar para iniciar la captura
3. Realiza tus comandos en el terminal normalmente
4. Haz clic en detener cuando termines
5. Haz clic en guardar para exportar el archivo .cast

### API Programática

También puedes controlar la grabación programáticamente:

```javascript
// Iniciar grabación
await window.electronAPI.startRecording({
    title: 'Mi Demo',
    cols: 80,
    rows: 24
});

// Detener grabación
await window.electronAPI.stopRecording();

// Guardar grabación
await window.electronAPI.saveRecording('/path/to/file.cast');

// Obtener estadísticas
const stats = await window.electronAPI.getRecordingStats();
```

## Formato asciicast v2

Los archivos generados siguen el formato [asciicast v2](https://docs.asciinema.org/manual/asciicast/v2/):

### Estructura

El archivo .cast es un archivo de texto con formato newline-delimited JSON:
- **Primera línea**: Header JSON con metadata
- **Líneas siguientes**: Eventos en formato [timestamp, tipo, datos]

### Ejemplo de Archivo .cast

```json
{"version": 2, "width": 80, "height": 24, "timestamp": 1704067200, "title": "TermPrompter Recording", "env": {"TERM": "xterm-256color", "SHELL": "/bin/bash"}}
[0.123456, "o", "\u001b[32m$\u001b[0m "]
[1.234567, "i", "ls"]
[1.345678, "i", "\r"]
[1.456789, "o", "file1.txt  file2.txt  folder/\r\n"]
[2.567890, "o", "\u001b[32m$\u001b[0m "]
```

### Tipos de Eventos

- **"o"** (output): Datos de salida del terminal
- **"i"** (input): Datos de entrada del usuario
- **"r"** (resize): Cambio de dimensiones del terminal (extensión custom)

## Reproducir Grabaciones

### Con asciinema

```bash
# Instalar asciinema
pip install asciinema

# Reproducir archivo
asciinema play recording.cast
```

### Con asciinema-player (Web)

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="asciinema-player.css" />
</head>
<body>
  <div id="player"></div>
  <script src="asciinema-player.min.js"></script>
  <script>
    AsciinemaPlayer.create('/path/to/recording.cast', document.getElementById('player'));
  </script>
</body>
</html>
```

## Casos de Uso

1. **Tutoriales**: Graba tutoriales paso a paso para compartir
2. **Documentación**: Crea documentación interactiva de comandos
3. **Demostraciones**: Prepara demos que se pueden reproducir de forma consistente
4. **Debugging**: Captura sesiones de terminal para análisis posterior
5. **Formación**: Crea material educativo reutilizable

## Limitaciones Actuales

- No captura el estado visual completo del terminal (solo texto y códigos ANSI)
- Los eventos de resize son una extensión custom y pueden no ser compatibles con todos los reproductores
- El tamaño del archivo crece con la duración de la sesión (aunque sigue siendo muy compacto)

## Implementación Técnica

### Arquitectura

```
┌─────────────────┐
│   Frontend UI   │
│  (recorder-ui)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   IPC Bridge    │
│   (preload.js)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐       ┌──────────────┐
│   Main Process  │◄─────►│   Recorder   │
│    (main.js)    │       │ (recorder.js)│
└────────┬────────┘       └──────────────┘
         │
         ▼
┌─────────────────┐
│    node-pty     │
│  (PTY Process)  │
└─────────────────┘
```

### Componentes

- **recorder.js**: Módulo principal de grabación (formato asciicast v2)
- **recorder-ui.js**: Interfaz de usuario para controles de grabación
- **main.js**: Integración con node-pty y handlers IPC
- **preload.js**: Bridge de comunicación entre renderer y main process

## Referencias

- [asciinema](https://asciinema.org/)
- [asciicast v2 Format](https://docs.asciinema.org/manual/asciicast/v2/)
- [asciinema Player](https://docs.asciinema.org/manual/player/)
- [node-pty](https://github.com/microsoft/node-pty)
