---
docker:
  image: wordpress:cli
  name: demo-wordpress-config
  workdir: /home/www-data
  shell:
    - /bin/sh
---

# Curso Wordpress - Módulo 3: Configuración con WP-CLI

## Paso 1: Preparar el entorno
```bash
wp core download --locale=es_ES --skip-content --force
```
Al igual que en las demos anteriores, necesitamos descargar el núcleo de Wordpress para tener la estructura de archivos sobre la cual trabajar.

## Paso 2: Generar el archivo de configuración
```bash
wp config create --dbname=wordpress --dbuser=user --dbpass=pass --dbhost=db --skip-check
```
Generamos el archivo `wp-config.php` definiendo las credenciales de la base de datos. Usamos `--skip-check` para evitar que WP-CLI intente conectarse a la base de datos inmediatamente, ya que aquí solo estamos configurando el archivo.

## Paso 3: Verificar la creación del archivo
```bash
ls -la wp-config.php
```
Comprobamos que el archivo `wp-config.php` se ha creado correctamente en el directorio raíz.

## Paso 4: Activar el modo de depuración (Debug)
```bash
wp config set WP_DEBUG true --raw
```
Modificamos una constante existente o añadimos una nueva. `WP_DEBUG` es esencial para desarrolladores. Usamos `--raw` para indicar que el valor `true` es un booleano PHP y no un string.

## Paso 5: Verificar el valor de configuración
```bash
wp config get WP_DEBUG
```
Leemos el valor de la constante `WP_DEBUG` directamente del archivo `wp-config.php` para confirmar que el cambio se ha aplicado correctamente.
