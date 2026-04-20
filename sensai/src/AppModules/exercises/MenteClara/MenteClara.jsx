import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const MenteClara = ({ onBack }) => {
  // Manejo del botón físico/gesto de "Atrás" del celular
  useEffect(() => {
    // Al entrar al ejercicio, añadimos un estado al historial
    window.history.pushState(null, null, window.location.pathname);

    const handlePopState = () => {
      // Cuando el usuario pulsa "atrás" en el cel, ejecutamos onBack
      if (onBack) onBack();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onBack]);

  return (
    <div className="w-full h-screen flex flex-col bg-[#DCF5EA]">
      {/* Barra superior con botón de regreso */}
      <div className="bg-white/80 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#16572a] font-bold hover:bg-[#9cd6b7]/20 px-4 py-2 rounded-xl transition-all"
        >
          <ArrowLeft size={20} />
          <span>Regresar al Menú</span>
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-[#16572a]/40">
          Mente Clara
        </span>
      </div>

      {/* Contenedor del Ejercicio */}
      <div className="flex-grow overflow-hidden">
        <iframe
          src="/mente_sana.html"
          title="Mente Clara"
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
};

export default MenteClara;