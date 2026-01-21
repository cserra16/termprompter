# Curso de Git - Parte 6: Flujos de Trabajo y Buenas Practicas

## Paso 1: Crear repositorio para simular flujos de trabajo
```bash
cd ~ && mkdir git-flujos && cd git-flujos && git init && echo "# Proyecto Demo" > README.md && git add . && git commit -m "Initial commit"
```
Creamos un repositorio limpio para simular diferentes flujos de trabajo usados en equipos profesionales.

## Paso 2: Configurar rama develop (Git Flow)
```bash
git branch develop
```
En Git Flow, `develop` es la rama de integracion donde se acumulan features antes de release. `main` solo contiene codigo en produccion.

## Paso 3: Crear una rama feature siguiendo Git Flow
```bash
git switch develop && git switch -c feature/login-system
```
Las ramas feature se crean desde develop y siguen el patron `feature/nombre-descriptivo`. Cada funcionalidad tiene su propia rama.

## Paso 4: Simular desarrollo de la feature
```bash
echo "<form>Login</form>" > login.html && git add . && git commit -m "feat: agregar formulario de login"
```
Desarrollamos la funcionalidad en su rama aislada. El prefijo `feat:` en el commit sigue Conventional Commits, un estandar de mensajes.

## Paso 5: Agregar mas commits a la feature
```bash
echo "function validateLogin() {}" > login.js && git add . && git commit -m "feat: agregar validacion de login"
```
Una feature puede tener multiples commits. Lo importante es que cada commit sea atomico y tenga un proposito claro.

## Paso 6: Completar y fusionar la feature
```bash
git switch develop && git merge --no-ff feature/login-system -m "Merge feature/login-system"
```
El flag `--no-ff` fuerza un merge commit aunque sea posible fast-forward. Esto mantiene el historial claro mostrando cuando se integro cada feature.

## Paso 7: Eliminar la rama feature
```bash
git branch -d feature/login-system
```
Una vez fusionada, eliminamos la rama feature. Mantener el repositorio limpio de ramas obsoletas es una buena practica.

## Paso 8: Crear rama release
```bash
git switch -c release/1.0.0
```
Las ramas release se crean desde develop cuando se prepara una nueva version. Solo se hacen correcciones menores y actualizaciones de version aqui.

## Paso 9: Preparar el release
```bash
echo "1.0.0" > VERSION && git add . && git commit -m "chore: preparar release 1.0.0"
```
Actualizamos archivos de version, documentacion final, etc. El prefijo `chore:` indica tareas de mantenimiento.

## Paso 10: Finalizar release - merge a main
```bash
git switch main && git merge --no-ff release/1.0.0 -m "Release 1.0.0"
```
El release se fusiona a main, que siempre contiene codigo en produccion. Cada merge a main deberia ser un release.

## Paso 11: Etiquetar el release
```bash
git tag -a v1.0.0 -m "Version 1.0.0"
```
Siempre etiquetamos los releases en main. Las etiquetas permiten referencias rapidas a versiones especificas.

## Paso 12: Fusionar release a develop
```bash
git switch develop && git merge --no-ff release/1.0.0 -m "Merge release/1.0.0 to develop" && git branch -d release/1.0.0
```
El release tambien se fusiona a develop para incluir cualquier correccion de ultimo momento. Luego eliminamos la rama release.

## Paso 13: Crear un hotfix
```bash
git switch main && git switch -c hotfix/1.0.1
```
Los hotfixes se crean desde main para corregir bugs criticos en produccion. Siguen el patron `hotfix/version`.

## Paso 14: Aplicar el hotfix
```bash
echo "// Bug corregido" >> login.js && git add . && git commit -m "fix: corregir validacion de login"
```
El prefijo `fix:` indica correccion de bugs. Hacemos el minimo cambio necesario para resolver el problema.

## Paso 15: Finalizar hotfix
```bash
git switch main && git merge --no-ff hotfix/1.0.1 -m "Hotfix 1.0.1" && git tag -a v1.0.1 -m "Hotfix 1.0.1"
```
El hotfix se fusiona a main y se etiqueta. Es un release menor solo con la correccion.

## Paso 16: Propagar hotfix a develop
```bash
git switch develop && git merge --no-ff hotfix/1.0.1 -m "Merge hotfix/1.0.1 to develop" && git branch -d hotfix/1.0.1
```
El hotfix tambien se fusiona a develop para que no se pierda en futuros desarrollos.

## Paso 17: Configurar gitignore global
```bash
git config --global core.excludesfile ~/.gitignore_global && echo -e "*.log\n.DS_Store\nnode_modules/\n.env" > ~/.gitignore_global
```
Configura patrones que siempre quieres ignorar en todos tus proyectos: archivos de sistema, logs, dependencias, credenciales.

## Paso 18: Ver gitignore efectivo
```bash
git check-ignore -v *.log
```
El comando `check-ignore` te dice si un archivo sera ignorado y por que regla. Util para depurar problemas con gitignore.

## Paso 19: Ver estadisticas del repositorio
```bash
git shortlog -sn
```
Muestra el numero de commits por autor. Util para ver la participacion en proyectos colaborativos.

## Paso 20: Verificar integridad del repositorio
```bash
git fsck
```
El comando `fsck` (file system check) verifica la integridad del repositorio. Detecta objetos corruptos o huerfanos. Usalo periodicamente en repositorios importantes.
