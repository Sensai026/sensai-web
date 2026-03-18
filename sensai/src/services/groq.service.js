import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

export const getSensaiResponse = async (history, ajustes = {}) => {
  const safeHistory = Array.isArray(history) ? history : [];

  try {
    const {
      lenguaje = 'neutro',
      profundidad = 'adaptable',
      nombre = 'Usuario'
    } = ajustes;

    const instruccionesProfundidad = {
      'breve': "Respuesta corta.",
      'detallada': "Respuesta profunda (3-4 párrafos).",
      'adaptable': "Extensión según contexto."
    };

    const instruccionesTono = {
      'directo': "Tono franco y al punto.",
      'explicativo': "Tono didáctico y reflexivo.",
      'neutro': "Tono cálido y profesional."
    };

    // PROMPT 
    const systemPrompt = `Eres SENSAI, acompañante de bienestar emocional para todo público.
    Usuario: ${nombre}. Tono: ${instruccionesTono[lenguaje]}. Extensión: ${instruccionesProfundidad[profundidad]}.
    PERSONALIDAD: Orgánica, no interrogues ni repitas preguntas. Valida sin juzgar.
    Si el usuario habla de temas casuales, conversa con naturalidad sin forzar la terapia.
    REGLAS: Usa Markdown. No sustituyas ayuda profesional.`;

    const lastContext = safeHistory.slice(-6).map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.text
    }));

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...lastContext
      ],
      model: "llama-3.1-8b-instant", 
      temperature: 0.7, // Subirlo ayuda a evitar la repetición sin aumentar tokens
    });

    return chatCompletion.choices[0]?.message?.content;
  } catch (error) {
    console.error("Error en Groq Service:", error);
    return "Mi conexión falló un momento. ¿Podrías repetirme eso?";
  }
};