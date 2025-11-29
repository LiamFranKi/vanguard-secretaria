# 🚀 Comandos Rápidos para Instalación en VPS

## 📋 Copia y Pega estos comandos en PuTTY (uno por uno)

### 1️⃣ Verificar Puertos Disponibles
```bash
netstat -tulpn | grep LISTEN
lsof -i :3000
lsof -i :5000
lsof -i :5432
```

### 2️⃣ Crear Carpeta y Clonar Repositorio
```bash
cd /home
mkdir -p secretaria
cd secretaria
git clone https://github.com/LiamFranKi/vanguard-secretaria.git .
```

### 3️⃣ Verificar Node.js (instalar si falta)
```bash
node -v
npm -v
# Si no está instalado:
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
```

### 4️⃣ Verificar PostgreSQL (instalar si falta)
```bash
psql --version
# Si no está instalado:
apt-get update
apt-get install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql
```

### 5️⃣ Crear Base de Datos
```bash
su - postgres
psql
```
**Dentro de psql, ejecuta:**
```sql
CREATE DATABASE secretaria_pro;
CREATE USER secretaria_user WITH PASSWORD 'CambiaEstaPassword123!';
ALTER ROLE secretaria_user SET client_encoding TO 'utf8';
ALTER ROLE secretaria_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE secretaria_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE secretaria_pro TO secretaria_user;
\q
```
**Luego sal:**
```bash
exit
```

### 6️⃣ Instalar Dependencias Backend
```bash
cd /home/secretaria/server
npm install
```

### 7️⃣ Instalar Dependencias Frontend
```bash
cd /home/secretaria
npm install
```

### 8️⃣ Configurar Variables de Entorno
```bash
cd /home/secretaria/server
cp env.example .env
nano .env
```
**Edita y guarda (Ctrl+O, Enter, Ctrl+X)**

### 9️⃣ Inicializar Base de Datos
```bash
cd /home/secretaria/server
npm run init-db
npm run create-users
npm run init-config
```

### 🔟 Compilar Frontend
```bash
cd /home/secretaria
npm run build
```

### 1️⃣1️⃣ Instalar PM2
```bash
npm install -g pm2
```

### 1️⃣2️⃣ Iniciar Backend con PM2
```bash
cd /home/secretaria/server
pm2 start server.js --name secretaria-backend
pm2 save
pm2 startup
# Copia y ejecuta el comando que te muestre
```

### 1️⃣3️⃣ Configurar Nginx
```bash
apt-get install -y nginx
nano /etc/nginx/sites-available/secretaria
```
**Pega la configuración de Nginx (ver INSTALACION_VPS.md)**
```bash
ln -s /etc/nginx/sites-available/secretaria /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 1️⃣4️⃣ Verificar Todo
```bash
pm2 status
pm2 logs secretaria-backend --lines 20
curl http://localhost:5000/health
systemctl status nginx
```

---

## 🔄 Comandos de Actualización (cuando hagas cambios)

```bash
cd /home/secretaria
git pull origin main
cd server
npm install
cd ..
npm install
npm run build
pm2 restart secretaria-backend
```

---

## 🛠️ Comandos de Mantenimiento

```bash
# Ver logs
pm2 logs secretaria-backend

# Reiniciar
pm2 restart secretaria-backend

# Detener
pm2 stop secretaria-backend

# Ver estado
pm2 status
pm2 monit
```

