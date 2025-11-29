# 🔔 Configuración VAPID para Push Notifications (PWA)

Este documento explica cómo configurar las claves VAPID para habilitar Push Notifications en SecretariaPro.

## ¿Qué es VAPID?

VAPID (Voluntary Application Server Identification) es un protocolo que permite a los servidores identificarse con los servicios de push (como Firebase Cloud Messaging) sin necesidad de tokens de autenticación complejos.

## Paso 1: Generar las Claves VAPID

### Opción A: Usando el Script Automático (Recomendado)

1. Abre una terminal en la carpeta `server/`
2. Ejecuta el siguiente comando:

```bash
npm run generate-vapid
```

3. Verás algo como esto:

```
🔑 Generando claves VAPID...

✅ Claves VAPID generadas exitosamente!

📋 Copia estas claves a tu archivo .env:

────────────────────────────────────────────────────────────
VAPID_PUBLIC_KEY=BGx...tu-clave-publica...xyz
VAPID_PRIVATE_KEY=abc...tu-clave-privada...123
VAPID_SUBJECT=mailto:tu-email@ejemplo.com
────────────────────────────────────────────────────────────
```

### Opción B: Usando web-push CLI

Si prefieres usar la CLI directamente:

```bash
cd server
npx web-push generate-vapid-keys
```

## Paso 2: Configurar en el Backend

1. Abre el archivo `.env` en la carpeta `server/`
2. Agrega las claves generadas:

```env
VAPID_PUBLIC_KEY=tu-clave-publica-generada
VAPID_PRIVATE_KEY=tu-clave-privada-generada
VAPID_SUBJECT=mailto:tu-email@ejemplo.com
```

**⚠️ IMPORTANTE:**
- Reemplaza `tu-email@ejemplo.com` con tu email real
- La clave privada (`VAPID_PRIVATE_KEY`) es SECRETA - nunca la compartas
- La clave pública (`VAPID_PUBLIC_KEY`) es segura de compartir (se usa en el frontend)

## Paso 3: Verificar la Configuración

1. Reinicia el servidor backend
2. Abre el sistema en el navegador
3. Inicia sesión
4. El sistema intentará registrar automáticamente las push notifications

### Verificar en el Navegador

1. Abre las **Herramientas de Desarrollador** (F12)
2. Ve a la pestaña **Application** (Chrome) o **Storage** (Firefox)
3. En el menú lateral, busca **Service Workers**
4. Deberías ver `sw.js` registrado
5. En **Push Messaging**, deberías ver una suscripción activa

## Cómo Funciona

### Flujo de Push Notifications

1. **Registro del Service Worker**: Al iniciar sesión, el sistema registra un Service Worker (`sw.js`)
2. **Suscripción**: El navegador solicita permiso y crea una suscripción usando la clave pública VAPID
3. **Registro en el Servidor**: La suscripción se guarda en la base de datos
4. **Envío de Notificaciones**: Cuando ocurre un evento (tarea asignada, evento próximo, etc.), el servidor envía una push notification
5. **Recepción**: El Service Worker recibe la notificación y la muestra al usuario

### Cuándo se Envían Push Notifications

Las push notifications se envían automáticamente cuando:

- ✅ Se asigna una tarea a un usuario
- ✅ Se asigna un evento a un usuario
- ✅ Se sube un documento importante
- ✅ Cambia el estado de una tarea
- ✅ Cambia la prioridad de una tarea
- ✅ Hay un recordatorio de evento (1 hora antes, 1 día antes, hoy)

## Permisos del Navegador

### Solicitar Permiso

La primera vez que un usuario inicia sesión, el navegador pedirá permiso para mostrar notificaciones:

- **Permitir**: El usuario recibirá push notifications
- **Bloquear**: No se enviarán notificaciones (pero el sistema seguirá funcionando)

### Cambiar Permisos

El usuario puede cambiar los permisos en cualquier momento:

