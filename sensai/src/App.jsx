import { useState, useEffect } from 'react'
import { auth, googleProvider } from "./config/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import Landing from './LandingPage/Landing'
import Dashboard from './AppModules/dashboard/Dashboard'
import Auth from './Auth/Auth'
import Chat from './AppModules/chat/Chat' 
import Settings from './AppModules/settings/Settings'
import GamesModule from './AppModules/games/GamesModule'
import ExercisesModule from './AppModules/exercises/ExercisesModule';
import Community from './AppModules/community/Community';

export default function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('landing')
  const [loading, setLoading] = useState(true) 

  // --- LÓGICA DE NAVEGACIÓN GLOBAL ---
  
  // 1. Escuchar el botón físico/gesto de "atrás"
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setView(event.state.view); // Cambiamos la vista según el historial
      } else if (user) {
        setView('dashboard'); // Si no hay estado previo y hay usuario, vamos al Dashboard
      } else {
        setView('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);

  // 2. Función para cambiar de vista y actualizar el historial
  const navigateTo = (newView) => {
    if (newView !== view) {
      window.history.pushState({ view: newView }, '', '');
      setView(newView);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false) 
      
      if (currentUser) {
        // Al iniciar sesión, establecemos el estado base en el historial
        const initialView = (view === 'landing' || view === 'auth') ? 'dashboard' : view;
        window.history.replaceState({ view: initialView }, '', '');
        setView(initialView);
      } else {
        setView('landing')
      }
    })
    return () => unsubscribe()
  }, [])

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
    }
  }

  const logout = () => {
    signOut(auth)
    navigateTo('landing')
  }

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Cargando SENSAI...</div>

  // --- 1. FLUJO SIN USUARIO ---
  if (!user) {
    if (view === 'auth') return <Auth onLogin={login} onBack={() => navigateTo('landing')} />
    return <Landing onLogin={() => navigateTo('auth')} />
  }

  // --- 2. FLUJO CON USUARIO ---
  
  // Módulo de Chat
  if (view === 'chat') {
    return <Chat user={user} onBack={() => navigateTo('dashboard')} />;
  }

  // Módulo de Configuración
  if (view === 'settings') {
    return <Settings user={user} onBack={() => navigateTo('dashboard')} />;
  }

  // Módulo de Comunidad
  if (view === 'community') {
    return <Community user={user} onBack={() => navigateTo('dashboard')} />;
  }

  // Módulo de Juegos 
  if (view === 'games') {
    return <GamesModule user={user} onBack={() => navigateTo('dashboard')} />;
  }

  // Módulo de Ejercicios
  if (view === 'exercises') {
    return <ExercisesModule user={user} onBack={() => navigateTo('dashboard')} />;
  }

  // --- 3. VISTA POR DEFECTO (DASHBOARD) ---
  return (
    <Dashboard 
      user={user} 
      onLogout={logout} 
      onModuleSelect={(id) => navigateTo(id)} 
    />
  )
}