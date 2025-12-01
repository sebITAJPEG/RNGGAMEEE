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
    <title>Solid Light Cutscene - Digital Construct</title>
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@900&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Share Tech Mono', monospace; }
        
        #scene {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            perspective: 1000px;
            overflow: hidden;
            animation: camera-move 10s ease-in-out infinite alternate;
        }
        
        @keyframes camera-move {
            0% { perspective-origin: 50% 50%; }
            100% { perspective-origin: 50% 40%; }
        }

        /* --- TERMINAL TEXT --- */
        #terminal {
            position: absolute;
            top: 20px; left: 20px;
            color: #0f0;
            font-size: 14px;
            text-shadow: 0 0 5px #0f0;
            opacity: 0.8;
            white-space: pre;
            pointer-events: none;
            z-index: 10;
            mix-blend-mode: screen;
        }

        /* --- MAIN CENTER TEXT --- */
        #center-text {
            position: absolute;
            font-family: 'Orbitron', sans-serif;
            font-size: 5rem;
            color: #fff;
            text-transform: uppercase;
            letter-spacing: 20px;
            opacity: 0;
            transform: scale(0.8) translateZ(50px);
            text-shadow: 0 0 30px rgba(0,255,0,0.8);
            transition: all 0.1s;
            z-index: 20;
            text-align: center;
            width: 100%;
            mix-blend-mode: overlay;
        }

        /* --- GRID --- */
        .grid {
            position: absolute;
            top: 50%; left: 50%;
            width: 400%; height: 400%;
            background-image: 
                linear-gradient(rgba(0, 255, 0, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 0, 0.3) 1px, transparent 1px);
            background-size: 100px 100px;
            transform: translate(-50%, -50%) rotateX(80deg);
            animation: grid-scroll 1s linear infinite;
            mask-image: radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%);
            z-index: 1;
            box-shadow: 0 0 100px #0f0 inset;
        }
        
        @keyframes grid-scroll {
            0% { background-position: 0 0; }
            100% { background-position: 0 100px; }
        }

        /* --- WIREFRAME CUBE --- */
        .cube-container {
            position: relative;
            width: 300px; height: 300px;
            transform-style: preserve-3d;
            animation: rotate-cube 15s linear infinite;
            z-index: 5;
            opacity: 0;
            transition: opacity 0.5s;
        }

        .face {
            position: absolute;
            width: 300px; height: 300px;
            border: 2px solid #0f0;
            background: rgba(0, 255, 0, 0.02);
            box-shadow: 0 0 15px #0f0, inset 0 0 30px rgba(0,255,0,0.1);
            backface-visibility: visible;
        }

        .face.front  { transform: translateZ(150px); }
        .face.back   { transform: rotateY(180deg) translateZ(150px); }
        .face.right  { transform: rotateY(90deg) translateZ(150px); }
        .face.left   { transform: rotateY(-90deg) translateZ(150px); }
        .face.top    { transform: rotateX(90deg) translateZ(150px); }
        .face.bottom { transform: rotateX(-90deg) translateZ(150px); }

        @keyframes rotate-cube {
            0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
            100% { transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg); }
        }

        /* --- SCANNER BAR --- */
        #scan-line {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 20px;
            background: rgba(255, 255, 255, 0.8);
            box-shadow: 0 0 50px #fff;
            z-index: 30;
            display: none;
            animation: scan-down 0.3s cubic-bezier(0.1, 0.8, 0.1, 1) forwards;
            mix-blend-mode: screen;
        }
        
        @keyframes scan-down { 
            from { top: -10%; opacity: 0; } 
            50% { opacity: 1; }
            to { top: 110%; opacity: 0; } 
        }

        /* --- FLASH --- */
        #flash {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: #fff;
            opacity: 0;
            pointer-events: none;
            z-index: 100;
            transition: opacity 2s ease-out;
        }
        
        .glitch {
            animation: glitch-anim 0.1s infinite;
            color: #f00 !important;
            text-shadow: 2px 2px #0f0, -2px -2px #00f !important;
        }
        
        @keyframes glitch-anim {
            0% { transform: translate(0) skew(0deg); }
            20% { transform: translate(-5px, 5px) skew(10deg); }
            40% { transform: translate(-5px, -5px) skew(-10deg); }
            60% { transform: translate(5px, 5px) skew(5deg); }
            80% { transform: translate(5px, -5px) skew(-5deg); }
            100% { transform: translate(0) skew(0deg); }
        }

        /* --- PROGRESS BAR --- */
        #loader {
            position: absolute;
            bottom: 100px;
            width: 400px;
            height: 6px;
            background: #111;
            border: 1px solid #333;
            z-index: 10;
            display: none;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
        #loader-fill {
            height: 100%;
            width: 0%;
            background: #0f0;
            box-shadow: 0 0 20px #0f0;
            transition: width 0.05s linear;
        }
        
        /* Floating Bits */
        .bit {
            position: absolute;
            color: #0f0;
            font-size: 10px;
            opacity: 0.5;
            animation: float-up 2s linear infinite;
        }
        @keyframes float-up {
            from { transform: translateY(0); opacity: 0; }
            50% { opacity: 0.5; }
            to { transform: translateY(-100px); opacity: 0; }
        }

    </style>
