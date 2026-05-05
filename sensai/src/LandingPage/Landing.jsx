import React from 'react';
import { 
  MessageCircle, 
  Dumbbell, 
  Layout, 
  Gamepad2, 
  Users2, 
  Stethoscope, 
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Facebook,
  Instagram,
  Youtube,
  Mail
} from 'lucide-react';
import './Landing.css'; 
import SensaiLogo from '../assets/sensai-logo.png'; 

// Icono personalizado para TikTok
const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

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
    { Icon: Layout, title: "Cuidado personal", description: "Gestiona tu energía vital y hábitos diarios para un bienestar pleno." },
    { Icon: Gamepad2, title: "Juegos", description: "Retos de lógica como alternativa al consumo pasivo." },
    { Icon: Users2, title: "Comunidad", description: "Espacio moderado para compartir sin invalidación emocional." },
    { Icon: Stethoscope, title: "Profesionales", description: "Directorio para canalización a especialistas de la salud." },
  ];

  return (
    <div className="landing-container">
      {/* Disclaimer Superior */}
      <div className="bg-[#16572a] text-white py-2 px-6 text-center">
        <p className="text-[10px] md:text-xs font-medium tracking-wide flex items-center justify-center gap-2 opacity-90">
          <AlertTriangle size={12} className="text-[#e99d72]" />
          AVISO IMPORTANTE: SENSAI es una herramienta de acompañamiento y no sustituye el tratamiento médico o consulta con profesionales de la salud.
        </p>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <img 
            src={SensaiLogo} 
            alt="SENSAI" 
            className="h-16 md:h-24 w-auto object-contain mx-auto md:mx-0 transition-all" 
          />
          <button onClick={onLogin} className="btn-primary !py-3 !px-8 text-base flex items-center gap-2">
            Entrar <ArrowRight size={20} />
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
            Tu mente en calma, <br />
            <span className="text-[#e99d72] italic underline decoration-[#9cd6b7]/40">tu vida en equilibrio.</span>
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
            <img src={SensaiLogo} alt="Sensai Concept" className="max-h-80 md:max-h-[28rem] drop-shadow-[0_20px_50px_rgba(166,124,194,0.3)]" />
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center md:text-left">
          
          {/* Columna 1: Branding */}
          <div className="flex flex-col items-center md:items-start">
            <img src={SensaiLogo} alt="Sensai" className="h-20 md:h-28 w-auto mb-6" />
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Tecnología ética aplicada a la salud mental. Un proyecto de alumnos del Instituto Tecnológico de Querétaro.
            </p>
          </div>

          {/* Columna 2: Redes Sociales */}
          <div>
            <h4 className="text-[#16572a] font-black uppercase tracking-widest text-sm mb-6">Síguenos</h4>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="#" className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-[#16572a] hover:bg-[#9cd6b7]/20 transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-[#16572a] hover:bg-[#9cd6b7]/20 transition-all">
                <Instagram size={20} />
              </a>
              {/* ENLACE TIKTOK ACTUALIZADO */}
              <a 
                href="https://www.tiktok.com/@sensai_web?_r=1&_t=ZS-965xIrVck56" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-[#16572a] hover:bg-[#9cd6b7]/20 transition-all"
              >
                <TikTokIcon />
              </a>
              <a href="#" className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-[#16572a] hover:bg-[#9cd6b7]/20 transition-all">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 className="text-[#16572a] font-black uppercase tracking-widest text-sm mb-6">Contacto Directo</h4>
            {/* CORREO ACTUALIZADO */}
            <a 
              href="mailto:sensaiproject026@gmail.com" 
              className="inline-flex items-center gap-3 text-gray-600 hover:text-[#16572a] transition-colors font-medium"
            >
              <div className="p-2 bg-[#e99d72]/10 rounded-lg text-[#e99d72]">
                <Mail size={20} />
              </div>
              sensaiproject026@gmail.com
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="max-w-7xl mx-auto pt-10 border-t border-gray-50 text-center">
          <p className="text-gray-400 text-[10px] md:text-xs uppercase font-black tracking-[0.2em] mb-4">
            © 2026 SENSAI
          </p>
          <p className="max-w-3xl mx-auto text-[10px] text-gray-400 italic leading-relaxed">
            * SENSAI utiliza inteligencia artificial para soporte emocional. Si te encuentras en una situación de crisis o emergencia, por favor acude a los servicios de urgencias locales o contacta a un profesional certificado.
          </p>
        </div>
      </footer>
    </div>
  );
}