import React, { useMemo, useEffect } from 'react';

interface Props {
    onComplete: () => void;
}

export const SingularityCutscene: React.FC<Props> = ({ onComplete }) => {
    // Expose the onComplete callback to the iframe via postMessage or binding?
    // Since we're using a blob URL, we can't easily pass functions.
    // We can use window.parent.postMessage.

    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data === 'SINGULARITY_CUTSCENE_COMPLETE') {
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
    <title>Singularity Cutscene</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Orbitron', sans-serif; }
        
        /* --- CINEMATIC CUTSCENE STYLES --- */
        #cutscene-layer {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: black;
            z-index: 100;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            perspective: 1000px;
        }

        #phrase-container {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
        }
        
        .cinema-phrase {
            font-family: 'Orbitron', sans-serif;
            font-size: 2.5rem;
            font-weight: 900;
            color: #fff;
            text-align: center;
            opacity: 0;
            letter-spacing: 0.5rem;
            text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
            width: 100%;
            transition: all 0.5s cubic-bezier(0.1, 0.7, 1.0, 0.1);
        }

        .cinema-phrase.visible {
            opacity: 1;
            transform: scale(1);
            filter: blur(0px);
        }

        .cinema-phrase.glitch {
            animation: glitch-anim 0.3s infinite;
            color: #ff00ff;
            text-shadow: 2px 2px #00ffff;
        }

        .cinema-phrase.warp-in {
            animation: warp-in 0.8s forwards cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .cinema-phrase.suck-out {
            animation: suck-out 0.6s forwards cubic-bezier(0.7, 0, 0.8, 0.2);
        }

        @keyframes warp-in {
            0% { transform: scale(3) translateZ(500px); opacity: 0; letter-spacing: 2rem; filter: blur(20px); }
            100% { transform: scale(1) translateZ(0); opacity: 1; letter-spacing: 0.5rem; filter: blur(0px); }
        }

        @keyframes suck-out {
            0% { transform: scale(1); opacity: 1; letter-spacing: 0.5rem; }
            100% { transform: scale(0) rotate(90deg); opacity: 0; letter-spacing: -1rem; filter: blur(10px); }
        }

        @keyframes glitch-anim {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }

        #flash-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: white;
            z-index: 101;
            opacity: 0;
            pointer-events: none;
            mix-blend-mode: exclusion;
        }
        
        .singularity-implosion {
            position: absolute;
            top: 50%; left: 50%;
            width: 10px; height: 10px;
            background: black;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 100px 50px rgba(138, 43, 226, 0.8);
            z-index: 102;
            opacity: 0;
        }
    </style>
