import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import './SopaLetras.css';

const SopaLetras = ({ onBack }) => {
  useEffect(() => {
    window.history.pushState(null, '', window.location.pathname);
    const handlePopState = () => {
      if (onBack) onBack();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onBack]);

  return (
    <div className="sopa-wrapper">
      <header className="sopa-header">
        <button onClick={onBack} className="sopa-back-button">
          <ArrowLeft size={18} />
          Regresar
        </button>

        <div className="sopa-title-group">
          <h2 className="sopa-title">Sopa de Letras</h2>
        </div>
      </header>

      <main className="sopa-iframe-panel">
        <div className="sopa-iframe-shell">
          <iframe
            src="/games/SopaLetras.html"
            title="Sopa de Letras"
            className="sopa-iframe"
            loading="lazy"
            allow="fullscreen"
          />
        </div>
      </main>
    </div>
  );
};

export default SopaLetras;
