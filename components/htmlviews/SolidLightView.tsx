import React, { useMemo } from 'react';

export const SolidLightView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solid Light Ore - Rarity: Ultra-Rare</title>
    <!-- Sci-Fi Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;500;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #050505;
            overflow: hidden;
            font-family: 'Rajdhani', sans-serif;
            transition: background-color 3s ease;
        }
        body.critical {
            background-color: #1a0000;
        }
        canvas {
            display: block;
        }

        /* --- UI LAYOUT --- */
        #ui-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        /* --- RESTORED LOWER-LEFT GUI --- */
        #hud-panel {
            position: absolute;
            bottom: 20px;
            left: 20px;
            width: 200px;
            color: #fff;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);

            /* Removed background box and borders for "Old GUI" feel */
            background: transparent;
            border: none;

            opacity: 0;
            animation: slideIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards 0.5s;
        }

        @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        h1 {
            font-family: 'Orbitron', sans-serif;
            font-weight: 900;
            font-size: 1.5rem;
            margin: 0;
            letter-spacing: 2px;

            /* Restored Gradient Text */
            background: linear-gradient(90deg, #fff, #aaffff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;

            text-transform: uppercase;
            margin-bottom: 5px;
            min-height: 2.5rem;
        }

        .rarity {
            font-family: 'Share Tech Mono', monospace;
            color: #00ffff;
            font-size: 0.6rem;
            letter-spacing: 2px;
            margin-bottom: 15px;
            text-transform: uppercase;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            transition: color 0.5s;
        }
        .critical .rarity { color: #ff0044; text-shadow: 0 0 10px #ff0044; }

        /* --- INTEGRITY BAR --- */
        .integrity-container {
            margin-bottom: 15px;
            padding-right: 10px;
        }

        .integrity-label {
            font-size: 0.6rem;
            color: #aaffff;
            margin-bottom: 5px;
            display: flex;
            justify-content: space-between;
            font-weight: 700;
            transition: color 0.5s;
        }
        .critical .integrity-label { color: #ffaaaa; }

        .bar-track {
            height: 4px;
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            position: relative;
        }

        .bar-fill {
            height: 100%;
            background: #00ffff;
            width: 86%;
            box-shadow: 0 0 10px #00ffff;
            transition: width 0.1s linear, background-color 0.5s, box-shadow 0.5s;
        }
        .critical .bar-fill {
            background: #ff0044;
            box-shadow: 0 0 15px #ff0044;
        }

        /* --- STATS --- */
        .stats-grid {
            display: block; /* Stacked text like original */
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.65rem;
            color: #aaa;
            line-height: 1.6;
        }

        .stat-item {
            margin-bottom: 4px;
        }

        .stat-label {
            color: #88ccff;
            margin-right: 10px;
        }
        .critical .stat-label { color: #cc8888; }

        .stat-value {
            color: #fff;
            font-weight: bold;
        }

        /* --- WARNING FLASH --- */
        #warning-alert {
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ff0044;
            font-family: 'Orbitron', sans-serif;
            font-size: 1.8rem;
            font-weight: 900;
            border: 2px solid #ff0044;
            padding: 5px 20px;
            background: rgba(20, 0, 0, 0.8);
            opacity: 0;
            letter-spacing: 5px;
            pointer-events: none;
            transition: opacity 0.2s;
            text-shadow: 0 0 20px #ff0044;
            z-index: 10;
        }

        /* --- RETICLE (Kept centered) --- */
        .reticle {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 300px;
            height: 300px;
            transform: translate(-50%, -50%);
            border: 1px dashed rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            animation: spinReticle 60s linear infinite;
            transition: border-color 0.5s;
        }
        .critical .reticle { border-color: rgba(255, 0, 68, 0.3); animation-duration: 10s; }

        .reticle::before, .reticle::after {
            content: '';
            position: absolute;
            background: #00ffff;
            transition: background 0.5s;
        }
        .critical .reticle::before, .critical .reticle::after { background: #ff0044; }

        .reticle::before { top: 0; left: 50%; width: 1px; height: 10px; transform: translateX(-50%); }
        .reticle::after { bottom: 0; left: 50%; width: 1px; height: 10px; transform: translateX(-50%); }

        .reticle-inner {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 150px;
            height: 150px;
            transform: translate(-50%, -50%);
            border: 1px solid rgba(0, 255, 255, 0.2);
            border-radius: 50%;
            border-left-color: transparent;
            border-right-color: transparent;
            animation: spinReticle 10s linear infinite reverse;
            transition: border-color 0.5s;
        }
        .critical .reticle-inner { border-color: rgba(255, 0, 68, 0.4); border-left-color: transparent; border-right-color: transparent; animation-duration: 2s; }

        @keyframes spinReticle {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        #loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-family: 'Orbitron', sans-serif;
            letter-spacing: 4px;
            animation: pulse 1s infinite;
        }
        @keyframes pulse { 0% { opacity: 0.5; } 100% { opacity: 1; } }

        #phase-timer {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Share Tech Mono', monospace;
            color: #888;
            font-size: 0.6rem;
        }

    </style>
</head>
<body>
    <div id="loading">GENERATING PHOTON MATRIX...</div>
    <div id="warning-alert">CRITICAL MASS</div>

    <div id="ui-layer">
        <div id="phase-timer">T-MINUS 15s</div>

        <div class="reticle"></div>
        <div class="reticle-inner"></div>

        <div id="hud-panel">
            <h1 id="main-title">SOLID LIGHT ORE</h1>
            <div class="rarity" id="sub-title">CLASS: PHOTONIC PARADOX</div>

            <div class="integrity-container">
                <div class="integrity-label">
                    <span>FIELD INTEGRITY</span>
                    <span id="integrity-text">100%</span>
                </div>
                <div class="bar-track">
                    <div class="bar-fill" id="integrity-bar"></div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-label">LUMINOSITY:</span>
                    <span class="stat-value" id="stat-lum">INF</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">FREQUENCY:</span>
                    <span class="stat-value" id="stat-freq">450.0 THz</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">DROP RATE:</span>
                    <span class="stat-value">1:600,000,000</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">STATE:</span>
                    <span class="stat-value" id="stat-state" style="color:#ffaa00">UNSTABLE</span>
                </div>
            </div>
        </div>
    </div>

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
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

        // --- AUDIO ENGINE ---
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let droneOsc, droneGain;
        let lfoOsc, lfoGain;
        let isAudioInit = false;

        function initAudio() {
            if (isAudioInit) return;

            audioContext.resume();

            // 1. BASE DRONE (The "Singularity" Hum)
            droneOsc = audioContext.createOscillator();
            droneOsc.type = 'sawtooth'; // Rougher sound than sine
            droneOsc.frequency.value = 55; // Low A

            // Lowpass filter to muffle the sawtooth
            const droneFilter = audioContext.createBiquadFilter();
            droneFilter.type = 'lowpass';
            droneFilter.frequency.value = 200;

            droneGain = audioContext.createGain();
            droneGain.gain.value = 0.1; // Start quiet

            // LFO for pulsing the drone
            lfoOsc = audioContext.createOscillator();
            lfoOsc.type = 'sine';
            lfoOsc.frequency.value = 0.5; // Slow pulse
            lfoGain = audioContext.createGain();
            lfoGain.gain.value = 30; // Modulate volume/filter

            // Connections
            droneOsc.connect(droneFilter);
            droneFilter.connect(droneGain);
            droneGain.connect(audioContext.destination);

            lfoOsc.connect(lfoGain);
            lfoGain.connect(droneFilter.frequency); // Pulse the filter

            droneOsc.start();
            lfoOsc.start();

            isAudioInit = true;
        }

        // Trigger random "Spark" sounds
        function playSparkSound() {
            if (!isAudioInit) return;

            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.type = 'sine';
            // Random high pitch
            osc.frequency.setValueAtTime(800 + Math.random() * 2000, audioContext.currentTime);
            // Quick drop in pitch (glassy sound)
            osc.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);

            gain.gain.setValueAtTime(0.05, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.start();
            osc.stop(audioContext.currentTime + 0.15);
        }

        setTimeout(initAudio, 500);


        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050508);
        scene.fog = new THREE.FogExp2(0x050508, 0.02);

        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 25); // Start far away

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ReinhardToneMapping;
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.minDistance = 3;
        controls.maxDistance = 15;
        controls.enabled = false; // Disable for intro

        // Interaction State
        const mouse = new THREE.Vector2();
        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // --- THE PHOTON SHADER ---
        const vertexShader = \`
            uniform float uTime;
            uniform float uPhase;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying float vNoise;

            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float snoise(vec3 v) {
                const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                vec3 i  = floor(v + dot(v, C.yyy));
                vec3 x0 = v - i + dot(i, C.xxx);
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min(g.xyz, l.zxy);
                vec3 i2 = max(g.xyz, l.zxy);
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                i = mod289(i);
                vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                float n_ = 0.142857142857;
                vec3 ns = n_ * D.wyz - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_);
                vec4 x = x_ * ns.x + ns.yyyy;
                vec4 y = y_ * ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                vec4 b0 = vec4(x.xy, y.xy);
                vec4 b1 = vec4(x.zw, y.zw);
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
            }

            void main() {
                vNormal = normalize(normalMatrix * normal);

                // PHASE LOGIC: Increase speed and distortion magnitude
                float speed = 2.0 + uPhase * 8.0;
                float amp = 0.1 + uPhase * 0.3;
                float distortAmp = 0.2 + uPhase * 0.5;

                float pulse = sin(uTime * speed) * amp;
                float distort = snoise(position * 2.0 + uTime * (0.5 + uPhase * 2.0)) * distortAmp;

                vec3 spherePos = normalize(position);
                float morphFactor = (sin(uTime * 0.8) + 1.0) * 0.5;

                // More aggressive morph in phase 2
                vec3 finalPos = mix(position, spherePos * 1.5, morphFactor * 0.3 + uPhase * 0.2);
                finalPos += normal * (pulse + distort);

                vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
                vViewPosition = -mvPosition.xyz;
                gl_Position = projectionMatrix * mvPosition;

                vNoise = distort;
            }
        \`;

        const fragmentShader = \`
            uniform float uTime;
            uniform float uPhase;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying float vNoise;

            void main() {
                vec3 viewDir = normalize(vViewPosition);
                vec3 normal = normalize(vNormal);
                float fresnel = dot(viewDir, normal);
                fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
                fresnel = pow(fresnel, 3.0);

                float t = fresnel + uTime * (0.2 + uPhase);
                // Base Rainbow
                vec3 rainbow = 0.5 + 0.5 * cos(6.28318 * (vec3(1.0) * t + vec3(0.00, 0.33, 0.67)));

                // Critical Red Shift
                vec3 dangerColor = vec3(1.0, 0.1, 0.05); // Hot red
                vec3 goldColor = vec3(1.0, 0.8, 0.0);

                // Mix based on uPhase
                vec3 phaseColor = mix(rainbow, dangerColor + goldColor * vNoise, uPhase);

                vec3 finalColor = mix(vec3(1.2 + uPhase), phaseColor * (2.0 + uPhase * 2.0), fresnel);
                finalColor += vNoise * 0.2;

                gl_FragColor = vec4(finalColor, 1.0);
            }
        \`;

        const oreMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPhase: { value: 0 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide
        });

        // --- GEOMETRY ---
        const oreGeometry = new THREE.DodecahedronGeometry(1.5, 0);
        const oreMesh = new THREE.Mesh(oreGeometry, oreMaterial);
        scene.add(oreMesh);

        // --- CONTAINMENT CAGE ---
        const cageGeo = new THREE.IcosahedronGeometry(2.2, 1);
        const cageMat = new THREE.MeshBasicMaterial({
            color: 0x88ccff, wireframe: true, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending
        });
        const cageMesh = new THREE.Mesh(cageGeo, cageMat);
        scene.add(cageMesh);

        // --- PARTICLES ---
        const particleCount = 1200;
        const particleGeo = new THREE.BufferGeometry();
        const particlePos = new Float32Array(particleCount * 3);
        const particleLife = new Float32Array(particleCount);
        for(let i=0; i<particleCount; i++){
            const r = 2.0 + Math.random() * 2.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            particlePos[i*3] = r * Math.sin(phi) * Math.cos(theta);
            particlePos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            particlePos[i*3+2] = r * Math.cos(phi);
            particleLife[i] = Math.random();
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
        particleGeo.setAttribute('life', new THREE.BufferAttribute(particleLife, 1));
        const particleMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 }, color: { value: new THREE.Color(0xaaffff) } },
            vertexShader: \`
                uniform float uTime;
                attribute float life;
                varying float vAlpha;
                void main() {
                    vec3 pos = position;
                    float angle = uTime * 0.3 * (1.0 + life * 0.5);
                    float c = cos(angle); float s = sin(angle);
                    vec3 rotated = pos;
                    if (life > 0.5) rotated = vec3(pos.x*c - pos.z*s, pos.y, pos.x*s + pos.z*c);
                    else rotated = vec3(pos.x, pos.y*c - pos.z*s, pos.y*s + pos.z*c);
                    vec4 mvPosition = modelViewMatrix * vec4(rotated, 1.0);
                    gl_PointSize = (3.0 * life + 1.0) * (8.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                    vAlpha = 0.6 + 0.4 * sin(uTime * 8.0 + life * 100.0);
                }
            \`,
            fragmentShader: \`
                uniform vec3 color;
                varying float vAlpha;
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    gl_FragColor = vec4(color, vAlpha * (1.0 - dist*2.0));
                }
            \`,
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // --- RAYS ---
        const raysGroup = new THREE.Group();
        const rayGeo = new THREE.PlaneGeometry(3, 12);
        const rayMaterial = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 }, color: { value: new THREE.Color(0xaaffff) } },
            vertexShader: \`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }\`,
            fragmentShader: \`
                uniform vec3 color; uniform float uTime; varying vec2 vUv;
                void main() {
                    float opacity = (1.0 - abs(vUv.x * 2.0 - 1.0)) * (1.0 - vUv.y);
                    opacity = pow(opacity, 2.0);
                    float flicker = sin(uTime * 5.0 + vUv.y * 10.0) * 0.1 + 0.9;
                    gl_FragColor = vec4(color, opacity * 0.4 * flicker);
                }
            \`,
            transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending
        });
        for (let i = 0; i < 6; i++) {
            const ray = new THREE.Mesh(rayGeo, rayMaterial);
            ray.position.set(0, 0, 0); ray.geometry.translate(0, 6, 0);
            ray.rotation.z = (i / 6) * Math.PI * 2; ray.rotation.y = Math.random() * Math.PI;
            raysGroup.add(ray);
        }
        scene.add(raysGroup);

        // --- FLARE ---
        const flareGeo = new THREE.PlaneGeometry(20, 0.4);
        const flareMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 }, color: { value: new THREE.Color(0x88ccff) } },
            vertexShader: \`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }\`,
            fragmentShader: \`
                uniform vec3 color; varying vec2 vUv;
                void main() {
                    float strength = 1.0 - abs(vUv.x * 2.0 - 1.0); strength = pow(strength, 4.0);
                    float vFade = 1.0 - abs(vUv.y * 2.0 - 1.0); vFade = pow(vFade, 2.0);
                    gl_FragColor = vec4(color, strength * vFade * 0.6);
                }
            \`,
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
        });
        const flare = new THREE.Mesh(flareGeo, flareMat);
        scene.add(flare);

        // --- POST PROCESS ---
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 3.0, 1.0, 0.1));

        // --- UI ANIMATION LOGIC ---

        class TextScramble {
            constructor(el) {
                this.el = el;
                this.chars = '!<>-_\\\\/[]{}—=+*^?#________';
                this.update = this.update.bind(this);
            }
            setText(newText) {
                const oldText = this.el.innerText;
                const length = Math.max(oldText.length, newText.length);
                const promise = new Promise((resolve) => this.resolve = resolve);
                this.queue = [];
                for (let i = 0; i < length; i++) {
                    const from = oldText[i] || '';
                    const to = newText[i] || '';
                    const start = Math.floor(Math.random() * 40);
                    const end = start + Math.floor(Math.random() * 40);
                    this.queue.push({ from, to, start, end });
                }
                cancelAnimationFrame(this.frameRequest);
                this.frame = 0;
                this.update();
                return promise;
            }
            update() {
                let output = '';
                let complete = 0;
                for (let i = 0, n = this.queue.length; i < n; i++) {
                    let { from, to, start, end, char } = this.queue[i];
                    if (this.frame >= end) {
                        complete++;
                        output += to;
                    } else if (this.frame >= start) {
                        if (!char || Math.random() < 0.28) {
                            char = this.randomChar();
                            this.queue[i].char = char;
                        }
                        output += \`<span class="dud">\${char}</span>\`;
                    } else {
                        output += from;
                    }
                }
                this.el.innerHTML = output;
                if (complete === this.queue.length) {
                    this.resolve();
                } else {
                    this.frameRequest = requestAnimationFrame(this.update);
                    this.frame++;
                }
            }
            randomChar() {
                return this.chars[Math.floor(Math.random() * this.chars.length)];
            }
        }

        const titleScramble = new TextScramble(document.getElementById('main-title'));
        const subScramble = new TextScramble(document.getElementById('sub-title'));

        setTimeout(() => {
            titleScramble.setText('SOLID LIGHT ORE');
            subScramble.setText('CLASS: PHOTONIC PARADOX');
        }, 1000);

        // --- ANIMATION LOOP ---
        const clock = new THREE.Clock();
        const integrityBar = document.getElementById('integrity-bar');
        const integrityText = document.getElementById('integrity-text');
        const statLum = document.getElementById('stat-lum');
        const statFreq = document.getElementById('stat-freq');
        const statState = document.getElementById('stat-state');
        const warningAlert = document.getElementById('warning-alert');
        const uiLayer = document.getElementById('ui-layer');
        const timerText = document.getElementById('phase-timer');

        let phase2Active = false;

        // Define Timing Constants
        const START_PHASE_2 = 15.0; // Start Phase 2 at 15s
        const END_PHASE_2 = 30.0;   // End Phase 2 at 30s (Duration 15s)

        let introComplete = false;

        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            // --- CAMERA INTRO ---
            if (!introComplete) {
                camera.position.z += (9 - camera.position.z) * 0.02; // Smooth lerp
                if (Math.abs(camera.position.z - 9) < 0.1) {
                    introComplete = true;
                    controls.enabled = true;
                }
            }

            // --- PHASE CALCULATIONS ---
            let currentPhase = 0;

            if (time > START_PHASE_2 && time <= END_PHASE_2) {
                 // Transition IN (3s ramp) and Hold
                 currentPhase = Math.min((time - START_PHASE_2) / 3.0, 1.0);
            } else if (time > END_PHASE_2) {
                 // Transition OUT (3s ramp) and Hold at 0
                 currentPhase = Math.max(1.0 - (time - END_PHASE_2) / 3.0, 0.0);
            }

            // --- STATE MANAGEMENT ---

            // Trigger PHASE 2
            if (time > START_PHASE_2 && time < END_PHASE_2 && !phase2Active) {
                phase2Active = true;

                document.body.classList.add('critical');
                statState.innerText = "CRITICAL MASS";
                titleScramble.setText("SYSTEM FAILURE");
                timerText.innerText = "BREACH IMMINENT";
            }

            // Trigger PHASE 1 RETURN
            if (time > END_PHASE_2 && phase2Active) {
                phase2Active = false;

                document.body.classList.remove('critical');
                statState.innerText = "UNSTABLE";
                titleScramble.setText("SOLID LIGHT ORE");
                timerText.innerText = "STABILIZING...";
            }

            // Final Cleanup
            if (time > END_PHASE_2 + 3.0 && timerText.innerText !== "FIELD STABLE") {
                 timerText.innerText = "FIELD STABLE";
            }

            // Timer Display (Countdown)
            if (time < START_PHASE_2) {
                timerText.innerText = \`T-MINUS \${(START_PHASE_2 - time).toFixed(1)}s\`;
            }

            // --- AUDIO UPDATE ---
            if (isAudioInit && droneOsc) {
                // Modulate pitch based on Phase
                // Base 55hz -> 110hz at full critical
                const targetFreq = 55 + (currentPhase * 55);
                // Smooth transition
                droneOsc.frequency.setTargetAtTime(targetFreq, audioContext.currentTime, 0.1);

                // Increase pulsing speed
                lfoOsc.frequency.value = 0.5 + (currentPhase * 5.0);

                // Random Sparking
                // Chance increases with phase (0.01 base -> 0.05 critical)
                if (Math.random() < (0.01 + currentPhase * 0.04)) {
                    playSparkSound();
                }
            }


            // Update Shader Uniforms
            oreMaterial.uniforms.uTime.value = time;
            oreMaterial.uniforms.uPhase.value = currentPhase;
            rayMaterial.uniforms.uTime.value = time;
            flareMat.uniforms.uTime.value = time;
            particleMat.uniforms.uTime.value = time * (1.0 + currentPhase * 3.0); // Particles speed up

            // Change Ray Colors to Red in Phase 2
            if (currentPhase > 0) {
                 const baseC = new THREE.Color(0xaaffff);
                 const dangerC = new THREE.Color(0xff4422);
                 const mixed = baseC.lerp(dangerC, currentPhase);
                 rayMaterial.uniforms.color.value = mixed;
                 particleMat.uniforms.color.value = mixed;
                 flareMat.uniforms.color.value = new THREE.Color(0x88ccff).lerp(new THREE.Color(0xff2222), currentPhase);
            }

            // 3D Motion
            const targetX = mouse.y * 0.5;
            const targetY = mouse.x * 0.5;
            oreMesh.rotation.x += 0.005 + (targetX - oreMesh.rotation.x) * 0.05 + currentPhase * 0.05;
            oreMesh.rotation.y += 0.01 + (targetY - oreMesh.rotation.y) * 0.05 + currentPhase * 0.1;

            cageMesh.rotation.x -= 0.002; cageMesh.rotation.y -= 0.004;
            // Expand cage in Phase 2
            const cageScale = 1.0 + currentPhase * 0.5 + Math.sin(time * 10) * currentPhase * 0.05;
            cageMesh.scale.set(cageScale, cageScale, cageScale);

            raysGroup.rotation.z = time * 0.05; raysGroup.rotation.x = Math.sin(time * 0.2) * 0.1;
            flare.lookAt(camera.position);

            // --- UI LIVE UPDATES ---

            // Fluctuating Integrity
            // In Phase 2, integrity drops to 0
            const noise = Math.sin(time * 10) * Math.cos(time * 23);
            let integrity = 86 + noise * 5;

            if (currentPhase > 0) {
                integrity = Math.max(0, 86 * (1.0 - currentPhase) + noise * 10 * currentPhase);
            } else {
                if (Math.random() > 0.98) integrity -= 20;
            }

            if (integrity < 70 || currentPhase > 0) {
                warningAlert.style.opacity = (currentPhase > 0.8 || integrity < 70) ? 1 : 0;
            } else {
                warningAlert.style.opacity = 0;
            }

            integrityBar.style.width = \`\${Math.max(0, Math.min(100, integrity))}%\`;
            integrityText.innerText = \`\${Math.floor(integrity)}%\`;

            // Fluctuating Stats
            if (Math.random() > 0.8) {
                // Freq spikes in Phase 2
                const baseFreq = 450 + currentPhase * 5000;
                const freq = baseFreq + (Math.random() - 0.5) * (50 + currentPhase * 200);
                statFreq.innerText = freq.toFixed(1) + " THz";
            }
            if (Math.random() > 0.9) {
                const lum = Math.random() > 0.5 ? "INF" : "ERR_OVERFLOW";
                statLum.innerText = lum;
            }

            controls.update();
            composer.render();
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        });

        document.getElementById('loading').style.display = 'none';
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
            title="Solid Light Ore"
        />
    );
};
