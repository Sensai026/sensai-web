import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const MissionBrain = ({ onBack }) => {
  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = () => { if (onBack) onBack(); };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onBack]);

  return (
    <div className="w-full h-screen flex flex-col bg-[var(--bg-primary)] animate-in fade-in duration-500">
      <div className="bg-[var(--bg-primary)]/80 backdrop-blur-md px-6 py-4 border-b border-[var(--border)] flex justify-between items-center">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-6 py-2 border-2 border-[var(--leaf-dark)] text-[var(--leaf-dark)] rounded-full font-black hover:bg-[var(--leaf-dark)] hover:text-white transition-all uppercase text-xs"
        >
          <ArrowLeft size={16} /> REGRESAR
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--leaf-dark)] opacity-40">
          Cerebro en Misión
        </span>
      </div>
      <div className="flex-grow overflow-hidden bg-white">
        <iframe
          src="/games/cerebro_en_mision.html"
          title="Mission Brain"
          className="w-full h-full border-none"
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  );
};

export default MissionBrain;