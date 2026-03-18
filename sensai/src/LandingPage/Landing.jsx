import React from 'react';
import { 
  MessageCircle, 
  Dumbbell, 
  Layout, 
  Gamepad2, 
  Users2, 
  Stethoscope, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import './Landing.css'; 
import SensaiLogo from '../assets/sensai-logo.png'; 

const ModuleCard = ({ Icon, title, description }) => (
  <div className="module-card group">
    <div className="mb-6 p-4 bg-[#9cd6b7]/20 inline-block rounded-2xl group-hover:bg-[#9cd6b7]/40 transition-colors">
      <Icon className="text-[#16572a]" size={32} />
    </div>
    <h3 className="text-xl font-black text-[#16572a]">{title}</h3>
    <p className="text-gray-600 mt-3 text-sm leading-relaxed">{description}</p>
  </div>
);

export default function Landing({ onLogin }) {
  const modules = [
    { Icon: MessageCircle, title: "Chat IA", description: "Conversación libre y expresión emocional adaptada a tu perfil." },
    { Icon: Dumbbell, title: "Ejercicios", description: "Herramientas de regulación emocional y descarga cognitiva." },
    { Icon: Layout, title: "Multimedia", description: "Recursos visuales sobre psicología para comprender tus procesos." },
    { Icon: Gamepad2, title: "Juegos", description: "Retos de lógica como alternativa al consumo pasivo." },
    { Icon: Users2, title: "Comunidad", description: "Espacio moderado para compartir sin invalidación emocional." },
    { Icon: Stethoscope, title: "Profesionales", description: "Directorio para canalización a especialistas de la salud." },
  ];

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img src={SensaiLogo} alt="SENSAI" className="h-12 md:h-16 w-auto object-contain" />
          <button onClick={onLogin} className="btn-primary !py-2 !px-6 text-sm flex items-center gap-2">
            Entrar <ArrowRight size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Hero Section */}
        <section className="text-center mb-24 md:mb-40">
          <div className="inline-flex items-center gap-2 bg-[#a67cc2]/10 text-[#a67cc2] text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-widest mb-8 border border-[#a67cc2]/20 shadow-sm">
            <Sparkles size={14} /> Acompañamiento Humano + IA
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-[#16572a] tracking-tighter leading-[0.9] mb-10">
            Tu bienestar, <br />
            <span className="text-[#e99d72] italic underline decoration-[#9cd6b7]/40">nuestra prioridad.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button onClick={onLogin} className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
              Comenzar mi camino <ArrowRight size={20} />
            </button>
            <button className="btn-secondary w-full sm:w-auto">Conocer más</button>
          </div>
        </section>

        {/* Info Section */}
        <section className="section-highlight flex flex-col md:grid md:grid-cols-2 gap-12 items-center mb-32">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-[#16572a] leading-tight">Espacio para la diversidad.</h2>
            <p className="mt-8 text-gray-700 text-lg md:text-xl leading-relaxed font-medium">
              SENSAI no impone etiquetas rígidas, ofreciendo un acompañamiento profundo y respetuoso adaptado a tu realidad.
            </p>
          </div>
          <div className="w-full flex justify-center bg-white/40 p-10 rounded-[2.5rem] backdrop-blur-sm border border-white/50 shadow-inner">
            <img src={SensaiLogo} alt="Sensai Concept" className="max-h-60 md:max-h-80 drop-shadow-[0_20px_50px_rgba(166,124,194,0.3)]" />
          </div>
        </section>

        {/* Grid de Módulos */}
        <section className="text-center mb-32">
          <h2 className="text-4xl md:text-5xl font-black text-[#16572a] mb-6">Estructura Integral</h2>
          <p className="text-gray-500 text-lg italic mb-16">Diseñado para tu equilibrio diario</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {modules.map((m, i) => <ModuleCard key={i} {...m} />)}
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t py-16 px-6 text-center">
        <img src={SensaiLogo} alt="Sensai" className="h-10 mx-auto mb-8 opacity-40 grayscale" />
        <p className="text-gray-400 text-[10px] md:text-xs uppercase font-black tracking-[0.2em]">
          © 2026 SENSAI | Ética Digital y Enfoque Humano
        </p>
      </footer>
    </div>
  );
}