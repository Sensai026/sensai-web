// src/AppModules/exercises/ExercisesModule.jsx
import React, { useState } from 'react';
import ExercisesHub from './ExercisesHub';
import MenteClara from './MenteClara/MenteClara';

export default function ExercisesModule({ user, onBack }) { // <-- Recibe onBack de App.jsx
  const [activeExercise, setActiveExercise] = useState(null);

  const handleSaveProgress = async (data) => {
    console.log("Guardando en DB para:", user?.displayName, data);
  };

  // Diccionario de ejercicios
  const exercises = {
    'mente-clara': (
      <MenteClara 
        onBack={() => setActiveExercise(null)} 
        onComplete={handleSaveProgress}
      />
    )
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {!activeExercise ? (
        <ExercisesHub 
          onSelectExercise={setActiveExercise} 
          onBack={onBack} // <-- AQUÍ se pasa la función al hijo
        />
      ) : (
        <div className="animate-in fade-in duration-300">
          {exercises[activeExercise]}
        </div>
      )}
    </div>
  );
}