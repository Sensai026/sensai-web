// src/AppModules/games/GamesModule.jsx
import React, { useState, useEffect } from 'react';
import GamesHub from './GamesHub';
import MemoryGame from './MemoryGame/MemoryGame';

// Traemos la configuración de niveles (puedes mover esto a un archivo constants.js si prefieres)
const LEVELS = {
  1: [
    { emoji: "😌", color: "#C8E6C9", text: "Respirar con calma ayuda a centrarte." },
    { emoji: "😊", color: "#FFF9C4", text: "Reconocer lo positivo fortalece tu bienestar." },
    { emoji: "💙", color: "#B3E5FC", text: "Eres valioso tal como eres." },
    { emoji: "🌱", color: "#DCEDC8", text: "Siempre puedes crecer a tu ritmo." }
  ],
  2: [
    { emoji: "😌", color: "#C8E6C9", text: "La calma también se aprende." },
    { emoji: "😊", color: "#FFF9C4", text: "La alegría puede ser pequeña y real." },
    { emoji: "😢", color: "#BBDEFB", text: "Sentirse triste también es válido." },
    { emoji: "😠", color: "#F8BBD0", text: "El enojo es una señal, no un error." },
    { emoji: "😨", color: "#E1BEE7", text: "El miedo quiere protegerte." },
    { emoji: "🙏", color: "#FFFDE7", text: "Agradecer cambia la perspectiva." }
  ],
  3: [
    { emoji: "😰", color: "#B2EBF2", text: "La ansiedad puede disminuir con apoyo." },
    { emoji: "😤", color: "#FCE4EC", text: "La frustración no te define." },
    { emoji: "🌙", color: "#D1C4E9", text: "El descanso es parte del proceso." },
    { emoji: "🤝", color: "#FFE0B2", text: "Pedir ayuda es de valientes." },
    { emoji: "🔋", color: "#C8E6C9", text: "Recarga tu energía cuando lo necesites." },
    { emoji: "✨", color: "#FFF9C4", text: "Confía en tu capacidad de mejorar." }
  ]
};

export default function GamesModule({ user, onBack }) {
  const [activeGame, setActiveGame] = useState(null);
  
  // ESTADOS DEL JUEGO DE MEMORIA
  const [level, setLevel] = useState("1");
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [lockBoard, setLockBoard] = useState(false);
  const [popup, setPopup] = useState({ show: false, text: "" });

  // Función para barajar e iniciar el juego
  const startGame = () => {
      const selectedLevelCards = LEVELS[level];
      
      // 1. Duplicamos las cartas para crear parejas
      // 2. Usamos el MAP para asignar un ID ÚNICO basado en su posición final
      // 3. Barajamos el resultado
      const combinedCards = [...selectedLevelCards, ...selectedLevelCards]
        .sort(() => Math.random() - 0.5) // Barajamos primero
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

  // Efecto para iniciar el juego automáticamente al entrar
  useEffect(() => {
    if (activeGame === 'memory') {
      startGame();
    }
  }, [activeGame, level]);

  const handleCardClick = (index) => {
    if (lockBoard || flippedCards.includes(index) || matchedCards.includes(index)) return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIndex, secondIndex] = newFlipped;
      
      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        // ¡Hay coincidencia!
        setMatchedCards([...matchedCards, firstIndex, secondIndex]);
        setPopup({ show: true, text: cards[firstIndex].text });
        setFlippedCards([]);
      } else {
        // No hay coincidencia
        setLockBoard(true);
        setTimeout(() => {
          setFlippedCards([]);
          setLockBoard(false);
        }, 1000);
      }
    }
  };

  // RENDERIZADO
  if (!activeGame) {
    return <GamesHub onSelectGame={(id) => setActiveGame(id)} onBack={onBack} />;
  }

  if (activeGame === 'memory') {
    return (
      <MemoryGame 
        user={user} 
        onBack={() => setActiveGame(null)}
        level={level}
        setLevel={setLevel}
        startGame={startGame}
        cards={cards}
        flippedCards={flippedCards}
        matchedCards={matchedCards}
        handleCardClick={handleCardClick}
        popup={popup}
        setPopup={setPopup}
      />
    );
  }

  return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold mb-4">Próximamente...</h2>
      <button onClick={() => setActiveGame(null)} className="start-btn-game">
        Volver
      </button>
    </div>
  );
}