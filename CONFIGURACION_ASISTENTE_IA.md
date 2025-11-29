# 🤖 Configuración del Asistente IA

Este documento explica cómo configurar el Asistente Virtual IA en SecretariaPro usando Google Gemini.

## Requisitos

- Una cuenta de Google
- Acceso a Google AI Studio para obtener una API Key

## Paso 1: Obtener la API Key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Get API Key" o "Obtener clave de API"
4. Selecciona o crea un proyecto de Google Cloud
5. Copia la API Key generada

## Paso 2: Configurar en el Backend

Agrega la siguiente variable a tu archivo `.env` en la carpeta `server/`:

```env
GEMINI_API_KEY=tu-api-key-aqui
```

### Modelos Disponibles

Puedes especificar qué modelo usar agregando esta variable (opcional):

```env
GEMINI_MODEL=gemini-1.5-flash
```

**Modelos recomendados:**

- `gemini-1.5-flash` (por defecto) - Más rápido, ideal para respuestas rápidas
- `gemini-1.5-pro` - Más potente, mejor para tareas complejas
- `gemini-pro` - Modelo anterior (aún funciona pero menos recomendado)

## Paso 3: Verificar la Configuración

1. Reinicia el servidor backend
2. Abre el Asistente IA desde el sistema
3. Haz una pregunta de prueba, por ejemplo: "Hola, ¿cómo estás?"

Si ves una respuesta, la configuración es correcta.

## Características del Asistente

El Asistente IA puede ayudarte con:

### 📧 Redacción de Correos
- Correos profesionales y formales
- Correos amigables pero profesionales
- Sugerencias de asuntos
- Estructura y formato

### 📝 Organización
- Organizar ideas y tareas
- Crear listas estructuradas
- Resumir información
- Priorizar actividades

### 📅 Calendario y Horarios
- Sugerencias de horarios
- Planificación de eventos
- Gestión de tiempo
- Recordatorios

### 💡 Información del Sistema
- Preguntas sobre cómo usar SecretariaPro
- Explicaciones de funcionalidades
- Guías y consejos

### 📊 Análisis y Resúmenes
- Resumir documentos
- Analizar información
- Extraer puntos clave

## Historial de Conversación

El Asistente mantiene un historial de las últimas 10 interacciones para proporcionar respuestas más contextuales. Puedes limpiar el historial haciendo clic en el icono de papelera en el header del modal.

## Límites y Cuotas

Google Gemini tiene límites de uso según tu plan:

- **Plan Gratuito**: 15 solicitudes por minuto (RPM)
- **Plan de Pago**: Límites más altos según tu configuración

Si excedes los límites, verás un mensaje de error. Espera unos minutos antes de intentar nuevamente.

## Solución de Problemas

### Error: "Gemini API Key not configured"
- Verifica que `GEMINI_API_KEY` esté en tu archivo `.env` del servidor
- Asegúrate de que el archivo `.env` esté en la carpeta `server/`
- Reinicia el servidor después de agregar la variable

### Error: "Se ha excedido el límite de solicitudes"
- Has excedido el límite de solicitudes por minuto
- Espera 1-2 minutos antes de intentar nuevamente
- Considera actualizar a un plan de pago si necesitas más solicitudes

### Error: "La solicitud fue bloqueada por filtros de seguridad"
- Tu pregunta puede haber activado los filtros de seguridad de Google
- Reformula tu pregunta de manera más clara y profesional
- Evita contenido inapropiado o sensible

### El Asistente no responde
- Verifica tu conexión a internet
- Revisa los logs del servidor para ver errores específicos
- Asegúrate de que la API Key sea válida y no haya expirado

## Personalización

### Cambiar el Modelo

Edita `server/controllers/aiController.js` y modifica la función `getModel()`:

```javascript
const getModel = () => {
  const ai = getAIClient();
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-pro'; // Cambiar aquí
  // ...
};
```

### Personalizar las Instrucciones del Sistema

Edita el `systemInstruction` en `server/controllers/aiController.js` para cambiar cómo se comporta el asistente.

## Costos

- **Plan Gratuito**: Gratis hasta cierto límite de solicitudes
- **Plan de Pago**: Consulta los precios actuales en [Google AI Studio](https://aistudio.google.com/pricing)

## Seguridad

- **Nunca compartas tu API Key**: Mantén tu `.env` privado y no lo subas a repositorios públicos
- **Usa variables de entorno**: Nunca hardcodees la API Key en el código
- **Revisa los logs**: Monitorea el uso de la API para detectar uso no autorizado

## Próximas Mejoras

- [ ] Integración con el contexto del sistema (tareas, eventos, documentos)
- [ ] Sugerencias automáticas basadas en el contenido
- [ ] Exportación de conversaciones
- [ ] Múltiples asistentes especializados

## Recursos Adicionales

- [Documentación de Gemini API](https://ai.google.dev/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [Ejemplos de uso](https://github.com/google/generative-ai-docs)

