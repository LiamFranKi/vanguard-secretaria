-- Agregar nuevos campos a la tabla contacts
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS direccion TEXT,
ADD COLUMN IF NOT EXISTS empresa VARCHAR(255),
ADD COLUMN IF NOT EXISTS detalle TEXT;

