import React, { useMemo } from 'react';

export const BlackHoleCoreHTMLView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Black Hole Core</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Orbitron', sans-serif; }
        canvas { display: block; }

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

        /* --- HUD --- */
        #hud {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            opacity: 0;
            transition: opacity 2s ease-in;
        }
        
        .header {
            max-width: 600px;
        }
        
        .header h1 {
            margin: 0;
            font-size: 2.5rem;
            color: #ffcc88;
            text-shadow: 0 0 20px #ff6600;
            letter-spacing: 5px;
        }
        
        .rarity {
            font-size: 1rem;
            color: #ffaa44;
            letter-spacing: 3px;
            margin-top: 5px;
            text-transform: uppercase;
        }
        
        .description {
            margin-top: 15px;
            font-size: 0.85rem;
            color: #ccc;
            line-height: 1.5;
            font-family: 'Orbitron', sans-serif;
            text-shadow: 0 0 5px rgba(0,0,0,0.8);
            background: rgba(0,0,0,0.5);
            padding: 10px;
            border-left: 2px solid #ffaa44;
        }
        
        .warning {
            color: #ff3300;
            font-size: 0.8rem;
            animation: blink 1s infinite;
            font-weight: bold;
            letter-spacing: 2px;
        }
        
        @keyframes blink { 50% { opacity: 0; } }

        #canvas-wrapper {
            opacity: 0;
            transition: opacity 1s ease-in;
        }
    </style>
    <script type="importmap">
        {
            "imports": {
                "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
                "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
            }
        }
    </script>
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

    <div id="canvas-wrapper"></div>
    
    <div id="hud">
        <div class="header">
            <h1>BLACK HOLE CORE</h1>
            <div class="rarity">1 in 400,000,000</div>
            <div class="description">
                A tear in the fabric of spacetime. Infinite density compressed into zero volume.
                The ultimate consumer of light, time, and reality itself.
            </div>
        </div>
        <div style="text-align: right; color: #888;">
            <div class="warning">GRAVITATIONAL CRITICALITY</div>
            <div style="margin-top:5px; font-size: 0.8rem;">MASS: ∞ &bull; RADIUS: 0</div>
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

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
                
                // Huge Space Reverb
                this.convolver = this.ctx.createConvolver();
                this.convolver.buffer = this.createImpulseResponse(5.0, 3.0);
                this.verbGain = this.ctx.createGain();
                this.verbGain.gain.value = 0.7;
                this.convolver.connect(this.verbGain);
                this.verbGain.connect(this.masterGain);
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
            
            playRumble() {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                // Deep Sub-bass Drone
                const osc = this.ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.value = 40;
                
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 60;
                
                // LFO for throbbing
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
            
            playSinging() {
                // Ethereal "Singing" - bowed metal sound
                if(!this.ctx) return;
                
                const playNote = () => {
                    const now = this.ctx.currentTime;
                    const osc = this.ctx.createOscillator();
                    osc.type = 'triangle';
                    // Harmonic series based on low C
                    const harmonics = [130.81, 196.00, 261.63, 329.63, 392.00]; 
                    osc.frequency.value = harmonics[Math.floor(Math.random() * harmonics.length)];
                    
                    const g = this.ctx.createGain();
                    g.gain.setValueAtTime(0, now);
                    g.gain.linearRampToValueAtTime(0.05, now + 2.0); // Slow attack
                    g.gain.exponentialRampToValueAtTime(0.001, now + 8.0); // Long tail
                    
                    osc.connect(g); g.connect(this.convolver);
                    osc.start(); osc.stop(now + 9.0);
                    
                    setTimeout(playNote, 4000 + Math.random() * 4000);
                };
                playNote();
            }
            
            playTextGlitch() {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100 + Math.random()*500, now);
                
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'highpass';
                filter.frequency.value = 2000;
                
                const g = this.ctx.createGain();
                g.gain.setValueAtTime(0.1, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                
                osc.connect(filter); filter.connect(g); g.connect(this.masterGain);
                osc.start(); osc.stop(now + 0.1);
            }

            playImplosion() {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                
                // Reverse suction (Riser)
                const osc = this.ctx.createOscillator();
                osc.frequency.setValueAtTime(50, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 2.0); // Pitch up
                
                const g = this.ctx.createGain();
                g.gain.setValueAtTime(0, now);
                g.gain.linearRampToValueAtTime(0.8, now + 1.9);
                g.gain.linearRampToValueAtTime(0, now + 2.0); // Silence before drop
                
                osc.connect(g); g.connect(this.masterGain); g.connect(this.convolver);
                osc.start(); osc.stop(now + 2.0);
                
                // THE DROP (Low impact)
                const kick = this.ctx.createOscillator();
                kick.frequency.setValueAtTime(100, now + 2.1);
                kick.frequency.exponentialRampToValueAtTime(0.01, now + 4.0);
                const kGain = this.ctx.createGain();
                kGain.gain.setValueAtTime(1.0, now + 2.1);
                kGain.gain.exponentialRampToValueAtTime(0.001, now + 4.0);
                
                // Add noise burst
                const bufferSize = this.ctx.sampleRate * 0.5;
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for(let i=0; i<bufferSize; i++) data[i] = Math.random() * 2 - 1;
                const noise = this.ctx.createBufferSource();
                noise.buffer = buffer;
                const nGain = this.ctx.createGain();
                nGain.gain.setValueAtTime(0.5, now + 2.1);
                nGain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);
                
                kick.connect(kGain); kGain.connect(this.masterGain);
                noise.connect(nGain); nGain.connect(this.masterGain);
                
                kick.start(now + 2.1); kick.stop(now + 4.0);
                noise.start(now + 2.1);
            }
        }
        
        let lastOut = 0; // for pink noise
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
        const canvasWrapper = document.getElementById('canvas-wrapper');
        const hud = document.getElementById('hud');
        const dataStream = document.getElementById('data-stream');

        // Start Data Stream
        const streamInterval = setInterval(() => {
            let txt = "";
            for(let i=0; i<6; i++) {
                txt += \`0x\${Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6,'0')} // \${Math.random().toFixed(4)} <br>\`;
            }
            if(dataStream) dataStream.innerHTML = txt;
        }, 100);

        setTimeout(() => {
            try{ audio.init(); }catch(e){}
            playCutscene();
        }, 100);

        async function playCutscene() {
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
            }, 3000); // Contract when "Reality is bending"

            for(let i=0; i<phrases.length; i++) {
                const phrase = phrases[i];
                introText.innerHTML = ''; // Clear previous
                
                // Create chars
                for(let c=0; c<phrase.length; c++) {
                    const span = document.createElement('span');
                    span.textContent = phrase[c];
                    span.className = 'char';
                    if(phrase[c] === ' ') span.style.width = '15px';
                    introText.appendChild(span);
                }
                
                // Animate chars in
                const chars = introText.querySelectorAll('.char');
                for(let c=0; c<chars.length; c++) {
                    setTimeout(() => {
                        chars[c].classList.add('visible');
                        if (Math.random() > 0.7) audio.playTextGlitch();
                    }, c * 30); // Fast typing
                }
                
                // Add distortion for later phrases
                if(i > 2) {
                    setTimeout(() => {
                        introText.querySelectorAll('.char').forEach(c => c.classList.add('glitch'));
                        audio.playTextGlitch(); // Extra glitch sound
                    }, phrase.length * 30 + 200);
                }
                
                await new Promise(r => setTimeout(r, 1500 + phrase.length * 30));
                
                // Fade out
                introText.querySelectorAll('.char').forEach(c => c.classList.remove('visible'));
                await new Promise(r => setTimeout(r, 300));
            }
            
            // Implosion
            audio.playImplosion();
            
            // Animate overlay growing to fill screen (swallowing)
            overlay.style.transition = 'width 0.2s ease-in, height 0.2s ease-in';
            overlay.style.width = '300vw';
            overlay.style.height = '300vw';
            
            await new Promise(r => setTimeout(r, 300));
            
            introScreen.style.display = 'none';
            overlay.style.display = 'none';
            clearInterval(streamInterval);
            canvasWrapper.style.opacity = 1;
            hud.style.opacity = 1;
            
            audio.playSinging();
        }

        // --- SCENE ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 2, 6);
        
        const renderer = new THREE.WebGLRenderer({ antialias: false }); // False for grit
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ReinhardToneMapping;
        document.getElementById('canvas-wrapper').appendChild(renderer.domElement);
        
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2.0;
        controls.minDistance = 4.0;
        controls.maxDistance = 15.0; // Limit zoom out

        // --- BLACK HOLE SHADERS ---
        
        // Jet Shader (Relativistic Beams - Thin & Intense)
        const jetVertex = \`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        \`;
        
        const jetFragment = \`
            uniform float uTime;
            varying vec2 vUv;
            
            // Simplex Noise (Inline)
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v - i + dot(i, C.xx);
                vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = mod289(i);
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m*m ; m = m*m ;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                vec3 g; g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            void main() {
                float flow = snoise(vec2(vUv.x * 20.0, vUv.y * 5.0 - uTime * 12.0));
                
                // Fade at edges
                float alpha = smoothstep(0.0, 0.4, vUv.x) * smoothstep(1.0, 0.6, vUv.x);
                alpha *= smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
                
                float core = smoothstep(0.4, 0.6, alpha);
                
                // Blue/Purple Energy
                vec3 col = mix(vec3(0.5, 0.0, 1.0), vec3(0.5, 0.8, 1.0), flow);
                col += vec3(1.0) * core * 3.0; // Blinding core
                
                gl_FragColor = vec4(col, alpha * (0.2 + flow * 0.3));
            }
        \`;

        // Accretion Disk Shader - Golden Vortex
        const diskVertex = \`
            varying vec2 vUv;
            varying vec3 vPos;
            void main() {
                vUv = uv;
                vPos = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        \`;
        
        const diskFragment = \`
            uniform float uTime;
            varying vec2 vUv;
            
            // Simplex Noise
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v - i + dot(i, C.xx);
                vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = mod289(i);
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m*m ; m = m*m ;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                vec3 g; g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            void main() {
                vec2 centered = vUv - 0.5;
                float r = length(centered) * 2.0;
                float a = atan(centered.y, centered.x);
                
                // Define horizon (Larger gap for core visibility)
                if(r < 0.38 || r > 1.0) discard;
                
                // Complex swirling vortex
                float spiral = a + r * 15.0 - uTime * 4.0;
                float noise1 = snoise(vec2(r * 5.0, spiral));
                float noise2 = snoise(vec2(r * 20.0 - uTime * 2.5, a * 6.0));
                
                // Layer noise
                float noise = noise1 * 0.6 + noise2 * 0.4;
                
                // GOLDEN HEAT MAP
                // Inner = White, Mid = Gold/Orange, Outer = Deep Red/Black
                float heat = 1.0 - smoothstep(0.38, 0.95, r); 
                heat += noise * 0.25;
                
                vec3 col;
                if(heat > 0.8) col = mix(vec3(1.0, 0.8, 0.4), vec3(1.0, 1.0, 1.0), (heat-0.8)*5.0); // Gold to White
                else if(heat > 0.5) col = mix(vec3(1.0, 0.3, 0.0), vec3(1.0, 0.8, 0.4), (heat-0.5)*3.3); // Orange to Gold
                else if(heat > 0.2) col = mix(vec3(0.3, 0.0, 0.0), vec3(1.0, 0.3, 0.0), (heat-0.2)*3.3); // Red to Orange
                else col = mix(vec3(0.0, 0.0, 0.0), vec3(0.3, 0.0, 0.0), heat*5.0); // Black to Red
                
                // Bright streaks
                float streaks = smoothstep(0.65, 0.9, noise);
                col += vec3(1.0, 0.9, 0.7) * streaks * heat * 3.0; // Intense sparkles
                
                // Opacity fade at edges
                float alpha = smoothstep(0.0, 0.1, noise + 0.2);
                alpha *= smoothstep(1.0, 0.7, r) * smoothstep(0.38, 0.48, r);
                
                gl_FragColor = vec4(col * 2.0, alpha); 
            }
        \`;

        // --- GEOMETRY ---
        
        const blackHoleGroup = new THREE.Group();
        scene.add(blackHoleGroup);

        // 1. Event Horizon (Black Sphere)
        const blackHoleGeo = new THREE.SphereGeometry(1.4, 64, 64);
        const blackHoleMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const blackHole = new THREE.Mesh(blackHoleGeo, blackHoleMat);
        blackHoleGroup.add(blackHole);
        
        // 2. Gravitational Lensing Halo (Replacement for Photon Ring)
        // A shader-based ring that simulates light bending and chromatic distortion
        const haloGeo = new THREE.PlaneGeometry(4.5, 4.5);
        const haloMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexShader: \`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            \`,
            fragmentShader: \`
                uniform float uTime;
                varying vec2 vUv;
                
                void main() {
                    vec2 center = vUv - 0.5;
                    float r = length(center) * 2.0;
                    
                    // Thin sharp ring at the event horizon limit
                    float ring = 1.0 - smoothstep(0.0, 0.02, abs(r - 0.63));
                    
                    // "Boiling" noise
                    float angle = atan(center.y, center.x);
                    float noise = sin(angle * 20.0 + uTime * 5.0) * sin(r * 50.0 - uTime * 10.0);
                    
                    ring *= (0.8 + 0.2 * noise);
                    
                    // Chromatic Aberration
                    vec3 col = vec3(ring);
                    col.r *= 1.0 + ring; 
                    col.b *= 0.5 + ring * 0.5;
                    
                    // Outer glow
                    float glow = 1.0 / (r * r * 20.0);
                    glow *= smoothstep(0.63, 1.0, r); 
                    
                    col += vec3(glow * 0.2, glow * 0.1, glow * 0.05); // Gold tint
                    
                    gl_FragColor = vec4(col, ring + glow);
                }
            \`
        });
        const photonRing = new THREE.Mesh(haloGeo, haloMat);
        scene.add(photonRing);

        // 3. Accretion Disk (Multiple layers for volume)
        const diskGeo = new THREE.PlaneGeometry(9, 9, 128, 128);
        const diskMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: diskVertex,
            fragmentShader: diskFragment,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const disk1 = new THREE.Mesh(diskGeo, diskMat);
        blackHoleGroup.add(disk1);
        
        const disk2 = new THREE.Mesh(diskGeo, diskMat.clone());
        disk2.rotation.y = Math.PI; // Flip
        disk2.position.y = 0.05; // Slight offset for thickness
        blackHoleGroup.add(disk2);

        // 4. Relativistic Jets (Thinner)
        const jetGeo = new THREE.CylinderGeometry(0.1, 0.8, 14, 32, 10, true);
        const jetMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: jetVertex,
            fragmentShader: jetFragment,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const jetTop = new THREE.Mesh(jetGeo, jetMat);
        jetTop.position.y = 7;
        blackHoleGroup.add(jetTop);
        
        const jetBottom = new THREE.Mesh(jetGeo, jetMat);
        jetBottom.position.y = -7;
        jetBottom.rotation.x = Math.PI;
        blackHoleGroup.add(jetBottom);

        // 6. Starfield Background (More stars)
        const starsGeo = new THREE.BufferGeometry();
        const starCount = 5000;
        const starPos = new Float32Array(starCount * 3);
        for(let i=0; i<starCount*3; i++) starPos[i] = (Math.random() - 0.5) * 200;
        starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starsMat = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.12 });
        const starSystem = new THREE.Points(starsGeo, starsMat);
        scene.add(starSystem);

        // 7. Nebula Clouds (Subtle Background)
        const cloudGeo = new THREE.SphereGeometry(60, 32, 32);
        const cloudMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            side: THREE.BackSide,
            transparent: true,
            depthWrite: false,
            vertexShader: \`
                varying vec3 vWorldPos;
                void main() {
                    vWorldPos = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            \`,
            fragmentShader: \`
                uniform float uTime;
                varying vec3 vWorldPos;
                float hash(float n) { return fract(sin(n) * 43758.5453123); }
                float noise(vec3 x) {
                    vec3 p = floor(x); vec3 f = fract(x);
                    f = f * f * (3.0 - 2.0 * f);
                    float n = p.x + p.y * 57.0 + 113.0 * p.z;
                    return mix(mix(mix(hash(n+0.0), hash(n+1.0),f.x), mix(hash(n+57.0), hash(n+58.0),f.x),f.y),
                               mix(mix(hash(n+113.0), hash(n+114.0),f.x), mix(hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
                }
                void main() {
                    vec3 p = normalize(vWorldPos) * 2.0;
                    float n = noise(p + uTime * 0.02);
                    float intensity = smoothstep(0.4, 0.7, n) * 0.15; // Lower intensity
                    vec3 col = mix(vec3(0.05, 0.0, 0.1), vec3(0.1, 0.05, 0.0), n); // Dark Violet/Red
                    gl_FragColor = vec4(col, intensity);
                }
            \`
        });
        const nebula = new THREE.Mesh(cloudGeo, cloudMat);
        scene.add(nebula);

        // 8. Volumetric Disk Particles (Sparkling Ring)
        const sparkCount = 3000;
        const sparkGeo = new THREE.BufferGeometry();
        const sparkPos = new Float32Array(sparkCount * 3);
        const sparkData = []; // Store angle/radius for animation
        
        for(let i=0; i<sparkCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            // Distribution concentrated in disk
            const r = 2.0 + Math.pow(Math.random(), 2.0) * 6.0; 
            const y = (Math.random() - 0.5) * (0.2 + (r * 0.05)); // Thicker at edges
            
            sparkPos[i*3] = Math.cos(angle) * r;
            sparkPos[i*3+1] = y;
            sparkPos[i*3+2] = Math.sin(angle) * r;
            
            sparkData.push({ angle, r, y, speed: (3.0 / (r*r)) * 0.05 });
        }
        sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
        const sparkMat = new THREE.PointsMaterial({
            color: 0xffcc88, // Golden sparks
            size: 0.03,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const sparkSystem = new THREE.Points(sparkGeo, sparkMat);
        blackHoleGroup.add(sparkSystem);

        // 9. Magnetic Field Lines
        const linesGroup = new THREE.Group();
        blackHoleGroup.add(linesGroup);
        const lineMat = new THREE.LineBasicMaterial({ color: 0xaa44ff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
        
        for(let i=0; i<12; i++) {
            const points = [];
            const radius = 2.0 + Math.random() * 4.0;
            const height = 4.0 + Math.random() * 4.0;
            
            for(let j=0; j<=50; j++) {
                const t = j / 50;
                const angle = t * Math.PI * 2;
                const x = Math.cos(angle * 2.0) * (radius * (1.0 - Math.abs(t-0.5))); 
                const z = Math.sin(angle * 2.0) * (radius * (1.0 - Math.abs(t-0.5)));
                const y = (t - 0.5) * height * 2.0;
                points.push(new THREE.Vector3(x, y, z));
            }
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMat);
            line.rotation.y = (i / 12) * Math.PI * 2;
            linesGroup.add(line);
        }

        // 10. Plasma Arcs (Dynamic Electric Bolts)
        const arcsGroup = new THREE.Group();
        blackHoleGroup.add(arcsGroup);
        const arcCount = 5;
        const arcMeshes = [];
        
        for(let i=0; i<arcCount; i++) {
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(2, 2, 0),
                new THREE.Vector3(4, 0, 0)
            ]);
            const pts = curve.getPoints(20);
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
            const mesh = new THREE.Line(geo, mat);
            arcsGroup.add(mesh);
            arcMeshes.push({ mesh, offset: Math.random() * 100, speed: 0.5 + Math.random() });
        }

        // 11. Foreground Dust (Parallax Depth)
        const fgDustGeo = new THREE.BufferGeometry();
        const fgDustCount = 500;
        const fgDustPos = new Float32Array(fgDustCount * 3);
        for(let i=0; i<fgDustCount*3; i++) fgDustPos[i] = (Math.random() - 0.5) * 40;
        fgDustGeo.setAttribute('position', new THREE.BufferAttribute(fgDustPos, 3));
        const fgDustMat = new THREE.PointsMaterial({ color: 0x8888aa, size: 0.05, transparent: true, opacity: 0.4 });
        const fgDustSystem = new THREE.Points(fgDustGeo, fgDustMat);
        scene.add(fgDustSystem);

        // 12. Shooting Stars (Background Ambience)
        const shooterGeo = new THREE.BufferGeometry();
        const shooterCount = 20;
        const shooterPos = new Float32Array(shooterCount * 3);
        const shooterVel = [];
        for(let i=0; i<shooterCount; i++) {
            shooterPos[i*3] = (Math.random()-0.5) * 200;
            shooterPos[i*3+1] = (Math.random()-0.5) * 200;
            shooterPos[i*3+2] = (Math.random()-0.5) * 100 - 50; // Far back
            shooterVel.push(new THREE.Vector3((Math.random()-0.5), (Math.random()-0.5), 0).normalize().multiplyScalar(0.5 + Math.random()));
        }
        shooterGeo.setAttribute('position', new THREE.BufferAttribute(shooterPos, 3));
        const shooterMat = new THREE.PointsMaterial({ color: 0xccffff, size: 0.3, transparent: true, opacity: 0.6 });
        const shooterSystem = new THREE.Points(shooterGeo, shooterMat);
        scene.add(shooterSystem);

        // Tilt the whole system
        blackHoleGroup.rotation.x = 0.4;
        blackHoleGroup.rotation.z = 0.2;

        // --- POST PROCESSING ---
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.0, // strength
            0.6, // radius
            0.2  // threshold
        );
        composer.addPass(bloomPass);

        const clock = new THREE.Clock();
        const _tempMat = new THREE.Matrix4();
        const _rotMat = new THREE.Matrix4();
        const _euler = new THREE.Euler();
        const _pos = new THREE.Vector3();
        const _quat = new THREE.Quaternion();
        const _scale = new THREE.Vector3();

        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            
            diskMat.uniforms.uTime.value = time;
            jetMat.uniforms.uTime.value = time;
            
            // Update Halo Shader
            haloMat.uniforms.uTime.value = time;
            // Face halo to camera
            photonRing.lookAt(camera.position);
            
            // Animate Sparks (Volumetric Disk)
            const sPos = sparkSystem.geometry.attributes.position.array;
            for(let i=0; i<sparkCount; i++) {
                const d = sparkData[i];
                d.angle += d.speed;
                sPos[i*3] = Math.cos(d.angle) * d.r;
                sPos[i*3+2] = Math.sin(d.angle) * d.r;
            }
            sparkSystem.geometry.attributes.position.needsUpdate = true;
            
            // Pulse Nebula
            cloudMat.uniforms.uTime.value = time;
            
            // Rotate Magnetic Lines
            linesGroup.rotation.y += 0.005;
            
            // Animate Plasma Arcs
            arcMeshes.forEach((data, i) => {
                const t = (time * data.speed + data.offset);
                const positions = data.mesh.geometry.attributes.position.array;
                
                // Random walk lightning
                const r = 2.5 + Math.sin(t) * 0.5;
                const theta = t * 2.0 + (i * (Math.PI*2/arcCount));
                
                // Start on disk
                const x1 = Math.cos(theta) * r;
                const z1 = Math.sin(theta) * r;
                
                // End near pole (jet)
                const x2 = Math.cos(theta + 1.0) * 0.5;
                const z2 = Math.sin(theta + 1.0) * 0.5;
                const y2 = (i % 2 === 0 ? 1 : -1) * (4.0 + Math.sin(t*3)*2);
                
                // Midpoint jitter
                const xm = (x1+x2)/2 + (Math.random()-0.5);
                const ym = y2/2 + (Math.random()-0.5);
                const zm = (z1+z2)/2 + (Math.random()-0.5);
                
                // Update line points manually (3 points: start, mid, end)
                // For smoother curves we'd need to re-sample curve, but simple jagged lines look more like electricity
                // Let's just do a simple 3-segment bolt
                positions[0] = x1; positions[1] = 0; positions[2] = z1;
                positions[3] = xm; positions[4] = ym; positions[5] = zm;
                positions[6] = x2; positions[7] = y2; positions[8] = z2;
                
                // Randomly flicker visibility
                data.mesh.material.opacity = Math.random() > 0.7 ? 0.8 : 0.0;
                
                data.mesh.geometry.attributes.position.needsUpdate = true;
            });
            
            // Animate Foreground Dust
            fgDustSystem.rotation.y = time * 0.02;
            fgDustSystem.rotation.x = time * 0.01;

            // Animate Shooting Stars
            const sStars = shooterSystem.geometry.attributes.position.array;
            for(let i=0; i<shooterCount; i++) {
                sStars[i*3] += shooterVel[i].x;
                sStars[i*3+1] += shooterVel[i].y;
                
                // Reset if out of bounds
                if(Math.abs(sStars[i*3]) > 120 || Math.abs(sStars[i*3+1]) > 120) {
                    sStars[i*3] = (Math.random()-0.5) * 200;
                    sStars[i*3+1] = (Math.random()-0.5) * 200;
                }
            }
            shooterSystem.geometry.attributes.position.needsUpdate = true;
            
            // Random Nebula Lightning
            if(Math.random() > 0.98) {
                cloudMat.uniforms.uTime.value += 1.0; // Sharp jump for flicker
            } else {
                cloudMat.uniforms.uTime.value = time;
            }
            
            // Flicker light
            bloomPass.strength = 1.0 + Math.sin(time * 15.0) * 0.1 + (Math.random() * 0.1);

            controls.update();
            composer.render();
        }

        window.addEventListener('resize', () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            composer.setSize(w, h);
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
            title="Black Hole Core"
        />
    );
};
