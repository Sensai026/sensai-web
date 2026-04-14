// src/AppModules/games/GamesModule.jsx
import React, { useState } from 'react';
import GamesHub from './GamesHub';
import MemoryGame from './MemoryGame/MemoryGame';
import PsychologyMemo from './PsychologyMemo/PsychologyMemo';
import HiddenWord from './HiddenWord/HiddenWord';
import TetrisGame from './Tetris/TetrisGame';
import MissionBrain from './MissionBrain/MissionBrain';

export default function GamesModule({ user, onBack }) {
  const [activeGame, setActiveGame] = useState(null);

  // Si no hay juego seleccionado, mostramos el Hub (menú)
  if (!activeGame) {
    return <GamesHub onSelectGame={(id) => setActiveGame(id)} onBack={onBack} />;
  }

  // Diccionario de juegos para evitar múltiples IFs
  const games = {
    'memory': <MemoryGame user={user} onBack={() => setActiveGame(null)} />,
    'psycho-memo': <PsychologyMemo onBack={() => setActiveGame(null)} />,
    'hidden-word': <HiddenWord onBack={() => setActiveGame(null)} />,
    'tetris': <TetrisGame onBack={() => setActiveGame(null)} />,
    'mission-brain': <MissionBrain onBack={() => setActiveGame(null)} />,
    // Aquí agregarás los siguientes 2 juegos que te pasaron
  };

  return games[activeGame] || (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Próximamente...</h2>
        <button onClick={() => setActiveGame(null)} className="start-btn-game">Volver</button>
      </div>
    </div>
  );
}