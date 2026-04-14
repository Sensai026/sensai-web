// src/AppModules/games/MissionBrain/MissionBrain.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, Trophy, Brain, Map, Compass } from 'lucide-react';
import './MissionBrain.css';

const MUNDOS = [
  {
    nombre: "Mundo 1 – El Guardián del Pensamiento",
    habilidad: "Filtro Realista",
    descripcion: "Aprende a identificar y cuestionar distorsiones cognitivas.",
    juegos: [
      { pregunta: "“Todo me sale mal” es un ejemplo de:", opciones: ["Pensamiento Realista", "Generalización Excesiva", "Análisis Objetivo"], correcta: 1 },
      { pregunta: "Etiquetarte como “Soy un fracaso” por un error es:", opciones: ["Catastrofismo", "Razonamiento Lógico", "Autoafirmación Sana"], correcta: 0 },
      { pregunta: "¿Cuál es un pensamiento realista ante un error?", opciones: ["Nada va a mejorar", "Puedo aprender de esto y mejorar", "Cada vez soy peor"], correcta: 1 }
    ]
  },
  {
    nombre: "Mundo 2 – Bosque de la Atención",
    habilidad: "Atención Lente",
    descripcion: "Entrena tu enfoque para ignorar el ruido innecesario.",
    juegos: [
      { pregunta: "¿Qué elemento NO es un distractor externo?", opciones: ["Notificaciones del celular", "Ruido ambiental", "Tu objetivo actual"], correcta: 2 },
      { pregunta: "La mejor estrategia para la atención sostenida es:", opciones: ["Hacer multitarea", "Reducir distractores", "Ignorar el cansancio"], correcta: 1 }
    ]
  },
  {
    nombre: "Mundo 3 – Montaña de la Calma",
    habilidad: "Botón de Pausa",
    descripcion: "Regula tus emociones antes de reaccionar.",
    juegos: [
      { pregunta: "Si alguien no responde tu mensaje, lo mejor es:", opciones: ["Asumir lo peor", "Respirar y esperar", "Enojarse de inmediato"], correcta: 1 },
      { pregunta: "Ante un examen fallido, el enfoque resiliente es:", opciones: ["Pensar que soy inútil", "Analizar qué mejorar", "Rendirse"], correcta: 1 }
    ]
  },
  {
    nombre: "Mundo 4 – Laberinto de la Memoria",
    habilidad: "Mente Elástica",
    descripcion: "Mejora tu flexibilidad mental y retención.",
    juegos: [
      { pregunta: "En una secuencia ROJO-AZUL-ROJO, ¿cuál es el medio?", opciones: ["Rojo", "Verde", "Azul"], correcta: 2 },
      { pregunta: "La flexibilidad cognitiva consiste en:", opciones: ["Adaptarse al cambio", "Mantenerse rígido", "Actuar por impulso"], correcta: 0 }
    ]
  },
  {
    nombre: "Mundo 5 – Ciudad de las Decisiones",
    habilidad: "Planificador Interno",
    descripcion: "Aprende a desglosar problemas en pasos ejecutables.",
    juegos: [
      { pregunta: "Ante mucho estrés por tareas, lo ideal es:", opciones: ["Organizar y priorizar", "Entrar en pánico", "No hacer nada"], correcta: 0 },
      { pregunta: "El primer paso para resolver un problema es:", opciones: ["Saltar a soluciones", "Definir el problema", "Actuar impulsivamente"], correcta: 1 }
    ]
  }
];

