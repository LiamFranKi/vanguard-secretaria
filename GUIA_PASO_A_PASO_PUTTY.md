# 🚀 Guía Paso a Paso - Instalación en VPS con PuTTY

## 📍 PASO 1: Abrir y Configurar PuTTY

1. **Abre PuTTY** en tu computadora
2. En la ventana de PuTTY verás varios campos:
   - **Host Name (or IP address):** Escribe aquí: `72.60.172.101`
   - **Port:** Debe decir `22` (ya viene por defecto)
   - **Connection type:** Selecciona `SSH` (ya viene seleccionado)
3. Haz clic en el botón **Open** (abajo a la derecha)
4. Aparecerá una ventana negra (terminal)

---

## 📍 PASO 2: Conectarse al Servidor

1. En la ventana negra verás algo como:
   ```
   login as:
   ```
2. Escribe: `root` y presiona **Enter**
3. Te pedirá la contraseña:
   ```
   root@72.60.172.101's password:
   ```
4. Escribe: `Vanguard2025@&` 
   ⚠️ **NOTA:** La contraseña NO se verá mientras escribes (es normal por seguridad)
5. Presiona **Enter**
6. Si todo está bien, verás algo como:
   ```
   Welcome to Ubuntu...
   root@tu-servidor:~#
   ```
   El `#` al final significa que estás conectado como root.

---

## 📍 PASO 3: Verificar Puertos Disponibles

**¿Dónde ejecutar?** En la ventana negra de PuTTY, justo después del símbolo `#` o `$`

### 3.1 Ver todos los puertos en uso:
Escribe este comando y presiona **Enter**:
```bash
netstat -tulpn | grep LISTEN
```

**¿Qué verás?** Una lista de puertos ocupados. Anota los números de puerto que aparezcan.

### 3.2 Verificar puertos específicos del sistema:
Ejecuta estos comandos uno por uno (copia y pega cada uno, presiona Enter):

```bash
lsof -i :3000
```

```bash
lsof -i :5000
```

```bash
lsof -i :5432
```

**¿Qué significa?**
- Si aparece "command not found" o está vacío = Puerto DISPONIBLE ✅
- Si aparece información = Puerto OCUPADO ❌

**Si el puerto 5000 está ocupado:**
- Anota qué puerto está libre (por ejemplo: 5001, 5002, 6000, etc.)
- Lo usaremos más adelante

---

## 📍 PASO 4: Navegar y Crear la Carpeta

**¿Dónde ejecutar?** En la misma ventana de PuTTY

### 4.1 Ir al directorio home:
```bash
cd /home
```

### 4.2 Ver qué hay en esa carpeta:
```bash
ls -la
```

### 4.3 Crear la carpeta "secretaria":
```bash
mkdir -p secretaria
```

### 4.4 Entrar a la carpeta:
```bash
cd secretaria
```

### 4.5 Verificar que estás en la carpeta correcta:
```bash
pwd
```

**Deberías ver:** `/home/secretaria`

---

## 📍 PASO 5: Clonar el Repositorio de GitHub

**¿Dónde ejecutar?** En la misma ventana, asegúrate de estar en `/home/secretaria`

### 5.1 Clonar el repositorio:
```bash
git clone https://github.com/LiamFranKi/vanguard-secretaria.git .
```

**Nota:** El punto (`.`) al final es importante, significa "clonar aquí"

### 5.2 Esperar a que termine (verás mensajes de descarga)

### 5.3 Verificar que se clonó correctamente:
```bash
ls -la
```

**Deberías ver:** Muchos archivos y carpetas como `server`, `components`, `package.json`, etc.

---

## 📍 PASO 6: Verificar Node.js

**¿Dónde ejecutar?** En la misma ventana de PuTTY

### 6.1 Verificar si Node.js está instalado:
```bash
node -v
```

