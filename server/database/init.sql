-- Script para inicializar la base de datos
-- Ejecutar este archivo en pgAdmin4 o psql

\c secretaria_pro;

-- Ejecutar el schema
\i schema.sql

-- Insertar usuario de prueba (opcional)
-- Password: admin123 (hash bcrypt)
INSERT INTO users (email, password, name, role) 
VALUES (
  'admin@secretariapro.com',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq',
  'Administrador',
  'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Password: secretaria123
INSERT INTO users (email, password, name, role) 
VALUES (
  'secretaria@secretariapro.com',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq',
  'Secretaria Principal',
  'SECRETARIA'
) ON CONFLICT (email) DO NOTHING;

