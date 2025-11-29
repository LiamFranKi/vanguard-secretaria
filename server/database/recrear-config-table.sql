-- ============================================
-- SCRIPT COMPLETO PARA RECREAR system_config
-- ============================================
-- Ejecutar en pgAdmin4 en la base de datos secretaria_pro
-- Este script elimina y recrea la tabla completa

-- PASO 1: Eliminar tabla existente (si existe)
DROP TABLE IF EXISTS system_config CASCADE;

-- PASO 2: Crear la tabla completa
CREATE TABLE system_config (
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

-- PASO 3: Insertar configuración inicial
INSERT INTO system_config (
    id, 
    nombre_sistema, 
    titulo, 
    descripcion_sistema, 
    color_primario, 
    color_secundario
) VALUES (
    1,
    'SecretariaPro',
    'Sistema de Gestión Administrativa Profesional',
    'Plataforma integral para la gestión de tareas, contactos, documentos y eventos',
    '#7c3aed',
    '#4f46e5'
);

-- PASO 4: Crear trigger para updated_at (si no existe la función, crearla primero)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- PASO 5: Crear trigger en la tabla
CREATE TRIGGER update_system_config_updated_at 
    BEFORE UPDATE ON system_config
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- PASO 6: Verificar que todo se creó correctamente
SELECT 
    '✅ Tabla creada exitosamente' AS mensaje,
    COUNT(*) AS total_columnas
FROM information_schema.columns
WHERE table_name = 'system_config';

-- PASO 7: Mostrar el registro creado
SELECT 
    id,
    nombre_sistema,
    titulo,
    color_primario,
    color_secundario,
    created_at
FROM system_config
WHERE id = 1;

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
SELECT 
    '=== VERIFICACIÓN COMPLETA ===' AS titulo,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'system_config') AS total_columnas,
    (SELECT COUNT(*) FROM system_config) AS total_registros,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'system_config') >= 17
        AND (SELECT COUNT(*) FROM system_config) = 1
        THEN '✅ TODO CORRECTO'
        ELSE '⚠️  REVISAR'
    END AS estado;

