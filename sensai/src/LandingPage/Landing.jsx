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
  Mail
} from 'lucide-react';
import './Landing.css'; 
import SensaiLogo from '../assets/sensai-logo.png'; 

// Icono personalizado para TikTok (basado en el estilo de Lucide)
const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

// Componente de Tarjeta de Módulos
const ModuleCard = ({ Icon, title, description }) => (
  <div className="module-card group">
    <div className="mb-6 p-4 bg-[#D1FAE5] inline-block rounded-2xl group-hover:bg-[#00B876] group-hover:text-white transition-all duration-300">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-black text-[#0A0F29]">{title}</h3>
    <p className="text-gray-600 mt-3 text-sm leading-relaxed">{description}</p>
  </div>
);

export default function Landing({ onLogin }) {
  const modules = [
    { Icon: MessageCircle, title: "Chat IA", description: "Conversación libre y expresión emocional adaptada a tu perfil único." },
    { Icon: Dumbbell, title: "Ejercicios", description: "Herramientas de regulación emocional y descarga cognitiva inmediata." },
    { Icon: Layout, title: "Cuidado personal", description: "Gestiona tu energía vital y hábitos para un bienestar pleno." },
    { Icon: Gamepad2, title: "Juegos", description: "Retos de lógica como alternativa saludable al consumo pasivo." },
    { Icon: Users2, title: "Comunidad", description: "Espacio moderado para compartir sin invalidación emocional." },
    { Icon: Stethoscope, title: "Profesionales", description: "Directorio para canalización a especialistas de la salud mental." },
  ];
  const ModuleCard = ({ Icon, title, description }) => (
    <div className="module-card group">
      {/* Contenedor del Icono con el verde del logo */}
      <div className="mb-6 w-16 h-16 flex items-center justify-center bg-[#00B876]/10 text-[#00B876] rounded-2xl group-hover:bg-[#00B876] group-hover:text-white transition-all duration-300 shadow-inner">
        <Icon size={32} />
      </div>
      
      {/* Título en azul oscuro (como el texto del logo) */}
      <h3 className="text-2xl font-black text-[#0A0F29] mb-3 tracking-tight">
        {title}
      </h3>
      
      {/* Línea divisoria decorativa corta */}
      <div className="w-12 h-1 bg-gradient-to-r from-[#2B59FF] to-[#00B876] mb-4 rounded-full opacity-40 group-hover:w-20 transition-all duration-500"></div>
      
      {/* Descripción */}
      <p className="text-gray-500 font-medium leading-relaxed">
        {description}
      </p>
    </div>
  );

  return (
    <div className="landing-container">
      
      {/* 1. AVISO CRÍTICO SUPERIOR (BANNER) */}
      <div className="banner-urgent">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <AlertTriangle size={18} className="text-white animate-pulse" />
          <p className="text-[10px] md:text-xs tracking-[0.1em] uppercase font-black">
            Aviso Crítico: <span className="font-medium normal-case tracking-normal">SENSAI es una herramienta de acompañamiento y no sustituye el tratamiento médico profesional.</span>
          </p>
        </div>
      </div>

      {/* 2. HEADER */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img 
            src={SensaiLogo} 
            alt="SENSAI" 
            className="h-12 md:h-16 w-auto object-contain transition-all" 
          />
          <button 
            onClick={onLogin} 
            className="btn-primary flex items-center gap-2"
          >
            Entrar <ArrowRight size={20} />
          </button>
        </div>
      </header>

      {/* 3. MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Hero Section */}
        <section className="text-center mb-24 md:mb-40">
          <div className="inline-flex items-center gap-2 bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-widest mb-8 border border-[#8B5CF6]/20 shadow-sm">
            <Sparkles size={14} /> Acompañamiento Humano + IA
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-[#0A0F29] tracking-tighter leading-[0.9] mb-10">
            Tu mente en calma, <br />
            <span className="text-[#FF6B00] italic underline decoration-[#00B876]/30">tu vida en equilibrio.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button onClick={onLogin} className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
              Comenzar mi camino <ArrowRight size={20} />
            </button>
            <button className="btn-secondary w-full sm:w-auto">Conocer más</button>
          </div>
        </section>

        {/* Info Highlight Section */}
        <section className="section-highlight flex flex-col md:grid md:grid-cols-2 gap-12 items-center mb-32">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-[#0A0F29] leading-tight">Espacio para la diversidad.</h2>
            <p className="mt-8 text-gray-700 text-lg md:text-xl leading-relaxed font-medium">
              SENSAI no impone etiquetas rígidas, ofreciendo un acompañamiento profundo y respetuoso adaptado a tu realidad individual.
            </p>
          </div>
          <div className="w-full flex justify-center bg-white/60 p-10 rounded-[3rem] backdrop-blur-sm border border-white shadow-inner">
            <img 
              src={SensaiLogo} 
              alt="Sensai Concept" 
              className="max-h-80 md:max-h-[24rem] drop-shadow-2xl" 
            />
          </div>
        </section>

        {/* Módulos Grid */}
        <section className="text-center mb-32">
          <h2 className="text-4xl md:text-5xl font-black text-[#0A0F29] mb-6 tracking-tight">Estructura Integral</h2>
          <p className="text-gray-500 text-lg italic mb-16">Diseñado para tu equilibrio diario</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {modules.map((m, i) => <ModuleCard key={i} {...m} />)}
          </div>
        </section>
      </main>

      {/* 4. FOOTER SENSAI (DISEÑO ACTUALIZADO) */}
      <footer className="footer-sensai">
        {/* Luces de fondo decorativas basadas en el logo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2B59FF]/10 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00B876]/10 blur-[100px] rounded-full -z-10"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20 items-start">
            
            {/* Branding */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="bg-white p-6 rounded-[2.5rem] inline-block shadow-2xl">
                <img src={SensaiLogo} alt="Sensai Logo" className="h-16 w-auto" />
              </div>
              <p className="text-white/60 text-lg font-medium leading-relaxed max-w-sm">
                Redefiniendo el acompañamiento emocional a través de la tecnología ética. Un proyecto orgulloso del ITQ.
              </p>
            </div>

            {/* Redes Sociales */}
            <div className="space-y-8 text-center lg:text-left">
              <h4 className="text-[#FFB800] font-black uppercase tracking-[0.2em] text-sm">Comunidad</h4>
              <div className="flex justify-center lg:justify-start gap-4">
                <a href="#" className="p-4 bg-white/5 rounded-2xl hover:bg-[#2B59FF] hover:scale-110 transition-all border border-white/10">
                  <Facebook size={24} />
                </a>
                <a href="#" className="p-4 bg-white/5 rounded-2xl hover:bg-[#8B5CF6] hover:scale-110 transition-all border border-white/10">
                  <Instagram size={24} />
                </a>
                <a 
                  href="https://www.tiktok.com/@sensai_web" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 bg-white/5 rounded-2xl hover:bg-[#00B876] hover:scale-110 transition-all border border-white/10"
                >
                  <TikTokIcon />
                </a>
              </div>
            </div>

            {/* Contacto */}
            <div className="space-y-8">
              <h4 className="text-[#FFB800] font-black uppercase tracking-[0.2em] text-sm">Contacto Directo</h4>
              <a 
                href="mailto:sensaiproject026@gmail.com" 
                className="flex items-center gap-5 p-6 bg-white/5 rounded-[2rem] border border-white/10 hover:border-[#FF6B00]/50 transition-all group"
              >
                <div className="p-3 bg-[#FF6B00] text-white rounded-xl shadow-lg group-hover:rotate-12 transition-transform">
                  <Mail size={24} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.1em]">Escríbenos</p>
                  <p className="text-sm font-bold text-white">sensaiproject026@gmail.com</p>
                </div>
              </a>
            </div>
          </div>

          {/* --- AVISO MÉDICO / CRISIS (ÉNFASIS TOTAL) --- */}
          <div className="medical-warning-card">
            <div className="flex flex-col md:grid md:grid-cols-[auto_1fr] items-center gap-8">
              <div className="p-5 bg-[#FF6B00]/10 text-[#FF6B00] rounded-full animate-pulse">
                <AlertTriangle size={48} />
              </div>
              <div className="space-y-3 text-center md:text-left">
                <h5 className="text-[#0A0F29] font-black uppercase tracking-[0.3em] text-xs">Atención Urgente y Seguridad</h5>
                <p className="text-[#0A0F29]/80 text-base md:text-xl font-bold leading-tight">
                  SENSAI utiliza inteligencia artificial para soporte emocional. 
                  <span className="text-[#FF6B00]"> Si te encuentras en una situación de crisis o peligro, contacta de inmediato a servicios de emergencia o profesionales certificados.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/20 text-[10px] font-black tracking-[0.3em] uppercase">
            <p>© 2026 SENSAI PROJECT • INNOVATEC</p>
            <div className="flex gap-8 tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}