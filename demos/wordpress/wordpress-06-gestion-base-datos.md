---
docker:
  image: wordpress:cli
  name: demo-wordpress-db
  workdir: /home/www-data
  shell:
    - /bin/sh
---

# Curso Wordpress - Módulo 6: Gestión de Base de Datos

## Paso 1: Listar las tablas de la base de datos
```bash
wp db tables
```
Muestra una lista simple de todas las tablas existentes en la base de datos de Wordpress. Sirve para verificar prefijos y estructura.

## Paso 2: Exportar la base de datos (Backup)
```bash
wp db export backup.sql --add-drop-table
```
Genera un volcado SQL completo de la base de datos. La opción `--add-drop-table` asegura que, al importar, se eliminen las tablas existentes previamente para evitar conflictos.

## Paso 3: Verificar el archivo de backup
```bash
ls -lh backup.sql
```
Comprobamos que el archivo `backup.sql` se ha creado y vemos su tamaño.

## Paso 4: Importar base de datos
```bash
wp db import backup.sql
```
Restaura la base de datos desde el archivo SQL. Es el proceso inverso a la exportación, muy útil para recuperar el sitio en caso de desastre.

## Paso 5: Optimizar la base de datos
```bash
wp db optimize
```
Ejecuta utilidades de optimización del motor de base de datos (como `OPTIMIZE TABLE` en MySQL) para liberar espacio y mejorar el rendimiento.
