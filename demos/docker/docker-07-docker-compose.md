# Curso Docker - Módulo 7: Docker Compose

## Paso 1: Verificar instalación de Docker Compose
```bash
docker compose version
```
Verifica que Docker Compose está instalado. Docker Compose viene integrado en Docker Desktop y versiones recientes de Docker Engine.

## Paso 2: Crear directorio para proyecto
```bash
mkdir -p ~/compose-demo && cd ~/compose-demo
```
Crea un directorio de trabajo para los ejercicios de Docker Compose.

## Paso 3: Crear archivo docker-compose.yml básico
```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
EOF
```
Define un servicio web con nginx. Version especifica la sintaxis, services define los contenedores.

## Paso 4: Iniciar servicios con Compose
```bash
docker compose up -d
```
Levanta todos los servicios definidos en docker-compose.yml. -d ejecuta en modo detached (segundo plano).

## Paso 5: Verificar servicios en ejecución
```bash
docker compose ps
```
Lista los servicios de Compose en ejecución. Similar a "docker ps" pero solo para este proyecto.

## Paso 6: Ver logs de servicios
```bash
docker compose logs web
```
Muestra los logs del servicio "web". Útil para debugging.

## Paso 7: Detener servicios
```bash
docker compose down
```
Detiene y elimina contenedores, redes creadas por Compose. Los volúmenes se preservan a menos que uses -v.

## Paso 8: Crear app multi-contenedor (web + db)
```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  db:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: miapp
    volumes:
      - db-data:/var/lib/postgresql/data

  web:
    image: nginx:latest
    ports:
      - "8080:80"
    depends_on:
      - db

volumes:
  db-data:
EOF
```
Define dos servicios: db (PostgreSQL) y web (nginx). depends_on asegura que db inicie antes que web. Volumes crea un volumen persistente.

## Paso 9: Levantar stack completo
```bash
docker compose up -d
```
Compose crea automáticamente la red para que los servicios se comuniquen, crea el volumen, e inicia los contenedores en orden.

## Paso 10: Verificar red creada
```bash
docker network ls | grep compose-demo
```
Compose crea automáticamente una red para el proyecto. Los servicios pueden comunicarse usando sus nombres.

## Paso 11: Probar conectividad entre servicios
```bash
docker compose exec web ping -c 3 db
```
Desde el contenedor web, hace ping a "db" usando su nombre de servicio. Compose proporciona DNS automático.

## Paso 12: Escalar servicio web
```bash
docker compose up -d --scale web=3
```
Crea 3 instancias del servicio web. Útil para balanceo de carga y alta disponibilidad.

## Paso 13: Verificar servicios escalados
```bash
docker compose ps
```
Verás 3 contenedores web corriendo. Compose asigna nombres únicos automáticamente.

## Paso 14: Crear aplicación Python con Compose
```bash
cat > app.py << 'EOF'
from flask import Flask
import psycopg2
app = Flask(__name__)

@app.route('/')
def hello():
    return '¡App funcionando con Compose!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF
```
Crea una aplicación Flask simple que usaremos con Docker Compose.

## Paso 15: Crear requirements.txt
```bash
cat > requirements.txt << 'EOF'
flask==2.3.0
psycopg2-binary==2.9.6
EOF
```
Define las dependencias de Python: Flask para web y psycopg2 para conectar a PostgreSQL.

## Paso 16: Crear Dockerfile para la app
```bash
cat > Dockerfile << 'EOF'
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
CMD ["python", "app.py"]
EOF
```
Dockerfile para construir la imagen de nuestra aplicación Flask.

## Paso 17: Actualizar docker-compose.yml con build
```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  db:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: miapp
    volumes:
      - db-data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - db
    environment:
      DB_HOST: db

volumes:
  db-data:
EOF
```
Ahora "app" usa build en lugar de image. Compose construirá la imagen automáticamente desde el Dockerfile.

## Paso 18: Construir y levantar con build
```bash
docker compose up -d --build
```
--build fuerza la reconstrucción de imágenes antes de iniciar. Útil cuando cambias el código.

## Paso 19: Probar la aplicación
```bash
sleep 3 && curl http://localhost:5000
```
Accede a la aplicación Flask. Deberías ver "¡App funcionando con Compose!".

## Paso 20: Limpiar todo el proyecto
```bash
docker compose down -v && cd ~ && rm -rf ~/compose-demo
```
down -v elimina contenedores, redes Y volúmenes. Limpia completamente el proyecto.
