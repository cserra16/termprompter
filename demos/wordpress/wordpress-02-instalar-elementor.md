---
docker:
  image: wordpress:cli
  name: demo-wordpress-elementor
  workdir: /home/www-data
  shell:
    - /bin/sh
---

# Curso Wordpress - Módulo 2: Instalación de Plugins (Elementor)

## Paso 1: Preparar el entorno (Descargar Wordpress)
```bash
wp core download --locale=es_ES --skip-content --force
```
Para instalar plugins, necesitamos una instalación base de Wordpress. Descargamos los archivos del núcleo rápidamente. Usamos `--force` por si ya existen archivos.

## Paso 2: Buscar el plugin Elementor
```bash
wp plugin search elementor
```
Buscamos "elementor" en el directorio de plugins de Wordpress.org para encontrar el 'slug' (nombre clave) correcto del plugin.

## Paso 3: Instalar Elementor
```bash
wp plugin install elementor --skip-activate
```
Instalamos el plugin usando su slug. Usamos `--skip-activate` porque activar un plugin requiere conexión a la base de datos, lo cual no tenemos configurado en este entorno ligero.

## Paso 4: Verificar la carpeta del plugin
```bash
ls -F wp-content/plugins/elementor/
```
Comprobamos que los archivos del plugin se han descargado correctamente en el directorio `wp-content/plugins`.

## Paso 5: Obtener detalles del plugin instalado
```bash
wp plugin get elementor --fields=name,version,status
```
Consultamos a WP-CLI los detalles específicos del plugin que acabamos de instalar para confirmar su versión y estado.
