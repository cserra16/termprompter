---
docker:
  image: mariadb:12.1
  name: demo-mariadb
  env:
    MARIADB_ROOT_PASSWORD: demo123
    MARIADB_DATABASE: demodb
  ports:
    - "3307:3306"
  workdir: /
  shell:
    - bash
    - -c
    - "echo 'Esperando a que MariaDB inicie...'; until mariadb -u root -pdemo123 -e 'SELECT 1' >/dev/null 2>&1; do sleep 1; done; mariadb -u root -pdemo123"
---

# Curso MariaDB - Modulo 1: Introduccion a MariaDB

## Paso 1: Verificar la version del servidor
```sql
SELECT VERSION();
```
Obtenemos la version del servidor MariaDB. MariaDB es un fork de MySQL creado por los desarrolladores originales.

## Paso 2: Ver el usuario actual
```sql
SELECT USER();
```
Muestra el usuario conectado y el host desde el cual se conecto. El formato es usuario@host.

## Paso 3: Ver la base de datos actual
```sql
SELECT DATABASE();
```
Muestra la base de datos seleccionada actualmente. Al inicio puede ser NULL o demodb.

## Paso 4: Ver las bases de datos existentes
```sql
SHOW DATABASES;
```
Muestra todas las bases de datos disponibles en el servidor. Por defecto incluye bases del sistema.

## Paso 5: Seleccionar la base de datos de prueba
```sql
USE demodb;
```
El comando USE selecciona una base de datos para trabajar con ella.

## Paso 6: Confirmar la base de datos seleccionada
```sql
SELECT DATABASE();
```
Confirmamos que estamos trabajando en la base de datos demodb.

## Paso 7: Ver el estado del servidor
```sql
STATUS;
```
STATUS muestra informacion detallada sobre la conexion, version del servidor y configuracion.

## Paso 8: Explorar la base de datos mysql del sistema
```sql
USE mysql;
```
La base de datos mysql contiene tablas del sistema con usuarios, permisos y configuracion.

## Paso 9: Ver las tablas del sistema
```sql
SHOW TABLES;
```
Muestra todas las tablas en la base de datos mysql.

## Paso 10: Ver los usuarios del sistema
```sql
SELECT User, Host FROM user;
```
Consulta los usuarios configurados en el servidor y desde que hosts pueden conectarse.

## Paso 11: Ver variables de version
```sql
SHOW VARIABLES LIKE 'version%';
```
SHOW VARIABLES muestra variables de configuracion. Filtramos las relacionadas con version.

## Paso 12: Ver el conjunto de caracteres
```sql
SHOW VARIABLES LIKE 'character_set%';
```
Muestra la configuracion de conjuntos de caracteres del servidor.

## Paso 13: Ver el motor de almacenamiento por defecto
```sql
SHOW VARIABLES LIKE 'default_storage_engine';
```
InnoDB es el motor por defecto, soporta transacciones y claves foraneas.

## Paso 14: Ver informacion del servidor
```sql
SHOW STATUS LIKE 'Uptime';
```
Muestra cuanto tiempo lleva el servidor ejecutandose en segundos.

## Paso 15: Ver la ayuda de comandos SQL
```sql
HELP SELECT;
```
MariaDB incluye documentacion integrada accesible con HELP.
