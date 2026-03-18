import React, { useState, useEffect } from 'react';

import { 
  Settings as SettingsIcon, 
  Save, 
  Languages, 
  MessageSquareText, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';

import { saveUserSettings, getUserSettings } from '../../services/user.service';
import './Settings.css';

// 2. RECIBIMOS onBack AQUÍ:
export default function Settings({ user, onBack }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [settings, setSettings] = useState({
    lenguaje: 'neutro',
    profundidad: 'adaptable',
    temas: 'bienestar general'
  });

  useEffect(() => {
    const loadData = async () => {
      if (user?.uid) {
        const data = await getUserSettings(user.uid);
        if (data) setSettings(data);
      }
    };
    loadData();
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

  return (
    <div className="settings-container p-6 animate-in fade-in duration-500">
      <header className="flex items-center gap-3 mb-8">
        {/* Ahora onBack funcionará correctamente */}
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="text-leaf-dark" size={24} />
        </button>
        <div className="bg-leaf-light/20 p-3 rounded-2xl">
          <SettingsIcon className="text-leaf-dark" size={28} />
        </div>
        <h1 className="text-2xl font-black text-leaf-dark">Configuración</h1>
      </header>

      <div className="space-y-6 max-w-2xl">
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

        <button 
          onClick={handleSave}
          disabled={loading}
          className={`save-btn flex items-center justify-center gap-2 ${saved ? 'bg-green-500' : 'bg-leaf-dark'}`}
        >
          {loading ? 'Guardando...' : saved ? <><CheckCircle2 size={20}/> Ajustes Guardados</> : <><Save size={20}/> Guardar Preferencias</>}
        </button>
      </div>
    </div>
  );
}