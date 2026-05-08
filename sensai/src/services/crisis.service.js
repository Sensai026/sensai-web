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
    const docRef = await addDoc(collection(db, 'alerts'), {
      userId,
      userName,
      message: message || "Se ha detectado un indicador de riesgo en el chat.",
      status: 'active',
      timestamp: serverTimestamp() // Usa la hora del servidor, no la del celular
    });
    console.log("Alerta sincronizada en la nube con ID:", docRef.id);
  } catch (error) {
    console.error("Error al registrar alerta:", error);
  }
};

/**
 * 3. SUSCRIPCIÓN PARA EL DASHBOARD (Lo que te pide el error)
 */
export const subscribeToCrisisAlerts = (userId, callback) => {
  if (!userId) return () => {};

  // Referencia a la colección
  const alertsRef = collection(db, 'alerts');

  // Consulta: Si falla el orderBy por falta de índice, 
  // quita el orderBy temporalmente para probar.
  const q = query(
    alertsRef,
    where('userId', '==', userId),
    where('status', '==', 'active'),
    orderBy('timestamp', 'desc') 
  );

  return onSnapshot(q, 
    (snapshot) => {
      const alerts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // ✅ MEJORA: Manejo más robusto del tiempo para evitar errores entre dispositivos
          timestamp: data.timestamp 
            ? data.timestamp.toDate().toLocaleString('es-MX', { hour12: true }) 
            : 'Sincronizando...'
        };
      });
      callback(alerts);
    },
    (error) => {
      // ⚠️ IMPORTANTE: Si ves este error en la consola del navegador, 
      // te dará un LINK para crear el índice automáticamente.
      console.error("Error en suscripción de alertas:", error);
    }
  );
};

export const CRISIS_RESOURCES = {
  lineaDeLaVida: {
    nombre: "Línea de la Vida",
    numero: "800-911-2000",
    descripcion: "Atención especializada sobre salud mental y crisis.",
    disponibilidad: "24/7, los 365 días del año"
  }
};