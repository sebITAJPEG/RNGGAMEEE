import React, { useMemo } from 'react';

export const TheSpectrumHTMLView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Spectrum - 1 in 1 Billion</title>
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
            display: flex; /* Visible immediately to hide ore */
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

        .header { text-align: center; }

        h1 {
            font-family: 'Cinzel', serif; 
            font-size: 32px;
            margin: 0;
            letter-spacing: 6px;
            font-weight: 700;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        .rarity-tag {
            font-size: 16px;
            color: #ffffff;
            letter-spacing: 6px;
            opacity: 0.9;
            margin-top: 10px;
            text-transform: uppercase;
            font-weight: 700;
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
        }

        .controls {
            pointer-events: auto;
            align-self: center;
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }

        #visualizer {
            width: 300px;
            height: 60px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
            opacity: 0.8;
        }

        #vignette {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at center, transparent 20%, #000000 130%);
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
    <div id="vignette"></div>

    <div id="hud">
        <div class="header">
            <h1 id="titleText">THE SPECTRUM</h1>
            <div class="rarity-tag">Rarity: 1 in 1,000,000,000</div>
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
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

        // --- AUDIO ENGINE ---
        class SpectrumAudio {
            constructor() {
                this.ctx = null;
                this.masterGain = null;
                this.analyser = null;
                this.dataArray = null;
                this.isInitialized = false;
                this.isMusicPlaying = false;
                this.canvas = document.getElementById('visualizer');
                this.canvasCtx = this.canvas.getContext('2d');
                this.scale = [110.00, 138.59, 164.81, 185.00, 207.65, 220.00, 277.18, 311.13, 329.63, 440.00, 554.37, 622.25, 659.25, 880.00];
                this.nextNoteTime = 0;
            }
            
            init() {
                if(this.isInitialized) return;
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioContext();
                
                const compressor = this.ctx.createDynamicsCompressor();
                compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
                compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
                compressor.connect(this.ctx.destination);

                this.analyser = this.ctx.createAnalyser();
                this.analyser.fftSize = 2048; 
                this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
                
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.value = 0.5;
                this.masterGain.connect(compressor);
                this.masterGain.connect(this.analyser);

                this.convolver = this.ctx.createConvolver();
                this.convolver.buffer = this.createImpulseResponse(4.0, 2.0); 
                this.convolverGain = this.ctx.createGain();
                this.convolverGain.gain.value = 0.3;
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

            // EPIC BUILD UP SOUND (Riser)
            playIntroBuildUp(duration) {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                
                // 3 Oscillators rising in pitch
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
                    
                    // Lowpass filter opening up
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

            startMusic() {
                if(this.isMusicPlaying || !this.isInitialized) return;
                this.isMusicPlaying = true;
                const now = this.ctx.currentTime;
                
                const osc1 = this.ctx.createOscillator(); osc1.type = 'sine'; osc1.frequency.value = 55.0; 
                const gain1 = this.ctx.createGain(); gain1.gain.value = 0.08;
                osc1.connect(gain1); gain1.connect(this.masterGain); osc1.start(now);

                const osc2 = this.ctx.createOscillator(); osc2.type = 'triangle'; osc2.frequency.value = 110.5; 
                const gain2 = this.ctx.createGain(); gain2.gain.value = 0.04;
                const filter = this.ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 200;
                osc2.connect(filter); filter.connect(gain2); gain2.connect(this.masterGain); osc2.start(now);
                
                const lfo = this.ctx.createOscillator(); lfo.frequency.value = 0.1;
                const lfoGain = this.ctx.createGain(); lfoGain.gain.value = 50;
                lfo.connect(lfoGain); lfoGain.connect(filter.frequency); lfo.start(now);

                this.scheduler();
            }

            playNote(freq, attack, decay, vol, type = 'sine', pan = 0) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const panner = this.ctx.createStereoPanner();
                osc.type = type; osc.frequency.value = freq;
                panner.pan.value = pan;
                const now = this.ctx.currentTime;
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(vol, now + attack);
                gain.gain.exponentialRampToValueAtTime(0.001, now + attack + decay);
                osc.connect(gain); gain.connect(panner);
                panner.connect(this.masterGain); panner.connect(this.convolver);
                osc.start(); osc.stop(now + attack + decay + 1);
            }

            playBling() {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                osc.type = 'sine'; osc.frequency.setValueAtTime(880, now); osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1); 
                const gain = this.ctx.createGain(); gain.gain.setValueAtTime(0.5, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0); 
                osc.connect(gain); gain.connect(this.masterGain); gain.connect(this.convolver);
                osc.start(); osc.stop(now + 2.5);
                const kick = this.ctx.createOscillator(); kick.frequency.setValueAtTime(150, now); kick.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
                const kickGain = this.ctx.createGain(); kickGain.gain.setValueAtTime(0.8, now); kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                kick.connect(kickGain); kickGain.connect(this.masterGain); kick.start(); kick.stop(now + 0.5);
            }

            scheduler() {
                if(!this.isMusicPlaying) return;
                requestAnimationFrame(() => this.scheduler());
                const now = this.ctx.currentTime;
                if (now >= this.nextNoteTime) {
                    if (Math.random() > 0.3) { 
                        const rootIdx = Math.floor(Math.random() * 5); const freq = this.scale[rootIdx];
                        this.playNote(freq, 2.0, 4.0, 0.15, 'triangle', (Math.random()-0.5));
                        setTimeout(() => {
                            const harmIdx = rootIdx + 2 + Math.floor(Math.random()*2);
                            if(harmIdx < this.scale.length) this.playNote(this.scale[harmIdx], 2.0, 4.0, 0.12, 'triangle', (Math.random()-0.5));
                        }, 100);
                    }
                    if (Math.random() > 0.3) {
                        const count = Math.floor(Math.random() * 3) + 1;
                        for(let i=0; i<count; i++) {
                            setTimeout(() => {
                                const idx = 8 + Math.floor(Math.random() * (this.scale.length - 8));
                                const pan = (Math.random() - 0.5) * 0.9;
                                this.playNote(this.scale[idx], 0.05, 2.0, 0.12, 'sine', pan);
                            }, i * 250);
                        }
                    }
                    this.nextNoteTime = now + 1.0 + Math.random() * 3.0;
                }
            }

            getAudioData() {
                if (!this.analyser) return { bass: 0, mid: 0, high: 0 };
                this.analyser.getByteFrequencyData(this.dataArray);
                const bass = this.dataArray.slice(1, 8).reduce((a,b)=>a+b,0) / 8 / 255;
                const mid = this.dataArray.slice(10, 40).reduce((a,b)=>a+b,0) / 30 / 255;
                const high = this.dataArray.slice(50, 100).reduce((a,b)=>a+b,0) / 50 / 255;
                return { bass, mid, high };
            }

            drawVisualizer() {
                requestAnimationFrame(() => this.drawVisualizer());
                if (!this.analyser) return;
                const w = this.canvas.width; const h = this.canvas.height;
                const bufferLength = this.analyser.frequencyBinCount;
                this.canvasCtx.clearRect(0, 0, w, h);
                this.canvasCtx.lineWidth = 2;
                this.canvasCtx.strokeStyle = '#00ffff';
                this.canvasCtx.beginPath();
                const sliceWidth = w * 1.0 / (bufferLength/2);
                let x = 0;
                for(let i = 0; i < bufferLength/2; i++) {
                    const v = this.dataArray[i] / 128.0;
                    const y = h - (v * h * 0.5);
                    if(i === 0) this.canvasCtx.moveTo(x, y); else this.canvasCtx.lineTo(x, y);
                    x += sliceWidth;
                }
                this.canvasCtx.stroke();
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
        const hud = document.getElementById('hud');
        
        // Auto-start logic
        setTimeout(() => {
            try {
                audio.init();
            } catch(e) { console.warn("Audio init failed (likely autoplay policy)", e); }
            // introScreen.style.display = 'flex'; // Already visible
            playCutscene();
        }, 500);

        async function playCutscene() {
            // Start the Riser sound!
            const totalDuration = phrases.length * 3.0 + 1.0; // Slightly longer for typing
            audio.playIntroBuildUp(totalDuration); 

            for (let i = 0; i < phrases.length; i++) {
                const phrase = phrases[i];
                
                // Reset container
                introTextEl.className = ''; 
                introTextEl.classList.remove('visible');
                
                // Wait for previous fade out if not first
                if(i > 0) await new Promise(r => setTimeout(r, 600));
                
                // Clear and Prepare container
                introTextEl.innerHTML = '';
                introTextEl.classList.add('visible'); // Make container visible (opacity 1)
                
                const text = phrase.text;
                const isRainbow = phrase.color === 'rainbow';
                
                // Typewriter Loop
                for(let c=0; c < text.length; c++) {
                    const char = text[c];
                    const span = document.createElement('span');
                    
                    if (char === ' ') {
                        span.className = 'space';
                        span.innerHTML = '&nbsp;';
                    } else {
                        span.textContent = char;
                        span.className = 'char'; // Trigger scale animation
                        
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
                    
                    // Trigger character visibility (slam effect)
                    // Small delay to ensure CSS transition triggers
                    requestAnimationFrame(() => span.classList.add('visible'));
                    
                    audio.playTypingSound();
                    
                    // Typing delay
                    await new Promise(r => setTimeout(r, 30));
                }
                
                // Shake intensity increases
                if (i > phrases.length / 2) introScreen.classList.add('shake-screen');
                
                // Hold time (reading time)
                await new Promise(r => setTimeout(r, 1500));
                
                // Fade out container
                introTextEl.classList.remove('visible');
            }

            // Wait final fade out
            await new Promise(r => setTimeout(r, 800));

            // EXPLOSION
            audio.playExplosion();
            flashOverlay.style.display = 'block';
            
            requestAnimationFrame(() => {
                flashOverlay.style.opacity = 1;
                
                setTimeout(() => {
                    introScreen.style.display = 'none';
                    flashOverlay.style.transition = 'opacity 3.0s ease-out';
                    flashOverlay.style.opacity = 0;
                    hud.style.opacity = 1;
                    
                    // START MAIN MUSIC
                    audio.startMusic();
                    // ENABLE CAMERA
                    controls.enabled = true;
                    
                    setTimeout(() => flashOverlay.style.display = 'none', 3000);
                }, 100);
            });
        }

        // --- TITLE TEXT LOGIC ---
        const titleElement = document.getElementById('titleText');
        const titleString = titleElement.innerText;
        titleElement.innerHTML = '';
        let titleIdx = 0;
        for (let char of titleString) {
            const span = document.createElement('span');
            span.innerText = char;
            if (char === ' ') { span.style.width = '20px'; span.style.display = 'inline-block'; } 
            else {
                span.classList.add('char');
                // Ensure title text is visible immediately or shortly after
                setTimeout(() => span.classList.add('visible'), titleIdx * 50); 
                span.style.animationDuration = (0.1 + Math.random() * 0.1) + 's';
                const hue = (titleIdx / titleString.length) * 360;
                span.style.color = \`hsl(\${hue}, 100%, 70%)\`;
                span.style.textShadow = \`0 0 10px hsl(\${hue}, 100%, 50%)\`;
            }
            titleElement.appendChild(span); titleIdx++;
        }

        // --- GLSL SHADERS ---
        const noiseGLSL = \`
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float snoise(vec3 v) {
                const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
                const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 = v - i + dot(i, C.xxx) ;
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                i = mod289(i);
                vec4 p = permute( permute( permute(
                            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                float n_ = 0.142857142857; 
                vec3  ns = n_ * D.wyz - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;
                vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
            }
            float fbm(vec3 x) {
                float v = 0.0;
                float a = 0.5;
                vec3 shift = vec3(100.0);
                for (int i = 0; i < 6; ++i) { 
                    v += a * snoise(x);
                    x = x * 2.0 + shift;
                    a *= 0.5;
                }
                return v;
            }
        \`;

        const prismVertexShader = \`
            uniform float uTime;
            uniform float uAudioBass; 
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec3 vWorldPosition;
            varying float vDisplacement;
            \${noiseGLSL}
            void main() {
                vec3 p = position;
                float t = uTime * 0.05;
                vec3 q = vec3(fbm(p+t), fbm(p+vec3(5.2,1.3,2.8)+t), fbm(p+vec3(1.3,2.8,5.2)+t));
                vec3 r = vec3(fbm(p+4.0*q+vec3(1.7,9.2,5.2)+t), fbm(p+4.0*q+vec3(8.3,2.8,1.2)+t), fbm(p+4.0*q+vec3(4.2,5.4,2.3)+t));
                float warping = fbm(p + 4.0 * r);
                float steps = abs(snoise(p * 3.0));
                steps = pow(steps, 0.5); 
                float micro = snoise(p * 20.0 + uTime * 0.1) * 0.03;
                float bassPulse = uAudioBass * 0.8;
                float totalDisplacement = (warping * 0.8) + (steps * 0.4) + micro;
                totalDisplacement += bassPulse * 0.5; 
                vec3 newPos = p + normal * totalDisplacement;
                vDisplacement = totalDisplacement;
                vNormal = normalize(normalMatrix * normal);
                vec4 worldPos = modelMatrix * vec4(newPos, 1.0);
                vWorldPosition = worldPos.xyz;
                vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
                vViewPosition = -mvPosition.xyz;
                gl_Position = projectionMatrix * mvPosition;
            }
        \`;

        const prismFragmentShader = \`
            uniform float uTime;
            uniform float uAudioHigh; 
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec3 vWorldPosition;
            varying float vDisplacement;
            float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
            vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) { return a + b*cos( 6.28318*(c*t+d) ); }
            void main() {
                vec3 normal = normalize(vNormal);
                vec3 viewDir = normalize(vViewPosition);
                float viewAngle = dot(viewDir, normal);
                float iridescence = pow(1.0 - abs(viewAngle), 1.5);
                float shift = iridescence + (vDisplacement * 0.3) + (uTime * 0.05);
                shift += uAudioHigh * 0.5;
                vec3 rainbow = palette(shift, vec3(0.5,0.5,0.5), vec3(0.5,0.5,0.5), vec3(1.0,1.0,1.0), vec3(0.0,0.33,0.67));
                vec3 reflectDir = reflect(-viewDir, normal);
                float spec = pow(max(dot(viewDir, reflectDir), 0.0), 64.0);
                float sparkleNoise = random(floor(vWorldPosition.xy * 20.0 + viewDir.xy * 10.0));
                float sparkle = smoothstep(0.98, 1.0, sparkleNoise) * spec;
                float cracks = smoothstep(0.6, -0.1, vDisplacement);
                vec3 coreGlow = vec3(1.0, 0.9, 0.8) * cracks * (0.6 + uAudioHigh);
                float rim = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
                vec3 rimColor = vec3(0.5, 0.8, 1.0) * rim;
                vec3 finalColor = rainbow;
                finalColor += vec3(1.0) * spec * 3.0;
                finalColor += vec3(1.0, 1.0, 1.0) * sparkle * 5.0; 
                finalColor += coreGlow;
                finalColor += rimColor;
                gl_FragColor = vec4(finalColor, 1.0);
            }
        \`;

        const ringVertexShader = \`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        \`;

        const ringFragmentShader = \`
            uniform float uTime;
            uniform float uAudioBass;
            varying vec2 vUv;
            \${noiseGLSL}
            void main() {
                float flow = snoise(vec3(vUv.x * 20.0 + uTime * 2.0, vUv.y * 2.0, uTime));
                float bands = sin(vUv.y * 20.0 + flow * 2.0);
                bands = smoothstep(0.8, 1.0, bands);
                float core = 1.0 - abs(vUv.y - 0.5) * 2.0;
                core = pow(core, 4.0);
                vec3 col = mix(vec3(0.0, 1.0, 1.0), vec3(1.0, 0.0, 1.0), sin(vUv.x * 5.0 + uTime) * 0.5 + 0.5);
                col += vec3(1.0) * bands;
                float alpha = (core + bands * 0.5) * (0.5 + uAudioBass);
                gl_FragColor = vec4(col, alpha);
            }
        \`;

        const explosionVertexShader = \`
            uniform float uTime;
            uniform float uStartTime;
            attribute vec3 aVelocity;
            attribute float aSize;
            attribute vec3 aColor;
            varying vec3 vColor;
            varying float vAlpha;
            void main() {
                float age = uTime - uStartTime;
                float maxAge = 2.0;
                if (age < 0.0 || age > maxAge) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
                float drag = 0.5;
                vec3 p = position + aVelocity * (age - 0.5 * drag * age * age * 0.5) * 25.0; 
                vColor = mix(vec3(1.0, 1.0, 1.0), aColor, age * 2.0);
                vAlpha = 1.0 - (age / maxAge);
                vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
                gl_PointSize = aSize * (500.0 / -mvPosition.z) * vAlpha;
                gl_Position = projectionMatrix * mvPosition;
            }
        \`;

        const explosionFragmentShader = \`
            varying vec3 vColor;
            varying float vAlpha;
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                if(dist > 0.5) discard;
                float glow = 1.0 - smoothstep(0.0, 0.5, dist);
                glow = pow(glow, 2.0);
                gl_FragColor = vec4(vColor, vAlpha * glow);
            }
        \`;

        const beamVertexShader = \`varying vec2 vUv; varying float vFade; void main() { vUv = uv; vFade = position.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }\`;
        const beamFragmentShader = \`uniform float uTime; varying vec2 vUv; varying float vFade; void main() { float alpha = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x); alpha *= smoothstep(0.0, 5.0, vFade + 2.5); float pulse = sin(uTime * 1.0 + vFade) * 0.2 + 0.8; gl_FragColor = vec4(0.8, 0.9, 1.0, alpha * 0.15 * pulse); }\`;

        const nebulaVertexShader = \`varying vec3 vWorldPosition; void main() { vWorldPosition = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }\`;
        const nebulaFragmentShader = \`uniform float uTime; varying vec3 vWorldPosition; \${noiseGLSL} void main() { vec3 p = normalize(vWorldPosition); float t = uTime * 0.05; vec3 q = p + vec3(t * 0.2, t * 0.1, 0.0); float cloud = fbm(q * 3.0); vec3 c1 = vec3(0.0, 0.0, 0.02); vec3 c2 = vec3(0.1, 0.0, 0.15); vec3 c3 = vec3(0.0, 0.1, 0.2); vec3 finalColor = mix(c1, c2, cloud); finalColor = mix(finalColor, c3, fbm(q * 10.0) * 0.5); float star = snoise(p * 150.0); if (star > 0.98) finalColor += vec3(0.8); gl_FragColor = vec4(finalColor, 1.0); }\`;

        const aberrationShader = {
            uniforms: { "tDiffuse": { value: null }, "amount": { value: 0.003 }, "time": { value: 0.0 } },
            vertexShader: \`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }\`,
            fragmentShader: \`
                uniform sampler2D tDiffuse; uniform float amount; uniform float time; varying vec2 vUv;
                float random(vec2 uv) { return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453); }
                void main() {
                    float dist = distance(vUv, vec2(0.5));
                    float offset = amount * dist * 3.0; 
                    float r = texture2D(tDiffuse, vUv + vec2(offset, 0.0)).r;
                    float g = texture2D(tDiffuse, vUv).g;
                    float b = texture2D(tDiffuse, vUv - vec2(offset, 0.0)).b;
                    vec3 col = vec3(r, g, b);
                    float noise = random(vUv + time);
                    col += (noise - 0.5) * 0.05; 
                    gl_FragColor = vec4(col, 1.0);
                }
            \`
        };

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 300);
        const startPos = new THREE.Vector3(0, -10, 30); 
        const endPos = new THREE.Vector3(0, 0, 18);
        camera.position.copy(startPos);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enablePan = false;
        controls.enabled = false;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const oreGeo = new THREE.IcosahedronGeometry(3.0, 90); 
        const oreMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 }, uAudioBass: { value: 0 }, uAudioHigh: { value: 0 } },
            vertexShader: prismVertexShader,
            fragmentShader: prismFragmentShader,
        });
        const ore = new THREE.Mesh(oreGeo, oreMat);
        scene.add(ore);

        const ringMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 }, uAudioBass: { value: 0 } },
            vertexShader: ringVertexShader,
            fragmentShader: ringFragmentShader,
            transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
        });

        const haloRings = [];
        const ringCount = 16;
        for(let i=0; i<ringCount; i++) {
            const radius = 6.5 + (i * 2.5);
            let mat, tube, segs;
            if (i < 3) { mat = oreMat; tube = 0.4; segs = 120; } 
            else { mat = ringMat; tube = Math.max(0.05, 0.2 - (i * 0.01)); segs = 32; }
            const haloGeo = new THREE.TorusGeometry(radius, tube, segs, 200); 
            const halo = new THREE.Mesh(haloGeo, mat); 
            halo.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            halo.userData = { speedX: (Math.random()-0.5)*0.02, speedY: (Math.random()-0.5)*0.02, speedZ: (Math.random()-0.5)*0.02 };
            scene.add(halo); haloRings.push(halo);
        }

        const cageGeo = new THREE.IcosahedronGeometry(4.0, 1);
        const cageMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.1 });
        const cage = new THREE.Mesh(cageGeo, cageMat);
        scene.add(cage);

        const coreGeo = new THREE.IcosahedronGeometry(1.2, 4);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, wireframe: true });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        const raysGroup = new THREE.Group();
        const beamGeo = new THREE.ConeGeometry(0.8, 20, 32, 1, true);
        const beamMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: beamVertexShader,
            fragmentShader: beamFragmentShader,
            transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending
        });
        for(let i=0; i<3; i++) {
            const beam = new THREE.Mesh(beamGeo, beamMat);
            beam.rotation.x = Math.PI/2; beam.rotation.z = (i / 3) * Math.PI * 2;
            const pivot = new THREE.Group(); pivot.add(beam); pivot.rotation.set(Math.random(), Math.random(), Math.random());
            raysGroup.add(pivot);
        }
        scene.add(raysGroup);

        const explosionGeo = new THREE.BufferGeometry();
        const exCount = 20000;
        const exPos = new Float32Array(exCount * 3);
        const exVel = new Float32Array(exCount * 3);
        const exColor = new Float32Array(exCount * 3);
        const exSize = new Float32Array(exCount);
        
        for(let i=0; i<exCount; i++) {
            exPos[i*3] = 0; exPos[i*3+1] = 0; exPos[i*3+2] = 0;
            const v = new THREE.Vector3().randomDirection();
            const speed = Math.random() * 2.0 + 0.5;
            exVel[i*3] = v.x * speed; exVel[i*3+1] = v.y * speed; exVel[i*3+2] = v.z * speed;
            const color = new THREE.Color().setHSL(Math.random(), 1.0, 0.7);
            exColor[i*3] = color.r; exColor[i*3+1] = color.g; exColor[i*3+2] = color.b;
            exSize[i] = Math.random();
        }
        explosionGeo.setAttribute('position', new THREE.BufferAttribute(exPos, 3));
        explosionGeo.setAttribute('aVelocity', new THREE.BufferAttribute(exVel, 3));
        explosionGeo.setAttribute('aColor', new THREE.BufferAttribute(exColor, 3));
        explosionGeo.setAttribute('aSize', new THREE.BufferAttribute(exSize, 1));
        
        const explosionMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 }, uStartTime: { value: -100.0 } },
            vertexShader: explosionVertexShader,
            fragmentShader: explosionFragmentShader,
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
        });
        const explosion = new THREE.Points(explosionGeo, explosionMat);
        scene.add(explosion);

        const shockwaveGeo = new THREE.TorusGeometry(1, 0.5, 16, 100);
        const shockwaveMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 });
        const shockwave = new THREE.Mesh(shockwaveGeo, shockwaveMat);
        shockwave.rotation.x = Math.PI / 2;
        scene.add(shockwave);

        const shardCount = 300;
        const shardGeo = new THREE.TetrahedronGeometry(0.15);
        const instancedShards = new THREE.InstancedMesh(shardGeo, new THREE.MeshBasicMaterial({color: 0xffffff}), shardCount);
        const dummy = new THREE.Object3D();
        const shardData = [];
        for(let i=0; i<shardCount; i++) {
            const r = 15 + Math.random() * 20; 
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            dummy.position.set(r*Math.sin(phi)*Math.cos(theta), r*Math.sin(phi)*Math.sin(theta), r*Math.cos(phi));
            dummy.rotation.set(Math.random()*6, Math.random()*6, Math.random()*6);
            dummy.scale.setScalar(Math.random() * 0.5 + 0.5);
            dummy.updateMatrix();
            instancedShards.setMatrixAt(i, dummy.matrix);
            shardData.push({
                pos: dummy.position.clone(),
                speed: 0.001 + Math.random() * 0.003, 
                axis: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize()
            });
        }
        scene.add(instancedShards);

        const lightningCount = 6;
        const lightnings = [];
        for(let i=0; i<lightningCount; i++) {
            const lGeo = new THREE.BufferGeometry();
            const lPos = new Float32Array(30 * 3); 
            lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
            const lMat = new THREE.LineBasicMaterial({ color: 0xccffff, transparent: true, opacity: 0 });
            const lMesh = new THREE.Line(lGeo, lMat);
            scene.add(lMesh);
            lightnings.push({ mesh: lMesh, timer: Math.random() * 100 });
        }

        const bgGeo = new THREE.SphereGeometry(100, 32, 32);
        const bgMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: nebulaVertexShader,
            fragmentShader: nebulaFragmentShader,
            side: THREE.BackSide,
            depthWrite: false
        });
        const backgroundSphere = new THREE.Mesh(bgGeo, bgMat);
        scene.add(backgroundSphere);

        const renderPass = new RenderPass(scene, camera);
        const aberrationPass = new ShaderPass(aberrationShader);
        const composer = new EffectComposer(renderer);
        composer.addPass(renderPass);
        composer.addPass(aberrationPass);

        const clock = new THREE.Clock();
        let intro = 0;
        let shakeIntensity = 0;

        function updateLightning(t, bassLevel) {
            lightnings.forEach(l => {
                l.timer -= (0.5 + bassLevel * 2.0);
                if(l.timer <= 0) {
                    l.timer = 50 + Math.random() * 100;
                    l.mesh.material.opacity = 1.0;
                    const pos = l.mesh.geometry.attributes.position.array;
                    const start = new THREE.Vector3().randomDirection().multiplyScalar(2.5); 
                    const end = new THREE.Vector3().randomDirection().multiplyScalar(45.0);   
                    for(let i=0; i<30; i++) {
                        const alpha = i / 29;
                        const p = new THREE.Vector3().lerpVectors(start, end, alpha);
                        if(i>0 && i<29) p.add(new THREE.Vector3().randomDirection().multiplyScalar(0.5));
                        pos[i*3] = p.x; pos[i*3+1] = p.y; pos[i*3+2] = p.z;
                    }
                    l.mesh.geometry.attributes.position.needsUpdate = true;
                } else {
                    l.mesh.material.opacity *= 0.9; 
                }
            });
        }

        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            const { bass, mid, high } = audio.getAudioData();

            if(intro < 1.0) {
                // Intro handled by cutscene
            }

            if (shakeIntensity > 0) {
                camera.position.x += (Math.random() - 0.5) * shakeIntensity;
                camera.position.y += (Math.random() - 0.5) * shakeIntensity;
                camera.position.z += (Math.random() - 0.5) * shakeIntensity;
                shakeIntensity *= 0.9; 
            }

            oreMat.uniforms.uTime.value = time;
            oreMat.uniforms.uAudioBass.value = bass; 
            oreMat.uniforms.uAudioHigh.value = high;
            ringMat.uniforms.uTime.value = time;
            ringMat.uniforms.uAudioBass.value = bass;
            beamMat.uniforms.uTime.value = time;
            bgMat.uniforms.uTime.value = time;
            aberrationPass.uniforms.time.value = time;
            aberrationPass.uniforms.amount.value = 0.003 + bass * 0.005 + shakeIntensity * 0.05;
            
            explosionMat.uniforms.uTime.value = time;

            const age = time - explosionMat.uniforms.uStartTime.value;
            if (age < 2.0 && age > 0.0) {
                shockwave.scale.setScalar(1.0 + age * 30.0);
                shockwave.material.opacity = 1.0 - (age / 2.0);
            } else {
                shockwave.material.opacity = 0;
                shockwave.scale.setScalar(0.01);
            }

            ore.rotation.y = time * 0.05 + (bass * 0.05); 
            ore.rotation.z = Math.sin(time * 0.1) * 0.05;
            
            haloRings.forEach(halo => {
                halo.rotation.x += halo.userData.speedX;
                halo.rotation.y += halo.userData.speedY;
                halo.rotation.z += halo.userData.speedZ;
            });

            cage.rotation.copy(ore.rotation); 
            cage.rotation.y = -time * 0.08;

            core.rotation.y = time * -0.2;
            core.scale.setScalar(1.0 + Math.sin(time * 2.0) * 0.1 + bass * 0.2); 

            raysGroup.children.forEach((pivot, i) => {
                pivot.rotation.x += 0.002 * (i+1);
                pivot.rotation.y += 0.005;
            });

            for(let i=0; i<shardCount; i++) {
                const data = shardData[i];
                dummy.position.copy(data.pos);
                dummy.position.applyAxisAngle(data.axis, data.speed);
                data.pos.copy(dummy.position);
                const hue = (time * 0.05 + i*0.01) % 1.0;
                instancedShards.setColorAt(i, new THREE.Color().setHSL(hue, 0.8, 0.7));
                dummy.rotation.x += 0.01;
                dummy.updateMatrix();
                instancedShards.setMatrixAt(i, dummy.matrix);
            }
            instancedShards.instanceMatrix.needsUpdate = true;
            instancedShards.instanceColor.needsUpdate = true;
            
            updateLightning(time, bass);

            composer.render();
        }

        window.addEventListener('click', (event) => {
            // Check interaction
            if (event.target.closest('#intro-screen')) {
                return;
            }

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(ore);
            if (intersects.length > 0) {
                audio.playBling();
                explosionMat.uniforms.uStartTime.value = clock.getElapsedTime();
                shakeIntensity = 0.5; 
            }
        });

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
            title="The Spectrum"
        />
    );
};
