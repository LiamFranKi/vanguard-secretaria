# Changelog - SecretariaPro

## [2025-01-17] - Corrección de Emails y Configuración Dinámica

### ✨ Mejoras
- **Emails con Configuración Dinámica**: Los correos electrónicos ahora utilizan el nombre del sistema, colores y texto del footer configurados en la base de datos en lugar de valores hardcodeados
- **Header y Footer Dinámicos**: El header muestra el nombre del sistema configurado y el footer usa el texto personalizado de la configuración

### 🐛 Correcciones
- **Fecha en Correos de Eventos**: Corregido el error "Invalid Date" en los correos de eventos asignados. Ahora se pasa la fecha ISO correctamente y se formatea en la plantilla
- **Formato de Fechas**: Unificado el formato de fechas en todas las plantillas de email para usar fechas ISO que se formatean correctamente

### 🔧 Cambios Técnicos
- `server/services/emailService.js`:
  - Agregada función `getSystemConfig()` para obtener configuración desde BD
  - `getEmailLayout()` ahora es async y obtiene configuración dinámicamente
  - Todas las plantillas de email ahora son async
  - `getEmailSubject()` ahora es async y usa nombre del sistema dinámico
  - Footer usa `footer_text` de la configuración o texto por defecto

- `server/controllers/eventController.js`:
  - Corregido para pasar fecha ISO (`start`) en lugar de `dateStr` formateada
  - Aplicado en `createEvent()` y `updateEvent()`

- `server/services/reminderService.js`:
  - Corregido para pasar `event.start_time` (fecha ISO) en lugar de `dateStr` formateada
  - Aplicado en recordatorios de 1 día antes

### 📧 Plantillas de Email Actualizadas
- `taskAssigned`: Usa configuración dinámica
- `eventAssigned`: Corregida fecha y usa configuración dinámica
- `eventReminder1h`: Usa configuración dinámica
- `eventReminder1d`: Corregida fecha y usa configuración dinámica
- `eventReminderToday`: Usa configuración dinámica
- `taskStatusChanged`: Usa configuración dinámica
- `taskPriorityChanged`: Usa configuración dinámica
- `documentUploaded`: Usa configuración dinámica

---

## [2025-01-16] - Sistema de Emails, Asistente IA y Push Notifications

### ✨ Nuevas Funcionalidades
- **Sistema de Emails Elegantes**: Implementado sistema completo de envío de correos con plantillas HTML profesionales usando `nodemailer`
- **Plantillas de Email**: 8 plantillas diferentes para tareas, eventos, recordatorios y documentos
- **Asistente IA Mejorado**: Integración con Google Gemini API (configurable entre `gemini-1.5-flash` y `gemini-1.5-pro`)
- **Historial de Conversación**: El asistente IA ahora mantiene contexto de las últimas 10 interacciones
- **Renderizado Markdown**: Respuestas del asistente IA se renderizan con formato Markdown usando `react-markdown` y `remark-gfm`
- **Push Notifications PWA**: Sistema completo de notificaciones push para PWA con VAPID keys
- **Service Worker**: Implementado para manejar push notifications y eventos de notificación

### 🔧 Cambios Técnicos
- Agregado `server/services/emailService.js` con plantillas HTML profesionales
- Agregado `server/services/pushService.ts` para gestión de suscripciones push
- Agregado `public/sw.js` para Service Worker
- Agregado `server/scripts/generate-vapid-keys.js` para generar claves VAPID
- Actualizado `server/controllers/aiController.js` para usar modelo configurable y mantener historial
- Actualizado `components/AssistantModal.tsx` para renderizar Markdown y mantener historial
- Actualizado `server/utils/notificationHelper.js` para enviar emails automáticamente
- Agregadas variables de entorno para SMTP, Gemini API y VAPID

### 📚 Documentación
- `CONFIGURACION_EMAILS.md`: Guía para configurar Gmail App Passwords y SMTP
- `CONFIGURACION_ASISTENTE_IA.md`: Guía para obtener y configurar Gemini API Key
- `CONFIGURACION_VAPID_PWA.md`: Guía para generar y configurar claves VAPID

### 🔔 Notificaciones por Email
- Tareas asignadas
- Eventos asignados
- Recordatorios de eventos (1 hora antes, 1 día antes, mismo día)
- Documentos importantes subidos
- Cambios de estado de tareas
- Cambios de prioridad de tareas

---

