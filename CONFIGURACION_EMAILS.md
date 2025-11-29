# 📧 Configuración de Emails

Este documento explica cómo configurar el sistema de envío de correos electrónicos en SecretariaPro.

## Variables de Entorno

Agrega las siguientes variables a tu archivo `.env` en la carpeta `server/`:

```env
# Configuración SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion
SMTP_FROM=SecretariaPro <noreply@secretariapro.com>

# URL del Frontend (para enlaces en los emails)
FRONTEND_URL=http://localhost:3000
```

## Configuración para Gmail

### Paso 1: Habilitar la verificación en 2 pasos
1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Activa la verificación en 2 pasos

### Paso 2: Generar una contraseña de aplicación
1. Ve a: https://myaccount.google.com/apppasswords
2. Selecciona "Correo" y "Otro (nombre personalizado)"
3. Ingresa "SecretariaPro" como nombre
4. Copia la contraseña generada (16 caracteres)
5. Usa esta contraseña en `SMTP_PASS` (NO uses tu contraseña normal de Gmail)

### Paso 3: Configurar en .env
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # La contraseña de aplicación generada
SMTP_FROM=SecretariaPro <tu-email@gmail.com>
```

## Configuración para otros proveedores

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=tu-email@outlook.com
SMTP_PASS=tu-contraseña
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=tu-email@yahoo.com
SMTP_PASS=tu-contraseña-de-aplicacion
```

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=tu-api-key-de-sendgrid
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=tu-usuario-mailgun
SMTP_PASS=tu-contraseña-mailgun
```

## Tipos de Emails Enviados

El sistema envía automáticamente correos para:

1. **Tarea Asignada**: Cuando se asigna una tarea a un usuario
2. **Evento Asignado**: Cuando se asigna un evento a un usuario
3. **Recordatorio de Evento (1 hora)**: 1 hora antes del evento
4. **Recordatorio de Evento (1 día)**: 1 día antes del evento
5. **Recordatorio de Evento (Hoy)**: El mismo día del evento
6. **Cambio de Estado de Tarea**: Cuando cambia el estado de una tarea
7. **Cambio de Prioridad de Tarea**: Cuando cambia la prioridad de una tarea
8. **Documento Subido**: Cuando se sube un nuevo documento

## Plantillas de Email

Las plantillas están diseñadas con:
- ✅ Diseño responsive (se adapta a móviles)
- ✅ Colores personalizables según el tipo de notificación
- ✅ Iconos y elementos visuales atractivos
- ✅ Botones de acción con enlaces al sistema
- ✅ Compatible con clientes de email (Gmail, Outlook, etc.)

## Verificación

Al iniciar el servidor, verás uno de estos mensajes:

- ✅ `SMTP Server is ready to send emails` - Configuración correcta
- ❌ `SMTP Error: ...` - Revisa tu configuración

## Notas Importantes

1. **No uses tu contraseña normal de Gmail**: Usa siempre una contraseña de aplicación
2. **El email se envía de forma asíncrona**: No bloquea la creación de notificaciones
3. **Si el email falla**: La notificación se crea igual, pero no se marca como enviada
4. **Los emails se envían solo si SMTP está configurado**: Si no está configurado, verás una advertencia pero el sistema seguirá funcionando

## Prueba de Envío

Para probar que los emails funcionan:

1. Configura las variables SMTP en `.env`
2. Reinicia el servidor
3. Crea una tarea y asígnala a un usuario
4. El usuario debería recibir un email automáticamente

## Solución de Problemas

### Error: "Invalid login"
- Verifica que `SMTP_USER` y `SMTP_PASS` sean correctos
- Para Gmail, asegúrate de usar una contraseña de aplicación

### Error: "Connection timeout"
- Verifica que `SMTP_HOST` y `SMTP_PORT` sean correctos
- Revisa tu firewall/antivirus

### No se envían emails
- Verifica que las variables estén en el archivo `.env` del servidor
- Revisa los logs del servidor para ver errores específicos
- Asegúrate de que el usuario tenga un email válido en la base de datos

