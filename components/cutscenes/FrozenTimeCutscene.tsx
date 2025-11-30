import React, { useMemo, useEffect } from 'react';

interface Props {
    onComplete: () => void;
}

export const FrozenTimeCutscene: React.FC<Props> = ({ onComplete }) => {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data === 'FROZEN_TIME_CUTSCENE_COMPLETE') {
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
    <title>Frozen Time Cutscene</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #020005;
            overflow: hidden;
            font-family: 'Cinzel', serif;
        }
        
        /* --- CUTSCENE UI --- */
        #intro-screen {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at center, #0a0a2a 0%, #000000 100%);
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }

        #intro-text-container {
            position: relative;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .intro-word {
            font-size: 3rem;
            color: #fff;
            letter-spacing: 8px;
            opacity: 0;
            transform: scale(2);
            filter: blur(10px);
            transition: all 0.5s cubic-bezier(0.1, 0.8, 0.2, 1);
            text-shadow: 0 0 20px rgba(0, 200, 255, 0.5);
        }

        .intro-word.visible {
            opacity: 1;
            transform: scale(1);
            filter: blur(0px);
        }
        
        .intro-word.frozen {
            color: #aaddff;
            text-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
            letter-spacing: 12px;
        }

        #flash-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: #aaddff;
            z-index: 101;
            opacity: 0;
            pointer-events: none;
            display: none;
        }
    </style>
</head>
<body>
    <div id="intro-screen">
        <div id="intro-text-container"></div>
    </div>
    <div id="flash-overlay"></div>

    <script>
        // --- AUDIO ENGINE ---
        class FrozenTimeAudio {
            constructor() {
                this.ctx = null;
                this.masterGain = null;
            }
            
            init() {
                if(this.ctx) return;
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioContext();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.value = 0.4;
                this.masterGain.connect(this.ctx.destination);
            }
            
            playTick(speed = 1.0) {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                // Mechanical Tick
                const osc = this.ctx.createOscillator();
                osc.type = 'square';
                osc.frequency.setValueAtTime(1000 * speed, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
                
                const g = this.ctx.createGain();
                g.gain.setValueAtTime(0.1, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                
                osc.connect(g); g.connect(this.masterGain);
                osc.start(); osc.stop(now + 0.1);
                
                // Add Echo
                const delayOsc = this.ctx.createOscillator();
                delayOsc.type = 'sine';
                delayOsc.frequency.value = 2000;
                const dGain = this.ctx.createGain();
                dGain.gain.setValueAtTime(0.02, now + 0.2);
                dGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                delayOsc.connect(dGain); dGain.connect(this.masterGain);
                delayOsc.start(now + 0.2); delayOsc.stop(now + 0.4);
            }
            
            playDeepDrone() {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(40, now);
                const g = this.ctx.createGain();
                g.gain.value = 0.05;
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(100, now);
                filter.frequency.linearRampToValueAtTime(50, now + 10);
                
                osc.connect(filter); filter.connect(g); g.connect(this.masterGain);
                osc.start();
            }
            
            playFreezeImpact() {
                 if(!this.ctx) return;
                 const now = this.ctx.currentTime;
                 // Big impact
                 const osc = this.ctx.createOscillator();
                 osc.frequency.setValueAtTime(100, now);
                 osc.frequency.exponentialRampToValueAtTime(0.01, now + 2.0);
                 
                 const g = this.ctx.createGain();
                 g.gain.setValueAtTime(0.8, now);
                 g.gain.exponentialRampToValueAtTime(0.001, now + 3.0);
                 
                 osc.connect(g); g.connect(this.masterGain);
                 osc.start(); osc.stop(now + 3.0);
                 
                 // High pitch freeze
                 const hOsc = this.ctx.createOscillator();
                 hOsc.type = 'sine';
                 hOsc.frequency.setValueAtTime(2000, now);
                 hOsc.frequency.linearRampToValueAtTime(8000, now + 1.0);
                 const hGain = this.ctx.createGain();
                 hGain.gain.setValueAtTime(0.1, now);
                 hGain.gain.linearRampToValueAtTime(0, now + 1.0);
                 hOsc.connect(hGain); hGain.connect(this.masterGain);
                 hOsc.start(); hOsc.stop(now + 1.5);
            }
        }
        
        const audio = new FrozenTimeAudio();

        // --- CUTSCENE LOGIC ---
        const phrases = [
            "THE FLOW OF ETERNITY...",
            "RUSHING FORWARD...",
            "UNSTOPPABLE...",
            "UNTIL NOW.",
            "ABSOLUTE ZERO.",
            "FROZEN TIME."
        ];
        
        const introContainer = document.getElementById('intro-text-container');
        const flashOverlay = document.getElementById('flash-overlay');

        setTimeout(() => {
            try { audio.init(); } catch(e){}
            playCutscene();
        }, 100);

        async function playCutscene() {
            audio.playDeepDrone();
            
            let tickDelay = 500;
            const tickLoop = () => {
                // Check if cutscene is still running by checking overlay display
                // This is a bit hacky but works if iframe reloads or switches
                if(document.body) {
                     audio.playTick();
                     tickDelay += 100;
                     setTimeout(tickLoop, tickDelay);
                }
            };
            // We'll clear this via just ending the component flow
            
            // Start ticks
            setTimeout(tickLoop, 0);

            for(let i=0; i<phrases.length; i++) {
                introContainer.innerHTML = '';
                const word = document.createElement('div');
                word.className = 'intro-word';
                word.innerText = phrases[i];
                introContainer.appendChild(word);
                
                requestAnimationFrame(() => word.classList.add('visible'));
                
                if (i === phrases.length - 1) {
                    word.classList.add('frozen');
                    await new Promise(r => setTimeout(r, 2000));
                } else {
                    await new Promise(r => setTimeout(r, 2000));
                }
                
                word.style.opacity = 0;
                word.style.transform = 'scale(0.8)';
                await new Promise(r => setTimeout(r, 500));
            }
            
            audio.playFreezeImpact();
            flashOverlay.style.display = 'block';
            
            requestAnimationFrame(() => {
                flashOverlay.style.opacity = 1;
                setTimeout(() => {
                    window.parent.postMessage('FROZEN_TIME_CUTSCENE_COMPLETE', '*');
                }, 100);
            });
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
            title="Frozen Time Cutscene"
        />
    );
};
