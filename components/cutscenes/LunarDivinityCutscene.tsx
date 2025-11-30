import React, { useMemo, useEffect } from 'react';

interface Props {
    onComplete: () => void;
}

export const LunarDivinityCutscene: React.FC<Props> = ({ onComplete }) => {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data === 'LUNAR_DIVINITY_CUTSCENE_COMPLETE') {
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
    <title>Lunar Divinity Cutscene</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            overflow: hidden;
            background-color: #050510;
            font-family: 'Cinzel', serif;
        }
        
        /* --- CUTSCENE UI --- */
        #intro-screen {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: #020205;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            box-sizing: border-box;
            background-image: radial-gradient(circle at 50% 50%, #0a0a15 0%, #000000 70%);
            animation: pulseBg 5s infinite ease-in-out;
        }

        @keyframes pulseBg {
            0%, 100% { box-shadow: inset 0 0 100px rgba(0,0,0,0.8); }
            50% { box-shadow: inset 0 0 50px rgba(10, 20, 40, 0.5); }
        }
        
        /* Star background for intro */
        .intro-stars {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-image: 
                radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
                radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 90px 40px, #ffffff, rgba(0,0,0,0)),
                radial-gradient(1px 1px at 160px 120px, #ffffff, rgba(0,0,0,0));
            background-repeat: repeat;
            background-size: 200px 200px;
            opacity: 0.3;
            animation: drift 100s linear infinite;
        }
        
        @keyframes drift { from { transform: translateY(0); } to { transform: translateY(-200px); } }

        #intro-text {
            font-family: 'Cinzel', serif;
            font-size: 42px;
            line-height: 1.4;
            text-align: center;
            max-width: 90%;
            text-transform: uppercase;
            letter-spacing: 6px;
            font-weight: 500;
            opacity: 0;
            transform: scale(1.1);
            filter: blur(10px);
            transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
            color: #e0eaff;
            text-shadow: 0 0 20px rgba(180, 200, 255, 0.5);
            z-index: 10;
        }

        #intro-text.visible {
            opacity: 1;
            transform: scale(1);
            filter: blur(0px);
            animation: slowZoom 5s forwards;
        }

        @keyframes slowZoom {
            from { transform: scale(1); }
            to { transform: scale(1.05); }
        }

        .shake-screen {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both infinite;
        }

        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }

        .char {
            display: inline-block;
            opacity: 0;
            transform: translateY(10px);
            filter: blur(5px);
            transition: all 0.1s ease-out;
        }
        .char.visible {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
        }
        
        /* Text Glitch Effect */
        .glitch {
            animation: textGlitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
            color: #ffffff;
        }
        
        @keyframes textGlitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); text-shadow: 2px 0 #0ff; }
            40% { transform: translate(-2px, -2px); text-shadow: -2px 0 #f0f; }
            60% { transform: translate(2px, 2px); text-shadow: 2px 0 #0ff; }
            80% { transform: translate(2px, -2px); text-shadow: -2px 0 #f0f; }
            100% { transform: translate(0); }
        }

        #flash-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at center, #ffffff 0%, #dbeeff 50%, #88aaff 100%);
            z-index: 101;
            opacity: 0;
            pointer-events: none;
            display: none;
        }
    </style>
</head>
<body>
    <div id="intro-screen">
        <div class="intro-stars"></div>
        <div id="intro-text"></div>
    </div>
    <div id="flash-overlay"></div>

    <script>
        // --- AUDIO ENGINE (Simplified for Cutscene) ---
        class LunarAudio {
            constructor() {
                this.ctx = null;
                this.masterGain = null;
                this.initialized = false;
            }

            init() {
                if (this.ctx) return;
                
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioContext();
                
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.value = 0.3; 
                this.masterGain.connect(this.ctx.destination);
            }

            playIntroBuildUp(duration) {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                
                // Deep riser (Square wave for more grit)
                const osc = this.ctx.createOscillator();
                osc.type = 'square';
                osc.frequency.setValueAtTime(55, now);
                osc.frequency.exponentialRampToValueAtTime(110, now + duration);
                
                const g = this.ctx.createGain();
                g.gain.setValueAtTime(0, now);
                g.gain.linearRampToValueAtTime(0.1, now + duration * 0.5);
                g.gain.linearRampToValueAtTime(0, now + duration);
                
                // High shimmer riser
                const osc2 = this.ctx.createOscillator();
                osc2.type = 'sawtooth';
                osc2.frequency.setValueAtTime(440, now);
                osc2.frequency.exponentialRampToValueAtTime(1760, now + duration);
                const g2 = this.ctx.createGain();
                g2.gain.setValueAtTime(0, now);
                g2.gain.linearRampToValueAtTime(0.05, now + duration * 0.8);
                g2.gain.linearRampToValueAtTime(0, now + duration);

                // Lowpass filter opening
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(100, now);
                filter.frequency.exponentialRampToValueAtTime(8000, now + duration);
                
                osc.connect(filter);
                osc2.connect(filter);
                filter.connect(g);
                filter.connect(g2);
                g.connect(this.masterGain);
                g2.connect(this.masterGain);
                
                osc.start(); osc.stop(now + duration);
                osc2.start(); osc2.stop(now + duration);
            }

            playTypingSound() {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                // Crystalline Tick
                const osc = this.ctx.createOscillator();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(2000 + Math.random()*1000, now);
                osc.frequency.exponentialRampToValueAtTime(500, now + 0.05);
                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                
                // Echo
                const delay = this.ctx.createDelay();
                delay.delayTime.value = 0.1;
                const feedback = this.ctx.createGain();
                feedback.gain.value = 0.3;
                
                osc.connect(gain);
                gain.connect(this.masterGain);
                gain.connect(delay);
                delay.connect(this.masterGain);
                delay.connect(feedback);
                feedback.connect(delay);
                
                osc.start(); osc.stop(now + 0.1);
            }

            playDeepThud() {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(60, now);
                osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.connect(gain); gain.connect(this.masterGain);
                osc.start(); osc.stop(now + 0.5);
            }

            playExplosion() {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                
                // White noise burst (ethereal)
                const bufferSize = this.ctx.sampleRate * 2; 
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for(let i=0; i<bufferSize; i++) data[i] = Math.random() * 2 - 1;
                const noise = this.ctx.createBufferSource();
                noise.buffer = buffer;
                const noiseGain = this.ctx.createGain();
                noiseGain.gain.setValueAtTime(0.8, now);
                noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 4.0);
                
                // Filter noise
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'highpass';
                filter.frequency.value = 500;
                
                noise.connect(filter);
                filter.connect(noiseGain);
                noiseGain.connect(this.masterGain);
                noise.start();

                // Low thud
                const sub = this.ctx.createOscillator();
                sub.type = 'sine';
                sub.frequency.setValueAtTime(100, now);
                sub.frequency.exponentialRampToValueAtTime(30, now + 3.0);
                const subGain = this.ctx.createGain();
                subGain.gain.setValueAtTime(1.0, now);
                subGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);
                sub.connect(subGain); subGain.connect(this.masterGain);
                sub.start(); sub.stop(now + 3.0);
            }
        }

        const audioSystem = new LunarAudio();

        // --- CUTSCENE LOGIC ---
        const phrases = [
            { text: "THE COSMOS TREMBLES...", color: "#aaccff", glitch: true },
            { text: "A DIVINE PRESENCE APPROACHES.", color: "#ffffff" },
            { text: "FROM THE SILENT VOID...", color: "#88aaff" },
            { text: "THE MOON GOD AWAKENS.", color: "#e0eaff", glow: true },
            { text: "LUNAR DIVINITY", color: "#ffffff", glow: true, glitch: true }
        ];

        const introScreen = document.getElementById('intro-screen');
        const introTextEl = document.getElementById('intro-text');
        const flashOverlay = document.getElementById('flash-overlay');

        setTimeout(() => {
            try { audioSystem.init(); } catch(e) {}
            playCutscene();
        }, 500);

        async function playCutscene() {
            const totalDuration = phrases.length * 3.0;
            audioSystem.playIntroBuildUp(totalDuration);

            for (let i = 0; i < phrases.length; i++) {
                const phrase = phrases[i];
                introTextEl.className = ''; 
                introTextEl.classList.remove('visible');
                if(phrase.glitch) introTextEl.classList.add('glitch');
                
                if (i === phrases.length - 1) {
                    introScreen.classList.add('shake-screen');
                }

                if(i > 0) await new Promise(r => setTimeout(r, 400));
                
                introTextEl.innerHTML = '';
                introTextEl.classList.add('visible');
                
                const text = phrase.text;
                
                for(let c=0; c < text.length; c++) {
                    const char = text[c];
                    const span = document.createElement('span');
                    if (char === ' ') {
                        span.innerHTML = '&nbsp;';
                    } else {
                        span.textContent = char;
                        span.className = 'char';
                        span.style.color = phrase.color;
                        if(phrase.glow) span.style.textShadow = "0 0 20px #ffffff, 0 0 40px #aaccff";
                    }
                    introTextEl.appendChild(span);
                    requestAnimationFrame(() => span.classList.add('visible'));
                    audioSystem.playTypingSound();
                    await new Promise(r => setTimeout(r, 35));
                }
                
                audioSystem.playDeepThud();
                
                await new Promise(r => setTimeout(r, 1200));
                introTextEl.classList.remove('visible');
            }

            await new Promise(r => setTimeout(r, 500));

            // Reveal
            audioSystem.playExplosion();
            flashOverlay.style.display = 'block';
            
            requestAnimationFrame(() => {
                flashOverlay.style.opacity = 1;
                
                setTimeout(() => {
                    // Signal completion
                    window.parent.postMessage('LUNAR_DIVINITY_CUTSCENE_COMPLETE', '*');
                }, 1000);
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
            title="Lunar Divinity Cutscene"
        />
    );
};
