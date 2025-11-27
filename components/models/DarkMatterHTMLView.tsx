import React, { useMemo } from 'react';

export const DarkMatterHTMLView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dark Matter 150M - LEGENDARY ASSET</title>
    <!-- Import Sci-Fi Font -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;500;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            overflow: hidden;
            background-color: #000000;
            font-family: 'Rajdhani', sans-serif;
        }
        canvas { display: block; }
        
        /* --- HUD UI --- */
        #hud {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            box-sizing: border-box;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            z-index: 20;
        }

        .hud-panel {
            background: rgba(5, 0, 15, 0.4);
            border: 1px solid rgba(130, 0, 255, 0.3);
            border-left: 2px solid #aa00ff;
            padding: 15px;
            backdrop-filter: blur(4px);
            width: fit-content;
            min-width: 200px;
            box-shadow: 0 0 20px rgba(110, 0, 255, 0.1);
            border-radius: 4px;
            margin-bottom: 10px;
            pointer-events: auto; /* Allow clicking buttons */
        }

        .hud-content {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        h1 {
            font-family: 'Orbitron', sans-serif;
            margin: 0 0 5px 0;
            font-size: 18px;
            color: #ffffff;
            letter-spacing: 1px;
            text-shadow: 0 0 10px rgba(180, 0, 255, 0.8);
        }

        .stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            font-size: 13px;
            color: #dcb3ff;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            padding-bottom: 4px;
        }

        .stat-value {
            color: #bd00ff;
            font-weight: 700;
            font-family: 'Orbitron', monospace;
            text-shadow: 0 0 5px rgba(189, 0, 255, 0.5);
        }

        .warning {
            color: #ff0055;
            animation: blink 0.5s infinite alternate;
        }
        
        .status-ok {
            color: #00ff88;
        }

        .graph-container {
            margin-top: 10px;
            height: 20px;
            display: flex;
            align-items: flex-end;
            gap: 2px;
            opacity: 0.6;
        }
        .bar {
            flex: 1;
            background: #9d00ff;
            animation: graphAnim 2s infinite ease-in-out;
        }

        /* Audio Button Style */
        .audio-btn {
            background: transparent;
            border: 1px solid #aa00ff;
            color: #aa00ff;
            font-family: 'Orbitron', sans-serif;
            font-size: 12px;
            padding: 8px 12px;
            cursor: pointer;
            text-transform: uppercase;
            transition: all 0.3s ease;
            margin-top: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .audio-btn:hover {
            background: rgba(170, 0, 255, 0.2);
            box-shadow: 0 0 10px rgba(170, 0, 255, 0.4);
        }
        .audio-btn.active {
            background: #aa00ff;
            color: #000;
            box-shadow: 0 0 15px #aa00ff;
        }

        @keyframes blink { from { opacity: 0.6; } to { opacity: 1.0; text-shadow: 0 0 10px #ff0055; } }
        @keyframes graphAnim { 0%, 100% { height: 20%; opacity: 0.3; } 50% { height: 80%; opacity: 0.9; } }

        #vignette {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle, transparent 40%, #000000 130%);
            pointer-events: none;
            z-index: 10;
        }
    </style>
</head>
<body>
    <div id="vignette"></div>
    
    <div id="hud">
        <div class="hud-panel">
            <div class="hud-content">
                <h1>DARK MATTER ORE</h1>
                <div class="stat-row">
                    <span>CHANCE</span>
                    <span class="stat-value">1 in 150,000,000</span>
                </div>
                <div class="stat-row">
                    <span>STATUS</span>
                    <span class="stat-value warning">UNSTABLE</span>
                </div>
                <div class="graph-container" id="graph">
                    <!-- Bars injected by JS -->
                </div>
                
                <button id="audioToggle" class="audio-btn">
                    <span>🔇</span> INITIALIZE AUDIO
                </button>
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

        // --- UI SETUP ---
        const graphContainer = document.getElementById('graph');
        for(let i=0; i<20; i++) {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.animationDelay = \`\${Math.random() * 2}s\`;
            bar.style.height = \`\${Math.random() * 80 + 20}%\`;
            if (Math.random() > 0.8) bar.style.backgroundColor = '#ffffff';
            graphContainer.appendChild(bar);
        }

        // --- CONFIGURATION ---
        const CONFIG = {
            oreRadius: 2.0,
            oreSegments: 256,
            bloomStrength: 2.5,
            bloomRadius: 0.8,
            bloomThreshold: 0.1,
            colors: {
                voidBlack: new THREE.Color(0x000000), 
                deepIndigo: new THREE.Color(0x2a004d),
                neonViolet: new THREE.Color(0x7b00ff),
                pureWhite: new THREE.Color(0xffffff)
            }
        };

        // --- AUDIO ENGINE (Web Audio API) ---
        class VoidAudio {
            constructor() {
                this.ctx = null;
                this.masterGain = null;
                this.oscillators = [];
                this.isPlaying = false;
            }

            init() {
                if (this.ctx) return;
                
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioContext();
                
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.value = 0.3; // Base volume
                this.masterGain.connect(this.ctx.destination);

                // Create a deep drone
                // Osc 1: Deep Bass
                this.createOscillator(55, 'sine', 0.6);
                // Osc 2: Slightly detuned for beating
                this.createOscillator(55.5, 'sine', 0.5);
                // Osc 3: Sub-bass
                this.createOscillator(27.5, 'triangle', 0.2);
                
                // Add a filter to simulate underwater/void
                this.filter = this.ctx.createBiquadFilter();
                this.filter.type = 'lowpass';
                this.filter.frequency.value = 200;
                this.filter.Q.value = 1;
                
                // Re-route master gain through filter
                this.masterGain.disconnect();
                this.masterGain.connect(this.filter);
                this.filter.connect(this.ctx.destination);
                
                this.isPlaying = true;
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
                this.oscillators.push({ osc, gain });
            }

            toggle() {
                if (!this.ctx) {
                    this.init();
                    return true;
                }
                
                if (this.ctx.state === 'suspended') {
                    this.ctx.resume();
                    this.isPlaying = true;
                } else {
                    this.ctx.suspend();
                    this.isPlaying = false;
                }
                return this.isPlaying;
            }
            
            update(time) {
                if(!this.isPlaying || !this.filter) return;
                // Modulate filter to make the void "breathe"
                this.filter.frequency.value = 200 + Math.sin(time * 0.5) * 50;
            }
        }

        const audioSystem = new VoidAudio();
        const audioBtn = document.getElementById('audioToggle');
        
        audioBtn.addEventListener('click', () => {
            const playing = audioSystem.toggle();
            if (playing) {
                audioBtn.innerHTML = '<span>🔊</span> SOUND ACTIVE';
                audioBtn.classList.add('active');
            } else {
                audioBtn.innerHTML = '<span>🔇</span> SOUND MUTED';
                audioBtn.classList.remove('active');
            }
        });


        // --- GLSL NOISE ---
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
            
            // Random hash for glitter
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }
        \`;

        // --- ORE SHADER (HIGH DETAIL UPGRADE) ---
        const oreVertexShader = \`
            uniform float uTime;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying float vDisplacement;
            varying float vDetailNoise;
            varying vec3 vWorldPosition;

            \${noiseGLSL}

            void main() {
                vNormal = normalize(normalMatrix * normal);
                vec4 worldPos = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPos.xyz;
                
                // Layer 1: Macro shape (Slow breathing liquid)
                float macro = snoise(position * 1.2 + uTime * 0.3);
                
                // Layer 2: Crystalline Ridges (Sharp edges)
                // We use abs() to create creases where noise crosses 0
                float ridges = 1.0 - abs(snoise(position * 3.5 - uTime * 0.5));
                ridges = pow(ridges, 2.0); // Sharpen the ridges
                
                // Layer 3: Micro Detail (Roughness)
                float micro = snoise(position * 8.0 + uTime * 1.0);
                
                // Combine layers
                float totalDisplacement = (macro * 0.4) + (ridges * 0.25) + (micro * 0.05);
                
                vDisplacement = totalDisplacement;
                vDetailNoise = micro; // Pass for surface texture

                // Apply displacement
                vec3 newPosition = position + normal * totalDisplacement;
                vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
                vViewPosition = -mvPosition.xyz;
                gl_Position = projectionMatrix * mvPosition;
            }
        \`;

        const oreFragmentShader = \`
            uniform vec3 uColorVoid;
            uniform vec3 uColorIndigo;
            uniform vec3 uColorViolet;
            uniform float uTime;
            
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying float vDisplacement;
            varying float vDetailNoise;
            varying vec3 vWorldPosition;
            
            \${noiseGLSL}

            void main() {
                vec3 normal = normalize(vNormal);
                vec3 viewDir = normalize(vViewPosition);
                
                // 1. Fresnel Rim (The Containment Field)
                float fresnel = dot(viewDir, normal);
                fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
                float rimPower = pow(fresnel, 3.0);
                
                // 2. Internal Energy Cracks (Veins)
                // We use the displacement map. High points = cool crust, Low points = hot energy.
                float cracks = smoothstep(0.2, -0.2, vDisplacement); // Invert: low spots glow
                vec3 energyColor = mix(uColorIndigo, uColorViolet, cracks);
                
                // 3. Stardust Glitter (The Galaxy Inside)
                // View-dependent reflection for sparkling effect
                vec3 r = reflect(-viewDir, normal);
                float sparkleNoise = random(floor(r.xy * 200.0) + floor(vWorldPosition.xy * 10.0));
                float sparkle = smoothstep(0.98, 1.0, sparkleNoise) * (1.0 - fresnel); // Only sparkle in center
                
                // 4. Composition
                vec3 baseColor = uColorVoid;
                
                // Add glitter to base
                baseColor += vec3(0.6, 0.8, 1.0) * sparkle * 2.0;
                
                // Add Energy Cracks (pulsing)
                float pulse = sin(uTime * 4.0) * 0.5 + 0.5;
                vec3 veinGlow = energyColor * cracks * (1.5 + pulse);
                
                // Add Rim
                vec3 rimGlow = uColorViolet * rimPower * 4.0;
                
                vec3 finalColor = baseColor + veinGlow + rimGlow;

                // Tone mapping/clamping handled by renderer, but let's ensure safety
                gl_FragColor = vec4(finalColor, 1.0);
            }
        \`;

        // --- JELLYFISH SHADERS ---
        const jellyVertexShader = \`
            uniform float uTime;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec2 vUv;
            varying float vDisplacement;

            \${noiseGLSL}
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                
                vec3 p = position;
                
                // Biological Pulse Contraction
                float pulse = sin(uTime * 2.5) * 0.5 + 0.5;
                float bottomFactor = smoothstep(1.0, -0.5, p.y);
                float contraction = bottomFactor * pulse * 0.15;
                p -= normal * contraction;
                
                // Surface Ripple Noise
                float noiseVal = snoise(p * 2.0 + uTime * 0.5);
                p += normal * noiseVal * 0.05;
                vDisplacement = noiseVal;

                vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
                vViewPosition = -mvPosition.xyz;
                gl_Position = projectionMatrix * mvPosition;
            }
        \`;

        const jellyFragmentShader = \`
            uniform float uTime;
            uniform vec3 uColorGlow;  // New uniform
            uniform vec3 uColorPulse; // New uniform
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec2 vUv;
            varying float vDisplacement;

            void main() {
                vec3 normal = normalize(vNormal);
                vec3 viewDir = normalize(vViewPosition);
                
                float fresnel = 1.0 - dot(viewDir, normal);
                fresnel = pow(fresnel, 1.5);
                
                float veins = smoothstep(0.4, 0.6, vDisplacement);
                
                vec3 colorBase = vec3(0.0, 0.1, 0.2); // Darker base
                
                // Use uniforms for colors
                float beat = sin(uTime * 2.5) * 0.5 + 0.5;
                vec3 activeGlow = mix(uColorGlow, uColorPulse, beat * veins);
                
                vec3 finalColor = mix(colorBase, activeGlow, fresnel);
                finalColor += activeGlow * veins * 0.5; 
                
                float alpha = fresnel * 0.8 + 0.1;
                
                gl_FragColor = vec4(finalColor, alpha);
            }
        \`;

        // --- NEBULA BACKGROUND SHADERS ---
        const nebulaVertexShader = \`
            varying vec3 vWorldPosition;
            void main() {
                vWorldPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        \`;

        const nebulaFragmentShader = \`
            uniform float uTime;
            varying vec3 vWorldPosition;
            
            \${noiseGLSL}

            // Fractal Brownian Motion (FBM) for cloud details
            float fbm(vec3 x) {
                float v = 0.0;
                float a = 0.5;
                vec3 shift = vec3(100.0);
                for (int i = 0; i < 4; ++i) { // 4 Octaves
                    v += a * snoise(x);
                    x = x * 2.0 + shift;
                    a *= 0.5;
                }
                return v;
            }

            void main() {
                // Normalize position to get direction on sphere
                vec3 p = normalize(vWorldPosition);
                
                // Slow rotation
                float t = uTime * 0.05;
                vec3 q = p + vec3(t * 0.1, t * 0.2, 0.0);
                
                // Generate Noise Clouds
                float cloud = fbm(q * 3.0);
                
                // Secondary layer for density
                float density = fbm(q * 6.0 + vec3(5.2));
                
                // Color Mapping
                // Dark Void
                vec3 c1 = vec3(0.0, 0.0, 0.05); 
                // Deep Purple Nebula
                vec3 c2 = vec3(0.1, 0.0, 0.2);
                // Highlight Violet
                vec3 c3 = vec3(0.3, 0.0, 0.6);
                
                // Mix colors based on noise
                vec3 finalColor = mix(c1, c2, cloud + 0.2);
                finalColor = mix(finalColor, c3, density * cloud);
                
                // Add star-like grit
                float grit = snoise(p * 50.0);
                if(grit > 0.9) finalColor += vec3(0.5);

                gl_FragColor = vec4(finalColor, 1.0);
            }
        \`;


        // --- PARTICLE AURA SHADER ---
        const particleVertexShader = \`
            uniform float uTime;
            attribute float aScale;
            attribute float aOffset;
            varying float vAlpha;

            void main() {
                vec3 p = position;
                
                float t = uTime * 0.5 + aOffset;
                float radius = length(p.xz);
                
                float angle = atan(p.z, p.x) - t * (2.0 / radius);
                
                float r = radius;
                p.x = r * cos(angle);
                p.z = r * sin(angle);
                p.y += sin(t * 2.0) * 0.2;

                vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                
                gl_PointSize = aScale * (300.0 / -mvPosition.z);
                
                float dist = length(p);
                vAlpha = smoothstep(2.5, 3.5, dist); 
            }
        \`;

        const particleFragmentShader = \`
            varying float vAlpha;
            void main() {
                float r = distance(gl_PointCoord, vec2(0.5));
                if (r > 0.5) discard;
                float glow = 1.0 - (r * 2.0);
                glow = pow(glow, 2.0);
                gl_FragColor = vec4(0.8, 0.2, 1.0, vAlpha * glow);
            }
        \`;

        // --- CHROMATIC ABERRATION SHADER ---
        const aberrationShader = {
            uniforms: {
                "tDiffuse": { value: null },
                "amount":   { value: 0.002 }
            },
            vertexShader: \`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            \`,
            fragmentShader: \`
                uniform sampler2D tDiffuse;
                uniform float amount;
                varying vec2 vUv;
                void main() {
                    vec2 uv = vUv;
                    // Separate channels based on distance from center
                    float dist = distance(uv, vec2(0.5));
                    float offset = amount * dist * 2.0; 
                    
                    float r = texture2D(tDiffuse, uv + vec2(offset, 0.0)).r;
                    float g = texture2D(tDiffuse, uv).g;
                    float b = texture2D(tDiffuse, uv - vec2(offset, 0.0)).b;
                    
                    gl_FragColor = vec4(r, g, b, 1.0);
                }
            \`
        };

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
        
        // CAMERA INTRO SETTINGS
        const initialCamPos = new THREE.Vector3(0, 20, 40); // High and far
        const targetCamPos = new THREE.Vector3(0, 0, 7);    // Final inspection pos
        camera.position.copy(initialCamPos);
        camera.lookAt(0,0,0);
        
        let introActive = true;
        let introProgress = 0;

        const renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ReinhardToneMapping;
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = false; 
        controls.enablePan = false;
        controls.enabled = false; // Disable during intro

        const clock = new THREE.Clock();

        // --- 1. DARK MATTER CORE ---
        const geometry = new THREE.IcosahedronGeometry(CONFIG.oreRadius, 60);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColorVoid: { value: CONFIG.colors.voidBlack },
                uColorIndigo: { value: CONFIG.colors.deepIndigo },
                uColorViolet: { value: CONFIG.colors.neonViolet }
            },
            vertexShader: oreVertexShader,
            fragmentShader: oreFragmentShader
        });
        const ore = new THREE.Mesh(geometry, material);
        scene.add(ore);

        // --- 2. ENERGY ARCS (LIGHTNING) ---
        const lightningCount = 5;
        const lightningBolts = [];

        for(let i=0; i<lightningCount; i++) {
            // Create a jagged line buffer geo
            const segments = 20;
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(segments * 3);
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            
            const mat = new THREE.LineBasicMaterial({
                color: 0x00f7ff, // Cyan arcs
                transparent: true,
                opacity: 0.0,
                linewidth: 2,
                blending: THREE.AdditiveBlending
            });
            
            const line = new THREE.Line(geo, mat);
            scene.add(line);
            
            lightningBolts.push({
                mesh: line,
                timer: Math.random() * 100,
                duration: 0.2, // Short flash
                active: false
            });
        }
        
        function updateLightning(time) {
            lightningBolts.forEach(bolt => {
                bolt.timer -= 0.016; // Approx delta
                
                if (bolt.active) {
                    // Fade out
                    bolt.mesh.material.opacity -= 0.05;
                    if(bolt.mesh.material.opacity <= 0) {
                        bolt.active = false;
                        bolt.timer = Math.random() * 2 + 0.5; // Random cooldown
                    }
                } else if (bolt.timer <= 0) {
                    // TRIGGER FLASH
                    bolt.active = true;
                    bolt.mesh.material.opacity = 1.0;
                    
                    // Generate new path from Core Surface to Disc 1 Radius
                    const positions = bolt.mesh.geometry.attributes.position.array;
                    
                    // Start point (Surface of sphere r=2)
                    const theta1 = Math.random() * Math.PI * 2;
                    const phi1 = Math.acos(2 * Math.random() - 1);
                    const start = new THREE.Vector3().setFromSphericalCoords(2.0, phi1, theta1);
                    
                    // End point (Disc 1 area, r=~5)
                    const theta2 = theta1 + (Math.random()-0.5); // Nearby angle
                    const phi2 = Math.PI / 2 + (Math.random()-0.5)*0.5; // Near equator
                    const end = new THREE.Vector3().setFromSphericalCoords(5.0 + Math.random()*2.0, phi2, theta2);
                    
                    for(let i=0; i<20; i++) {
                        const t = i / 19;
                        const p = new THREE.Vector3().lerpVectors(start, end, t);
                        
                        // Add Jitter (Noise)
                        if(i > 0 && i < 19) {
                            p.add(new THREE.Vector3(
                                (Math.random()-0.5)*0.5,
                                (Math.random()-0.5)*0.5,
                                (Math.random()-0.5)*0.5
                            ));
                        }
                        
                        positions[i*3] = p.x;
                        positions[i*3+1] = p.y;
                        positions[i*3+2] = p.z;
                    }
                    bolt.mesh.geometry.attributes.position.needsUpdate = true;
                }
            });
        }

        // --- 3. PARTICLE AURA DISCS ---
        function createParticleDisc(count, minRadius, maxRadius, heightSpread) {
            const pGeo = new THREE.BufferGeometry();
            const pPos = new Float32Array(count * 3);
            const pScale = new Float32Array(count);
            const pOffset = new Float32Array(count);

            for(let i=0; i<count; i++) {
                const r = minRadius + Math.random() * (maxRadius - minRadius);
                const theta = Math.random() * Math.PI * 2;
                const y = (Math.random() - 0.5) * heightSpread; 
                
                pPos[i*3] = r * Math.cos(theta);
                pPos[i*3+1] = y;
                pPos[i*3+2] = r * Math.sin(theta);
                
                pScale[i] = Math.random();
                pOffset[i] = Math.random() * 100;
            }
            pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
            pGeo.setAttribute('aScale', new THREE.BufferAttribute(pScale, 1));
            pGeo.setAttribute('aOffset', new THREE.BufferAttribute(pOffset, 1));

            const pMat = new THREE.ShaderMaterial({
                uniforms: { uTime: { value: 0 }},
                vertexShader: particleVertexShader,
                fragmentShader: particleFragmentShader,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            return new THREE.Points(pGeo, pMat);
        }

        const disc1 = createParticleDisc(3000, 3.5, 8.5, 1.5);
        scene.add(disc1);

        const disc2 = createParticleDisc(2000, 14.0, 24.0, 3.0);
        scene.add(disc2);

        const disc3 = createParticleDisc(1000, 30.0, 50.0, 6.0);
        scene.add(disc3);
        
        // --- 4. COSMIC JELLYFISH SWARM ---
        
        // Shared Geometry
        const bellGeo = new THREE.SphereGeometry(1.5, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55);
        bellGeo.scale(1, 0.6, 1); 
        
        const coreGeo = new THREE.SphereGeometry(0.4, 16, 16);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });

        const armsGeo = new THREE.BufferGeometry();
        const armCount = 100; 
        const armPos = [];
        const armOffsets = [];
        for(let i=0; i<armCount; i++) {
            const theta = i * 0.1;
            const r = (i / armCount) * 0.5;
            const y = -(i / armCount) * 3.0;
            armPos.push(Math.cos(theta)*r, y, Math.sin(theta)*r);
            armOffsets.push(Math.random() * 10);
        }
        armsGeo.setAttribute('position', new THREE.Float32BufferAttribute(armPos, 3));
        armsGeo.setAttribute('aOffset', new THREE.Float32BufferAttribute(armOffsets, 1));
        const armsMat = new THREE.PointsMaterial({
            color: 0xff00ff,
            size: 0.15,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const jellySwarm = [];
        const swarmSize = 30;

        function createJellyfish(index) {
            const group = new THREE.Group();
            
            const hue = Math.random();
            const colorGlow = new THREE.Color().setHSL(hue, 0.9, 0.5);
            const colorPulse = new THREE.Color().setHSL((hue + 0.5) % 1.0, 1.0, 0.6); 

            const jellyMat = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uColorGlow: { value: colorGlow },
                    uColorPulse: { value: colorPulse }
                },
                vertexShader: jellyVertexShader,
                fragmentShader: jellyFragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            // A. Bell
            const jellyBell = new THREE.Mesh(bellGeo, jellyMat);
            group.add(jellyBell);
            
            // B. Core
            const jellyCore = new THREE.Mesh(coreGeo, coreMat);
            jellyCore.position.y = 0.2;
            group.add(jellyCore);

            // C. Oral Arms
            const thisArmsMat = armsMat.clone();
            thisArmsMat.color = colorGlow;
            const oralArms = new THREE.Points(armsGeo, thisArmsMat);
            group.add(oralArms);

            // D. Tentacles
            const tentacles = [];
            const tentacleCount = 8;
            const segmentCount = 25;
            
            for(let i=0; i<tentacleCount; i++) {
                const tGeo = new THREE.BufferGeometry();
                const positions = [];
                const angle = (i / tentacleCount) * Math.PI * 2;
                const radius = 0.9; 
                
                for(let j=0; j<segmentCount; j++) {
                    positions.push(Math.cos(angle) * radius, -j * 0.3, Math.sin(angle) * radius);
                }
                
                tGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                
                const tMat = new THREE.LineBasicMaterial({
                    color: colorPulse, // Match pulse color
                    transparent: true,
                    opacity: 0.5,
                    blending: THREE.AdditiveBlending
                });
                
                const tentacle = new THREE.Line(tGeo, tMat);
                tentacles.push({ 
                    mesh: tentacle, 
                    angle: angle, 
                    offset: Math.random() * 10,
                    initialPos: positions.slice() 
                });
                group.add(tentacle);
            }

            // Randomize Orbit parameters (More Distant: 60 - 120)
            const dist = 15 + Math.random() * 60;
            const startAngle = Math.random() * Math.PI * 2;
            const speed = 0.02 + Math.random() * 0.08; 
            const yBase = (Math.random() - 0.5) * 40;
            const phase = Math.random() * 10;

            return {
                group: group,
                tentacles: tentacles,
                oralArms: oralArms,
                material: jellyMat, // Save material ref to update time
                params: { dist, startAngle, speed, yBase, phase }
            };
        }

        for(let i=0; i<swarmSize; i++) {
            const jellyData = createJellyfish(i);
            scene.add(jellyData.group);
            jellySwarm.push(jellyData);
        }

        // --- 5. STARS (Background Layer 1) ---
        const sCount = 2000; // Increased count
        const sGeo = new THREE.BufferGeometry();
        const sPos = new Float32Array(sCount * 3);
        for(let i=0; i<sCount; i++) {
            // Push stars further back: 200 to 400 range
            const r = 200 + Math.random() * 200;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            sPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
            sPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            sPos[i*3+2] = r * Math.cos(phi);
        }
        sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
        const sMat = new THREE.PointsMaterial({
            color: 0x8888aa, 
            size: 0.8, // Larger distant stars
            transparent: true, 
            opacity: 0.8
        });
        const stars = new THREE.Points(sGeo, sMat);
        scene.add(stars);

        // --- 6. PROCEDURAL NEBULA (Background Layer 2) ---
        // Huge sphere acting as the skybox
        const nebulaGeo = new THREE.SphereGeometry(180, 64, 64);
        const nebulaMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 }
            },
            vertexShader: nebulaVertexShader,
            fragmentShader: nebulaFragmentShader,
            side: THREE.BackSide, // Render on the inside
            depthWrite: false // Don't block stars behind it (if any were behind)
        });
        const nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
        scene.add(nebula);


        // --- POST PROCESSING ---
        const renderScene = new RenderPass(scene, camera);
        
        // Add Chromatic Aberration
        const chromaticAberrationPass = new ShaderPass(aberrationShader);

        const composer = new EffectComposer(renderer);
        composer.addPass(renderScene);
        composer.addPass(chromaticAberrationPass);

        // --- ANIMATION ---
        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            
            // Audio update
            audioSystem.update(time);

            // Intro Sequence
            if (introActive) {
                // Smooth interpolation
                const speed = 0.015;
                camera.position.lerp(targetCamPos, speed);
                
                if (camera.position.distanceTo(targetCamPos) < 0.1) {
                    introActive = false;
                    controls.enabled = true; // Enable manual control
                    controls.target.set(0,0,0);
                }
                camera.lookAt(0,0,0);
            } else {
                controls.update();
            }

            material.uniforms.uTime.value = time;
            
            // Update Nebula
            nebulaMat.uniforms.uTime.value = time;

            // Update Discs
            disc1.material.uniforms.uTime.value = time;
            disc2.material.uniforms.uTime.value = time;
            disc3.material.uniforms.uTime.value = time;
            
            disc1.rotation.y = time * 0.1;
            disc2.rotation.y = time * -0.07;
            disc3.rotation.y = time * 0.03;

            ore.rotation.y = time * 0.1;
            ore.rotation.z = time * 0.05;

            // Update Lightning
            updateLightning(time);

            // --- JELLYFISH SWARM ANIMATION ---
            jellySwarm.forEach(jelly => {
                const { group, tentacles, oralArms, params, material } = jelly;
                
                material.uniforms.uTime.value = time;

                const angle = params.startAngle + time * params.speed;
                group.position.x = Math.cos(angle) * params.dist;
                group.position.z = Math.sin(angle) * params.dist;
                group.position.y = params.yBase + Math.sin(time + params.phase) * 2.0;
                
                group.rotation.y = -angle; 
                group.rotation.z = Math.cos(time + params.phase) * 0.1;
                
                oralArms.rotation.y = time * 0.5;
                oralArms.scale.x = 1.0 + Math.sin(time * 3.0 + params.phase)*0.2;
                oralArms.scale.z = 1.0 + Math.sin(time * 3.0 + params.phase)*0.2;

                tentacles.forEach((t) => {
                    const positions = t.mesh.geometry.attributes.position.array;
                    const initial = t.initialPos;
                    const segmentCount = positions.length / 3;

                    for(let k=1; k<segmentCount; k++) {
                        const idx = k * 3;
                        const waveX = Math.cos(time * 2.0 + k * 0.3 + t.offset) * (k * 0.08); 
                        const waveZ = Math.sin(time * 1.5 + k * 0.3 + t.offset) * (k * 0.08);
                        const drag = k * 0.05;
                        
                        positions[idx] = initial[idx] + waveX; 
                        positions[idx+1] = initial[idx+1]; 
                        positions[idx+2] = initial[idx+2] + waveZ + drag;
                    }
                    t.mesh.geometry.attributes.position.needsUpdate = true;
                });
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
            title="Dark Matter Ore"
        />
    );
};
