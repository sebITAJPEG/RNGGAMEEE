import React, { useMemo, useEffect } from 'react';

interface Props {
    onComplete: () => void;
}

export const BlackHoleCutscene: React.FC<Props> = ({ onComplete }) => {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data === 'BLACK_HOLE_CUTSCENE_COMPLETE') {
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
    <title>Black Hole Cutscene</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Orbitron', sans-serif; }

        /* --- CUTSCENE UI --- */
        #intro-screen {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: #000;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .scan-line {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 5px;
            background: rgba(0, 255, 255, 0.3);
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            animation: scan 3s linear infinite;
            opacity: 0.5;
        }

        .warning-border {
            position: absolute;
            top: 20px; left: 20px; right: 20px; bottom: 20px;
            border: 2px solid rgba(255, 0, 0, 0.2);
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.1) inset;
            pointer-events: none;
            animation: pulseWarning 1s infinite alternate;
        }

        .data-stream {
            position: absolute;
            bottom: 40px; left: 40px;
            font-family: 'Share Tech Mono', monospace;
            color: rgba(0, 255, 0, 0.5);
            font-size: 12px;
            text-align: left;
            white-space: pre;
            line-height: 1.2;
        }

        .reticle-corner {
            position: absolute;
            width: 50px; height: 50px;
            border-color: rgba(255, 255, 255, 0.3);
            border-style: solid;
            transition: all 0.5s;
        }
        .tl { top: 100px; left: 100px; border-width: 2px 0 0 2px; }
        .tr { top: 100px; right: 100px; border-width: 2px 2px 0 0; }
        .bl { bottom: 100px; left: 100px; border-width: 0 0 2px 2px; }
        .br { bottom: 100px; right: 100px; border-width: 0 2px 2px 0; }

        @keyframes scan {
            0% { top: -10%; opacity: 0; }
            50% { opacity: 0.5; }
            100% { top: 110%; opacity: 0; }
        }

        @keyframes pulseWarning {
            0% { opacity: 0.2; border-color: rgba(255,0,0,0.2); }
            100% { opacity: 0.8; border-color: rgba(255,0,0,0.6); box-shadow: 0 0 50px rgba(255,0,0,0.3) inset; }
        }
        
        #intro-text {
            font-family: 'Cinzel', serif;
            font-size: 3rem;
            color: #fff;
            text-align: center;
            letter-spacing: 5px;
            opacity: 1;
        }
        
        /* Character Animation */
        .char {
            display: inline-block;
            opacity: 0;
            transform: translateY(20px) scale(0.5);
            filter: blur(10px);
            transition: all 0.1s cubic-bezier(0.1, 0.9, 0.2, 1.0);
        }
        
        .char.visible {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
        }
        
        .char.glitch {
            animation: charGlitch 0.2s infinite;
            color: #ff3300;
        }
        
        @keyframes charGlitch {
            0% { transform: translate(0,0); }
            20% { transform: translate(-5px, 2px); }
            40% { transform: translate(5px, -2px); text-shadow: 2px 0 blue; }
            60% { transform: translate(-2px, 5px); }
            80% { transform: translate(2px, -5px); text-shadow: -2px 0 red; }
            100% { transform: translate(0,0); }
        }

        #event-horizon-overlay {
            position: fixed;
            top: 50%; left: 50%;
            width: 0px; height: 0px;
            border-radius: 50%;
            background: #000;
            box-shadow: 0 0 50px 20px #ffaa00;
            transform: translate(-50%, -50%);
            z-index: 101;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <div id="intro-screen">
        <div class="scan-line"></div>
        <div class="warning-border"></div>
        <div class="reticle-corner tl"></div>
        <div class="reticle-corner tr"></div>
        <div class="reticle-corner bl"></div>
        <div class="reticle-corner br"></div>
        <div class="data-stream" id="data-stream"></div>
        <div id="intro-text"></div>
    </div>
    <div id="event-horizon-overlay"></div>

    <script>
        // --- AUDIO ENGINE ---
        class BlackHoleAudio {
            constructor() {
                this.ctx = null;
                this.masterGain = null;
                this.convolver = null;
            }
            
            init() {
                if(this.ctx) return;
                const AC = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AC();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.value = 0.6;
                this.masterGain.connect(this.ctx.destination);
                
                try {
                    this.convolver = this.ctx.createConvolver();
                    this.convolver.buffer = this.createImpulseResponse(3.0, 3.0);
                    this.verbGain = this.ctx.createGain();
                    this.verbGain.gain.value = 0.5;
                    this.convolver.connect(this.verbGain);
                    this.verbGain.connect(this.masterGain);
                } catch(e) { console.warn("Reverb init failed", e); }
            }

            createImpulseResponse(duration, decay) {
                const sampleRate = this.ctx.sampleRate;
                const length = sampleRate * duration;
                const impulse = this.ctx.createBuffer(2, length, sampleRate);
                const left = impulse.getChannelData(0);
                const right = impulse.getChannelData(1);
                for (let i = 0; i < length; i++) {
                    const n = i; const env = Math.pow(1 - n / length, decay);
                    left[i] = (Math.random() * 2 - 1) * env;
                    right[i] = (Math.random() * 2 - 1) * env;
                }
                return impulse;
            }
            
            resume() {
                if(this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
            }

            playRumble() {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.value = 40;
                
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 60;
                
                const lfo = this.ctx.createOscillator();
                lfo.frequency.value = 0.2;
                const lfoGain = this.ctx.createGain();
                lfoGain.gain.value = 30;
                lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
                
                const g = this.ctx.createGain();
                g.gain.value = 0.6;
                
                osc.connect(filter); filter.connect(g); g.connect(this.masterGain);
                lfo.start(now); osc.start(now);
            }
            
            playTextGlitch() {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100 + Math.random()*500, now);
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'highpass'; filter.frequency.value = 2000;
                const g = this.ctx.createGain();
                g.gain.setValueAtTime(0.1, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.connect(filter); filter.connect(g); g.connect(this.masterGain);
                osc.start(); osc.stop(now + 0.1);
            }

            playImplosion() {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                osc.frequency.setValueAtTime(50, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 2.0); 
                const g = this.ctx.createGain();
                g.gain.setValueAtTime(0, now);
                g.gain.linearRampToValueAtTime(0.8, now + 1.9);
                g.gain.linearRampToValueAtTime(0, now + 2.0);
                osc.connect(g); g.connect(this.masterGain); 
                if(this.convolver) g.connect(this.convolver);
                osc.start(); osc.stop(now + 2.0);
                
                const kick = this.ctx.createOscillator();
                kick.frequency.setValueAtTime(100, now + 2.1);
                kick.frequency.exponentialRampToValueAtTime(0.01, now + 4.0);
                const kGain = this.ctx.createGain();
                kGain.gain.setValueAtTime(1.0, now + 2.1);
                kGain.gain.exponentialRampToValueAtTime(0.001, now + 4.0);
                kick.connect(kGain); kGain.connect(this.masterGain);
                kick.start(now + 2.1); kick.stop(now + 4.0);
            }
        }
        
        const audio = new BlackHoleAudio();

        // --- CUTSCENE LOGIC ---
        const phrases = [
            "GRAVITY WELL DETECTED.",
            "EVENT HORIZON PROXIMITY: CRITICAL.",
            "REALITY IS BENDING...",
            "THE ABYSS STARES BACK.",
            "BLACK HOLE CORE."
        ];
        
        const introText = document.getElementById('intro-text');
        const introScreen = document.getElementById('intro-screen');
        const overlay = document.getElementById('event-horizon-overlay');
        const dataStream = document.getElementById('data-stream');

        const streamInterval = setInterval(() => {
            let txt = "";
            for(let i=0; i<6; i++) {
                txt += \`0x\${Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6,'0')} // \${Math.random().toFixed(4)} <br>\`;
            }
            if(dataStream) dataStream.innerHTML = txt;
        }, 100);

        setTimeout(() => {
            try{ audio.init(); audio.resume(); }catch(e){}
            playCutscene();
        }, 100);

        async function playCutscene() {
            try {
                audio.playRumble();
                
                // Reticle contraction
                const reticles = document.querySelectorAll('.reticle-corner');
                setTimeout(() => {
                    reticles.forEach(r => {
                        r.style.top = r.classList.contains('tl') || r.classList.contains('tr') ? '30%' : '';
                        r.style.bottom = r.classList.contains('bl') || r.classList.contains('br') ? '30%' : '';
                        r.style.left = r.classList.contains('tl') || r.classList.contains('bl') ? '30%' : '';
                        r.style.right = r.classList.contains('tr') || r.classList.contains('br') ? '30%' : '';
                        r.style.borderColor = 'rgba(255, 50, 50, 0.8)';
                    });
                }, 3000); 

                for(let i=0; i<phrases.length; i++) {
                    const phrase = phrases[i];
                    introText.innerHTML = ''; 
                    
                    for(let c=0; c<phrase.length; c++) {
                        const span = document.createElement('span');
                        span.textContent = phrase[c];
                        span.className = 'char';
                        if(phrase[c] === ' ') span.style.width = '15px';
                        introText.appendChild(span);
                    }
                    
                    const chars = introText.querySelectorAll('.char');
                    for(let c=0; c<chars.length; c++) {
                        setTimeout(() => {
                            if(chars[c]) {
                                chars[c].classList.add('visible');
                                if (Math.random() > 0.7) audio.playTextGlitch();
                            }
                        }, c * 30); 
                    }
                    
                    if(i > 2) {
                        setTimeout(() => {
                            introText.querySelectorAll('.char').forEach(c => c.classList.add('glitch'));
                            audio.playTextGlitch(); 
                        }, phrase.length * 30 + 200);
                    }
                    
                    await new Promise(r => setTimeout(r, 1500 + phrase.length * 30));
                    introText.querySelectorAll('.char').forEach(c => c.classList.remove('visible'));
                    await new Promise(r => setTimeout(r, 300));
                }
                
                audio.playImplosion();
                
                overlay.style.transition = 'width 0.2s ease-in, height 0.2s ease-in';
                overlay.style.width = '300vw';
                overlay.style.height = '300vw';
                
                await new Promise(r => setTimeout(r, 300));
                
                // Complete
                window.parent.postMessage('BLACK_HOLE_CUTSCENE_COMPLETE', '*');
                
            } catch(e) {
                console.error("Cutscene error", e);
                // Fallback complete
                window.parent.postMessage('BLACK_HOLE_CUTSCENE_COMPLETE', '*');
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
            title="Black Hole Cutscene"
        />
    );
};
