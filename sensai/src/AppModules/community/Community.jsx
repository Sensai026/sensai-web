import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, ArrowLeft } from 'lucide-react';
import { sendCommunityMessage, subscribeToCommunity } from '../../services/community.service';
import './Community.css';

export default function Community({ user, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // Suscripción a Firestore
  useEffect(() => {
    const unsubscribe = subscribeToCommunity((msgs) => {
      setMessages(msgs);
      // Auto-scroll suave al recibir nuevos mensajes
      if (msgs.length > 0) {
        setTimeout(() => {
          scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });

    // Limpieza de la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    
    if (!trimmedInput) return;

    try {
      // Obtenemos solo el primer nombre para el chat
      const firstName = user?.displayName?.split(' ')[0] || 'Usuario';
      
      await sendCommunityMessage(user.uid, firstName, trimmedInput);
      setInput(''); // Limpiamos el input tras enviar
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  return (
    <div className="community-layout">
      {/* Encabezado Principal */}
      <header className="community-header">
        <button onClick={onBack} className="back-btn" title="Volver al Dashboard">
          <ArrowLeft size={24} />
        </button>
        <div className="header-title">
          <Users className="text-brain-orange" />
          <h2 className="font-bold text-leaf-dark">Comunidad Sensai</h2>
        </div>
      </header>

      {/* Reglas Fijas del Foro */}
      <section className="forum-rules">
        <div className="rules-content">
          <h3 className="rules-label">Normas de Convivencia</h3>
          <ul className="rules-list">
            <li>• Sé empático y respetuoso</li>
            <li>• No compartas datos personales</li>
            <li>• Cero tolerancia al acoso</li>
          </ul>
        </div>
      </section>

      {/* Área de Mensajes */}
      <main className="community-messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>No hay mensajes aún. ¡Sé el primero en compartir algo positivo!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`comm-msg ${msg.uid === user?.uid ? 'mine' : 'others'}`}
            >
              <span className="msg-user">{msg.userName}</span>
              <p className="msg-text">{msg.text}</p>
            </div>
          ))
        )}
        {/* Referencia para el auto-scroll */}
        <div ref={scrollRef} />
      </main>

      {/* Barra de Entrada */}
      <form className="community-input-area" onSubmit={handleSend}>
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          maxLength={500}
        />
        <button type="submit" className="send-btn" disabled={!input.trim()}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}