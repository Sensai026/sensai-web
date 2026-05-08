import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Languages, 
  MessageSquareText, 
  CheckCircle2, 
  ArrowLeft,
  Download,
  Palette, 
  Check 
} from 'lucide-react';

import { saveUserSettings, getUserSettings } from '../../services/user.service';
import './Settings.css';

export default function Settings({ user, onBack }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // ✅ CAMBIO 1: reemplaza deferredPrompt por isInstallable
  // Se inicializa leyendo si ya existe el prompt global (capturado en main.jsx)
  const [isInstallable, setIsInstallable] = useState(
    () => !!window.__pwaInstallPrompt
  );

  const [settings, setSettings] = useState({
    lenguaje: 'neutro',
    profundidad: 'adaptable',
    tema: 'light'
  });

  const temasDisponibles = [
    { id: 'light',    nombre: 'Natural',    color: '#16572a' },
    { id: 'dark',     nombre: 'Noche',      color: '#0f172a' },
    { id: 'ocean',    nombre: 'Océano',     color: '#0c4a6e' },
    { id: 'sunset',   nombre: 'Atardecer',  color: '#78350f' },
    { id: 'cyber',    nombre: 'Cyber',      color: '#ff00ff' },
    { id: 'forest',   nombre: 'Bosque',     color: '#1a2e05' },
    { id: 'potro',    nombre: 'Potro',      color: '#1e3a8a' },
    { id: 'lavender', nombre: 'Lavanda',    color: '#4c1d95' }
  ];

  useEffect(() => {
    // ✅ CAMBIO 2: verifica si el prompt ya llegó antes de montar este componente
    if (window.__pwaInstallPrompt) {
      setIsInstallable(true);
    }

    // Por si el evento llega mientras Settings está abierto
    const handler = (e) => {
      e.preventDefault();
      window.__pwaInstallPrompt = e;
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Detecta si el usuario ya instaló la app
    const onInstalled = () => {
      window.__pwaInstallPrompt = null;
      setIsInstallable(false);
    };
    window.addEventListener('appinstalled', onInstalled);

    // Cargar configuración del usuario
    const loadData = async () => {
      if (user?.uid) {
        const data = await getUserSettings(user.uid);
        if (data) {
          setSettings(data);
          if (data.tema) {
            document.documentElement.setAttribute('data-theme', data.tema);
          }
        }
      }
    };
    loadData();

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [user]);

  const handleThemeChange = (themeId) => {
    setSettings({ ...settings, tema: themeId });
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('sensai-theme', themeId);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const success = await saveUserSettings(user.uid, settings);
      if (success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CAMBIO 3: lee el prompt desde window.__pwaInstallPrompt
  const handleInstallClick = async () => {
    const prompt = window.__pwaInstallPrompt;
    if (!prompt) {
      alert("Si estás en iPhone: pulsa 'Compartir' → 'Añadir a pantalla de inicio'. En Android, usa Chrome.");
      return;
    }
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      window.__pwaInstallPrompt = null;
      setIsInstallable(false);
    }
  };

  return (
    <div className="settings-container p-6 animate-in fade-in duration-500">
      <header className="flex flex-col items-center gap-4 mb-10 text-center">
        <div className="flex items-center gap-3">
          <div className="bg-brain-purple/10 p-3 rounded-2xl">
            <SettingsIcon className="text-brain-purple" size={32} />
          </div>
          <h1 className="text-3xl font-black text-leaf-dark">Configuración</h1>
        </div>
        
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-6 py-2 border-2 border-leaf-dark text-leaf-dark rounded-full font-bold hover:bg-leaf-dark hover:text-white transition-all"
        >
          <ArrowLeft size={18} />
          VOLVER AL DASHBOARD
        </button>
      </header>

      <div className="space-y-6 max-w-2xl mx-auto">
        
        {/* SECCIÓN: PERSONALIZACIÓN DE TEMA */}
        <section className="settings-card bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Palette className="text-brain-purple" size={22} />
            <h3 className="font-bold text-leaf-dark text-lg">Tema Visual</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {temasDisponibles.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                  settings.tema === t.id 
                    ? 'border-brain-purple bg-brain-purple/5 scale-95 shadow-inner' 
                    : 'border-gray-50 hover:border-gray-200'
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center"
                  style={{ backgroundColor: t.color }}
                >
                  {settings.tema === t.id && <Check size={20} className="text-white" />}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider ${settings.tema === t.id ? 'text-brain-purple' : 'text-gray-400'}`}>
                  {t.nombre}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* SECCIÓN: INSTALACIÓN PWA */}
        <section className="settings-card bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <Download className="text-brain-orange" size={22} />
            <h3 className="font-bold text-leaf-dark text-lg">App Nativa</h3>
          </div>
          <p className="text-sm text-gray-500 text-center mb-4">
            Lleva a SENSAI en tu pantalla de inicio para acceso inmediato.
          </p>
          {/* ✅ CAMBIO 4: usa isInstallable en lugar de deferredPrompt */}
          <button 
            onClick={handleInstallClick}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${
              isInstallable
                ? 'bg-brain-orange text-white hover:scale-[1.02]' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Download size={20} />
            {isInstallable ? 'INSTALAR AHORA' : 'YA INSTALADA'}
          </button>
        </section>

        {/* MODO DE LENGUAJE */}
        {/* --- SECCIÓN MODO DE LENGUAJE --- */}
        <section className="settings-card">
          <div className="flex items-center gap-3 mb-4">
            <Languages className="text-brain-purple" size={20} />
            <h3 className="font-bold text-leaf-dark">Modo de Lenguaje</h3>
          </div>
          <select 
            /* CAMBIO: bg-bg-primary y text-leaf-dark para que cambie con el tema */
            className="w-full p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] font-bold text-[var(--leaf-dark)] focus:ring-2 focus:ring-brain-purple transition-all"
            value={settings.lenguaje}
            onChange={(e) => setSettings({...settings, lenguaje: e.target.value})}
          >
            <option value="neutro" className="bg-[var(--bg-primary)]">Equilibrado (Recomendado)</option>
            <option value="directo" className="bg-[var(--bg-primary)]">Directo y Conciso</option>
            <option value="explicativo" className="bg-[var(--bg-primary)]">Explicativo y Didáctico</option>
          </select>
        </section>

        {/* PROFUNDIDAD */}
        <section className="settings-card bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquareText className="text-brain-purple" size={20} />
            <h3 className="font-bold text-leaf-dark">Profundidad de Respuesta</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['breve', 'adaptable', 'detallada'].map((mode) => (
              <button
                key={mode}
                onClick={() => setSettings({...settings, profundidad: mode})}
                className={`py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                  settings.profundidad === mode 
                    ? 'bg-brain-purple text-white shadow-lg' 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        {/* BOTÓN GUARDAR */}
        <div className="pt-6">
          <button 
            onClick={handleSave}
            disabled={loading}
            /* CAMBIO: bg-brain-orange para que siempre sea visible, pero con texto que contraste */
            className={`w-full py-5 rounded-[2rem] font-black text-white shadow-xl flex items-center justify-center gap-2 transition-all ${
              saved ? 'bg-green-500 scale-95' : 'bg-[var(--brain-orange)] hover:brightness-110 active:scale-95'
            }`}
          >
            {loading ? 'GUARDANDO...' : saved 
              ? <><CheckCircle2 size={24}/> ¡LISTO!</> 
              : <><Save size={24}/> GUARDAR TODO</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}