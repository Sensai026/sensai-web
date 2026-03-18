import { useState, useEffect } from 'react'
import { auth, googleProvider } from "./config/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import Landing from './LandingPage/Landing'
import Dashboard from './AppModules/dashboard/Dashboard'
import Auth from './Auth/Auth'
import Chat from './AppModules/chat/Chat' 
import Settings from './AppModules/settings/Settings'
import GamesModule from './AppModules/games/GamesModule'
import Community from './AppModules/community/Community';

export default function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('landing')
  const [loading, setLoading] = useState(true) 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false) 
      
      if (currentUser) {
        setView(prev => (prev === 'landing' || prev === 'auth' ? 'dashboard' : prev));
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
    setView('landing')
  }

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Cargando SENSAI...</div>

  // --- 1. FLUJO SIN USUARIO ---
  if (!user) {
    if (view === 'auth') return <Auth onLogin={login} onBack={() => setView('landing')} />
    return <Landing onLogin={() => setView('auth')} />
  }

// --- 2. FLUJO CON USUARIO ---
  
  // Módulo de Chat
  if (view === 'chat') {
    return <Chat user={user} onBack={() => setView('dashboard')} />;
  }

  // Módulo de Configuración
  if (view === 'settings') {
    return <Settings user={user} onBack={() => setView('dashboard')} />;
  }

  // Módulo de Comunidad
  if (view === 'community') {
    return <Community user={user} onBack={() => setView('dashboard')} />;
  }

  // Módulo de Juegos (Ahora usa el GamesModule como HUB)
  if (view === 'games') {
    return <GamesModule user={user} onBack={() => setView('dashboard')} />;
  }

  // --- 3. VISTA POR DEFECTO (DASHBOARD) ---
  return (
    <Dashboard 
      user={user} 
      onLogout={logout} 
      onModuleSelect={(id) => {
        setView(id);
      }} 
    />
  )
}