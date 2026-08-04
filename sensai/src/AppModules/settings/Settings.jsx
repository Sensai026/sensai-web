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
  Check,
  Star,
  HeartHandshake,
  AlertTriangle,
  Trash2
} from 'lucide-react';

import { saveUserSettings, getUserSettings, deleteUserAccountData } from '../../services/user.service';
import { auth, db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { deleteUser, reauthenticateWithPopup, GoogleAuthProvider } from 'firebase/auth';
import './Settings.css';

export default function Settings({ user, onBack }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Estados para el apartado de Valoración integrado
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // ✅ CAMBIO 1: reemplaza deferredPrompt por isInstallable
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

    const handler = (e) => {
      e.preventDefault();
      window.__pwaInstallPrompt = e;
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

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

  // Guardar la valoración directamente en Firestore
  const handleSendFeedback = async () => {
    if (rating === 0) return;
    setFeedbackLoading(true);

    try {
      await addDoc(collection(db, "ratings_feedback"), {
        userId: user?.uid || "anonimo",
        userName: user?.displayName || "Usuario Piloto",
        rating: rating,
        comment: comment.trim(),
        source: 'settings_panel',
        createdAt: serverTimestamp(),
        device: window.innerWidth < 640 ? 'mobile' : 'desktop'
      });

      setFeedbackSent(true);
      setRating(0);
      setComment('');
      setTimeout(() => setFeedbackSent(false), 4000);
    } catch (error) {
      console.error("Error al enviar la valoración:", error);
    } finally {
      setFeedbackLoading(false);
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

  const handleDeleteAccount = async () => {
    if (!user?.uid || !auth.currentUser) {
      setDeleteError('No se pudo identificar tu sesión activa. Intenta iniciar sesión de nuevo.');
      return;
    }

    setDeleteLoading(true);
    setDeleteError('');
    setDeleteSuccess(false);

    try {
      const deletedData = await deleteUserAccountData(user.uid);
      if (!deletedData) {
        throw new Error('No se pudieron eliminar los datos asociados en Firestore.');
      }

      try {
        await deleteUser(auth.currentUser);
      } catch (error) {
        if (error?.code === 'auth/requires-recent-login') {
          await reauthenticateWithPopup(auth.currentUser, new GoogleAuthProvider());
          await deleteUser(auth.currentUser);
        } else {
          throw error;
        }
      }

      setDeleteSuccess(true);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      setDeleteError(
        error?.code === 'auth/requires-recent-login'
          ? 'La eliminación requiere una sesión reciente. Intenta volver a iniciar sesión y repetir el proceso.'
          : 'No se pudo completar la eliminación de la cuenta. Intenta de nuevo más tarde.'
      );
    } finally {
      setDeleteLoading(false);
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

        {/* SECCIÓN: VALORACIÓN Y RETROALIMENTACIÓN DE LA PLATAFORMA */}
        <section className="settings-card bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50">
          <div className="flex items-center gap-3 mb-2 justify-center">
            <HeartHandshake className="text-[var(--brain-orange)]" size={24} />
            <h3 className="font-bold text-leaf-dark text-lg">Tu opinión cuenta</h3>
          </div>
          <p className="text-xs text-gray-400 text-center mb-4">
            Ayúdanos a evaluar el piloto de SENSAI. Tu retroalimentación va directo al equipo de desarrollo.
          </p>

          {feedbackSent ? (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-2 animate-in zoom-in-95">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-full text-emerald-500">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-md font-black text-emerald-600 uppercase tracking-tight">
                ¡Evaluación enviada con éxito!
              </h4>
              <p className="text-xs text-gray-500 max-w-[280px]">
                Agradecemos profundamente el tiempo dedicado a compartir tu experiencia.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Contenedor de Estrellas */}
              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform duration-100 active:scale-75 text-amber-400"
                  >
                    <Star
                      size={32}
                      fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                      className={
                        (hoverRating || rating) >= star 
                          ? "text-amber-400 filter drop-shadow-[0_2px_4px_rgba(251,191,36,0.15)]" 
                          : "text-gray-200"
                      }
                    />
                  </button>
                ))}
              </div>

              {/* Área de texto expandida para feedback detallado */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block pl-1">
                  Cuéntanos tu experiencia de forma detallada:
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escribe sugerencias, errores encontrados o comentarios sobre cómo te ha ayudado la IA..."
                  maxLength={1000}
                  rows={4}
                  className="w-full p-4 text-xs bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brain-purple text-gray-800 placeholder-gray-400 resize-y shadow-inner min-h-[90px]"
                />
                <div className="text-right text-[10px] text-gray-400 pr-1">
                  {comment.length} / 1000 caracteres
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendFeedback}
                disabled={rating === 0 || feedbackLoading}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  rating > 0 && !feedbackLoading
                    ? 'bg-leaf-dark text-white hover:brightness-110 active:scale-95 shadow-md'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {feedbackLoading ? 'ENVIANDO VALORACIÓN...' : 'ENVIAR VALORACIÓN'}
              </button>
            </div>
          )}
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
        <section className="settings-card bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <Languages className="text-brain-purple" size={20} />
            <h3 className="font-bold text-leaf-dark">Modo de Lenguaje</h3>
          </div>
          <select 
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

        {/* BOTÓN GUARDAR CONFIGURACIONES DE LA APP */}
        <div className="pt-6">
          <button 
            onClick={handleSave}
            disabled={loading}
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

        {/* ZONA DE PELIGRO */}
        <section className="border-2 border-rose-300 bg-rose-50/80 rounded-[2rem] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3 justify-center">
            <AlertTriangle className="text-rose-600" size={22} />
            <h3 className="font-black text-rose-700 text-lg">Zona de Peligro</h3>
          </div>
          <p className="text-sm text-rose-700/80 text-center leading-relaxed mb-5">
            Al eliminar tu cuenta, se borrarán permanentemente tus preferencias, historial de chat, mensajes de comunidad y otras actividades asociadas a tu usuario en SENSAI.
          </p>

          {deleteSuccess && (
            <div className="mb-4 rounded-2xl border border-emerald-300 bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700 text-center">
              Tu cuenta ha sido eliminada correctamente.
            </div>
          )}

          {deleteError && (
            <div className="mb-4 rounded-2xl border border-rose-300 bg-white px-4 py-3 text-sm font-semibold text-rose-700 text-center">
              {deleteError}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={deleteLoading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all shadow-lg"
          >
            <Trash2 size={18} />
            {deleteLoading ? 'Procesando...' : 'Eliminar mi cuenta y datos'}
          </button>
        </section>

      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl border border-rose-200">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-rose-100 p-3 text-rose-600">
                <AlertTriangle size={28} />
              </div>
            </div>
            <h3 className="text-center text-xl font-black text-slate-800 mb-3">
              ¿Estás seguro de que deseas eliminar tu cuenta?
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 text-center">
              Esta acción es irreversible. Se borrarán permanentemente tu perfil, historial de conversaciones en el chat, publicaciones de la comunidad y todas tus preferencias en SENSAI.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 font-bold text-slate-700 hover:bg-slate-100 transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 font-black text-white hover:bg-rose-700 active:scale-95 transition-all"
              >
                {deleteLoading ? 'Eliminando...' : 'Sí, eliminar permanentemente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}