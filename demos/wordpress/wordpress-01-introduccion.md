---
docker:
  image: wordpress:cli
  name: demo-wordpress
  workdir: /home/www-data
  shell:
    - /bin/sh
---

# Curso Wordpress - Módulo 1: Introducción a WP-CLI

## Paso 1: Verificar la instalación de WP-CLI
```bash
wp --info
```
Comprobamos que la herramienta de línea de comandos de Wordpress (WP-CLI) está instalada correctamente y vemos información sobre el entorno.

## Paso 2: Verificar la versión de PHP
```bash
php -v
```
Wordpress funciona sobre PHP. Verificamos qué versión de PHP está utilizando nuestro contenedor.

## Paso 3: Comprobar actualizaciones del núcleo
```bash
wp core check-update
```
Consultamos si hay versiones nuevas de Wordpress disponibles para descargar. Esto requiere conexión a internet.

## Paso 4: Descargar Wordpress en Español
```bash
wp core download --locale=es_ES --skip-content
```
Descargamos los archivos del núcleo de Wordpress en español. Usamos `--skip-content` para no descargar temas y plugins por defecto, haciendo la descarga más ligera.

## Paso 5: Listar los archivos descargados
```bash
ls -la
```
Vemos los archivos que se han descargado. Deberíamos ver la estructura típica de Wordpress: `wp-admin`, `wp-includes`, `index.php`, etc.

## Paso 6: Verificar la versión manualmente
```bash
cat wp-includes/version.php | grep wp_version
```
Leemos directamente del archivo de versión para confirmar qué versión de Wordpress hemos descargado.
