import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const MenteSana = ({ onBack }) => {
  // Manejo del historial para gestos de retroceso en móviles
  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = () => {
      if (onBack) onBack();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onBack]);

  return (
    <div className="w-full h-screen flex flex-col bg-slate-50 animate-in fade-in duration-500">
      {/* HEADER DINÁMICO: Estilo consistente con Nexo 120 */}
      <div className="bg-white/80 backdrop-blur-md px-6 py-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* BOTÓN CON ESTILO DE CÁPSULA (Basado en ExercisesHub) */}
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-8 py-3 border-2 rounded-full font-black transition-all w-full sm:w-auto justify-center uppercase tracking-tighter text-sm shadow-sm active:scale-95"
          style={{ 
            borderColor: 'var(--main-color)', 
            color: 'var(--main-color)',
            backgroundColor: 'transparent'
          }}
          // Simulación de hover para variables CSS
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--main-color)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--main-color)';
          }}
        >
          <ArrowLeft size={18} />
          Regresar al Menú
        </button>

        {/* ETIQUETA DEL EJERCICIO */}
        <span 
          className="text-xs font-black uppercase tracking-widest opacity-40"
          style={{ color: 'var(--main-color)' }}
        >
          Mente Sana
        </span>
      </div>

      {/* CONTENEDOR DEL IFRAME */}
      <div className="flex-grow overflow-hidden bg-white">
        <iframe
          src="/exercises/mente_sana.html"
          title="Mente Sana"
          className="w-full h-full border-none"
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  );
};

export default MenteSana;