import React, { useMemo, useEffect } from 'react';

interface Props {
    onComplete: () => void;
}

export const SoundShardCutscene: React.FC<Props> = ({ onComplete }) => {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data === 'SOUND_SHARD_CUTSCENE_COMPLETE') {
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
    <title>Sound Shard Cutscene</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Orbitron', sans-serif; }
        
        /* Background Pulse */
        #pulse-bg {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.15) 0%, rgba(0, 0, 0, 1) 70%);
            opacity: 0;
            transition: opacity 0.05s;
            z-index: 1;
            pointer-events: none;
        }

        /* Scanline Overlay */
        .scanlines {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
            background-size: 100% 4px;
            pointer-events: none;
            z-index: 5;
            opacity: 0.3;
        }

        /* Cinematic Text */
        #cinema-container {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: none;
            z-index: 100;
            perspective: 1000px;
        }

        #cinema-text {
            text-align: center;
            color: #fff;
            font-family: 'Orbitron', sans-serif;
            font-size: 4rem;
            letter-spacing: 2px;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.4);
            opacity: 0;
            transform: scale(1);
            transition: transform 4s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.5s ease-out;
            font-weight: 800;
            white-space: nowrap;
        }
        
        #cinema-text.expanding {
            transform: scale(1.25);
        }

        .wave-char {
            display: inline-block;
            opacity: 0;
            transform: translateZ(-100px) rotateX(90deg);
            filter: blur(20px);
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .wave-char.visible {
            opacity: 1;
            transform: translateZ(0) rotateX(0deg);
            filter: blur(0px);
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
    <div id="pulse-bg"></div>
    <div class="scanlines"></div>
    
    <div id="cinema-container">
        <div id="cinema-text"></div>
    </div>
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

        function playCinematicSfx() {
            if(!audioContext) return;
            const now = audioContext.currentTime;

            // Chord Swell (Harmonic Riser)
            const dropTime = now + 3.5;
            const silenceTime = dropTime - 0.2;
            const riseTime = 3.3;

            const freqs = [130.81, 164.81, 196.00]; // C3 Major Triad
            freqs.forEach((f, i) => {
                const osc = audioContext.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, now);
                osc.frequency.exponentialRampToValueAtTime(f * 2, silenceTime);
                
                const g = audioContext.createGain();
                g.gain.setValueAtTime(0, now);
                g.gain.linearRampToValueAtTime(0.15, now + riseTime * 0.8);
                g.gain.setValueAtTime(0, silenceTime); 
                
                osc.connect(g);
                g.connect(masterGain);
                osc.start(now);
                osc.stop(silenceTime + 0.1);
            });
            
            // Noise Texture
            const noise = audioContext.createBufferSource();
            const bSize = audioContext.sampleRate * 4;
            const buff = audioContext.createBuffer(1, bSize, audioContext.sampleRate);
            const d = buff.getChannelData(0);
            for(let i=0; i<bSize; i++) d[i] = (Math.random()*2-1)*0.05;
            noise.buffer = buff;
            
            const nFilter = audioContext.createBiquadFilter();
            nFilter.type = 'lowpass';
            nFilter.frequency.setValueAtTime(100, now);
            nFilter.frequency.linearRampToValueAtTime(8000, silenceTime);
            
            const nGain = audioContext.createGain();
            nGain.gain.setValueAtTime(0, now);
            nGain.gain.linearRampToValueAtTime(0.25, silenceTime - 0.5);
            nGain.gain.setValueAtTime(0, silenceTime);
            
            noise.connect(nFilter); nFilter.connect(nGain); nGain.connect(masterGain);
            noise.start(now);
            noise.stop(silenceTime + 0.1);
        }
        
        function playImpactSound() {
            if(!audioContext) return;
            const now = audioContext.currentTime;

            // Sub Drop
            const sub = audioContext.createOscillator();
            sub.frequency.setValueAtTime(100, now);
            sub.frequency.exponentialRampToValueAtTime(0.01, now + 1.5);
            const subGain = audioContext.createGain();
            subGain.gain.setValueAtTime(0.8, now);
            subGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
            sub.connect(subGain); subGain.connect(masterGain);
            sub.start(now); sub.stop(now + 1.5);

            // Crash
            const bSize = audioContext.sampleRate * 2;
            const buff = audioContext.createBuffer(1, bSize, audioContext.sampleRate);
            const d = buff.getChannelData(0);
            for(let i=0; i<bSize; i++) d[i] = (Math.random()*2-1);
            const noise = audioContext.createBufferSource();
            noise.buffer = buff;
            const nGain = audioContext.createGain();
            nGain.gain.setValueAtTime(0.5, now);
            nGain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);
            noise.connect(nGain); nGain.connect(masterGain);
            noise.start(now);
        }

        // --- CUTSCENE LOGIC ---
        const cinemaText = document.getElementById('cinema-text');
        const flashOverlay = document.getElementById('flash-overlay');
        const pulseBg = document.getElementById('pulse-bg');

        const phrases = [
            "IN THE BEGINNING...",
            "WAS THE WAVE.",
            "A FREQUENCY UNHEARD.",
            "VIBRATING THROUGH REALITY.",
            "HARMONIC CONVERGENCE IMMINENT.",
            "LISTEN...",
            "THE SOUND SHARD."
        ];

        async function playCutsceneSequence() {
            initAudio();
            
            for (let i = 0; i < phrases.length; i++) {
                if (i === phrases.length - 1) {
                    playCinematicSfx(); 
                }

                const text = phrases[i];
                cinemaText.innerHTML = '';
                cinemaText.style.opacity = '1';
                cinemaText.classList.remove('expanding');
                
                for(let c=0; c < text.length; c++) {
                    const span = document.createElement('span');
                    if(text[c] === ' ') {
                        span.innerHTML = '&nbsp;';
                        span.className = 'wave-char visible'; 
                    } else {
                        span.textContent = text[c];
                        span.className = 'wave-char';
                        requestAnimationFrame(() => span.classList.add('visible'));
                    }
                    cinemaText.appendChild(span);
                    
                    pulseBg.style.opacity = 0.2 + (i * 0.1);
                    setTimeout(() => pulseBg.style.opacity = 0, 50);

                    if(audioContext) {
                        const osc = audioContext.createOscillator();
                        const g = audioContext.createGain();
                        osc.frequency.value = 800 + Math.random() * 200;
                        g.gain.value = 0.02;
                        osc.connect(g); g.connect(masterGain);
                        osc.start(); osc.stop(audioContext.currentTime + 0.05);
                    }

                    await new Promise(r => setTimeout(r, 40));
                }
                
                cinemaText.classList.add('expanding');

                await new Promise(r => setTimeout(r, 1200));
                
                cinemaText.style.opacity = '0';
                await new Promise(r => setTimeout(r, 500));
            }
            
            await new Promise(r => setTimeout(r, 200)); 
            triggerDrop();
        }

        function triggerDrop() {
            playImpactSound();
            flashOverlay.style.opacity = 1.0;
            
            setTimeout(() => {
                window.parent.postMessage('SOUND_SHARD_CUTSCENE_COMPLETE', '*');
            }, 500); // Short delay to let flash fill screen
        }

        setTimeout(playCutsceneSequence, 500);
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
            title="Sound Shard Cutscene"
        />
    );
};
