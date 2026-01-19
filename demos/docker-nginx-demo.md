---
docker:
  image: nginx:alpine
  name: demo-nginx-server
  ports:
    - "8080:80"
  workdir: /usr/share/nginx/html
  shell:
    - /bin/sh
---

# Demo: Servidor Web con Nginx (en Docker)

## Paso 1: Verificar que estamos en Nginx
```bash
nginx -v
```
Verificamos la versión de Nginx instalada en el contenedor.

## Paso 2: Ver la configuración de Nginx
```bash
cat /etc/nginx/nginx.conf
```
Mostramos el archivo de configuración principal de Nginx para entender su estructura.

## Paso 3: Ver el directorio web
```bash
ls -la /usr/share/nginx/html
```
Este es el directorio raíz donde Nginx sirve los archivos estáticos por defecto.

## Paso 4: Ver la página por defecto
```bash
cat /usr/share/nginx/html/index.html
```
Nginx viene con una página HTML de bienvenida. Veamos su contenido.

## Paso 5: Crear nuestra propia página
```bash
echo '<!DOCTYPE html><html><head><title>Mi Página</title></head><body><h1>¡Hola desde TermPrompter!</h1><p>Esta página se sirve desde un contenedor Docker con Nginx.</p></body></html>' > index.html
```
Creamos una página HTML personalizada que reemplaza la página por defecto.

## Paso 6: Verificar que se creó el archivo
```bash
cat index.html
```
Comprobamos que nuestra página se creó correctamente.

## Paso 7: Ver los logs de Nginx
```bash
cat /var/log/nginx/access.log
```
Los logs de acceso muestran todas las peticiones HTTP recibidas.

## Paso 8: Información del sistema Alpine
```bash
cat /etc/alpine-release
```
Nginx Alpine usa la distribución Alpine Linux, conocida por ser muy ligera.
