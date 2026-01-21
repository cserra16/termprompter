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

# Curso MariaDB - Modulo 5: Indices y Rendimiento

## Paso 1: Crear base de datos para este modulo
```sql
CREATE DATABASE IF NOT EXISTS rendimiento;
```
Creamos una base de datos para practicar con indices.

## Paso 2: Seleccionar la base de datos
```sql
USE rendimiento;
```
Seleccionamos la base de datos rendimiento.

## Paso 3: Crear tabla de ventas
```sql
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(100),
    producto VARCHAR(100),
    cantidad INT,
    precio DECIMAL(10,2),
    fecha DATE,
    region VARCHAR(50)
);
```
Creamos una tabla para demostrar el impacto de los indices.

## Paso 4: Insertar datos de prueba
```sql
INSERT INTO ventas (cliente, producto, cantidad, precio, fecha, region) VALUES
('Cliente A', 'Laptop', 2, 999.99, '2024-01-15', 'Norte'),
('Cliente B', 'Mouse', 5, 29.99, '2024-01-16', 'Sur'),
('Cliente A', 'Teclado', 3, 79.99, '2024-01-17', 'Norte'),
('Cliente C', 'Monitor', 1, 299.99, '2024-01-18', 'Este'),
('Cliente B', 'Laptop', 1, 999.99, '2024-01-19', 'Sur'),
('Cliente D', 'Mouse', 10, 29.99, '2024-01-20', 'Oeste'),
('Cliente A', 'Monitor', 2, 299.99, '2024-01-21', 'Norte'),
('Cliente E', 'Teclado', 4, 79.99, '2024-01-22', 'Este');
```
Insertamos datos de ejemplo para trabajar con indices.

## Paso 5: Ver los indices existentes
```sql
SHOW INDEX FROM ventas;
```
Muestra todos los indices de la tabla. Por defecto, solo existe el indice PRIMARY.

## Paso 6: Analizar consulta sin indice con EXPLAIN
```sql
EXPLAIN SELECT * FROM ventas WHERE cliente = 'Cliente A';
```
EXPLAIN muestra el plan de ejecucion. Sin indice, type: ALL indica escaneo completo.

## Paso 7: Crear un indice simple
```sql
CREATE INDEX idx_cliente ON ventas(cliente);
```
Creamos un indice en la columna cliente para acelerar busquedas.

## Paso 8: Verificar el indice creado
```sql
SHOW INDEX FROM ventas;
```
Ahora veremos dos indices: PRIMARY y idx_cliente.

## Paso 9: Analizar consulta con indice
```sql
EXPLAIN SELECT * FROM ventas WHERE cliente = 'Cliente A';
```
Ahora EXPLAIN muestra que usa el indice idx_cliente con type: ref, mas eficiente.

## Paso 10: Agregar columna para indice unico
```sql
ALTER TABLE ventas ADD COLUMN codigo_venta VARCHAR(20);
```
Agregamos una columna para demostrar indices unicos.

## Paso 11: Generar valores unicos para la columna
```sql
UPDATE ventas SET codigo_venta = CONCAT('VTA-', LPAD(id, 5, '0'));
```
Generamos codigos unicos basados en el id.

## Paso 12: Crear un indice unico
```sql
CREATE UNIQUE INDEX idx_codigo ON ventas(codigo_venta);
```
Un indice UNIQUE garantiza que no haya valores duplicados.

## Paso 13: Crear un indice compuesto
```sql
CREATE INDEX idx_fecha_region ON ventas(fecha, region);
```
Los indices compuestos incluyen multiples columnas.

## Paso 14: Probar el indice compuesto
```sql
EXPLAIN SELECT * FROM ventas WHERE fecha = '2024-01-15' AND region = 'Norte';
```
El indice compuesto se usa cuando filtramos por columnas en el orden definido.

## Paso 15: Orden de columnas en indices compuestos
```sql
EXPLAIN SELECT * FROM ventas WHERE region = 'Norte';
```
Si solo filtramos por region (segunda columna), el indice compuesto no se usa eficientemente.

## Paso 16: Crear indice para la segunda columna
```sql
CREATE INDEX idx_region ON ventas(region);
```
Para filtrar solo por region, necesitamos un indice separado.

## Paso 17: Ver estadisticas de la tabla
```sql
SHOW TABLE STATUS LIKE 'ventas';
```
Muestra informacion sobre la tabla incluyendo numero de filas y tamano.

## Paso 18: Eliminar un indice
```sql
DROP INDEX idx_region ON ventas;
```
Podemos eliminar indices que ya no necesitamos.
