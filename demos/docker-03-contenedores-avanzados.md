# Curso Docker - Módulo 3: Contenedores Avanzados

## Paso 1: Ejecutar contenedor con nombre personalizado
```bash
docker run -d --name mi-nginx nginx
```
Asigna un nombre específico al contenedor. Es más fácil trabajar con "mi-nginx" que con IDs o nombres aleatorios.

## Paso 2: Exponer puertos del contenedor
```bash
docker run -d --name web-nginx -p 8080:80 nginx
```
Mapea el puerto 80 del contenedor al puerto 8080 del host. Ahora puedes acceder a nginx en http://localhost:8080

## Paso 3: Verificar el puerto mapeado
```bash
curl http://localhost:8080
```
Accede al servidor nginx desde el host. Deberías ver la página de bienvenida de nginx en HTML.

## Paso 4: Ver puertos expuestos
```bash
docker port web-nginx
```
Muestra qué puertos del contenedor están mapeados y a qué puertos del host.

## Paso 5: Ejecutar comando dentro de contenedor
```bash
docker exec mi-nginx ls /usr/share/nginx/html
```
Ejecuta un comando dentro de un contenedor en ejecución sin entrar a él. Útil para inspecciones rápidas.

## Paso 6: Acceder a shell interactiva del contenedor
```bash
docker exec -it web-nginx bash
```
Abre una terminal interactiva dentro del contenedor en ejecución. Útil para debugging y exploración.

## Paso 7: Salir del contenedor sin detenerlo
```bash
exit
```
Sale de la sesión bash del contenedor. El contenedor sigue ejecutándose porque el proceso principal (nginx) continúa.

## Paso 8: Copiar archivo desde host a contenedor
```bash
echo "<h1>Hola desde Docker</h1>" > index.html && docker cp index.html web-nginx:/usr/share/nginx/html/
```
Copia un archivo del host al contenedor. Útil para actualizar configuraciones o contenido sin reconstruir la imagen.

## Paso 9: Verificar el archivo copiado
```bash
curl http://localhost:8080
```
Ahora deberías ver "Hola desde Docker" en lugar de la página predeterminada de nginx.

## Paso 10: Copiar archivo desde contenedor a host
```bash
docker cp web-nginx:/etc/nginx/nginx.conf ./nginx-config-backup.conf
```
Extrae archivos del contenedor al host. Útil para backups o análisis de configuraciones.

## Paso 11: Ver procesos dentro del contenedor
```bash
docker top web-nginx
```
Muestra los procesos en ejecución dentro del contenedor, similar a "top" en Linux.

## Paso 12: Limitar memoria del contenedor
```bash
docker run -d --name nginx-limitado -m 256m nginx
```
Limita el uso de memoria del contenedor a 256MB. Si excede este límite, el contenedor puede ser detenido.

## Paso 13: Limitar CPU del contenedor
```bash
docker run -d --name nginx-cpu --cpus="0.5" nginx
```
Limita el contenedor a usar máximo 0.5 CPUs (50% de un núcleo). Útil para evitar que un contenedor monopolice recursos.

## Paso 14: Reiniciar contenedor automáticamente
```bash
docker run -d --name nginx-persistente --restart always nginx
```
El flag --restart always hace que el contenedor se reinicie automáticamente si falla o si Docker daemon se reinicia.

## Paso 15: Ver logs en tiempo real
```bash
docker logs -f web-nginx
```
Sigue los logs del contenedor en tiempo real. Presiona Ctrl+C para salir. El flag -f es como "tail -f".

## Paso 16: Limitar salida de logs
```bash
docker logs --tail 10 web-nginx
```
Muestra solo las últimas 10 líneas de logs. Útil cuando hay muchos logs históricos.

## Paso 17: Pausar un contenedor
```bash
docker pause nginx-cpu
```
Pausa todos los procesos dentro del contenedor. El contenedor sigue existiendo pero está "congelado".

## Paso 18: Reanudar contenedor pausado
```bash
docker unpause nginx-cpu
```
Reanuda los procesos del contenedor pausado. Continúa desde donde se quedó.

## Paso 19: Renombrar contenedor
```bash
docker rename mi-nginx nginx-renombrado
```
Cambia el nombre de un contenedor. Útil para mejorar la organización o corregir nombres.

## Paso 20: Detener y limpiar todos los contenedores
```bash
docker stop $(docker ps -aq) 2>/dev/null && docker rm $(docker ps -aq) 2>/dev/null && rm -f index.html nginx-config-backup.conf
```
Detiene todos los contenedores, los elimina y limpia archivos temporales. ¡Perfecto para empezar de cero!
