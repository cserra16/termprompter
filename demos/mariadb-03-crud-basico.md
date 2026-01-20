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

# Curso MariaDB - Modulo 3: Operaciones CRUD Basicas

## Paso 1: Crear la base de datos de trabajo
```sql
CREATE DATABASE IF NOT EXISTS tienda;
```
Creamos una base de datos para nuestros ejercicios de CRUD (Create, Read, Update, Delete).

## Paso 2: Seleccionar la base de datos
```sql
USE tienda;
```
Seleccionamos la base de datos tienda para trabajar con ella.

## Paso 3: Crear la tabla de productos
```sql
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    categoria VARCHAR(50)
);
```
Creamos una tabla con diferentes tipos de columnas para practicar.

## Paso 4: Insertar un registro simple
```sql
INSERT INTO productos (nombre, precio, stock, categoria)
VALUES ('Laptop HP', 899.99, 15, 'Electronica');
```
INSERT INTO agrega un nuevo registro. Especificamos las columnas y sus valores.

## Paso 5: Insertar multiples registros
```sql
INSERT INTO productos (nombre, precio, stock, categoria) VALUES
('Mouse Logitech', 29.99, 50, 'Electronica'),
('Teclado Mecanico', 79.99, 30, 'Electronica'),
('Monitor 24 pulgadas', 199.99, 20, 'Electronica'),
('Silla Ergonomica', 299.99, 10, 'Muebles');
```
Podemos insertar varios registros en una sola sentencia separando con comas.

## Paso 6: Seleccionar todos los registros
```sql
SELECT * FROM productos;
```
El asterisco (*) selecciona todas las columnas de la tabla.

## Paso 7: Seleccionar columnas especificas
```sql
SELECT nombre, precio FROM productos;
```
Es mas eficiente seleccionar solo las columnas que necesitamos.

## Paso 8: Filtrar con WHERE usando igualdad
```sql
SELECT * FROM productos WHERE categoria = 'Electronica';
```
La clausula WHERE filtra los resultados. Seleccionamos solo productos de categoria Electronica.

## Paso 9: Filtrar con operadores de comparacion
```sql
SELECT nombre, precio FROM productos WHERE precio > 100;
```
Usamos operadores como > (mayor), < (menor), >= y <= para filtrar datos numericos.

## Paso 10: Filtrar con BETWEEN
```sql
SELECT nombre, precio FROM productos WHERE precio BETWEEN 50 AND 200;
```
BETWEEN selecciona valores dentro de un rango, incluyendo los limites.

## Paso 11: Filtrar con LIKE para busqueda de texto
```sql
SELECT * FROM productos WHERE nombre LIKE '%Logitech%';
```
LIKE permite buscar patrones. El simbolo % representa cualquier cantidad de caracteres.

## Paso 12: Filtrar con IN para multiples valores
```sql
SELECT * FROM productos WHERE categoria IN ('Electronica', 'Muebles');
```
IN permite especificar multiples valores posibles para una columna.

## Paso 13: Combinar condiciones con AND
```sql
SELECT * FROM productos WHERE categoria = 'Electronica' AND precio < 100;
```
AND requiere que ambas condiciones sean verdaderas. OR requiere que al menos una lo sea.

## Paso 14: Ordenar resultados con ORDER BY
```sql
SELECT * FROM productos ORDER BY precio ASC;
```
ORDER BY ordena los resultados. ASC es ascendente, DESC es descendente.

## Paso 15: Limitar resultados con LIMIT
```sql
SELECT * FROM productos ORDER BY precio DESC LIMIT 3;
```
LIMIT restringe el numero de filas devueltas. Obtenemos los 3 productos mas caros.

## Paso 16: Usar LIMIT con OFFSET para paginacion
```sql
SELECT * FROM productos ORDER BY id LIMIT 2 OFFSET 2;
```
OFFSET salta las primeras N filas. Util para implementar paginacion.

## Paso 17: Actualizar un registro especifico
```sql
UPDATE productos SET precio = 849.99 WHERE nombre = 'Laptop HP';
```
UPDATE modifica datos existentes. SIEMPRE usa WHERE para especificar que registros actualizar.

## Paso 18: Actualizar multiples columnas
```sql
UPDATE productos SET precio = 89.99, stock = 25 WHERE nombre = 'Teclado Mecanico';
```
Podemos actualizar varias columnas en una sola sentencia separandolas con comas.

## Paso 19: Eliminar un registro especifico
```sql
DELETE FROM productos WHERE nombre = 'Silla Ergonomica';
```
DELETE elimina registros. SIEMPRE usa WHERE para especificar que eliminar.

## Paso 20: Verificar los cambios realizados
```sql
SELECT * FROM productos;
```
Despues de modificaciones, es buena practica verificar los cambios.
