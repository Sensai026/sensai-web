// src/AppModules/self-care/SelfCareHub.jsx
import React, { useState } from 'react';
import { Heart, Ear, ArrowLeft } from 'lucide-react';
import CuidadoPersonal from './CuidadoPersonal/CuidadoPersonal';
import RegulacionSensorial from './RegulacionSensorial/RegulacionSensorial';
import './SelfCareHub.css';

export default function SelfCareHub({ onBack }) {
  const [activeSubModule, setActiveSubModule] = useState(null);

  const subModules = [
    {
      id: 'habitos',
      title: 'Cuidado Personal',
      icon: Heart,
      description: 'Registra tu hidratación, alimentación y ejercicio para tu planta.',
      color: 'text-leaf-dark',
      bg: 'bg-leaf-dark/10'
    },
    {
      id: 'sensorial',
      title: 'Regulación Sensorial',
      icon: Ear,
      description: 'Herramientas de estimulación y calma sonora para tus sentidos.',
      color: 'text-brain-purple',
      bg: 'bg-brain-purple/10'
    }
  ];

  if (activeSubModule === 'habitos') {
    return <CuidadoPersonal onBack={() => setActiveSubModule(null)} />;
  }
  if (activeSubModule === 'sensorial') {
    return <RegulacionSensorial onBack={() => setActiveSubModule(null)} />;
  }

  return (
    <div className="self-care-hub-container animate-fadeIn">
      <header className="flex flex-col items-center mb-12 gap-6">
        <button onClick={onBack} className="back-button-sensai">
          <ArrowLeft size={16} />
          Volver al Dashboard
        </button>
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-leaf-dark tracking-tighter">
            Centro de <span className="text-brain-orange">Cuidado Personal</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-gray-500 text-lg font-medium leading-relaxed">
            Cultiva tu equilibrio interior a través del seguimiento de tus hábitos vitales 
            y la armonización de tus sentidos.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {subModules.map((sub) => (
          <div 
            key={sub.id} 
            className="hub-card-interactive group"
            onClick={() => setActiveSubModule(sub.id)}
          >
            <div className={`hub-icon-box ${sub.bg} ${sub.color} group-hover:scale-110`}>
              <sub.icon size={40} strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-leaf-dark">{sub.title}</h3>
              <p className="text-gray-500 text-sm leading-snug mt-1">{sub.description}</p>
            </div>
          </div>
        ))}
      </div>
      <footer className="mt-20 py-8 border-t border-gray-200">
        <div className="text-center">
          <p className="font-black text-xs uppercase tracking-[0.3em] text-gray-400">
            SENSAI 2026 <span className="mx-2 text-brain-orange">•</span> MODULO DE CUIDADO PERSONAL
          </p>
        </div>
      </footer>
    </div>
  );
}