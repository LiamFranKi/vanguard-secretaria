# ⚙️ Sistema de Configuración Completo

## 📋 Características

El sistema de configuración permite personalizar completamente la aplicación:

### ✅ Configuración Disponible

1. **Información General**
   - Nombre del Sistema
   - Título
   - Descripción

2. **Colores**
   - Color Primario (editable con selector de color)
   - Color Secundario (editable con selector de color)
   - Los colores se aplican dinámicamente en toda la aplicación

3. **Logos e Imágenes**
   - URL del Logo
   - URL del Favicon
   - Preview del logo en tiempo real

4. **Información de Contacto**
   - Email de contacto
   - Teléfono de contacto
   - Dirección

5. **Footer**
   - Texto personalizable del footer

## 🚀 Inicialización

### 1. Crear la tabla en la base de datos

Ejecuta el schema actualizado que incluye la tabla `system_config`:

```bash
# En pgAdmin4, ejecuta el archivo:
server/database/schema.sql
```

O ejecuta el script de inicialización:

```bash
cd server
npm run init-config
```

## 📱 Uso

### Acceder a la Configuración

1. Inicia sesión como **ADMIN**
2. En el sidebar, verás el botón **"Configuración"** (solo visible para admins)
3. Click en "Configuración" para abrir el modal

### Editar Configuración

1. Abre el modal de configuración
2. Modifica los campos que desees
3. Los colores tienen un selector visual + campo de texto
4. Click en **"Guardar Configuración"**
5. Los cambios se aplican inmediatamente

## 🎨 Aplicación de Colores

Los colores se aplican automáticamente usando variables CSS:

```css
:root {
  --primary-color: #7c3aed;
  --secondary-color: #4f46e5;
}
```

Estos colores se usan en:
- Gradientes de botones
- Bordes y acentos
- Textos destacados
- Fondos de elementos

## 🔧 API Endpoints

### Obtener Configuración (Público)
```
GET /api/config
```

### Actualizar Configuración (Solo Admin)
```
PUT /api/config
Authorization: Bearer <token>
Body: {
  nombre_sistema: "Nuevo Nombre",
  color_primario: "#ff0000",
  ...
}
```

## 📊 Estructura de la Tabla

```sql
CREATE TABLE system_config (
    id SERIAL PRIMARY KEY,
    nombre_sistema VARCHAR(255),
    titulo VARCHAR(255),
    descripcion_sistema TEXT,
    color_primario VARCHAR(50),
    color_secundario VARCHAR(50),
    logo_url TEXT,
    favicon_url TEXT,
    email_contacto VARCHAR(255),
    telefono_contacto VARCHAR(50),
    direccion TEXT,
    footer_text TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## 🔐 Permisos

- **Lectura**: Público (cualquiera puede ver la configuración)
- **Escritura**: Solo usuarios con rol **ADMIN**

## 💡 Notas

- La configuración se carga automáticamente al iniciar la aplicación
- Los cambios se aplican en tiempo real
- El favicon y título de la página se actualizan automáticamente
- El landing page usa la configuración para mostrar información personalizada

## 🐛 Solución de Problemas

### La configuración no se aplica

1. Verifica que la tabla `system_config` existe
2. Ejecuta `npm run init-config` para crear la configuración inicial
3. Recarga la página (Ctrl+Shift+R)

### Los colores no cambian

1. Verifica que los valores sean códigos hexadecimales válidos (ej: #7c3aed)
2. Recarga la página después de guardar
3. Revisa la consola del navegador por errores