**Resultados posibles:**
- Si ves un número (ej: `v20.11.0`) = ✅ Node.js está instalado
- Si ves "command not found" = ❌ Necesitas instalarlo

### 6.2 Si NO está instalado, ejecuta estos comandos:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
```

Espera a que termine (puede tardar 1-2 minutos)

```bash
apt-get install -y nodejs
```

Espera a que termine la instalación

### 6.3 Verificar instalación:
```bash
node -v
npm -v
```

**Deberías ver:** Versiones de Node.js y npm

---

## 📍 PASO 7: Verificar PostgreSQL

**¿Dónde ejecutar?** En la misma ventana de PuTTY

### 7.1 Verificar si PostgreSQL está instalado:
```bash
psql --version
```

**Resultados posibles:**
- Si ves un número (ej: `psql (PostgreSQL) 14.x`) = ✅ PostgreSQL está instalado
- Si ves "command not found" = ❌ Necesitas instalarlo

### 7.2 Si NO está instalado:
```bash
apt-get update
```

Espera a que termine

```bash
apt-get install -y postgresql postgresql-contrib
```

Espera a que termine (puede tardar varios minutos)

### 7.3 Iniciar PostgreSQL:
```bash
systemctl start postgresql
```

```bash
systemctl enable postgresql
```

### 7.4 Verificar que está corriendo:
```bash
systemctl status postgresql
```

**Deberías ver:** "active (running)" en verde

**Para salir de la vista de status:** Presiona la tecla `q`

---

## 📍 PASO 8: Crear Base de Datos

**¿Dónde ejecutar?** En la misma ventana de PuTTY

### 8.1 Cambiar al usuario postgres:
```bash
su - postgres
```

**Nota:** Ahora el símbolo cambiará, puede que veas `$` en lugar de `#`

### 8.2 Abrir PostgreSQL:
```bash
psql
```

**Ahora verás:** `postgres=#` (estás dentro de PostgreSQL)

### 8.3 Crear la base de datos (copia y pega todo junto):
```sql
CREATE DATABASE secretaria_pro;
```

Presiona **Enter**

### 8.4 Crear el usuario (copia y pega, CAMBIA LA CONTRASEÑA):
```sql
CREATE USER secretaria_user WITH PASSWORD 'CambiaEstaPassword123!';
```

**⚠️ IMPORTANTE:** Cambia `CambiaEstaPassword123!` por una contraseña segura que recuerdes.

Presiona **Enter**

### 8.5 Configurar permisos (ejecuta uno por uno):
```sql
ALTER ROLE secretaria_user SET client_encoding TO 'utf8';
```

```sql
ALTER ROLE secretaria_user SET default_transaction_isolation TO 'read committed';
```

```sql
ALTER ROLE secretaria_user SET timezone TO 'UTC';
```

```sql
GRANT ALL PRIVILEGES ON DATABASE secretaria_pro TO secretaria_user;
```

### 8.6 Salir de PostgreSQL:
```sql
\q
```

### 8.7 Salir del usuario postgres:
```bash
exit
```

**Ahora deberías volver a ver:** `root@tu-servidor:/home/secretaria#`

---

## 📍 PASO 9: Instalar Dependencias del Backend

**¿Dónde ejecutar?** En la misma ventana, asegúrate de estar en `/home/secretaria`

### 9.1 Ir a la carpeta del servidor:
```bash
cd /home/secretaria/server
```

### 9.2 Verificar que estás en la carpeta correcta:
```bash
pwd
```

**Deberías ver:** `/home/secretaria/server`

### 9.3 Instalar dependencias:
```bash
npm install
```

**⏱️ Esto puede tardar 2-5 minutos.** Verás muchos mensajes de descarga.

**Espera a que termine.** Verás algo como:
```
added 250 packages in 2m
```

---

## 📍 PASO 10: Instalar Dependencias del Frontend

**¿Dónde ejecutar?** En la misma ventana de PuTTY

