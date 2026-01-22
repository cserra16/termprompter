---
description: Cómo crear demos con contenedores Docker para TermPrompter
---

# Guía para Crear Demos con Contenedores Docker

Esta guía explica cómo crear demos interactivas que ejecutan comandos dentro de contenedores Docker para TermPrompter.

## Estructura General de un Archivo Demo

Los archivos de demo son archivos Markdown (`.md`) ubicados en `demos/<categoria>/`. Cada demo puede incluir:

1. **Frontmatter YAML** (opcional): Configuración del contenedor Docker
2. **Título principal**: Usando `# Título`
3. **Pasos**: Usando `## Paso N: Descripción` seguido de un bloque de código y notas

---

## Frontmatter YAML para Docker

Cuando la demo debe ejecutarse en un contenedor Docker, añade frontmatter YAML al inicio del archivo:

```yaml
---
docker:
  image: <imagen:tag>           # Requerido: Imagen de Docker Hub
  name: <nombre-contenedor>     # Requerido: Nombre único del contenedor
  env:                          # Opcional: Variables de entorno
    VARIABLE: valor
    OTRA_VARIABLE: otro_valor
  ports:                        # Opcional: Mapeo de puertos
    - "host:container"
  volumes:                      # Opcional: Volúmenes montados
    - "./local:/container"
  workdir: /path                # Opcional: Directorio de trabajo inicial
  shell:                        # Opcional: Shell a usar (personalizado)
    - comando
    - argumento1
    - argumento2
  autoRemove: true              # Opcional: Eliminar contenedor al parar (default: true)
---
```

### Campos del Frontmatter

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `image` | string | ✅ Sí | Imagen de Docker Hub (ej: `mariadb:12.1`, `nginx:alpine`) |
| `name` | string | ✅ Sí | Nombre único del contenedor (ej: `demo-mariadb`) |
| `env` | object | No | Variables de entorno en formato clave-valor |
| `ports` | array | No | Lista de puertos en formato `"host:container"` |
| `volumes` | array | No | Lista de volúmenes en formato `"host:container"` o `"host:container:mode"` |
| `workdir` | string | No | Directorio de trabajo dentro del contenedor (default: `/root`) |
| `shell` | array | No | Comando shell personalizado, cada argumento como elemento del array |
| `autoRemove` | boolean | No | Si eliminar el contenedor al detenerlo (default: `true`) |

---

## Formato de los Pasos

Cada paso de la demo sigue este formato:

```markdown
## Paso N: Título descriptivo del paso
```<tipo_lenguaje>
comando_a_ejecutar
```
Notas explicativas que aparecerán en la tarjeta del paso. Estas notas ayudan al presentador a entender qué hace el comando.
```

### Tipos de Bloques de Código Soportados

| Lenguaje | Uso |
|----------|-----|
| `bash` | Comandos de shell Linux/Unix |
| `sql` | Consultas SQL (MariaDB, MySQL, etc.) |
| `sh` | Shell genérico |

**Nota**: El lenguaje del bloque de código es informativo. TermPrompter envía el contenido directamente al terminal/contenedor.

---

## Ejemplos Completos

### Ejemplo 1: Demo de Base de Datos MariaDB

```markdown
---
docker:
  image: mariadb:12.1
  name: demo-mariadb
  env:
    MARIADB_ROOT_PASSWORD: demo123
    MARIADB_DATABASE: demodb
  ports:
    - "3307:3306"
  workdir: /
  shell:
    - bash
    - -c
    - "echo 'Esperando a que MariaDB inicie...'; until mariadb -u root -pdemo123 -e 'SELECT 1' >/dev/null 2>&1; do sleep 1; done; mariadb -u root -pdemo123"
---

# Curso MariaDB - Módulo 1: Introducción

## Paso 1: Verificar la versión del servidor
```sql
SELECT VERSION();
```
Obtenemos la versión del servidor MariaDB.

## Paso 2: Ver las bases de datos existentes
```sql
SHOW DATABASES;
```
Muestra todas las bases de datos disponibles en el servidor.
```

### Ejemplo 2: Demo sin Contenedor (Terminal Local)

Para demos que no requieren Docker, simplemente omite el frontmatter:

```markdown
# Curso Docker - Módulo 1: Introducción

## Paso 1: Verificar instalación de Docker
```bash
docker --version
```
Comprueba que Docker está instalado correctamente.

## Paso 2: Ver información del sistema Docker
```bash
docker info
```
Muestra información detallada sobre la instalación de Docker.
```

