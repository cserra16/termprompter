# Curso de Git - Parte 2: Trabajo con Ramas

## Paso 1: Entender las ramas - ver la rama actual
```bash
git branch
```
Las ramas en Git permiten desarrollar funcionalidades de forma aislada sin afectar el codigo principal. Este comando muestra todas las ramas locales. El asterisco (*) indica la rama actual. Por defecto, Git crea una rama llamada `main` o `master`.

## Paso 2: Crear una nueva rama
```bash
git branch feature-login
```
Crea una nueva rama llamada `feature-login`. Esta rama parte del commit actual y es una copia exacta de la rama en la que estamos. Sin embargo, aun no hemos cambiado a ella.

## Paso 3: Ver todas las ramas
```bash
git branch -a
```
El flag `-a` muestra todas las ramas, incluyendo las remotas (que veremos mas adelante). Las ramas locales aparecen primero, seguidas de las remotas con el prefijo `remotes/`.

## Paso 4: Cambiar a la nueva rama
```bash
git checkout feature-login
```
Cambiamos a la rama `feature-login`. Ahora todos los cambios que hagamos se quedaran en esta rama sin afectar a `main`. El comando `checkout` actualiza los archivos del directorio de trabajo.

## Paso 5: Crear y cambiar a una rama en un solo paso
```bash
git checkout -b feature-registro
```
El flag `-b` crea la rama y cambia a ella en un solo comando. Es equivalente a `git branch feature-registro` seguido de `git checkout feature-registro`. Es la forma mas comun de crear ramas.

## Paso 6: Usar el comando moderno switch
```bash
git switch feature-login
```
Desde Git 2.23, existe el comando `switch` especificamente para cambiar de rama. Es mas intuitivo que `checkout` (que tiene muchos usos). Volvemos a la rama feature-login.

## Paso 7: Crear rama con switch
```bash
git switch -c feature-contacto
```
El flag `-c` (create) en `switch` es equivalente a `-b` en `checkout`. Crea una nueva rama y cambia a ella. Es la forma recomendada en versiones modernas de Git.

## Paso 8: Hacer cambios en la rama
```bash
echo "<form>Login Form</form>" > login.html
```
Creamos un archivo nuevo en nuestra rama. Este cambio solo existira en la rama actual hasta que lo fusionemos con otra rama.

## Paso 9: Agregar y hacer commit en la rama
```bash
git add login.html && git commit -m "Agregar formulario de login"
```
Confirmamos los cambios en la rama actual. Este commit solo existe en `feature-contacto`. Si cambiaramos a `main`, no veriamos este archivo.

## Paso 10: Ver el historial con ramas
```bash
git log --oneline --graph --all
```
El flag `--all` muestra el historial de todas las ramas. Ahora puedes ver como las ramas divergen desde un punto comun. El grafico muestra la estructura de ramificacion.

## Paso 11: Volver a la rama principal
```bash
git switch main
```
Volvemos a la rama principal. Observa que el archivo `login.html` ya no esta visible porque solo existe en la rama `feature-contacto`.

## Paso 12: Verificar que el archivo no existe en main
```bash
ls -la
```
Confirmamos que `login.html` no aparece en el listado. Los cambios de la rama `feature-contacto` estan aislados. Esto es el poder de las ramas: desarrollo aislado.

## Paso 13: Fusionar una rama (merge)
```bash
git merge feature-contacto
```
El comando `merge` integra los cambios de `feature-contacto` en la rama actual (`main`). Git crea un "merge commit" si es necesario, o hace un "fast-forward" si es posible.

## Paso 14: Ver el resultado del merge
```bash
ls -la && git log --oneline --graph
```
Ahora `login.html` aparece en `main`. El historial muestra como las ramas se han unido. El merge ha integrado todo el trabajo de la rama feature.

## Paso 15: Eliminar una rama fusionada
```bash
git branch -d feature-contacto
```
Una vez fusionada, podemos eliminar la rama con `-d`. Git nos protege: si la rama tiene cambios sin fusionar, no la eliminara. Usa `-D` (mayuscula) para forzar la eliminacion.

## Paso 16: Crear una situacion de conflicto - paso 1
```bash
git switch -c rama-a && echo "Contenido de A" > conflicto.txt && git add . && git commit -m "Rama A: crear conflicto.txt"
```
Creamos una rama, un archivo con cierto contenido y hacemos commit. Esto preparara un escenario de conflicto.

## Paso 17: Crear conflicto - paso 2
```bash
git switch main && git switch -c rama-b && echo "Contenido de B" > conflicto.txt && git add . && git commit -m "Rama B: crear conflicto.txt"
```
Desde main, creamos otra rama con el mismo archivo pero contenido diferente. Ambas ramas modifican `conflicto.txt` de forma distinta.

## Paso 18: Intentar fusionar y ver el conflicto
```bash
git switch main && git merge rama-a && git merge rama-b
```
Primero fusionamos rama-a (sin problemas), luego intentamos rama-b. Git detecta que ambas ramas modificaron el mismo archivo de forma diferente y marca un conflicto.

## Paso 19: Ver el estado del conflicto
```bash
git status
```
Git nos indica que hay conflictos sin resolver. El archivo `conflicto.txt` aparece como "both modified". Debemos resolver el conflicto manualmente antes de continuar.

## Paso 20: Ver el contenido del archivo con conflicto
```bash
cat conflicto.txt
```
Git marca el conflicto con marcadores especiales: `<<<<<<<` HEAD (tu version), `=======` (separador), y `>>>>>>>` rama-b (version entrante). Debes editar el archivo, elegir que contenido mantener y eliminar los marcadores.
