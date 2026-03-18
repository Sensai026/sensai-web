import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles, Trash2 } from 'lucide-react';
import { getSensaiResponse } from '../../services/groq.service';
import { getUserSettings } from '../../services/user.service';
import { saveChatMessage, getChatHistory, deleteFullChatHistory } from '../../services/chat.service';
import './Chat.css';

export default function Chat({ user, onBack }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userSettings, setUserSettings] = useState({});
  const [messages, setMessages] = useState([]);

  // 1. Cargar preferencias e historial al iniciar
  useEffect(() => {
    const initChat = async () => {
      if (user?.uid) {
        // Cargar ajustes del usuario (Tono, nombre, etc.)
        const settings = await getUserSettings(user.uid);
        if (settings) {
          setUserSettings({ ...settings, nombre: user.displayName?.split(' ')[0] });
        }

        // Cargar historial persistente (con auto-limpieza de 7 días interna)
        const history = await getChatHistory(user.uid);
        if (history.length > 0) {
          setMessages(history);
        } else {
          // Saludo inicial si la base de datos está vacía
          setMessages([{ 
            role: 'ai', 
            text: `Hola ${user.displayName?.split(' ')[0] || 'amigo'}, soy tu acompañante SENSAI. ¿Cómo te sientes en este momento?`,
            timestamp: new Date().toISOString()
          }]);
        }
      }
    };
    initChat();
  }, [user]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMsg = { 
      role: 'user', 
      text: userText, 
      timestamp: new Date().toISOString() 
    };
    
    // Actualizar UI y limpiar input
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Guardar mensaje del usuario en Firestore (en segundo plano)
    saveChatMessage(user.uid, userMsg);

    try {
      // Obtener respuesta de la IA pasando el historial y los ajustes
      const aiResponseText = await getSensaiResponse(updatedMessages, userSettings);
      
      const aiMsg = { 
        role: 'ai', 
        text: aiResponseText, 
        timestamp: new Date().toISOString() 
      };

      // Guardar respuesta de la IA en Firestore
      saveChatMessage(user.uid, aiMsg);
      
      // Actualizar UI con la respuesta de la IA
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error en la comunicación con SENSAI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    if (window.confirm("¿Estás seguro de borrar TODA tu historia con SENSAI de la base de datos? Esta acción no se puede deshacer.")) {
      const success = await deleteFullChatHistory(user.uid);
      if (success) {
        setMessages([{ 
          role: 'ai', 
          text: "Historial borrado correctamente. ¿Hay algo nuevo en lo que pueda apoyarte?",
          timestamp: new Date().toISOString()
        }]);
      }
    }
  };

  return (
    <div className="chat-layout">
      <header className="chat-header">
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="back-btn">
              <ArrowLeft size={22} />
            </button>
            <div className="chat-title">
              <div className="bg-brain-purple/10 p-2 rounded-xl">
                <Sparkles className="text-brain-purple" size={24} />
              </div>
              <div>
                <h2 className="font-black text-leaf-dark leading-none">SENSAI IA</h2>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">En línea</span>
              </div>
            </div>
          </div>
          
          <button onClick={clearChat} title="Borrar historial" className="text-gray-400 hover:text-red-500 transition-colors p-2">
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      <main className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === 'ai' ? 'ai-message' : 'user-message'}>
            {msg.text}
          </div>
        ))}
        
        {isLoading && (
          <div className="ai-message opacity-60 italic flex items-center gap-2">
            <span className="animate-bounce">...</span> SENSAI está pensando
          </div>
        )}
      </main>

      <footer className="chat-input-area">
        <div className="max-w-4xl mx-auto input-wrapper">
          <input 
            className="chat-input"
            type="text" 
            placeholder="Habla con SENSAI..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            className="send-btn" 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-3 uppercase tracking-tighter">
          SENSAI IA puede cometer errores. El acompañamiento digital no sustituye la terapia profesional.
        </p>
      </footer>
    </div>
  );
}