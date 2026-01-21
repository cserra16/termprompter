# Demo de Docker Básico

## Paso 1: Verificar la instalación de Docker
```bash
docker --version
```
Comprueba que Docker está instalado correctamente. Deberías ver algo como "Docker version 24.x.x".

## Paso 2: Ver imágenes disponibles
```bash
docker images
```
Lista todas las imágenes descargadas en tu sistema. Si es una instalación nueva, estará vacía.

## Paso 3: Descargar una imagen
```bash
docker pull nginx
```
Descarga la imagen oficial de Nginx desde Docker Hub. Las imágenes son plantillas de solo lectura para crear contenedores.

## Paso 4: Ejecutar un contenedor
```bash
docker run -d -p 8080:80 --name mi-nginx nginx
```
- `-d`: Ejecuta en segundo plano (detached)
- `-p 8080:80`: Mapea el puerto 8080 local al 80 del contenedor
- `--name`: Asigna un nombre al contenedor

## Paso 5: Ver contenedores en ejecución
```bash
docker ps
```
Muestra los contenedores activos. Añade `-a` para ver también los detenidos.

## Paso 6: Ver los logs del contenedor
```bash
docker logs mi-nginx
```
Muestra la salida estándar del contenedor. Útil para depurar problemas.

## Paso 7: Ejecutar comandos dentro del contenedor
```bash
docker exec -it mi-nginx bash
```
Abre una shell interactiva dentro del contenedor. `-it` = interactive + tty. Escribe `exit` para salir.

## Paso 8: Detener el contenedor
```bash
docker stop mi-nginx
```
Detiene el contenedor de forma ordenada (envía SIGTERM, espera 10s, luego SIGKILL).

## Paso 9: Iniciar un contenedor detenido
```bash
docker start mi-nginx
```
Vuelve a iniciar un contenedor que fue detenido previamente.

## Paso 10: Eliminar el contenedor
```bash
docker rm -f mi-nginx
```
Elimina el contenedor. `-f` fuerza la eliminación aunque esté en ejecución.

## Paso 11: Crear un Dockerfile
```bash
cat << 'EOF' > Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
EOF
```
Crea un Dockerfile básico para una aplicación Node.js. Define cómo construir la imagen.

## Paso 12: Construir una imagen personalizada
```bash
docker build -t mi-app:1.0 .
```
Construye una imagen a partir del Dockerfile. `-t` asigna nombre y tag.

## Paso 13: Ver el uso de recursos
```bash
docker stats --no-stream
```
Muestra CPU, memoria y red de los contenedores en ejecución. Sin `--no-stream` actualiza en tiempo real.

## Paso 14: Limpiar recursos no utilizados
```bash
docker system prune -a
```
Elimina imágenes, contenedores y redes no utilizadas. ¡Cuidado! Libera espacio pero elimina datos.

## Paso 15: Docker Compose (bonus)
```bash
docker compose up -d
```
Levanta servicios definidos en `docker-compose.yml`. Ideal para aplicaciones multi-contenedor.
