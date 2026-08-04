import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import './QueAriasTu.css';

const QueAriasTu = ({ onBack }) => {
  useEffect(() => {
    window.history.pushState(null, '', window.location.pathname);
    const handlePopState = () => {
      if (onBack) onBack();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onBack]);

  return (
    <div className="que-wrapper">
      <header className="que-header">
        <button onClick={onBack} className="que-back-button">
          <ArrowLeft size={18} />
          Regresar
        </button>

        <div className="que-title-group">
          <h2 className="que-title">¿Qué harías tú?</h2>
        </div>
      </header>

      <main className="que-iframe-panel">
        <div className="que-iframe-shell">
          <iframe
            src="/games/que_arias_tu.html"
            title="¿Qué harías tú?"
            className="que-iframe"
            loading="lazy"
            allow="fullscreen"
          />
        </div>
      </main>
    </div>
  );
};

export default QueAriasTu;
