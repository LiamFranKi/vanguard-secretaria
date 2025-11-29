# SecretariaPro - Sistema de Gestión Administrativa

Aplicación web progresiva (PWA) completa con backend Node.js + Express y PostgreSQL.

## 🚀 Características

- ✅ React + Vite + Tailwind CSS
- ✅ Node.js + Express (Backend)
- ✅ PostgreSQL (sin Prisma, queries directas)
- ✅ PWA (Progressive Web App)
- ✅ Notificaciones Push
- ✅ Correos elegantes con Nodemailer
- ✅ Autenticación JWT
- ✅ Gestión de archivos con Multer
- ✅ IA con Google Gemini

## 📋 Instalación

### 1. Backend

```bash
cd server
npm install
```

### 2. Configurar Base de Datos

1. Abre pgAdmin4
2. Conecta a tu servidor PostgreSQL
3. Crea la base de datos `secretaria_pro` (si no existe)
4. Ejecuta el script SQL:

```bash
# Opción 1: Desde pgAdmin4
# Abre Query Tool y ejecuta el contenido de: server/database/schema.sql

# Opción 2: Desde psql
psql -U postgres -d secretaria_pro -f server/database/schema.sql
```

### 3. Configurar Variables de Entorno

Crea `server/.env` basado en `server/.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=secretaria_pro
DB_USER=postgres
DB_PASSWORD=waltito10
JWT_SECRET=tu-jwt-secret
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 4. Frontend

```bash
# Desde la raíz del proyecto
npm install
```

Crea `.env` en la raíz:

```env
VITE_API_URL=http://localhost:5000
```

## 🚀 Ejecución

### Desarrollo (Ambos servidores)

```bash
npm run dev
```

Esto inicia:
- Frontend en `http://localhost:3000`
- Backend en `http://localhost:5000`

### Detener servidores

```bash
npm run kill
```

## 📁 Estructura

```
sistema-secretaria/
├── server/              # Backend
│   ├── config/         # Configuración DB
│   ├── controllers/    # Controladores
│   ├── routes/         # Rutas API
│   ├── middleware/     # Middlewares
│   ├── services/       # Servicios (email)
│   ├── database/       # Scripts SQL
│   └── server.js       # Punto de entrada
├── components/         # Componentes React
├── services/           # Servicios frontend
└── App.tsx            # Componente principal
```

## 🔑 Usuarios de Prueba

Después de crear las tablas, puedes crear usuarios manualmente o usar:

```sql
-- Password: admin123 (hash bcrypt)
INSERT INTO users (email, password, name, role) 
VALUES ('admin@secretariapro.com', '$2a$10$...', 'Admin', 'ADMIN');
```

## 📝 API Endpoints

- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual
- `GET /api/tasks` - Listar tareas
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- Similar para: `/api/contacts`, `/api/events`, `/api/folders`, `/api/documents`
- `POST /api/ai/ask` - Consultar IA
- `POST /api/push/subscribe` - Suscribirse a push

## 🎯 Próximos Pasos

1. Ejecutar `server/database/schema.sql` en pgAdmin4
2. Configurar `.env` en `server/`
3. Ejecutar `npm run dev` desde la raíz
4. Abrir `http://localhost:3000`
