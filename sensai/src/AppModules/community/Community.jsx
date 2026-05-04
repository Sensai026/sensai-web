import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, ArrowLeft, ShieldAlert } from 'lucide-react';
import { sendCommunityMessage, subscribeToCommunity } from '../../services/community.service';
import { filterBadWords } from '../../services/moderation'; // Importamos la lógica
import './Community.css';

export default function Community({ user, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToCommunity((msgs) => {
      setMessages(msgs);
      if (msgs.length > 0) {
        setTimeout(() => {
          scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // APLICAR FILTRO DE PALABRAS
    const cleanText = filterBadWords(trimmedInput);

    try {
      const firstName = user?.displayName?.split(' ')[0] || 'Usuario';
      await sendCommunityMessage(user.uid, firstName, cleanText);
      setInput('');
    } catch (error) {
      console.error("Error al enviar:", error);
    }
  };

return (
  <div className="community-layout animate-in fade-in duration-500">
    {/* HEADER: Ahora distribuido para pantallas anchas */}
    <header className="community-header">
      <div className="header-brand flex items-center gap-4">
        <div className="bg-brain-orange/10 p-3 rounded-2xl hidden sm:block">
          <Users className="text-brain-orange" size={32} />
        </div>
        <div className="text-left">
          <h1 className="text-2xl lg:text-3xl font-black text-leaf-dark">Comunidad</h1>
          <p className="text-[10px] text-gray-400 hidden lg:block uppercase tracking-widest font-bold">
            Espacio de Bienestar compartido
          </p>
        </div>
      </div>
      
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 px-8 py-3 border-2 border-leaf-dark text-leaf-dark rounded-full font-black hover:bg-leaf-dark hover:text-white transition-all w-full sm:w-auto justify-center uppercase tracking-tighter text-sm"
      >
        <ArrowLeft size={18} />
        Volver al Dashboard
      </button>
    </header>

    {/* NORMAS: Con estilo de "badges" para mayor impacto visual */}
    <section className="forum-rules">
      <div className="flex items-center justify-center gap-2 mb-1">
        <ShieldAlert size={16} className="text-brain-orange" />
        <h3 className="text-[12px] font-black text-brain-orange uppercase tracking-widest">
          Normas de Convivencia
        </h3>
      </div>
      <ul className="rules-list">
        <li>• Sé empático y respetuoso</li>
        <li>• No compartas datos personales</li>
        <li>• Cero tolerancia al acoso</li>
      </ul>
    </section>

    {/* ÁREA DE MENSAJES: Fluida para PC/Laptop */}
    <main className="community-messages">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 italic text-center">
          <Users size={48} className="mb-4 opacity-20" />
          <p>No hay mensajes aún.</p>
          <p>¡Sé el primero en compartir algo positivo!</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`comm-msg ${msg.uid === user?.uid ? 'mine' : 'others'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <span className="msg-user text-[10px] font-black uppercase opacity-70 mb-1 block">
              {msg.userName}
            </span>
            <p className="font-medium leading-relaxed">{msg.text}</p>
          </div>
        ))
      )}
      <div ref={scrollRef} />
    </main>

    {/* BARRA DE ENTRADA: Expandida para comodidad en Laptop */}
    <form className="community-input-area" onSubmit={handleSend}>
      <div className="flex-1 relative">
         <input 
          type="text"
          className="w-full p-4 pr-16 rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-primary)] text-leaf-dark focus:outline-none focus:border-brain-orange transition-all font-medium"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje positivo para la comunidad..."
          maxLength={500}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 hidden md:block">
          {input.length}/500
        </span>
      </div>
      <button 
        type="submit" 
        className="send-btn px-8 py-4 bg-brain-orange text-white rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all" 
        disabled={!input.trim()}
      >
        <span className="hidden sm:inline font-black text-sm tracking-widest">ENVIAR</span>
        <Send size={20} />
      </button>
    </form>
  </div>
);
}