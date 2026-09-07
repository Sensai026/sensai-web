import React from 'react';
import { Image, ArrowLeft, Construction, Sparkles } from 'lucide-react';
import './Pictogram.css';

export default function Pictogram({ onBack = () => {} }) {
  return (
    <div className="pictogram-container bg-[var(--bg-primary)] min-h-screen p-6 animate-fadeIn transition-colors duration-500">
      {/* Encabezado con navegación de retorno */}
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-black text-[var(--leaf-dark)] opacity-70 hover:opacity-100 uppercase tracking-widest transition-all hover:-translate-x-1"
        >
          <ArrowLeft size={18} />
          Volver al Dashboard
        </button>

        <div className="flex items-center gap-2 bg-[var(--brain-purple)]/10 px-4 py-2 rounded-2xl border border-[var(--brain-purple)]/20">
          <Image size={20} className="text-[var(--brain-purple)]" />
          <span className="text-xs font-black text-[var(--leaf-dark)] uppercase tracking-wider">
            Pictogramas
          </span>
        </div>
      </header>

      {/* Contenido de Módulo en Construcción */}
      <main className="max-w-4xl mx-auto mt-12 text-center flex flex-col items-center justify-center min-h-[60vh] px-4">
        
        {/* Badge / Insignia de estado */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brain-orange)]/10 border border-[var(--brain-orange)]/30 text-[var(--brain-orange)] mb-6 animate-pulse">
          <Construction size={18} />
          <span className="text-xs font-black uppercase tracking-widest">En desarrollo</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl md:text-6xl font-black text-[var(--leaf-dark)] tracking-tight mb-4">
          Estamos trabajando en este <span className="text-[var(--brain-orange)]">contenido</span>
        </h1>

        {/* Descripción */}
        <p className="text-base md:text-lg text-[var(--leaf-dark)] opacity-70 max-w-xl font-medium leading-relaxed mb-8">
          El módulo de <strong>Pictogramas</strong> estará disponible muy pronto. Estamos diseñando una experiencia accesible e interactiva para ti.
        </p>

        {/* Tarjeta Informativa / Teaser */}
        <div className="w-full bg-white/5 border border-[var(--border)] rounded-3xl p-8 shadow-xl backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--brain-purple)]/10 text-[var(--brain-purple)] rounded-2xl shrink-0">
              <Sparkles size={28} />
            </div>
            <div>

              <p className="text-xs text-[var(--leaf-dark)] opacity-60 mt-0.5">
                Agradecemos tu paciencia mientras trabajamos en mejorar la plataforma. Pronto podrás explorar y utilizar los pictogramas para enriquecer tu experiencia.
              </p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 bg-[var(--leaf-dark)] text-[var(--bg-primary)] font-black text-xs uppercase tracking-widest rounded-2xl hover:brightness-125 transition-all shadow-md shrink-0"
          >
            Regresar al inicio
          </button>
        </div>

      </main>
    </div>
  );
}