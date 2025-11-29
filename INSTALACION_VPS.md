# Guía de Instalación en VPS Hostinger

## 📋 Información del VPS
- **IP:** 72.60.172.101
- **Puerto SSH:** 22
- **Usuario:** root
- **Carpeta destino:** `/secretaria` (o la ruta que uses en tu VPS)

---

## 🔍 PASO 1: Conectarse al VPS con PuTTY

1. Abre **PuTTY**
2. Configura la conexión:
   - **Host Name:** `72.60.172.101`
   - **Port:** `22`
   - **Connection Type:** `SSH`
3. Haz clic en **Open**
4. Ingresa las credenciales:
   - **Login as:** `root`
   - **Password:** `Vanguard2025@&` (no se mostrará mientras escribes)

---

## 🔍 PASO 2: Verificar Puertos Disponibles

**IMPORTANTE:** Antes de instalar, verifica qué puertos están en uso:

```bash
# Ver puertos en uso
netstat -tulpn | grep LISTEN

# O con ss (más moderno)
ss -tulpn | grep LISTEN

# Verificar puertos específicos comunes
lsof -i :3000  # Frontend (Vite)
lsof -i :5000  # Backend (Express)
lsof -i :5432  # PostgreSQL
```

**Puertos que usa nuestro sistema:**
- **3000:** Frontend (Vite dev server)
- **5000:** Backend API (Express)
- **5432:** PostgreSQL (si instalas localmente)

**Si algún puerto está ocupado, elige uno diferente y actualiza las variables de entorno.**

---

## 📁 PASO 3: Navegar y Crear la Carpeta

```bash
# Ir al directorio donde tienes tus otros sistemas
# (ajusta la ruta según tu estructura)
cd /home  # o donde tengas tus otros proyectos

# Crear carpeta para el sistema
mkdir -p secretaria
cd secretaria

# Verificar que estás en la carpeta correcta
pwd
```

---

## 📥 PASO 4: Clonar el Repositorio de GitHub

```bash
# Clonar el repositorio
git clone https://github.com/LiamFranKi/vanguard-secretaria.git .

# Verificar que se clonó correctamente
ls -la
```

---

## 🛠️ PASO 5: Verificar e Instalar Node.js y npm

```bash
# Verificar versión de Node.js (necesitas Node 18+)
node -v

# Verificar npm
npm -v

# Si no tienes Node.js instalado:
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verificar instalación
node -v
npm -v
```

---

## 🗄️ PASO 6: Verificar/Instalar PostgreSQL

```bash
# Verificar si PostgreSQL está instalado
psql --version

# Si no está instalado:
apt-get update
apt-get install -y postgresql postgresql-contrib

# Iniciar PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Verificar que está corriendo
systemctl status postgresql
```

---

## 🔐 PASO 7: Configurar Base de Datos

```bash
# Cambiar al usuario postgres
su - postgres

# Crear base de datos y usuario
psql

# Dentro de psql, ejecutar:
CREATE DATABASE secretaria_pro;
CREATE USER secretaria_user WITH PASSWORD 'tu_password_seguro_aqui';
ALTER ROLE secretaria_user SET client_encoding TO 'utf8';
ALTER ROLE secretaria_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE secretaria_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE secretaria_pro TO secretaria_user;
\q

# Salir del usuario postgres
exit
```

---

## 📦 PASO 8: Instalar Dependencias del Backend

```bash
# Asegúrate de estar en la carpeta secretaria
cd /home/secretaria  # o la ruta que uses

# Ir a la carpeta del servidor
cd server

# Instalar dependencias
npm install

# Verificar que se instalaron correctamente
ls node_modules
```

---

## 📦 PASO 9: Instalar Dependencias del Frontend

```bash
# Volver a la raíz del proyecto
cd ..

# Instalar dependencias del frontend
npm install

# Verificar instalación
ls node_modules
```

---

## ⚙️ PASO 10: Configurar Variables de Entorno

```bash
# Ir a la carpeta del servidor
cd server

# Copiar el archivo de ejemplo
cp env.example .env

# Editar el archivo .env
nano .env
```

**Configura el archivo `.env` con estos valores (ajusta según tu configuración):**

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=secretaria_pro
DB_USER=secretaria_user
DB_PASSWORD=tu_password_seguro_aqui

# JWT
JWT_SECRET=12f0d802d8d608069132506f49d0a50f45c0e38c9e74d02e7976d8ab9bd032cbdf47765988779a7f683ee2195ea020484d819a573d0f9468972870c8dd29f195
JWT_EXPIRES_IN=7d

# Puerto del Backend (VERIFICA QUE NO ESTÉ EN USO)
PORT=5000
NODE_ENV=production

# Gemini AI (opcional, puedes dejarlo vacío por ahora)
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash

# Email SMTP (configura con tus credenciales)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
SMTP_FROM=SecretariaPro <noreply@secretariapro.com>

# VAPID para Push Notifications (generar después)
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:tu_email@example.com

# URL del Frontend (ajusta con tu dominio/subdominio)
FRONTEND_URL=http://secretaria.tudominio.com

# Configuración del Sistema
SYSTEM_NAME=SecretariaPro
PRIMARY_COLOR=#7c3aed
SECONDARY_COLOR=#a855f7
```

**Para guardar en nano:** `Ctrl + O`, luego `Enter`, luego `Ctrl + X`

---

## 🗄️ PASO 11: Inicializar la Base de Datos

```bash
# Asegúrate de estar en la carpeta server
cd /home/secretaria/server

