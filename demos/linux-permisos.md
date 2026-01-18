# Curso de Linux - Permisos y Usuarios

## Paso 1: Ver información del usuario actual
```bash
whoami
```
El comando `whoami` muestra el nombre del usuario con el que estás conectado actualmente.

## Paso 2: Ver ID de usuario y grupos
```bash
id
```
El comando `id` muestra el UID (User ID), GID (Group ID) y todos los grupos a los que pertenece el usuario.

## Paso 3: Crear archivo de prueba
```bash
touch archivo-permisos.txt
```
Creamos un archivo para practicar con permisos.

## Paso 4: Ver permisos detallados
```bash
ls -l archivo-permisos.txt
```
La salida muestra permisos en formato: `-rwxrwxrwx` donde el primer carácter indica tipo, luego 3 grupos de rwx (read/write/execute) para propietario, grupo y otros.

## Paso 5: Entender la notación de permisos
```bash
stat -c "%a %n" archivo-permisos.txt
```
El comando `stat` con `-c "%a"` muestra los permisos en formato octal (ej: 644, 755).

## Paso 6: Cambiar permisos (modo simbólico)
```bash
chmod u+x archivo-permisos.txt
```
`chmod` cambia permisos. `u+x` añade permiso de ejecución (x) al usuario (u) propietario.

## Paso 7: Quitar permisos de escritura a grupo
```bash
chmod g-w archivo-permisos.txt
```
`g-w` quita el permiso de escritura (w) al grupo (g).

## Paso 8: Cambiar permisos (modo numérico)
```bash
chmod 644 archivo-permisos.txt
```
Modo numérico: 6=rw- (4+2), 4=r-- para grupo y otros. Formato: propietario-grupo-otros.

## Paso 9: Hacer archivo ejecutable
```bash
chmod 755 archivo-permisos.txt
```
755 = rwxr-xr-x. El propietario puede leer/escribir/ejecutar, grupo y otros pueden leer/ejecutar.

## Paso 10: Crear un script ejecutable
```bash
cat > mi-script.sh << 'EOF'
#!/bin/bash
echo "Este es mi primer script"
echo "Usuario: $(whoami)"
echo "Fecha: $(date)"
EOF
```
Creamos un script de bash. La primera línea (shebang) indica qué intérprete usar.

## Paso 11: Dar permisos de ejecución al script
```bash
chmod +x mi-script.sh
```
El `+x` sin especificar u/g/o añade permisos de ejecución para todos.

## Paso 12: Ejecutar el script
```bash
./mi-script.sh
```
El `./` indica que el script está en el directorio actual. Es necesario para ejecutar archivos locales.

## Paso 13: Crear directorio con permisos
```bash
mkdir directorio-privado
```
Creamos un directorio para practicar permisos en directorios.

## Paso 14: Cambiar permisos del directorio
```bash
chmod 700 directorio-privado
```
700 = rwx------ Solo el propietario puede leer, escribir y acceder al directorio.

## Paso 15: Ver permisos del directorio
```bash
ls -ld directorio-privado
```
La opción `-d` muestra información del directorio mismo, no de su contenido.

## Paso 16: Cambiar permisos recursivamente
```bash
chmod -R 755 proyectos
```
La opción `-R` aplica los permisos recursivamente a todos los archivos y subdirectorios.

## Paso 17: Ver usuarios del sistema
```bash
cat /etc/passwd | head -n 5
```
El archivo `/etc/passwd` contiene información de todos los usuarios del sistema.

## Paso 18: Ver grupos del sistema
```bash
cat /etc/group | head -n 5
```
El archivo `/etc/group` lista todos los grupos y sus miembros.

## Paso 19: Ver umask actual
```bash
umask
```
`umask` muestra la máscara de permisos por defecto. Determina qué permisos se quitan a archivos nuevos (ej: 0022).

## Paso 20: Ver últimos usuarios conectados
```bash
last | head -n 10
```
El comando `last` muestra el historial de inicios de sesión en el sistema.
