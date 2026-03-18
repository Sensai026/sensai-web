import React from 'react';
import './Auth.css';
import SensaiLogo from '../assets/sensai-logo.png';

export default function Auth({ onLogin, onBack }) {
  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo más grande para dar confianza */}
        <img src={SensaiLogo} alt="SENSAI" className="h-24 mb-8" />
        
        <h2 className="text-3xl font-black text-leaf-dark tracking-tighter mb-2">
          Bienvenido
        </h2>
        <p className="text-gray-500 text-sm mb-10 leading-relaxed">
        Accede para continuar con tu proceso de bienestar o crea tu cuenta en segundos.
        </p>
        {/* Botón de Google */}
        <button onClick={onLogin} className="google-button">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.png" alt="Google" className="w-5" />
          Continuar con Google
        </button>

        <p className="mt-8 text-[10px] text-gray-400 uppercase font-bold tracking-widest px-4">
          Seguridad prioritaria con cifrado y protección de datos
        </p>

        {/* Botón para volver a la landing */}
        <button 
          onClick={onBack} 
          className="mt-10 text-leaf-dark/60 hover:text-leaf-dark text-xs font-bold underline decoration-monitor-mint underline-offset-4 cursor-pointer"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}