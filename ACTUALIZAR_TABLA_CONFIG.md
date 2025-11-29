# 📝 Actualizar Tabla de Configuración

Si ya creaste la tabla `system_config` anteriormente, necesitas agregar los nuevos campos para los iconos PWA.

## Opción 1: Ejecutar SQL de Actualización

Ejecuta este SQL en pgAdmin4:

```sql
-- Agregar columnas para iconos PWA
ALTER TABLE system_config 
ADD COLUMN IF NOT EXISTS icon_192_url TEXT,
ADD COLUMN IF NOT EXISTS icon_512_url TEXT,
ADD COLUMN IF NOT EXISTS apple_touch_icon_url TEXT;
```

## Opción 2: Recrear la Tabla (si no tienes datos importantes)

Si no tienes configuración guardada, puedes eliminar y recrear:

```sql
DROP TABLE IF EXISTS system_config CASCADE;

-- Luego ejecuta el archivo completo:
-- server/database/create-config-table.sql
```

## Verificar

Después de ejecutar, verifica que las columnas existan:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'system_config';
```

Deberías ver:
- icon_192_url
- icon_512_url  
- apple_touch_icon_url

