# Comandos Linux básicos — Tutorial interactivo

## Paso 1: Ver tu ubicación actual
```bash
pwd
```
Muestra el "working directory" (directorio de trabajo) actual. Útil para confirmar en qué carpeta estás antes de ejecutar otras operaciones.

## Paso 2: Listar archivos y detalles
```bash
ls -la
```
Lista todos los archivos y directorios en la carpeta actual, incluyendo los ocultos (los que comienzan con .). La opción -l muestra permisos, propietario, tamaño y fecha de modificación.

## Paso 3: Crear un directorio y situarte en él
```bash
mkdir -p ~/terminal_tutorial && cd ~/terminal_tutorial
```
Crea un directorio llamado terminal_tutorial en tu carpeta home si no existe (-p evita errores) y luego cambia el directorio actual a ese nuevo directorio. Es una práctica común para organizar ejercicios.

## Paso 4: Crear y escribir en un archivo
```bash
echo "Hola desde el tutorial de terminal" > hola.txt
```
Usa echo para generar texto y la redirección > para crear (o sobrescribir) el archivo hola.txt con ese contenido. Para añadir sin sobrescribir, usarías >>.

## Paso 5: Leer el contenido del archivo
```bash
cat hola.txt
```
Muestra el contenido completo del archivo en la terminal. Para archivos largos puedes usar less o head/tail para ver porciones.

## Paso 6: Copiar y renombrar archivos
```bash
cp hola.txt copia_hola.txt && mv copia_hola.txt saludo.txt
```
Copia hola.txt a copia_hola.txt con cp, y luego renombra esa copia a saludo.txt con mv. cp duplica; mv mueve o renombra archivos.

## Paso 7: Buscar texto dentro de archivos
```bash
grep -n "Hola" -R .
```
Busca recursivamente (-R) la cadena "Hola" en el directorio actual y muestra el número de línea (-n) y el archivo donde aparece. Muy útil para localizar texto dentro de muchos archivos.