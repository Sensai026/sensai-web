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
  HeartPulse // Icono representativo para Cuidado Personal
} from 'lucide-react';
import { subscribeToCrisisAlerts } from '../../services/crisis.service';
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

  // Lista de módulos con "Cuidado Personal" reemplazando Multimedia y Hábitos
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
    <div className="dashboard-layout animate-fadeIn">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="user-badge">
            <img src={user?.photoURL} alt="User" className="w-12 h-12 rounded-full border-2 border-brain-purple" />
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Bienvenido de nuevo</p>
              <p className="text-lg font-black text-leaf-dark leading-none">{user?.displayName}</p>
            </div>
          </div>

          <div className="relative">
            <button 
              className="notification-bell-container"
              onClick={() => setShowNotifs(!showNotifs)}
            >
              <Bell size={24} className={alerts.length > 0 ? "text-brain-orange" : "text-gray-400"} />
              {alerts.length > 0 && (
                <div className="notification-badge">
                  {alerts.length}
                </div>
              )}
            </button>

            {showNotifs && (
              <div className="notifications-panel">
                <div className="p-4 bg-slate-50 border-b border-gray-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notificaciones</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {alerts.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-sm text-gray-400 italic">No tienes notificaciones pendientes.</p>
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div key={alert.id} className="notif-item">
                        <div className="flex gap-3">
                          <div className="bg-red-100 p-2 rounded-xl h-fit">
                            <AlertTriangle size={16} className="text-red-500" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-800 leading-tight">Protocolo de Crisis</p>
                            <p className="text-xs text-slate-500 mt-1">{alert.message}</p>
                            <p className="text-[9px] font-black text-slate-300 mt-2 uppercase tracking-tighter">
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