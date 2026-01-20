---
docker:
  image: mariadb:latest
  name: demo-mariadb
  env:
    MARIADB_ROOT_PASSWORD: demo123
    MARIADB_DATABASE: demodb
  ports:
    - "3307:3306"
  workdir: /
  shell:
    - mariadb
    - -u
    - root
    - -pdemo123
---

# Curso MariaDB - Modulo 6: Usuarios y Permisos

## Paso 1: Ver los usuarios existentes
```sql
SELECT User, Host FROM mysql.user;
```
La tabla mysql.user contiene todos los usuarios. Host indica desde donde puede conectarse.

## Paso 2: Crear un usuario basico
```sql
CREATE USER 'desarrollador'@'localhost' IDENTIFIED BY 'dev123';
```
Creamos un usuario que solo puede conectarse desde localhost.

## Paso 3: Crear usuario para cualquier host
```sql
CREATE USER 'app_user'@'%' IDENTIFIED BY 'app456';
```
El simbolo % indica que puede conectarse desde cualquier direccion IP.

## Paso 4: Verificar los usuarios creados
```sql
SELECT User, Host FROM mysql.user WHERE User IN ('desarrollador', 'app_user');
```
Confirmamos que nuestros usuarios se han creado correctamente.

## Paso 5: Crear base de datos para pruebas
```sql
CREATE DATABASE IF NOT EXISTS proyecto;
```
Creamos una base de datos para asignar permisos.

## Paso 6: Crear tabla de prueba
```sql
USE proyecto;
CREATE TABLE IF NOT EXISTS datos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    info VARCHAR(100)
);
INSERT INTO datos (info) VALUES ('Dato de prueba 1'), ('Dato de prueba 2');
```
Creamos una tabla con datos para probar los permisos.

## Paso 7: Otorgar permiso SELECT en una tabla
```sql
GRANT SELECT ON proyecto.datos TO 'desarrollador'@'localhost';
```
GRANT asigna privilegios. Aqui damos permiso de solo lectura en la tabla datos.

## Paso 8: Otorgar multiples permisos
```sql
GRANT SELECT, INSERT, UPDATE ON proyecto.* TO 'app_user'@'%';
```
Podemos asignar varios permisos. El asterisco aplica a todas las tablas.

## Paso 9: Ver los permisos de un usuario
```sql
SHOW GRANTS FOR 'desarrollador'@'localhost';
```
SHOW GRANTS muestra todos los privilegios asignados a un usuario.

## Paso 10: Ver permisos de app_user
```sql
SHOW GRANTS FOR 'app_user'@'%';
```
Verificamos los permisos que tiene app_user.

## Paso 11: Crear usuario administrador
```sql
CREATE USER 'admin_proyecto'@'localhost' IDENTIFIED BY 'admin789';
```
Creamos un usuario que sera administrador de la base de datos proyecto.

## Paso 12: Otorgar todos los permisos
```sql
GRANT ALL PRIVILEGES ON proyecto.* TO 'admin_proyecto'@'localhost';
```
ALL PRIVILEGES otorga todos los permisos en el ambito especificado.

## Paso 13: Aplicar los cambios de privilegios
```sql
FLUSH PRIVILEGES;
```
FLUSH PRIVILEGES recarga las tablas de permisos.

## Paso 14: Revocar un permiso especifico
```sql
REVOKE UPDATE ON proyecto.* FROM 'app_user'@'%';
```
REVOKE elimina privilegios de un usuario. Quitamos el permiso de UPDATE.

## Paso 15: Verificar que el permiso fue revocado
```sql
SHOW GRANTS FOR 'app_user'@'%';
```
Confirmamos que app_user ya no tiene el permiso UPDATE.

## Paso 16: Cambiar contrasena de un usuario
```sql
ALTER USER 'desarrollador'@'localhost' IDENTIFIED BY 'nuevapass123';
```
ALTER USER permite modificar propiedades del usuario, incluyendo la contrasena.

## Paso 17: Crear usuario de solo lectura global
```sql
CREATE USER 'reportes'@'localhost' IDENTIFIED BY 'rep123';
GRANT SELECT ON *.* TO 'reportes'@'localhost';
```
El usuario reportes puede leer de todas las bases de datos pero no modificar.

## Paso 18: Eliminar un usuario
```sql
DROP USER 'reportes'@'localhost';
```
DROP USER elimina completamente un usuario y todos sus permisos.
