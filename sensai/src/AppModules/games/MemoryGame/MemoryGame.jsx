// src/AppModules/games/MemoryGame/MemoryGame.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Brain } from 'lucide-react';
import { LEVELS } from './Levels'; // Importamos los niveles
import './MemoryGame.css';

export default function MemoryGame({ user, onBack }) {
  // --- LÓGICA ENCAPSULADA ---
  const [level, setLevel] = useState("1");
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [lockBoard, setLockBoard] = useState(false);
  const [popup, setPopup] = useState({ show: false, text: "" });

  const startGame = () => {
    const selectedLevelCards = LEVELS[level];
    const combinedCards = [...selectedLevelCards, ...selectedLevelCards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ 
        ...card, 
        uniqueId: `card-${index}-${Math.random().toString(36).substr(2, 9)}` 
      }));
    
    setCards(combinedCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setLockBoard(false);
    setPopup({ show: false, text: "" });
  };

  useEffect(() => {
    startGame();
  }, [level]);

  const handleCardClick = (index) => {
    if (lockBoard || flippedCards.includes(index) || matchedCards.includes(index)) return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIndex, secondIndex] = newFlipped;
      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        setMatchedCards(prev => [...prev, firstIndex, secondIndex]);
        setPopup({ show: true, text: cards[firstIndex].text });
        setFlippedCards([]);
      } else {
        setLockBoard(true);
        setTimeout(() => {
          setFlippedCards([]);
          setLockBoard(false);
        }, 1000);
      }
    }
  };

  // --- RENDERIZADO (Se mantiene igual pero usa estados internos) ---
  if (!cards || cards.length === 0) {
    return (
      <div className="memory-game-layout items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="animate-pulse text-brain-purple mx-auto" size={48} />
          <h2 className="text-xl font-bold text-slate-700">Preparando tu sesión...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="memory-game-layout">
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

      <section className="controls-section">
        <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Nivel:</label>
        <select className="level-select" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="1">Calma</option>
          <option value="2">Emociones</option>
          <option value="3">Autorregulación</option>
        </select>
        <button className="start-btn-game" onClick={startGame}>Reiniciar</button>
      </section>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4">
        <div 
          className="game-board-container" 
          style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(cards.length))}, minmax(0, 1fr))` }}
        >
          {cards.map((card, index) => {
            const isFlipped = flippedCards.includes(index) || matchedCards.includes(index);
            return (
              <div 
                key={card.uniqueId || index}
                className={`memory-card ${isFlipped ? 'memory-card-flipped' : ''}`}
                style={{ backgroundColor: isFlipped ? card.color : '#ffffff' }}
                onClick={() => handleCardClick(index)}
              >
                <span className={`transition-all duration-300 ${isFlipped ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                  {card.emoji}
                </span>
                {!isFlipped && <Brain size={40} strokeWidth={1} className="text-slate-200" />}
              </div>
            );
          })}
        </div>
      </main>

      {popup.show && (
        <div className="game-popup-overlay">
          <div className="game-popup-content">
            <Sparkles className="text-brain-purple mx-auto mb-6" size={32} />
            <p className="text-xl font-bold text-slate-800 mb-8">"{popup.text}"</p>
            <button className="start-btn-game w-full py-4" onClick={() => setPopup({ ...popup, show: false })}>
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}