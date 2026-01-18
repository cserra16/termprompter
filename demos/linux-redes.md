# Curso de Linux - Comandos de Red

## Paso 1: Ver configuración de red
```bash
ip addr show
```
El comando `ip addr` muestra todas las interfaces de red y sus direcciones IP asignadas.

## Paso 2: Ver solo IPv4
```bash
ip -4 addr
```
La opción `-4` filtra solo direcciones IPv4, omitiendo IPv6.

## Paso 3: Ver interfaces de red activas
```bash
ip link show
```
El comando `ip link` muestra el estado de las interfaces de red (UP/DOWN).

## Paso 4: Ver tabla de enrutamiento
```bash
ip route show
```
Muestra la tabla de enrutamiento del sistema, incluyendo la puerta de enlace predeterminada.

## Paso 5: Verificar conectividad básica
```bash
ping -c 4 8.8.8.8
```
El comando `ping` envía paquetes ICMP para verificar conectividad. `-c 4` limita a 4 paquetes.

## Paso 6: Hacer ping a un dominio
```bash
ping -c 3 google.com
```
Ping también resuelve nombres de dominio a direcciones IP antes de enviar paquetes.

## Paso 7: Resolver nombre de dominio
```bash
nslookup google.com
```
El comando `nslookup` consulta servidores DNS para resolver nombres de dominio a IPs.

## Paso 8: Consulta DNS detallada
```bash
dig google.com
```
`dig` proporciona información más detallada sobre consultas DNS que nslookup.

## Paso 9: Consulta DNS simple
```bash
dig google.com +short
```
La opción `+short` muestra solo la respuesta IP sin información adicional.

## Paso 10: Ver hostname del sistema
```bash
hostname
```
Muestra el nombre de host configurado para la máquina.

## Paso 11: Ver FQDN (nombre completo)
```bash
hostname -f
```
La opción `-f` muestra el nombre de dominio completamente calificado (FQDN).

## Paso 12: Ver puertos en escucha
```bash
ss -tuln
```
El comando `ss` (socket statistics) muestra conexiones de red. `-t` TCP, `-u` UDP, `-l` listening, `-n` numérico.

## Paso 13: Ver conexiones establecidas
```bash
ss -tunp
```
Sin `-l` muestra conexiones establecidas. `-p` muestra el proceso asociado.

## Paso 14: Descargar archivo desde internet
```bash
curl -O https://raw.githubusercontent.com/github/gitignore/main/Python.gitignore
```
El comando `curl` descarga archivos. `-O` guarda con el nombre original del archivo.

## Paso 15: Ver contenido de URL
```bash
curl https://httpbin.org/get
```
Sin `-O`, curl muestra el contenido en la terminal, útil para APIs.

## Paso 16: Descarga con wget
```bash
wget https://httpbin.org/robots.txt
```
`wget` es otra herramienta de descarga, automáticamente guarda archivos.

## Paso 17: Ver conexiones de red activas
```bash
netstat -tuln
```
`netstat` muestra conexiones de red (similar a ss). Puede no estar instalado en sistemas modernos.

## Paso 18: Trazar ruta a un host
```bash
traceroute google.com
```
El comando `traceroute` muestra la ruta que toman los paquetes hasta el destino.

## Paso 19: Consultar información WHOIS
```bash
whois google.com
```
`whois` consulta información de registro de dominios y direcciones IP.

## Paso 20: Ver estadísticas de interfaz
```bash
ip -s link
```
La opción `-s` muestra estadísticas de paquetes transmitidos/recibidos por cada interfaz.
