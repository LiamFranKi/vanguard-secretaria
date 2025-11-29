-- Script para verificar la tabla system_config
-- Ejecutar en pgAdmin4 en la base de datos secretaria_pro

-- 1. Verificar que la tabla existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'system_config') 
        THEN '✅ La tabla system_config EXISTE'
        ELSE '❌ La tabla system_config NO EXISTE'
    END AS estado_tabla;

-- 2. Ver todas las columnas de la tabla
SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud Máxima",
    is_nullable AS "Permite NULL",
    column_default AS "Valor por Defecto"
FROM information_schema.columns
WHERE table_name = 'system_config'
ORDER BY ordinal_position;

-- 3. Verificar columnas requeridas
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'system_config' AND column_name = 'id')
        THEN '✅ id'
        ELSE '❌ id - FALTA'
    END AS id,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'system_config' AND column_name = 'nombre_sistema')
        THEN '✅ nombre_sistema'
        ELSE '❌ nombre_sistema - FALTA'
    END AS nombre_sistema,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'system_config' AND column_name = 'titulo')
        THEN '✅ titulo'
        ELSE '❌ titulo - FALTA'
    END AS titulo,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'system_config' AND column_name = 'color_primario')
        THEN '✅ color_primario'
        ELSE '❌ color_primario - FALTA'
    END AS color_primario,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'system_config' AND column_name = 'color_secundario')
        THEN '✅ color_secundario'
        ELSE '❌ color_secundario - FALTA'
    END AS color_secundario,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'system_config' AND column_name = 'logo_url')
        THEN '✅ logo_url'
        ELSE '❌ logo_url - FALTA'
    END AS logo_url,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'system_config' AND column_name = 'favicon_url')
        THEN '✅ favicon_url'
        ELSE '❌ favicon_url - FALTA'
    END AS favicon_url,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'system_config' AND column_name = 'icon_192_url')
        THEN '✅ icon_192_url'
        ELSE '❌ icon_192_url - FALTA'
    END AS icon_192_url,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'system_config' AND column_name = 'icon_512_url')
        THEN '✅ icon_512_url'
        ELSE '❌ icon_512_url - FALTA'
    END AS icon_512_url,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'system_config' AND column_name = 'apple_touch_icon_url')
        THEN '✅ apple_touch_icon_url'
        ELSE '❌ apple_touch_icon_url - FALTA'
    END AS apple_touch_icon_url,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'system_config' AND column_name = 'email_contacto')
        THEN '✅ email_contacto'
        ELSE '❌ email_contacto - FALTA'
    END AS email_contacto,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'system_config' AND column_name = 'telefono_contacto')
        THEN '✅ telefono_contacto'
        ELSE '❌ telefono_contacto - FALTA'
    END AS telefono_contacto,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'system_config' AND column_name = 'direccion')
        THEN '✅ direccion'
        ELSE '❌ direccion - FALTA'
    END AS direccion,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'system_config' AND column_name = 'footer_text')
        THEN '✅ footer_text'
        ELSE '❌ footer_text - FALTA'
    END AS footer_text;

-- 4. Verificar que existe el registro con id = 1
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM system_config WHERE id = 1)
        THEN '✅ Existe registro con id = 1'
        ELSE '⚠️  NO existe registro con id = 1 (ejecuta init-config)'
    END AS estado_registro;

-- 5. Ver el contenido actual de la configuración
SELECT 
    id,
    nombre_sistema,
    titulo,
    color_primario,
    color_secundario,
    CASE WHEN logo_url IS NOT NULL THEN '✅' ELSE '❌' END AS tiene_logo,
    CASE WHEN favicon_url IS NOT NULL THEN '✅' ELSE '❌' END AS tiene_favicon,
    CASE WHEN icon_192_url IS NOT NULL THEN '✅' ELSE '❌' END AS tiene_icon_192,
    CASE WHEN icon_512_url IS NOT NULL THEN '✅' ELSE '❌' END AS tiene_icon_512,
    CASE WHEN apple_touch_icon_url IS NOT NULL THEN '✅' ELSE '❌' END AS tiene_apple_icon,
    created_at,
    updated_at
FROM system_config
WHERE id = 1;

-- 6. Verificar constraint (debe haber solo 1 registro)
SELECT 
    COUNT(*) AS total_registros,
    CASE 
        WHEN COUNT(*) = 1 THEN '✅ Correcto: Solo 1 registro'
        WHEN COUNT(*) = 0 THEN '⚠️  No hay registros'
        ELSE '❌ Error: Hay más de 1 registro'
    END AS estado
FROM system_config;

-- 7. Verificar trigger de updated_at
SELECT 
    trigger_name AS "Trigger",
    event_manipulation AS "Evento",
    action_timing AS "Timing"
FROM information_schema.triggers
WHERE event_object_table = 'system_config';

-- RESUMEN FINAL
SELECT 
    '=== RESUMEN DE VERIFICACIÓN ===' AS resumen,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'system_config') AS total_columnas,
    (SELECT COUNT(*) FROM system_config) AS total_registros,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'system_config') >= 17
        THEN '✅ Tabla completa'
        ELSE '⚠️  Faltan columnas'
    END AS estado_general;