### Ejemplo 3: Demo con Servidor Web Nginx

```markdown
---
docker:
  image: nginx:alpine
  name: demo-nginx
  ports:
    - "8080:80"
  volumes:
    - "./html:/usr/share/nginx/html:ro"
  workdir: /usr/share/nginx/html
  shell:
    - /bin/sh
---

# Demo Nginx con Docker

## Paso 1: Ver contenido del directorio web
```bash
ls -la
```
Lista los archivos servidos por Nginx.
```

---

## Convenciones y Buenas Prácticas

### Nomenclatura de Archivos

```
demos/<categoria>/<categoria>-<numero>-<tema>.md
```

**Ejemplos**:
- `demos/docker/docker-01-introduccion.md`
- `demos/mariadb/mariadb-02-bases-datos-tablas.md`
- `demos/git/git-03-remoto.md`

### Estructura de Categorías

```
demos/
├── docker/          # Demos de Docker (sin contenedor, usa terminal local)
├── mariadb/         # Demos de MariaDB (con contenedor mariadb:*)
├── linux/           # Demos de Linux (puede ser local o con contenedor)
├── git/             # Demos de Git (terminal local)
└── <nueva-cat>/     # Nuevas categorías
```

### Límite de Pasos por Demo

- **Máximo recomendado**: 20-25 pasos por archivo
- Si la demo es más larga, dividirla en múltiples módulos

### Notas de los Pasos

- Deben ser **concisas pero informativas**
- Explican **qué hace el comando** y **por qué es importante**
- **No usar acentos ni caracteres especiales** en el frontmatter YAML
- En las notas Markdown sí se pueden usar acentos normalmente

---

## Casos de Uso del Campo `shell`

### Shell Bash Estándar
```yaml
shell:
  - /bin/bash
```

### Shell Interactivo con Configuración
```yaml
shell:
  - bash
  - -c
  - "source /etc/profile && bash"
```

### Cliente de Base de Datos con Auto-conexión
```yaml
shell:
  - bash
  - -c
  - "until mysql -u root -ppassword -e 'SELECT 1' >/dev/null 2>&1; do sleep 1; done; mysql -u root -ppassword"
```

### Python Interactivo
```yaml
shell:
  - python3
```

---

## Variables de Entorno Comunes por Imagen

### MariaDB / MySQL
```yaml
env:
  MARIADB_ROOT_PASSWORD: contraseña
  MARIADB_DATABASE: nombre_bd
  MARIADB_USER: usuario
  MARIADB_PASSWORD: contraseña_usuario
```

### PostgreSQL
```yaml
env:
  POSTGRES_PASSWORD: contraseña
  POSTGRES_DB: nombre_bd
  POSTGRES_USER: usuario
```

### Redis
```yaml
env:
  REDIS_PASSWORD: contraseña
```

### MongoDB
```yaml
env:
  MONGO_INITDB_ROOT_USERNAME: admin
  MONGO_INITDB_ROOT_PASSWORD: contraseña
  MONGO_INITDB_DATABASE: nombre_bd
```

---

## Proceso de Creación de una Nueva Demo

1. **Identificar la imagen Docker** necesaria en Docker Hub
2. **Planificar los pasos** de la demo (máx. 25 por archivo)
3. **Crear el archivo** en `demos/<categoria>/`
4. **Escribir el frontmatter** YAML con la configuración del contenedor
5. **Añadir el título** principal con `#`
6. **Escribir cada paso** con formato `## Paso N:` + código + notas
7. **Probar la demo** ejecutando TermPrompter

### Checklist de Verificación

- [ ] Imagen Docker válida y disponible en Docker Hub
- [ ] Nombre de contenedor único
- [ ] Variables de entorno correctas para la imagen
- [ ] Puertos mapeados si se necesita acceso externo
- [ ] Shell configurado correctamente para la imagen
- [ ] Pasos numerados secuencialmente desde 1
- [ ] Cada paso tiene comando y notas explicativas
- [ ] Máximo 25 pasos por archivo

---

## Solución de Problemas

### El contenedor no inicia
- Verificar que la imagen existe en Docker Hub
- Comprobar que las variables de entorno requeridas están definidas
- Revisar que Docker Desktop esté ejecutándose

### Los comandos SQL no funcionan
- Asegurar que el campo `shell` espera a que la BD esté lista
- Usar patrón de espera: `until ... do sleep 1; done`

### Error de puertos en uso
- Cambiar el puerto del host a uno disponible (ej: `3307:3306`)
- Usar `docker ps` para ver contenedores existentes
