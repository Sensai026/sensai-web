import { db } from "../config/firebase";
import { doc, setDoc, getDoc, writeBatch, collection, query, where, getDocs } from "firebase/firestore";

/**
 * Guarda las preferencias de la IA
 */
export const saveUserSettings = async (uid, settings) => {
  if (!uid) return false;
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { 
      settings,
      lastUpdate: new Date().toISOString() 
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error al guardar en Firestore:", error);
    return false;
  }
};

/**
 * Recupera las preferencias del usuario 
 */
export const getUserSettings = async (uid) => {
  if (!uid) return null;
  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    
    // Si el documento existe, regresamos solo los settings
    if (docSnap.exists()) {
      return docSnap.data().settings;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener de Firestore:", error);
    return null;
  }
};

/**
 * Elimina de forma atómica los datos asociados al usuario en Firestore.
 */
export const deleteUserAccountData = async (uid) => {
  if (!uid) return false;

  try {
    const batch = writeBatch(db);

    // 1. Perfil/configuración
    batch.delete(doc(db, "users", uid));

    // 2. Historial de chat
    batch.delete(doc(db, "chats", uid));

    // 3. Alertas de crisis
    const alertsQuery = query(collection(db, "alerts"), where("userId", "==", uid));
    const alertsSnap = await getDocs(alertsQuery);
    alertsSnap.forEach((alertDoc) => batch.delete(alertDoc.ref));

    // 4. Mensajes de comunidad
    const communityQuery = query(collection(db, "comunidad"), where("uid", "==", uid));
    const communitySnap = await getDocs(communityQuery);
    communitySnap.forEach((communityDoc) => batch.delete(communityDoc.ref));

    // 5. Feedback/valoraciones
    const feedbackQuery = query(collection(db, "ratings_feedback"), where("userId", "==", uid));
    const feedbackSnap = await getDocs(feedbackQuery);
    feedbackSnap.forEach((feedbackDoc) => batch.delete(feedbackDoc.ref));

    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error al eliminar los datos del usuario en Firestore:", error);
    return false;
  }
};