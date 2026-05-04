import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  Trash2, 
  AlertCircle, 
  Phone, 
  X 
} from 'lucide-react';

import { getSensaiResponse } from '../../services/groq.service';
import { getUserSettings } from '../../services/user.service';
import { saveChatMessage, getChatHistory, deleteFullChatHistory } from '../../services/chat.service';
// Importación unificada del servicio de crisis
import { checkForCrisis, registerCrisisAlert, CRISIS_RESOURCES } from '../../services/crisis.service';

import './Chat.css';

export default function Chat({ user, onBack }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userSettings, setUserSettings] = useState({});
  const [messages, setMessages] = useState([]);
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  useEffect(() => {
    const initChat = async () => {
      if (user?.uid) {
        const settings = await getUserSettings(user.uid);
        if (settings) {
          setUserSettings({ ...settings, nombre: user.displayName?.split(' ')[0] });
        }

        const history = await getChatHistory(user.uid);
        if (history.length > 0) {
          setMessages(history);
        } else {
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

    // --- LÓGICA DE CRISIS INTEGRADA ---
    if (checkForCrisis(userText)) {
      // 1. Mostrar apoyo visual inmediato al usuario
      setShowCrisisModal(true);
      
      // 2. Registrar en la nube para activar la campana del Dashboard
      // No usamos 'await' aquí para no bloquear el envío del mensaje
      registerCrisisAlert(
        user.uid, 
        user.displayName, 
        `Detección automática: "${userText.substring(0, 60)}..."`
      ).catch(err => console.error("Error al registrar alerta en nube:", err));
    }
    // ----------------------------------

    const userMsg = { 
      role: 'user', 
      text: userText, 
      timestamp: new Date().toISOString() 
    };
    
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    saveChatMessage(user.uid, userMsg);

    try {
      const aiResponseText = await getSensaiResponse(updatedMessages, userSettings);
      
      const aiMsg = { 
        role: 'ai', 
        text: aiResponseText, 
        timestamp: new Date().toISOString() 
      };

      saveChatMessage(user.uid, aiMsg);
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error en la comunicación con SENSAI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    if (window.confirm("¿Estás seguro de borrar TODA tu historia con SENSAI?")) {
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
    <div className="chat-layout relative">
      
      {/* MODAL DE CRISIS */}
      {showCrisisModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border-4 border-red-50">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-red-100 p-3 rounded-2xl text-red-600">
                <AlertCircle size={32} />
              </div>
              <button 
                onClick={() => setShowCrisisModal(false)} 
                className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <h2 className="text-2xl font-black text-leaf-dark mb-4 leading-tight">No estás solo, queremos apoyarte.</h2>
            <p className="text-gray-600 mb-8 font-medium">Tu bienestar es nuestra prioridad. Si necesitas hablar con un profesional ahora mismo, puedes llamar gratuitamente:</p>
            
            <div className="space-y-3">
              <a 
                href={`tel:${CRISIS_RESOURCES.lineaDeLaVida.numero}`} 
                className="flex items-center justify-between bg-leaf-dark text-white p-5 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Phone size={20} />
                  <span>{CRISIS_RESOURCES.lineaDeLaVida.nombre}</span>
                </div>
                <span className="text-sm opacity-80">{CRISIS_RESOURCES.lineaDeLaVida.numero}</span>
              </a>
              <p className="text-[10px] text-center text-gray-400 uppercase font-bold tracking-widest pt-2">
                Disponible las 24 horas
              </p>
            </div>
          </div>
        </div>
      )}

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