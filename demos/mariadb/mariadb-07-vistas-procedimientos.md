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

# Curso MariaDB - Modulo 7: Vistas y Procedimientos Almacenados

## Paso 1: Crear base de datos para este modulo
```sql
CREATE DATABASE IF NOT EXISTS tienda_online;
```
Creamos una base de datos para practicar vistas y procedimientos.

## Paso 2: Seleccionar la base de datos
```sql
USE tienda_online;
```
Seleccionamos la base de datos tienda_online.

## Paso 3: Crear tabla de productos
```sql
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    precio DECIMAL(10,2),
    categoria VARCHAR(50),
    stock INT
);
```
Creamos la tabla de productos.

## Paso 4: Crear tabla de ventas
```sql
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    cantidad INT,
    fecha DATE,
    total DECIMAL(10,2),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);
```
Creamos la tabla de ventas relacionada con productos.

## Paso 5: Insertar datos de productos
```sql
INSERT INTO productos (nombre, precio, categoria, stock) VALUES
('Laptop Pro', 1299.99, 'Electronica', 25),
('Mouse Wireless', 49.99, 'Accesorios', 100),
('Teclado RGB', 89.99, 'Accesorios', 75),
('Monitor 27', 399.99, 'Electronica', 30),
('Webcam HD', 79.99, 'Accesorios', 50);
```
Insertamos productos de ejemplo.

## Paso 6: Insertar datos de ventas
```sql
INSERT INTO ventas (producto_id, cantidad, fecha, total) VALUES
(1, 2, '2024-01-15', 2599.98),
(2, 5, '2024-01-16', 249.95),
(3, 3, '2024-01-16', 269.97),
(4, 1, '2024-01-17', 399.99),
(1, 1, '2024-01-18', 1299.99);
```
Insertamos ventas de ejemplo.

## Paso 7: Crear una vista simple
```sql
CREATE VIEW vista_productos_activos AS
SELECT id, nombre, precio, categoria
FROM productos
WHERE stock > 0;
```
Una vista es una consulta guardada que se comporta como una tabla virtual.

## Paso 8: Consultar la vista
```sql
SELECT * FROM vista_productos_activos;
```
Podemos usar la vista como si fuera una tabla normal.

## Paso 9: Crear vista con JOIN
```sql
CREATE VIEW vista_ventas_detalle AS
SELECT
    v.id AS venta_id,
    p.nombre AS producto,
    v.cantidad,
    p.precio AS precio_unitario,
    v.total,
    v.fecha
FROM ventas v
INNER JOIN productos p ON v.producto_id = p.id;
```
Las vistas pueden encapsular JOINs complejos.

## Paso 10: Usar la vista con filtros
```sql
SELECT * FROM vista_ventas_detalle WHERE fecha = '2024-01-16';
```
Podemos filtrar los datos de una vista como cualquier otra tabla.

## Paso 11: Crear vista con agregaciones
```sql
CREATE VIEW vista_resumen_ventas AS
SELECT
    p.categoria,
    COUNT(v.id) AS total_ventas,
    SUM(v.total) AS ingresos_totales,
    ROUND(AVG(v.total), 2) AS venta_promedio
FROM ventas v
INNER JOIN productos p ON v.producto_id = p.id
GROUP BY p.categoria;
```
Las vistas pueden contener funciones de agregacion y GROUP BY.

## Paso 12: Ver las vistas existentes
```sql
SHOW FULL TABLES WHERE Table_type = 'VIEW';
```
Lista todas las vistas en la base de datos actual.

## Paso 13: Ver la definicion de una vista
```sql
SHOW CREATE VIEW vista_productos_activos\G
```
Muestra la sentencia SQL que se uso para crear la vista.

## Paso 14: Modificar una vista
```sql
ALTER VIEW vista_productos_activos AS
SELECT id, nombre, precio, categoria, stock
FROM productos
WHERE stock > 10;
```
ALTER VIEW permite modificar la definicion de una vista existente.

## Paso 15: Eliminar una vista
```sql
DROP VIEW IF EXISTS vista_resumen_ventas;
```
DROP VIEW elimina una vista. No afecta las tablas subyacentes.

## Paso 16: Crear un procedimiento simple
```sql
CREATE PROCEDURE listar_productos()
SELECT * FROM productos ORDER BY nombre;
```
Un procedimiento almacenado es un bloque de codigo SQL guardado en el servidor.

## Paso 17: Ejecutar el procedimiento
```sql
CALL listar_productos();
```
CALL ejecuta un procedimiento almacenado.

## Paso 18: Crear procedimiento con parametro
```sql
CREATE PROCEDURE buscar_por_categoria(IN cat VARCHAR(50))
SELECT * FROM productos WHERE categoria = cat;
```
Los parametros IN reciben valores de entrada.

## Paso 19: Llamar procedimiento con parametro
```sql
CALL buscar_por_categoria('Electronica');
```
Pasamos el valor del parametro al llamar al procedimiento.

## Paso 20: Ver procedimientos existentes
```sql
SHOW PROCEDURE STATUS WHERE Db = 'tienda_online';
```
Lista todos los procedimientos almacenados en la base de datos.
