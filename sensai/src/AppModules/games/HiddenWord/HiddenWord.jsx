import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import './HiddenWord.css'; // Mantienes tu CSS por si necesitas estilos extra

const HiddenWord = ({ onBack }) => {
  // Manejo del historial para que el botón "Atrás" del celular funcione
  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = () => {
      if (onBack) onBack();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onBack]);

  return (
    <div className="game-container-wrapper w-full h-screen flex flex-col bg-[var(--bg-primary)]">
      {/* HEADER DEL JUEGO: Integrado con el estilo de SENSAI */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2 rounded-full font-bold text-[var(--leaf-dark)] border-2 border-[var(--leaf-dark)] hover:bg-[var(--leaf-dark)] hover:text-white transition-all"
        >
          <ArrowLeft size={18} />
          REGRESAR
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-[var(--leaf-dark)] opacity-50">
          Palabra Oculta
        </span>
      </div>

      {/* EL IFRAME: Aquí es donde sucede la magia */}
      <div className="flex-grow overflow-hidden">
        <iframe
          /* IMPORTANTE: La ruta comienza con / porque apunta a 'public' */
          src="/games/palabra_oculta.html"
          title="Juego Palabra Oculta"
          className="w-full h-full border-none"
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  );
};

export default HiddenWord;