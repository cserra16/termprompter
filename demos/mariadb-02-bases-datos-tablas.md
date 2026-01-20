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

# Curso MariaDB - Modulo 2: Bases de Datos y Tablas

## Paso 1: Ver las bases de datos existentes
```sql
SHOW DATABASES;
```
Muestra todas las bases de datos en el servidor. demodb ya existe porque la creamos en las variables de entorno.

## Paso 2: Crear una nueva base de datos
```sql
CREATE DATABASE tienda;
```
CREATE DATABASE crea una nueva base de datos vacia. El nombre debe ser unico en el servidor.

## Paso 3: Crear base de datos con conjunto de caracteres
```sql
CREATE DATABASE empresa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Especificamos el conjunto de caracteres y la colacion. utf8mb4 soporta todos los caracteres Unicode incluyendo emojis.

## Paso 4: Ver las bases de datos creadas
```sql
SHOW DATABASES;
```
Verificamos que nuestras bases de datos se han creado correctamente.

## Paso 5: Seleccionar la base de datos tienda
```sql
USE tienda;
```
Seleccionamos la base de datos tienda para comenzar a crear tablas.

## Paso 6: Crear una tabla simple
```sql
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);
```
Creamos una tabla con id autoincremental como clave primaria y nombre obligatorio.

## Paso 7: Ver las tablas existentes
```sql
SHOW TABLES;
```
Lista todas las tablas en la base de datos actual.

## Paso 8: Crear tabla con multiples tipos de datos
```sql
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
Esta tabla demuestra varios tipos de datos: INT, VARCHAR, TEXT, DECIMAL, BOOLEAN y DATETIME.

## Paso 9: Ver la estructura de una tabla
```sql
DESCRIBE productos;
```
DESCRIBE muestra la estructura de una tabla incluyendo columnas, tipos de datos, claves y valores por defecto.

## Paso 10: Ver el SQL de creacion de la tabla
```sql
SHOW CREATE TABLE productos\G
```
Muestra la sentencia SQL completa usada para crear la tabla con todas sus opciones.

## Paso 11: Crear tabla de clientes con restriccion UNIQUE
```sql
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT
);
```
La restriccion UNIQUE garantiza que el email no pueda repetirse en la tabla.

## Paso 12: Crear tabla con relaciones (FOREIGN KEY)
```sql
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(12,2),
    estado ENUM('pendiente', 'procesando', 'enviado', 'entregado') DEFAULT 'pendiente',
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
```
ENUM limita los valores posibles. FOREIGN KEY crea una relacion con la tabla clientes.

## Paso 13: Ver todas las tablas creadas
```sql
SHOW TABLES;
```
Verificamos que todas las tablas se han creado correctamente.

## Paso 14: Agregar una columna a una tabla existente
```sql
ALTER TABLE productos ADD COLUMN categoria_id INT;
```
ALTER TABLE ADD COLUMN agrega una nueva columna a una tabla existente.

## Paso 15: Agregar clave foranea a columna existente
```sql
ALTER TABLE productos ADD FOREIGN KEY (categoria_id) REFERENCES categorias(id);
```
Agregamos una restriccion de clave foranea a la columna categoria_id.

## Paso 16: Modificar el tipo de una columna
```sql
ALTER TABLE clientes MODIFY telefono VARCHAR(30);
```
MODIFY cambia el tipo de datos o tamano de una columna.

## Paso 17: Renombrar una columna
```sql
ALTER TABLE clientes CHANGE direccion direccion_completa TEXT;
```
CHANGE permite renombrar una columna y cambiar su tipo al mismo tiempo.

## Paso 18: Eliminar una columna
```sql
ALTER TABLE clientes DROP COLUMN direccion_completa;
```
DROP COLUMN elimina una columna de la tabla. Esta operacion es irreversible.

## Paso 19: Renombrar una tabla
```sql
RENAME TABLE categorias TO categorias_producto;
```
Podemos cambiar el nombre de una tabla usando RENAME TABLE.

## Paso 20: Eliminar una tabla
```sql
DROP TABLE IF EXISTS pedidos;
```
DROP TABLE elimina completamente una tabla y todos sus datos.
