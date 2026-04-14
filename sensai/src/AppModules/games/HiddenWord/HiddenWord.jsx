// src/AppModules/games/HiddenWord/HiddenWord.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Brain, Timer, Heart, Lightbulb, RefreshCw } from 'lucide-react';
import { WORD_LIST } from './Words';
import './HiddenWord.css';

export default function HiddenWord({ onBack }) {
  const [wordData, setWordData] = useState({ palabra: '', pista: '' });
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [lives, setLives] = useState(6);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState('playing'); // 'playing', 'won', 'lost'

  const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

  const initGame = useCallback(() => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setWordData(randomWord);
    setGuessedLetters([]);
    setLives(6);
    setTimeLeft(120);
    setShowHint(false);
    setStatus('playing');
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Temporizador
  useEffect(() => {
    if (status !== 'playing' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setStatus('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, status]);

  const handleGuess = (letter) => {
    if (status !== 'playing' || guessedLetters.includes(letter)) return;

    setGuessedLetters(prev => [...prev, letter]);

    if (!wordData.palabra.includes(letter)) {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) setStatus('lost');
        return newLives;
      });
    }
  };

  // Verificar Victoria
  useEffect(() => {
    if (wordData.palabra && status === 'playing') {
      const isWon = wordData.palabra.split('').every(l => guessedLetters.includes(l));
      if (isWon) {
        setScore(prev => prev + (lives * 10) + (timeLeft / 2));
        setStatus('won');
      }
    }
  }, [guessedLetters, wordData, lives, timeLeft, status]);

  return (
    <div className="hidden-word-layout">
      <header className="game-header-word">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800">Palabra Oculta</h1>
            <p className="text-[10px] font-bold text-brain-purple uppercase tracking-tighter">Léxico & Atención</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="stat-card"><Timer size={16} className="text-brain-purple" /> <span>{timeLeft}s</span></div>
          <div className="stat-card"><Heart size={16} className="text-red-500" /> <span>{lives}</span></div>
        </div>
      </header>

      <main className="max-w-2xl w-full space-y-8">
        {/* Visual de la palabra */}
        <div className="word-display-container">
          {wordData.palabra.split('').map((letter, i) => (
            <span key={i} className={`letter-slot ${guessedLetters.includes(letter) ? 'revealed' : ''}`}>
              {guessedLetters.includes(letter) ? letter : ''}
            </span>
          ))}
        </div>

        {/* Pista y Ayuda */}
        <div className="hint-section">
          <div className={`hint-box ${showHint ? 'visible' : ''}`}>
            <Lightbulb size={18} />
            <p>{showHint ? wordData.pista : "La pista restará 10 puntos de tu score final"}</p>
          </div>
          {!showHint && status === 'playing' && (
            <button onClick={() => setShowHint(true)} className="hint-toggle-btn">Revelar Pista</button>
          )}
        </div>

        {/* Teclado */}
        <div className="keyboard">
          {alphabet.map(letter => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.includes(letter) || status !== 'playing'}
              className={`key-btn ${guessedLetters.includes(letter) ? (wordData.palabra.includes(letter) ? 'correct' : 'wrong') : ''}`}
            >
              {letter}
            </button>
          ))}
        </div>

        <button onClick={initGame} className="restart-btn">
          <RefreshCw size={18} /> Reiniciar Juego
        </button>
      </main>

      {/* Popups de Estado */}
      {status !== 'playing' && (
        <div className="status-overlay">
          <div className="status-modal">
            <h2 className={status === 'won' ? 'text-green-500' : 'text-red-500'}>
              {status === 'won' ? '¡Excelente Trabajo!' : 'Sigue Intentándolo'}
            </h2>
            <p className="text-slate-500 mt-2">La palabra era: <span className="font-black text-slate-800">{wordData.palabra}</span></p>
            <button onClick={initGame} className="start-btn-game mt-6 w-full">Jugar de nuevo</button>
          </div>
        </div>
      )}
    </div>
  );
}
