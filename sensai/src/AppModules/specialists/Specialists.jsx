import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, Search, Building2, UserCheck, ShieldAlert, Heart } from 'lucide-react';
import './Specialists.css';

// Datos oficiales semilla enfocados exclusivamente en el programa piloto de Ezequiel Montes, Qro.
const MOCK_SPECIALISTS = [
  {
    id: 1,
    name: "DIF Municipal Ezequiel Montes",
    type: "institution",
    category: "Apoyo Psicológico y Trabajo Social",
    address: "Belisario Domínguez e Ignacio Allende S/N, Centro, Ezequiel Montes, Qro.",
    iconType: "dif",
    // Ubicación real convertida a Embed de Google Maps
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.1285655454656!2d-99.89938162489816!3d20.662425480894082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d436ff117075b7%3A0xc00f2e0ecfc82a93!2sDIF%20Municipal%20Ezequiel%20Montes!5e0!3m2!1ses-419!2smx!4v1718422100000!5m2!1ses-419!2smx"
  },
  {
    id: 2,
    name: "Presidencia Municipal",
    type: "institution",
    category: "Atención Ciudadana y Gestión de Bienestar",
    address: "Belisario Domínguez 10, Centro, Ezequiel Montes, Qro.",
    iconType: "presidencia",
    // Ubicación real convertida a Embed de Google Maps
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.1156843477123!2d-99.89961232489818!3d20.662929980893693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d436feb952fa87%3A0xe7819c9ba9509dfc!2sPresidencia%20Municipal%20de%20Ezequiel%20Montes!5e0!3m2!1ses-419!2smx!4v1718422200000!5m2!1ses-419!2smx"
  }
];

export default function Specialists({ user, onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState(MOCK_SPECIALISTS[0]);
  const [filteredList, setFilteredList] = useState(MOCK_SPECIALISTS);
  const [currentTheme, setCurrentTheme] = useState('light');

  // Detectar cambios de tema del backend de la app / localStorage
  useEffect(() => {
    const updateTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'light';
      setCurrentTheme(theme);
    };

    updateTheme(); // Ejecución inicial

    // Observer por si cambia el tema mientras el módulo está abierto
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    return () => observer.disconnect();
  }, []);

  // Manejo de Popstate para gestos físicos en móviles
  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = () => { if (onBack) onBack(); };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onBack]);

  // Filtrado reactivo adaptado a las 2 dependencias
  useEffect(() => {
    const cleanQuery = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const results = MOCK_SPECIALISTS.filter(item => {
      const matchName = item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(cleanQuery);
      const matchCategory = item.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(cleanQuery);
      return matchName || matchCategory;
    });
    setFilteredList(results);
    if (results.length > 0 && !results.includes(selectedSpecialist)) {
      setSelectedSpecialist(results[0]);
    }
  }, [searchQuery]);

  // Renderizador dinámico de iconos estilizados
  const getIcon = (iconType) => {
    switch (iconType) {
      case 'dif':
        return <Heart size={18} className="text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Building2 size={18} className="text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[var(--bg-primary)] text-slate-800 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      
      {/* HEADER ADAPTATIVO */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-4 py-4 md:px-6 flex items-center justify-between gap-4 z-10 shadow-sm transition-colors">
        <div className="flex items-center gap-3 w-full justify-between sm:justify-start">
          <button 
            onClick={onBack}
            className="flex items-center justify-center gap-2 px-5 py-2 border-2 border-[var(--leaf-dark)] text-[var(--leaf-dark)] dark:text-emerald-400 dark:border-emerald-500 rounded-full font-black hover:bg-[var(--leaf-dark)] hover:text-white dark:hover:bg-emerald-500 dark:hover:text-slate-900 transition-all uppercase text-xs tracking-wider shrink-0"
          >
            <ArrowLeft size={16} /> Regresar
          </button>
          
          <div className="flex flex-col text-right sm:text-left">
            <span className="text-sm font-black uppercase tracking-tight text-slate-950 dark:text-white leading-none">
              Ezequiel Montes
            </span>
            <span className="text-[10px] font-bold text-[var(--leaf-dark)] dark:text-emerald-400 uppercase tracking-wider mt-0.5">
              Líneas de Atención Local
            </span>
          </div>
        </div>
      </header>
      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden w-full">
        
        {/* SIDEBAR: LISTA DE DEPENDENCIAS */}
        <aside className="w-full md:w-[380px] lg:w-[420px] bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 flex flex-col h-1/2 md:h-full z-10 transition-colors">
          <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar bg-white dark:bg-slate-900 transition-colors">
            {filteredList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center opacity-60">
                <ShieldAlert size={32} className="text-amber-500 mb-2" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">No se encontraron dependencias activas.</p>
              </div>
            ) : (
              filteredList.map((specialist) => (
                <div
                  key={specialist.id}
                  onClick={() => setSelectedSpecialist(specialist)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedSpecialist?.id === specialist.id
                      ? 'border-[var(--leaf-dark)] dark:border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm'
                      : 'border-gray-100 dark:border-slate-800/80 hover:border-gray-200 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 ${
                      specialist.iconType === 'dif' ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-blue-50 dark:bg-blue-950/30'
                    }`}>
                      {getIcon(specialist.iconType)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="text-xs font-black tracking-tight text-slate-900 dark:text-white break-words">{specialist.name}</h3>
                      <p className="text-[11px] font-bold text-[var(--leaf-dark)] dark:text-emerald-400 mt-0.5 line-clamp-1">{specialist.category}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
                        <MapPin size={11} className="shrink-0 mt-0.5 text-slate-400 dark:text-slate-500" />
                        <span className="truncate">{specialist.address}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* CONTENEDOR DEL MAPA (Cambio de color dinámico según el tema) */}
        <main className="flex-grow flex flex-col h-1/2 md:h-full relative bg-slate-50 dark:bg-slate-950 transition-colors">
          <div className="flex-grow w-full h-full relative">
            {selectedSpecialist ? (
              <iframe
                title={`Mapa - ${selectedSpecialist.name}`}
                src={selectedSpecialist.embedUrl}
                className={`w-full h-full border-none transition-all duration-500 ${
                  currentTheme === 'dark' ? 'invert-[0.92] hue-rotate-180 contrast-[1.1] brightness-[0.95]' : ''
                }`}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                Selecciona una unidad de atención.
              </div>
            )}
          </div>

          {/* FICHA DETALLADA FLOTANTE */}
          {selectedSpecialist && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-xl max-w-2xl mx-auto z-10 transition-all animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-black tracking-widest px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 dark:text-slate-400">
                    Dependencia de Gobierno (Ezequiel Montes)
                  </span>
                  <h2 className="text-sm font-black tracking-tight text-slate-900 dark:text-white mt-1 break-words">{selectedSpecialist.name}</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex items-start gap-1">
                    <MapPin size={13} className="text-[var(--leaf-dark)] dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-tight">{selectedSpecialist.address}</span>
                  </p>
                </div>
                
                <a
                  href={`tel:${selectedSpecialist.phone}`}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--leaf-dark)] hover:bg-emerald-600 dark:bg-emerald-500 dark:text-slate-900 text-white font-black px-5 py-3 rounded-xl text-[11px] uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0"
                >
                  <Phone size={13} /> Llamar ({selectedSpecialist.phone})
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}