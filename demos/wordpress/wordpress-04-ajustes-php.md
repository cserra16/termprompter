---
docker:
  image: wordpress:cli
  name: demo-wordpress-php
  workdir: /home/www-data
  shell:
    - /bin/sh
---

# Curso Wordpress - Módulo 4: Ajustes de PHP y Rendimiento

## Paso 1: Preparar el entorno y verificar límites actuales
```bash
wp core download --locale=es_ES --skip-content --force && wp eval 'echo "Memoria PHP: " . ini_get("memory_limit") . "\nLímite Subida: " . ini_get("upload_max_filesize");'
```
Descargamos Wordpress y usamos `wp eval` para ejecutar código PHP arbitrario y consultar los límites actuales de memoria y subida de archivos que tiene el servidor.

## Paso 2: Aumentar el límite de memoria de Wordpress
```bash
wp config create --dbname=test --dbuser=test --dbpass=test --skip-check && wp config set WP_MEMORY_LIMIT 256M
```
Creamos el archivo de configuración (necesario para `wp config set`) y definimos `WP_MEMORY_LIMIT` a 256M. Esto le dice a Wordpress que puede usar hasta esa cantidad de RAM, útil para sitios pesados.

## Paso 3: Aumentar memoria para el panel de administración
```bash
wp config set WP_MAX_MEMORY_LIMIT 512M
```
Definimos `WP_MAX_MEMORY_LIMIT`, que controla la memoria disponible específicamente para tareas en el panel de administración (/wp-admin), que suelen ser más exigentes.

## Paso 4: Configurar límites de subida (método .htaccess)
```bash
echo "php_value upload_max_filesize 64M" > .htaccess && echo "php_value post_max_size 64M" >> .htaccess
```
Los límites de subida de archivos suelen depender del servidor web (Apache/Nginx). En servidores Apache, podemos intentar anularlos creando un archivo `.htaccess` con directivas `php_value`.

## Paso 5: Verificar configuración de memoria
```bash
wp config get WP_MEMORY_LIMIT && wp config get WP_MAX_MEMORY_LIMIT
```
Consultamos el archivo `wp-config.php` para confirmar que nuestras constantes de memoria se han guardado correctamente.
