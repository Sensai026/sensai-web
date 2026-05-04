import { db } from '../config/firebase'; // <--- Ajustado a tu ruta real
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

const RISK_KEYWORDS = [
  // Términos Directos e Ideación
  'morir', 'matarme', 'suicidio', 'quitarme la vida', 'hacerme daño', 
  'suicidarme', 'autolesion', 'fin a mi vida', 'terminar con todo',
  'dejar de existir', 'no quiero despertar', 'muerte',

  // Métodos (Detección preventiva)
  'cortarme', 'pastillas para morir', 'ahorcarme', 'veneno', 'colgarme', 
  'sobredosis', 'armas', 'saltar de', 'puente', 'asfixia', 'desangrar',

  // Expresiones de Desesperanza Profunda
  'ya no quiero vivir', 'desaparecer', 'no puedo más', 'mi vida no vale nada',
  'estaría mejor muerto', 'no hay salida', 'mi familia estará mejor sin mí',
  'odio mi vida', 'estoy harto de vivir', 'todo se acabó para mí',
  'no tiene sentido seguir', 'ya me rendí', 'nadie me extrañaría',

  // Eufemismos y frases indirectas
  'irme lejos para siempre', 'descansar en paz', 'dormir y no despertar',
  'el mundo es mejor sin mí', 'plan para irme', 'carta de despedida'
];

export const checkForCrisis = (text) => {
  if (!text) return false;
  const cleanText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  return RISK_KEYWORDS.some(word => {
    const cleanWord = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return cleanText.includes(cleanWord);
  });
};

/**
 * 2. REGISTRO EN FIREBASE (Para la permanencia)
 * Llama a esta función cuando checkForCrisis sea true
 */
export const registerCrisisAlert = async (userId, userName, message) => {
  try {
    await addDoc(collection(db, 'alerts'), {
      userId,
      userName,
      message: message || "Se ha detectado un indicador de riesgo en el chat.",
      status: 'active',
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error al registrar alerta en la nube:", error);
  }
};

/**
 * 3. SUSCRIPCIÓN PARA EL DASHBOARD (Lo que te pide el error)
 */
export const subscribeToCrisisAlerts = (userId, callback) => {
  if (!userId) return () => {};

  const q = query(
    collection(db, 'alerts'),
    where('userId', '==', userId),
    where('status', '==', 'active'),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const alerts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Formateo de fecha para la UI del Dashboard
      timestamp: doc.data().timestamp?.toDate().toLocaleString('es-MX') || 'Reciente'
    }));
    callback(alerts);
  });
};

export const CRISIS_RESOURCES = {
  lineaDeLaVida: {
    nombre: "Línea de la Vida",
    numero: "800-911-2000",
    descripcion: "Atención especializada sobre salud mental y crisis.",
    disponibilidad: "24/7, los 365 días del año"
  }
};