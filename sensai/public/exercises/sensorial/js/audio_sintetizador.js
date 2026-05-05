/**
 * Audio Sintetizador para Módulo de Regulación Sensorial
 * Utiliza Web Audio API para generar sonidos sintéticos sin archivos externos
 */

class AudioSintetizador {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.init();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.3; // Volumen general
            this.masterGain.connect(this.audioContext.destination);
            
            // Reanudar contexto si está suspendido (política de autoplay)
            if (this.audioContext.state === 'suspended') {
                document.addEventListener('click', () => {
                    this.audioContext.resume();
                }, { once: true });
            }
        } catch (error) {
            console.error('Error al inicializar AudioContext:', error);
        }
    }

    /**
     * Genera un sonido "Burbuja Orgánica" con Modulación FM rápida
     * @param {number} frequency - Frecuencia base (100-300Hz)
     * @param {number} duration - Duración en milisegundos (default: 200ms)
     * @param {number} volume - Volumen bajo (0-1, default: 0.2)
     */
    playBubble(frequency = 200, duration = 200, volume = 0.2) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const carrier = this.audioContext.createOscillator(); // Oscilador portador
        const modulator = this.audioContext.createOscillator(); // Oscilador modulador
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        const modulatorGain = this.audioContext.createGain();

        // Configurar oscilador portador (tono principal)
        carrier.type = 'sine';
        carrier.frequency.setValueAtTime(frequency, now);
        
        // Configurar modulador para Modulación FM rápida
        modulator.type = 'sine';
        const modulatorFreq = frequency * 8; // Frecuencia de modulación alta
        modulator.frequency.setValueAtTime(modulatorFreq, now);
        
        // Ganancia del modulador para índice de modulación
        const modulationIndex = frequency * 0.3; // Índice de modulación para efecto "bloooop"
        modulatorGain.gain.setValueAtTime(modulationIndex, now);
        
        // Conectar modulación FM: modulador → ganancia → frecuencia del portador
        modulator.connect(modulatorGain);
        modulatorGain.connect(carrier.frequency);
        
        // Filtro paso bajo para eliminar brillo metálico
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(frequency * 1.5, now); // Frecuencia de corte baja
        filter.Q.setValueAtTime(0.7, now); // Q bajo para suavidad
        
        // Envelope con attack breve pero suave
        const attackTime = 0.02; // Attack de 20ms (breve pero suave)
        const decayTime = duration / 1000 - attackTime;
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + attackTime); // Attack suave
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000); // Decay natural

        // Conectar nodos: portador → filtro → ganancia → master
        carrier.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        // Reproducir ambos osciladores
        carrier.start(now);
        modulator.start(now);
        carrier.stop(now + duration / 1000);
        modulator.stop(now + duration / 1000);
    }

    /**
     * Genera un sonido "pop" agudo para burbujas
     * @param {number} frequency - Frecuencia del pop (default: 800Hz)
     * @param {number} duration - Duración en milisegundos (default: 50ms)
     * @param {number} volume - Volumen (0-1, default: 0.5)
     */
    playPop(frequency = 800, duration = 50, volume = 0.5) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // Configurar oscilador
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, now);
        
        // Envelope del sonido pop
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.001); // Ataque rápido
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000); // Decay

        // Conectar nodos
        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        // Reproducir
        osc.start(now);
        osc.stop(now + duration / 1000);
    }

    /**
     * Genera un sonido "hum" grave para relajación
     * @param {number} frequency - Frecuencia base (default: 110Hz)
     * @param {number} duration - Duración en segundos (default: 2s)
     * @param {number} volume - Volumen (0-1, default: 0.3)
     */
    playHum(frequency = 110, duration = 2, volume = 0.3) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();

        // Oscilador principal
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, now);

        // LFO para vibración sutil
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.5, now);
        lfoGain.gain.setValueAtTime(2, now);

        // Conectar LFO
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        // Envelope suave
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.1); // Fade in suave
        gainNode.gain.linearRampToValueAtTime(volume, now + duration - 0.1); // Sustain
        gainNode.gain.linearRampToValueAtTime(0, now + duration); // Fade out

        // Conectar nodos
        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        // Reproducir
        osc.start(now);
        lfo.start(now);
        osc.stop(now + duration);
        lfo.stop(now + duration);
    }

    /**
     * Genera un sonido de campana cristalina
     * @param {number} frequency - Frecuencia fundamental (default: 1200Hz)
     * @param {number} volume - Volumen (0-1, default: 0.4)
     */
    playBell(frequency = 1200, volume = 0.4) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        
        // Múltiples osciladores para timbre de campana
        const frequencies = [frequency, frequency * 2.1, frequency * 2.7, frequency * 3.5];
        const volumes = [volume, volume * 0.3, volume * 0.2, volume * 0.1];

        frequencies.forEach((freq, index) => {
            const osc = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            osc.type = index === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            // Envelope diferente para cada parcial
            const attack = 0.001;
            const decay = 0.3 + (index * 0.1);
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(volumes[index], now + attack);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + decay);

            osc.connect(gainNode);
            gainNode.connect(this.masterGain);

            osc.start(now);
            osc.stop(now + decay);
        });
    }

    /**
     * Genera un sonido de ola/oceano
     * @param {number} duration - Duración en segundos (default: 5s)
     * @param {number} volume - Volumen (0-1, default: 0.2)
     */
    playWave(duration = 5, volume = 0.2) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        
        // Ruido rosa para simular ola
        const bufferSize = 4096;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        // Generar ruido filtrado
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * Math.exp(-i / bufferSize * 10);
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Filtro paso bajo para simular sonido de ola
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.linearRampToValueAtTime(800, now + duration / 2);
        filter.frequency.linearRampToValueAtTime(300, now + duration);

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.5);
        gainNode.gain.linearRampToValueAtTime(volume, now + duration - 0.5);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + duration);
    }

    /**
     * Genera un sonido de respiración
     * @param {number} duration - Duración en segundos (default: 4s)
     * @param {number} volume - Volumen (0-1, default: 0.15)
     */
    playBreath(duration = 4, volume = 0.15) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        
        // Ruido blanco filtrado para simular respiración
        const bufferSize = 2048;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.1;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Filtros para simular sonido de respiración
        const filter1 = this.audioContext.createBiquadFilter();
        filter1.type = 'lowpass';
        filter1.frequency.setValueAtTime(200, now);

        const filter2 = this.audioContext.createBiquadFilter();
        filter2.type = 'highpass';
        filter2.frequency.setValueAtTime(50, now);

        const gainNode = this.audioContext.createGain();
        
        // Envelope de respiración (inhalación-exhalación)
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + duration * 0.4); // Inhalación
        gainNode.gain.linearRampToValueAtTime(volume * 0.8, now + duration * 0.5); // Pico
        gainNode.gain.linearRampToValueAtTime(volume, now + duration * 0.6); // Comienzo exhalación
        gainNode.gain.linearRampToValueAtTime(0, now + duration); // Fin exhalación

        noise.connect(filter1);
        filter1.connect(filter2);
        filter2.connect(gainNode);
        gainNode.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + duration);
    }

    /**
     * Genera un sonido de goteo de agua
     * @param {number} volume - Volumen (0-1, default: 0.3)
     */
    playDrip(volume = 0.3) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        
        // Oscilador de alta frecuencia con envelope rápido
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1000, now);

        // Envelope muy rápido para simular goteo
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.001);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    /**
     * Ajusta el volumen maestro
     * @param {number} volume - Volumen (0-1)
     */
    setMasterVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }

    /**
     * Detiene todos los sonidos inmediatamente
     */
    stopAll() {
        if (this.audioContext) {
            this.masterGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);
        }
    }

    /**
     * Genera sonido de fricción para arena
     * @param {number} duration - Duración en segundos (default: 0.5s)
     * @param {number} volume - Volumen (0-1, default: 0.2)
     */
    playSandFriction(duration = 0.5, volume = 0.2) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        
        // Ruido blanco filtrado para simular fricción
        const bufferSize = 1024;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.3;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Filtro paso banda para simular arena
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.Q.setValueAtTime(2, now);

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(volume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + duration);
    }

    /**
     * Genera sonido de brocha/pintura
     * @param {number} duration - Duración en segundos (default: 0.3s)
     * @param {number} volume - Volumen (0-1, default: 0.15)
     */
    playBrush(duration = 0.3, volume = 0.15) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        
        // Ruido suave para simular brocha
        const bufferSize = 512;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.2;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Filtros para simular pintura
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(volume * 0.5, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.05);
        gainNode.gain.linearRampToValueAtTime(volume * 0.8, now + duration - 0.05);
        gainNode.gain.linearRampToValueAtTime(0.01, now + duration);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + duration);
    }

    /**
     * Genera sonido de aire/hojas naturales para pétalos (click normal)
     * @param {number} duration - Duración en milisegundos (default: 300)
     * @param {number} volume - Volumen (0-1, default: 0.2)
     */
    playPetal(duration = 300, volume = 0.2, game = null) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const durationInSeconds = duration / 1000;
        
        // Crear ruido blanco para simular aire/hojas
        const bufferSize = 8192;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        // Generar ruido blanco suave
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() - 0.5) * 0.3;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Filtros para crear sonido de aire/hojas
        const filter1 = this.audioContext.createBiquadFilter();
        filter1.type = 'lowpass';
        filter1.frequency.setValueAtTime(1200, now);
        filter1.Q.setValueAtTime(0.7, now);

        const filter2 = this.audioContext.createBiquadFilter();
        filter2.type = 'highpass';
        filter2.frequency.setValueAtTime(200, now);

        const filter3 = this.audioContext.createBiquadFilter();
        filter3.type = 'lowpass';
        filter3.frequency.setValueAtTime(800, now);
        filter3.Q.setValueAtTime(1.5, now);

        // Envelope natural de viento
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume * 0.3, now + 0.1);
        gainNode.gain.linearRampToValueAtTime(volume * 0.4, now + 0.3);
        gainNode.gain.linearRampToValueAtTime(volume * 0.35, now + durationInSeconds - 1);
        gainNode.gain.exponentialRampToValueAtTime(volume * 0.1, now + durationInSeconds - 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + durationInSeconds);
        
        noise.connect(filter1);
        filter1.connect(filter2);
        filter2.connect(filter3);
        filter3.connect(gainNode);
        gainNode.connect(this.masterGain);

        // Guardar referencias para poder detener
        if (game && game.activeAudioNodes) {
            game.activeAudioNodes.push(noise, filter1, filter2, filter3, gainNode);
        }

        noise.start(now);
        noise.stop(now + durationInSeconds);
    }

    /**
     * Genera sonido de torbellino/ciclón para pétalos
     * @param {number} duration - Duración en milisegundos (default: 300)
     * @param {number} volume - Volumen (0-1, default: 0.25)
     */
    playTornado(duration = 300, volume = 0.25, game = null) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const durationInSeconds = duration / 1000;
        
        // Crear ruido con más intensidad para torbellino
        const bufferSize = 8192;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() - 0.5) * 0.5; // Más amplitud para torbellino
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Filtros para sonido de torbellino (más agudo e intenso)
        const filter1 = this.audioContext.createBiquadFilter();
        filter1.type = 'lowpass';
        filter1.frequency.setValueAtTime(2000, now); // Más alto para torbellino
        filter1.Q.setValueAtTime(2, now); // Más resonancia

        const filter2 = this.audioContext.createBiquadFilter();
        filter2.type = 'highpass';
        filter2.frequency.setValueAtTime(300, now);

        // Modulación de frecuencia para efecto giratorio
        const oscMod = this.audioContext.createOscillator();
        oscMod.type = 'sine';
        oscMod.frequency.setValueAtTime(8, now); // Modulación lenta
        
        const gainMod = this.audioContext.createGain();
        gainMod.gain.setValueAtTime(300, now); // Modulación de frecuencia
        
        oscMod.connect(gainMod);
        gainMod.connect(filter1.frequency);

        // Envelope más intenso
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume * 0.5, now + 0.05); // Attack más rápido
        gainNode.gain.linearRampToValueAtTime(volume * 0.6, now + 0.2);
        gainNode.gain.linearRampToValueAtTime(volume * 0.5, now + durationInSeconds - 1);
        gainNode.gain.exponentialRampToValueAtTime(volume * 0.2, now + durationInSeconds - 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + durationInSeconds);
        
        noise.connect(filter1);
        filter1.connect(filter2);
        filter2.connect(gainNode);
        gainNode.connect(this.masterGain);

        // Guardar referencias para poder detener
        if (game && game.activeAudioNodes) {
            game.activeAudioNodes.push(noise, filter1, filter2, gainNode, oscMod, gainMod);
        }

        oscMod.start(now);
        oscMod.stop(now + durationInSeconds);
        
        noise.start(now);
        noise.stop(now + durationInSeconds);
    }

    /**
     * Genera sonido de camino/línea de pétalos arrastrados
     * @param {number} duration - Duración en milisegundos (default: 300)
     * @param {number} volume - Volumen (0-1, default: 0.18)
     */
    playTrail(duration = 300, volume = 0.18, game = null) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const durationInSeconds = duration / 1000;
        
        // Crear ruido más suave para camino
        const bufferSize = 4096;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() - 0.5) * 0.2; // Más suave para camino
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Filtros para sonido de arrastre (más grave y suave)
        const filter1 = this.audioContext.createBiquadFilter();
        filter1.type = 'lowpass';
        filter1.frequency.setValueAtTime(600, now); // Más bajo para arrastre
        filter1.Q.setValueAtTime(0.5, now);

        const filter2 = this.audioContext.createBiquadFilter();
        filter2.type = 'highpass';
        filter2.frequency.setValueAtTime(100, now);

        // Envelope suave y continuo
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume * 0.2, now + 0.15);
        gainNode.gain.linearRampToValueAtTime(volume * 0.25, now + 0.3);
        gainNode.gain.linearRampToValueAtTime(volume * 0.22, now + durationInSeconds - 0.8);
        gainNode.gain.exponentialRampToValueAtTime(volume * 0.05, now + durationInSeconds - 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + durationInSeconds);
        
        noise.connect(filter1);
        filter1.connect(filter2);
        filter2.connect(gainNode);
        gainNode.connect(this.masterGain);

        // Guardar referencias para poder detener
        if (game && game.activeAudioNodes) {
            game.activeAudioNodes.push(noise, filter1, filter2, gainNode);
        }

        noise.start(now);
        noise.stop(now + durationInSeconds);
    }

    /**
     * Genera sonido de explosión de flores
     * @param {number} duration - Duración en milisegundos (default: 300)
     * @param {number} volume - Volumen (0-1, default: 0.3)
     */
    playExplosion(duration = 300, volume = 0.3, game = null) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const durationInSeconds = duration / 1000;
        
        // Crear ruido explosivo
        const bufferSize = 8192;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() - 0.5) * 0.6; // Máxima amplitud para explosión
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Filtros para sonido de explosión (más brillante)
        const filter1 = this.audioContext.createBiquadFilter();
        filter1.type = 'lowpass';
        filter1.frequency.setValueAtTime(3000, now); // Más alto para explosión
        filter1.Q.setValueAtTime(3, now); // Máxima resonancia

        const filter2 = this.audioContext.createBiquadFilter();
        filter2.type = 'highpass';
        filter2.frequency.setValueAtTime(400, now);

        // Envelope explosivo: ataque rápido, sustain corto, decay
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume * 0.8, now + 0.02); // Attack muy rápido
        gainNode.gain.linearRampToValueAtTime(volume * 0.6, now + 0.1); // Sustain corto
        gainNode.gain.linearRampToValueAtTime(volume * 0.4, now + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(volume * 0.1, now + durationInSeconds - 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + durationInSeconds);
        
        noise.connect(filter1);
        filter1.connect(filter2);
        filter2.connect(gainNode);
        gainNode.connect(this.masterGain);

        // Guardar referencias para poder detener
        if (game && game.activeAudioNodes) {
            game.activeAudioNodes.push(noise, filter1, filter2, gainNode);
        }

        noise.start(now);
        noise.stop(now + durationInSeconds);
    }

    /**
     * Genera tono simple genérico (método legacy)
     * @param {number} frequency - Frecuencia en Hz
     * @param {number} duration - Duración en milisegundos
     * @param {number} volume - Volumen (0-1, default: 0.3)
     */
    playTone(frequency, duration, volume = 0.3) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, now);
        
        // Envelope simple
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.001);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);

        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + duration / 1000);
    }

    /**
     * Verifica si el audio está disponible
     * @returns {boolean}
     */
    isAvailable() {
        return this.audioContext && this.audioContext.state !== 'closed';
    }
}