# Inicializar la base de datos
npm run init-db

# Crear usuarios iniciales
npm run create-users

# Inicializar configuración
npm run init-config
```

---

## 🔑 PASO 12: Generar Claves VAPID (Opcional)

```bash
# Generar claves VAPID para push notifications
npm run generate-vapid

# Copia las claves generadas y agrégalas al archivo .env
nano .env
```

---

## 🏗️ PASO 13: Compilar el Frontend

```bash
# Volver a la raíz del proyecto
cd /home/secretaria

# Compilar el frontend para producción
npm run build

# Verificar que se creó la carpeta dist
ls -la dist
```

---

## 🚀 PASO 14: Instalar PM2 (Gestor de Procesos)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Verificar instalación
pm2 --version
```

---

## 🚀 PASO 15: Configurar PM2 para el Backend

```bash
# Ir a la carpeta del servidor
cd /home/secretaria/server

# Iniciar el servidor con PM2
pm2 start server.js --name secretaria-backend

# Verificar que está corriendo
pm2 status

# Ver logs
pm2 logs secretaria-backend

# Guardar configuración de PM2
pm2 save

# Configurar PM2 para iniciar al arrancar el servidor
pm2 startup
# (Sigue las instrucciones que te muestre)
```

---

## 🌐 PASO 16: Configurar Nginx (Proxy Reverso)

```bash
# Instalar Nginx si no está instalado
apt-get install -y nginx

# Crear configuración para el subdominio
nano /etc/nginx/sites-available/secretaria
```

**Contenido del archivo de configuración:**

```nginx
server {
    listen 80;
    server_name secretaria.tudominio.com;  # Cambia por tu subdominio

    # Frontend (archivos estáticos compilados)
    location / {
        root /home/secretaria/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Archivos subidos
    location /uploads {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Activar la configuración:**

```bash
# Crear enlace simbólico
ln -s /etc/nginx/sites-available/secretaria /etc/nginx/sites-enabled/

# Verificar configuración de Nginx
nginx -t

# Recargar Nginx
systemctl reload nginx

# Verificar estado
systemctl status nginx
```

---

## 🔒 PASO 17: Configurar SSL con Let's Encrypt (Opcional pero Recomendado)

```bash
# Instalar Certbot
apt-get install -y certbot python3-certbot-nginx

# Obtener certificado SSL
certbot --nginx -d secretaria.tudominio.com

# Verificar renovación automática
certbot renew --dry-run
```

---

## ✅ PASO 18: Verificar que Todo Funciona

```bash
# Verificar que PM2 está corriendo
pm2 status

# Ver logs del backend
pm2 logs secretaria-backend --lines 50

# Verificar que Nginx está corriendo
systemctl status nginx

# Verificar que PostgreSQL está corriendo
systemctl status postgresql

# Probar conexión a la API
curl http://localhost:5000/health
```

---

## 📝 Comandos Útiles para Mantenimiento

```bash
# Ver logs del backend
pm2 logs secretaria-backend

# Reiniciar backend
pm2 restart secretaria-backend

# Detener backend
pm2 stop secretaria-backend

# Ver estado de todos los procesos
pm2 list

# Ver uso de recursos
pm2 monit

# Actualizar código desde GitHub
cd /home/secretaria
git pull origin main
cd server
npm install
cd ..
npm install
npm run build
pm2 restart secretaria-backend

# Ver logs de Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## 🐛 Solución de Problemas

### Si el puerto 5000 está ocupado:
1. Edita `server/.env` y cambia `PORT=5000` a otro puerto (ej: `PORT=5001`)
2. Actualiza la configuración de Nginx para usar el nuevo puerto
3. Reinicia: `pm2 restart secretaria-backend` y `systemctl reload nginx`

### Si hay errores de permisos:
```bash
# Dar permisos a la carpeta de uploads
chmod -R 755 /home/secretaria/server/uploads
chown -R root:root /home/secretaria/server/uploads
```

### Si la base de datos no conecta:
```bash
# Verificar que PostgreSQL está corriendo
systemctl status postgresql

# Probar conexión
psql -U secretaria_user -d secretaria_pro -h localhost
```

### Si el frontend no carga:
```bash
# Verificar que se compiló correctamente
ls -la /home/secretaria/dist

# Recompilar
cd /home/secretaria
npm run build
```

---

## 📌 Notas Importantes

1. **Seguridad:** Cambia todas las contraseñas por defecto
2. **Backups:** Configura backups regulares de la base de datos
3. **Firewall:** Asegúrate de tener los puertos necesarios abiertos
4. **Dominio:** Actualiza `FRONTEND_URL` en `.env` cuando configures el subdominio
5. **SSL:** Es altamente recomendable usar HTTPS en producción

---

## 🎉 ¡Instalación Completa!

Una vez completados todos los pasos, tu sistema debería estar funcionando en:
- **Frontend:** `http://secretaria.tudominio.com` (o la IP si aún no configuraste el dominio)
- **Backend API:** `http://secretaria.tudominio.com/api`

### 👤 Usuarios por Defecto

Después de ejecutar `npm run create-users`, tendrás estos usuarios:

**Administrador:**
- Email: `admin@secretariapro.com`
- Password: `admin123`
- Rol: ADMIN

**Secretaria:**
- Email: `secretaria@secretariapro.com`
- Password: `secretaria123`
- Rol: SECRETARIA

⚠️ **IMPORTANTE:** Cambia estas contraseñas después del primer inicio de sesión por seguridad.

