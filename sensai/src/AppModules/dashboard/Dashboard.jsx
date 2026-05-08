import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Activity, 
  Gamepad2, 
  Users, 
  Stethoscope, 
  Settings,
  LogOut,
  Bell,
  AlertTriangle,
  HeartPulse 
} from 'lucide-react';
import { subscribeToCrisisAlerts } from '../../services/crisis.service';
import './Dashboard.css';

// Componente de Tarjeta Adaptable
const ModuleCard = ({ id, icon: Icon, title, description, onSelect }) => (
  <div className="module-card-dash group" onClick={() => onSelect(id)}> 
    <div className="icon-container">
      <Icon size={32} strokeWidth={1.5} />
    </div>
    {/* CAMBIO: text-[var(--leaf-dark)] para que cambie con el tema */}
    <h3 className="text-xl font-bold text-[var(--leaf-dark)] mb-2">{title}</h3>
    <p className="text-[var(--leaf-dark)] opacity-60 text-sm leading-relaxed">{description}</p>
    <div className="module-indicator"></div>
  </div>
);

export default function Dashboard({ user, onLogout, onModuleSelect = () => {} }) {
  const [alerts, setAlerts] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = subscribeToCrisisAlerts(user.uid, (newAlerts) => {
        setAlerts(newAlerts);
      });
      return () => unsubscribe();
    }
  }, [user?.uid]);

  const modules = [
    { id: 'chat', icon: MessageCircle, title: "Chat IA", description: "Acompañamiento emocional en tiempo real con IA ética." },
    { id: 'exercises', icon: Activity, title: "Ejercicios", description: "Regulación emocional y descarga cognitiva personalizada." },
    { id: 'self-care', icon: HeartPulse, title: "Cuidado personal", description: "Gestiona tu energía vital y hábitos diarios para un bienestar pleno." },
    { id: 'games', icon: Gamepad2, title: "Juegos", description: "Retos de memoria y estimulación cognitiva para tu bienestar." },
    { id: 'community', icon: Users, title: "Comunidad", description: "Comparte experiencias en un entorno seguro y moderado." },
    { id: 'profesionales', icon: Stethoscope, title: "Especialistas", description: "Directorio para canalización con expertos en salud mental." },
    { id: 'settings', icon: Settings, title: "Configuración", description: "Personaliza el lenguaje, tonos y temas de tu SENSAI." }
  ];

  return (
    /* CAMBIO: bg-[var(--bg-primary)] asegura que el fondo cambie */
    <div className="dashboard-layout bg-[var(--bg-primary)] min-h-screen animate-fadeIn transition-colors duration-500">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 p-6">
        <div className="flex items-center gap-4">
          <div className="user-badge bg-white/5 p-2 rounded-2xl border border-[var(--border)]">
            <img 
              src={user?.photoURL} 
              alt="User" 
              className="w-12 h-12 rounded-full border-2 border-[var(--brain-purple)]" 
            />
            <div>
              <p className="text-[10px] text-[var(--leaf-dark)] opacity-50 font-black uppercase tracking-widest">Bienvenido</p>
              <p className="text-lg font-black text-[var(--leaf-dark)] leading-none">{user?.displayName}</p>
            </div>
          </div>

          <div className="relative">
            <button 
              className="notification-bell-container"
              onClick={() => setShowNotifs(!showNotifs)}
            >
              <Bell size={24} className={alerts.length > 0 ? "text-[var(--brain-orange)]" : "text-[var(--leaf-dark)] opacity-40"} />
              {alerts.length > 0 && (
                <div className="notification-badge bg-[var(--brain-orange)]">
                  {alerts.length}
                </div>
              )}
            </button>

            {showNotifs && (
              <div className="notifications-panel bg-[var(--bg-primary)] border border-[var(--border)] shadow-2xl rounded-[1.5rem] overflow-hidden">
                {/* Encabezado del panel */}
                <div className="p-4 bg-[var(--leaf-dark)]/5 border-b border-[var(--border)]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--leaf-dark)] opacity-60">
                    Notificaciones
                  </p>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {alerts.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-sm text-[var(--leaf-dark)] opacity-40 italic">
                        No tienes notificaciones pendientes.
                      </p>
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div key={alert.id} className="notif-item border-b border-[var(--border)]/30 hover:bg-[var(--brain-purple)]/5 transition-colors">
                        <div className="flex gap-3 p-4">
                          {/* Icono de alerta: Usamos el naranja del logo para que resalte */}
                          <div className="bg-[var(--brain-orange)]/10 p-2 rounded-xl h-fit">
                            <AlertTriangle size={16} className="text-[var(--brain-orange)]" />
                          </div>
                          
                          <div className="text-left">
                            <p className="text-sm font-bold text-[var(--leaf-dark)] leading-tight">
                              Protocolo de Crisis
                            </p>
                            <p className="text-xs text-[var(--leaf-dark)] opacity-70 mt-1">
                              {alert.message}
                            </p>
                            <p className="text-[9px] font-black text-[var(--leaf-dark)] opacity-30 mt-2 uppercase tracking-tighter">
                              {alert.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <button onClick={onLogout} className="flex items-center gap-2 text-xs font-black text-red-500/70 hover:text-red-500 uppercase tracking-widest transition-all">
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </header>

      <main className="max-w-7xl mx-auto mt-12 md:mt-20 px-6 pb-20">
        <div className="text-center md:text-left mb-10">
          <h2 className="text-4xl md:text-6xl font-black text-[var(--leaf-dark)] tracking-tighter">
            ¿Cómo te sientes <span className="text-[var(--brain-orange)]">hoy?</span>
          </h2>
          <p className="text-[var(--leaf-dark)] opacity-60 mt-2 font-medium">Selecciona un módulo para comenzar.</p>
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