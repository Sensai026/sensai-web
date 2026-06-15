import React, { useState } from 'react';
import { Star, MessageSquare, X, CheckCircle2 } from 'lucide-react';
import { db } from '../config/firebase.js'; // Ajusta a tu ruta de configuración de Firebase
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function FeedbackModal({ user, isOpen, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setLoading(true);
    try {
      // Guardamos la retroalimentación directamente en Firestore
      await addDoc(collection(db, "ratings_feedback"), {
        userId: user?.uid || "anonimo",
        userName: user?.displayName || "Usuario Piloto",
        rating: rating,
        comment: comment.trim(),
        createdAt: serverTimestamp(),
        device: window.innerWidth < 640 ? 'mobile' : 'desktop'
      });

      setSent(true);
      setTimeout(() => {
        setSent(false);
        setRating(0);
        setComment('');
        onClose();
      }, 2500);
    } catch (error) {
      console.error("Error al guardar la calificación:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-2xl relative transition-all transform scale-100 dark:text-white">
        
        {/* Botón Cerrar */}
        {!sent && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        )}

        {sent ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 animate-in zoom-in-95">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-full text-emerald-500">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-black text-[var(--leaf-dark)] dark:text-emerald-400 uppercase tracking-tight">
              ¡Muchas Gracias!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px]">
              Tu calificación nos ayuda a mejorar el servicio para Ezequiel Montes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-[var(--leaf-dark)] dark:text-white uppercase tracking-tight">
                Califica tu Experiencia
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-400">
                Ayúdanos a evaluar el desempeño del sistema piloto.
              </p>
            </div>

            {/* Selector de Estrellas */}
            <div className="flex items-center justify-center gap-1.5 py-2">
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
                    size={36}
                    fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                    className={
                      (hoverRating || rating) >= star 
                        ? "text-amber-400 filter drop-shadow-[0_2px_4px_rgba(251,191,36,0.2)]" 
                        : "text-slate-200 dark:text-slate-700"
                    }
                  />
                </button>
              ))}
            </div>

            {/* Campo de Comentarios */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MessageSquare size={12} /> Comentario Opcional
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="¿Qué te pareció la app? ¿Encontraste lo que buscabas?"
                maxLength={300}
                rows={3}
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brain-purple text-slate-800 dark:text-slate-100 placeholder-slate-400 resize-none shadow-inner"
              />
            </div>

            {/* Botón de Envío */}
            <button
              type="submit"
              disabled={rating === 0 || loading}
              className={`w-full py-3.5 rounded-xl font-black text-xs text-white uppercase tracking-wider transition-all shadow-md ${
                rating > 0 && !loading
                  ? 'bg-[var(--brain-orange)] hover:brightness-110 active:scale-95'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
              }`}
            >
              {loading ? 'Enviando...' : 'Enviar Evaluación'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}