**Chrome/Edge:**
1. Click en el ícono de candado en la barra de direcciones
2. Busca "Notificaciones"
3. Cambia a "Permitir" o "Bloquear"

**Firefox:**
1. Click en el ícono de información (i) en la barra de direcciones
2. Busca "Permisos"
3. Cambia "Notificaciones"

## Solución de Problemas

### Error: "VAPID keys not configured"

**Causa**: Las claves VAPID no están en el archivo `.env` o el servidor no se reinició.

**Solución**:
1. Verifica que las claves estén en `server/.env`
2. Reinicia el servidor backend
3. Verifica que no haya espacios extra en las claves

### Error: "Service Worker registration failed"

**Causa**: El archivo `sw.js` no se encuentra o hay un error en el código.

**Solución**:
1. Verifica que `public/sw.js` exista
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña **Console** y busca errores
4. Verifica que el servidor esté sirviendo archivos estáticos correctamente

### Las Notificaciones No Aparecen

**Posibles causas**:

1. **Permisos bloqueados**: El usuario bloqueó las notificaciones
   - Solución: Pedir al usuario que permita notificaciones en la configuración del navegador

2. **Suscripción no registrada**: La suscripción no se guardó en el servidor
   - Solución: Verificar en la consola del navegador si hay errores al suscribirse

3. **Claves VAPID incorrectas**: Las claves no coinciden
   - Solución: Regenerar las claves y actualizar el `.env`

4. **Navegador no soportado**: Algunos navegadores no soportan push notifications
   - Solución: Usar Chrome, Firefox, Edge o Safari (versiones recientes)

### Verificar Suscripción en la Base de Datos

Puedes verificar si las suscripciones se están guardando:

```sql
SELECT * FROM push_subscriptions;
```

Si no hay registros, significa que las suscripciones no se están guardando correctamente.

## Prueba Manual

### Probar Push Notifications

1. **Asegúrate de estar autenticado**
2. **Verifica que el Service Worker esté registrado** (F12 > Application > Service Workers)
3. **Crea una tarea y asígnala a ti mismo**
4. **Deberías recibir una notificación push**

### Probar desde la Consola del Navegador

Puedes probar manualmente desde la consola:

```javascript
// Verificar suscripción
navigator.serviceWorker.ready.then(registration => {
  registration.pushManager.getSubscription().then(subscription => {
    console.log('Suscripción:', subscription);
  });
});

// Verificar permisos
console.log('Permisos:', Notification.permission);
```

## Seguridad

### ⚠️ Importante

- **NUNCA** compartas tu `VAPID_PRIVATE_KEY`
- **NUNCA** subas el archivo `.env` a repositorios públicos
- **SIEMPRE** usa HTTPS en producción (las push notifications requieren HTTPS)
- **MANTÉN** las claves VAPID seguras y privadas

### En Producción

1. Usa variables de entorno del servidor (no archivos `.env`)
2. Asegúrate de usar HTTPS
3. Configura correctamente el `VAPID_SUBJECT` con un email válido
4. Monitorea los logs para detectar intentos de suscripción fallidos

## Compatibilidad

### Navegadores Soportados

- ✅ Chrome 42+
- ✅ Firefox 44+
- ✅ Edge 17+
- ✅ Safari 16+ (iOS 16.4+)
- ✅ Opera 29+

### Dispositivos

- ✅ Desktop (Windows, macOS, Linux)
- ✅ Android (Chrome, Firefox)
- ⚠️ iOS (Safari 16.4+ solamente, requiere iOS 16.4+)

## Recursos Adicionales

- [Documentación de Web Push](https://web.dev/push-notifications-overview/)
- [VAPID Specification](https://tools.ietf.org/html/rfc8292)
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## Próximas Mejoras

- [ ] Panel de administración para ver suscripciones activas
- [ ] Estadísticas de notificaciones enviadas
- [ ] Configuración de preferencias de notificaciones por usuario
- [ ] Notificaciones programadas
- [ ] Soporte para notificaciones en segundo plano

