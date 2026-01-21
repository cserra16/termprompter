# Curso Docker - Módulo 5: Redes en Docker

## Paso 1: Listar redes Docker
```bash
docker network ls
```
Muestra todas las redes Docker. Por defecto verás bridge, host y none. Bridge es la red predeterminada para contenedores.

## Paso 2: Inspeccionar red bridge predeterminada
```bash
docker network inspect bridge
```
Muestra detalles de la red bridge en JSON: subnet, gateway, contenedores conectados, opciones de configuración.

## Paso 3: Crear contenedor en red predeterminada
```bash
docker run -d --name web1 nginx
```
Crea un contenedor nginx en la red bridge predeterminada. Tendrá conectividad de red básica.

## Paso 4: Ver IP del contenedor
```bash
docker inspect web1 | grep IPAddress
```
Muestra la dirección IP asignada al contenedor en la red bridge.

## Paso 5: Crear red personalizada
```bash
docker network create mi-red
```
Crea una red bridge personalizada. Las redes personalizadas ofrecen mejor aislamiento y resolución DNS automática.

## Paso 6: Inspeccionar red personalizada
```bash
docker network inspect mi-red
```
Muestra la configuración de tu red personalizada, incluyendo subnet y gateway asignados automáticamente.

## Paso 7: Crear contenedor en red personalizada
```bash
docker run -d --name app1 --network mi-red nginx
```
Conecta el contenedor app1 a la red personalizada mi-red en lugar de la red bridge predeterminada.

## Paso 8: Crear segundo contenedor en la misma red
```bash
docker run -d --name app2 --network mi-red nginx
```
Los contenedores en la misma red personalizada pueden comunicarse usando nombres de contenedor.

## Paso 9: Probar resolución DNS entre contenedores
```bash
docker exec app1 ping -c 3 app2
```
En redes personalizadas, Docker proporciona DNS automático. app1 puede hacer ping a app2 usando su nombre.

## Paso 10: Crear contenedor con múltiples redes
```bash
docker run -d --name puente nginx
```
Primero creamos un contenedor en la red predeterminada.

## Paso 11: Conectar contenedor a red adicional
```bash
docker network connect mi-red puente
```
Conecta el contenedor "puente" a mi-red. Ahora tiene interfaces en dos redes diferentes.

## Paso 12: Verificar múltiples conexiones
```bash
docker inspect puente | grep -A 10 "Networks"
```
El contenedor "puente" ahora aparece en bridge y mi-red, actuando como gateway entre ambas redes.

## Paso 13: Probar conectividad entre redes
```bash
docker exec app1 ping -c 3 puente
```
app1 (en mi-red) puede comunicarse con puente porque está en la misma red.

## Paso 14: Desconectar contenedor de red
```bash
docker network disconnect mi-red puente
```
Desconecta el contenedor "puente" de mi-red. Ya solo está en la red bridge predeterminada.

## Paso 15: Crear red con subnet personalizada
```bash
docker network create --subnet 172.20.0.0/16 mi-red-custom
```
Crea una red con un rango de IPs específico. Útil cuando necesitas control sobre las direcciones IP.

## Paso 16: Asignar IP estática a contenedor
```bash
docker run -d --name app-estatica --network mi-red-custom --ip 172.20.0.100 nginx
```
Asigna una IP fija al contenedor. Solo funciona en redes personalizadas (no en bridge predeterminada).

## Paso 17: Verificar IP estática
```bash
docker inspect app-estatica | grep IPAddress
```
Confirma que el contenedor tiene la IP 172.20.0.100 que asignamos.

## Paso 18: Usar red host (sin aislamiento)
```bash
docker run -d --name nginx-host --network host nginx
```
Con --network host, el contenedor usa directamente la red del host. No hay aislamiento de red.

## Paso 19: Verificar red host
```bash
curl http://localhost:80 2>/dev/null | head -5
```
Nginx está accesible en el puerto 80 del host directamente, sin mapeo de puertos. No recomendado para producción.

## Paso 20: Limpiar redes y contenedores
```bash
docker stop $(docker ps -aq) 2>/dev/null && docker rm $(docker ps -aq) 2>/dev/null && docker network rm mi-red mi-red-custom
```
Detiene y elimina todos los contenedores, luego elimina las redes personalizadas. Las redes predeterminadas no se pueden eliminar.
