// src/AppModules/exercises/ExercisesHub.jsx
import React from 'react';
import { ArrowLeft, Sparkles, Brain, Target, Zap, Activity } from 'lucide-react';
import './ExercisesHub.css'; // Asegúrate de crear este archivo o compartir estilos

const ExerciseCard = ({ title, description, icon: Icon, color, onClick }) => (
  <div className="game-option-card group relative" onClick={onClick}>
    <div 
      className="game-icon-wrapper" 
      style={{ backgroundColor: `${color}33`, color: color }} 
    >
      <Icon size={40} strokeWidth={1.5} />
    </div>
    
    <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    
    {/* Indicador visual minimalista consistente con GamesHub */}
    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="bg-slate-800 text-white p-2 rounded-full shadow-lg">
        <Activity size={16} />
      </div>
    </div>
  </div>
);

export default function ExercisesHub({ onSelectExercise, onBack }) {
  const availableExercises = [
    {
      id: 'mente-clara',
      title: 'Mente Clara',
      description: 'Desafíos de lógica y agudeza mental diseñados para entrenar tu razonamiento.',
      icon: Sparkles,
      color: '#0A7A62' 
    },
    {
      id: 'atencion-plena',
      title: 'Atención Plena',
      description: 'Próximamente: Ejercicios de enfoque y reducción del ruido mental.',
      icon: Target,
      color: '#4338ca'
    },
    {
      id: 'recarga-cognitiva',
      title: 'Recarga Cognitiva',
      description: 'Próximamente: Técnicas de descanso activo para mejorar la productividad.',
      icon: Zap,
      color: '#f59e0b'
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
            Gimnasio <span className="text-brain-orange">Cognitivo</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-lg">
            Fortalece tu agilidad mental y regulación emocional con rutinas de entrenamiento especializado.
          </p>
        </div>
      </header>

      <main className="games-grid">
        {availableExercises.map((ex) => (
          <ExerciseCard 
            key={ex.id} 
            {...ex} 
            onClick={() => onSelectExercise(ex.id)} 
          />
        ))}
      </main>

      <footer className="hub-footer">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          SENSAI 2026 • MODULO DE EJERCICIOS
        </p>
      </footer>
    </div>
  );
}