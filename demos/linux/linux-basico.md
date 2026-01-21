# Curso de Linux - Nivel Básico

## Paso 1: Mostrar el directorio actual
```bash
pwd
```
El comando `pwd` (Print Working Directory) muestra la ruta completa del directorio donde te encuentras actualmente.

## Paso 2: Listar archivos y directorios
```bash
ls
```
El comando `ls` lista el contenido del directorio actual. Muestra archivos y carpetas sin detalles adicionales.

## Paso 3: Listar archivos con detalles
```bash
ls -la
```
La opción `-l` muestra formato largo con permisos, propietario, tamaño y fecha. La opción `-a` incluye archivos ocultos (que comienzan con punto).

## Paso 4: Crear un directorio
```bash
mkdir practica-linux
```
El comando `mkdir` (Make Directory) crea un nuevo directorio. Aquí creamos una carpeta llamada "practica-linux".

## Paso 5: Cambiar al nuevo directorio
```bash
cd practica-linux
```
El comando `cd` (Change Directory) cambia tu ubicación al directorio especificado.

## Paso 6: Verificar ubicación actual
```bash
pwd
```
Confirmamos que estamos dentro del nuevo directorio usando `pwd`.

## Paso 7: Crear un archivo vacío
```bash
touch archivo1.txt
```
El comando `touch` crea un archivo vacío o actualiza la fecha de modificación si el archivo ya existe.

## Paso 8: Crear múltiples archivos
```bash
touch archivo2.txt archivo3.txt documento.log
```
Puedes crear varios archivos a la vez separándolos con espacios.

## Paso 9: Escribir contenido en un archivo
```bash
echo "Hola, Linux!" > saludo.txt
```
El comando `echo` imprime texto y el operador `>` redirige la salida a un archivo, sobrescribiendo su contenido.

## Paso 10: Añadir contenido a un archivo
```bash
echo "Segunda línea" >> saludo.txt
```
El operador `>>` añade contenido al final del archivo sin borrar lo que ya existe.

## Paso 11: Ver el contenido de un archivo
```bash
cat saludo.txt
```
El comando `cat` muestra todo el contenido de un archivo en la terminal.

## Paso 12: Ver el inicio de un archivo
```bash
head saludo.txt
```
El comando `head` muestra las primeras 10 líneas de un archivo por defecto.

## Paso 13: Ver el final de un archivo
```bash
tail saludo.txt
```
El comando `tail` muestra las últimas 10 líneas de un archivo por defecto.

## Paso 14: Contar líneas, palabras y caracteres
```bash
wc saludo.txt
```
El comando `wc` (Word Count) muestra el número de líneas, palabras y bytes del archivo.

## Paso 15: Obtener el tipo de archivo
```bash
file saludo.txt
```
El comando `file` determina y muestra el tipo de un archivo basándose en su contenido.

## Paso 16: Mostrar la fecha y hora actual
```bash
date
```
El comando `date` muestra la fecha y hora actual del sistema.

## Paso 17: Ver el calendario del mes
```bash
cal
```
El comando `cal` muestra un calendario del mes actual.

## Paso 18: Mostrar información del sistema
```bash
uname -a
```
El comando `uname -a` muestra toda la información del sistema: nombre del kernel, versión, arquitectura, etc.

## Paso 19: Ver el uso de disco
```bash
df -h
```
El comando `df` (Disk Free) muestra el espacio disponible en los sistemas de archivos. La opción `-h` muestra tamaños legibles para humanos (KB, MB, GB).

## Paso 20: Regresar al directorio anterior
```bash
cd ..
```
El símbolo `..` representa el directorio padre. Este comando te lleva un nivel arriba en la jerarquía de directorios.
