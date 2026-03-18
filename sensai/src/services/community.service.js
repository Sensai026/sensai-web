import { db } from "../config/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";

// REVISA QUE ESTA LÍNEA TENGA EL "export const"
export const sendCommunityMessage = async (uid, userName, text) => {
  try {
    await addDoc(collection(db, "comunidad"), {
      uid,
      userName,
      text,
      timestamp: serverTimestamp() 
    });
  } catch (error) {
    console.error("Error al enviar a comunidad:", error);
  }
};

// REVISA QUE ESTA LÍNEA TAMBIÉN TENGA EL "export const"
export const subscribeToCommunity = (callback) => {
  const q = query(
    collection(db, "comunidad"),
    orderBy("timestamp", "asc"),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};