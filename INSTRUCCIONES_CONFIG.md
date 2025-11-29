# ⚙️ Instrucciones para Activar la Configuración del Sistema

## Paso 1: Crear la Tabla en PostgreSQL

Ejecuta este SQL en pgAdmin4:

1. Abre pgAdmin4
2. Conecta a tu servidor PostgreSQL
3. Selecciona la base de datos `secretaria_pro`
4. Click derecho → Query Tool
5. Abre el archivo: `server/database/create-config-table.sql`
6. Copia todo el contenido
7. Pégalo en Query Tool
8. Ejecuta (F5)

O ejecuta directamente:

```sql
-- Crear tabla de configuración del sistema
CREATE TABLE IF NOT EXISTS system_config (
    id SERIAL PRIMARY KEY,
    nombre_sistema VARCHAR(255) DEFAULT 'SecretariaPro',
    titulo VARCHAR(255) DEFAULT 'Sistema de Gestión Administrativa',
    descripcion_sistema TEXT,
    color_primario VARCHAR(50) DEFAULT '#7c3aed',
    color_secundario VARCHAR(50) DEFAULT '#4f46e5',
    logo_url TEXT,
    favicon_url TEXT,
    email_contacto VARCHAR(255),
    telefono_contacto VARCHAR(50),
    direccion TEXT,
    footer_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_config CHECK (id = 1)
);

-- Insertar configuración inicial
INSERT INTO system_config (id, nombre_sistema, titulo, descripcion_sistema, color_primario, color_secundario)
VALUES (
    1,
    'SecretariaPro',
    'Sistema de Gestión Administrativa Profesional',
    'Plataforma integral para la gestión de tareas, contactos, documentos y eventos',
    '#7c3aed',
    '#4f46e5'
) ON CONFLICT DO NOTHING;

-- Trigger para updated_at
CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Paso 2: Inicializar la Configuración

Después de crear la tabla, ejecuta:

```bash
cd server
npm run init-config
```

## Paso 3: Usar la Configuración

1. Inicia sesión como **ADMIN**
2. En el sidebar verás el botón **"Configuración"**
3. Click para abrir el modal de configuración
4. Edita los campos que desees
5. Los colores tienen selector visual
6. Guarda los cambios

## ✅ Listo!

Ahora puedes personalizar completamente tu sistema desde el panel de administración.

