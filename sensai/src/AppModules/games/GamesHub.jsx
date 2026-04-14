import React from 'react';
import { ArrowLeft, Brain, Puzzle, Gamepad2, Type, Layers, Compass} from 'lucide-react';
import './GamesHub.css';

const GameCard = ({ title, description, icon: Icon, color, onClick }) => (
  <div className="game-option-card" onClick={onClick}>
    <div 
      className="game-icon-wrapper" 
      style={{ backgroundColor: `${color}33`, color: color }} 
    >
      <Icon size={40} strokeWidth={1.5} />
    </div>
    
    <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    
    {/* Indicador visual minimalista */}
    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="bg-slate-800 text-white p-2 rounded-full shadow-lg">
        <Gamepad2 size={16} />
      </div>
    </div>
  </div>
);

export default function GamesHub({ onSelectGame, onBack }) {
  const availableGames = [
    {
      id: 'memory',
      title: 'Recuerdos en Equilibrio',
      description: 'Entrena tu memoria con afirmaciones positivas.',
      icon: Brain,
      color: '#a5d6a7' 
    },
    {
      id: 'psycho-memo',
      title: 'Memorama Cognitivo',
      description: 'Estimula la atención y memoria a corto plazo con niveles progresivos.',
      icon: Gamepad2,
      color: '#8b5cf6'
    },
    {
      id: 'hidden-word', // Nuevo ID para Palabra Oculta
      title: 'Palabra Oculta',
      description: 'Fortalece tu léxico y agilidad mental descubriendo conceptos psicológicos.',
      icon: Type, 
      color: '#60a5fa' // Un azul vibrante
    },
    {
      id: 'tetris',
      title: 'Arquitectura Mental',
      description: 'Mejora tu toma de decisiones y planificación espacial organizando estructuras.',
      icon: Layers,
      color: '#3877ff'
    },
    {
      id: 'puzzle',
      title: 'Rompecabezas Mental',
      description: 'Próximamente: Organiza tus pensamientos de forma visual.',
      icon: Puzzle,
      color: '#fbbf24' 
    },
    {
      id: 'mission-brain',
      title: 'Cerebro en Misión',
      description: 'Viaja por diferentes mundos y conquista tus pensamientos.',
      icon: Compass,
      color: '#4f46e5'
    }
  ];

  return (
    <div className="games-hub-layout">
      <header className="hub-header">
        <button onClick={onBack} className="back-btn-hub">
          <ArrowLeft size={18} />
          Volver al Dashboard
        </button>
        
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            Gimnasio <span className="text-brain-orange">Mental</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-lg">
            Selecciona una actividad para fortalecer tus capacidades cognitivas y emocionales.
          </p>
        </div>
      </header>

      <main className="games-grid">
        {availableGames.map((game) => (
          <GameCard 
            key={game.id} 
            {...game} 
            onClick={() => onSelectGame(game.id)} 
          />
        ))}
      </main>

      <footer className="hub-footer">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          SENSAI 2026
        </p>
      </footer>
    </div>
  );
}