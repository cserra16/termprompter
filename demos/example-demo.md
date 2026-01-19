# Demo de Git Básico

## Paso 1: Paso 1
```bash
git init
```

## Paso 2: Paso 2
```bash
echo "Nuevo fichero" > new.txt
```
Crea un nuevo repositorio Git en el directorio actual. Esto genera una carpeta oculta `.git` que contiene toda la información del repositorio.

## Paso 3: Paso 3
```bash
git status
```
Añade aquí las notas del paso

## Paso 4: Paso 4
```bash
git add .
```
Muestra el estado actual del repositorio: archivos modificados, archivos en staging, y rama actual.

## Paso 5: Paso 5
```bash
git commit -m "Mensaje descriptivo del commit"
```
Añade todos los archivos modificados al área de staging. Usa `git add archivo.txt` para añadir archivos específicos.

## Paso 6: Paso 6
```bash
git log --oneline
```
Guarda los cambios del staging en el historial del repositorio. El mensaje debe ser claro y descriptivo.

## Paso 7: Paso 7
```bash
git checkout -b feature/nueva-funcionalidad
```
Muestra el historial de commits en formato compacto. Sin `--oneline` muestra información completa de cada commit.

## Paso 8: Paso 8
```bash
git branch -a
```
Crea una nueva rama y cambia a ella automáticamente. Las ramas permiten trabajar en features aisladas.

## Paso 9: Paso 9
```bash
git checkout main
```
Lista todas las ramas locales y remotas. La rama actual aparece marcada con un asterisco (*).

## Paso 10: Paso 10
```bash
git merge feature/nueva-funcionalidad
```
Cambia a la rama principal. En repositorios antiguos puede ser `master` en lugar de `main`.

## Paso 11: Paso 11
```bash
git push origin main
```
Fusiona los cambios de la rama especificada en la rama actual. Puede generar conflictos que hay que resolver manualmente.

