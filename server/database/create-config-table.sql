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
    icon_192_url TEXT,
    icon_512_url TEXT,
    apple_touch_icon_url TEXT,
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

-- Verificar
SELECT * FROM system_config;

