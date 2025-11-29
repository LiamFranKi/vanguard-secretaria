#!/bin/bash

# Script para verificar puertos disponibles
# Uso: ./check-ports.sh

echo "🔍 Verificando puertos en uso..."
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar un puerto
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        local process=$(lsof -Pi :$port -sTCP:LISTEN | grep LISTEN | awk '{print $1, $2}' | head -1)
        echo -e "${RED}❌ Puerto $port ($service) está OCUPADO${NC}"
        echo "   Proceso: $process"
        return 1
    else
        echo -e "${GREEN}✅ Puerto $port ($service) está DISPONIBLE${NC}"
        return 0
    fi
}

# Verificar puertos comunes del sistema
echo "=== Puertos del Sistema Secretaria ==="
check_port 3000 "Frontend (Vite)"
check_port 5000 "Backend (Express)"
check_port 5432 "PostgreSQL"

echo ""
echo "=== Otros puertos comunes ==="
check_port 80 "HTTP"
check_port 443 "HTTPS"
check_port 22 "SSH"
check_port 3306 "MySQL"
check_port 8080 "Alternativa HTTP"

echo ""
echo "=== Todos los puertos en uso ==="
echo -e "${YELLOW}Comando: netstat -tulpn | grep LISTEN${NC}"
netstat -tulpn | grep LISTEN | head -20

echo ""
echo "=== Comando alternativo (ss) ==="
echo -e "${YELLOW}Comando: ss -tulpn | grep LISTEN${NC}"
ss -tulpn | grep LISTEN | head -20

echo ""
echo "💡 Si un puerto está ocupado, puedes:"
echo "   1. Cambiar el puerto en server/.env (PORT=XXXX)"
echo "   2. Detener el servicio que usa ese puerto"
echo "   3. Usar un puerto diferente"

