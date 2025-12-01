import React, { useMemo } from 'react';

interface Props {
    startSkipped?: boolean;
}

export const CrystallizedThoughtView: React.FC<Props> = ({ startSkipped = false }) => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crystallized Thought - 1 in 1.5 Billion</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            overflow: hidden;
            background-color: #000000;
            font-family: 'Orbitron', sans-serif;
            cursor: crosshair;
        }
        canvas { display: block; }

        /* --- CUTSCENE & UI STYLES --- */
        #intro-screen {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: #000000;
            z-index: 100;
            display: flex; /* Visible by default */
            align-items: center;
            background: radial-gradient(circle at center, #1a051a 0%, #000000 100%);
            justify-content: center;
            padding: 40px;
            box-sizing: border-box;
        }

        #intro-text {
            font-family: 'Cinzel', serif;
            font-size: 42px;
            line-height: 1.2;
            text-align: center;
            max-width: 90%;
            text-transform: uppercase;
            letter-spacing: 6px;
            font-weight: 700;
            opacity: 0;
            transform: scale(1.1);
            filter: blur(8px);
            transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
            color: #e0ccff;
            text-shadow: 0 0 15px rgba(200, 100, 255, 0.6);
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
            25% { transform: translate(-1px, 1px) rotate(-0.2deg); }
            50% { transform: translate(1px, -1px) rotate(0.2deg); }
            75% { transform: translate(-1px, -1px) rotate(0deg); }
            100% { transform: translate(1px, 1px) rotate(0deg); }
        }

        /* Character Animations */
        @keyframes textPulse {
            0% { text-shadow: 0 0 5px currentColor; transform: scale(1); }
            50% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; transform: scale(1.05); }
            100% { text-shadow: 0 0 5px currentColor; transform: scale(1); }
        }

        .char {
            display: inline-block;
            animation: textPulse 3s infinite alternate;
            opacity: 0;
            transform: scale(2) translateY(10px);
            filter: blur(5px);
            transition: all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .char.visible {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0px);
        }

        #flash-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: #fff;
            z-index: 101;
            opacity: 0;
            pointer-events: none;
            display: none;
        }

        /* --- HUD --- */
        #hud {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            padding: 40px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            z-index: 10;
            opacity: 0;
            transition: opacity 3s ease-in;
        }

        .header { text-align: right; }

        h1 {
            font-family: 'Cinzel', serif;
            font-size: 28px;
            margin: 0;
            letter-spacing: 4px;
            font-weight: 700;
            color: #eebbff;
            text-shadow: 0 0 10px rgba(200, 0, 255, 0.4);
        }

        .rarity-tag {
            font-size: 14px;
            color: #cc99ff;
            letter-spacing: 3px;
            opacity: 0.8;
            margin-top: 5px;
            text-transform: uppercase;
            font-weight: 700;
        }

        .controls {
            pointer-events: auto;
            align-self: center; /* Center visualizer at bottom */
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }

        #visualizer {
            width: 300px;
            height: 50px;
            border-bottom: 1px solid rgba(200, 100, 255, 0.3);
            opacity: 0.7;
        }

        #canvas-container {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            /* Deep Purple Gradient Background */
            background: radial-gradient(circle at center, #1a0b1a 0%, #0a000a 60%, #000000 100%);
            opacity: 0;
            transition: opacity 3s ease-in;
        }

        /* Overlay vignette to focus center */
        #vignette {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at center, transparent 30%, #000000 150%);
            pointer-events: none;
            z-index: 1;
        }
    </style>
