const board = document.getElementById("game-board");
const levelSelect = document.getElementById("levelSelect");
const startBtn = document.getElementById("startBtn");

let firstCard = null;
let secondCard = null;
let lockBoard = false;

// Variables mejoradas para gamificación
let puntuacionTotal = 0;
let intentosTotales = 0;
let rachaActual = 0;
let mejorRacha = 0;
let nivelActual = 1;
let tiempoRestante = 120;
let intervaloTiempo = null;
let parejasEncontradas = 0;
let totalParejas = 0;
let powerupsDisponibles = {
    revelar: 3,
    tiempo: 2,
    pista: 1
};

// Sistema de logros
const logros = {
    primero: { nombre: "🌱 Primer Recuerdo", descripcion: "Completar primer nivel", desbloqueado: false, id: "logro-primero" },
    perfecto: { nombre: "💎 Memoria Perfecta", descripcion: "Completar nivel sin errores", desbloqueado: false, id: "logro-perfecto" },
    rapido: { nombre: "⚡ Veloz", descripcion: "Completar en menos de 60s", desbloqueado: false, id: "logro-rapido" },
    experto: { nombre: "🧠 Experto", descripcion: "Completar 3 niveles", desbloqueado: false, id: "logro-experto" },
    maestro: { nombre: "🏆 Maestro del Equilibrio", descripcion: "Completar todos los niveles", desbloqueado: false, id: "logro-maestro" }
};

// Modal
const modal = document.getElementById("modal");
const modalTitulo = document.getElementById("modal-title");
const modalMensaje = document.getElementById("modal-message");

startBtn.addEventListener("click", startGame);

