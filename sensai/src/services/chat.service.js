import { db } from "../config/firebase";
import { doc, updateDoc, arrayUnion, getDoc, setDoc, deleteDoc } from "firebase/firestore";

/**
 * Guarda un mensaje y le añade un timestamp para poder filtrarlo después
 */
export const saveChatMessage = async (uid, message) => {
  if (!uid) return;
  const chatRef = doc(db, "chats", uid);
  
  // Nos aseguramos de que el mensaje lleve la fecha de hoy
  const messageWithTime = {
    ...message,
    timestamp: new Date().toISOString()
  };

  try {
    const docSnap = await getDoc(chatRef);
    if (!docSnap.exists()) {
      await setDoc(chatRef, { messages: [messageWithTime] });
    } else {
      await updateDoc(chatRef, {
        messages: arrayUnion(messageWithTime)
      });
    }
  } catch (error) {
    console.error("Error al guardar mensaje:", error);
  }
};

/**
 * Recupera el historial y ELIMINA de Firestore lo que tenga más de 7 días
 */
export const getChatHistory = async (uid) => {
  if (!uid) return [];
  const chatRef = doc(db, "chats", uid);
  
  try {
    const docSnap = await getDoc(chatRef);
    if (!docSnap.exists()) return [];

    const allMessages = docSnap.data().messages || [];
    const SIETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;
    const ahora = new Date().getTime();

    // 1. Filtramos en memoria
    const mensajesRecientes = allMessages.filter(msg => {
      const fechaMsg = new Date(msg.timestamp).getTime();
      return (ahora - fechaMsg) < SIETE_DIAS_MS;
    });

    // 2. Si detectamos que hay mensajes viejos, limpiamos la base de datos REAL
    if (mensajesRecientes.length < allMessages.length) {
      await updateDoc(chatRef, { messages: mensajesRecientes });
      console.log("🧹 SENSAI: Se han eliminado mensajes antiguos de la base de datos.");
    }

    return mensajesRecientes;
  } catch (error) {
    console.error("Error al recuperar/limpiar historial:", error);
    return [];
  }
};

export const deleteFullChatHistory = async (uid) => {
  if (!uid) return false;
  try {
    await deleteDoc(doc(db, "chats", uid));
    return true;
  } catch (error) {
    return false;
  }
};