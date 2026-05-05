import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function CuidadoPersonal({ onBack }) {
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header Minimalista */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-gray-400 hover:text-brain-orange transition-colors"
        >
          <ArrowLeft size={18} />
          Volver al Ménu
        </button>
        
        <div className="flex items-center gap-2 text-leaf-dark">
          <Sparkles size={16} className="text-brain-orange" />
          <span className="font-black text-sm uppercase tracking-tighter">Hábitos Vitales</span>
        </div>
      </nav>

      {/* Contenedor del Iframe */}
      <div className="flex-grow bg-slate-50 overflow-hidden">
        <iframe
          src="/exercises/cuidado_personal.html" 
          title="Sistema de Cuidado Personal"
          className="w-full h-full border-none shadow-inner"
        />
      </div>
    </div>
  );
}