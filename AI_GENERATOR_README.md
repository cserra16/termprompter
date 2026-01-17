# 🤖 Generación de Demos con IA

Esta funcionalidad permite generar demos de terminal automáticamente usando modelos de IA generativa de **OpenAI** y **Anthropic (Claude)**.

## ✨ Características

- **Múltiples proveedores de IA**: Soporte para OpenAI (GPT-4, GPT-4 Turbo, GPT-3.5 Turbo) y Anthropic (Claude Opus 4.5, Claude 3.5 Sonnet, Claude 3 Haiku)
- **Configuración personalizable**:
  - Selección de modelo
  - Configuración de temperatura (creatividad)
  - Máximo de tokens
  - Prompts personalizables (sistema y usuario)
- **Almacenamiento seguro**: Los API tokens se guardan localmente en localStorage
- **Integración completa**: Las demos generadas se cargan automáticamente en la aplicación y se guardan en la librería

## 🚀 Cómo usar

### 1. Abrir el generador de IA

Haz clic en el botón de **estrellas ✨** ubicado en la esquina superior derecha de la aplicación, junto al botón de modo edición (lápiz).

### 2. Configurar el generador

En el modal que se abre, configura los siguientes parámetros:

#### **Proveedor de IA**
Selecciona entre:
- **OpenAI**: Usa los modelos GPT de OpenAI
- **Anthropic (Claude)**: Usa los modelos Claude de Anthropic

#### **Modelo**
Los modelos disponibles cambian según el proveedor seleccionado:

**OpenAI:**
- GPT-4 (más potente, más caro)
- GPT-4 Turbo (balance entre velocidad y calidad)
- GPT-3.5 Turbo (más rápido, más económico)

**Anthropic:**
- Claude Opus 4.5 (más potente)
- Claude 3.5 Sonnet (balance entre velocidad y calidad)
- Claude 3 Haiku (más rápido, más económico)

#### **API Token**
Ingresa tu API token del proveedor seleccionado:

