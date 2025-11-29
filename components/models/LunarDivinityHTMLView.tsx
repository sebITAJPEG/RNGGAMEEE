import React, { useMemo } from 'react';

export const LunarDivinityHTMLView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lunar Divinity 250M - MOON ASSET</title>
    <!-- Import Elegant Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            overflow: hidden;
            background-color: #050510;
            font-family: 'Cinzel', serif;
        }
        canvas { display: block; }
        
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

        /* --- ELEGANT UI --- */
        #hud {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 20;
            opacity: 0;
            transition: opacity 2s ease;
        }

        .title-container {
            position: relative;
            text-align: center;
            padding: 40px 60px;
            color: #ffffff;
            opacity: 0;
            transform: translateY(20px);
            transition: all 2s ease;
            
            background: rgba(5, 10, 20, 0.4);
            border-radius: 2px;
            border: 1px solid rgba(200, 220, 255, 0.1);
            backdrop-filter: blur(4px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        
        .title-container.active {
            opacity: 1;
            transform: translateY(35vh) scale(0.85);
        }

        h1 {
            font-family: 'Cinzel', serif;
            font-weight: 500;
            font-size: 42px;
            margin: 0;
            letter-spacing: 8px;
            background: linear-gradient(135deg, #ffffff 0%, #e0eaff 50%, #aaccff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 30px rgba(180, 200, 255, 0.4);
            position: relative;
            display: inline-block;
        }
        
        .ornament-top, .ornament-bottom {
            width: 0%;
            height: 1px;
            background: linear-gradient(90deg, transparent, #aaccff, transparent);
            margin: 15px auto;
            opacity: 0;
            transition: width 2s ease, opacity 2s ease;
        }
        
        .title-container.active .ornament-top,
        .title-container.active .ornament-bottom {
            width: 100%;
            opacity: 0.6;
        }

        .subtitle {
            font-family: 'Playfair Display', serif;
            font-style: italic;
            font-size: 16px;
            color: #dbeeff;
            margin-top: 15px;
            letter-spacing: 3px;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 2s ease 1s, transform 2s ease 1s;
        }
        
        .title-container.active .subtitle {
            opacity: 0.9;
            transform: translateY(0);
        }

        .stats-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            opacity: 0;
            transition: opacity 2s ease 1.5s;
        }
        
        .title-container.active .stats-container {
            opacity: 1;
        }

        .stat-box {
            border: 1px solid rgba(255,255,255,0.2);
            padding: 8px 16px;
            font-family: 'Cinzel', serif;
            font-size: 12px;
            color: #aaccff;
            letter-spacing: 2px;
            text-transform: uppercase;
            position: relative;
        }
        
        .stat-box::before {
            content: '';
            position: absolute;
            top: -2px; left: -2px; right: -2px; bottom: -2px;
            border: 1px solid rgba(255,255,255,0.1);
            pointer-events: none;
        }

        .rarity-gem {
            width: 6px;
            height: 6px;
            background: #ffffff;
            box-shadow: 0 0 10px #ffffff, 0 0 20px #aaccff;
            transform: rotate(45deg);
            margin: 0 15px;
        }

        #vignette {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle, transparent 30%, #020205 120%);
            pointer-events: none;
            z-index: 10;
        }
    </style>
</head>
<body>
    <!-- CUTSCENE ELEMENTS -->
    <div id="intro-screen">
        <div class="intro-stars"></div>
        <div id="intro-text"></div>
    </div>
    <div id="flash-overlay"></div>

    <!-- MAIN VIEW -->
    <div id="vignette"></div>
    
    <div id="hud">
        <div class="title-container" id="titleCard">
            <div class="ornament-top"></div>
            <h1>LUNAR DIVINITY</h1>
            <div class="ornament-bottom"></div>
            
            <div class="subtitle">The Soul of the Moon</div>
            
            <div class="stats-container">
                <div class="stat-box">1 in 250,000,000</div>
                <div class="rarity-gem"></div>
                <div class="stat-box">MOON TIER</div>
            </div>
        </div>
    </div>

    <!-- Import Three.js and Post-Processing -->
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
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

        // --- AUDIO ENGINE (Web Audio API) ---
        class LunarAudio {
            constructor() {
                this.ctx = null;
                this.masterGain = null;
                this.oscillators = [];
                this.choirVoices = [];
                this.isPlaying = false;
            }

            init() {
                if (this.ctx) return;
                
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioContext();
                
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.value = 0.3; 
                this.masterGain.connect(this.ctx.destination);

                // Initialize core sounds
                this.isPlaying = true;
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

            startMusic() {
                if(!this.ctx) return;
                const now = this.ctx.currentTime;
                
                // 1. Ethereal Sine Pads
                const freqs = [110, 164.81, 196, 220, 329.63, 392, 523.25, 659.25]; // Am7 add9
                freqs.forEach((f, i) => {
                    this.createOscillator(f, 'sine', 0.1 - (i*0.01));
                    this.createOscillator(f + Math.random() * 2 - 1, 'sine', 0.05);
                });
                
                // 2. Choir Synthesis
                const choirChord = [220, 277.18, 329.63, 440]; // A maj
                choirChord.forEach(f => {
                    this.createChoirVoice(f);
                });

                // Global Lowpass Filter
                this.filter = this.ctx.createBiquadFilter();
                this.filter.type = 'lowpass';
                this.filter.frequency.value = 800;
                this.filter.Q.value = 2;
                
                this.masterGain.disconnect();
                this.masterGain.connect(this.filter);
                this.filter.connect(this.ctx.destination);
            }

            createOscillator(freq, type, vol) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.value = freq;
                gain.gain.value = vol;
                osc.connect(gain);
                gain.connect(this.masterGain);
                osc.start();
                this.oscillators.push({ osc, gain, baseFreq: freq });
            }

            createChoirVoice(freq) {
                const osc = this.ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.value = freq;
                
                const f1 = this.ctx.createBiquadFilter();
                f1.type = 'bandpass'; f1.frequency.value = 800; f1.Q.value = 4;
                
                const f2 = this.ctx.createBiquadFilter();
                f2.type = 'bandpass'; f2.frequency.value = 1200; f2.Q.value = 4;

                const gain = this.ctx.createGain();
                gain.gain.value = 0.05;

                osc.connect(f1); osc.connect(f2);
                f1.connect(gain); f2.connect(gain);
                gain.connect(this.masterGain);
                osc.start();
                this.choirVoices.push({ osc, gain, f1, f2, baseFreq: freq });
            }

            update(time) {
                if(!this.isPlaying || !this.filter) return;
                this.filter.frequency.value = 800 + Math.sin(time * 0.2) * 300;
                this.oscillators.forEach((o, i) => {
                    o.osc.frequency.value = o.baseFreq + Math.sin(time * 0.5 + o.baseFreq) * 2;
                    o.gain.gain.value = (0.1 - (i*0.005)) * (0.8 + Math.sin(time * 0.3 + i)*0.2);
                });
                this.choirVoices.forEach((v, i) => {
                    const morph = Math.sin(time * 0.5 + i);
                    v.f1.frequency.value = 800 + morph * 100;
                    v.f2.frequency.value = 1200 + morph * 200;
                    v.gain.gain.value = 0.05 + Math.sin(time * 3.0 + i) * 0.01;
                });
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
        const hud = document.getElementById('hud');
        const titleCard = document.getElementById('titleCard');

        setTimeout(() => {
            try { audioSystem.init(); } catch(e) {}
            playCutscene();
        }, 500);

        async function playCutscene() {
            const totalDuration = phrases.length * 3.0; // Slightly faster pacing
            audioSystem.playIntroBuildUp(totalDuration);

            for (let i = 0; i < phrases.length; i++) {
                const phrase = phrases[i];
                introTextEl.className = ''; 
                introTextEl.classList.remove('visible');
                if(phrase.glitch) introTextEl.classList.add('glitch');
                
                // Add shake effect for the final phrase
                if (i === phrases.length - 1) {
                    introScreen.classList.add('shake-screen');
                }

                if(i > 0) await new Promise(r => setTimeout(r, 400)); // Shorter gap between phrases
                
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
                    await new Promise(r => setTimeout(r, 35)); // Slightly faster typing
                }
                
                // Deep Thud on phrase completion
                audioSystem.playDeepThud();
                
                // Hold time
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
                    introScreen.style.display = 'none';
                    flashOverlay.style.transition = 'opacity 3.0s ease-out';
                    flashOverlay.style.opacity = 0;
                    hud.style.opacity = 1;
                    titleCard.classList.add('active'); // Trigger CSS animations for title
                    
                    audioSystem.startMusic();
                    controls.enabled = true;
                    introActive = false; // Allow camera movement
                    
                    setTimeout(() => flashOverlay.style.display = 'none', 3000);
                }, 100);
            });
        }

        // --- GLSL NOISE & SHADERS ---
        // (Keeping existing shaders but ensuring they work with new structure)
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
        \`;

        const moonVertexShader = \`
            uniform float uTime;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec3 vWorldPosition;
            varying float vDisplacement;
            \${noiseGLSL}
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vec4 worldPos = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPos.xyz;
                vec3 p = position;
                float maria = snoise(p * 0.5 + 50.0);
                float craters = snoise(p * 2.0 + 10.0);
                craters = smoothstep(0.3, 0.8, craters) * -0.3; 
                float veins = 1.0 - abs(snoise(p * 4.0 + uTime * 0.1));
                veins = smoothstep(0.95, 1.0, veins); 
                float detail = snoise(p * 8.0) * 0.05;
                float totalDisplacement = (maria * -0.2) + craters + detail - (veins * 0.1); 
                float pulse = sin(uTime * 0.5) * 0.02;
                totalDisplacement += pulse;
                vDisplacement = totalDisplacement;
                vec3 newPosition = position + normal * totalDisplacement;
                vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
                vViewPosition = -mvPosition.xyz;
                gl_Position = projectionMatrix * mvPosition;
            }
        \`;

        const moonFragmentShader = \`
            uniform float uTime;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying float vDisplacement;
            \${noiseGLSL}
            void main() {
                vec3 normal = normalize(vNormal);
                vec3 viewDir = normalize(vViewPosition);
                vec3 colorHigh = vec3(0.95, 0.95, 1.0); 
                vec3 colorLow = vec3(0.4, 0.4, 0.5);    
                vec3 colorDeep = vec3(0.1, 0.1, 0.2);   
                float height = smoothstep(-0.5, 0.2, vDisplacement);
                vec3 surfaceColor = mix(colorDeep, colorLow, smoothstep(0.0, 0.4, height));
                surfaceColor = mix(surfaceColor, colorHigh, smoothstep(0.4, 1.0, height));
                float veinGlow = 1.0 - smoothstep(-0.3, -0.2, vDisplacement);
                vec3 energyColor = vec3(0.6, 0.8, 1.0) * 2.0; 
                surfaceColor = mix(surfaceColor, energyColor, veinGlow);
                float fresnel = dot(viewDir, normal);
                fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
                float rimPower = pow(fresnel, 3.0);
                vec3 rimColor = vec3(0.7, 0.8, 1.0) * rimPower * 1.5;
                float innerGlow = smoothstep(0.8, 0.2, length(vDisplacement)) * 0.2;
                vec3 divineGlow = vec3(0.8, 0.7, 1.0) * innerGlow;
                vec3 finalColor = surfaceColor + rimColor + divineGlow;
                gl_FragColor = vec4(finalColor, 1.0);
            }
        \`;

        const geoVertexShader = \`
            uniform float uTime;
            varying vec3 vPos;
            void main() {
                vPos = position;
                vec3 p = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
            }
        \`;

        const geoFragmentShader = \`
            uniform float uTime;
            varying vec3 vPos;
            void main() {
                float alpha = 0.3 + sin(uTime * 2.0 + vPos.y) * 0.2;
                gl_FragColor = vec4(0.8, 0.9, 1.0, alpha);
            }
        \`;

        const atmosphereVertexShader = \`
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                vViewPosition = -mvPosition.xyz;
                gl_Position = projectionMatrix * mvPosition;
            }
        \`;

        const atmosphereFragmentShader = \`
            uniform float uTime;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            void main() {
                vec3 normal = normalize(vNormal);
                vec3 viewDir = normalize(vViewPosition);
                float fresnel = dot(viewDir, normal);
                fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
                float glow = pow(fresnel, 4.0) * 1.5;
                glow *= 0.8 + sin(uTime * 1.0) * 0.2;
                gl_FragColor = vec4(0.6, 0.8, 1.0, glow);
            }
        \`;

        const particleVertexShader = \`
            uniform float uTime;
            attribute float aScale;
            attribute float aOffset;
            varying float vAlpha;
            void main() {
                vec3 p = position;
                float t = uTime * 0.2 + aOffset;
                float radius = length(p.xz);
                float angle = atan(p.z, p.x) + t * (3.0 / radius);
                p.x = radius * cos(angle);
                p.z = radius * sin(angle);
                p.y += sin(t * 3.0 + p.x) * 0.5;
                vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                gl_PointSize = aScale * (200.0 / -mvPosition.z);
                vAlpha = 0.8; 
            }
        \`;

        const particleFragmentShader = \`
            varying float vAlpha;
            void main() {
                float r = distance(gl_PointCoord, vec2(0.5));
                if (r > 0.5) discard;
                float glow = 1.0 - (r * 2.0);
                glow = pow(glow, 2.0);
                gl_FragColor = vec4(0.9, 0.95, 1.0, vAlpha * glow);
            }
        \`;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Start very distant
        const initialCamPos = new THREE.Vector3(0, 0, 35); 
        const targetCamPos = new THREE.Vector3(0, 0, 60); // Drift away
        camera.position.copy(initialCamPos);
        camera.lookAt(0,0,0);
        
        let introActive = true;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ReinhardToneMapping;
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enablePan = false;
        controls.enabled = false;

        const clock = new THREE.Clock();

        const moonGeo = new THREE.SphereGeometry(3, 128, 128);
        const moonMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: moonVertexShader,
            fragmentShader: moonFragmentShader
        });
        const moon = new THREE.Mesh(moonGeo, moonMat);
        scene.add(moon);

        const debrisCount = 500;
        const debrisGeo = new THREE.BufferGeometry();
        const debrisPos = [];
        for(let i=0; i<debrisCount; i++) {
            const r = 3.2 + Math.random() * 0.5; 
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            debrisPos.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
        }
        debrisGeo.setAttribute('position', new THREE.Float32BufferAttribute(debrisPos, 3));
        const debrisMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.6 });
        const debrisCloud = new THREE.Points(debrisGeo, debrisMat);
        scene.add(debrisCloud);

        const atmoGeo = new THREE.SphereGeometry(3.8, 64, 64);
        const atmoMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: atmosphereVertexShader,
            fragmentShader: atmosphereFragmentShader,
            transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false
        });
        const atmosphere = new THREE.Mesh(atmoGeo, atmoMat);
        scene.add(atmosphere);

        const geoGeo = new THREE.IcosahedronGeometry(4.5, 1);
        const geoMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: geoVertexShader,
            fragmentShader: geoFragmentShader,
            transparent: true, wireframe: true, blending: THREE.AdditiveBlending
        });
        const sacredGeo = new THREE.Mesh(geoGeo, geoMat);
        scene.add(sacredGeo);

        const innerGeoGeo = new THREE.DodecahedronGeometry(3.5, 0);
        const innerGeoMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: geoVertexShader,
            fragmentShader: geoFragmentShader,
            transparent: true, wireframe: true, blending: THREE.AdditiveBlending, opacity: 0.5
        });
        const innerSacredGeo = new THREE.Mesh(innerGeoGeo, innerGeoMat);
        scene.add(innerSacredGeo);

        function createRing(radius, count, width) {
            const geo = new THREE.BufferGeometry();
            const pos = [];
            const scales = [];
            const offsets = [];
            for(let i=0; i<count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const r = radius + (Math.random() - 0.5) * width;
                const x = Math.cos(angle) * r;
                const z = Math.sin(angle) * r;
                const y = (Math.random() - 0.5) * 0.5;
                pos.push(x, y, z);
                scales.push(Math.random());
                offsets.push(Math.random() * 100);
            }
            geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
            geo.setAttribute('aScale', new THREE.Float32BufferAttribute(scales, 1));
            geo.setAttribute('aOffset', new THREE.Float32BufferAttribute(offsets, 1));
            const mat = new THREE.ShaderMaterial({
                uniforms: { uTime: { value: 0 } },
                vertexShader: particleVertexShader,
                fragmentShader: particleFragmentShader,
                transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
            });
            return new THREE.Points(geo, mat);
        }

        const ring1 = createRing(6.0, 1200, 1.5); ring1.rotation.x = Math.PI * 0.15; scene.add(ring1);
        const ring2 = createRing(9.0, 1800, 2.5); ring2.rotation.x = -Math.PI * 0.2; ring2.rotation.z = Math.PI * 0.1; scene.add(ring2);
        const ring3 = createRing(12.0, 2200, 3.0); ring3.rotation.x = Math.PI * 0.3; ring3.rotation.z = -Math.PI * 0.1; scene.add(ring3);
        const ring4 = createRing(15.0, 2500, 4.0); ring4.rotation.x = -Math.PI * 0.1; ring4.rotation.z = Math.PI * 0.25; scene.add(ring4);
        const ring5 = createRing(18.0, 1500, 6.0); ring5.rotation.x = Math.PI * 0.05; ring5.rotation.z = -Math.PI * 0.2; scene.add(ring5);

        const monolithGeo = new THREE.BoxGeometry(0.1, 1.2, 0.1);
        const monolithMat = new THREE.MeshBasicMaterial({ color: 0xccddff, transparent: true, opacity: 0.8 });
        const monolithGroup = new THREE.Group();
        for(let i=0; i<8; i++) {
            const m = new THREE.Mesh(monolithGeo, monolithMat);
            const angle = (i / 8) * Math.PI * 2;
            const r = 5.0;
            m.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
            m.lookAt(0,0,0);
            monolithGroup.add(m);
        }
        scene.add(monolithGroup);

        const runeCount = 12;
        const runeGroup = new THREE.Group();
        const runeGeo = new THREE.PlaneGeometry(0.5, 0.5);
        const runeMat = new THREE.MeshBasicMaterial({ color: 0xaaccff, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
        for(let i=0; i<runeCount; i++) {
            const rune = new THREE.Mesh(runeGeo, runeMat);
            const angle = (i / runeCount) * Math.PI * 2;
            const r = 3.8;
            rune.position.set(Math.cos(angle) * r, Math.sin(angle*2.0)*0.5, Math.sin(angle) * r);
            rune.lookAt(0,0,0);
            runeGroup.add(rune);
        }
        scene.add(runeGroup);

        const words = ["MOON", "VOID", "DIVINE", "SOUL", "ETERNAL", "SILENCE", "LUNA", "ORBIT", "ECLIPSE", "ASCEND", "Ω", "☾", "★", "∞", "ETHER", "DREAM", "COSMOS", "LIGHT", "DARK", "TIME", "SPACE", "REALITY", "MYTH", "LEGEND", "GOD", "HOLY", "SACRED", "PURE"];
        const wordTextures = words.map(word => {
            const canvas = document.createElement('canvas');
            canvas.width = 512; canvas.height = 128;
            const ctx = canvas.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 512, 0);
            gradient.addColorStop(0, '#aaccff'); gradient.addColorStop(0.5, '#ffffff'); gradient.addColorStop(1, '#aaccff');
            ctx.font = 'bold 50px Cinzel'; ctx.fillStyle = gradient; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.shadowColor = '#0066ff'; ctx.shadowBlur = 20; ctx.fillText(word, 256, 64);
            ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 10; ctx.fillText(word, 256, 64);
            return new THREE.CanvasTexture(canvas);
        });

        const textGroup = new THREE.Group();
        for(let i=0; i<200; i++) {
            const wordIndex = Math.floor(Math.random() * words.length);
            const map = wordTextures[wordIndex];
            const material = new THREE.SpriteMaterial({ map: map, transparent: true, opacity: 0.7 });
            const sprite = new THREE.Sprite(material);
            const radius = 10 + Math.random() * 100;
            const theta = Math.random() * Math.PI * 10;
            const phi = Math.acos(2 * Math.random() - 1);
            sprite.position.set(radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi));
            const scale = 1 + Math.random() * 2;
            sprite.scale.set(scale * 3, scale * 0.75, 1);
            sprite.userData = { driftSpeed: 0.1 + Math.random() * 0.5, driftOffset: Math.random() * 100, radius: radius, theta: theta, phi: phi, wordIndex: wordIndex, changeTimer: Math.random() * 2 };
            textGroup.add(sprite);
        }
        scene.add(textGroup);

        const renderScene = new RenderPass(scene, camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0.2; bloomPass.strength = 1.2; bloomPass.radius = 0.5;
        const composer = new EffectComposer(renderer);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);

        function animate() {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();
            
            audioSystem.update(time);

            if (introActive) {
                const speed = 0.005;
                camera.position.lerp(targetCamPos, speed);
                camera.lookAt(0,0,0);
            } else {
                controls.update();
            }

            moonMat.uniforms.uTime.value = time;
            sacredGeo.material.uniforms.uTime.value = time;
            innerSacredGeo.material.uniforms.uTime.value = time;
            atmoMat.uniforms.uTime.value = time;
            ring1.material.uniforms.uTime.value = time;
            ring2.material.uniforms.uTime.value = time;
            ring3.material.uniforms.uTime.value = time;
            ring4.material.uniforms.uTime.value = time;
            ring5.material.uniforms.uTime.value = time;

            sacredGeo.rotation.y = time * 0.1;
            sacredGeo.rotation.z = time * 0.05;
            innerSacredGeo.rotation.y = time * -0.15;
            innerSacredGeo.rotation.x = time * 0.1;
            debrisCloud.rotation.y = time * 0.05;
            monolithGroup.rotation.y = time * -0.05;
            monolithGroup.children.forEach((m, i) => { m.position.y = Math.sin(time + i) * 0.8; });
            runeGroup.rotation.y = time * 0.2;
            runeGroup.rotation.x = Math.sin(time * 0.5) * 0.1;
            
            textGroup.children.forEach(sprite => {
                const ud = sprite.userData;
                ud.theta += ud.driftSpeed * 0.001;
                sprite.position.x = ud.radius * Math.sin(ud.phi) * Math.cos(ud.theta);
                sprite.position.z = ud.radius * Math.sin(ud.phi) * Math.sin(ud.theta);
                sprite.position.y = ud.radius * Math.cos(ud.phi) + Math.sin(time + ud.driftOffset) * 0.5;
                sprite.material.opacity = 0.4 + Math.sin(time * 2.0 + ud.driftOffset) * 0.3;
                ud.changeTimer -= delta;
                if(ud.changeTimer <= 0) {
                    ud.wordIndex = Math.floor(Math.random() * wordTextures.length);
                    sprite.material.map = wordTextures[ud.wordIndex];
                    ud.changeTimer = 2.0 + Math.random() * 3.0;
                }
            });

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
            title="Lunar Divinity"
        />
    );
};
