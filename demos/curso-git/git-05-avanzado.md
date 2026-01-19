# Curso de Git - Parte 5: Tecnicas Avanzadas

## Paso 1: Preparar repositorio para tecnicas avanzadas
```bash
cd ~ && mkdir git-avanzado && cd git-avanzado && git init && echo "Base" > archivo.txt && git add . && git commit -m "Commit inicial"
```
Creamos un repositorio limpio para practicar tecnicas avanzadas de Git que requieren un historial controlado.

## Paso 2: Crear historial para practicar rebase
```bash
for i in 1 2 3; do echo "Commit $i" >> archivo.txt && git commit -am "Commit $i"; done
```
Generamos varios commits en secuencia para tener material con el que practicar rebase y otras operaciones de historial.

## Paso 3: Crear una rama con commits propios
```bash
git switch -c feature-x && echo "Feature X" > feature.txt && git add . && git commit -m "Implementar feature X"
```
Creamos una rama con su propio commit, simulando desarrollo paralelo que luego querremos integrar.

## Paso 4: Volver a main y agregar mas commits
```bash
git switch main && echo "Mas trabajo en main" >> archivo.txt && git commit -am "Trabajo adicional en main"
```
Agregamos commits a main mientras feature-x existe, creando una divergencia tipica en desarrollo real.

## Paso 5: Ver la divergencia de ramas
```bash
git log --oneline --graph --all
```
Observamos como las ramas han divergido. Feature-x esta basada en un commit antiguo de main. El rebase nos ayudara a "mover" la rama.

## Paso 6: Hacer rebase de feature sobre main
```bash
git switch feature-x && git rebase main
```
El rebase "replanta" los commits de feature-x sobre la punta de main. Es como si hubieras empezado a trabajar desde el ultimo commit de main. Crea un historial mas limpio que merge.

## Paso 7: Ver el resultado del rebase
```bash
git log --oneline --graph --all
```
Ahora feature-x esta adelante de main en linea recta. No hay bifurcacion en el grafico. El historial es lineal y facil de seguir.

## Paso 8: Entender cherry-pick
```bash
git switch main && git switch -c otra-rama && echo "Hotfix urgente" > hotfix.txt && git add . && git commit -m "Hotfix: corregir bug critico"
```
Creamos una rama con un commit que queremos aplicar selectivamente a otra rama sin hacer merge completo.

## Paso 9: Obtener el hash del commit
```bash
git log --oneline -1
```
Guardamos el hash del commit que queremos aplicar con cherry-pick. Lo necesitaremos para el siguiente paso.

## Paso 10: Aplicar commit selectivo con cherry-pick
```bash
git switch main && git cherry-pick $(git rev-parse otra-rama)
```
Cherry-pick aplica un commit especifico a la rama actual, creando un nuevo commit con los mismos cambios. Util para aplicar hotfixes o commits especificos sin merge completo.

## Paso 11: Entender el reflog
```bash
git reflog
```
El reflog es el "registro de seguridad" de Git. Guarda un historial de todas las operaciones que movieron HEAD (commits, checkouts, rebases, etc.). Es tu salvavidas cuando algo sale mal.

## Paso 12: Simular un error - reset hard
```bash
echo "Trabajo importante" > importante.txt && git add . && git commit -m "Trabajo muy importante" && git reset --hard HEAD~1
```
Simulamos un error comun: hacer reset hard y "perder" un commit. El archivo y el commit parecen haber desaparecido.

## Paso 13: Recuperar el commit perdido con reflog
```bash
git reflog | head -5
```
El reflog aun tiene referencia al commit "perdido". Buscamos el hash del commit que queremos recuperar.

## Paso 14: Restaurar el commit
```bash
git reset --hard HEAD@{1}
```
Usamos la referencia del reflog para restaurar el commit. Git no borra realmente nada hasta que el garbage collector limpia commits huerfanos (generalmente 30 dias).

## Paso 15: Crear alias para comandos frecuentes
```bash
git config --global alias.st status
```
Los alias te permiten crear atajos para comandos largos. Ahora puedes usar `git st` en lugar de `git status`.

## Paso 16: Crear alias complejos
```bash
git config --global alias.lg "log --oneline --graph --all --decorate"
```
Puedes crear alias para comandos con multiples flags. Este alias `git lg` muestra un historial grafico bonito.

## Paso 17: Probar el alias creado
```bash
git lg
```
Ejecutamos el alias que acabamos de crear. Es mucho mas facil de recordar que el comando completo.

## Paso 18: Ver todos los alias configurados
```bash
git config --global --get-regexp alias
```
Lista todos los alias que has configurado. Util para recordar que atajos tienes disponibles.

## Paso 19: Buscar en el historial con log
```bash
git log --grep="Commit" --oneline
```
El flag `--grep` busca en los mensajes de commit. Muy util para encontrar cuando se hizo un cambio especifico.

## Paso 20: Buscar cambios en el codigo con log
```bash
git log -S "Feature" --oneline
```
El flag `-S` (pickaxe) busca commits que agregaron o eliminaron una cadena de texto en el codigo. Ayuda a encontrar cuando se introdujo un cambio.