</head>
<body>
    <div id="scene">
        <div id="terminal"></div>
        <div id="center-text"></div>
        <div class="grid"></div>
        
        <div class="cube-container" id="cube">
            <div class="face front"></div>
            <div class="face back"></div>
            <div class="face right"></div>
            <div class="face left"></div>
            <div class="face top"></div>
            <div class="face bottom"></div>
        </div>
        
        <div id="loader"><div id="loader-fill"></div></div>
    </div>
    
    <div id="scan-line"></div>
    <div id="flash"></div>

    <script>
        // --- AUDIO ENGINE v2 ---
        let audioCtx;
        let masterGain;
        let reverbNode;

        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioCtx.createGain();
            masterGain.gain.value = 0.5;
            masterGain.connect(audioCtx.destination);
            
            // Reverb (Simple Impulse Response)
            const sampleRate = audioCtx.sampleRate;
            const length = sampleRate * 2.0; // 2 seconds
            const impulse = audioCtx.createBuffer(2, length, sampleRate);
            for (let channel = 0; channel < 2; channel++) {
                const data = impulse.getChannelData(channel);
                for (let i = 0; i < length; i++) {
                    // Exponential decay
                    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
                }
            }
            reverbNode = audioCtx.createConvolver();
            reverbNode.buffer = impulse;
            reverbNode.connect(masterGain);
            
        } catch(e) { console.warn("Audio init failed"); }
        
        function playDataSound() {
            if(!audioCtx) return;
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            // Random digital pitch
            osc.type = Math.random() > 0.5 ? 'square' : 'sawtooth';
            osc.frequency.setValueAtTime(800 + Math.random() * 2000, t);
            
            gain.gain.setValueAtTime(0.05, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05); // Short blip
            
            // Pan randomly
            const panner = audioCtx.createStereoPanner();
            panner.pan.value = Math.random() * 2 - 1;
            
            osc.connect(gain);
            gain.connect(panner);
            panner.connect(masterGain);
            panner.connect(reverbNode); // Add some space
            
            osc.start(t);
            osc.stop(t + 0.05);
        }

        function playDrone() {
            if(!audioCtx) return { stop: ()=>{} };
            const t = audioCtx.currentTime;
            
            // Dual Oscillator Drone for "beating" effect
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc1.type = 'sawtooth';
            osc2.type = 'square';
            
            osc1.frequency.value = 55; // Low A
            osc2.frequency.value = 55.5; // Slight detune
            
            // Lowpass filter sweeping up
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(100, t);
            
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.2, t + 1.0);
            
            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);
            
            osc1.start(t);
            osc2.start(t);
            
            return {
                stop: () => {
                    const stopT = audioCtx.currentTime;
                    gain.gain.linearRampToValueAtTime(0, stopT + 0.5);
                    osc1.stop(stopT + 0.5);
                    osc2.stop(stopT + 0.5);
                },
                setFilter: (val) => {
                    filter.frequency.setTargetAtTime(val, audioCtx.currentTime, 0.1);
                },
                setPitch: (val) => {
                    osc1.frequency.setTargetAtTime(val, audioCtx.currentTime, 0.1);
                    osc2.frequency.setTargetAtTime(val * 1.01, audioCtx.currentTime, 0.1);
                }
            };
        }
        
        function playSuccessChord() {
             if(!audioCtx) return;
             const t = audioCtx.currentTime;
             const freqs = [440, 554.37, 659.25, 880]; // A Major 
             
             freqs.forEach((f, i) => {
                 const osc = audioCtx.createOscillator();
                 const gain = audioCtx.createGain();
                 osc.type = 'sine';
                 osc.frequency.value = f;
                 
                 gain.gain.setValueAtTime(0, t);
                 gain.gain.linearRampToValueAtTime(0.1, t + 0.1 + i*0.05);
                 gain.gain.exponentialRampToValueAtTime(0.001, t + 3.0);
                 
                 osc.connect(gain);
                 gain.connect(masterGain);
                 gain.connect(reverbNode); // Heavy reverb
                 
                 osc.start(t);
                 osc.stop(t + 3.0);
             });
             
             // Impact Noise
             const noise = audioCtx.createBufferSource();
             const buf = audioCtx.createBuffer(1, audioCtx.sampleRate, audioCtx.sampleRate);
             const d = buf.getChannelData(0);
             for(let i=0; i<d.length; i++) d[i] = Math.random()*2-1;
             noise.buffer = buf;
             
             const nGain = audioCtx.createGain();
             nGain.gain.setValueAtTime(0.5, t);
             nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
             
             noise.connect(nGain); nGain.connect(masterGain);
             noise.start(t);
        }

        // --- VISUALS ---
        const terminal = document.getElementById('terminal');
        const scene = document.getElementById('scene');
        
        function createBit() {
            const bit = document.createElement('div');
            bit.className = 'bit';
            bit.innerText = Math.random() > 0.5 ? '1' : '0';
            bit.style.left = Math.random() * 100 + '%';
            bit.style.bottom = '0px';
            scene.appendChild(bit);
            setTimeout(() => bit.remove(), 2000);
        }

        const logs = [
            "INIT_VIRTUAL_ENV...",
            "ALLOCATING_MEMORY_BLOCKS...",
            "RENDERING_GEOMETRY...",
            "CALCULATING_LIGHT_PATHS...",
            "ERROR: LIGHT_HAS_MASS",
            "OVERRIDING_PHYSICS_ENGINE...",
            "COMPILING_SOLID_STATE..."
        ];

        let logIndex = 0;
        function addLog() {
            if(logIndex >= logs.length) return;
            terminal.innerText += "> " + logs[logIndex] + "\\n";
            playDataSound();
            logIndex++;
        }

        // --- SEQUENCE ---
        const centerText = document.getElementById('center-text');
        const cube = document.getElementById('cube');
        const loader = document.getElementById('loader');
        const loaderFill = document.getElementById('loader-fill');
        const scanLine = document.getElementById('scan-line');
        const flash = document.getElementById('flash');
        
        // Start sequence
        setTimeout(() => {
            if(audioCtx) audioCtx.resume();
            
            // Bits loop
            const bitInterval = setInterval(createBit, 100);
            
            // Step 1: Logs
            let logInterval = setInterval(() => {
                addLog();
                if(logIndex >= 3) { // Show cube
                    cube.style.opacity = 1;
                    loader.style.display = 'block';
                }
                if(logIndex >= logs.length) clearInterval(logInterval);
            }, 600);

            // Step 2: Loading
            let progress = 0;
            const drone = playDrone();
            
            let loadInterval = setInterval(() => {
                if(progress < 100) {
                    progress += 1;
                    loaderFill.style.width = progress + '%';
                    
                    // Drone rises
                    drone.setFilter(100 + progress * 50);
                    drone.setPitch(55 + progress * 2);
                    
                    if(progress % 5 === 0) playDataSound();
                    
                    if(progress === 50) {
                        centerText.innerText = "COMPILING...";
                        centerText.style.opacity = 1;
                    }
                    if(progress === 80) {
                        centerText.innerText = "WARNING: OVERLOAD";
                        centerText.style.color = "#f00";
                        centerText.classList.add('glitch');
                        cube.style.borderColor = "#f00";
                        document.querySelectorAll('.face').forEach(f => {
                            f.style.borderColor = '#f00';
                            f.style.backgroundColor = 'rgba(255,0,0,0.1)';
                            f.style.boxShadow = '0 0 30px #f00';
                        });
                        // Intense bits
                        clearInterval(bitInterval);
                        setInterval(createBit, 20);
                    }
                } else {
                    clearInterval(loadInterval);
                    // Step 3: Complete
                    drone.stop();
                    finish();
                }
            }, 50);

        }, 500);

        function finish() {
            centerText.innerText = "SOLID LIGHT";
            centerText.style.color = "white";
            centerText.style.textShadow = "0 0 50px white";
            centerText.classList.remove('glitch');
            centerText.style.transform = "scale(1.2)";
            
            // Force animation reset
            scanLine.style.display = 'none';
            scanLine.offsetHeight; /* trigger reflow */
            scanLine.style.display = 'block';
            
            playSuccessChord();
            
            flash.style.opacity = 1;
            
            setTimeout(() => {
                try {
                    window.parent.postMessage('SOLID_LIGHT_CUTSCENE_COMPLETE', '*');
                } catch(e) {
                    console.error("PostMessage failed", e);
                }
            }, 1000);
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
