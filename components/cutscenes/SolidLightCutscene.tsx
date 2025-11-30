import React, { useMemo, useEffect } from 'react';

interface Props {
    onComplete: () => void;
}

export const SolidLightCutscene: React.FC<Props> = ({ onComplete }) => {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data === 'SOLID_LIGHT_CUTSCENE_COMPLETE') {
                onComplete();
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [onComplete]);

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solid Light Cutscene</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Rajdhani:wght@700&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Orbitron', sans-serif; }
        
        #cutscene-layer {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: #050505;
            z-index: 100;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
        }

        /* --- TEXT STYLES --- */
        #phrase-container {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
            z-index: 10;
        }

        .cinema-phrase {
            font-size: 3rem;
            font-weight: 900;
            color: #fff;
            text-align: center;
            opacity: 0;
            letter-spacing: 0.5rem;
            text-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
            transform: scale(0.9);
            transition: all 0.2s cubic-bezier(0.1, 0.7, 1.0, 0.1);
        }

        .cinema-phrase.visible {
            opacity: 1;
            transform: scale(1);
            letter-spacing: 1rem;
        }

        .cinema-phrase.flash-out {
            animation: flash-out 0.3s forwards ease-in;
        }

        @keyframes flash-out {
            0% { opacity: 1; transform: scale(1); filter: brightness(1); }
            100% { opacity: 0; transform: scale(2); filter: brightness(10); }
        }

        /* --- VISUAL ELEMENTS --- */
        #light-beam {
            position: absolute;
            top: 50%; left: 50%;
            width: 2px; height: 0%;
            background: #fff;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 50px 20px rgba(0, 255, 255, 0.5);
            transition: height 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
            z-index: 1;
        }

        #solid-core {
            position: absolute;
            top: 50%; left: 50%;
            width: 0px; height: 0px;
            background: #fff;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 100px 50px rgba(255, 255, 255, 0.8);
            z-index: 5;
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .particle {
            position: absolute;
            top: 50%; left: 50%;
            width: 4px; height: 4px;
            background: #00ffff;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
        }

        #flash-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: #fff;
            z-index: 200;
            opacity: 0;
            pointer-events: none;
            transition: opacity 1.5s ease-out;
        }

        /* Prism Effect */
        .prism-ring {
            position: absolute;
            top: 50%; left: 50%;
            width: 100px; height: 100px;
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
            z-index: 2;
        }

        @keyframes expand-ring {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; border-width: 5px; }
            100% { transform: translate(-50%, -50%) scale(5); opacity: 0; border-width: 0px; }
        }

    </style>
