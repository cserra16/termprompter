# Curso Docker - Módulo 8: Proyecto Práctico Final

## Paso 1: Crear estructura del proyecto
```bash
mkdir -p ~/blog-project/{frontend,backend} && cd ~/blog-project
```
Crea un proyecto completo con frontend y backend. Este proyecto integrará todo lo aprendido en el curso.

## Paso 2: Crear backend API en Python
```bash
cat > backend/app.py << 'EOF'
from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import os

app = Flask(__name__)
CORS(app)

def get_db():
    return psycopg2.connect(
        host=os.getenv('DB_HOST', 'db'),
        database=os.getenv('DB_NAME', 'blog'),
        user=os.getenv('DB_USER', 'postgres'),
        password=os.getenv('DB_PASSWORD', 'secret')
    )

@app.route('/api/posts', methods=['GET'])
def get_posts():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT id, title, content FROM posts')
    posts = [{'id': row[0], 'title': row[1], 'content': row[2]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(posts)

@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.json
    conn = get_db()
    cur = conn.cursor()
    cur.execute('INSERT INTO posts (title, content) VALUES (%s, %s)', (data['title'], data['content']))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Post creado'}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF
```
API REST completa con Flask: obtiene y crea posts en PostgreSQL. Usa variables de entorno para configuración.

## Paso 3: Crear requirements del backend
```bash
cat > backend/requirements.txt << 'EOF'
flask==2.3.0
flask-cors==4.0.0
psycopg2-binary==2.9.6
EOF
```
Dependencias del backend: Flask para API, CORS para permitir peticiones desde frontend, psycopg2 para PostgreSQL.

## Paso 4: Crear Dockerfile del backend
```bash
cat > backend/Dockerfile << 'EOF'
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
EXPOSE 5000
CMD ["python", "app.py"]
EOF
```
Dockerfile optimizado para el backend: usa imagen slim, instala dependencias, expone puerto 5000.

## Paso 5: Crear frontend HTML
```bash
cat > frontend/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Blog Docker</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Blog con Docker</h1>
    <div id="posts"></div>
    <script src="app.js"></script>
</body>
</html>
EOF
```
Interfaz HTML simple para mostrar y crear posts del blog.

## Paso 6: Crear JavaScript del frontend
```bash
cat > frontend/app.js << 'EOF'
async function loadPosts() {
    const response = await fetch('http://localhost:5000/api/posts');
    const posts = await response.json();
    const container = document.getElementById('posts');
    container.innerHTML = posts.map(p =>
        `<div class="post"><h2>${p.title}</h2><p>${p.content}</p></div>`
    ).join('');
}
loadPosts();
EOF
```
JavaScript que carga posts desde la API y los muestra en el DOM.

## Paso 7: Crear CSS del frontend
```bash
cat > frontend/style.css << 'EOF'
body { font-family: Arial; max-width: 800px; margin: 50px auto; }
.post { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
h1 { color: #333; }
EOF
```
Estilos CSS simples para hacer el blog más presentable.

## Paso 8: Crear Dockerfile del frontend
```bash
cat > frontend/Dockerfile << 'EOF'
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
EXPOSE 80
EOF
```
Dockerfile para frontend: usa nginx alpine para servir archivos estáticos. Muy ligero y eficiente.

## Paso 9: Crear script de inicialización de BD
```bash
cat > init-db.sql << 'EOF'
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO posts (title, content) VALUES
    ('Bienvenido a Docker', 'Este blog está corriendo completamente en contenedores Docker'),
    ('Aprendiendo Compose', 'Docker Compose facilita orquestar múltiples contenedores');
EOF
```
Script SQL que crea la tabla posts e inserta datos de ejemplo.

## Paso 10: Crear docker-compose.yml completo
```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: blog
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: db
      DB_NAME: blog
      DB_PASSWORD: secret
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "8080:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres-data:
EOF
```
Compose completo: 3 servicios (db, backend, frontend), volúmenes persistentes, healthchecks, y restart policies.

## Paso 11: Construir todas las imágenes
```bash
docker compose build
```
Construye las imágenes del backend y frontend según sus Dockerfiles. La base de datos usa imagen oficial.

## Paso 12: Levantar todo el proyecto
```bash
docker compose up -d
```
Inicia todos los servicios en el orden correcto gracias a depends_on y healthcheck.

## Paso 13: Verificar estado de servicios
```bash
docker compose ps
```
Verifica que los 3 servicios estén corriendo (db, backend, frontend).

## Paso 14: Ver logs del backend
```bash
docker compose logs backend
```
Revisa logs del backend para confirmar que se conectó a la base de datos correctamente.

## Paso 15: Probar la API directamente
```bash
sleep 5 && curl http://localhost:5000/api/posts
```
Prueba el endpoint de la API. Deberías ver los posts en formato JSON.

## Paso 16: Verificar el frontend
```bash
curl http://localhost:8080 | head -10
```
Verifica que nginx está sirviendo el frontend correctamente.

## Paso 17: Ver uso de recursos del proyecto
```bash
docker stats --no-stream
```
Muestra CPU, memoria y uso de red de todos los contenedores. Útil para monitoreo.

## Paso 18: Crear backup de la base de datos
```bash
docker compose exec db pg_dump -U postgres blog > backup.sql
```
Exporta la base de datos a un archivo SQL. Importante para backups y migraciones.

## Paso 19: Ver volúmenes del proyecto
```bash
docker volume ls | grep blog-project
```
Lista los volúmenes creados por el proyecto. postgres-data contiene los datos persistentes.

## Paso 20: Limpiar proyecto completo
```bash
docker compose down -v && cd ~ && rm -rf ~/blog-project
```
Detiene servicios, elimina contenedores, redes, volúmenes y archivos. ¡Proyecto completado! Has creado una aplicación full-stack con Docker.