function startGame() {
  board.innerHTML = "";
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  
  nivelActual = parseInt(levelSelect.value);
  const level = LEVELS[nivelActual];
  const cards = [...level, ...level].sort(() => 0.5 - Math.random());
  totalParejas = level.length;
  parejasEncontradas = 0;
  
  // Configurar tiempo según nivel
  tiempoRestante = 120 - (nivelActual - 1) * 15; // Nivel 1: 120s, Nivel 5: 60s
  
  // Generar identidad visual según nivel
  generarIdentidadVisual(nivelActual);
  
  board.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(cards.length))}, 100px)`;
  
  cards.forEach(data => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = "?";
    card.style.setProperty("--card-color", data.color);
    card.dataset.emoji = data.emoji;
    card.dataset.text = data.text;
    card.dataset.tema = data.tema;
    
    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });
  
  // Agregar barra de progreso y temporizador
  const progressContainer = document.createElement("div");
  progressContainer.className = "progress-container";
  progressContainer.innerHTML = `
    <div class="progress-bar">
      <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
    </div>
    <div class="timer-container">⏱️ Tiempo: <span id="tiempo">${tiempoRestante}s</span></div>
  `;
  board.appendChild(progressContainer);
  
  iniciarTemporizador();
  actualizarEstadisticas();
  startSession();
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains("flipped")) return;
  
  card.classList.add("flipped");
  card.style.background = card.dataset.color;
  card.textContent = card.dataset.emoji;
  
  if (!firstCard) {
    firstCard = card;
    return;
  }
  
  secondCard = card;
  intentosTotales++;
  checkMatch();
}

function checkMatch() {
  clearInterval(intervaloTiempo);
  
  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    // Pareja correcta
    parejasEncontradas++;
    rachaActual++;
    let puntosGanados = calcularPuntos(nivelActual, tiempoRestante);
    puntuacionTotal += puntosGanados;
    
    // Desbloquear siguiente nivel al completar el actual
    if (parejasEncontradas === totalParejas) {
      const siguienteNivel = nivelActual + 1;
      if (siguienteNivel <= 5 && LEVELS[siguienteNivel]) {
        // Desbloquear nivel siguiente
        const option = document.createElement('option');
        option.value = siguienteNivel;
        option.textContent = `Nivel ${siguienteNivel} - ${LEVELS[siguienteNivel][0].tema.charAt(0).toUpperCase() + LEVELS[siguienteNivel][0].tema.slice(1)}`;
        levelSelect.appendChild(option);
        
        // Guardar progreso de niveles desbloqueados
        const nivelesDesbloqueados = JSON.parse(localStorage.getItem('nivelesDesbloqueados') || '[]');
        if (!nivelesDesbloqueados.includes(siguienteNivel)) {
          nivelesDesbloqueados.push(siguienteNivel);
          localStorage.setItem('nivelesDesbloqueados', JSON.stringify(nivelesDesbloqueados));
          showModal('🔓 Nivel Desbloqueado', `¡Has desbloqueado el Nivel ${siguienteNivel}!`);
        }
      }
    }
    
    // Verificar logros
    if (nivelActual === 1) verificarLogro('primero');
    if (intentosTotales === totalParejas && nivelActual === 1) verificarLogro('perfecto');
    if (tiempoRestante < 60) verificarLogro('rapido');
    if (nivelActual >= 3) verificarLogro('experto');
    if (nivelActual >= 5) verificarLogro('maestro');
    
    // Mantener cartas volteadas más tiempo antes de mostrar modal
    setTimeout(() => {
      showModal("🎉 ¡Recuerdo Encontrado!", `${firstCard.dataset.text}\n+${puntosGanados} puntos`);
      resetTurn();
      actualizarProgreso();
      
      if (parejasEncontradas === totalParejas) {
        setTimeout(() => mostrarFin(), 2000);
      } else {
        setTimeout(() => iniciarTemporizador(), 1000);
      }
    }, 3000); // 3 segundos para ver las cartas
  } else {
    // Pareja incorrecta
    rachaActual = 0;
    lockBoard = true;
    setTimeout(() => {
      firstCard.textContent = "?";
      secondCard.textContent = "?";
      firstCard.style.background = "";
      secondCard.style.background = "";
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 2500); // 2.5 segundos para ver las cartas incorrectas
    
    setTimeout(() => iniciarTemporizador(), 2500);
  }
  
  actualizarEstadisticas();
  guardarProgreso();
}

function resetTurn() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function calcularPuntos(nivel, tiempoRestante) {
  let puntosBase = nivel * 20;
  let bonificacionTiempo = Math.floor(tiempoRestante / 10) * 5;
  let bonificacionRacha = rachaActual * 10;
  
  return puntosBase + bonificacionTiempo + bonificacionRacha;
}

function iniciarTemporizador() {
  clearInterval(intervaloTiempo);
  intervaloTiempo = setInterval(() => {
    tiempoRestante--;
    document.getElementById('tiempo').textContent = tiempoRestante + 's';
    
    if (tiempoRestante <= 0) {
      clearInterval(intervaloTiempo);
      showModal('⏰ Tiempo Agotado', 'Se acabó el tiempo. Intenta de nuevo.');
      setTimeout(() => startGame(), 2000);
    }
  }, 1000);
}

function actualizarProgreso() {
  const progreso = (parejasEncontradas / totalParejas) * 100;
  document.getElementById('progress-fill').style.width = progreso + '%';
}

function mostrarFin() {
  clearInterval(intervaloTiempo);
  const precision = Math.round((totalParejas / intentosTotales) * 100);
  
  board.innerHTML = `
    <div class="world-card">
      <h2>🎉 ¡Nivel Completado!</h2>
      <h3>Nivel ${nivelActual} - ${LEVELS[nivelActual][0].tema}</h3>
      <p>Has encontrado todos los recuerdos emocionales.</p>
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-number">${parejasEncontradas}</div>
          <div class="stat-label">Parejas</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${precision}%</div>
          <div class="stat-label">Precisión</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${puntuacionTotal}</div>
          <div class="stat-label">Puntos</div>
        </div>
      </div>
      <button class="btn" onclick="siguienteNivel()">🚀 Siguiente Nivel</button>
      <button class="btn" onclick="menuPrincipal()">🏠 Menú Principal</button>
    </div>
  `;
}

function siguienteNivel() {
  if (nivelActual < 5) {
    levelSelect.value = nivelActual + 1;
    startGame();
  } else {
    mostrarMisionCompleta();
  }
}

function menuPrincipal() {
  location.reload();
}

function mostrarMisionCompleta() {
  clearInterval(intervaloTiempo);
  
  board.innerHTML = `
    <div class="world-card">
      <h2>🏆 ¡Misión Completada!</h2>
      <h3>🧠 Maestro del Equilibrio Emocional</h3>
      <p>Has dominado todos los niveles de recuerdos y equilibrio.</p>
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-number">5</div>
          <div class="stat-label">Niveles</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${puntuacionTotal}</div>
          <div class="stat-label">Puntuación Final</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${mejorRacha}</div>
          <div class="stat-label">Mejor Racha</div>
        </div>
      </div>
      <div class="achievements-panel">
        <h3>🏆 Logros Desbloqueados</h3>
        ${Object.values(logros).filter(l => l.desbloqueado).map(l => `<div class="achievement-badge unlocked">${l.nombre}</div>`).join('')}
      </div>
      <button class="btn" onclick="reiniciarCompleto()">🔄 Reiniciar Misión</button>
    </div>
  `;
}

function reiniciarCompleto() {
  if (confirm('¿Estás seguro de que quieres reiniciar toda la misión? Perderás todo tu progreso.')) {
    nivelActual = 1;
    puntuacionTotal = 0;
    intentosTotales = 0;
    rachaActual = 0;
    mejorRacha = 0;
    parejasEncontradas = 0;
    powerupsDisponibles = { revelar: 3, tiempo: 2, pista: 1 };
    
    // Resetear logros
    Object.keys(logros).forEach(key => {
      logros[key].desbloqueado = false;
      document.getElementById(logros[key].id).classList.remove('unlocked');
    });
    
    localStorage.clear();
    guardarProgreso();
    actualizarEstadisticas();
    actualizarUIPowerups();
    showModal('🔄 Misión Reiniciada', 'Toda tu misión ha sido reiniciada. ¡Empieza de nuevo con energía renovada!');
    setTimeout(() => location.reload(), 2000);
  }
}

// Funciones de power-ups
function usarPowerup(tipo) {
  if (powerupsDisponibles[tipo] <= 0) return;
  
  powerupsDisponibles[tipo]--;
  actualizarUIPowerups();
  guardarProgreso();
  
  switch(tipo) {
    case 'revelar':
      // Revelar temporalmente todas las cartas
      const cards = document.querySelectorAll('.card:not(.flipped)');
      cards.forEach(card => {
        card.classList.add('flipped');
        card.style.background = card.dataset.color;
        card.textContent = card.dataset.emoji;
      });
      
      setTimeout(() => {
        cards.forEach(card => {
          if (!card.classList.contains('matched')) {
            card.classList.remove('flipped');
            card.style.background = '';
            card.textContent = "?";
          }
        });
      }, 3000); // 3 segundos para ver todas las cartas
      
      showModal('👁️ Revelar', 'Todas las cartas se mostrarán por 3 segundos.');
      break;
      
    case 'tiempo':
      tiempoRestante += 30;
      if (intervaloTiempo) {
        document.getElementById('tiempo').textContent = tiempoRestante + 's';
      }
      showModal('⏰ +30s', 'Se han añadido 30 segundos al temporizador.');
      break;
      
    case 'pista':
      // Encontrar una pareja válida y mostrarla brevemente
      const cardsNoFlipped = document.querySelectorAll('.card:not(.flipped)');
      if (cardsNoFlipped.length >= 2) {
        const randomCard = cardsNoFlipped[Math.floor(Math.random() * cardsNoFlipped.length)];
        randomCard.classList.add('flipped');
        randomCard.style.background = randomCard.dataset.color;
        randomCard.textContent = randomCard.dataset.emoji;
        
        setTimeout(() => {
          randomCard.classList.remove('flipped');
          randomCard.style.background = '';
          randomCard.textContent = "?";
        }, 2000); // 2 segundos para ver la pista
        
        showModal('💡 Pista', 'Se ha mostrado una carta por 2 segundos.');
      }
      break;
  }
}

function actualizarUIPowerups() {
  document.getElementById('count-revelar').textContent = powerupsDisponibles.revelar;
  document.getElementById('count-tiempo').textContent = powerupsDisponibles.tiempo;
  document.getElementById('count-pista').textContent = powerupsDisponibles.pista;
  
  document.getElementById('btn-revelar').disabled = powerupsDisponibles.revelar <= 0;
  document.getElementById('btn-tiempo').disabled = powerupsDisponibles.tiempo <= 0;
  document.getElementById('btn-pista').disabled = powerupsDisponibles.pista <= 0;
}

function actualizarEstadisticas() {
  document.getElementById('puntuacion').textContent = puntuacionTotal;
  document.getElementById('intentos').textContent = intentosTotales;
  document.getElementById('racha').textContent = rachaActual;
  document.getElementById('nivel-actual').textContent = nivelActual;
  
  if (rachaActual > mejorRacha) {
    mejorRacha = rachaActual;
  }
}

function generarIdentidadVisual(nivel) {
  const temas = [
    { 
      primary: '#00B876', 
      secondary: '#E0F7EE', 
      accent: '#FFBB00',
      gradient: 'radial-gradient(circle at 30% 70%, rgba(0, 184, 118, 0.12) 0%, transparent 50%)',
      cardBg: 'linear-gradient(135deg, #E0F7EE, #C8E6C9)',
      textShadow: '0 2px 4px rgba(0, 184, 118, 0.2)'
    }, // Verde + Ámbar - Calma
    { 
      primary: '#3A6FE8', 
      secondary: '#EDF3FE', 
      accent: '#E8357A',
      gradient: 'radial-gradient(circle at 70% 30%, rgba(58, 111, 232, 0.08) 0%, transparent 50%)',
      cardBg: 'linear-gradient(135deg, #EDF3FE, #BBDEFB)',
      textShadow: '0 2px 4px rgba(58, 111, 232, 0.15)'
    }, // Azul + Rosa - Emociones
    { 
      primary: '#FF6820', 
      secondary: '#FFF0E8', 
      accent: '#00CCFF',
      gradient: 'radial-gradient(circle at 50% 50%, rgba(255, 104, 32, 0.06) 0%, transparent 50%)',
      cardBg: 'linear-gradient(135deg, #FFF0E8, #FCE4EC)',
      textShadow: '0 2px 4px rgba(255, 104, 32, 0.18)'
    }, // Naranja + Cian - Autorregulación
    { 
      primary: '#7B3FCE', 
      secondary: '#F0E8FC', 
      accent: '#FFBB00',
      gradient: 'radial-gradient(circle at 20% 80%, rgba(123, 63, 206, 0.1) 0%, transparent 50%)',
      cardBg: 'linear-gradient(135deg, #F0E8FC, #E1BEE7)',
      textShadow: '0 2px 4px rgba(123, 63, 206, 0.12)'
    }, // Violeta + Ámbar - Resiliencia
    { 
      primary: '#E8357A', 
      secondary: '#FCE4EF', 
      accent: '#00B876',
      gradient: 'radial-gradient(circle at 80% 20%, rgba(232, 53, 122, 0.08) 0%, transparent 50%)',
      cardBg: 'linear-gradient(135deg, #FCE4EF, #B2DFDB)',
      textShadow: '0 2px 4px rgba(232, 53, 122, 0.16)'
    }  // Rosa + Verde - Bienestar
  ];
  
  const tema = temas[nivel - 1];
  const styleDinamico = document.createElement('style');
  styleDinamico.id = 'tema-dinamico';
  styleDinamico.textContent = `
    body::before {
      background: ${tema.gradient},
                radial-gradient(circle at 25% 75%, rgba(123, 63, 206, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 75% 25%, rgba(0, 204, 255, 0.06) 0%, transparent 50%);
    }
    
    .main-container {
      border-left: 6px solid ${tema.primary};
      background: linear-gradient(135deg, rgba(255,255,255,0.95), ${tema.secondary});
      box-shadow: 0 8px 36px rgba(${hexToRgb(tema.primary)}, 0.16);
    }
    
    .controls {
      border-left: 6px solid ${tema.primary};
      background: ${tema.cardBg};
      box-shadow: 0 4px 20px rgba(${hexToRgb(tema.primary)}, 0.12);
    }
    
    #game-board {
      border-left: 6px solid ${tema.primary};
      background: ${tema.cardBg};
      box-shadow: 0 4px 20px rgba(${hexToRgb(tema.primary)}, 0.12);
    }
    
    .btn {
      background: ${tema.primary};
      border-color: ${tema.primary};
      box-shadow: 0 2px 8px rgba(${hexToRgb(tema.primary)}, 0.2);
    }
    
    .btn:hover {
      background: ${tema.accent};
      border-color: ${tema.accent};
      box-shadow: 0 4px 16px rgba(${hexToRgb(tema.accent)}, 0.3);
    }
    
    .card {
      border-left: 4px solid ${tema.primary};
      background: ${tema.cardBg};
      box-shadow: 0 2px 12px rgba(${hexToRgb(tema.primary)}, 0.08);
    }
    
    .card:hover {
      border-color: ${tema.accent};
      box-shadow: 0 4px 20px rgba(${hexToRgb(tema.accent)}, 0.15);
      transform: scale(1.05) translateY(-2px);
    }
    
    .card.flipped {
      background: ${tema.cardBg};
      border-color: ${tema.accent};
      box-shadow: 0 4px 20px rgba(${hexToRgb(tema.accent)}, 0.2);
    }
    
    .progress-fill {
      background: linear-gradient(90deg, ${tema.primary}, ${tema.accent});
      box-shadow: 0 2px 8px rgba(${hexToRgb(tema.primary)}, 0.3);
    }
    
    .timer-container {
      border-left: 6px solid ${tema.primary};
      background: ${tema.cardBg};
      box-shadow: 0 2px 12px rgba(${hexToRgb(tema.primary)}, 0.1);
    }
    
    .stats-panel {
      border-left: 6px solid ${tema.primary};
      background: ${tema.cardBg};
      box-shadow: 0 2px 12px rgba(${hexToRgb(tema.primary)}, 0.1);
    }
    
    .powerup-btn {
      background: ${tema.accent};
      border-color: ${tema.accent};
      box-shadow: 0 2px 8px rgba(${hexToRgb(tema.accent)}, 0.2);
    }
    
    .powerup-btn:hover {
      background: ${tema.primary};
      box-shadow: 0 4px 16px rgba(${hexToRgb(tema.primary)}, 0.3);
    }
    
    .hint {
      border: 3px solid ${tema.accent} !important;
      box-shadow: 0 0 20px ${tema.accent} !important;
      transform: scale(1.15) translateY(-4px) !important;
      background: ${tema.cardBg} !important;
    }
    
    .modal-content {
      border-left: 6px solid ${tema.primary};
      background: ${tema.cardBg};
      box-shadow: 0 8px 36px rgba(${hexToRgb(tema.primary)}, 0.2);
    }
    
    h1 {
      background: linear-gradient(135deg, ${tema.primary}, ${tema.accent});
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: ${tema.textShadow};
    }
  `;
  
  // Remover tema anterior si existe
  const temaAnterior = document.getElementById('tema-dinamico');
  if (temaAnterior) {
    temaAnterior.remove();
  }
  
  document.head.appendChild(styleDinamico);
}

// Función auxiliar para convertir hex a RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '123, 63, 206';
}

// Modal personalizado
function showModal(titulo, mensaje) {
  modalTitulo.textContent = titulo;
  modalMensaje.textContent = mensaje;
  modal.classList.add("active");
}

function cerrarModal() {
  modal.classList.remove("active");
}

function verificarLogro(nombreLogro) {
  if (!logros[nombreLogro].desbloqueado) {
    logros[nombreLogro].desbloqueado = true;
    document.getElementById(logros[nombreLogro].id).classList.add("unlocked");
    showModal("🏆 ¡Logro Desbloqueado!", `${logros[nombreLogro].nombre}: ${logros[nombreLogro].descripcion}`);
    puntuacionTotal += 50;
    actualizarEstadisticas();
  }
}

// Guardado mejorado
function guardarProgreso() {
  localStorage.setItem("puntuacion", puntuacionTotal);
  localStorage.setItem("intentos", intentosTotales);
  localStorage.setItem("racha", rachaActual);
  localStorage.setItem("mejorRacha", mejorRacha);
  localStorage.setItem("nivelActual", nivelActual);
  localStorage.setItem("logros", JSON.stringify(logros));
  localStorage.setItem("powerups", JSON.stringify(powerupsDisponibles));
}

function cargarProgreso() {
  const puntuacionGuardada = parseInt(localStorage.getItem("puntuacion")) || 0;
  if (puntuacionGuardada > 0) puntuacionTotal = puntuacionGuardada;
  
  const intentosGuardados = parseInt(localStorage.getItem("intentos")) || 0;
  if (intentosGuardados > 0) intentosTotales = intentosGuardados;
  
  const rachaGuardada = parseInt(localStorage.getItem("racha")) || 0;
  if (rachaGuardada > 0) rachaActual = rachaGuardada;
  
  const mejorRachaGuardada = parseInt(localStorage.getItem("mejorRacha")) || 0;
  if (mejorRachaGuardada > 0) mejorRacha = mejorRachaGuardada;
  
  const nivelGuardado = parseInt(localStorage.getItem("nivelActual")) || 1;
  if (nivelGuardado > 1) nivelActual = nivelGuardado;
  
  // Cargar niveles desbloqueados
  const nivelesDesbloqueados = JSON.parse(localStorage.getItem('nivelesDesbloqueados') || '[1]');
  nivelesDesbloqueados.forEach(nivel => {
    if (nivel > 1 && nivel <= 5) {
      const option = document.createElement('option');
      option.value = nivel;
      option.textContent = `Nivel ${nivel} - ${LEVELS[nivel][0].tema.charAt(0).toUpperCase() + LEVELS[nivel][0].tema.slice(1)}`;
      levelSelect.appendChild(option);
    }
  });
  
  const logrosGuardados = JSON.parse(localStorage.getItem("logros"));
  if (logrosGuardados) {
    Object.keys(logrosGuardados).forEach(key => {
      if (logros[key]) {
        logros[key].desbloqueado = logrosGuardados[key].desbloqueado;
        if (logros[key].desbloqueado) {
          document.getElementById(logros[key].id).classList.add("unlocked");
        }
      }
    });
  }
  
  const powerupsGuardados = JSON.parse(localStorage.getItem("powerups"));
  if (powerupsGuardados) {
    powerupsDisponibles = powerupsGuardados;
    actualizarUIPowerups();
  }
}

// Cargar progreso al iniciar
cargarProgreso();
