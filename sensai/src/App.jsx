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

// 1. IMPORTAR EL NUEVO HUB DE CUIDADO PERSONAL
import SelfCareHub from './AppModules/self-care/SelfCareHub';

export default function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('landing')
  const [loading, setLoading] = useState(true) 

  // --- LÓGICA DE NAVEGACIÓN GLOBAL ---
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setView(event.state.view);
      } else if (user) {
        setView('dashboard');
      } else {
        setView('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);

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
        const initialView = (view === 'landing' || view === 'auth') ? 'dashboard' : view;
        window.history.replaceState({ view: initialView }, '', '');
        setView(initialView);
      } else {
        setView('landing')
      }
    })
    return () => unsubscribe()
  }, [])

  const applySavedTheme = () => {
    try {
      const savedTheme = localStorage.getItem('sensai-theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error("Error al cargar el tema desde LocalStorage:", error);
    }
  };

  useEffect(() => {
    applySavedTheme();
  }, []);

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

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-leaf-dark">Cargando SENSAI...</div>

  // --- 1. FLUJO SIN USUARIO ---
  if (!user) {
    if (view === 'auth') return <Auth onLogin={login} onBack={() => navigateTo('landing')} />
    return <Landing onLogin={() => navigateTo('auth')} />
  }

  // --- 2. FLUJO CON USUARIO ---
  
  if (view === 'chat') {
    return <Chat user={user} onBack={() => navigateTo('dashboard')} />;
  }

  if (view === 'settings') {
    return <Settings user={user} onBack={() => navigateTo('dashboard')} />;
  }

  if (view === 'community') {
    return <Community user={user} onBack={() => navigateTo('dashboard')} />;
  }

  if (view === 'games') {
    return <GamesModule user={user} onBack={() => navigateTo('dashboard')} />;
  }

  if (view === 'exercises') {
    return <ExercisesModule user={user} onBack={() => navigateTo('dashboard')} />;
  }

  // --- 2.1 NUEVO MÓDULO: CUIDADO PERSONAL ---
  if (view === 'self-care') {
    return <SelfCareHub onBack={() => navigateTo('dashboard')} />;
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