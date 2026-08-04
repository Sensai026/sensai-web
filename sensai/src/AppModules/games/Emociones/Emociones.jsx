import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import './Emociones.css';

const Emociones = ({ onBack }) => {
  useEffect(() => {
    window.history.pushState(null, '', window.location.pathname);
    const handlePopState = () => {
      if (onBack) onBack();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onBack]);

  return (
    <div className="emociones-wrapper">
      <header className="emociones-header">
        <button onClick={onBack} className="emociones-back-button">
          <ArrowLeft size={18} />
          Regresar
        </button>

        <div className="emociones-title-group">
          <h2 className="emociones-title">Encuentra la emoción</h2>
        </div>
      </header>

      <main className="emociones-iframe-panel">
        <div className="emociones-iframe-shell">
          <iframe
            src="/games/emociones.html"
            title="Encuentra la emoción"
            className="emociones-iframe"
            loading="lazy"
            allow="fullscreen"
          />
        </div>
      </main>
    </div>
  );
};

export default Emociones;
