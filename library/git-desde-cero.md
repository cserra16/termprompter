# Git desde cero: tutorial práctico en 7 pasos

## Paso 1: Configura tu identidad global
```bash
git config --global user.name "Tu Nombre" && git config --global user.email "tu@correo.com"
```
Notas explicativas: Git usa estos datos para firmar tus commits. Se guardan en ~/.gitconfig y aplican a todos tus repos. Puedes verificar con git config --global -l.

## Paso 2: Crea el proyecto e inicializa el repositorio
```bash
mkdir mi-proyecto && cd mi-proyecto && git init -b main
```
Notas explicativas: Crea una carpeta, entra en ella e inicializa un repositorio Git con la rama principal llamada main (opción -b). A partir de aquí, ejecuta el resto de comandos dentro de mi-proyecto.

## Paso 3: Crea archivos y añádelos al área de staging
```bash
echo "# Mi Proyecto" > README.md && printf ".DS_Store\nnode_modules/\n" > .gitignore && git add README.md .gitignore && git status -s
```
Notas explicativas: Genera un README y un .gitignore básico, los añade al área de preparación (staging) y muestra el estado en formato corto (-s). Staging te permite revisar qué se incluirá en el próximo commit.

## Paso 4: Haz tu primer commit con un mensaje claro
```bash
git commit -m "Inicializa repositorio: README y .gitignore"
```
Notas explicativas: Crea una instantánea (commit) del estado de tus archivos preparados. Un buen mensaje de commit explica el “qué” y, si es útil, el “por qué”.

## Paso 5: Crea una rama de feature y trabaja en ella
```bash
git switch -c feature/saludo && echo "Hola mundo desde Git" >> README.md && git add README.md && git commit -m "Agrega sección de saludo al README"
```
Notas explicativas: Crea y cambia a la rama feature/saludo (-c). Modifica el README, añade los cambios a staging y crea un commit en esa rama. Trabajar en ramas aísla tus cambios y facilita la colaboración.

## Paso 6: Vuelve a main y fusiona tu trabajo
```bash
git switch main && git merge --no-ff feature/saludo -m "Fusiona feature/saludo en main"
```
Notas explicativas: Cambia a main y fusiona la rama de feature con un merge explícito (--no-ff) para conservar el commit de fusión. Si hubiera conflictos, Git te pedirá resolverlos antes de completar el merge.

## Paso 7: Conecta un remoto y sube tu rama principal
```bash
git remote add origin https://github.com/tu-usuario/mi-proyecto.git && git push -u origin main
```
Notas explicativas: Añade el remoto origin (ajusta la URL a tu repositorio real) y sube main. La opción -u establece el upstream, permitiendo usar git push y git pull sin especificar el remoto y la rama en el futuro. Si usas SSH, reemplaza la URL por git@github.com:tu-usuario/mi-proyecto.git.