</head>
<body>
    <!-- CUTSCENE ELEMENTS -->
    <div id="intro-screen">
        <div id="intro-text"></div>
    </div>
    <div id="flash-overlay"></div>

    <!-- MAIN APP -->
    <div id="canvas-container"></div>
    <div id="vignette"></div>

    <div id="hud">
        <div class="header">
            <h1 id="titleText">CRYSTALLIZED THOUGHT</h1>
            <div class="rarity-tag">Neural Resonance: 99.9%</div>
            <div class="rarity-tag" style="font-size: 10px; opacity: 0.6;">1 in 1,500,000,000</div>
        </div>

        <div class="controls">
            <canvas id="visualizer"></canvas>
        </div>
    </div>

    <!-- Import Three.js -->
    <script type="importmap">
        {
            "imports": {
                "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
                "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
            }
        }
    </script>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
        import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

        const startSkipped = ${startSkipped};

        // --- AUDIO ENGINE ---
        class CrystallizedAudio {
            constructor() {
                this.ctx = null;
                this.masterGain = null;
                this.analyser = null;
                this.dataArray = null;
                this.isInitialized = false;
                this.isMusicPlaying = false;
                this.canvas = document.getElementById('visualizer');
                this.canvasCtx = this.canvas.getContext('2d');
                // Arpeggio scale (Pentatonic Minor-ish)
                this.scale = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
                this.nextNoteTime = 0;
            }

            init() {
                if(this.isInitialized) return;
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioContext();

                const compressor = this.ctx.createDynamicsCompressor();
                compressor.threshold.setValueAtTime(-20, this.ctx.currentTime);
                compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
                compressor.connect(this.ctx.destination);

                this.analyser = this.ctx.createAnalyser();
                this.analyser.fftSize = 2048;
                this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.value = 0.5;
                this.masterGain.connect(compressor);
                this.masterGain.connect(this.analyser);

                // Reverb (Convolver)
                this.convolver = this.ctx.createConvolver();
                this.convolver.buffer = this.createImpulseResponse(3.0, 2.0); 
                this.convolverGain = this.ctx.createGain();
                this.convolverGain.gain.value = 0.4;
                this.convolver.connect(this.convolverGain);
                this.convolverGain.connect(this.masterGain);

                this.isInitialized = true;
                this.drawVisualizer();
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

            // SWELLING INTRO SOUND
            playIntroBuildUp(duration) {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                
                const osc = this.ctx.createOscillator();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(55, now);
                osc.frequency.linearRampToValueAtTime(110, now + duration); // Octave rise
                
                const g = this.ctx.createGain();
                g.gain.setValueAtTime(0, now);
                g.gain.linearRampToValueAtTime(0.2, now + duration * 0.5);
                g.gain.linearRampToValueAtTime(0.4, now + duration - 0.5);
                g.gain.linearRampToValueAtTime(0, now + duration); 
                
                // Lowpass filter opening
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(200, now);
                filter.frequency.exponentialRampToValueAtTime(2000, now + duration);
                
                osc.connect(filter);
                filter.connect(g);
                g.connect(this.masterGain);
                g.connect(this.convolver); // Heavy reverb
                osc.start();
                osc.stop(now + duration);
            }

            playTypingSound() {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                // High pitched digital blip
                const osc = this.ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800 + Math.random()*200, now);
                
                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(0.02, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                
                osc.connect(gain); gain.connect(this.masterGain); 
                osc.start(); osc.stop(now + 0.06);
            }

            playResonance() {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;

                // Glassy chime
                const freqs = [440, 554, 659, 880];
                freqs.forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.value = f;
                    
                    const g = this.ctx.createGain();
                    g.gain.setValueAtTime(0, now);
                    g.gain.linearRampToValueAtTime(0.1, now + 0.05);
                    g.gain.exponentialRampToValueAtTime(0.001, now + 4.0 + i);
                    
                    osc.connect(g);
                    g.connect(this.masterGain);
                    g.connect(this.convolver);
                    osc.start();
                    osc.stop(now + 5.0);
                });

                // Deep thud
                const kick = this.ctx.createOscillator();
                kick.frequency.setValueAtTime(100, now);
                kick.frequency.exponentialRampToValueAtTime(0.01, now + 1.0);
                const kGain = this.ctx.createGain();
                kGain.gain.setValueAtTime(0.5, now);
                kGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
                kick.connect(kGain); kGain.connect(this.masterGain);
                kick.start(); kick.stop(now + 1.0);
            }

            startMusic() {
                if(this.isMusicPlaying || !this.isInitialized) return;
                this.isMusicPlaying = true;
                const now = this.ctx.currentTime;

                // Drone Pad
                const drone = this.ctx.createOscillator();
                drone.type = 'triangle';
                drone.frequency.value = 55; // Low A
                const dGain = this.ctx.createGain();
                dGain.gain.value = 0.05;
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass'; filter.frequency.value = 400;
                
                // LFO for drone filter
                const lfo = this.ctx.createOscillator();
                lfo.frequency.value = 0.2;
                const lfoGain = this.ctx.createGain();
                lfoGain.gain.value = 200;
                lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
                
                drone.connect(filter); filter.connect(dGain); dGain.connect(this.masterGain);
                lfo.start(now); drone.start(now);

                this.scheduler();
            }

            playNote(freq, dur, vol, type='sine', pan=0) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const panner = this.ctx.createStereoPanner();
                
                osc.type = type; 
                osc.frequency.value = freq;
                panner.pan.value = pan;
                
                const now = this.ctx.currentTime;
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(vol, now + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
                
                osc.connect(gain); gain.connect(panner);
                panner.connect(this.masterGain); panner.connect(this.convolver);
                osc.start(); osc.stop(now + dur + 1);
            }

            scheduler() {
                if(!this.isMusicPlaying) return;
                requestAnimationFrame(() => this.scheduler());
                const now = this.ctx.currentTime;
                
                if (now >= this.nextNoteTime) {
                    // Random Arpeggio
                    if(Math.random() > 0.2) {
                        const idx = Math.floor(Math.random() * this.scale.length);
                        const pan = (Math.random() - 0.5) * 0.8;
                        this.playNote(this.scale[idx], 2.0, 0.05, 'sine', pan);
                        
                        // Occasionally play a harmony
                        if(Math.random() > 0.6) {
                             setTimeout(() => {
                                 const idx2 = (idx + 2) % this.scale.length;
                                 this.playNote(this.scale[idx2], 2.0, 0.04, 'sine', -pan);
                             }, 150);
                        }
                    }
                    this.nextNoteTime = now + 0.2 + Math.random() * 0.4; // Fast random rhythm
                }
            }

            getAudioData() {
                if (!this.analyser) return { bass: 0, mid: 0, high: 0 };
                this.analyser.getByteFrequencyData(this.dataArray);
                const bass = this.dataArray.slice(0, 5).reduce((a,b)=>a+b,0) / 5 / 255;
                const mid = this.dataArray.slice(10, 50).reduce((a,b)=>a+b,0) / 40 / 255;
                const high = this.dataArray.slice(60, 150).reduce((a,b)=>a+b,0) / 90 / 255;
                return { bass, mid, high };
            }

            drawVisualizer() {
                requestAnimationFrame(() => this.drawVisualizer());
                if (!this.analyser) return;
                const w = this.canvas.width; const h = this.canvas.height;
                const bufferLength = this.analyser.frequencyBinCount;
                this.canvasCtx.clearRect(0, 0, w, h);
                this.canvasCtx.fillStyle = '#cc99ff'; // Light Purple
                const barWidth = (w / bufferLength) * 2.5;
                let barHeight;
                let x = 0;
                for(let i = 0; i < bufferLength; i++) {
                    barHeight = this.dataArray[i] / 2;
                    this.canvasCtx.fillRect(x, h - barHeight, barWidth, barHeight);
                    x += barWidth + 1;
                }
            }
        }

        const audio = new CrystallizedAudio();

        // --- CUTSCENE LOGIC ---
        const phrases = [
            { text: "IN THE DEPTHS OF THE SUBCONSCIOUS...", color: "#a0a0a0" },
            { text: "A PATTERN EMERGES.", color: "#d0b0ff" }, // Light Purple
            { text: "CHAOS ORDERED INTO REASON.", color: "#ffb0e0" }, // Pink
            { text: "A SINGLE MOMENT OF CLARITY.", color: "#b0ffff" }, // Cyan
            { text: "PERFECTLY PRESERVED.", color: "#ffffff" },
            { text: "CRYSTALLIZED THOUGHT", color: "#e0ccff" }
        ];

        const introScreen = document.getElementById('intro-screen');
        const introTextEl = document.getElementById('intro-text');
        const flashOverlay = document.getElementById('flash-overlay');
        const hud = document.getElementById('hud');
        const container = document.getElementById('canvas-container');

        if (startSkipped) {
             introScreen.style.display = 'none';
             flashOverlay.style.display = 'none';
             hud.style.opacity = 1;
             container.style.opacity = 1;
             
             setTimeout(() => {
                 try {
                     audio.init();
                     audio.startMusic();
                 } catch(e) {}
             }, 100);
        } else {
            // Auto-start logic
            setTimeout(() => {
                try {
                    audio.init();
                } catch(e) { console.warn("Audio init failed (likely autoplay policy)", e); }
                playCutscene();
            }, 500);
        }

        async function playCutscene() {
            const totalDuration = phrases.length * 3.0; 
            audio.playIntroBuildUp(totalDuration);

            for (let i = 0; i < phrases.length; i++) {
                const phrase = phrases[i];
                introTextEl.classList.remove('visible');
                
                if(i > 0) await new Promise(r => setTimeout(r, 600));
                
                introTextEl.innerHTML = '';
                introTextEl.classList.add('visible');
                
                const text = phrase.text;
                
                for(let c=0; c < text.length; c++) {
                    const char = text[c];
                    const span = document.createElement('span');
                    if (char === ' ') {
                        span.style.width = '10px';
                        span.style.display = 'inline-block';
                    } else {
                        span.textContent = char;
                        span.className = 'char';
                        span.style.color = phrase.color;
                        span.style.textShadow = \`0 0 10px \${phrase.color}\`;
                    }
                    introTextEl.appendChild(span);
                    
                    requestAnimationFrame(() => span.classList.add('visible'));
                    audio.playTypingSound();
                    await new Promise(r => setTimeout(r, 40));
                }
                
                if (i > 3) introScreen.classList.add('shake-screen');
                await new Promise(r => setTimeout(r, 1500));
                introTextEl.classList.remove('visible');
            }

            await new Promise(r => setTimeout(r, 800));

            // TRANSITION
            audio.playResonance();
            flashOverlay.style.display = 'block';
            
            requestAnimationFrame(() => {
                flashOverlay.style.opacity = 1;
                
                setTimeout(() => {
                    introScreen.style.display = 'none';
                    flashOverlay.style.transition = 'opacity 3.0s ease-out';
                    flashOverlay.style.opacity = 0;
                    hud.style.opacity = 1;
                    container.style.opacity = 1;

                    audio.startMusic();
                    controls.autoRotate = true; // Start rotation after intro
                    
                    setTimeout(() => flashOverlay.style.display = 'none', 3000);
                }, 100);
            });
        }

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        // Background handled by CSS
        
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 14);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.dampingFactor = 0.05;
        controls.autoRotate = startSkipped; // Enable if skipped
        controls.autoRotateSpeed = 1.0;

        // --- ENVIRONMENT (HDRI) ---
        new RGBELoader()
            .load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/moonless_golf_1k.hdr', function (texture) {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                scene.environment = texture; 
            });

        // --- 1. THE CORE (NEURAL NETWORK) ---
        const pointCount = 100;
        const radius = 1.5;
        const points = [];
        
        for(let i=0; i<pointCount; i++) {
            const vec = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize().multiplyScalar(Math.random() * radius);
            points.push(vec);
        }

        const linePositions = [];
        const lineProgress = []; 

        for(let i=0; i<pointCount; i++) {
            const p1 = points[i];
            const others = points.map((p, idx) => ({ idx, dist: p.distanceTo(p1) }))
                                 .filter(o => o.dist > 0) 
                                 .sort((a, b) => a.dist - b.dist)
                                 .slice(0, 3); 

            others.forEach(o => {
                const p2 = points[o.idx];
                linePositions.push(p1.x, p1.y, p1.z);
                linePositions.push(p2.x, p2.y, p2.z);
                lineProgress.push(0.0);
                lineProgress.push(1.0);
            });
        }

        const networkGeo = new THREE.BufferGeometry();
        networkGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        networkGeo.setAttribute('aProgress', new THREE.Float32BufferAttribute(lineProgress, 1));

        const networkMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uAudioHigh: { value: 0 }
            },
            vertexShader: \`
                attribute float aProgress;
                varying float vProgress;
                void main() {
                    vProgress = aProgress;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            \`,
            fragmentShader: \`
                uniform float uTime;
                uniform float uAudioHigh;
                varying float vProgress;

                void main() {
                    // Neural pulse moving along lines
                    float speed = 4.0 + uAudioHigh * 10.0;
                    float wave = sin(vProgress * 20.0 - uTime * speed);
                    float pulse = smoothstep(0.8, 1.0, wave);
                    
                    vec3 col1 = vec3(0.0, 0.8, 1.0); // Cyan
                    vec3 col2 = vec3(0.8, 0.2, 1.0); // Magenta
                    
                    vec3 color = mix(col1, col2, sin(uTime + vProgress * 5.0) * 0.5 + 0.5);
                    
                    // Bright flash on pulse
                    color = mix(color, vec3(1.0), pulse * (0.8 + uAudioHigh));
                    
                    float alpha = 0.1 + pulse;
                    gl_FragColor = vec4(color, alpha);
                }
            \`,
            transparent: true,
            depthWrite: false, 
            blending: THREE.AdditiveBlending
        });

        const network = new THREE.LineSegments(networkGeo, networkMat);
        scene.add(network);

        // --- 2. THE SHELL (CRYSTAL MIND) ---
        const shellGeo = new THREE.IcosahedronGeometry(1.8, 0); 
        const shellMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            roughness: 0.0,
            metalness: 0.1,
            transmission: 1.0,  
            thickness: 2.0,     
            iridescence: 1.0,   
            iridescenceIOR: 1.33,
            side: THREE.DoubleSide,
            transparent: true
        });
        const shell = new THREE.Mesh(shellGeo, shellMat);
        scene.add(shell);

        // --- 3. AMBIENT RINGS (NEW) ---
        const ringGeo = new THREE.TorusGeometry(3.0, 0.02, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ 
            color: 0xcc99ff, 
            transparent: true, 
            opacity: 0.2, 
            blending: THREE.AdditiveBlending 
        });

        const rings = [];
        for(let i=0; i<5; i++) {
            const r = 3.0 + i * 0.5;
            const mesh = new THREE.Mesh(new THREE.TorusGeometry(r, 0.02 - i*0.002, 16, 100), ringMat);
            scene.add(mesh);
            rings.push({ mesh, speedX: Math.random()*0.2, speedY: Math.random()*0.2 });
        }

        // --- 4. THE AURA (FLOATING RUNES) ---
        const runeCount = 1500; 
        const runeGeo = new THREE.TetrahedronGeometry(0.03, 0);
        const runeMat = new THREE.MeshBasicMaterial({ color: 0xcc99ff, wireframe: true });
        const runes = new THREE.InstancedMesh(runeGeo, runeMat, runeCount);
        scene.add(runes);

        const runeData = [];
        const dummy = new THREE.Object3D();

        for(let i=0; i<runeCount; i++) {
            runeData.push({
                offset: Math.random() * Math.PI * 2,
                speed: (Math.random() - 0.5) * 0.2,
                radius: 2.5 + Math.random() * 30.0,
                height: (Math.random() - 0.5) * 40.0
            });
        }

        // --- 5. POST PROCESSING ---
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.8, 
            0.8, 
            0.1  
        );
        composer.addPass(bloomPass);

        const rgbShiftShader = {
            uniforms: {
                tDiffuse: { value: null },
                amount: { value: 0.0025 },
                uTime: { value: 0 }
            },
            vertexShader: \`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            \`,
            fragmentShader: \`
                uniform sampler2D tDiffuse;
                uniform float amount;
                uniform float uTime;
                varying vec2 vUv;
                
                float random(vec2 uv) { return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453); }

                void main() {
                    vec2 dist = vUv - 0.5;
                    float len = length(dist);
                    // Pulsating shift
                    float pulsate = sin(uTime) * 0.5 + 1.0; 
                    vec2 offset = dist * amount * pulsate * len * 2.0;
                    
                    float r = texture2D(tDiffuse, vUv + offset).r;
                    float g = texture2D(tDiffuse, vUv).g;
                    float b = texture2D(tDiffuse, vUv - offset).b;
                    
                    // Grain
                    float noise = random(vUv + uTime);
                    vec3 col = vec3(r, g, b) + (noise - 0.5) * 0.03;
                    
                    gl_FragColor = vec4(col, 1.0);
                }
            \`
        };
        const rgbShiftPass = new ShaderPass(rgbShiftShader);
        composer.addPass(rgbShiftPass);

        // --- ANIMATION LOOP ---
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            const { bass, mid, high } = audio.getAudioData();

            // Rotate Shell
            shell.rotation.y = time * 0.1 + (bass * 0.2);
            shell.rotation.z = time * 0.05;
            
            // Pulse shell scale with bass
            const shellScale = 1.0 + bass * 0.1;
            shell.scale.setScalar(shellScale);

            // Rotate Network
            network.rotation.y = -time * 0.15;
            network.rotation.x = Math.sin(time * 0.2) * 0.1;

            // Rotate Rings
            rings.forEach((ring, i) => {
                const mult = i % 2 === 0 ? 1 : -1;
                ring.mesh.rotation.x = time * 0.1 * mult * (i+1);
                ring.mesh.rotation.y = time * 0.05 * mult;
            });

            // Update Shader Pulse
            networkMat.uniforms.uTime.value = time;
            networkMat.uniforms.uAudioHigh.value = high;
            
            rgbShiftPass.uniforms.uTime.value = time;
            rgbShiftPass.uniforms.amount.value = 0.002 + bass * 0.005;

            // Animate Runes
            for(let i=0; i<runeCount; i++) {
                const d = runeData[i];
                const angle = time * d.speed + d.offset;
                const r = d.radius + Math.sin(time + i) * (bass * 2.0); // Expand with bass
                
                const x = Math.cos(angle) * r;
                const z = Math.sin(angle) * r;
                const y = d.height + Math.sin(time * 0.5 + d.offset) * 1.0; 

                dummy.position.set(x, y, z);
                dummy.rotation.set(time + i, time * 2, 0);
                dummy.scale.setScalar(1.0 + Math.sin(time * 3 + i)*0.2 + high); 

                dummy.updateMatrix();
                runes.setMatrixAt(i, dummy.matrix);
            }
            runes.instanceMatrix.needsUpdate = true;

            controls.update();
            composer.render();
        }

        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            composer.setSize(width, height);
        });
        
        // Interaction
        window.addEventListener('mousedown', () => {
             if(audio.isInitialized && audio.isMusicPlaying) {
                 audio.playTypingSound(); // Small feedback
             }
        });

        animate();
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
            title="Crystallized Thought"
        />
    );
};
