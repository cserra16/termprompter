# Curso Docker - Módulo 2: Gestión de Imágenes

## Paso 1: Listar todas las imágenes locales
```bash
docker images
```
Muestra todas las imágenes Docker almacenadas en tu sistema local, incluyendo REPOSITORY, TAG, IMAGE ID, fecha de creación y tamaño.

## Paso 2: Descargar una imagen específica
```bash
docker pull alpine
```
Descarga la imagen Alpine Linux, una distribución muy ligera (aproximadamente 5MB). No ejecuta ningún contenedor, solo descarga la imagen.

## Paso 3: Descargar imagen con tag específico
```bash
docker pull python:3.9-slim
```
Descarga una versión específica de Python. El tag "3.9-slim" indica Python 3.9 en una versión reducida. Sin tag, descarga "latest".

## Paso 4: Ver el historial de capas de una imagen
```bash
docker history alpine
```
Muestra las capas que componen la imagen Alpine, incluyendo los comandos usados para crearla y el tamaño de cada capa.

## Paso 5: Inspeccionar metadatos de una imagen
```bash
docker image inspect alpine
```
Devuelve información detallada en JSON: arquitectura, sistema operativo, variables de entorno, punto de entrada, autor, y más.

## Paso 6: Etiquetar una imagen
```bash
docker tag alpine mi-alpine:v1.0
```
Crea un nuevo tag (alias) para una imagen existente. Útil para versionado o antes de subir a un registro.

## Paso 7: Verificar la nueva etiqueta
```bash
docker images | grep alpine
```
Verás dos entradas: la original "alpine" y tu nueva etiqueta "mi-alpine:v1.0". Comparten el mismo IMAGE ID.

## Paso 8: Crear una imagen desde contenedor
```bash
docker run -it --name mi-contenedor alpine sh -c "echo 'Hola Docker' > /mensaje.txt && exit"
```
Crea un contenedor, añade un archivo dentro y sale. Esto modifica el contenedor respecto a la imagen original.

## Paso 9: Crear imagen desde contenedor modificado
```bash
docker commit mi-contenedor alpine-personalizado:v1
```
Guarda los cambios del contenedor como una nueva imagen. No es la mejor práctica (usa Dockerfile), pero es útil para experimentos.

## Paso 10: Verificar la nueva imagen
```bash
docker images alpine-personalizado
```
Verás tu nueva imagen personalizada. Será más grande que alpine original porque incluye los cambios.

## Paso 11: Probar la imagen personalizada
```bash
docker run --rm alpine-personalizado:v1 cat /mensaje.txt
```
Ejecuta la imagen personalizada y muestra el contenido del archivo que creamos. Deberías ver "Hola Docker".

## Paso 12: Exportar imagen a archivo tar
```bash
docker save alpine -o alpine-backup.tar
```
Exporta la imagen alpine a un archivo tar. Útil para backup o transferir imágenes sin usar un registro.

## Paso 13: Verificar archivo exportado
```bash
ls -lh alpine-backup.tar
```
Muestra el tamaño del archivo exportado. Contiene todas las capas de la imagen en formato tar.

## Paso 14: Eliminar imagen original
```bash
docker rmi alpine
```
Elimina la imagen alpine local. Si hay contenedores usando esa imagen, deberás detenerlos primero.

## Paso 15: Verificar que la imagen fue eliminada
```bash
docker images | grep -E "^alpine\s"
```
No deberías ver la imagen alpine (pero sí mi-alpine:v1.0 que creamos antes).

## Paso 16: Importar imagen desde archivo tar
```bash
docker load -i alpine-backup.tar
```
Restaura la imagen alpine desde el archivo tar. Ahora la imagen está disponible nuevamente.

## Paso 17: Ver espacio usado por imágenes
```bash
docker system df
```
Muestra cuánto espacio en disco usan las imágenes, contenedores y volúmenes. Muy útil para gestión de recursos.

## Paso 18: Filtrar imágenes por tamaño
```bash
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | sort -k3 -h
```
Lista imágenes ordenadas por tamaño. El formato personalizado muestra solo las columnas que necesitas.

## Paso 19: Eliminar imágenes sin usar (dangling)
```bash
docker image prune -f
```
Elimina imágenes "huérfanas" (sin tag y sin contenedores asociados). Libera espacio sin afectar imágenes en uso.

## Paso 20: Limpiar archivo temporal
```bash
rm alpine-backup.tar
```
Elimina el archivo tar que creamos para el ejercicio. Mantén tu sistema limpio después de practicar.
