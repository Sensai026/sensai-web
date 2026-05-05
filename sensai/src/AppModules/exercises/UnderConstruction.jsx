import React from 'react';
import { ArrowLeft, Hammer, Construction } from 'lucide-react';

const UnderConstruction = ({ title, onBack }) => {
  return (
    <div className="w-full h-screen flex flex-col bg-[#f8fafc] items-center justify-center p-6 text-center">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 max-w-md w-full animate-in zoom-in duration-300">
        <div className="bg-brain-orange/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Hammer className="text-brain-orange" size={40} />
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 mb-8 font-medium">
          Estamos trabajando para que tu experiencia en SENSAI sea increíble. ¡Vuelve pronto!
        </p>

        <button 
          onClick={onBack}
          className="flex items-center justify-center gap-2 w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all shadow-lg"
        >
          <ArrowLeft size={20} />
          REGRESAR AL MENÚ
        </button>
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-slate-300">
        <Construction size={16} />
        <span className="text-xs font-bold uppercase tracking-widest">SENSAI • 2026</span>
      </div>
    </div>
  );
};

export default UnderConstruction;