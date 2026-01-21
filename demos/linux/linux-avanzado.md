# Curso de Linux - Comandos Avanzados

## Paso 1: Crear archivo de ejemplo
```bash
cat > usuarios.txt << 'EOF'
Juan,25,Desarrollador
María,30,Diseñadora
Pedro,28,Analista
Ana,35,Gerente
Luis,22,Desarrollador
EOF
```
Creamos un archivo CSV para practicar comandos de procesamiento de texto.

## Paso 2: Buscar patrón con grep
```bash
grep "Desarrollador" usuarios.txt
```
El comando `grep` busca líneas que coinciden con un patrón. Aquí buscamos la palabra "Desarrollador".

## Paso 3: Búsqueda insensible a mayúsculas
```bash
grep -i "desarrollador" usuarios.txt
```
La opción `-i` hace la búsqueda case-insensitive (ignora mayúsculas/minúsculas).

## Paso 4: Contar coincidencias
```bash
grep -c "Desarrollador" usuarios.txt
```
La opción `-c` cuenta cuántas líneas contienen el patrón.

## Paso 5: Mostrar número de línea
```bash
grep -n "María" usuarios.txt
```
La opción `-n` muestra el número de línea donde se encontró el patrón.

## Paso 6: Usar expresiones regulares
```bash
grep -E "^[A-M]" usuarios.txt
```
La opción `-E` activa expresiones regulares extendidas. `^[A-M]` busca líneas que empiecen con letras A-M.

## Paso 7: Extraer columnas con cut
```bash
cut -d',' -f1 usuarios.txt
```
El comando `cut` extrae campos. `-d','` define el delimitador, `-f1` selecciona el primer campo.

## Paso 8: Extraer múltiples columnas
```bash
cut -d',' -f1,3 usuarios.txt
```
Podemos extraer múltiples campos separándolos con comas.

## Paso 9: Ordenar líneas alfabéticamente
```bash
sort usuarios.txt
```
El comando `sort` ordena las líneas alfabéticamente.

## Paso 10: Ordenar por columna específica
```bash
sort -t',' -k2 -n usuarios.txt
```
`-t','` define delimitador, `-k2` ordena por segunda columna, `-n` ordena numéricamente.

## Paso 11: Ordenar en reversa
```bash
sort -t',' -k2 -n -r usuarios.txt
```
La opción `-r` invierte el orden (de mayor a menor).

## Paso 12: Eliminar líneas duplicadas
```bash
cut -d',' -f3 usuarios.txt | sort | uniq
```
El comando `uniq` elimina líneas duplicadas consecutivas (por eso usamos sort antes).

## Paso 13: Contar ocurrencias únicas
```bash
cut -d',' -f3 usuarios.txt | sort | uniq -c
```
La opción `-c` muestra el conteo de cada línea única.

## Paso 14: Reemplazar texto con sed
```bash
sed 's/Desarrollador/Developer/g' usuarios.txt
```
El comando `sed` procesa texto. `s/patrón/reemplazo/g` sustituye todas las ocurrencias.

## Paso 15: Modificar archivo in-place
```bash
sed -i 's/Desarrollador/Developer/g' usuarios.txt
```
La opción `-i` modifica el archivo directamente en lugar de mostrar en pantalla.

## Paso 16: Procesar con awk
```bash
awk -F',' '{print $1, $2}' usuarios.txt
```
`awk` es un lenguaje de procesamiento de texto. `-F','` define delimitador, `$1` y `$2` son campos.

## Paso 17: Filtrar con awk
```bash
awk -F',' '$2 > 25 {print $1, "tiene", $2, "años"}' usuarios.txt
```
awk puede filtrar y formatear. Aquí mostramos solo personas mayores de 25 años.

## Paso 18: Sumar valores con awk
```bash
awk -F',' '{sum += $2} END {print "Edad promedio:", sum/NR}' usuarios.txt
```
`NR` es el número de registros. Calculamos el promedio de la segunda columna.

## Paso 19: Pipeline complejo
```bash
cat usuarios.txt | grep "Developer" | cut -d',' -f1,2 | sort -t',' -k2 -n
```
Los pipes `|` encadenan comandos. La salida de uno es entrada del siguiente.

## Paso 20: Monitorear archivo en tiempo real
```bash
tail -f usuarios.txt
```
El comando `tail -f` sigue el archivo mostrando nuevas líneas conforme se añaden. Útil para logs. Presiona Ctrl+C para salir.