### 10.1 Volver a la raíz del proyecto:
```bash
cd /home/secretaria
```

### 10.2 Instalar dependencias:
```bash
npm install
```

**⏱️ Esto puede tardar 2-5 minutos.**

---

## 📍 PASO 11: Configurar Variables de Entorno

**¿Dónde ejecutar?** En la misma ventana de PuTTY

### 11.1 Ir a la carpeta del servidor:
```bash
cd /home/secretaria/server
```

### 11.2 Copiar el archivo de ejemplo:
```bash
cp env.example .env
```

### 11.3 Editar el archivo .env:
```bash
nano .env
```

**Se abrirá el editor nano** (pantalla con texto)

### 11.4 Editar las variables importantes:

**Busca estas líneas y cámbialas:**

1. **Base de datos** (usa la contraseña que creaste en el paso 8.4):
   ```
   DB_PASSWORD=CambiaEstaPassword123!
   ```
   Cambia `CambiaEstaPassword123!` por la contraseña que pusiste al crear el usuario.

2. **Puerto del Backend** (si el 5000 está ocupado, usa otro):
   ```
   PORT=5000
   ```
   Si el puerto 5000 está ocupado, cámbialo a otro (ej: `PORT=5001`)

3. **URL del Frontend** (ajusta con tu dominio o IP):
   ```
   FRONTEND_URL=http://72.60.172.101
   ```
   O si ya tienes dominio: `FRONTEND_URL=http://secretaria.tudominio.com`

### 11.5 Guardar y salir de nano:

1. Presiona **Ctrl + O** (para guardar)
2. Presiona **Enter** (para confirmar)
3. Presiona **Ctrl + X** (para salir)

**Volverás a la línea de comandos normal.**

---

## 📍 PASO 12: Inicializar la Base de Datos

**¿Dónde ejecutar?** En la misma ventana, asegúrate de estar en `/home/secretaria/server`

### 12.1 Crear las tablas:
```bash
npm run init-db
```

**Espera a que termine.** Verás mensajes de creación de tablas.

### 12.2 Crear usuarios iniciales:
```bash
npm run create-users
```

**Verás:** Información de los usuarios creados (admin y secretaria)

### 12.3 Inicializar configuración:
```bash
npm run init-config
```

**Espera a que termine.**

---

## 📍 PASO 13: Compilar el Frontend

**¿Dónde ejecutar?** En la misma ventana de PuTTY

### 13.1 Volver a la raíz:
```bash
cd /home/secretaria
```

### 13.2 Compilar:
```bash
npm run build
```

**⏱️ Esto puede tardar 1-3 minutos.**

**Espera a que termine.** Verás algo como:
```
✓ built in 45s
```

### 13.3 Verificar que se creó la carpeta dist:
```bash
ls -la dist
```

**Deberías ver:** Archivos HTML, JS, CSS, etc.

---

## 📍 PASO 14: Instalar PM2

**¿Dónde ejecutar?** En la misma ventana de PuTTY

### 14.1 Instalar PM2 globalmente:
```bash
npm install -g pm2
```

**Espera a que termine.**

### 14.2 Verificar instalación:
```bash
pm2 --version
```

**Deberías ver:** Un número de versión

---

## 📍 PASO 15: Iniciar el Backend con PM2

**¿Dónde ejecutar?** En la misma ventana de PuTTY

### 15.1 Ir a la carpeta del servidor:
```bash
cd /home/secretaria/server
```

### 15.2 Iniciar el servidor:
```bash
pm2 start server.js --name secretaria-backend
```

**Verás:** Información del proceso iniciado

### 15.3 Ver el estado:
```bash
pm2 status
```

**Deberías ver:** `secretaria-backend` con estado "online" ✅

### 15.4 Ver los logs (para verificar que funciona):
```bash
pm2 logs secretaria-backend --lines 20
```

**Deberías ver:** Mensajes como "🚀 Server running on port 5000"

