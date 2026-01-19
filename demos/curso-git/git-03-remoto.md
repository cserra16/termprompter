# Curso de Git - Parte 3: Trabajo Remoto

## Paso 1: Entender los repositorios remotos
```bash
git remote
```
Un repositorio remoto es una version de tu proyecto alojada en Internet (GitHub, GitLab, Bitbucket, etc.). El comando `git remote` lista los remotos configurados. Si acabas de iniciar un repo local, esta lista estara vacia.

## Paso 2: Crear un nuevo repositorio para practicar
```bash
cd .. && mkdir repo-remoto && cd repo-remoto && git init
```
Creamos un nuevo repositorio limpio para practicar los comandos de trabajo remoto. En un escenario real, conectarias este repo con GitHub u otro servicio.

## Paso 3: Agregar un repositorio remoto
```bash
git remote add origin https://github.com/usuario/mi-proyecto.git
```
El comando `remote add` vincula tu repositorio local con uno remoto. `origin` es el nombre convencional para el remoto principal. La URL debe ser la de tu repositorio en GitHub/GitLab.

## Paso 4: Ver los remotos configurados con detalle
```bash
git remote -v
```
El flag `-v` (verbose) muestra las URLs configuradas para fetch (descargar) y push (subir). Es util para verificar que la configuracion es correcta.

## Paso 5: Ver informacion detallada del remoto
```bash
git remote show origin
```
Muestra informacion completa sobre el remoto: URL, ramas rastreadas, configuracion de push/pull, y el estado de las ramas locales respecto a las remotas.

## Paso 6: Crear contenido inicial
```bash
echo "# Proyecto de Ejemplo" > README.md && git add . && git commit -m "Commit inicial"
```
Creamos contenido basico para tener algo que subir al remoto. Todo repositorio deberia tener al menos un README.

## Paso 7: Renombrar la rama principal a main
```bash
git branch -M main
```
El flag `-M` fuerza el renombrado de la rama actual. Esto asegura que usamos `main` como nombre de rama principal, que es el estandar moderno en lugar de `master`.

## Paso 8: Subir cambios al remoto (push)
```bash
git push -u origin main
```
El comando `push` sube tus commits al repositorio remoto. El flag `-u` (upstream) establece la rama remota como predeterminada para futuros push/pull. Despues de esto, solo necesitas `git push`.

## Paso 9: Clonar un repositorio existente
```bash
cd .. && git clone https://github.com/octocat/Hello-World.git repo-clonado
```
El comando `clone` descarga un repositorio remoto completo, incluyendo todo el historial. Crea un directorio con el nombre del repo (o el que especifiques). Es la forma mas comun de obtener un proyecto.

## Paso 10: Explorar el repositorio clonado
```bash
cd repo-clonado && git remote -v && git branch -a
```
Al clonar, Git configura automaticamente el remoto `origin`. Tambien crea ramas de seguimiento (tracking branches) para las ramas remotas.

## Paso 11: Volver al repositorio de practica
```bash
cd ../repo-remoto
```
Volvemos a nuestro repositorio de practica para continuar aprendiendo comandos remotos.

## Paso 12: Descargar cambios sin fusionar (fetch)
```bash
git fetch origin
```
El comando `fetch` descarga los cambios del remoto pero NO los aplica a tu rama actual. Es seguro y te permite revisar los cambios antes de integrarlos. Actualiza las ramas de seguimiento remoto.

## Paso 13: Ver diferencias con el remoto
```bash
git log HEAD..origin/main --oneline
```
Despues de un fetch, puedes ver que commits estan en el remoto que no tienes localmente. Esta comparacion te ayuda a decidir si quieres integrar los cambios.

## Paso 14: Integrar cambios remotos (pull)
```bash
git pull origin main
```
El comando `pull` es equivalente a `fetch` + `merge`. Descarga los cambios remotos y los fusiona con tu rama actual. Puede generar conflictos si hay cambios incompatibles.

## Paso 15: Configurar pull para usar rebase
```bash
git config --global pull.rebase true
```
Esta configuracion hace que `git pull` use rebase en lugar de merge. Esto mantiene un historial mas limpio y lineal. Es una preferencia personal/de equipo.

## Paso 16: Crear una rama y subirla al remoto
```bash
git switch -c feature-nueva && echo "Nueva funcionalidad" > nueva.txt && git add . && git commit -m "Agregar nueva funcionalidad"
```
Creamos una nueva rama con cambios. Esta rama solo existe localmente hasta que la subamos al remoto.

## Paso 17: Subir la rama al remoto
```bash
git push -u origin feature-nueva
```
Subimos la nueva rama al remoto. El flag `-u` establece el tracking, permitiendo usar `git push` y `git pull` sin especificar el remoto y la rama.

## Paso 18: Ver ramas remotas
```bash
git branch -r
```
El flag `-r` muestra solo las ramas remotas (remote-tracking branches). Estas son referencias locales a las ramas del servidor remoto, actualizadas con `fetch`.

## Paso 19: Eliminar una rama remota
```bash
git push origin --delete feature-nueva
```
Elimina la rama del servidor remoto. La rama local permanece intacta. Util para limpiar ramas de features ya fusionadas.

## Paso 20: Cambiar la URL del remoto
```bash
git remote set-url origin https://github.com/usuario/nuevo-proyecto.git
```
Actualiza la URL del remoto sin eliminarlo y volverlo a agregar. Util cuando cambias el nombre del repositorio o migras a otro servicio.
