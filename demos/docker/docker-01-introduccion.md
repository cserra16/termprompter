# Curso Docker - Módulo 1: Introducción a Docker

## Paso 1: Verificar instalación de Docker
```bash
docker --version
```
Comprueba que Docker está instalado correctamente. Deberías ver la versión de Docker instalada (por ejemplo, Docker version 24.x.x).

## Paso 2: Verificar estado del servicio Docker
```bash
docker info
```
Muestra información detallada sobre la instalación de Docker, incluyendo el número de contenedores, imágenes, versión del servidor, y configuración del sistema.

## Paso 3: Ejecutar tu primer contenedor
```bash
docker run hello-world
```
Este comando descarga una imagen de prueba y ejecuta un contenedor que imprime un mensaje de bienvenida. Es la forma tradicional de verificar que Docker funciona correctamente.

## Paso 4: Ver contenedores en ejecución
```bash
docker ps
```
Lista todos los contenedores que están actualmente en ejecución. Como hello-world ya finalizó, no verás ninguno todavía.

## Paso 5: Ver todos los contenedores (incluso detenidos)
```bash
docker ps -a
```
Muestra todos los contenedores, incluidos los que han terminado su ejecución. Aquí verás el contenedor hello-world.

## Paso 6: Listar imágenes descargadas
```bash
docker images
```
Muestra todas las imágenes Docker que tienes descargadas localmente. Deberías ver la imagen hello-world.

## Paso 7: Ejecutar contenedor interactivo de Ubuntu
```bash
docker run -it ubuntu bash
```
Descarga la imagen de Ubuntu (si no la tienes) y ejecuta un contenedor interactivo con una terminal bash. -it significa "interactive terminal".

## Paso 8: Salir del contenedor Ubuntu
```bash
exit
```
Sale del contenedor Ubuntu y lo detiene. El contenedor seguirá existiendo pero estará detenido.

## Paso 9: Ejecutar contenedor en segundo plano (detached)
```bash
docker run -d nginx
```
Ejecuta un servidor web nginx en segundo plano. El flag -d significa "detached" (desacoplado).

## Paso 10: Ver el contenedor nginx en ejecución
```bash
docker ps
```
Ahora verás el contenedor nginx corriendo. Nota el CONTAINER ID y el nombre asignado automáticamente.

## Paso 11: Ver logs del contenedor
```bash
docker logs $(docker ps -q -n 1)
```
Muestra los logs del último contenedor creado. Para nginx, verás los logs de inicialización del servidor web.

## Paso 12: Inspeccionar contenedor en detalle
```bash
docker inspect $(docker ps -q -n 1)
```
Muestra información detallada en formato JSON sobre el contenedor, incluyendo configuración de red, volúmenes, variables de entorno, etc.

## Paso 13: Ver estadísticas en tiempo real
```bash
docker stats --no-stream
```
Muestra estadísticas de uso de recursos (CPU, memoria, red, I/O) de todos los contenedores en ejecución.

## Paso 14: Detener el contenedor nginx
```bash
docker stop $(docker ps -q -n 1)
```
Detiene el contenedor nginx de forma elegante. Docker enviará una señal SIGTERM y esperará antes de forzar la detención.

## Paso 15: Verificar que el contenedor está detenido
```bash
docker ps -a
```
El contenedor nginx ahora aparecerá con estado "Exited". Sigue existiendo pero no está en ejecución.

## Paso 16: Iniciar el contenedor detenido
```bash
docker start $(docker ps -aq -n 1)
```
Reinicia el contenedor que acabamos de detener. Usa el mismo contenedor en lugar de crear uno nuevo.

## Paso 17: Eliminar un contenedor detenido
```bash
docker rm $(docker ps -aq -f status=exited -n 1)
```
Elimina un contenedor que está detenido. No puedes eliminar contenedores en ejecución sin forzarlo.

## Paso 18: Ejecutar contenedor con eliminación automática
```bash
docker run --rm -d nginx
```
El flag --rm hace que el contenedor se elimine automáticamente cuando se detenga. Útil para tareas temporales.

## Paso 19: Buscar imágenes en Docker Hub
```bash
docker search python
```
Busca imágenes disponibles en Docker Hub relacionadas con Python. Muestra nombre, descripción, estrellas y si es oficial.

## Paso 20: Limpiar contenedores detenidos
```bash
docker container prune -f
```
Elimina todos los contenedores detenidos de una vez. El flag -f evita la confirmación. ¡Útil para mantener limpio tu sistema!
