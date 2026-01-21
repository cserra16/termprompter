# Curso de Linux - Manipulación de Archivos y Directorios

## Paso 1: Crear estructura de directorios
```bash
mkdir -p proyectos/web/html proyectos/web/css proyectos/docs
```
La opción `-p` crea directorios padres si no existen. Esto crea toda la estructura de carpetas en un solo comando.

## Paso 2: Ver estructura en árbol
```bash
ls -R proyectos
```
La opción `-R` lista recursivamente, mostrando el contenido de todos los subdirectorios.

## Paso 3: Copiar un archivo
```bash
cp /etc/hosts hosts-backup.txt
```
El comando `cp` (Copy) copia archivos. Aquí copiamos el archivo hosts del sistema a nuestro directorio actual.

## Paso 4: Copiar con preservación de atributos
```bash
cp -p hosts-backup.txt hosts-backup2.txt
```
La opción `-p` preserva los atributos del archivo original (permisos, fecha de modificación, etc.).

## Paso 5: Copiar un directorio completo
```bash
cp -r proyectos proyectos-backup
```
La opción `-r` (recursive) es necesaria para copiar directorios y todo su contenido.

## Paso 6: Mover/renombrar un archivo
```bash
mv hosts-backup.txt respaldo-hosts.txt
```
El comando `mv` (Move) mueve o renombra archivos. Si origen y destino están en el mismo directorio, es un renombrado.

## Paso 7: Mover archivo a otro directorio
```bash
mv respaldo-hosts.txt proyectos/docs/
```
Aquí `mv` mueve el archivo al directorio especificado manteniendo su nombre.

## Paso 8: Eliminar un archivo
```bash
rm hosts-backup2.txt
```
El comando `rm` (Remove) elimina archivos permanentemente. No hay papelera de reciclaje en Linux por defecto.

## Paso 9: Crear archivos para práctica
```bash
touch proyectos/archivo1.txt proyectos/archivo2.txt proyectos/archivo3.txt
```
Creamos varios archivos de prueba en el directorio proyectos.

## Paso 10: Eliminar con confirmación
```bash
rm -i proyectos/archivo1.txt
```
La opción `-i` (interactive) solicita confirmación antes de eliminar cada archivo.

## Paso 11: Eliminar múltiples archivos
```bash
rm proyectos/archivo2.txt proyectos/archivo3.txt
```
Puedes especificar múltiples archivos para eliminar en un solo comando.

## Paso 12: Crear archivo con contenido
```bash
cat > proyectos/web/html/index.html << EOF
<!DOCTYPE html>
<html>
<head><title>Mi Página</title></head>
<body><h1>Hola Mundo</h1></body>
</html>
EOF
```
El heredoc (<<EOF) permite escribir múltiples líneas. Escribe hasta encontrar EOF.

## Paso 13: Buscar archivos por nombre
```bash
find proyectos -name "*.html"
```
El comando `find` busca archivos. Aquí buscamos todos los archivos HTML en el directorio proyectos.

## Paso 14: Buscar archivos por tipo
```bash
find proyectos -type f
```
La opción `-type f` busca solo archivos regulares (no directorios).

## Paso 15: Buscar directorios
```bash
find proyectos -type d
```
La opción `-type d` busca solo directorios.

## Paso 16: Enlace simbólico
```bash
ln -s proyectos/web/html/index.html enlace-index.html
```
El comando `ln -s` crea un enlace simbólico (similar a un acceso directo en Windows).

## Paso 17: Ver enlaces simbólicos
```bash
ls -l enlace-index.html
```
Los enlaces simbólicos se muestran con una flecha `->` indicando el archivo original.

## Paso 18: Comprimir archivos con tar
```bash
tar -czf proyectos-backup.tar.gz proyectos-backup
```
El comando `tar` crea archivos comprimidos. `-c` crea, `-z` comprime con gzip, `-f` especifica el nombre del archivo.

## Paso 19: Ver contenido de archivo tar
```bash
tar -tzf proyectos-backup.tar.gz
```
La opción `-t` lista el contenido sin extraer. `-z` indica que está comprimido con gzip.

## Paso 20: Descomprimir archivo tar
```bash
tar -xzf proyectos-backup.tar.gz -C /tmp
```
La opción `-x` extrae archivos. `-C` especifica el directorio de destino.
