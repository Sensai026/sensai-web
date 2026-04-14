// src/AppModules/exercises/MenteClara/MenteClara.jsx
import React, { useState } from 'react';
import './MenteClara.css';

export default function MenteClara({ onBack, onComplete }) {
  const [exerciseStatus, setExerciseStatus] = useState('En progreso');

  const handleFinish = () => {
    setExerciseStatus('¡Completado!');
    // Notificamos al módulo superior (donde se conectará con la DB)
    if (onComplete) {
      onComplete({ exerciseId: 'ejercicio_prueba_01', status: 'done' });
    }
  };

  return (
    <div className="mente-clara-test-container">
      <nav className="mente-clara-nav">
        <button onClick={onBack} className="mente-clara-back-btn">
          ← Volver a Ejercicios
        </button>
        <h2 className="mente-clara-logo">MENTE <b>CLARA</b></h2>
      </nav>

      <main className="mente-clara-content">
        <header className="mente-clara-header">
          <h1>Ejercicio de Prueba</h1>
          <p>Verificación de integración de SENSAI</p>
        </header>

        <section className="mente-clara-exercise-card">
          <div className="exercise-info">
            <span className="status-tag">{exerciseStatus}</span>
            <h3>Acertijo de Lógica Rápida</h3>
            <p className="mt-4 text-slate-600">
              "Si estás en una carrera y pasas al que va en segundo lugar, 
              ¿en qué posición quedas?"
            </p>
          </div>

          <div className="exercise-action mt-8">
            <button 
              onClick={handleFinish}
              className="mente-clara-complete-btn"
              disabled={exerciseStatus === '¡Completado!'}
            >
              {exerciseStatus === '¡Completado!' ? 'Ejercicio Guardado' : 'Marcar como Completado'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}