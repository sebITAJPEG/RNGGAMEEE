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
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Playfair+Display:ital,wght@1,400&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Cinzel', serif; }
        
        #scene {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            background: radial-gradient(circle at center, #050510 0%, #000 100%);
            overflow: hidden;
        }

        /* --- THE MOON --- */
        #moon-container {
            position: absolute;
            width: 300px; height: 300px;
            z-index: 10;
            filter: drop-shadow(0 0 20px rgba(255,255,255,0.1));
        }

        #moon {
            width: 100%; height: 100%;
            border-radius: 50%;
            background-color: #e0e0e0;
            background-image: 
                radial-gradient(circle at 30% 30%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 20%),
                radial-gradient(circle at 70% 60%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 30%),
                radial-gradient(circle at 40% 80%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 15%),
                url('https://www.transparenttextures.com/patterns/stardust.png'); /* Noise texture */
            box-shadow: inset -20px -20px 50px rgba(0,0,0,0.5), 0 0 50px rgba(255,255,255,0.1);
            transition: all 1s;
            position: relative;
            overflow: hidden;
        }

        #eclipse-shadow {
            position: absolute;
            top: 50%; left: 150%;
            width: 105%; height: 105%;
            border-radius: 50%;
            background-color: #000;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 30px 10px rgba(0,0,0,0.8);
            transition: left 5s ease-in-out;
            z-index: 2;
        }

        /* Corona Effect */
        #corona {
            position: absolute;
            top: 50%; left: 50%;
            width: 100%; height: 100%;
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 0 0 rgba(255,255,255,0);
            transition: all 0.5s;
            z-index: 1;
        }
        #corona.active {
            box-shadow: 0 0 50px 20px rgba(255, 255, 255, 0.8), 0 0 100px 50px rgba(100, 200, 255, 0.5);
            animation: pulse-corona 2s infinite alternate;
        }
        
        @keyframes pulse-corona {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
            100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        }

        /* --- DIVINE RAYS --- */
        .ray {
            position: absolute;
            top: 50%; left: 50%;
            width: 100vw; height: 100vw;
            background: conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.1) 10deg, transparent 20deg);
            transform: translate(-50%, -50%);
            z-index: 5;
            opacity: 0;
            transition: opacity 2s;
            mask-image: radial-gradient(circle, transparent 150px, black 300px);
        }
        .ray.active {
            animation: rotate-rays 60s linear infinite;
            opacity: 1;
        }

        /* --- CLOUDS --- */
        .cloud-layer {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 20;
            opacity: 0.5;
            pointer-events: none;
        }

        /* --- TEXT --- */
        #text-container {
            position: absolute;
            z-index: 50;
            text-align: center;
            width: 100%;
            top: 75%;
            perspective: 500px;
        }
        
        .phrase {
            font-size: 3rem;
            color: rgba(255, 255, 255, 0.95);
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
            opacity: 0;
            transition: opacity 1s, transform 1s, letter-spacing 2s;
            transform: rotateX(20deg) translateY(50px);
            letter-spacing: 0px;
            font-weight: 700;
        }
        .phrase.visible {
            opacity: 1;
            transform: rotateX(0deg) translateY(0);
            letter-spacing: 10px;
        }

        /* --- FLASH --- */
        #flash {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: white;
            opacity: 0;
            z-index: 100;
            transition: opacity 3s cubic-bezier(0.1, 0.9, 0.2, 1);
            pointer-events: none;
        }
        
        /* --- PARTICLES --- */
        .particle {
            position: absolute;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
        }

        @keyframes rotate-rays {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .shake {
            animation: shake-anim 0.5s cubic-bezier(.36,.07,.19,.97) both infinite;
        }
        @keyframes shake-anim {
            10%, 90% { transform: translate3d(-2px, 0, 0); }
            20%, 80% { transform: translate3d(4px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-8px, 0, 0); }
            40%, 60% { transform: translate3d(8px, 0, 0); }
        }

    </style>
</head>
<body>
    <div id="scene">
        <div class="cloud-layer" id="clouds"></div>
        <div id="moon-container">
            <div id="corona"></div>
            <div id="moon"></div>
            <div id="eclipse-shadow"></div>
        </div>
        <div id="rays-bg" class="ray"></div>
        <div id="rays-fg" class="ray" style="animation-direction: reverse; width: 80vw; height: 80vw;"></div>
        <div id="text-container"></div>
    </div>
    <div id="flash"></div>

    <script>
        // --- AUDIO ENGINE ---
        let audioCtx;
        let masterGain;
        let reverbNode;

        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioCtx.createGain();
            masterGain.gain.value = 0.5;
            masterGain.connect(audioCtx.destination);
            
            // Richer Reverb
            const sr = audioCtx.sampleRate;
            const len = sr * 6.0; 
            const impulse = audioCtx.createBuffer(2, len, sr);
            for (let c = 0; c < 2; c++) {
                const d = impulse.getChannelData(c);
                for (let i = 0; i < len; i++) {
                    d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.5);
                }
            }
            reverbNode = audioCtx.createConvolver();
            reverbNode.buffer = impulse;
            reverbNode.connect(masterGain);
            
        } catch(e) { console.warn("Audio init failed"); }

        function playChoir(freqs, duration) {
            if(!audioCtx) return;
            const t = audioCtx.currentTime;
            
            freqs.forEach((f, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                // Complex wave for voice-like timbre
                const real = new Float32Array([0, 1, 0.5, 0.3, 0.1]);
                const imag = new Float32Array([0, 0, 0, 0, 0]);
                const wave = audioCtx.createPeriodicWave(real, imag);
                osc.setPeriodicWave(wave);
                osc.frequency.value = f;
                
                // Detune for chorus
                osc.detune.value = (Math.random() - 0.5) * 20;
                
                // Slow swell
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.05 / freqs.length, t + duration * 0.3);
                gain.gain.setValueAtTime(0.05 / freqs.length, t + duration * 0.7);
                gain.gain.linearRampToValueAtTime(0, t + duration);
                
                // Panning
                const panner = audioCtx.createStereoPanner();
                panner.pan.value = (i / freqs.length) * 2 - 1;
                
                osc.connect(gain);
                gain.connect(panner);
                panner.connect(reverbNode);
                
                osc.start(t);
                osc.stop(t + duration);
            });
        }

        function playRumble() {
            if(!audioCtx) return;
            const t = audioCtx.currentTime;
            
            const osc = audioCtx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(40, t);
            osc.frequency.linearRampToValueAtTime(30, t + 10);
            
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.2, t + 2);
            gain.gain.linearRampToValueAtTime(0, t + 10);
            
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 100;
            
            osc.connect(filter); filter.connect(gain); gain.connect(masterGain);
            osc.start(t); osc.stop(t + 10);
        }
        
        function playChimeCluster() {
            if(!audioCtx) return;
            const t = audioCtx.currentTime;
            for(let i=0; i<5; i++) {
                const osc = audioCtx.createOscillator();
                osc.type = 'sine';
                osc.frequency.value = 1000 + Math.random() * 2000;
                const gain = audioCtx.createGain();
                gain.gain.setValueAtTime(0, t + i*0.1);
                gain.gain.linearRampToValueAtTime(0.1, t + i*0.1 + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i*0.1 + 2.0);
                osc.connect(gain); gain.connect(reverbNode);
                osc.start(t + i*0.1); osc.stop(t + i*0.1 + 2.0);
            }
        }

        function playAscensionSwell() {
            if(!audioCtx) return;
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(110, t);
            osc.frequency.exponentialRampToValueAtTime(880, t + 5.0);
            
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0, t);
            gain.gain.exponentialRampToValueAtTime(0.3, t + 4.5);
            gain.gain.linearRampToValueAtTime(0, t + 5.0);
            
            osc.connect(gain); gain.connect(reverbNode);
            osc.start(t); osc.stop(t + 5.0);
        }
        
        function playTextImpact() {
            if(!audioCtx) return;
            const t = audioCtx.currentTime;
            // Low boom
            const osc = audioCtx.createOscillator();
            osc.frequency.setValueAtTime(150, t);
            osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.5);
            
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.8, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
            
            osc.connect(gain); gain.connect(masterGain);
            osc.start(t); osc.stop(t + 0.5);
        }
        
        function playShakeRumble() {
             if(!audioCtx) return;
             const t = audioCtx.currentTime;
             // Noise rumble
             const bufSize = audioCtx.sampleRate * 2;
             const buffer = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
             const data = buffer.getChannelData(0);
             for(let i=0; i<bufSize; i++) data[i] = Math.random() * 2 - 1;
             
             const noise = audioCtx.createBufferSource();
             noise.buffer = buffer;
             
             const filter = audioCtx.createBiquadFilter();
             filter.type = 'lowpass';
             filter.frequency.value = 150;
             
             const gain = audioCtx.createGain();
             gain.gain.setValueAtTime(0.5, t);
             gain.gain.linearRampToValueAtTime(0, t + 2.0);
             
             noise.connect(filter); filter.connect(gain); gain.connect(masterGain);
             noise.start(t);
        }

        // --- PARTICLE SYSTEM ---
        const scene = document.getElementById('scene');
        const cloudsContainer = document.getElementById('clouds');
        
        function createParticle(x, y, type) {
            const p = document.createElement('div');
            p.className = 'particle';
            
            if (type === 'star') {
                const size = Math.random() * 2;
                p.style.width = size + 'px'; p.style.height = size + 'px';
                p.style.left = x + '%'; p.style.top = y + '%';
                p.style.opacity = Math.random();
            } else if (type === 'mote') {
                p.style.width = '4px'; p.style.height = '4px';
                p.style.background = 'radial-gradient(circle, white 0%, transparent 70%)';
                p.style.left = x + '%'; p.style.top = y + '%';
            }
            
            scene.appendChild(p);
            return p;
        }
        
        // Init Background Stars
        for(let i=0; i<150; i++) {
            createParticle(Math.random()*100, Math.random()*100, 'star');
        }
        
        // Animated Motes
        const motes = [];
        function spawnMote() {
            const mote = createParticle(Math.random()*100, 110, 'mote');
            const speed = 0.5 + Math.random();
            motes.push({ el: mote, y: 110, speed: speed, offset: Math.random() * 100 });
        }
        
        function animateMotes() {
            for(let i=0; i<motes.length; i++) {
                const m = motes[i];
                m.y -= m.speed;
                const xParams = Math.sin(m.y * 0.05 + m.offset) * 5;
                m.el.style.top = m.y + '%';
                m.el.style.transform = \`translateX(\${xParams}px)\`;
                m.el.style.opacity = Math.min(1, (110 - m.y) / 20) * Math.max(0, (m.y + 10) / 20); // Fade in/out
                
                if(m.y < -10) {
                    m.el.remove();
                    motes.splice(i, 1);
                    i--;
                }
            }
            requestAnimationFrame(animateMotes);
        }
        animateMotes();
        setInterval(spawnMote, 100);

        // --- CLOUDS ---
        // Simple moving fog
        for(let i=0; i<3; i++) {
            const c = document.createElement('div');
            c.style.position = 'absolute';
            c.style.width = '200%';
            c.style.height = '200%';
            c.style.top = '-50%';
            c.style.left = '-50%';
            c.style.background = 'radial-gradient(circle, transparent 40%, rgba(10,20,40,0.4) 100%)';
            c.style.filter = 'blur(50px)';
            c.style.animation = \`cloud-spin \${60 + i*20}s linear infinite\`;
            c.style.opacity = 0.3;
            cloudsContainer.appendChild(c);
        }
        const style = document.createElement('style');
        style.innerHTML = \`@keyframes cloud-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }\`;
        document.head.appendChild(style);


        // --- SEQUENCE LOGIC ---
        const moon = document.getElementById('moon');
        const shadow = document.getElementById('eclipse-shadow');
        const corona = document.getElementById('corona');
        const textContainer = document.getElementById('text-container');
        const flash = document.getElementById('flash');
        const ray1 = document.getElementById('rays-bg');
        const ray2 = document.getElementById('rays-fg');

        function showText(text) {
            textContainer.innerHTML = '';
            const el = document.createElement('div');
            el.className = 'phrase';
            el.innerText = text;
            textContainer.appendChild(el);
            void el.offsetWidth;
            el.classList.add('visible');
            playTextImpact(); // Sound effect
            setTimeout(() => { el.classList.remove('visible'); }, 3500);
        }

        setTimeout(() => {
            if(audioCtx) audioCtx.resume();
            
            // Phase 1: Approach (0s - 4s)
            playRumble();
            // Cm Chord
            playChoir([130.81, 155.56, 196.00], 6);
            showText("THE COSMOS ALIGNS");
            
            // Move shadow
            setTimeout(() => {
                shadow.style.left = '50%'; // Center it (Eclipse)
            }, 100);

            // Phase 2: Totality (4s - 9s)
            setTimeout(() => {
                moon.style.backgroundColor = '#000';
                shadow.style.boxShadow = '0 0 10px 2px #fff'; // Diamond ring effect start
                
                // Add more voices (Cm9)
                playChoir([233.08, 293.66, 523.25], 6);
                playChimeCluster();
                
                corona.classList.add('active');
                showText("IN PERFECT SHADOW");
            }, 4000);

            // Phase 3: Revelation (9s - 14s)
            setTimeout(() => {
                ray1.classList.add('active');
                ray2.classList.add('active');
                playAscensionSwell();
                playShakeRumble(); // Shake sound
                document.getElementById('scene').classList.add('shake'); // Screen shake
                showText("DIVINITY AWAKENS");
            }, 9000);

            // Phase 4: Flash (14s)
            setTimeout(() => {
                flash.style.opacity = 1;
                setTimeout(() => {
                    try { window.parent.postMessage('LUNAR_DIVINITY_CUTSCENE_COMPLETE', '*'); } catch(e){}
                }, 1500);
            }, 13500);

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
            title="Lunar Divinity Cutscene"
        />
    );
};
