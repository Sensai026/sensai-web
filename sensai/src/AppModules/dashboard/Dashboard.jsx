import React from 'react';
import { 
  MessageCircle, 
  Activity, 
  Layout, 
  Gamepad2, 
  Users, 
  Stethoscope, 
  Settings,
  LogOut
} from 'lucide-react';
import './Dashboard.css';

const ModuleCard = ({ id, icon: Icon, title, description, onSelect }) => (
  <div className="module-card-dash group" onClick={() => onSelect(id)}> 
    <div className="icon-container">
      <Icon size={32} strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-bold text-leaf-dark mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    <div className="module-indicator"></div>
  </div>
);

export default function Dashboard({ user, onLogout, onModuleSelect = () => {} }) {
  const modules = [
    { id: 'chat', icon: MessageCircle, title: "Chat IA", description: "Acompañamiento emocional en tiempo real con IA ética." },
    { id: 'exercises', icon: Activity, title: "Ejercicios", description: "Regulación emocional y descarga cognitiva personalizada." },
    { id: 'info', icon: Layout, title: "Infografías", description: "Aprende sobre tus procesos mentales de forma visual." },
    { 
      id: 'games', // Usamos 'games' para que coincida con nuestro GamesModule
      icon: Gamepad2, 
      title: "Juegos", 
      description: "Retos de memoria y estimulación cognitiva para tu bienestar.",
      color: "bg-brain-orange/10", // Si usas colores temáticos
      textColor: "text-brain-orange"
    },
    { id: 'community', icon: Users, title: "Comunidad", description: "Comparte experiencias en un entorno seguro y moderado." },
    { id: 'profesionales', icon: Stethoscope, title: "Especialistas", description: "Directorio para canalización con expertos en salud mental." },
    { id: 'settings', icon: Settings, title: "Configuración", description: "Personaliza el lenguaje, tonos y temas de tu SENSAI." }
  ];

  return (
    <div className="dashboard-layout">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="user-badge">
          <img src={user?.photoURL} alt="User" className="w-12 h-12 rounded-full border-2 border-brain-purple" />
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Bienvenido de nuevo</p>
            <p className="text-lg font-black text-leaf-dark leading-none">{user?.displayName}</p>
          </div>
        </div>

        <button onClick={onLogout} className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-600 uppercase tracking-widest cursor-pointer transition-colors">
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </header>

      <main className="max-w-7xl mx-auto mt-12 md:mt-20">
        <div className="text-center md:text-left mb-10">
          <h2 className="text-4xl md:text-5xl font-black text-leaf-dark tracking-tighter">
            ¿Cómo te sientes <span className="text-brain-orange">hoy?</span>
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Selecciona un módulo para comenzar tu sesión.</p>
        </div>

        <div className="module-grid">
          {modules.map((m) => (
            <ModuleCard key={m.id} {...m} onSelect={onModuleSelect} />
          ))}
        </div>
      </main>
    </div>
  );
}