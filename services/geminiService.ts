import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize GenAI only if key exists (prevent crash on load, handle at call time)
const getAIClient = () => {
  if (!apiKey) {
    console.warn("API Key missing for Gemini");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const askAssistant = async (prompt: string, context?: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Por favor configura la API Key de Gemini para usar el asistente.";

  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `Eres un asistente virtual ejecutivo altamente eficiente, amable y profesional llamado "Secretaria IA". 
    Tu trabajo es ayudar a organizar documentos, redactar correos electrónicos elegantes, sugerir horarios y resumir tareas.
    Responde siempre en español con un tono profesional pero cálido. 
    Usa formato Markdown para resaltar puntos importantes.
    ${context ? `Contexto actual del usuario: ${context}` : ''}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "No pude generar una respuesta.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Lo siento, hubo un error al consultar con mi cerebro digital.";
  }
};

export const draftEmail = async (recipient: string, topic: string, tone: 'formal' | 'friendly' = 'formal'): Promise<string> => {
  const prompt = `Redacta un correo electrónico para ${recipient} sobre el tema: "${topic}". El tono debe ser ${tone === 'formal' ? 'estrictamente formal y elegante' : 'amable y cercano pero profesional'}. Incluye asunto sugerido.`;
  return askAssistant(prompt);
};