// Instancia global del sintetizador
let audioSintetizador = null;

// Función de inicialización segura
function initAudio() {
    if (!audioSintetizador) {
        audioSintetizador = new AudioSintetizador();
    }
    return audioSintetizador;
}

// API global// Sistema global de audio
window.playSound = function(type, params = {}) {
    console.log('🎵 playSound llamado con type:', type, 'params:', params);
    const audio = initAudio();
    if (!audio || !audio.audioContext) {
        console.error('❌ Audio context no disponible');
        return;
    }
    
    const frequency = params.frequency || 440;
    const duration = params.duration || 200;
    const volume = params.volume || 0.3;
    
    // Obtener referencia al juego para guardar nodos
    const game = window.petalosGame;
    console.log('🎵 Referencia al juego:', game ? 'disponible' : 'no disponible');
    
    switch(type.toLowerCase()) {
        case 'bubble':
            audio.playBubble(params.frequency, params.duration, params.volume);
            break;
        case 'pop':
            audio.playPop(frequency, volume);
            break;
        case 'hum':
            audio.playHum(params.frequency, params.duration, params.volume);
            break;
        case 'bell':
            audio.playBell(params.frequency, params.volume);
            break;
        case 'wave':
        case 'ocean':
            audio.playWave(params.duration, params.volume);
            break;
        case 'breath':
            audio.playBreath(params.duration, params.volume);
            break;
        case 'drip':
            audio.playDrip(params.volume);
            break;
        case 'sand':
        case 'friction':
            audio.playSandFriction(params.duration, params.volume);
            break;
        case 'brush':
        case 'paint':
            audio.playBrush(params.duration, params.volume);
            break;
        case 'petal':
            console.log('🎵 Ejecutando playPetal con duration:', duration, 'volume:', volume);
            audio.playPetal(duration, volume, game);
            break;
        case 'tornado':
            console.log('🎵 Ejecutando playTornado con duration:', duration, 'volume:', volume);
            audio.playTornado(duration, volume, game);
            break;
        case 'trail':
            console.log('🎵 Ejecutando playTrail con duration:', duration, 'volume:', volume);
            audio.playTrail(duration, volume, game);
            break;
        case 'explosion':
            console.log('🎵 Ejecutando playExplosion con duration:', duration, 'volume:', volume);
            audio.playExplosion(duration, volume, game);
            break;
        default:
            console.warn(`Tipo de sonido no reconocido: ${type}`);
    }
};

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioSintetizador, initAudio };
}
