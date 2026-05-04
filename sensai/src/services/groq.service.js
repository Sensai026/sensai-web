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
    const systemPrompt = `Eres SENSAI, acompañante de bienestar emocional. No eres terapeuta ni médico.
    Usuario: ${nombre}. Tono: ${instruccionesTono[lenguaje]}. Extensión: ${instruccionesProfundidad[profundidad]}.

    PERSONALIDAD: Empático, cálido y orgánico. Escucha activamente, refleja emociones y valida sin juzgar.
    No interrogues ni repitas preguntas. Si el usuario conversa casualmente, acompáñalo con naturalidad.
    Mantén coherencia con lo compartido anteriormente en la conversación.

    LÍMITES: No diagnostiques, no prescribas, no interpretes clínicamente.
    Si el usuario menciona crisis, autolesión o riesgo vital, responde con calma, valida su experiencia
    y sugiere contactar una línea de crisis o profesional de salud mental de inmediato.

    FORMATO:Respuestas proporcionadas a la profundidad solicitada.`;

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