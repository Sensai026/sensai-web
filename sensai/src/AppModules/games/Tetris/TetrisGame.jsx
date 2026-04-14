// src/AppModules/games/Tetris/TetrisGame.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RotateCw, ArrowDown, ArrowRight, ArrowLeft as ArrowLeftIcon, Trophy, Layers } from 'lucide-react';
import './TetrisGame.css';

export default function TetrisGame({ onBack }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  // Colores profesionales SENSAI
  const colors = [
    null,
    '#FF0D72', // T
    '#0DC2FF', // O
    '#0DFF72', // L
    '#F538FF', // J
    '#FF8E0D', // I
    '#FFE138', // S
    '#3877FF', // Z
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Configuración inicial del contexto
    context.setTransform(1, 0, 0, 1, 0, 0); // Reset transform antes de escalar
    context.scale(20, 20);

    let dropCounter = 0;
    let dropInterval = 800;
    let lastTime = 0;
    let requestId;

    const arena = createMatrix(12, 20);
    const player = {
      pos: { x: 0, y: 0 },
      matrix: null,
      score: 0,
      level: 1,
    };

    function createMatrix(w, h) {
      const matrix = [];
      while (h--) matrix.push(new Array(w).fill(0));
      return matrix;
    }

    function createPiece(type) {
      if (type === 'T') return [[0, 1, 0], [1, 1, 1], [0, 0, 0]];
      if (type === 'O') return [[2, 2], [2, 2]];
      if (type === 'L') return [[0, 3, 0], [0, 3, 0], [0, 3, 3]];
      if (type === 'J') return [[0, 4, 0], [0, 4, 0], [4, 4, 0]];
      if (type === 'I') return [[0, 5, 0, 0], [0, 5, 0, 0], [0, 5, 0, 0], [0, 5, 0, 0]];
      if (type === 'S') return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
      if (type === 'Z') return [[7, 7, 0], [0, 7, 7], [0, 0, 0]];
    }

    function draw() {
      // Limpiamos el canvas usando coordenadas escaladas
      context.fillStyle = '#000';
      context.fillRect(0, 0, canvas.width / 20, canvas.height / 20);

      drawMatrix(arena, { x: 0, y: 0 });
      if (player.matrix) {
        drawMatrix(player.matrix, player.pos);
      }
    }

    function drawMatrix(matrix, offset) {
      matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            context.fillStyle = colors[value];
            context.fillRect(x + offset.x, y + offset.y, 1, 1);
            context.strokeStyle = '#000';
            context.lineWidth = 0.05;
            context.strokeRect(x + offset.x, y + offset.y, 1, 1);
          }
        });
      });
    }

    function merge(arena, player) {
      player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            arena[y + player.pos.y][x + player.pos.x] = value;
          }
        });
      });
    }

    function collide(arena, player) {
      const [m, o] = [player.matrix, player.pos];
      for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
          if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
            return true;
          }
        }
      }
      return false;
    }

    function arenaSweep() {
      let rowCount = 1;
      outer: for (let y = arena.length - 1; y >= 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
          if (arena[y][x] === 0) continue outer;
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        player.score += rowCount * 20;
        rowCount *= 2;
        const newLevel = Math.floor(player.score / 100) + 1;
        player.level = newLevel;
        setScore(player.score);
        setLevel(newLevel);
        dropInterval = Math.max(150, 800 - (newLevel * 50));
      }
    }

    function playerDrop() {
      player.pos.y++;
      if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
      }
      dropCounter = 0;
    }

    function playerMove(dir) {
      player.pos.x += dir;
      if (collide(arena, player)) player.pos.x -= dir;
    }

    function rotate(matrix) {
      for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
          [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
      }
      matrix.forEach(row => row.reverse());
    }

    function playerRotate() {
      const pos = player.pos.x;
      let offset = 1;
      rotate(player.matrix);
      while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
          rotate(player.matrix);
          player.pos.x = pos;
          return;
        }
      }
    }

    function playerReset() {
      const pieces = 'ILJOTSZ';
      player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
      player.pos.y = 0;
      player.pos.x = ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
      
      if (collide(arena, player)) {
        setGameOver(true);
        cancelAnimationFrame(requestId);
      }
    }

    function update(time = 0) {
      // ESCUDO DE PRIMER FRAME
      if (lastTime === 0) {
        lastTime = time;
        requestId = requestAnimationFrame(update);
        return;
      }

      const deltaTime = time - lastTime;
      lastTime = time;
      dropCounter += deltaTime;

      if (dropCounter > dropInterval) {
        playerDrop();
      }

      draw();
      requestId = requestAnimationFrame(update);
    }

    const handleKeydown = (e) => {
      // Prevenir scroll con flechas
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft') playerMove(-1);
      if (e.key === 'ArrowRight') playerMove(1);
      if (e.key === 'ArrowDown') playerDrop();
      if (e.key === 'ArrowUp') playerRotate();
    };

    document.addEventListener('keydown', handleKeydown);
    playerReset();
    update();

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      cancelAnimationFrame(requestId);
    };
  }, []);

  return (
    <div className="tetris-layout">
      <header className="game-header-tetris">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <h1 className="text-xl font-black text-slate-800">Arquitectura Mental</h1>
        </div>
        <div className="flex gap-3">
          <div className="stat-card">
            <Trophy size={16} className="text-yellow-500" /> 
            <span>{score}</span>
          </div>
          <div className="stat-card">
            <Layers size={16} className="text-blue-500" /> 
            <span>Nvl {level}</span>
          </div>
        </div>
      </header>

      <main className="game-container-tetris">
        <div className="canvas-wrapper">
          <canvas ref={canvasRef} width="240" height="400" className="tetris-canvas" />
          
          {gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-modal">
                <h2 className="text-2xl font-black text-slate-800">¡FIN DEL JUEGO!</h2>
                <p className="text-slate-500 mt-2">Lograste {score} puntos</p>
                <button onClick={() => onBack()} className="restart-game-btn">
                  Volver al Menú
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="controls-hint">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Controles</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="control-item"><ArrowLeftIcon size={16} /> <span>Mover</span></div>
            <div className="control-item"><RotateCw size={16} /> <span>Girar</span></div>
            <div className="control-item"><ArrowDown size={16} /> <span>Bajar</span></div>
          </div>
        </aside>
      </main>
    </div>
  );
}