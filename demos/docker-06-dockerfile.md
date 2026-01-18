# Curso Docker - Módulo 6: Dockerfile Avanzado

## Paso 1: Crear directorio para el proyecto
```bash
mkdir -p ~/docker-app && cd ~/docker-app
```
Crea un directorio de trabajo para nuestros ejercicios con Dockerfile.

## Paso 2: Crear Dockerfile básico
```bash
cat > Dockerfile << 'EOF'
FROM alpine:latest
RUN apk add --no-cache curl
CMD ["curl", "--version"]
EOF
```
Crea un Dockerfile simple que instala curl en Alpine Linux. FROM define imagen base, RUN ejecuta comandos, CMD define el comando por defecto.

## Paso 3: Construir imagen desde Dockerfile
```bash
docker build -t mi-curl:v1 .
```
Construye una imagen usando el Dockerfile del directorio actual (.). -t asigna nombre y tag a la imagen.

## Paso 4: Ejecutar contenedor desde imagen construida
```bash
docker run --rm mi-curl:v1
```
Ejecuta el contenedor y muestra la versión de curl. --rm elimina el contenedor automáticamente al terminar.

## Paso 5: Crear aplicación Python simple
```bash
cat > app.py << 'EOF'
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return '¡Hola desde Docker!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF
```
Crea una aplicación web simple con Flask que responde "¡Hola desde Docker!".

## Paso 6: Crear requirements.txt
```bash
echo "flask==2.3.0" > requirements.txt
```
Define las dependencias de Python. Flask es el framework web que necesitamos.

## Paso 7: Crear Dockerfile para Python app
```bash
cat > Dockerfile << 'EOF'
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
EXPOSE 5000
CMD ["python", "app.py"]
EOF
```
Dockerfile optimizado: WORKDIR establece directorio de trabajo, COPY copia archivos, EXPOSE documenta el puerto (no lo publica).

## Paso 8: Construir imagen de Python app
```bash
docker build -t python-app:v1 .
```
Construye la imagen. Docker ejecuta cada instrucción del Dockerfile en capas separadas para caching eficiente.

## Paso 9: Ejecutar aplicación Python
```bash
docker run -d --name flask-app -p 5000:5000 python-app:v1
```
Ejecuta la aplicación Flask y mapea el puerto 5000.

## Paso 10: Probar la aplicación
```bash
sleep 2 && curl http://localhost:5000
```
Espera que la app inicie y hace una petición. Deberías ver "¡Hola desde Docker!".

## Paso 11: Usar multi-stage build para optimizar
```bash
cat > Dockerfile << 'EOF'
# Etapa de build
FROM node:16 AS builder
WORKDIR /app
RUN echo '{"name":"app","version":"1.0.0"}' > package.json
RUN echo 'console.log("App compilada");' > app.js
RUN npm install --production

# Etapa final
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app .
CMD ["node", "app.js"]
EOF
```
Multi-stage build: construye en una imagen grande (node:16) pero copia solo los artefactos necesarios a una imagen pequeña (alpine).

## Paso 12: Construir imagen multi-stage
```bash
docker build -t node-app:multi .
```
Construye usando multi-stage. La imagen final es mucho más pequeña porque no incluye herramientas de build.

## Paso 13: Comparar tamaños de imágenes
```bash
docker images | grep -E "node-app|python-app"
```
Compara los tamaños. Las imágenes multi-stage y basadas en alpine son significativamente más pequeñas.

## Paso 14: Usar ARG para parametrizar build
```bash
cat > Dockerfile << 'EOF'
FROM alpine:latest
ARG VERSION=1.0
RUN echo "Building version ${VERSION}" > /version.txt
CMD cat /version.txt
EOF
```
ARG define variables de tiempo de construcción. Puedes sobrescribirlas con --build-arg.

## Paso 15: Construir con argumento personalizado
```bash
docker build --build-arg VERSION=2.5 -t app-version:2.5 .
```
Pasa un valor personalizado para VERSION. Útil para versionado o configuración en CI/CD.

## Paso 16: Verificar el argumento
```bash
docker run --rm app-version:2.5
```
Muestra "Building version 2.5", confirmando que el ARG fue usado correctamente.

## Paso 17: Usar ENTRYPOINT vs CMD
```bash
cat > Dockerfile << 'EOF'
FROM alpine:latest
ENTRYPOINT ["echo", "Mensaje:"]
CMD ["predeterminado"]
EOF
```
ENTRYPOINT define el ejecutable principal (no se puede sobrescribir fácilmente). CMD proporciona argumentos por defecto (se pueden sobrescribir).

## Paso 18: Construir y probar ENTRYPOINT
```bash
docker build -t echo-app . && docker run --rm echo-app
```
Ejecuta con CMD por defecto. Muestra "Mensaje: predeterminado".

## Paso 19: Sobrescribir CMD
```bash
docker run --rm echo-app "personalizado"
```
Sobrescribe CMD con "personalizado". Muestra "Mensaje: personalizado". ENTRYPOINT se mantiene.

## Paso 20: Limpiar recursos
```bash
docker stop flask-app 2>/dev/null && docker rm flask-app 2>/dev/null && cd ~ && rm -rf ~/docker-app
```
Detiene contenedores, elimina el directorio de trabajo. ¡Listo para el siguiente módulo!
