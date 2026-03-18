import { db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

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