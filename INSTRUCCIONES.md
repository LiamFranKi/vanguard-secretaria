# 📋 Instrucciones Rápidas - SecretariaPro

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
# Desde la raíz
npm install
```

### 2. Crear Base de Datos

1. Abre **pgAdmin4**
2. Click derecho en **"Databases"** → **"Create"** → **"Database"**
3. Nombre: `secretaria_pro`
4. Click **"Save"**

### 3. Ejecutar Schema SQL

1. En pgAdmin4, click derecho en `secretaria_pro` → **"Query Tool"**
2. Abre el archivo: `server/database/schema.sql`
3. Copia TODO el contenido
4. Pégalo en Query Tool
5. Click **"Execute"** (F5)

✅ **Listo!** Las tablas están creadas.

### 4. Configurar .env

**Backend (`server/.env`):**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=secretaria_pro
DB_USER=postgres
DB_PASSWORD=waltito10
JWT_SECRET=12f0d802d8d608069132506f49d0a50f45c0e38c9e74d02e7976d8ab9bd032cbdf47765988779a7f683ee2195ea020484d819a573d0f9468972870c8dd29f195
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Frontend (`.env` en la raíz):**
```env
VITE_API_URL=http://localhost:5000
```

### 5. Iniciar Todo

```bash
# Desde la raíz del proyecto
npm run dev
```

Esto inicia:
- ✅ Frontend: `http://localhost:3000`
- ✅ Backend: `http://localhost:5000`

### 6. Detener Todo

```bash
npm run kill
```

O presiona `Ctrl+C`

## 👤 Crear Usuario

### Opción 1: Desde la App
1. Abre `http://localhost:3000`
2. Click en "Registro"
3. Completa el formulario
4. Click "Crear Cuenta"

### Opción 2: Desde SQL (pgAdmin4)

```sql
-- Conectar a secretaria_pro
\c secretaria_pro

-- Generar hash bcrypt para "admin123" en: https://bcrypt-generator.com/
-- Luego insertar:
INSERT INTO users (email, password, name, role) 
VALUES (
  'admin@secretariapro.com',
  '$2a$10$TU_HASH_AQUI', -- Reemplaza con el hash real
  'Administrador',
  'ADMIN'
);
```

## ✅ Verificación

1. ✅ Base de datos `secretaria_pro` creada
2. ✅ Tablas creadas (ejecutaste schema.sql)
3. ✅ `.env` configurado en `server/`
4. ✅ `.env` configurado en la raíz
5. ✅ `npm run dev` funciona
6. ✅ Puedes registrarte o crear usuario manualmente

## 🎯 Estructura Creada

```
server/
├── config/database.js      # Conexión PostgreSQL
├── controllers/            # Controladores (auth, tasks, etc.)
├── routes/                 # Rutas API
├── middleware/             # Auth, upload
├── services/               # Email service
├── database/schema.sql     # Script SQL para crear tablas
└── server.js               # Punto de entrada

Frontend/
├── services/apiService.ts  # Cliente API
├── components/             # Componentes React
└── App.tsx                # App principal
```

## 📝 Notas

- **Sin Prisma**: Usamos PostgreSQL directamente con `pg`
- **PWA**: Configurado con vite-plugin-pwa
- **Push**: Listo para configurar (necesitas VAPID keys)
- **Email**: Listo para configurar (necesitas SMTP)
- **IA**: Listo para configurar (necesitas GEMINI_API_KEY)

¡Todo listo para usar! 🎉

