import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import './MemoryGame.css';

export default function MemoryGame({ 
  user, 
  onBack, 
  level, 
  setLevel, 
  startGame, 
  cards = [], // Valor por defecto para evitar errores de undefined
  flippedCards = [], 
  matchedCards = [], 
  handleCardClick, 
  popup = { show: false, text: '' }, 
  setPopup 
}) {
  
  // Verificación de seguridad: Si no hay cartas, mostramos un estado de carga 
  // o forzamos el inicio del juego para que el usuario no vea una pantalla rota.
  if (!cards || cards.length === 0) {
    return (
      <div className="memory-game-layout items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="animate-pulse text-brain-purple mx-auto" size={48} />
          <h2 className="text-xl font-bold text-slate-700">Preparando tu sesión...</h2>
          <button className="start-btn-game" onClick={startGame}>
            Comenzar ahora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="memory-game-layout">
      {/* Header con estilo SENSAI */}
      <header className="game-header-mem">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 leading-none">Recuerdos en Equilibrio</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Gimnasio Mental</p>
          </div>
        </div>
        <div className="hidden md:block bg-brain-purple/10 p-3 rounded-2xl">
          <Sparkles className="text-brain-purple" size={24} />
        </div>
      </header>

      {/* Controles de Nivel */}
      <section className="controls-section">
        <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Nivel:</label>
        <select 
          className="level-select"
          value={level} 
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="1">Calma</option>
          <option value="2">Emociones</option>
          <option value="3">Autorregulación</option>
        </select>
        <button className="start-btn-game" onClick={startGame}>
          Reiniciar
        </button>
      </section>

      {/* Tablero de Juego */}
      <main className="flex-1 w-full">
        <div 
          className="game-board-container" 
          style={{ 
            gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(cards.length))}, minmax(0, 1fr))` 
          }}
        >
          {cards.map((card, index) => {
            const isFlipped = flippedCards.includes(index) || matchedCards.includes(index);
            return (
              <div 
                key={card.id || index}
                className={`memory-card ${isFlipped ? 'memory-card-flipped' : ''}`}
                style={{ 
                  backgroundColor: isFlipped ? card.color : '#ffffff',
                  borderColor: isFlipped ? 'transparent' : '#f1f5f9'
                }}
                onClick={() => handleCardClick(index)}
              >
                <span className={`transition-all duration-300 ${isFlipped ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                  {card.emoji}
                </span>
                {!isFlipped && <span className="text-slate-200 font-black">?</span>}
              </div>
            );
          })}
        </div>
      </main>

      {/* Popup de Mensaje Emocional */}
      {popup && popup.show && (
        <div className="game-popup-overlay">
          <div className="game-popup-content">
            <div className="w-16 h-16 bg-brain-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="text-brain-purple" size={32} />
            </div>
            <p className="text-xl font-bold text-slate-800 leading-relaxed mb-8">
              "{popup.text}"
            </p>
            <button 
              className="start-btn-game w-full py-4 text-lg"
              onClick={() => setPopup({ ...popup, show: false })}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      <footer className="mt-12 opacity-50">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 text-center">
          Proyecto Profesional · Sensai Mental Health Tool
        </p>
      </footer>
    </div>
  );
}