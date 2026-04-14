// src/AppModules/games/PsychologyMemo/PsychologyMemo.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Brain, Timer, Trophy } from 'lucide-react';
import { PSYCHO_LEVELS } from './Levels';
import './PsychologyMemo.css';

export default function PsychologyMemo({ onBack }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLocked, setIsLocked] = useState(false);

  // Inicializar nivel
  useEffect(() => {
    startLevel(currentLevel);
  }, [currentLevel]);

  // Temporizador
  useEffect(() => {
    if (timeLeft <= 0) {
      alert("⏰ ¡Tiempo agotado! Reintentando nivel...");
      startLevel(currentLevel);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const startLevel = (levelIdx) => {
    const data = PSYCHO_LEVELS[levelIdx];
    const shuffled = [...data.cartas]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setTimeLeft(data.tiempo);
    setIsLocked(false);
  };

  const handleCardClick = (index) => {
    if (isLocked || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [first, second] = newFlipped;

      if (cards[first].emoji === cards[second].emoji) {
        // Acierto
        setMatched(prev => [...prev, first, second]);
        setScore(prev => prev + 20);
        setFlipped([]);
        setIsLocked(false);
        
        // Verificar victoria
        if (matched.length + 2 === cards.length) {
          setTimeout(handleWin, 500);
        }
      } else {
        // Fallo
        setTimeout(() => {
          setFlipped([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  const handleWin = () => {
    if (currentLevel < PSYCHO_LEVELS.length - 1) {
      alert("🎉 ¡Nivel superado!");
      setCurrentLevel(prev => prev + 1);
    } else {
      alert("🏆 ¡Felicidades! Completaste el entrenamiento cognitivo.");
      onBack();
    }
  };

  return (
    <div className="psycho-game-layout">
      {/* Header SENSAI */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-6 bg-white p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <h1 className="text-xl font-black text-slate-800">Memorama Cognitivo</h1>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <Timer size={18} className="text-brain-purple" />
            <span className="font-bold text-slate-700">{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <Trophy size={18} className="text-yellow-500" />
            <span className="font-bold text-slate-700">{score}</span>
          </div>
        </div>
      </header>

      <div className="bg-white p-4 rounded-2xl mb-8 max-w-2xl text-center shadow-sm border border-slate-100 italic text-slate-500 text-sm">
        "Este ejercicio estimula la memoria a corto plazo y la atención selectiva, pilares del aprendizaje."
      </div>

      {/* Tablero */}
      <main 
        className="grid gap-4 justify-center"
        style={{ gridTemplateColumns: `repeat(${PSYCHO_LEVELS[currentLevel].columnas}, minmax(0, 1fr))` }}
      >
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index);
          const isMatched = matched.includes(index);
          return (
            <div 
              key={index} 
              className={`psycho-card ${isFlipped || isMatched ? 'is-flipped' : ''} ${isMatched ? 'is-matched' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="psycho-card-inner">
                {/* Lomo de la carta */}
                <div className="psycho-card-face card-front">
                  <Brain size={40} strokeWidth={1} />
                </div>
                
                {/* Parte trasera (Emoji) */}
                <div className="psycho-card-face card-back">
                  {card.emoji}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      <button 
        onClick={() => startLevel(currentLevel)}
        className="mt-10 bg-slate-200 text-slate-700 px-8 py-3 rounded-2xl font-bold hover:bg-slate-300 transition-all active:scale-95"
      >
        Reiniciar Nivel
      </button>
    </div>
  );
}