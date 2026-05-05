// src/AppModules/exercises/ExercisesHub.jsx
import React from 'react';
import { ArrowLeft, Sparkles, Target, Zap, Activity, Brain, Waves } from 'lucide-react';
import './ExercisesHub.css';

const ExerciseCard = ({ title, description, icon: Icon, color, onClick }) => (
  <div className="game-option-card group relative cursor-pointer" onClick={onClick}>
    <div 
      className="game-icon-wrapper transition-transform group-hover:scale-110 duration-300" 
      style={{ backgroundColor: `${color}33`, color: color }} 
    >
      <Icon size={40} strokeWidth={1.5} />
    </div>
    
    <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    
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
      id: 'mente-sana',
      title: 'Mente Sana',
      description: 'Regulación emocional y equilibrio mental a través de ejercicios prácticos.',
      icon: Waves,
      color: '#16572a'
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
    <div className="games-hub-layout animate-in fade-in duration-500">
      <header className="hub-header flex flex-col items-center text-center gap-6 mb-12">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-brain-orange/10 p-3 rounded-2xl hidden sm:block">
              <Brain className="text-brain-orange" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              Gimnasio <span className="text-brain-orange">Cognitivo</span>
            </h1>
          </div>
          <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
            Fortalece tu agilidad mental y regulación emocional con rutinas de entrenamiento especializado.
          </p>
        </div>

        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-8 py-3 border-2 border-slate-800 text-slate-800 rounded-full font-black hover:bg-slate-800 hover:text-white transition-all w-full sm:w-auto justify-center uppercase tracking-tighter text-sm shadow-sm"
        >
          <ArrowLeft size={18} />
          Volver al Dashboard
        </button>
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

      <footer className="hub-footer mt-12">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
          SENSAI 2026 • MODULO DE EJERCICIOS
        </p>
      </footer>
    </div>
  );
}