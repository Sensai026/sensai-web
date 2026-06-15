import React, { useState } from 'react';
import { Palette, Languages, MessageSquareText, Check, Save } from 'lucide-react';
import { saveUserSettings } from '../services/user.service'; // Asegura la ruta correcta

export default function InitialSetup({ user, onSetupComplete }) {
  const [loading, setLoading] = useState(false);
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

  const handleThemeChange = (themeId) => {
    setSettings({ ...settings, tema: themeId });
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('sensai-theme', themeId);
  };

  const handleFinalSave = async () => {
    setLoading(true);
    try {
      // Guardamos en la base de datos distribuida de Firebase
      const success = await saveUserSettings(user.uid, settings);
      if (success) {
        // Callback para avisarle a App.jsx que el usuario ya tiene sus datos listos
        onSetupComplete(settings);
      }
    } catch (error) {
      console.error("Error en la configuración inicial:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-primary)] p-4 overflow-y-auto selection:bg-brain-purple/20">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 p-6 md:p-8 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-500 transition-colors">
        
        {/* Encabezado de Bienvenida */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-[var(--leaf-dark)] dark:text-emerald-400 tracking-tight">
            ¡Hola, {user?.displayName?.split(' ')[0]}!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
            Personaliza tu experiencia en **SENSAI** antes de comenzar. Estos ajustes se guardarán de forma segura en tu cuenta.
          </p>
        </div>

        {/* 1. SECCIÓN TEMA */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Palette size={18} className="text-brain-purple" />
            <h3 className="font-bold text-xs uppercase tracking-wider">1. Tema Visual</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {temasDisponibles.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleThemeChange(t.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                  settings.tema === t.id 
                    ? 'border-brain-purple bg-brain-purple/5 dark:bg-brain-purple/10 scale-95 shadow-inner' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center"
                  style={{ backgroundColor: t.color }}
                >
                  {settings.tema === t.id && <Check size={16} className="text-white" />}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${settings.tema === t.id ? 'text-brain-purple' : 'text-slate-400 dark:text-slate-500'}`}>
                  {t.nombre}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 2. SECCIÓN MODO DE LENGUAJE */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Languages size={18} className="text-brain-purple" />
            <h3 className="font-bold text-xs uppercase tracking-wider">2. Modo de Lenguaje</h3>
          </div>
          <select 
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm text-[var(--leaf-dark)] dark:text-slate-200 focus:ring-2 focus:ring-brain-purple transition-all outline-none"
            value={settings.lenguaje}
            onChange={(e) => setSettings({...settings, lenguaje: e.target.value})}
          >
            <option value="neutro">Equilibrado (Recomendado)</option>
            <option value="directo">Directo y Conciso</option>
            <option value="explicativo">Explicativo y Didáctico</option>
          </select>
        </section>

        {/* 3. SECCIÓN PROFUNDIDAD */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <MessageSquareText size={18} className="text-brain-purple" />
            <h3 className="font-bold text-xs uppercase tracking-wider">3. Profundidad de Respuesta</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['breve', 'adaptable', 'detallada'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSettings({...settings, profundidad: mode})}
                className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                  settings.profundidad === mode 
                    ? 'bg-brain-purple text-white border-brain-purple shadow-md' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        {/* BOTÓN DE CONFIRMACIÓN */}
        <div className="pt-4">
          <button 
            onClick={handleFinalSave}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-white bg-[var(--brain-orange)] hover:brightness-110 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg text-sm tracking-wider uppercase"
          >
            <Save size={18} />
            {loading ? 'Configurando cuenta...' : 'Confirmar y entrar'}
          </button>
        </div>

      </div>
    </div>
  );
}