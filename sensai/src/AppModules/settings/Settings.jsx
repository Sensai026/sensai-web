import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Languages, 
  MessageSquareText, 
  CheckCircle2, 
  ArrowLeft,
  Download // Nuevo icono para la instalación
} from 'lucide-react';

import { saveUserSettings, getUserSettings } from '../../services/user.service';
import './Settings.css';

export default function Settings({ user, onBack }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null); // Estado para la PWA
  
  const [settings, setSettings] = useState({
    lenguaje: 'neutro',
    profundidad: 'adaptable',
    temas: 'bienestar general'
  });

  useEffect(() => {
    // Lógica para detectar si la app es instalable (PWA)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const loadData = async () => {
      if (user?.uid) {
        const data = await getUserSettings(user.uid);
        if (data) setSettings(data);
      }
    };
    loadData();

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [user]);

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

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Caso para iOS o navegadores que no soportan el prompt automático
      alert("Para instalar en iPhone: pulsa el botón 'Compartir' de tu navegador y selecciona 'Añadir a pantalla de inicio'.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="settings-container p-6 animate-in fade-in duration-500">
      <header className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="text-leaf-dark" size={24} />
        </button>
        <div className="bg-leaf-light/20 p-3 rounded-2xl">
          <SettingsIcon className="text-leaf-dark" size={28} />
        </div>
        <h1 className="text-2xl font-black text-leaf-dark">Configuración</h1>
      </header>

      <div className="space-y-6 max-w-2xl">
        {/* NUEVA SECCIÓN: INSTALACIÓN PWA */}
        <section className="settings-card border-2 border-leaf-light/30 bg-leaf-light/5">
          <div className="flex items-center gap-3 mb-4">
            <Download className="text-leaf-dark" size={20} />
            <h3 className="font-bold text-leaf-dark">Acceso Directo</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Usa SENSAI como una aplicación en tu celular para una experiencia sin distracciones y acceso inmediato.
          </p>
          <button 
            onClick={handleInstallClick}
            className="w-full py-3 bg-white border-2 border-leaf-dark text-leaf-dark font-black rounded-xl hover:bg-leaf-dark hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Download size={18} />
            INSTALAR APLICACIÓN
          </button>
        </section>

        {/* MODO DE LENGUAJE */}
        <section className="settings-card">
          <div className="flex items-center gap-3 mb-4">
            <Languages className="text-brain-purple" size={20} />
            <h3 className="font-bold text-leaf-dark">Modo de Lenguaje</h3>
          </div>
          <select 
            className="settings-select"
            value={settings.lenguaje}
            onChange={(e) => setSettings({...settings, lenguaje: e.target.value})}
          >
            <option value="neutro">Equilibrado (Recomendado)</option>
            <option value="directo">Directo y Conciso</option>
            <option value="explicativo">Explicativo y Didáctico</option>
          </select>
          <p className="text-xs text-gray-400 mt-2 italic">Define el tono de voz que SENSAI usará contigo.</p>
        </section>

        {/* PROFUNDIDAD */}
        <section className="settings-card">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquareText className="text-brain-purple" size={20} />
            <h3 className="font-bold text-leaf-dark">Profundidad de Respuesta</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['breve', 'adaptable', 'detallada'].map((mode) => (
              <button
                key={mode}
                onClick={() => setSettings({...settings, profundidad: mode})}
                className={`depth-btn ${settings.profundidad === mode ? 'active' : ''}`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* BOTÓN GUARDAR */}
        <button 
          onClick={handleSave}
          disabled={loading}
          className={`save-btn flex items-center justify-center gap-2 transition-all ${saved ? 'bg-green-500 scale-95' : 'bg-leaf-dark'}`}
        >
          {loading ? 'Guardando...' : saved ? <><CheckCircle2 size={20}/> Ajustes Guardados</> : <><Save size={20}/> Guardar Preferencias</>}
        </button>
      </div>
    </div>
  );
}