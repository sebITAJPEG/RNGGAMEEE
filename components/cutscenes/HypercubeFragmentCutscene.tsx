import React, { useMemo, useEffect } from 'react';

interface Props {
    onComplete: () => void;
}

export const HypercubeFragmentCutscene: React.FC<Props> = ({ onComplete }) => {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data === 'HYPERCUBE_CUTSCENE_COMPLETE') {
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
    <title>Hypercube Cutscene</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Share Tech Mono', monospace; }
        
        /* Cinematic Elements */
        #cinema-text {
            position: absolute;
            top: 45%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #00ffff;
            font-family: 'Orbitron', sans-serif;
            font-size: 3rem;
            letter-spacing: 4px;
            text-shadow: 0 0 10px #00ffff;
            opacity: 0;
            pointer-events: none;
            z-index: 50;
        }

        .char {
            display: inline-block;
            opacity: 0;
            transform: translate(0, -20px);
            filter: blur(5px);
            transition: all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .char.visible {
            opacity: 1;
            transform: translate(0, 0);
            filter: blur(0px);
        }
        
        .space { display: inline-block; width: 0.5em; }

        .glitch-text {
            animation: glitch 0.3s infinite;
        }

        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
        
        #flash-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: white;
            opacity: 0;
            pointer-events: none;
            z-index: 60;
        }
    </style>
</head>
<body>
    <div id="cinema-text"></div>
    <div id="flash-overlay"></div>

    <script>
        // --- AUDIO ENGINE ---
        let audioContext = null;
        let masterGain = null;

        function initAudio() {
            if (audioContext) return;
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            masterGain = audioContext.createGain();
            masterGain.gain.value = 0.4;
            masterGain.connect(audioContext.destination);
        }

        function playRiser() {
            if (!audioContext) return;
            const now = audioContext.currentTime;
            
            const osc = audioContext.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(50, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 3.0);
            
            const gain = audioContext.createGain();
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.15, now + 3.0);
            gain.gain.linearRampToValueAtTime(0, now + 3.1);
            
            const filter = audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(100, now);
            filter.frequency.linearRampToValueAtTime(2000, now + 3.0);

            osc.connect(filter); filter.connect(gain); gain.connect(masterGain);
            osc.start(now); osc.stop(now + 3.1);
        }

        function playImpact() {
            if (!audioContext) return;
            const now = audioContext.currentTime;

            const sub = audioContext.createOscillator();
            sub.frequency.setValueAtTime(150, now);
            sub.frequency.exponentialRampToValueAtTime(0.01, now + 1.0);
            const subGain = audioContext.createGain();
            subGain.gain.setValueAtTime(0.8, now);
            subGain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
            sub.connect(subGain); subGain.connect(masterGain);
            sub.start(now); sub.stop(now + 1.0);

            const bSize = audioContext.sampleRate * 2;
            const buff = audioContext.createBuffer(1, bSize, audioContext.sampleRate);
            const d = buff.getChannelData(0);
            for(let i=0; i<bSize; i++) d[i] = Math.random() * 2 - 1;
            const noise = audioContext.createBufferSource();
            noise.buffer = buff;
            const noiseFilter = audioContext.createBiquadFilter();
            noiseFilter.type = 'highpass'; noiseFilter.frequency.value = 500;
            const noiseGain = audioContext.createGain();
            noiseGain.gain.setValueAtTime(0.5, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);
            noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(masterGain);
            noise.start(now);
        }

        // --- CUTSCENE LOGIC ---
        const cinemaText = document.getElementById('cinema-text');
        const flashOverlay = document.getElementById('flash-overlay');
        
        const phrases = [
            "THE THIRD DIMENSION IS A CAGE.",
            "ANGLES THAT DO NOT EXIST.",
            "SHAPES THAT CANNOT BE.",
            "REALITY ANCHOR: DESTABILIZED.",
            "FOLDING SPACE...",
            "WITNESS...",
            "THE TESSERACT."
        ];

        async function playCutsceneText() {
            cinemaText.style.opacity = '1';
            
            for (let i = 0; i < phrases.length; i++) {
                const text = phrases[i];
                cinemaText.innerHTML = '';
                cinemaText.className = ''; 
                
                for(let c=0; c<text.length; c++) {
                    const span = document.createElement('span');
                    if(text[c] === ' ') {
                        span.className = 'space';
                        span.innerHTML = '&nbsp;';
                    } else {
                        span.textContent = text[c];
                        span.className = 'char';
                    }
                    cinemaText.appendChild(span);
                    
                    requestAnimationFrame(() => span.classList.add('visible'));
                    
                    if (audioContext) {
                        const osc = audioContext.createOscillator();
                        osc.type = 'square';
                        osc.frequency.value = 200 + Math.random() * 500;
                        const g = audioContext.createGain();
                        g.gain.value = 0.05;
                        osc.connect(g); g.connect(masterGain);
                        osc.start(); osc.stop(audioContext.currentTime + 0.03);
                    }
                    
                    await new Promise(r => setTimeout(r, 30));
                }
                
                cinemaText.classList.add('glitch-text');
                
                await new Promise(r => setTimeout(r, 1500));
                
                cinemaText.innerHTML = '';
                await new Promise(r => setTimeout(r, 300));
            }
            
            triggerBreach();
        }

        function triggerBreach() {
            playImpact();
            flashOverlay.style.opacity = 1.0;
            
            setTimeout(() => {
                window.parent.postMessage('HYPERCUBE_CUTSCENE_COMPLETE', '*');
            }, 500);
        }

        setTimeout(() => {
            try { initAudio(); playRiser(); } catch(e) {}
            playCutsceneText();
        }, 500);
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
            title="Hypercube Cutscene"
        />
    );
};