- **OpenAI**: Obtén tu API key en [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Anthropic**: Obtén tu API key en [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

⚠️ **Importante**: Tu token se guarda localmente en tu navegador y nunca se comparte con terceros.

#### **Tema de la Demo**
Describe el tema sobre el que quieres generar la demo. Ejemplos:
- "Docker básico"
- "Git avanzado"
- "Python para principiantes"
- "Comandos de Linux esenciales"

#### **Prompt del Sistema** (opcional)
Instrucciones para el modelo sobre cómo generar la demo. El prompt por defecto ya está optimizado para TermPrompter:

```
Eres un experto en crear tutoriales interactivos de terminal. Genera un archivo markdown
con el formato específico de TermPrompter que incluya un título descriptivo y pasos
secuenciales. Cada paso debe tener: un número, un título descriptivo, un comando bash
ejecutable, y notas explicativas. Los comandos deben ser prácticos y educativos.
```

#### **Prompt del Usuario**
El prompt que se enviará al modelo. Se actualiza automáticamente cuando ingresas un tema. Ejemplo:

```
Genera un tutorial de terminal sobre Docker básico con 5-8 pasos progresivos.
Cada paso debe incluir un comando bash práctico y notas explicativas.
Usa el siguiente formato markdown:

# Título del Tutorial

## Paso 1: Descripción
```bash
comando
```
Notas explicativas sobre el comando
```

#### **Temperatura** (creatividad)
Valor entre 0 y 1 que controla la creatividad del modelo:
- **0.0-0.3**: Muy determinista, respuestas más predecibles
- **0.4-0.7**: Balance (recomendado: 0.7)
- **0.8-1.0**: Más creativo y variado

#### **Máximo de tokens**
Número máximo de tokens que el modelo puede generar. Valor recomendado: **2000**

### 3. Generar la demo

Haz clic en el botón **"Generar Demo"**. La aplicación:

1. Enviará la solicitud a la API del proveedor seleccionado
2. Generará el archivo markdown con el formato de TermPrompter
3. Guardará automáticamente el archivo en la carpeta `library/`
4. Cargará la demo generada en la aplicación

## 📁 Archivos generados

Las demos generadas se guardan automáticamente en la carpeta `library/` con un nombre sanitizado basado en el tema o título de la demo.

Ejemplo:
- Tema: "Docker Básico para Principiantes"
- Archivo: `library/docker-basico-para-principiantes.md`

## 🔒 Seguridad

- Los API tokens se almacenan **localmente** en tu navegador usando localStorage
- Los tokens **nunca se comparten** con servidores externos (excepto las APIs oficiales de OpenAI/Anthropic)
- Las llamadas a las APIs se realizan directamente desde tu navegador usando HTTPS

## 🛠️ Arquitectura técnica

### Archivos creados/modificados

1. **src/index.html**
   - Añadido botón de estrellas ✨ en la barra de título
   - Añadido modal de configuración de IA

2. **src/styles/main.css**
   - Estilos para el botón de IA
   - Estilos completos del modal
   - Estilos de formularios y controles

3. **src/js/ai-generator.js** (nuevo)
   - Clase `AIGenerator` que maneja toda la lógica
   - Métodos para llamar a APIs de OpenAI y Anthropic
   - Gestión de configuración y tokens
   - Procesamiento y carga de demos generadas

4. **main.js**
   - Handler IPC `save-to-library` para guardar archivos en la librería

5. **preload.js**
   - Expuesto método `saveToLibrary` en el contextBridge

6. **src/js/app.js**
   - Añadido método público `loadDemo()` para cargar demos programáticamente

## 🔄 Flujo de generación

```
Usuario hace clic en botón ✨
         ↓
Se abre modal de configuración
         ↓
Usuario configura y hace clic en "Generar Demo"
         ↓
ai-generator.js valida y guarda configuración
         ↓
Llamada a API (OpenAI o Anthropic)
         ↓
Recibe markdown generado
         ↓
MarkdownParser valida el formato
         ↓
Guarda archivo en library/ (vía IPC)
         ↓
Carga demo en la aplicación (app.loadDemo())
         ↓
Usuario ve la demo generada lista para usar
```

## 📝 Formato esperado

El modelo de IA debe generar markdown en el siguiente formato:

```markdown
# Título de la Demo

## Paso 1: Descripción del paso
```bash
comando-bash
```
Notas explicativas sobre qué hace el comando y por qué es importante.

## Paso 2: Otro paso
```bash
otro-comando
```
Más notas explicativas.
```

## 🐛 Solución de problemas

### Error: "Error en la API de OpenAI/Anthropic"

- Verifica que tu API token sea válido
- Asegúrate de tener créditos en tu cuenta
- Revisa que el modelo seleccionado esté disponible para tu cuenta

### Error: "El markdown generado no tiene el formato correcto"

- Ajusta el prompt del sistema para ser más específico sobre el formato
- Intenta con un modelo más potente (GPT-4 o Claude Opus)
- Reduce la temperatura para respuestas más predecibles

### La demo no se carga

- Verifica la consola del navegador (F12) para mensajes de error
- Asegúrate de que la carpeta `library/` exista y tenga permisos de escritura

## 💡 Consejos para mejores resultados

1. **Sé específico**: En lugar de "Docker", usa "Docker: Introducción a contenedores para principiantes"
2. **Ajusta la temperatura**: Usa 0.7 para tutoriales técnicos, 0.9 para demos más creativas
3. **Revisa y edita**: Después de generar, usa el modo edición (lápiz) para ajustar los comandos o notas
4. **Personaliza los prompts**: Modifica los prompts del sistema y usuario para obtener resultados más específicos

## 🔮 Futuras mejoras

- [ ] Soporte para más proveedores de IA (Google Gemini, local LLMs)
- [ ] Historial de demos generadas
- [ ] Templates de prompts predefinidos
- [ ] Validación de comandos bash antes de guardar
- [ ] Modo de regeneración de pasos individuales
- [ ] Exportación de configuraciones de prompts

---

**Desarrollado por**: TermPrompter Team
**Versión**: 1.0.0
**Fecha**: Enero 2026
