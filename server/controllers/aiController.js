import { GoogleGenerativeAI } from '@google/generative-ai';

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API Key not configured');
  }
  return new GoogleGenerativeAI(apiKey);
};

// Obtener el modelo de Gemini (preferir gemini-1.5-flash por velocidad, o gemini-1.5-pro por calidad)
const getModel = () => {
  const ai = getAIClient();
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  return ai.getGenerativeModel({ 
    model: modelName,
    systemInstruction: `Eres "Secretaria IA", un asistente virtual ejecutivo altamente eficiente, amable y profesional.

Tu función es ayudar a los usuarios con:
- Redacción de correos electrónicos profesionales y elegantes
- Organización de documentos y tareas
- Sugerencias de horarios y calendarios
- Resúmenes de información importante
- Respuestas a preguntas sobre el sistema SecretariaPro

INSTRUCCIONES IMPORTANTES:
1. Responde SIEMPRE en español
2. Usa un tono profesional pero cálido y amigable
3. Usa formato Markdown para estructurar tus respuestas:
   - **negrita** para énfasis
   - *cursiva* para detalles
   - Listas con - o 1.
   - \`código\` para comandos o nombres técnicos
4. Sé conciso pero completo
5. Si no sabes algo, admítelo honestamente
6. Ofrece sugerencias prácticas y útiles`
  });
};

export const askAssistant = async (req, res) => {
  try {
    const { prompt, context, conversationHistory } = req.body;
    
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'El prompt es requerido' });
    }

    const model = getModel();
    
    // Construir el contexto completo
    let fullPrompt = prompt;
    
    if (context) {
      fullPrompt = `Contexto del usuario: ${context}\n\nPregunta: ${prompt}`;
    }
    
    // Si hay historial de conversación, incluirlo
    let history = [];
    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      // Limitar el historial a las últimas 10 interacciones para no exceder tokens
      const recentHistory = conversationHistory.slice(-10);
      history = recentHistory.map((item) => ({
        role: item.role || 'user',
        parts: [{ text: item.text || item.content || '' }]
      }));
    }

    // Generar contenido
    const result = await model.generateContent({
      contents: history.length > 0 
        ? [...history, { role: 'user', parts: [{ text: fullPrompt }] }]
        : [{ role: 'user', parts: [{ text: fullPrompt }] }]
    });
    
    const response = result.response;
    const text = response.text();
    
    if (!text) {
      return res.status(500).json({ error: 'No se pudo generar una respuesta' });
    }

    res.json({ 
      response: text,
      usage: {
        promptTokens: response.usageMetadata?.promptTokenCount || 0,
        candidatesTokens: response.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: response.usageMetadata?.totalTokenCount || 0
      }
    });
  } catch (error) {
    console.error('Gemini Error:', error);
    
    // Manejo de errores específicos
    if (error.message?.includes('API_KEY')) {
      return res.status(500).json({ 
        error: 'La clave de API de Gemini no está configurada correctamente' 
      });
    }
    
    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return res.status(429).json({ 
        error: 'Se ha excedido el límite de solicitudes. Por favor, intenta más tarde.' 
      });
    }
    
    if (error.message?.includes('safety')) {
      return res.status(400).json({ 
        error: 'La solicitud fue bloqueada por filtros de seguridad. Por favor, reformula tu pregunta.' 
      });
    }
    
    res.status(500).json({ 
      error: error.message || 'Error al consultar con el asistente IA' 
    });
  }
};

export const draftEmail = async (req, res) => {
  try {
    const { recipient, topic, tone, additionalInfo } = req.body;
    
    if (!recipient || !topic) {
      return res.status(400).json({ error: 'El destinatario y el tema son requeridos' });
    }

    const model = getModel();
    
    const toneDescription = tone === 'formal' 
      ? 'estrictamente formal, elegante y profesional'
      : 'amable, cercano pero profesional';
    
    let prompt = `Redacta un correo electrónico profesional con las siguientes especificaciones:

- Destinatario: ${recipient}
- Tema/Asunto: ${topic}
- Tono: ${toneDescription}
${additionalInfo ? `- Información adicional: ${additionalInfo}` : ''}

IMPORTANTE:
1. Incluye un asunto sugerido al inicio
2. Usa formato Markdown para estructurar el correo
3. El correo debe ser claro, conciso y profesional
4. Incluye una despedida apropiada
5. Si es necesario, sugiere próximos pasos o acciones`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    if (!text) {
      return res.status(500).json({ error: 'No se pudo generar el correo' });
    }

    res.json({ 
      email: text,
      usage: {
        promptTokens: response.usageMetadata?.promptTokenCount || 0,
        candidatesTokens: response.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: response.usageMetadata?.totalTokenCount || 0
      }
    });
  } catch (error) {
    console.error('Gemini Error:', error);
    
    if (error.message?.includes('API_KEY')) {
      return res.status(500).json({ 
        error: 'La clave de API de Gemini no está configurada correctamente' 
      });
    }
    
    res.status(500).json({ 
      error: error.message || 'Error al generar el correo' 
    });
  }
};

