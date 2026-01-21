# Curso de Git - Parte 4: Tecnicas Intermedias

## Paso 1: Preparar un repositorio de practica
```bash
cd ~ && mkdir git-intermedio && cd git-intermedio && git init && echo "Proyecto inicial" > README.md && git add . && git commit -m "Inicio"
```
Creamos un nuevo repositorio limpio para practicar las tecnicas intermedias de Git sin arrastrar conflictos anteriores.

## Paso 2: Crear cambios sin commitear
```bash
echo "Trabajo en progreso" > wip.txt && echo "Mas cambios" >> README.md
```
Simulamos una situacion comun: estas trabajando en algo pero necesitas cambiar de rama urgentemente. Tienes cambios sin guardar que no quieres perder.

## Paso 3: Guardar cambios temporalmente con stash
```bash
git stash
```
El comando `stash` guarda tus cambios en una pila temporal y limpia el directorio de trabajo. Es como guardar tu trabajo en un cajon para volver a el despues. Muy util para cambios de contexto rapidos.

## Paso 4: Ver que el directorio esta limpio
```bash
git status && ls
```
Despues del stash, el directorio de trabajo vuelve al estado del ultimo commit. Los archivos modificados y el archivo nuevo han desaparecido temporalmente.

## Paso 5: Ver la lista de stashes
```bash
git stash list
```
Muestra todos los stashes guardados. Cada uno tiene un identificador como `stash@{0}`. Puedes tener multiples stashes apilados.

## Paso 6: Recuperar los cambios del stash
```bash
git stash pop
```
El comando `pop` recupera el ultimo stash y lo elimina de la pila. Tus cambios vuelven al directorio de trabajo. Usa `git stash apply` si quieres mantener el stash en la pila.

## Paso 7: Guardar stash con mensaje descriptivo
```bash
git stash push -m "WIP: formulario de contacto"
```
Puedes agregar un mensaje descriptivo para identificar facilmente el stash. Muy util cuando tienes varios stashes guardados.

## Paso 8: Ver contenido de un stash
```bash
git stash show -p stash@{0}
```
El flag `-p` muestra el diff completo del stash. Te permite revisar que cambios contiene antes de aplicarlo.

## Paso 9: Limpiar los stashes
```bash
git stash drop stash@{0}
```
Elimina un stash especifico. Usa `git stash clear` para eliminar todos los stashes de una vez. Cuidado: esta accion es irreversible.

## Paso 10: Preparar commits para practicar amend
```bash
git add . && git commit -m "Agregar archivo de trabajo"
```
Hacemos un commit con los cambios actuales para practicar la modificacion de commits.

## Paso 11: Modificar el ultimo commit (amend)
```bash
git commit --amend -m "Agregar archivo WIP con trabajo en progreso"
```
El flag `--amend` modifica el ultimo commit en lugar de crear uno nuevo. Util para corregir el mensaje o agregar archivos olvidados. IMPORTANTE: nunca hagas amend de commits ya subidos al remoto.

## Paso 12: Agregar archivos al ultimo commit
```bash
echo "// TODO: completar" > todo.js && git add todo.js && git commit --amend --no-edit
```
El flag `--no-edit` mantiene el mensaje original. Asi puedes agregar archivos olvidados al ultimo commit sin cambiar el mensaje.

## Paso 13: Ver diferencias entre commits
```bash
git diff HEAD~1 HEAD
```
Compara el commit actual (HEAD) con el anterior (HEAD~1). La tilde seguida de un numero indica cuantos commits hacia atras. Muy util para revisar cambios recientes.

## Paso 14: Crear varios commits para practicar
```bash
echo "v1" > version.txt && git add . && git commit -m "Version 1" && echo "v2" > version.txt && git add . && git commit -m "Version 2"
```
Creamos una secuencia de commits para practicar navegacion y comparacion en el historial.

## Paso 15: Ver un commit especifico
```bash
git show HEAD~1
```
El comando `show` muestra los detalles de un commit: metadata, mensaje y diff. Puedes usar el hash del commit o referencias relativas como HEAD~1.

## Paso 16: Crear etiquetas (tags) simples
```bash
git tag v1.0.0
```
Las etiquetas marcan puntos importantes en el historial, tipicamente releases. Esta es una etiqueta "ligera" (lightweight) que simplemente apunta a un commit.

## Paso 17: Crear etiquetas anotadas
```bash
git tag -a v1.1.0 -m "Release version 1.1.0 con mejoras"
```
Las etiquetas anotadas (`-a`) almacenan informacion adicional: autor, fecha, mensaje. Son las recomendadas para releases porque son objetos completos en Git.

## Paso 18: Ver todas las etiquetas
```bash
git tag -l
```
Lista todas las etiquetas del repositorio. Puedes usar patrones como `git tag -l "v1.*"` para filtrar.

## Paso 19: Ver detalles de una etiqueta
```bash
git show v1.1.0
```
Muestra la informacion de la etiqueta anotada (autor, fecha, mensaje) junto con el commit al que apunta.

## Paso 20: Subir etiquetas al remoto
```bash
git push origin v1.1.0
```
Las etiquetas no se suben automaticamente con `push`. Debes subirlas explicitamente. Usa `git push origin --tags` para subir todas las etiquetas de una vez.
