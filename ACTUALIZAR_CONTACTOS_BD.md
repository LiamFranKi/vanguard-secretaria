# Actualizar Tabla de Contactos

## Paso 1: Ejecutar el Script SQL

Necesitas ejecutar el siguiente script SQL en tu base de datos PostgreSQL para agregar los nuevos campos a la tabla `contacts`:

```sql
-- Agregar nuevos campos a la tabla contacts
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS direccion TEXT,
ADD COLUMN IF NOT EXISTS empresa VARCHAR(255),
ADD COLUMN IF NOT EXISTS detalle TEXT;
```

### Opción 1: Usando pgAdmin4
1. Abre pgAdmin4
2. Conéctate a tu servidor PostgreSQL
3. Selecciona la base de datos `secretaria_pro`
4. Haz clic derecho en la base de datos → **Query Tool**
5. Pega el script SQL anterior
6. Ejecuta el script (F5 o botón "Execute")

### Opción 2: Usando psql (línea de comandos)
```bash
psql -U postgres -d secretaria_pro -f server/database/add-contact-fields.sql
```

## Paso 2: Verificar los Cambios

Puedes verificar que los campos se agregaron correctamente ejecutando:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contacts' 
ORDER BY ordinal_position;
```

Deberías ver los nuevos campos:
- `direccion` (TEXT)
- `empresa` (VARCHAR(255))
- `detalle` (TEXT)

## Nota

Si ya tienes contactos en la base de datos, estos nuevos campos estarán vacíos (NULL) para los contactos existentes. Puedes editarlos desde la interfaz del sistema.