</head>
<body>
    <div id="cutscene-layer">
        <div id="light-beam"></div>
        <div id="solid-core"></div>
        <div id="phrase-container"></div>
    </div>
    <div id="flash-overlay"></div>

    <script>
        // --- AUDIO ENGINE ---
        class SolidLightAudio {
            constructor() {
                this.ctx = null;
                this.masterGain = null;
                this.initialized = false;
            }

            init() {
                if(this.initialized) return;
                try {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    this.ctx = new AudioContext();
                    this.masterGain = this.ctx.createGain();
                    this.masterGain.gain.value = 0.3;
                    this.masterGain.connect(this.ctx.destination);
                    this.initialized = true;
                } catch(e) { console.warn("Audio init failed", e); }
            }

            playCharge() {
                if(!this.initialized) return;
                const t = this.ctx.currentTime;
                // High pitch charge up
                const osc = this.ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(200, t);
                osc.frequency.exponentialRampToValueAtTime(2000, t + 2.0);
                
                const g = this.ctx.createGain();
                g.gain.setValueAtTime(0, t);
                g.gain.linearRampToValueAtTime(0.2, t + 1.8);
                g.gain.linearRampToValueAtTime(0, t + 2.0);

                osc.connect(g); g.connect(this.masterGain);
                osc.start(t); osc.stop(t + 2.0);
            }

            playBeam() {
                if(!this.initialized) return;
                const t = this.ctx.currentTime;
                // Laser beam sound
                const osc = this.ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(800, t);
                osc.frequency.exponentialRampToValueAtTime(100, t + 0.5);
                
                const g = this.ctx.createGain();
                g.gain.setValueAtTime(0.2, t);
                g.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

                const f = this.ctx.createBiquadFilter();
                f.type = 'lowpass';
                f.frequency.value = 1000;

                osc.connect(f); f.connect(g); g.connect(this.masterGain);
                osc.start(t); osc.stop(t + 0.5);
            }

            playCrystallize() {
                if(!this.initialized) return;
                const t = this.ctx.currentTime;
                // Glassy shatter / Solidify
                for(let i=0; i<5; i++) {
                    const osc = this.ctx.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(2000 + i*500, t);
                    osc.frequency.exponentialRampToValueAtTime(10000, t + 0.1);
                    
                    const g = this.ctx.createGain();
                    g.gain.setValueAtTime(0.05, t);
                    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
                    
                    osc.connect(g); g.connect(this.masterGain);
                    osc.start(t + i*0.05); osc.stop(t + 0.3);
                }
            }

            playBoom() {
                if(!this.initialized) return;
                const t = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(100, t);
                osc.frequency.exponentialRampToValueAtTime(0.01, t + 1.0);
                
                const g = this.ctx.createGain();
                g.gain.setValueAtTime(1.0, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
                
                osc.connect(g); g.connect(this.masterGain);
                osc.start(t); osc.stop(t + 1.0);
            }
        }
        const audio = new SolidLightAudio();

        // --- SEQUENCE ---
        const phrases = [
            "PHOTONS HALTED",
            "MASS ACQUIRED",
            "LIGHT HAS WEIGHT",
            "PARADOX STABILIZED"
        ];

        let step = 0;
        let timer = 0;
        let lastTime = performance.now();

        const phraseContainer = document.getElementById('phrase-container');
        const lightBeam = document.getElementById('light-beam');
        const solidCore = document.getElementById('solid-core');
        const flashOverlay = document.getElementById('flash-overlay');
        const cutsceneLayer = document.getElementById('cutscene-layer');

        function createRing() {
            const ring = document.createElement('div');
            ring.className = 'prism-ring';
            cutsceneLayer.appendChild(ring);
            ring.style.animation = 'expand-ring 1s ease-out forwards';
            setTimeout(() => ring.remove(), 1000);
        }

        function showPhrase(text) {
            phraseContainer.innerHTML = '';
            const el = document.createElement('div');
            el.className = 'cinema-phrase';
            el.innerText = text;
            phraseContainer.appendChild(el);
            
            // Trigger reflow
            void el.offsetWidth;
            
            el.classList.add('visible');
        }

        function hidePhrase() {
            if(phraseContainer.firstChild) {
                phraseContainer.firstChild.classList.remove('visible');
                phraseContainer.firstChild.classList.add('flash-out');
            }
        }

        setTimeout(() => {
            audio.init();
            audio.playCharge();
            requestAnimationFrame(animate);
        }, 500);

        function animate(time) {
            const delta = (time - lastTime) / 1000;
            lastTime = time;
            timer += delta;

            if (step === 0 && timer > 0.5) {
                showPhrase(phrases[0]); // PHOTONS HALTED
                step++;
            }
            else if (step === 1 && timer > 2.0) {
                hidePhrase();
                // Beam appears
                lightBeam.style.height = '100%';
                audio.playBeam();
                createRing();
                setTimeout(() => showPhrase(phrases[1]), 200); // MASS ACQUIRED
                step++;
            }
            else if (step === 2 && timer > 3.5) {
                hidePhrase();
                // Core solidifies
                lightBeam.style.width = '50px'; // Thicken beam
                lightBeam.style.boxShadow = '0 0 100px 50px rgba(255, 255, 255, 0.8)';
                
                setTimeout(() => {
                    lightBeam.style.transition = 'height 0.1s';
                    lightBeam.style.height = '0%'; // Collapse into center
                    solidCore.style.width = '100px';
                    solidCore.style.height = '100px';
                    audio.playCrystallize();
                    createRing();
                    createRing();
                }, 300);

                setTimeout(() => showPhrase(phrases[2]), 500); // LIGHT HAS WEIGHT
                step++;
            }
            else if (step === 3 && timer > 5.5) {
                hidePhrase();
                setTimeout(() => showPhrase(phrases[3]), 200); // PARADOX STABILIZED
                
                // Pulse core
                solidCore.style.transform = 'translate(-50%, -50%) scale(1.5)';
                setTimeout(() => solidCore.style.transform = 'translate(-50%, -50%) scale(1)', 200);
                
                step++;
            }
            else if (step === 4 && timer > 7.0) {
                // BIG FLASH
                flashOverlay.style.opacity = 1;
                audio.playBoom();
                step++;
                
                setTimeout(() => {
                    window.parent.postMessage('SOLID_LIGHT_CUTSCENE_COMPLETE', '*');
                }, 1000);
            }

            if(step < 5) requestAnimationFrame(animate);
        }

    </script>
</body>
</html>`;

    const blobUrl = useMemo(() => {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        return URL.createObjectURL(blob);
    }, []);

    return (
        <iframe
            src={blobUrl}
            style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: 'black',
                borderRadius: '0.75rem'
            }}
            title="Solid Light Cutscene"
        />
    );
};
