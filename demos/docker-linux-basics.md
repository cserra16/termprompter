---
docker:
  image: ubuntu:22.04
  name: demo-linux-basics
  workdir: /root
  shell:
    - /bin/bash
---

# Demo: Comandos Básicos de Linux (en Docker)

## Paso 1: Verificar el sistema operativo
```bash
cat /etc/os-release
```
Este comando muestra información sobre la distribución de Linux que estamos usando. En este caso, estamos dentro de un contenedor Ubuntu 22.04.

## Paso 2: Mostrar el directorio actual
```bash
pwd
```
El comando `pwd` (Print Working Directory) muestra la ruta completa del directorio en el que nos encontramos actualmente.

## Paso 3: Listar archivos y directorios
```bash
ls -la
```
El comando `ls` lista los contenidos de un directorio. Con las opciones `-la` mostramos todos los archivos (incluyendo ocultos) en formato largo con permisos.

## Paso 4: Crear un directorio de prueba
```bash
mkdir mi_carpeta
```
El comando `mkdir` (Make Directory) crea un nuevo directorio con el nombre especificado.

## Paso 5: Entrar en el directorio
```bash
cd mi_carpeta
```
El comando `cd` (Change Directory) nos permite movernos entre directorios. Entramos en la carpeta que acabamos de crear.

## Paso 6: Crear un archivo de texto
```bash
echo "Hola desde Docker" > saludo.txt
```
Usamos `echo` para crear un archivo de texto con contenido. El operador `>` redirige la salida al archivo.

## Paso 7: Ver el contenido del archivo
```bash
cat saludo.txt
```
El comando `cat` muestra el contenido de un archivo en la terminal.

## Paso 8: Obtener información del sistema
```bash
uname -a
```
El comando `uname` muestra información del kernel del sistema. Con `-a` mostramos toda la información disponible.

## Paso 9: Ver los procesos en ejecución
```bash
ps aux
```
El comando `ps` muestra los procesos en ejecución. Las opciones `aux` muestran todos los procesos de todos los usuarios con información detallada.

## Paso 10: Mostrar el uso de disco
```bash
df -h
```
El comando `df` muestra el espacio disponible en los sistemas de archivos. La opción `-h` muestra los tamaños en formato legible (KB, MB, GB).
