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

# Curso MariaDB - Modulo 4: Consultas Avanzadas

## Paso 1: Crear base de datos para este modulo
```sql
CREATE DATABASE IF NOT EXISTS empresa;
```
Creamos una base de datos para practicar consultas avanzadas.

## Paso 2: Seleccionar la base de datos
```sql
USE empresa;
```
Seleccionamos la base de datos empresa.

## Paso 3: Crear tabla de departamentos
```sql
CREATE TABLE IF NOT EXISTS departamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);
```
Creamos la tabla padre para la relacion.

## Paso 4: Crear tabla de empleados relacionada
```sql
CREATE TABLE IF NOT EXISTS empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    salario DECIMAL(10,2),
    departamento_id INT,
    fecha_contratacion DATE,
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);
```
Creamos empleados con clave foranea a departamentos.

## Paso 5: Insertar datos de departamentos
```sql
INSERT INTO departamentos (nombre) VALUES
('Ventas'), ('Marketing'), ('Tecnologia'), ('Recursos Humanos'), ('Finanzas');
```
Insertamos departamentos de ejemplo.

## Paso 6: Insertar datos de empleados
```sql
INSERT INTO empleados (nombre, email, salario, departamento_id, fecha_contratacion) VALUES
('Ana Garcia', 'ana@empresa.com', 45000, 1, '2020-03-15'),
('Carlos Lopez', 'carlos@empresa.com', 52000, 3, '2019-07-01'),
('Maria Rodriguez', 'maria@empresa.com', 48000, 2, '2021-01-10'),
('Pedro Sanchez', 'pedro@empresa.com', 65000, 3, '2018-05-20'),
('Laura Martinez', 'laura@empresa.com', 42000, 4, '2022-02-28'),
('Juan Perez', 'juan@empresa.com', 55000, 1, '2020-11-05'),
('Sofia Ruiz', 'sofia@empresa.com', 38000, NULL, '2023-01-15');
```
Sofia no tiene departamento asignado (NULL) - esto sera util para los JOINs.

## Paso 7: Contar registros con COUNT
```sql
SELECT COUNT(*) AS total_empleados FROM empleados;
```
COUNT(*) cuenta todas las filas. AS da un alias descriptivo al resultado.

## Paso 8: Sumar valores con SUM
```sql
SELECT SUM(salario) AS total_salarios FROM empleados;
```
SUM calcula la suma de una columna numerica.

## Paso 9: Calcular promedio con AVG
```sql
SELECT AVG(salario) AS salario_promedio FROM empleados;
```
AVG calcula el promedio de los valores de una columna.

## Paso 10: Obtener minimo y maximo
```sql
SELECT MIN(salario) AS salario_minimo, MAX(salario) AS salario_maximo FROM empleados;
```
MIN y MAX obtienen el valor mas pequeno y mas grande respectivamente.

## Paso 11: Agrupar resultados con GROUP BY
```sql
SELECT departamento_id, COUNT(*) AS num_empleados, AVG(salario) AS salario_promedio
FROM empleados
GROUP BY departamento_id;
```
GROUP BY agrupa filas con el mismo valor, permitiendo aplicar funciones de agregacion.

## Paso 12: Filtrar grupos con HAVING
```sql
SELECT departamento_id, COUNT(*) AS num_empleados
FROM empleados
GROUP BY departamento_id
HAVING COUNT(*) > 1;
```
HAVING filtra grupos despues de la agregacion. WHERE filtra antes, HAVING despues.

## Paso 13: INNER JOIN - Combinar tablas
```sql
SELECT e.nombre, e.salario, d.nombre AS departamento
FROM empleados e
INNER JOIN departamentos d ON e.departamento_id = d.id;
```
INNER JOIN devuelve solo filas donde hay coincidencia. Sofia no aparece.

## Paso 14: LEFT JOIN - Incluir todos los de la izquierda
```sql
SELECT e.nombre, e.salario, d.nombre AS departamento
FROM empleados e
LEFT JOIN departamentos d ON e.departamento_id = d.id;
```
LEFT JOIN devuelve todos los empleados. Sofia aparece con departamento NULL.

## Paso 15: RIGHT JOIN - Incluir todos los de la derecha
```sql
SELECT e.nombre, d.nombre AS departamento
FROM empleados e
RIGHT JOIN departamentos d ON e.departamento_id = d.id;
```
RIGHT JOIN devuelve todos los departamentos. Finanzas aparece sin empleados.

## Paso 16: Subconsulta en WHERE
```sql
SELECT nombre, salario
FROM empleados
WHERE salario > (SELECT AVG(salario) FROM empleados);
```
Una subconsulta es una consulta dentro de otra. Seleccionamos empleados con salario superior al promedio.

## Paso 17: Subconsulta con IN
```sql
SELECT nombre, salario
FROM empleados
WHERE departamento_id IN (SELECT id FROM departamentos WHERE nombre IN ('Ventas', 'Tecnologia'));
```
Usamos subconsultas con IN para filtrar basandonos en otra consulta.

## Paso 18: UNION para combinar resultados
```sql
SELECT nombre, 'Empleado' AS tipo FROM empleados
UNION
SELECT nombre, 'Departamento' AS tipo FROM departamentos;
```
UNION combina resultados de dos consultas eliminando duplicados.

## Paso 19: DISTINCT para valores unicos
```sql
SELECT DISTINCT departamento_id FROM empleados;
```
DISTINCT elimina filas duplicadas del resultado.

## Paso 20: Consulta compleja combinando todo
```sql
SELECT
    d.nombre AS departamento,
    COUNT(e.id) AS total_empleados,
    ROUND(AVG(e.salario), 2) AS salario_promedio
FROM departamentos d
LEFT JOIN empleados e ON d.id = e.departamento_id
GROUP BY d.id, d.nombre
HAVING COUNT(e.id) > 0
ORDER BY salario_promedio DESC;
```
Esta consulta combina JOIN, GROUP BY, funciones de agregacion, HAVING y ORDER BY.

## Paso 21: CASE para logica condicional
```sql
SELECT nombre, salario,
    CASE
        WHEN salario >= 55000 THEN 'Alto'
        WHEN salario >= 45000 THEN 'Medio'
        ELSE 'Bajo'
    END AS nivel_salarial
FROM empleados
ORDER BY salario DESC;
```
CASE permite agregar logica condicional en las consultas, similar a if-else.
