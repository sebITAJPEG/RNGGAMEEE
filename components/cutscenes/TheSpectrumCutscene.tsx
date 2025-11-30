import React, { useMemo, useEffect } from 'react';

interface Props {
    onComplete: () => void;
}

export const TheSpectrumCutscene: React.FC<Props> = ({ onComplete }) => {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data === 'THE_SPECTRUM_CUTSCENE_COMPLETE') {
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
    <title>The Spectrum Cutscene</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            overflow: hidden;
            background-color: #000000;
            font-family: 'Orbitron', sans-serif;
        }

        /* --- CUTSCENE & UI STYLES --- */
        #intro-screen {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: #000000;
            z-index: 100;
            display: flex; 
            align-items: center;
            justify-content: center;
            padding: 40px;
            box-sizing: border-box;
        }

        #intro-text {
            font-family: 'Cinzel', serif;
            font-size: 48px;
            line-height: 1.2;
            text-align: center;
            max-width: 90%;
            text-transform: uppercase;
            letter-spacing: 8px;
            font-weight: 700;
            opacity: 0;
            transform: scale(1.2);
            filter: blur(10px);
            transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
            color: #ffffff;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }

        #intro-text.visible {
            opacity: 1;
            transform: scale(1);
            filter: blur(0px);
        }

        .shake-screen {
            animation: screenShake 0.1s infinite;
        }

        @keyframes screenShake {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(-2px, 2px) rotate(-0.5deg); }
            50% { transform: translate(2px, -2px) rotate(0.5deg); }
            75% { transform: translate(-2px, -2px) rotate(0deg); }
            100% { transform: translate(2px, 2px) rotate(0deg); }
        }

        /* Rainbow Character for Title */
        @keyframes textGlow {
            0% { text-shadow: 0 0 5px currentColor; }
            50% { text-shadow: 0 0 20px currentColor, 0 0 40px currentColor; }
            100% { text-shadow: 0 0 5px currentColor; }
        }

        .char {
            display: inline-block;
            animation: vibrate 0.1s infinite, textGlow 2s infinite;
            text-shadow: 0 0 10px currentColor;
            opacity: 0;
            transform: scale(3);
            filter: blur(10px);
            transition: all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .char.visible {
            opacity: 1;
            transform: scale(1);
            filter: blur(0px);
        }

        @keyframes vibrate {
            0% { transform: translate(0, 0); }
            25% { transform: translate(-1px, 1px); }
            50% { transform: translate(1px, -1px); }
            75% { transform: translate(-1px, -1px); }
            100% { transform: translate(0, 0); }
        }

        #flash-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: white;
            z-index: 101;
            opacity: 0;
            pointer-events: none;
            display: none;
        }
    </style>