export default function MissionBrain({ onBack }) {
  const [view, setView] = useState('menu'); // menu, playing, completed, final
  const [currentWorldIndex, setCurrentWorldIndex] = useState(0);
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0);
  const [unlockedSkills, setUnlockedSkills] = useState([]);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('sensai_skills');
    if (saved) setUnlockedSkills(JSON.parse(saved));
  }, []);

  const saveSkill = (skill) => {
    if (!unlockedSkills.includes(skill)) {
      const updated = [...unlockedSkills, skill];
      setUnlockedSkills(updated);
      localStorage.setItem('sensai_skills', JSON.stringify(updated));
    }
  };

  const startWorld = (index) => {
    setCurrentWorldIndex(index);
    setCurrentQuestIndex(0);
    setFeedback(null);
    setView('playing');
  };

  const handleAnswer = (optionIndex) => {
    const currentWorld = MUNDOS[currentWorldIndex];
    const currentQuest = currentWorld.juegos[currentQuestIndex];

    if (optionIndex === currentQuest.correcta) {
      setFeedback({ type: 'success', msg: '¡Correcto!' });
      
      setTimeout(() => {
        setFeedback(null);
        if (currentQuestIndex + 1 < currentWorld.juegos.length) {
          setCurrentQuestIndex(prev => prev + 1);
        } else {
          saveSkill(currentWorld.habilidad);
          setView('completed');
        }
      }, 1000);
    } else {
      setFeedback({ type: 'error', msg: 'Intenta analizarlo de nuevo...' });
    }
  };

  return (
    <div className="mission-layout">
      {/* HEADER */}
      <header className="mission-header">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Cerebro en Misión</h1>
            <p className="text-[10px] font-bold text-brain-purple uppercase tracking-widest">Aventura Cognitiva</p>
          </div>
        </div>
        <button onClick={() => setView('final')} className="skills-badge">
          <Trophy size={14} /> {unlockedSkills.length} Habilidades
        </button>
      </header>

      {/* VISTA: MENÚ DE MUNDOS */}
      {view === 'menu' && (
        <main className="mission-container fade-in">
          <div className="mission-intro">
            <Compass className="text-brain-purple mb-2" size={32} />
            <h2 className="text-lg font-bold">Selecciona tu ruta</h2>
            <p className="text-sm text-slate-500">Completa los desafíos para ganar habilidades.</p>
          </div>
          <div className="worlds-grid">
            {MUNDOS.map((mundo, i) => (
              <button key={i} onClick={() => startWorld(i)} className={`world-card ${unlockedSkills.includes(mundo.habilidad) ? 'completed' : ''}`}>
                <div className="world-info">
                  <span className="world-number">0{i + 1}</span>
                  <h3>{mundo.nombre.split('–')[1]}</h3>
                  <p>{mundo.habilidad}</p>
                </div>
                {unlockedSkills.includes(mundo.habilidad) && <CheckCircle2 className="text-green-500" size={20} />}
              </button>
            ))}
          </div>
        </main>
      )}

      {/* VISTA: JUEGO ACTIVO */}
      {view === 'playing' && (
        <main className="mission-container fade-in">
          <div className="progress-bar-container">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestIndex) / MUNDOS[currentWorldIndex].juegos.length) * 100}%` }}
            ></div>
          </div>

          <div className="quest-card">
            <div className="quest-header">
              <Map size={20} className="text-brain-purple" />
              <span>Pregunta {currentQuestIndex + 1} de {MUNDOS[currentWorldIndex].juegos.length}</span>
            </div>
            <h2 className="quest-text">{MUNDOS[currentWorldIndex].juegos[currentQuestIndex].pregunta}</h2>
            
            <div className="options-stack">
              {MUNDOS[currentWorldIndex].juegos[currentQuestIndex].opciones.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(i)} className="option-btn">
                  {opt}
                </button>
              ))}
            </div>

            {feedback && (
              <div className={`feedback-toast ${feedback.type}`}>
                {feedback.msg}
              </div>
            )}
          </div>
        </main>
      )}

      {/* VISTA: MUNDO COMPLETADO */}
      {view === 'completed' && (
        <main className="mission-container flex flex-col items-center justify-center text-center py-12 fade-in">
          <div className="success-icon-wrapper">
            <Trophy size={60} className="text-yellow-500" />
          </div>
          <h2 className="text-3xl font-black mt-6">¡Misión Cumplida!</h2>
          <p className="text-slate-500 mt-2">Has desbloqueado la habilidad:</p>
          <div className="skill-unlocked-tag">{MUNDOS[currentWorldIndex].habilidad}</div>
          <button onClick={() => setView('menu')} className="start-btn-game mt-10 w-full max-w-xs">
            Volver al Mapa
          </button>
        </main>
      )}

      {/* VISTA: LOGROS FINAL */}
      {view === 'final' && (
        <main className="mission-container fade-in">
          <div className="achievements-card">
            <h2 className="text-2xl font-black mb-6">Tus Habilidades Ganadas</h2>
            {unlockedSkills.length === 0 ? (
              <p className="text-slate-400">Aún no has completado misiones.</p>
            ) : (
              <ul className="skills-list">
                {unlockedSkills.map((h, i) => (
                  <li key={i} className="skill-item">
                    <CheckCircle2 size={18} className="text-green-500" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-slate-400 mt-8 italic text-center">
              "Aplica estas herramientas en tu vida cotidiana para fortalecer tu bienestar mental."
            </p>
            <button onClick={() => setView('menu')} className="restart-btn mt-6">
              Regresar al Juego
            </button>
          </div>
        </main>
      )}
    </div>
  );
}