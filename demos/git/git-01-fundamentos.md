# Curso de Git - Parte 1: Fundamentos

## Paso 1: Verificar la instalacion de Git
```bash
git --version
```
Este comando verifica que Git esta instalado en tu sistema y muestra la version actual. Si no esta instalado, deberas instalarlo con `sudo apt install git` en Linux/Ubuntu o descargarlo desde git-scm.com para Windows/Mac.

## Paso 2: Configurar tu nombre de usuario
```bash
git config --global user.name "Tu Nombre"
```
Configura tu nombre de usuario que aparecera en todos tus commits. El flag `--global` hace que esta configuracion se aplique a todos los repositorios de tu sistema. Cambia "Tu Nombre" por tu nombre real.

## Paso 3: Configurar tu email
```bash
git config --global user.email "tu.email@ejemplo.com"
```
Configura tu direccion de email asociada a tus commits. Es importante usar el mismo email que usaras en plataformas como GitHub o GitLab para que tus contribuciones se vinculen correctamente a tu cuenta.

## Paso 4: Configurar el editor por defecto
```bash
git config --global core.editor "nano"
```
Establece el editor de texto que Git usara para escribir mensajes de commit largos o durante operaciones interactivas. Puedes usar `nano`, `vim`, `code --wait` (VS Code), etc.

## Paso 5: Ver toda la configuracion de Git
```bash
git config --list
```
Muestra todas las configuraciones actuales de Git, incluyendo las que acabas de establecer. Puedes ver configuraciones a nivel de sistema, global (usuario) y local (repositorio).

## Paso 6: Crear un directorio para practicar
```bash
mkdir mi-primer-repo && cd mi-primer-repo
```
Creamos un nuevo directorio llamado `mi-primer-repo` y entramos en el. Este sera nuestro espacio de practica para aprender Git.

## Paso 7: Inicializar un repositorio Git
```bash
git init
```
Este comando crea un nuevo repositorio Git vacio en el directorio actual. Crea una carpeta oculta `.git` que contiene toda la informacion del control de versiones. A partir de ahora, Git puede rastrear los cambios en este directorio.

## Paso 8: Ver el contenido de la carpeta .git
```bash
ls -la .git
```
Exploramos el contenido de la carpeta `.git` que Git ha creado. Aqui se almacenan los objetos, referencias, configuracion local y toda la historia del proyecto. Nunca debes modificar estos archivos manualmente.

## Paso 9: Comprobar el estado del repositorio
```bash
git status
```
El comando mas usado en Git. Muestra el estado actual del repositorio: en que rama estas, que archivos han sido modificados, cuales estan preparados para commit, y cuales no estan siendo rastreados.

## Paso 10: Crear un archivo README
```bash
echo "# Mi Primer Proyecto" > README.md
```
Creamos nuestro primer archivo en el repositorio. El archivo README.md es una convencion para documentar proyectos y suele contener informacion sobre el proyecto, como instalarlo y usarlo.

## Paso 11: Ver el estado con el nuevo archivo
```bash
git status
```
Ahora Git detecta que hay un nuevo archivo sin rastrear (untracked). Los archivos nuevos aparecen en rojo y Git nos sugiere usar `git add` para empezar a rastrearlos.

## Paso 12: Agregar el archivo al area de preparacion (staging)
```bash
git add README.md
```
El comando `git add` mueve el archivo al area de preparacion (staging area). Es como decirle a Git: "quiero incluir los cambios de este archivo en el proximo commit". El archivo pasa de estar "untracked" a "staged".

## Paso 13: Ver el estado despues de add
```bash
git status
```
Ahora el archivo aparece en verde bajo "Changes to be committed". Esta en el staging area, listo para ser incluido en el proximo commit.

## Paso 14: Realizar el primer commit
```bash
git commit -m "Primer commit: agregar README.md"
```
Un commit es una instantanea del estado de tu proyecto. El flag `-m` permite escribir el mensaje directamente. Los mensajes deben ser descriptivos y explicar QUE cambios se hicieron y POR QUE.

## Paso 15: Ver el historial de commits
```bash
git log
```
Muestra el historial de commits del repositorio. Cada commit tiene un hash SHA-1 unico, el autor, la fecha y el mensaje. Presiona `q` para salir si el historial es largo.

## Paso 16: Ver el historial en formato compacto
```bash
git log --oneline
```
Muestra el historial en formato resumido: solo el hash corto (7 caracteres) y el mensaje de cada commit. Muy util para tener una vision rapida del historial.

## Paso 17: Crear mas archivos para practicar
```bash
echo "console.log('Hola Mundo');" > app.js && echo "body { margin: 0; }" > styles.css
```
Creamos dos archivos adicionales para practicar con multiples archivos. Un archivo JavaScript y uno CSS, simulando un proyecto web basico.

## Paso 18: Agregar todos los archivos a la vez
```bash
git add .
```
El punto `.` significa "todos los archivos del directorio actual". Este comando agrega todos los archivos nuevos y modificados al staging area de una sola vez. Usalo con cuidado para no agregar archivos no deseados.

## Paso 19: Realizar el segundo commit
```bash
git commit -m "Agregar archivos iniciales del proyecto"
```
Creamos un segundo commit con los nuevos archivos. Ahora nuestro repositorio tiene dos commits en su historial.

## Paso 20: Ver el historial actualizado
```bash
git log --oneline --graph
```
El flag `--graph` muestra una representacion visual del historial. Aunque ahora es lineal, sera muy util cuando trabajemos con ramas. Puedes ver como los commits estan conectados.
