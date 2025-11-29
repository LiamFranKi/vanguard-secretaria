-- Script para verificar y otorgar permisos en PostgreSQL
-- Ejecutar como superusuario (postgres) en la base de datos secretaria_pro

-- Conectar a la base de datos
\c secretaria_pro;

-- Verificar que el usuario postgres tiene permisos
-- (Normalmente ya los tiene por defecto)

-- Otorgar todos los permisos al usuario postgres (si es necesario)
GRANT ALL PRIVILEGES ON DATABASE secretaria_pro TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Si usas otro usuario, reemplaza 'postgres' con tu usuario
-- Ejemplo:
-- GRANT ALL PRIVILEGES ON DATABASE secretaria_pro TO tu_usuario;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tu_usuario;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tu_usuario;

-- Verificar permisos actuales
SELECT 
    table_name,
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
ORDER BY table_name, grantee;

