import React, { useMemo } from 'react';

export const SingularityView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Singularity Crystal - Prismatic Containment</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Cinzel+Decorative:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Orbitron', sans-serif; }
        canvas { display: block; width: 100vw; height: 100vh; }
        
        #hud {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; padding: 20px; box-sizing: border-box;
            display: flex; flex-direction: column; z-index: 20;
            transition: opacity 2s;
        }
        .panel {
            background: rgba(5, 5, 10, 0.85);
            border: 1px solid rgba(100, 200, 255, 0.3);
            border-left: 4px solid #00ffff;
            padding: 20px;
            backdrop-filter: blur(8px);
            width: fit-content;
            color: #fff;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.15);
            border-radius: 4px;
        }
        h1 { margin: 0 0 10px 0; font-size: 24px; letter-spacing: 3px; text-transform: uppercase; color: #fff; text-shadow: 0 0 10px rgba(0, 255, 255, 0.8); }
        .stat { font-size: 14px; color: #aaa; display: flex; justify-content: space-between; gap: 30px; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px; }
        .val { font-weight: bold; color: #e0faff; font-family: monospace; font-size: 15px; }
        .prism-text {
            background: linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: rainbow 4s linear infinite;
            font-weight: 800;
            filter: drop-shadow(0 0 2px rgba(255,255,255,0.5));
        }
        @keyframes rainbow { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
        
        #controls {
            position: absolute; bottom: 30px; right: 30px;
            pointer-events: auto;
        }
        .btn {
            background: rgba(0, 20, 40, 0.6); border: 1px solid #00ffff; color: #00ffff;
            padding: 10px 20px; cursor: pointer; font-family: 'Orbitron', sans-serif;
            transition: all 0.3s;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 1px;
        }
        .btn:hover { background: #00ffff; color: #000; box-shadow: 0 0 20px #00ffff; }

        #flash-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: white;
            z-index: 101;
            opacity: 1; /* Start fully white */
            pointer-events: none;
            mix-blend-mode: exclusion;
            transition: opacity 1s ease-out;
        }
    </style>
</head>
<body>
    <div id="flash-overlay"></div>
    
    <div id="hud">
        <div class="panel">
            <h1>Singularity Crystal</h1>
            <div class="stat"><span>PROBABILITY</span> <span class="val">1 in 900,000,000</span></div>
            <div class="stat"><span>DIMENSION</span> <span class="val prism-text">PRISM</span></div>
            <div class="stat"><span>STRUCTURE</span> <span class="val">HYPER-DENSE</span></div>
            <div class="stat"><span>STATUS</span> <span class="val" style="color:#00ff88">STABLE</span></div>
        </div>
        <div id="controls">
            <button class="btn" id="resetBtn">Recenter View</button>
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

        // --- AUDIO ENGINE (Simplified for View) ---
        class SingularityAudio {
            constructor() {
                this.ctx = null;
                this.masterGain = null;
                this.initialized = false;
            }

            init() {
                if(this.initialized) return;
                try {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    this.ctx = new AudioContext();
                    this.masterGain = this.ctx.createGain();
                    this.masterGain.gain.value = 0.4;
                    this.masterGain.connect(this.ctx.destination);
                    this.initialized = true;
                } catch(e) { console.warn("Audio init failed", e); }
            }
        }
        const audio = new SingularityAudio();

        // --- 1. TEXTURE GENERATORS ---
        function createRingMaps() {
            const size = 1024;
            const mkCanvas = () => { const c = document.createElement('canvas'); c.width = size; c.height = size; return c; };
            const ctx = {
                color: mkCanvas().getContext('2d'),
                alpha: mkCanvas().getContext('2d'),
                emissive: mkCanvas().getContext('2d'),
                bump: mkCanvas().getContext('2d')
            };

            ctx.color.fillStyle = '#1a1a1a'; ctx.color.fillRect(0,0,size,size);
            ctx.alpha.fillStyle = '#000'; ctx.alpha.fillRect(0,0,size,size);
            ctx.emissive.fillStyle = '#000'; ctx.emissive.fillRect(0,0,size,size);
            ctx.bump.fillStyle = '#000'; ctx.bump.fillRect(0,0,size,size);

            const segs = 16;
            const segmentHeight = size / segs;
            const gap = 10; 

            for(let i=0; i<segs; i++) {
                const y = i * segmentHeight;
                const h = segmentHeight - gap;
                ctx.alpha.fillStyle = '#fff'; ctx.alpha.fillRect(0, y, size, h);
                ctx.color.fillStyle = '#333'; ctx.color.fillRect(0, y, size, h);
                ctx.color.fillStyle = '#111';
                for(let r=0; r<10; r++) {
                    ctx.color.fillRect(r * (size/10), y + 5, 4, 4);
                    ctx.color.fillRect(r * (size/10), y + h - 9, 4, 4);
                }
                ctx.bump.fillStyle = '#808080'; ctx.bump.fillRect(0, y, size, h); 
                ctx.bump.fillStyle = '#404040'; ctx.bump.fillRect(0, y + h/2, size, 4);
                for(let k=0; k<4; k++) {
                    const cx = Math.random() * size;
                    const cw = 50 + Math.random() * 50;
                    ctx.alpha.fillStyle = '#000'; ctx.alpha.fillRect(cx, y + 15, cw, h - 30);
                    ctx.bump.fillStyle = '#000'; ctx.bump.fillRect(cx, y + 15, cw, h - 30);
                }
                if(i % 4 === 0) {
                    const ly = y + 5;
                    ctx.emissive.fillStyle = '#ff0000'; ctx.emissive.fillRect(50, ly, 10, 5);
                }
            }

            const textures = {};
            for(const key in ctx) {
                textures[key] = new THREE.CanvasTexture(ctx[key].canvas);
                textures[key].wrapS = THREE.RepeatWrapping;
                textures[key].wrapT = THREE.RepeatWrapping;
                textures[key].repeat.set(4, 1);
            }
            return textures;
        }

        function createPlasmaTexture() {
            const size = 512;
            const canvas = document.createElement('canvas');
            canvas.width = size; canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#000'; ctx.fillRect(0,0,size,size);
            for(let i=0; i<100; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const w = 50 + Math.random() * 200;
                const h = 2 + Math.random() * 10;
                const grad = ctx.createLinearGradient(x,y, x+w, y);
                grad.addColorStop(0, 'rgba(0,0,0,0)');
                grad.addColorStop(0.5, 'rgba(0, 255, 255, 0.8)');
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = grad;
                ctx.fillRect(x,y,w,h);
            }
            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(2, 4);
            return tex;
        }

        const ringMaps = createRingMaps();
        const plasmaTexture = createPlasmaTexture();

        // --- GLSL NOISE ---
        const noiseChunk = \`
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
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
            }
            float fbm(vec3 x) {
                float v = 0.0;
                float a = 0.5;
                vec3 shift = vec3(100.0);
                for (int i = 0; i < 5; ++i) {
                    v += a * snoise(x);
                    x = x * 2.0 + shift;
                    a *= 0.5;
                }
                return v;
            }
        \`;

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
        camera.position.set(0, 2, 50); // Final Position

        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.dampingFactor = 0.05;
        controls.minDistance = 5;
        controls.maxDistance = 30;
        controls.enabled = true;

        const centerLight = new THREE.PointLight(0xa855f7, 2, 50);
        scene.add(centerLight);
        const ambientLight = new THREE.AmbientLight(0x402060, 0.5);
        scene.add(ambientLight);
        const rimLight = new THREE.DirectionalLight(0xffffff, 1.5);
        rimLight.position.set(10, 5, -5);
        scene.add(rimLight);

        // --- 1. NEBULA ---
        const nebulaGeo = new THREE.SphereGeometry(80, 32, 32);
        const nebulaMat = new THREE.ShaderMaterial({
            side: THREE.BackSide,
            uniforms: {
                uTime: { value: 0 },
                uColorA: { value: new THREE.Color(0x050011) },
                uColorB: { value: new THREE.Color(0x330066) }
            },
            vertexShader: \`
                varying vec2 vUv;
                varying vec3 vWorldPos;
                void main() {
                    vUv = uv;
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPos = worldPosition.xyz;
                    gl_Position = projectionMatrix * viewMatrix * worldPosition;
                }
            \`,
            fragmentShader: \`
                uniform float uTime;
                uniform vec3 uColorA;
                uniform vec3 uColorB;
                varying vec3 vWorldPos;
                \${noiseChunk}
                void main() {
                    vec3 pos = normalize(vWorldPos);
                    float n = snoise(pos * 3.0 + uTime * 0.05);
                    float n2 = snoise(pos * 6.0 - uTime * 0.1);
                    float cloud = n * 0.5 + n2 * 0.25;
                    vec3 color = mix(uColorA, uColorB, smoothstep(-0.2, 0.6, cloud));
                    float starNoise = snoise(pos * 100.0);
                    float stars = smoothstep(0.95, 1.0, starNoise) * (0.5 + 0.5 * sin(uTime + pos.x * 20.0));
                    gl_FragColor = vec4(color + vec3(stars), 1.0);
                }
            \`
        });
        const nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
        scene.add(nebula);

        // --- 2. COMPLEX ORE CRYSTAL ---
        const crystalVertexShader = \`
            uniform float uTime;
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec3 vViewPosition;
            \${noiseChunk}
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                
                // Base structure
                float baseShape = fbm(position * 1.5 + uTime * 0.05);
                // Jagged spikes
                float detail = fbm(position * 6.0 + uTime * 0.1);
                
                float totalDisplacement = baseShape * 0.5 + detail * 0.1;
                totalDisplacement = pow(abs(totalDisplacement), 0.7) * sign(totalDisplacement);

                vec3 newPos = position + normal * totalDisplacement;
                vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
                vViewPosition = -mvPosition.xyz;
                vPosition = newPos;
                gl_Position = projectionMatrix * mvPosition;
            }
        \`;
        const crystalFragmentShader = \`
            uniform float uTime;
            uniform vec3 uColorA; 
            uniform vec3 uColorB; 
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec3 vViewPosition;
            \${noiseChunk}
            void main() {
                vec3 viewDir = normalize(vViewPosition);
                vec3 normal = normalize(vNormal);
                
                // Veins and Texture
                float veins = fbm(vPosition * 4.0 + uTime * 0.05);
                float fineGrit = snoise(vPosition * 20.0);
                
                // Sub-surface Magma Pulse
                float pulse = snoise(vPosition * 2.0 - uTime * 0.5);
                
                // Swirl
                vec3 noiseCoord = vPosition * 2.5 + vec3(0.0, uTime * 0.8, 0.0);
                float swirl = fbm(noiseCoord);

                float fresnelBase = dot(viewDir, normal);
                float fresnel = pow(1.0 - abs(fresnelBase), 3.0);
                fresnel = smoothstep(0.0, 1.0, fresnel) * 2.5;

                vec3 rockColor = vec3(0.05, 0.02, 0.08) + fineGrit * 0.02;
                
                vec3 energyColor = vec3(
                    mix(uColorA.r, uColorB.r, swirl),
                    mix(uColorA.g, uColorB.g, swirl),
                    mix(uColorA.b, uColorB.b, swirl)
                );
                
                // Add Heat Glow inside cracks
                float heat = smoothstep(0.4, 0.8, veins * pulse);
                energyColor += vec3(1.0, 0.6, 0.2) * heat * 3.0; 

                float veinMask = smoothstep(0.35, 0.65, veins);
                vec3 baseColor = mix(rockColor, energyColor, veinMask);
                
                vec3 streak = step(vec3(0.65), vec3(swirl)); 
                baseColor += uColorB * streak * 2.0 * veinMask;

                vec3 finalColor = mix(baseColor, uColorB * 4.0, fresnel);
                float centerMask = pow(abs(fresnelBase), 4.0);
                finalColor *= (1.0 - centerMask * 0.9);
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        \`;
        const crystalMat = new THREE.ShaderMaterial({
            vertexShader: crystalVertexShader,
            fragmentShader: crystalFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uColorA: { value: new THREE.Color(0x000000) },
                uColorB: { value: new THREE.Color(0x8a2be2) }
            },
            side: THREE.DoubleSide
        });
        const crystal = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 120), crystalMat);
        scene.add(crystal);

        // --- 2.5 FRAGMENTATION FIELD (Shards) ---
        // New Detail: Floating bits of ore
        const shardGeo = new THREE.TetrahedronGeometry(0.1, 0);
        const shardMat = crystalMat.clone(); // Share shader logic
        const shardCount = 450;
        const shards = new THREE.InstancedMesh(shardGeo, shardMat, shardCount);
        const dummy = new THREE.Object3D();

        for(let i=0; i<shardCount; i++) {
            // Orbiting sphere distribution
            const r = 1.5 + Math.random() * 2.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            dummy.position.set(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );
            
            dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            const scale = Math.random() * 0.8 + 0.2;
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            shards.setMatrixAt(i, dummy.matrix);
        }
        scene.add(shards);

        // --- 2.6 SURFACE LIGHTNING (Arcs) ---
        // New Detail: Lightning shell
        const electricGeo = new THREE.IcosahedronGeometry(1.4, 20);
        const electricMat = new THREE.ShaderMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
            uniforms: { uTime: { value: 0 } },
            vertexShader: \`varying vec3 vPos; void main() { vPos=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }\`,
            fragmentShader: \`
                uniform float uTime;
                varying vec3 vPos;
                \${noiseChunk}
                void main() {
                    float noise1 = snoise(vPos * 4.0 + uTime * 1.5);
                    float noise2 = snoise(vPos * 10.0 - uTime * 2.5);
                    float lightning = 1.0 - abs(noise1 - noise2);
                    lightning = pow(lightning, 20.0); 
                    vec3 col = vec3(0.5, 0.8, 1.0) * lightning * 2.0;
                    gl_FragColor = vec4(col, lightning);
                }
            \`
        });
        const arcs = new THREE.Mesh(electricGeo, electricMat);
        scene.add(arcs);

        // --- 3. CONTAINMENT ---
        const containmentGroup = new THREE.Group();
        scene.add(containmentGroup);

        const sentinelCount = 5;
        const sentinels = [];
        const beamGeo = new THREE.BufferGeometry();
        const beamPosArray = new Float32Array(sentinelCount * 6); 
        beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPosArray, 3));
        const beamMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
        const beams = new THREE.LineSegments(beamGeo, beamMat);
        scene.add(beams);
        const beamAttr = beamGeo.attributes.position; // DEFINED GLOBALLY

        const sentinelBodyGeo = new THREE.OctahedronGeometry(0.5, 0);

        const sentinelVertexShader = \`
            varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition; varying vec3 vViewPosition;
            void main() {
                vUv = uv; vNormal = normalize(normalMatrix * normal);
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                vViewPosition = -mvPosition.xyz; vPosition = position;
                gl_Position = projectionMatrix * mvPosition;
            }
        \`;
        const sentinelFragmentShader = \`
            uniform float uTime; varying vec3 vNormal; varying vec3 vPosition; varying vec3 vViewPosition;
            vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) { return a + b*cos( 6.28318*(c*t+d) ); }
            void main() {
                vec3 viewDir = normalize(vViewPosition); vec3 normal = normalize(vNormal);
                float fresnel = 1.0 - dot(viewDir, normal); fresnel = pow(fresnel, 2.0);
                float t = fresnel * 1.5 + vPosition.y * 0.8 + uTime * 0.3;
                vec3 col = palette(t, vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0, 0.33, 0.67) );
                col += vec3(fresnel * 0.5); gl_FragColor = vec4(col, 1.0);
            }
        \`;
        const sentinelMat = new THREE.ShaderMaterial({ vertexShader: sentinelVertexShader, fragmentShader: sentinelFragmentShader, uniforms: { uTime: { value: 0 } } });

        for(let i=0; i<sentinelCount; i++) {
            const group = new THREE.Group();
            const core = new THREE.Mesh(sentinelBodyGeo, sentinelMat);
            core.scale.y = 1.8; group.add(core);
            const angle = (i / sentinelCount) * Math.PI * 2;
            const radius = 3.5;
            group.position.set(Math.cos(angle)*radius, 0, Math.sin(angle)*radius);
            group.lookAt(0,0,0);
            containmentGroup.add(group);
            sentinels.push({ group, angle, radius, speed: 0.02 + Math.random()*0.02 });
        }

        // --- 4. RINGS ---
        const gyroGroup = new THREE.Group();
        scene.add(gyroGroup);

        const casingMat = new THREE.MeshStandardMaterial({
            map: ringMaps.color, alphaMap: ringMaps.alpha, bumpMap: ringMaps.bump, bumpScale: 0.1,
            emissiveMap: ringMaps.emissive, emissive: 0xffffff, emissiveIntensity: 1.0,
            transparent: true, side: THREE.DoubleSide, metalness: 0.9, roughness: 0.3, color: 0xaaaaaa
        });

        const coreMatBase = new THREE.MeshBasicMaterial({
            map: plasmaTexture, color: 0x00ffff, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
        });

        const clampGeo = new THREE.BoxGeometry(0.8, 0.4, 0.6);
        const clampMat = new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.8, roughness: 0.4 });

        function createClass4Ring(radius) {
            const group = new THREE.Group();
            const casing = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.35, 64, 256), casingMat);
            casing.castShadow = true; casing.receiveShadow = true; group.add(casing);

            const myCoreMat = coreMatBase.clone();
            const core = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.25, 32, 256), myCoreMat);
            group.add(core); group.userData.coreMat = myCoreMat;

            const numClamps = 8;
            for(let i=0; i<numClamps; i++) {
                const angle = (i/numClamps) * Math.PI * 2;
                const clamp = new THREE.Mesh(clampGeo, clampMat);
                clamp.position.set(Math.cos(angle)*radius, Math.sin(angle)*radius, 0);
                clamp.lookAt(0,0,0); group.add(clamp);
            }
            
            const rails = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.45, 2, 128), new THREE.MeshBasicMaterial({ color: 0x8800ff, wireframe: true, transparent: true, opacity: 0.08 }));
            group.add(rails);

            const numLights = 4;
            for(let i=0; i<numLights; i++) {
                const angle = (i/numLights) * Math.PI * 2;
                const col = i%2===0 ? 0x00ffff : 0xff00ff; 
                const light = new THREE.PointLight(col, 1.2, 5.0); 
                light.position.set(Math.cos(angle)*radius, Math.sin(angle)*radius, 0); group.add(light);
            }
            return group;
        }

        const ring1 = createClass4Ring(5.5);
        const ring2 = createClass4Ring(6.6);
        const ring3 = createClass4Ring(7.7);

        ring2.rotation.x = Math.PI / 2;
        ring3.rotation.y = Math.PI / 2;
        gyroGroup.add(ring1, ring2, ring3);

        // --- 5. PARTICLES ---
        const particlesGeometry = new THREE.BufferGeometry();
        const pCount = 2000;
        const pPos = new Float32Array(pCount * 3);
        const pSize = new Float32Array(pCount);
        for(let i=0; i<pCount*3; i+=3) {
            const r = 2.0 + Math.random() * 8.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            pPos[i] = r * Math.sin(phi) * Math.cos(theta);
            pPos[i+1] = r * Math.sin(phi) * Math.sin(theta);
            pPos[i+2] = r * Math.cos(phi);
            pSize[i/3] = Math.random();
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(pSize, 1));
        const particlesMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0xa855f7) } },
            transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
            vertexShader: \`
                uniform float uTime; attribute float aScale; varying float vAlpha;
                void main() {
                    vec3 p = position;
                    float angle = uTime * 0.1 + (10.0 / length(p));
                    float s = sin(angle); float c = cos(angle);
                    p = mat3(c,0,s, 0,1,0, -s,0,c) * p;
                    vec4 mv = modelViewMatrix * vec4(p, 1.0);
                    gl_Position = projectionMatrix * mv;
                    gl_PointSize = (3.0 * aScale) * (10.0 / -mv.z);
                    vAlpha = 0.3 + 0.3 * sin(uTime * 3.0 + aScale * 10.0);
                }
            \`,
            fragmentShader: \`
                uniform vec3 uColor; varying float vAlpha;
                void main() {
                    float r = length(gl_PointCoord - vec2(0.5));
                    if (r > 0.5) discard;
                    gl_FragColor = vec4(uColor, vAlpha * (1.0 - r*2.0));
                }
            \`
        });
        const particles = new THREE.Points(particlesGeometry, particlesMat);
        scene.add(particles);

        // --- COMPOSER ---
        const renderScene = new RenderPass(scene, camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.1);
        const composer = new EffectComposer(renderer);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);

        // --- ANIMATION ---
        const clock = new THREE.Clock();
        
        // Start after slight delay to ensure audio context is ready
        setTimeout(() => {
            audio.init();
            
            // Fade out overlay
            document.getElementById('flash-overlay').style.opacity = 0;
            
            // Reveal HUD
            // Wait for fade
            setTimeout(() => {
                document.getElementById('flash-overlay').style.display = 'none';
            }, 1000);
            
        }, 100);

        function animate() {
            const delta = clock.getDelta();
            const t = clock.getElapsedTime();
            
            controls.update();

            // Object Animations
            crystalMat.uniforms.uTime.value = t;
            shardMat.uniforms.uTime.value = t; 
            electricMat.uniforms.uTime.value = t;
            particlesMat.uniforms.uTime.value = t;
            nebulaMat.uniforms.uTime.value = t;
            sentinelMat.uniforms.uTime.value = t;

            // Rotation
            crystal.rotation.y = t * 0.1;
            crystal.rotation.z = t * 0.05;
            crystal.position.y = Math.sin(t * 0.5) * 0.4;
            
            shards.rotation.y = -t * 0.2; 
            shards.rotation.x = t * 0.05;

            arcs.position.copy(crystal.position);
            arcs.rotation.y = t * 0.2;

            containmentGroup.rotation.y = -t * 0.05;
            sentinels.forEach((s, i) => {
                s.group.position.y = Math.sin(t * 1.5 + i) * 0.8;
                s.group.lookAt(crystal.position); 
                const worldPos = new THREE.Vector3();
                s.group.getWorldPosition(worldPos);
                beamAttr.setXYZ(i*2, worldPos.x, worldPos.y, worldPos.z);
                const jitter = Math.sin(t * 20.0 + i) * 0.1;
                beamAttr.setXYZ(i*2+1, jitter, crystal.position.y + jitter, jitter);
            });
            beamAttr.needsUpdate = true;

            gyroGroup.rotation.x = t * 0.05;
            gyroGroup.rotation.y = t * 0.02;
            ring1.rotation.x = t * 0.15;
            ring2.rotation.y = t * 0.12;
            ring3.rotation.z = t * 0.10;

            const plasmaSpeed = t * 0.5;
            ring1.userData.coreMat.map.offset.x = plasmaSpeed;
            ring2.userData.coreMat.map.offset.x = -plasmaSpeed * 1.2;
            ring3.userData.coreMat.map.offset.x = plasmaSpeed * 0.8;

            beamMat.opacity = 0.3 + 0.2 * Math.sin(t * 10.0);

            composer.render();
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            controls.reset();
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
            title="Singularity View"
        />
    );
};
