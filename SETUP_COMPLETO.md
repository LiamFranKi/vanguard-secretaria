# 🚀 Guía de Configuración Completa - SecretariaPro

## Paso 1: Instalar Dependencias

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
# Desde la raíz
npm install
```

## Paso 2: Configurar Base de Datos

### Opción A: Desde pgAdmin4 (Recomendado)

1. Abre pgAdmin4
2. Conecta a tu servidor PostgreSQL
3. Click derecho en "Databases" → "Create" → "Database"
4. Nombre: `secretaria_pro`
5. Click "Save"
6. Click derecho en `secretaria_pro` → "Query Tool"
7. Abre el archivo `server/database/schema.sql`
8. Copia todo el contenido y pégalo en Query Tool
9. Click "Execute" (F5)

### Opción B: Desde Terminal (psql)

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE secretaria_pro;

# Salir
\q

# Ejecutar schema
psql -U postgres -d secretaria_pro -f server/database/schema.sql
```

### Opción C: Script Automático (Node.js)

```bash
cd server
npm run init-db
```

## Paso 3: Configurar Variables de Entorno

### Backend (`server/.env`)

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=secretaria_pro
DB_USER=postgres
DB_PASSWORD=waltito10

JWT_SECRET=12f0d802d8d608069132506f49d0a50f45c0e38c9e74d02e7976d8ab9bd032cbdf47765988779a7f683ee2195ea020484d819a573d0f9468972870c8dd29f195
JWT_EXPIRES_IN=7d

PORT=5000
NODE_ENV=development

GEMINI_API_KEY=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=SecretariaPro <noreply@secretariapro.com>

VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:your-email@example.com

FRONTEND_URL=http://localhost:3000
```

### Frontend (`.env` en la raíz)

```env
VITE_API_URL=http://localhost:5000
```

## Paso 4: Crear Usuario de Prueba

Desde pgAdmin4 o psql:

```sql
-- Conectar a secretaria_pro
\c secretaria_pro

-- Crear usuario (password: admin123)
-- Nota: Necesitas generar el hash bcrypt primero
-- Puedes usar: https://bcrypt-generator.com/
-- O crear desde la app registrándote

-- Ejemplo (reemplaza el hash):
INSERT INTO users (email, password, name, role) 
VALUES (
  'admin@secretariapro.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- admin123
  'Administrador',
  'ADMIN'
);
```

## Paso 5: Iniciar la Aplicación

```bash
# Desde la raíz del proyecto
npm run dev
```

Esto iniciará:
- ✅ Frontend en `http://localhost:3000`
- ✅ Backend en `http://localhost:5000`

## Paso 6: Detener Servidores

```bash
npm run kill
```

O presiona `Ctrl+C` en la terminal.

## ✅ Verificación

1. Abre `http://localhost:3000`
2. Deberías ver la aplicación
3. Si no hay usuario, regístrate desde la app
4. O crea uno manualmente en la BD

## 🔧 Comandos Útiles

```bash
# Solo frontend
npm run dev:frontend

# Solo backend
npm run dev:backend

# Inicializar BD
cd server && npm run init-db

# Ver logs del backend
cd server && npm run dev
```

## 📝 Notas

- La base de datos `secretaria_pro` debe existir antes de ejecutar el schema
- El JWT_SECRET ya está configurado (puedes cambiarlo)
- Los servicios opcionales (Gemini, SMTP, Push) pueden dejarse vacíos por ahora
- Los archivos se guardan en `server/uploads/`

