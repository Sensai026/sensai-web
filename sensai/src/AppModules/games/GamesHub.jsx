import React from 'react';
import { ArrowLeft, Brain, Puzzle, Gamepad2, Type, Layers, Compass} from 'lucide-react';
import './GamesHub.css';

const GameCard = ({ title, description, icon: Icon, color, onClick }) => (
  /* Añadimos 'group' aquí para que el icono interno reaccione al hover */
  <div className="game-option-card group" onClick={onClick}>
    <div 
      className="game-icon-wrapper group-hover:scale-110" 
      style={{ backgroundColor: `${color}33`, color: color }} 
    >
      <Icon size={40} strokeWidth={1.5} />
    </div>
    
    <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    
    {/* Indicador visual que aparece al pasar el mouse */}
    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
      <div className="bg-slate-800 text-white p-2 rounded-full shadow-lg">
        <Gamepad2 size={16} />
      </div>
    </div>
  </div>
);

export default function GamesHub({ onSelectGame, onBack }) {
  const availableGames = [
    { id: 'memory', title: 'Recuerdos en Equilibrio', description: 'Entrena tu memoria con afirmaciones positivas.', icon: Brain, color: '#a5d6a7' },
    { id: 'psycho-memo', title: 'Memorama Cognitivo', description: 'Estimula la atención y memoria a corto plazo con niveles progresivos.', icon: Gamepad2, color: '#8b5cf6' },
    { id: 'hidden-word', title: 'Palabra Oculta', description: 'Fortalece tu léxico y agilidad mental descubriendo conceptos psicológicos.', icon: Type, color: '#60a5fa' },
    { id: 'tetris', title: 'Arquitectura Mental', description: 'Mejora tu toma de decisiones y planificación espacial organizando estructuras.', icon: Layers, color: '#3877ff' },
    { id: 'puzzle', title: 'Rompecabezas Mental', description: 'Próximamente: Organiza tus pensamientos de forma visual.', icon: Puzzle, color: '#fbbf24' },
    { id: 'mission-brain', title: 'Cerebro en Misión', description: 'Viaja por diferentes mundos y conquista tus pensamientos.', icon: Compass, color: '#4f46e5' }
  ];

  return (
    <div className="games-hub-layout animate-in fade-in duration-500">
      {/* HEADER CENTRADO Y RESPONSIVO */}
      <header className="hub-header flex flex-col items-center text-center gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-brain-orange/10 p-3 rounded-2xl hidden sm:block">
              <Gamepad2 className="text-brain-orange" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              Gimnasio <span className="text-brain-orange">Mental</span>
            </h1>
          </div>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            Selecciona una actividad para fortalecer tus capacidades cognitivas y emocionales.
          </p>
        </div>

        {/* EL NUEVO BOTÓN: Estilo consistente con el resto de la App */}
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-8 py-3 border-2 border-slate-800 text-slate-800 rounded-full font-black hover:bg-slate-800 hover:text-white transition-all w-full sm:w-auto justify-center uppercase tracking-tighter text-sm shadow-sm"
        >
          <ArrowLeft size={18} />
          Volver al Dashboard
        </button>
      </header>

      <main className="games-grid mt-12">
        {availableGames.map((game) => (
          <GameCard 
            key={game.id} 
            {...game} 
            onClick={() => onSelectGame(game.id)} 
          />
        ))}
      </main>

      <footer className="hub-footer mt-20">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
          SENSAI 2026 • MODULO DE JUEGOS
        </p>
      </footer>
    </div>
  );
}