**Para salir de los logs:** Presiona **Ctrl + C**

### 15.5 Guardar la configuración de PM2:
```bash
pm2 save
```

### 15.6 Configurar PM2 para iniciar al arrancar el servidor:
```bash
pm2 startup
```

**Verás un comando que debes ejecutar.** Copia y pega ese comando exactamente como te lo muestra.

**Ejemplo de lo que verás:**
```
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

Copia y ejecuta ese comando.

---

## 📍 PASO 16: Configurar Nginx

**¿Dónde ejecutar?** En la misma ventana de PuTTY

### 16.1 Instalar Nginx (si no está instalado):
```bash
apt-get install -y nginx
```

### 16.2 Crear archivo de configuración:
```bash
nano /etc/nginx/sites-available/secretaria
```

### 16.3 Pegar esta configuración (reemplaza todo el contenido):

**⚠️ IMPORTANTE:** 
- Si cambiaste el puerto en el paso 11.4, cambia `5000` por tu puerto
- Si tienes un dominio, cambia `72.60.172.101` por tu dominio

```nginx
server {
    listen 80;
    server_name 72.60.172.101;  # Cambia por tu dominio si lo tienes

    # Frontend (archivos estáticos compilados)
    location / {
        root /home/secretaria/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:5000;  # Cambia 5000 si usaste otro puerto
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
        proxy_pass http://localhost:5000;  # Cambia 5000 si usaste otro puerto
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 16.4 Guardar y salir:
- **Ctrl + O**, luego **Enter**, luego **Ctrl + X**

### 16.5 Activar la configuración:
```bash
ln -s /etc/nginx/sites-available/secretaria /etc/nginx/sites-enabled/
```

### 16.6 Verificar que la configuración es correcta:
```bash
nginx -t
```

**Deberías ver:** `syntax is ok` y `test is successful`

### 16.7 Recargar Nginx:
```bash
systemctl reload nginx
```

### 16.8 Verificar que Nginx está corriendo:
```bash
systemctl status nginx
```

**Deberías ver:** "active (running)" ✅

**Para salir:** Presiona `q`

---

## 📍 PASO 17: Verificar que Todo Funciona

**¿Dónde ejecutar?** En la misma ventana de PuTTY

### 17.1 Verificar PM2:
```bash
pm2 status
```

**Debería mostrar:** `secretaria-backend` online ✅

### 17.2 Probar la API:
```bash
curl http://localhost:5000/health
```

**Deberías ver:** `{"status":"ok","timestamp":"..."}`

### 17.3 Ver logs del backend:
```bash
pm2 logs secretaria-backend --lines 10
```

**Para salir:** Presiona **Ctrl + C**

---

## ✅ ¡INSTALACIÓN COMPLETA!

Ahora puedes acceder a tu sistema:

- **Desde tu navegador:** `http://72.60.172.101`
- **O si configuraste dominio:** `http://secretaria.tudominio.com`

### 👤 Usuarios para iniciar sesión:

**Administrador:**
- Email: `admin@secretariapro.com`
- Password: `admin123`

**Secretaria:**
- Email: `secretaria@secretariapro.com`
- Password: `secretaria123`

---

## 🆘 Si Algo Sale Mal

### El backend no inicia:
```bash
cd /home/secretaria/server
pm2 logs secretaria-backend
```
Revisa los errores y compártelos.

### Nginx da error:
```bash
nginx -t
```
Revisa qué error muestra.

### La base de datos no conecta:
Verifica que la contraseña en `.env` sea la misma que creaste en PostgreSQL.

---

## 📝 Notas Finales

- **No cierres la ventana de PuTTY** hasta verificar que todo funciona
- **Guarda las contraseñas** que creaste (especialmente la de PostgreSQL)
- **El puerto que uses** debe estar libre y coincidir en `.env` y `nginx`

¡Listo para empezar! 🚀

