# Demo de Git Básico

## Paso 1: Inicializar un repositorio
```bash
git init
```
Crea un nuevo repositorio Git en el directorio actual. Esto genera una carpeta oculta `.git` que contiene toda la información del repositorio.

## Paso 2: Ver el estado del repositorio
```bash
git status
```
Muestra el estado actual del repositorio: archivos modificados, archivos en staging, y rama actual.

## Paso 3: Añadir archivos al staging
```bash
git add .
```
Añade todos los archivos modificados al área de staging. Usa `git add archivo.txt` para añadir archivos específicos.

## Paso 4: Crear un commit
```bash
git commit -m "Mensaje descriptivo del commit"
```
Guarda los cambios del staging en el historial del repositorio. El mensaje debe ser claro y descriptivo.

## Paso 5: Ver el historial de commits
```bash
git log --oneline
```
Muestra el historial de commits en formato compacto. Sin `--oneline` muestra información completa de cada commit.

## Paso 6: Crear una nueva rama
```bash
git checkout -b feature/nueva-funcionalidad
```
Crea una nueva rama y cambia a ella automáticamente. Las ramas permiten trabajar en features aisladas.

## Paso 7: Ver todas las ramas
```bash
git branch -a
```
Lista todas las ramas locales y remotas. La rama actual aparece marcada con un asterisco (*).

## Paso 8: Volver a la rama principal
```bash
git checkout main
```
Cambia a la rama principal. En repositorios antiguos puede ser `master` en lugar de `main`.

## Paso 9: Fusionar ramas
```bash
git merge feature/nueva-funcionalidad
```
Fusiona los cambios de la rama especificada en la rama actual. Puede generar conflictos que hay que resolver manualmente.

## Paso 10: Subir cambios al remoto
```bash
git push origin main
```
Envía los commits locales al repositorio remoto. La primera vez puede necesitar `git push -u origin main` para establecer el upstream.
