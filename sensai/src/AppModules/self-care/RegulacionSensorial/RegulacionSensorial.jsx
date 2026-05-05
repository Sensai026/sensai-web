import React from 'react';
import { ArrowLeft, Waves } from 'lucide-react';

export default function RegulacionSensorial({ onBack }) {
  return (
    <div className="flex flex-col h-screen bg-white animate-fadeIn">
      {/* Header con estilo Nexo 120 */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-gray-400 hover:text-brain-purple transition-colors"
        >
          <ArrowLeft size={18} />
          Volver al Hub
        </button>
        
        <div className="flex items-center gap-2 text-brain-purple">
          <Waves size={16} className="animate-pulse" />
          <span className="font-black text-sm uppercase tracking-tighter">Regulación Sensorial</span>
        </div>
      </nav>

      {/* Contenedor del Iframe para el menú sensorial */}
      <div className="flex-grow bg-slate-50 overflow-hidden">
        <iframe
          src="/exercises/sensorial/menu_sensorial.html" 
          title="Menú de Regulación Sensorial"
          className="w-full h-full border-none shadow-inner"
        />
      </div>
    </div>
  );
}