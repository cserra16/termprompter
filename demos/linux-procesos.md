# Curso de Linux - Gestión de Procesos

## Paso 1: Ver procesos del usuario actual
```bash
ps
```
El comando `ps` (Process Status) muestra los procesos en ejecución en la terminal actual.

## Paso 2: Ver todos los procesos del sistema
```bash
ps aux
```
`a` muestra procesos de todos los usuarios, `u` formato orientado al usuario, `x` incluye procesos sin terminal.

## Paso 3: Ver procesos en formato de árbol
```bash
ps auxf
```
La opción `f` muestra los procesos en formato de árbol (forest), mostrando relaciones padre-hijo.

## Paso 4: Buscar un proceso específico
```bash
ps aux | grep bash
```
Combinamos `ps` con `grep` para filtrar y encontrar procesos específicos por nombre.

## Paso 5: Ver procesos en tiempo real
```bash
top
```
El comando `top` muestra procesos en tiempo real con actualización continua. Presiona 'q' para salir.

## Paso 6: Monitor de procesos mejorado
```bash
htop
```
`htop` es una versión mejorada de top con interfaz más amigable (puede no estar instalado por defecto).

## Paso 7: Ver uso de memoria
```bash
free -h
```
El comando `free` muestra memoria RAM libre y usada. La opción `-h` muestra valores legibles (MB, GB).

## Paso 8: Ejecutar proceso en segundo plano
```bash
sleep 100 &
```
El símbolo `&` al final ejecuta el comando en segundo plano, devolviendo control a la terminal.

## Paso 9: Ver trabajos en segundo plano
```bash
jobs
```
El comando `jobs` lista todos los trabajos (procesos) en segundo plano de la sesión actual.

## Paso 10: Obtener PID del último proceso en background
```bash
echo $!
```
La variable especial `$!` contiene el PID (Process ID) del último proceso ejecutado en segundo plano.

## Paso 11: Traer proceso a primer plano
```bash
fg
```
El comando `fg` (foreground) trae el último trabajo en segundo plano al primer plano.

## Paso 12: Suspender un proceso
```bash
sleep 60
```
Ejecuta este comando y luego presiona Ctrl+Z para suspender el proceso.

## Paso 13: Continuar proceso suspendido en background
```bash
bg
```
El comando `bg` (background) continúa la ejecución del proceso suspendido en segundo plano.

## Paso 14: Ver PID de procesos
```bash
pgrep bash
```
El comando `pgrep` busca procesos por nombre y muestra sus PIDs.

## Paso 15: Ver información detallada de proceso
```bash
pgrep -a bash
```
La opción `-a` muestra el PID junto con la línea de comando completa del proceso.

## Paso 16: Enviar señal a un proceso
```bash
sleep 200 & kill -STOP $!
```
El comando `kill` envía señales a procesos. `-STOP` pausa el proceso (equivalente a Ctrl+Z).

## Paso 17: Continuar proceso pausado
```bash
kill -CONT %1
```
La señal `-CONT` continúa un proceso pausado. `%1` se refiere al trabajo número 1 de `jobs`.

## Paso 18: Terminar proceso amablemente
```bash
sleep 300 & kill $!
```
`kill` sin opciones envía SIGTERM, permitiendo al proceso terminar limpiamente.

## Paso 19: Forzar terminación de proceso
```bash
sleep 400 & kill -9 $!
```
La señal `-9` (SIGKILL) fuerza terminación inmediata sin permitir limpieza.

## Paso 20: Ver procesos de un usuario
```bash
ps -u $(whoami)
```
La opción `-u` filtra procesos por usuario. `$(whoami)` expande al nombre del usuario actual.
