import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ✅ Captura global ANTES de que cualquier componente monte
window.__pwaInstallPrompt = null

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.__pwaInstallPrompt = e
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.__pwaInstallPrompt = e
  console.log('✅ beforeinstallprompt capturado') // ← agrega esto
})

// Agrega esto también:
window.addEventListener('appinstalled', () => {
  console.log('✅ App ya estaba instalada')
})