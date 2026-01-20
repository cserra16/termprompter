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

# Curso MariaDB - Modulo 8: Transacciones y Copias de Seguridad

## Paso 1: Crear base de datos para transacciones
```sql
CREATE DATABASE IF NOT EXISTS banco;
```
Creamos una base de datos para simular operaciones bancarias.

## Paso 2: Seleccionar la base de datos
```sql
USE banco;
```
Seleccionamos la base de datos banco.

## Paso 3: Crear tabla de cuentas
```sql
CREATE TABLE IF NOT EXISTS cuentas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titular VARCHAR(100),
    saldo DECIMAL(12,2)
) ENGINE=InnoDB;
```
Usamos InnoDB que soporta transacciones. MyISAM no las soporta.

## Paso 4: Insertar datos de ejemplo
```sql
INSERT INTO cuentas (titular, saldo) VALUES
('Ana Garcia', 5000.00),
('Carlos Lopez', 3000.00),
('Maria Rodriguez', 7500.00);
```
Creamos cuentas bancarias para simular transferencias.

## Paso 5: Ver el estado inicial
```sql
SELECT * FROM cuentas;
```
Verificamos los saldos antes de realizar transacciones.

## Paso 6: Iniciar una transaccion
```sql
START TRANSACTION;
```
START TRANSACTION inicia un bloque de operaciones atomicas.

## Paso 7: Retirar de una cuenta
```sql
UPDATE cuentas SET saldo = saldo - 500 WHERE titular = 'Ana Garcia';
```
Retiramos 500 de la cuenta de Ana.

## Paso 8: Depositar en otra cuenta
```sql
UPDATE cuentas SET saldo = saldo + 500 WHERE titular = 'Carlos Lopez';
```
Depositamos 500 en la cuenta de Carlos.

## Paso 9: Confirmar la transaccion
```sql
COMMIT;
```
COMMIT confirma todos los cambios. La transferencia es ahora permanente.

## Paso 10: Verificar los cambios confirmados
```sql
SELECT * FROM cuentas;
```
Ana tiene 4500 y Carlos tiene 3500. La transferencia fue exitosa.

## Paso 11: Iniciar transaccion para demostrar ROLLBACK
```sql
START TRANSACTION;
```
Iniciamos otra transaccion para demostrar ROLLBACK.

## Paso 12: Hacer un retiro grande
```sql
UPDATE cuentas SET saldo = saldo - 10000 WHERE titular = 'Maria Rodriguez';
```
Intentamos retirar mas de lo que Maria tiene.

## Paso 13: Ver el estado temporal
```sql
SELECT * FROM cuentas WHERE titular = 'Maria Rodriguez';
```
El saldo muestra -2500 temporalmente dentro de la transaccion.

## Paso 14: Cancelar la transaccion
```sql
ROLLBACK;
```
ROLLBACK deshace todos los cambios de la transaccion.

## Paso 15: Verificar que ROLLBACK funciono
```sql
SELECT * FROM cuentas WHERE titular = 'Maria Rodriguez';
```
El saldo de Maria sigue siendo 7500. El retiro fue cancelado.

## Paso 16: Transaccion con SAVEPOINT
```sql
START TRANSACTION;
```
Iniciamos transaccion para demostrar SAVEPOINT.

## Paso 17: Primer deposito
```sql
UPDATE cuentas SET saldo = saldo + 100 WHERE titular = 'Ana Garcia';
```
Depositamos 100 en la cuenta de Ana.

## Paso 18: Crear punto de guardado
```sql
SAVEPOINT deposito_ana;
```
SAVEPOINT crea un punto al que podemos volver.

## Paso 19: Segundo deposito
```sql
UPDATE cuentas SET saldo = saldo + 200 WHERE titular = 'Carlos Lopez';
```
Depositamos 200 en la cuenta de Carlos.

## Paso 20: Revertir al SAVEPOINT
```sql
ROLLBACK TO SAVEPOINT deposito_ana;
```
Revertimos solo hasta el SAVEPOINT, manteniendo el deposito de Ana.

## Paso 21: Confirmar cambios parciales
```sql
COMMIT;
```
Confirmamos los cambios hasta el SAVEPOINT.

## Paso 22: Verificar resultado del SAVEPOINT
```sql
SELECT * FROM cuentas;
```
Ana tiene 4600 (se anadio 100), Carlos sigue con 3500 (su deposito fue revertido).

## Paso 23: Ver el nivel de aislamiento
```sql
SELECT @@transaction_isolation;
```
El nivel de aislamiento determina como las transacciones ven los datos de otras.

## Paso 24: Crear base de datos para restauracion
```sql
CREATE DATABASE IF NOT EXISTS banco_restaurado;
```
Para hacer backups y restauraciones, usa mariadb-dump desde la terminal bash del contenedor.

## Paso 25: Resumen de transacciones
```sql
SELECT 'Transacciones completadas' AS mensaje, COUNT(*) AS total_cuentas, SUM(saldo) AS saldo_total FROM cuentas;
```
Las transacciones garantizan integridad: todas las operaciones se completan o ninguna lo hace.
