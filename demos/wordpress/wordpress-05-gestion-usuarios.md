---
docker:
  image: wordpress:cli
  name: demo-wordpress-users
  workdir: /home/www-data
  shell:
    - /bin/sh
---

# Curso Wordpress - Módulo 5: Gestión de Usuarios

## Paso 1: Listar usuarios existentes
```bash
wp user list
```
Muestra una tabla con todos los usuarios registrados en el sistema, incluyendo su ID, nombre de usuario, correo electrónico y rol.

## Paso 2: Crear un nuevo usuario
```bash
wp user create pepe pepe@example.com --role=editor --user_pass=123456
```
Creamos un usuario nuevo con el comando `wp user create`. Definimos su login (`pepe`), email, rol (`editor`) y una contraseña inicial.

## Paso 3: Actualizar perfil de usuario
```bash
wp user update pepe --display_name="Pepe Editor" --first_name="Pepe" --last_name="Garcia"
```
Modificamos la información de un usuario existente. Aquí actualizamos su nombre, apellidos y el nombre público que se muestra en el sitio.

## Paso 4: Cambiar la contraseña (Reset)
```bash
wp user update pepe --user_pass=nueva_contraseña_segura
```
Muy útil para emergencias o restablecimiento de accesos. Cambiamos la contraseña del usuario `pepe`.

## Paso 5: Cambiar el rol de un usuario
```bash
wp user set-role pepe administrator
```
Ascendemos al usuario `pepe` al rol de Administrador, dándole control total sobre el sitio.
