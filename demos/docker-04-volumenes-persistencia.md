# Curso Docker - Módulo 4: Volúmenes y Persistencia

## Paso 1: Crear un volumen Docker
```bash
docker volume create mi-volumen
```
Crea un volumen administrado por Docker. Los volúmenes son la forma recomendada de persistir datos en Docker.

## Paso 2: Listar volúmenes existentes
```bash
docker volume ls
```
Muestra todos los volúmenes Docker creados en el sistema.

## Paso 3: Inspeccionar volumen
```bash
docker volume inspect mi-volumen
```
Muestra detalles del volumen en JSON: punto de montaje, driver, opciones. El "Mountpoint" es donde Docker almacena los datos.

## Paso 4: Usar volumen en contenedor
```bash
docker run -d --name postgres-db -v mi-volumen:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secret postgres:13
```
Monta el volumen en el directorio de datos de PostgreSQL. Los datos sobrevivirán aunque elimines el contenedor.

## Paso 5: Verificar que el contenedor está usando el volumen
```bash
docker inspect postgres-db | grep -A 10 "Mounts"
```
Muestra información sobre los volúmenes montados en el contenedor, incluyendo tipo, origen y destino.

## Paso 6: Escribir datos en la base de datos
```bash
docker exec -it postgres-db psql -U postgres -c "CREATE TABLE prueba (id SERIAL, mensaje TEXT);"
```
Crea una tabla en PostgreSQL. Esta tabla se almacenará en el volumen persistente.

## Paso 7: Insertar datos en la tabla
```bash
docker exec -it postgres-db psql -U postgres -c "INSERT INTO prueba (mensaje) VALUES ('Datos persistentes');"
```
Inserta un registro en la tabla. Estos datos están almacenados en el volumen.

## Paso 8: Verificar los datos
```bash
docker exec -it postgres-db psql -U postgres -c "SELECT * FROM prueba;"
```
Consulta la tabla para verificar que los datos fueron insertados correctamente.

## Paso 9: Detener y eliminar el contenedor
```bash
docker stop postgres-db && docker rm postgres-db
```
Elimina el contenedor de PostgreSQL. Los datos en el volumen NO se eliminan.

## Paso 10: Crear nuevo contenedor con el mismo volumen
```bash
docker run -d --name postgres-nuevo -v mi-volumen:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secret postgres:13
```
Crea un nuevo contenedor usando el mismo volumen. Los datos anteriores deberían seguir existiendo.

## Paso 11: Verificar persistencia de datos
```bash
sleep 5 && docker exec -it postgres-nuevo psql -U postgres -c "SELECT * FROM prueba;"
```
Espera que PostgreSQL inicie y consulta la tabla. ¡Los datos persisten! Esto demuestra que los volúmenes son independientes de los contenedores.

## Paso 12: Crear directorio para bind mount
```bash
mkdir -p ~/docker-data && echo "Archivo en el host" > ~/docker-data/archivo.txt
```
Los bind mounts vinculan un directorio del host al contenedor. Útil para desarrollo.

## Paso 13: Usar bind mount en contenedor
```bash
docker run -d --name nginx-bind -v ~/docker-data:/usr/share/nginx/html nginx
```
Monta el directorio del host en nginx. Los cambios en el host se reflejan inmediatamente en el contenedor.

## Paso 14: Verificar archivo en contenedor
```bash
docker exec nginx-bind cat /usr/share/nginx/html/archivo.txt
```
Lee el archivo desde dentro del contenedor. Verás "Archivo en el host".

## Paso 15: Modificar archivo desde el host
```bash
echo "<h1>Actualizado desde el host</h1>" > ~/docker-data/index.html
```
Crea un nuevo archivo HTML en el directorio compartido.

## Paso 16: Verificar cambios en tiempo real
```bash
docker exec nginx-bind ls /usr/share/nginx/html
```
El nuevo archivo index.html aparece inmediatamente en el contenedor sin reiniciar.

## Paso 17: Montar volumen en modo solo lectura
```bash
docker run -d --name nginx-readonly -v ~/docker-data:/usr/share/nginx/html:ro nginx
```
El flag ":ro" (read-only) previene que el contenedor modifique los archivos del host.

## Paso 18: Intentar escribir en volumen readonly
```bash
docker exec nginx-readonly sh -c "echo 'test' > /usr/share/nginx/html/test.txt" 2>&1 || echo "Error esperado: volumen de solo lectura"
```
Este comando falla porque el volumen es de solo lectura. Es una medida de seguridad.

## Paso 19: Listar volúmenes no utilizados
```bash
docker volume ls -f dangling=true
```
Muestra volúmenes "huérfanos" que no están siendo usados por ningún contenedor.

## Paso 20: Limpiar recursos y volúmenes
```bash
docker stop postgres-nuevo nginx-bind nginx-readonly && docker rm postgres-nuevo nginx-bind nginx-readonly && docker volume rm mi-volumen && rm -rf ~/docker-data
```
Detiene contenedores, los elimina, elimina el volumen y limpia el directorio temporal. Deja el sistema limpio.
