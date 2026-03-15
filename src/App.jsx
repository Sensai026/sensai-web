import './index.css' // <--- Esta línea es la que conecta Tailwind con tu código

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-4xl font-black text-primary tracking-tight">SENSAI</h1>
        <p className="text-gray-500 mt-2 font-medium">Plataforma de acompañamiento emocional</p>
        <button className="mt-6 px-8 py-3 bg-primary text-white font-semibold rounded-full shadow-md hover:shadow-primary/30 hover:scale-105 transition-all">
          Comenzar prueba con 100 usuarios
        </button>
      </div>
    </div>
  )
}

export default App