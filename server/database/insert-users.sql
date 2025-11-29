-- Script para insertar usuarios de prueba
-- Ejecutar DESPUÉS de haber ejecutado schema.sql
-- Conectado a la base de datos secretaria_pro

-- Usuario Admin
-- Email: admin@secretariapro.com
-- Password: admin123
-- Hash bcrypt generado: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (email, password, name, role) 
VALUES (
  'admin@secretariapro.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Administrador',
  'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Usuario Secretaria
-- Email: secretaria@secretariapro.com
-- Password: secretaria123
-- Hash bcrypt generado: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO users (email, password, name, role) 
VALUES (
  'secretaria@secretariapro.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Secretaria Principal',
  'SECRETARIA'
) ON CONFLICT (email) DO NOTHING;

-- Verificar que se insertaron
SELECT id, email, name, role, created_at FROM users;

