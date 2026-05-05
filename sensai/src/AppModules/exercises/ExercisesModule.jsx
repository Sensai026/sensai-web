import React, { useState } from 'react';
import ExercisesHub from './ExercisesHub';
import MenteSana from './MenteSana/MenteSana'; // Asegúrate de que la ruta sea correcta
import MenteClara from './MenteClara/MenteClara'; // El nuevo que apunta a mente_clara.html
import UnderConstruction from '../exercises/UnderConstruction';

export default function ExercisesModule({ user, onBack }) {
  const [activeExercise, setActiveExercise] = useState(null);

  const handleSaveProgress = async (data) => {
    console.log("Guardando en DB para:", user?.displayName, data);
  };

  // Función para resetear la vista al menú de ejercicios
  const backToHub = () => setActiveExercise(null);

  // Diccionario de ejercicios actualizado
  const exercises = {
    'mente-clara': (
      <MenteClara 
        onBack={backToHub} 
        onComplete={handleSaveProgress}
      />
    ),
    'mente-sana': (
      <MenteSana 
        onBack={backToHub} 
        onComplete={handleSaveProgress}
      />
    ),
    'atencion-plena': (
      <UnderConstruction 
        title="Atención Plena" 
        onBack={backToHub} 
      />
    ),
    'recarga-cognitiva': (
      <UnderConstruction 
        title="Recarga Cognitiva" 
        onBack={backToHub} 
      />
    )
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {!activeExercise ? (
        <ExercisesHub 
          onSelectExercise={setActiveExercise} 
          onBack={onBack} // Regresa al Dashboard de la App
        />
      ) : (
        <div className="animate-in fade-in duration-300">
          {/* Si el ID existe en el diccionario lo muestra, si no, muestra construcción por seguridad */}
          {exercises[activeExercise] || (
            <UnderConstruction 
              title="Ejercicio en Desarrollo" 
              onBack={backToHub} 
            />
          )}
        </div>
      )}
    </div>
  );
}