const BANNED_WORDS = [
  'pendejo', 'pendeja', 'estupido', 'estupida', 'idiota', 'imbecil',
  'puto', 'puta', 'chingar', 'chinga', 'cabron', 'cabrona',
  'culero', 'culera', 'mierda', 'verga', 'mames', 'weon', 'zorra'
  // ... puedes seguir expandiendo la lista
];

/**
 * Mapa de caracteres para normalizar "l33t speak" y símbolos comunes
 */
const NORMALIZE_MAP = {
  '4': 'a', '@': 'a', '3': 'e', '1': 'i', '!': 'i', 
  '0': 'o', '7': 't', '5': 's', '$': 's', '8': 'b'
};

/**
 * Limpia el texto de mañas comunes antes de la validación
 */
const normalizeText = (text) => {
  let normalized = text.toLowerCase();

  // 1. Reemplazar números y símbolos por letras según el mapa
  Object.keys(NORMALIZE_MAP).forEach(key => {
    normalized = normalized.split(key).join(NORMALIZE_MAP[key]);
  });

  // 2. Eliminar acentos/tildes
  normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 3. Eliminar caracteres especiales, puntos y espacios extras 
  // Esto detecta: "p.e.n.d.e.j.o" o "p e n d e j o" como "pendejo"
  normalized = normalized.replace(/[^a-zA-Z]/g, '');

  return normalized;
};

export const filterBadWords = (text) => {
  if (!text) return '';
  
  // Dividimos el texto en palabras para procesar una por una
  const words = text.split(/\s+/);
  
  const cleanWords = words.map(originalWord => {
    // Normalizamos la palabra individual para revisarla
    const cleanWord = normalizeText(originalWord);
    
    // Verificamos si la palabra normalizada existe en nuestra "lista negra"
    const isBad = BANNED_WORDS.some(banned => cleanWord.includes(banned));
    
    // Si es mala, censuramos la palabra original (la que tiene los símbolos)
    return isBad ? '*'.repeat(originalWord.length) : originalWord;
  });

  return cleanWords.join(' ');
};

/**
 * Versión agresiva: detecta si el mensaje completo (sin espacios) contiene una grosería
 */
export const hasBadWords = (text) => {
  const normalizedMessage = normalizeText(text);
  return BANNED_WORDS.some(word => normalizedMessage.includes(word));
};