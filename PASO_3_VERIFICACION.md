# ✅ Paso 3: Verificación y Usuarios de Prueba

## 📋 Checklist

### 1. Verificar que las tablas existen

En pgAdmin4, ejecuta:

```sql
-- Conectar a secretaria_pro
\c secretaria_pro

-- Ver todas las tablas
\dt
```

Deberías ver:
- users
- tasks
- contacts
- folders
- documents
- events
- notificaciones
- push_subscriptions

### 2. Verificar Permisos (Opcional)

Si tienes problemas de permisos, ejecuta en pgAdmin4:

```sql
-- Como superusuario (postgres)
GRANT ALL PRIVILEGES ON DATABASE secretaria_pro TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
```

O ejecuta el archivo: `server/database/verificar-permisos.sql`

### 3. Crear Usuarios de Prueba

En pgAdmin4, ejecuta el archivo: `server/database/insert-users.sql`

O manualmente:

```sql
-- Conectar a secretaria_pro
\c secretaria_pro

-- Usuario Admin
INSERT INTO users (email, password, name, role) 
VALUES (
  'admin@secretariapro.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Administrador',
  'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Usuario Secretaria
INSERT INTO users (email, password, name, role) 
VALUES (
  'secretaria@secretariapro.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Secretaria Principal',
  'SECRETARIA'
) ON CONFLICT (email) DO NOTHING;
```

### 4. Verificar Usuarios Creados

```sql
SELECT id, email, name, role FROM users;
```

## 🔑 Credenciales de Prueba

**Admin:**
- Email: `admin@secretariapro.com`
- Password: `admin123`

**Secretaria:**
- Email: `secretaria@secretariapro.com`
- Password: `secretaria123`

## 🚀 Siguiente Paso: Probar la Conexión

Una vez creados los usuarios, prueba iniciar el servidor:

```bash
cd server
npm run dev
```

Deberías ver:
```
✅ Database connected successfully
🚀 Server running on port 5000
```

Si ves errores de conexión, verifica:
1. PostgreSQL está corriendo
2. Las credenciales en `server/.env` son correctas
3. La base de datos `secretaria_pro` existe

## ✅ Listo para Continuar

Una vez que:
- ✅ Las tablas están creadas
- ✅ Los usuarios de prueba están insertados
- ✅ El servidor se conecta correctamente

Puedes ejecutar `npm run dev` desde la raíz para iniciar todo.