</head>
<body>
    <div id="cutscene-layer">
        <div id="phrase-container"></div>
        <div id="singularity-dot" class="singularity-implosion"></div>
    </div>
    <div id="flash-overlay"></div>
    
    <script>
        // --- AUDIO ENGINE ---
        class SingularityAudio {
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
                    this.masterGain.gain.value = 0.4;
                    this.masterGain.connect(this.ctx.destination);
                    this.initialized = true;
                } catch(e) { console.warn("Audio init failed", e); }
            }

            playRumble(duration) {
                if(!this.initialized) return;
                const t = this.ctx.currentTime;
                // Deep rumbles
                for(let i=0; i<3; i++) {
                    const osc = this.ctx.createOscillator();
                    osc.type = i===0 ? 'sine' : 'sawtooth';
                    osc.frequency.setValueAtTime(50 + i*20, t);
                    osc.frequency.exponentialRampToValueAtTime(10, t + duration);
                    
                    const g = this.ctx.createGain();
                    g.gain.setValueAtTime(0, t);
                    g.gain.linearRampToValueAtTime(0.1 / (i+1), t + 0.5);
                    g.gain.linearRampToValueAtTime(0, t + duration);
                    
                    const f = this.ctx.createBiquadFilter();
                    f.type = 'lowpass';
                    f.frequency.setValueAtTime(200, t);
                    
                    osc.connect(f); f.connect(g); g.connect(this.masterGain);
                    osc.start(t); osc.stop(t + duration);
                }
            }

            playGlitch() {
                if(!this.initialized) return;
                const t = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                osc.type = 'square';
                osc.frequency.setValueAtTime(Math.random()*1000 + 100, t);
                osc.frequency.exponentialRampToValueAtTime(Math.random()*100 + 50, t + 0.1);
                const g = this.ctx.createGain();
                g.gain.setValueAtTime(0.05, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
                osc.connect(g); g.connect(this.masterGain);
                osc.start(t); osc.stop(t + 0.1);
            }

            playImplosion() {
                if(!this.initialized) return;
                const t = this.ctx.currentTime;
                // Suck sound
                const osc = this.ctx.createOscillator();
                osc.frequency.setValueAtTime(100, t);
                osc.frequency.exponentialRampToValueAtTime(800, t + 1.5);
                const g = this.ctx.createGain();
                g.gain.setValueAtTime(0, t);
                g.gain.linearRampToValueAtTime(0.3, t + 1.4);
                g.gain.setValueAtTime(0, t + 1.5);
                osc.connect(g); g.connect(this.masterGain);
                osc.start(t); osc.stop(t + 1.5);

                // Boom
                setTimeout(() => {
                    const osc2 = this.ctx.createOscillator();
                    osc2.type = 'triangle';
                    osc2.frequency.setValueAtTime(50, this.ctx.currentTime);
                    osc2.frequency.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2.0);
                    const g2 = this.ctx.createGain();
                    g2.gain.setValueAtTime(1.0, this.ctx.currentTime);
                    g2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.0);
                    osc2.connect(g2); g2.connect(this.masterGain);
                    osc2.start(this.ctx.currentTime); osc2.stop(this.ctx.currentTime + 2.0);
                }, 1500);
            }
        }
        const audio = new SingularityAudio();

        // --- CUTSCENE SEQUENCER ---
        const phrases = [
            "DENSITY CRITICAL",
            "REALITY FRACTURING",
            "LIGHT CANNOT ESCAPE",
            "EVENT HORIZON BREACHED"
        ];
        
        let cutsceneStep = 0;
        let cutsceneTimer = 0;
        
        const phraseContainer = document.getElementById('phrase-container');
        const cutsceneLayer = document.getElementById('cutscene-layer');
        const flashOverlay = document.getElementById('flash-overlay');
        const singularityDot = document.getElementById('singularity-dot');
        
        let lastTime = performance.now();

        function showPhrase(text, type='warp-in') {
            phraseContainer.innerHTML = '';
            const el = document.createElement('div');
            el.className = \`cinema-phrase \${type}\`;
            el.innerText = text;
            
            if(Math.random() > 0.7) el.classList.add('glitch');
            
            phraseContainer.appendChild(el);
            setTimeout(() => el.classList.add('visible'), 50);
            
            audio.playGlitch();
        }

        setTimeout(() => {
            audio.init();
            audio.playRumble(5.0);
            requestAnimationFrame(animate);
        }, 500);

        function animate(time) {
            const delta = (time - lastTime) / 1000;
            lastTime = time;
            
            cutsceneTimer += delta;
                
            // Sequencer
            if (cutsceneStep === 0 && cutsceneTimer > 0.5) {
                showPhrase(phrases[0]);
                cutsceneStep++;
            }
            else if (cutsceneStep === 1 && cutsceneTimer > 2.0) {
                const old = phraseContainer.firstChild;
                if(old) {
                    old.classList.remove('warp-in');
                    old.classList.add('suck-out');
                }
                setTimeout(() => showPhrase(phrases[1]), 200);
                cutsceneStep++;
            }
            else if (cutsceneStep === 2 && cutsceneTimer > 3.5) {
                const old = phraseContainer.firstChild;
                if(old) {
                    old.classList.remove('warp-in');
                    old.classList.add('suck-out');
                }
                setTimeout(() => showPhrase(phrases[2]), 200);
                cutsceneStep++;
            }
            else if (cutsceneStep === 3 && cutsceneTimer > 5.0) {
                const old = phraseContainer.firstChild;
                if(old) {
                    old.classList.remove('warp-in');
                    old.classList.add('suck-out');
                }
                setTimeout(() => showPhrase(phrases[3], 'warp-in'), 200);
                
                // Singularity appears
                singularityDot.style.opacity = 1;
                singularityDot.style.transition = 'transform 1.5s cubic-bezier(0.8, 0, 0.2, 1)';
                setTimeout(() => {
                    singularityDot.style.transform = 'translate(-50%, -50%) scale(500)'; // IMPLOSION
                }, 100);
                
                audio.playImplosion();
                cutsceneStep++;
            }
            else if (cutsceneStep === 4 && cutsceneTimer > 6.5) {
                // FLASH
                flashOverlay.style.opacity = 1;
                cutsceneLayer.style.display = 'none';
                cutsceneStep++;
                
                // Signal Completion
                window.parent.postMessage('SINGULARITY_CUTSCENE_COMPLETE', '*');
            }
            
            if(cutsceneStep < 5) {
                requestAnimationFrame(animate);
            }
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
            title="Singularity Cutscene"
        />
    );
};