</head>
<body>
    <div id="intro-screen">
        <div id="intro-text"></div>
    </div>
    <div id="flash-overlay"></div>

    <script>
        // --- AUDIO ENGINE ---
        class SpectrumAudio {
            constructor() {
                this.ctx = null;
                this.masterGain = null;
            }
            
            init() {
                if(this.ctx) return;
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioContext();
                
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.value = 0.5;
                this.masterGain.connect(this.ctx.destination);
            }

            // EPIC BUILD UP SOUND (Riser)
            playIntroBuildUp(duration) {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                
                const freqs = [55, 110, 220];
                freqs.forEach(f => {
                    const osc = this.ctx.createOscillator();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(f, now);
                    osc.frequency.exponentialRampToValueAtTime(f * 4, now + duration);
                    
                    const g = this.ctx.createGain();
                    g.gain.setValueAtTime(0, now);
                    g.gain.linearRampToValueAtTime(0.1, now + duration * 0.5);
                    g.gain.linearRampToValueAtTime(0.3, now + duration - 0.1);
                    g.gain.linearRampToValueAtTime(0, now + duration); // Cut at explosion
                    
                    const filter = this.ctx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(100, now);
                    filter.frequency.exponentialRampToValueAtTime(10000, now + duration);
                    
                    osc.connect(filter);
                    filter.connect(g);
                    g.connect(this.masterGain);
                    osc.start();
                    osc.stop(now + duration);
                });
            }

            playTypingSound() {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                osc.type = 'square';
                osc.frequency.setValueAtTime(800 + Math.random()*400, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'highpass'; filter.frequency.value = 1000;
                osc.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination); 
                osc.start(); osc.stop(now + 0.1);
            }

            playExplosion() {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                const bufferSize = this.ctx.sampleRate * 2; 
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for(let i=0; i<bufferSize; i++) data[i] = Math.random() * 2 - 1;
                const noise = this.ctx.createBufferSource();
                noise.buffer = buffer;
                const noiseGain = this.ctx.createGain();
                noiseGain.gain.setValueAtTime(1.0, now);
                noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
                noise.connect(noiseGain); noiseGain.connect(this.masterGain); 
                noise.start();

                const sub = this.ctx.createOscillator();
                sub.type = 'sine';
                sub.frequency.setValueAtTime(150, now);
                sub.frequency.exponentialRampToValueAtTime(10, now + 2.0);
                const subGain = this.ctx.createGain();
                subGain.gain.setValueAtTime(1.0, now);
                subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
                sub.connect(subGain); subGain.connect(this.masterGain);
                sub.start(); sub.stop(now + 2.5);
            }
        }

        const audio = new SpectrumAudio();

        // --- CUTSCENE LOGIC ---
        const phrases = [
            { text: "BENEATH A BILLION TONNES OF STONE...", color: "#888888" },
            { text: "A LEGEND SLEEPS.", color: "#ffffff" },
            { text: "ANCIENT TEXTS SPEAK OF A TEAR...", color: "#aaaaff" },
            { text: "OF PRIMORDIAL LIGHT.", color: "#ffffaa" },
            { text: "THE AIR HUMS WITH ARCANE ENERGY.", color: "#ffaaeb" },
            { text: "BEHOLD...", color: "#ffffff" },
            { text: "THE SPECTRUM", color: "rainbow" },
            { text: "AN IRIDESCENT SHARD OF INFINITY.", color: "#aaffff" }
        ];
        
        const introScreen = document.getElementById('intro-screen');
        const introTextEl = document.getElementById('intro-text');
        const flashOverlay = document.getElementById('flash-overlay');
        
        setTimeout(() => {
            try { audio.init(); } catch(e) {}
            playCutscene();
        }, 500);

        async function playCutscene() {
            const totalDuration = phrases.length * 3.0 + 1.0;
            audio.playIntroBuildUp(totalDuration); 

            for (let i = 0; i < phrases.length; i++) {
                const phrase = phrases[i];
                
                introTextEl.className = ''; 
                introTextEl.classList.remove('visible');
                
                if(i > 0) await new Promise(r => setTimeout(r, 600));
                
                introTextEl.innerHTML = '';
                introTextEl.classList.add('visible'); 
                
                const text = phrase.text;
                const isRainbow = phrase.color === 'rainbow';
                
                for(let c=0; c < text.length; c++) {
                    const char = text[c];
                    const span = document.createElement('span');
                    
                    if (char === ' ') {
                        span.className = 'space';
                        span.innerHTML = '&nbsp;';
                    } else {
                        span.textContent = char;
                        span.className = 'char';
                        
                        if (isRainbow) {
                            const hue = (c / text.length) * 360;
                            span.style.color = \`hsl(\${hue}, 100%, 70%)\`;
                            span.style.textShadow = \`0 0 20px hsl(\${hue}, 100%, 50%)\`;
                        } else {
                            span.style.color = phrase.color;
                            span.style.textShadow = \`0 0 20px \${phrase.color}\`;
                        }
                    }
                    
                    introTextEl.appendChild(span);
                    
                    requestAnimationFrame(() => span.classList.add('visible'));
                    
                    audio.playTypingSound();
                    await new Promise(r => setTimeout(r, 30));
                }
                
                if (i > phrases.length / 2) introScreen.classList.add('shake-screen');
                
                await new Promise(r => setTimeout(r, 1500));
                introTextEl.classList.remove('visible');
            }

            await new Promise(r => setTimeout(r, 800));

            audio.playExplosion();
            flashOverlay.style.display = 'block';
            
            requestAnimationFrame(() => {
                flashOverlay.style.opacity = 1;
                setTimeout(() => {
                    window.parent.postMessage('THE_SPECTRUM_CUTSCENE_COMPLETE', '*');
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
            title="The Spectrum Cutscene"
        />
    );
};
