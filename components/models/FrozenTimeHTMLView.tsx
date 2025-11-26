import React, { useMemo } from 'react';

export const FrozenTimeHTMLView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frozen Time - Legendary Artifact</title>
    <!-- Import Sci-Fi Font -->
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Rajdhani:wght@300;500;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #020005; /* Deep Purple Black BG */
            overflow: hidden;
            font-family: 'Rajdhani', sans-serif;
        }
        canvas {
            display: block;
        }

        /* UI Overlay */
        #ui {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            padding: 40px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        /* Tech Corners */
        .corner {
            position: absolute;
            width: 60px;
            height: 60px;
            border: 2px solid rgba(136, 0, 255, 0.4);
            transition: all 0.3s ease;
        }
        .top-left { top: 30px; left: 30px; border-right: none; border-bottom: none; }
        .top-right { top: 30px; right: 30px; border-left: none; border-bottom: none; }
        .bottom-left { bottom: 30px; left: 30px; border-right: none; border-top: none; }
        .bottom-right { bottom: 30px; right: 30px; border-left: none; border-top: none; }

        /* Reticle */
        .reticle {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 650px;
            height: 650px;
            transform: translate(-50%, -50%);
            border: 1px dashed rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            animation: spinReticle 120s linear infinite;
        }
        .reticle::before {
            content: '';
            position: absolute;
            top: -5px; left: 50%;
            width: 10px; height: 10px;
            background: rgba(136, 0, 255, 0.5);
            transform: translateX(-50%);
        }
        
        .inner-reticle {
             position: absolute;
            top: 50%;
            left: 50%;
            width: 300px;
            height: 300px;
            transform: translate(-50%, -50%);
            border: 1px solid rgba(136, 0, 255, 0.15);
            border-radius: 50%;
        }

        @keyframes spinReticle {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* Center Content */
        .center-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 85%; /* Spacing */
        }

        /* Header */
        .header {
            text-align: center;
            opacity: 0;
            animation: fadeIn 2s forwards 0.5s;
        }
        h1 {
            font-family: 'Cinzel', serif;
            color: #fff;
            font-size: 3rem;
            margin: 0;
            letter-spacing: 12px;
            text-transform: uppercase;
            text-shadow: 0 0 20px rgba(180, 100, 255, 0.6);
        }
        .subtitle {
            color: #dcb4ff;
            letter-spacing: 6px;
            font-size: 0.8rem;
            margin-top: 10px;
            text-transform: uppercase;
            font-weight: 700;
        }

        /* Footer Stats */
        .stats {
            display: flex;
            justify-content: center;
            gap: 60px;
            opacity: 0;
            animation: fadeIn 2s forwards 1s;
        }
        .stat-box {
            text-align: center;
        }
        .stat-label {
            display: block;
            color: #8866aa;
            font-size: 0.65rem;
            letter-spacing: 3px;
            margin-bottom: 8px;
            font-weight: 700;
        }
        .stat-value {
            display: block;
            color: #fff;
            font-size: 1.4rem;
            font-weight: 700;
            text-shadow: 0 0 10px rgba(200, 0, 255, 0.4);
        }
        
        #temp-val { font-variant-numeric: tabular-nums; }

        /* System Log */
        .sys-log {
            position: absolute;
            bottom: 40px;
            left: 50px;
            width: 250px;
            height: 150px;
            overflow: hidden;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.7rem;
            color: rgba(136, 0, 255, 0.6);
            line-height: 1.4;
            opacity: 0.7;
            mask-image: linear-gradient(to bottom, transparent, black 20%);
        }
        .log-entry { margin-bottom: 2px; }
        .log-highlight { color: #fff; }

        /* Loading Screen */
        #loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #d4b4ff;
            font-size: 1.2rem;
            letter-spacing: 5px;
            animation: pulse 1s infinite alternate;
            z-index: 100;
        }

        @keyframes fadeIn {
            to { opacity: 1; }
        }
        @keyframes pulse {
            from { opacity: 0.5; }
            to { opacity: 1; }
        }

        /* Vignette Overlay */
        #vignette {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            background: radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(10,0,20,0.95) 100%);
            z-index: 2;
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

    <div id="loading">HALTING CHRONOLOGY...</div>
    <div id="vignette"></div>

    <div id="ui">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
        <div class="reticle"></div>
        <div class="inner-reticle"></div>


        <div class="center-content">
            <div class="header">
                <h1>Frozen Time</h1>
                <div class="subtitle">Temporal Void Artifact // Class: Absolute</div>
            </div>
            <div class="stats">
                <div class="stat-box">
                    <span class="stat-label">TEMPERATURE</span>
                    <span class="stat-value" id="temp-val">0.000000 K</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">ENTROPY</span>
                    <span class="stat-value" id="entropy-val">REVERSED</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">DROP RATE</span>
                    <span class="stat-value" style="color: #d4b4ff;">1 : 800M</span>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
        import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050011); // Deep Purple Void
        scene.fog = new THREE.FogExp2(0x050011, 0.025);

        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 9);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        document.body.appendChild(renderer.domElement);

        // Environment for Transmission
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.minDistance = 5;
        controls.maxDistance = 15;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;

        // --- PROCEDURAL BUMP MAP GENERATION ---
        function createNoiseMap() {
            const size = 512;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // Fill Background
            ctx.fillStyle = '#808080'; // Neutral grey
            ctx.fillRect(0,0,size,size);
            
            // Draw Random Scratches
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            for(let i=0; i<300; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const len = Math.random() * 50;
                const angle = Math.random() * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.cos(angle)*len, y + Math.sin(angle)*len);
                ctx.stroke();
            }
            
            // Draw Noise specks
            for(let i=0; i<1000; i++) {
                const x = Math.random() * size;
                const y = Math.random() * size;
                const grey = Math.floor(Math.random() * 255);
                ctx.fillStyle = \`rgb(\${grey},\${grey},\${grey})\`;
                ctx.fillRect(x,y,2,2);
            }
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            return texture;
        }
        
        const noiseMap = createNoiseMap();


        // --- MATERIALS ---

        // VOID CRYSTAL MATERIAL (With Bump Map)
        const iceMaterial = new THREE.MeshPhysicalMaterial({
            transmission: 1.0,
            thickness: 3.5,
            roughness: 0.1, 
            bumpMap: noiseMap, // Apply generated surface detail
            bumpScale: 0.05,
            ior: 2.1, 
            color: 0x220033, 
            attenuationColor: 0x440066, 
            attenuationDistance: 1.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            specularIntensity: 2.5,
            side: THREE.DoubleSide
        });

        // Wireframe Overlay Material
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xaa00ff, 
            transparent: true,
            opacity: 0.08,
            wireframe: true,
            blending: THREE.AdditiveBlending
        });
        
        // Glitch Shell Material
        const glitchMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.0,
            wireframe: true,
            blending: THREE.AdditiveBlending
        });

        // Tech Material (Metallic)
        const techMaterial = new THREE.MeshStandardMaterial({
            color: 0x332244,
            roughness: 0.3,
            metalness: 0.9,
            side: THREE.DoubleSide
        });
        
        // Emissive Tech (Glowing bits)
        const emissiveTechMat = new THREE.MeshStandardMaterial({
            color: 0xaa00ff,
            emissive: 0x8800ff,
            emissiveIntensity: 2.0
        });

        // Beam Material (Translucent cones)
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: 0xaa00ff,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        // --- ENHANCED CORE SHADER ---
        const coreVertexShader = \`
            varying vec3 vPosition;
            varying vec2 vUv;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        \`;

        const coreFragmentShader = \`
            uniform float uTime;
            varying vec3 vPosition;
            
            // Simplex Noise 3D
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
                vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
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
                vec4 s0 = floor(b0) * 2.0 + 1.0;
                vec4 s1 = floor(b1) * 2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
                vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
                vec3 p0 = vec3(a0.xy, h.x);
                vec3 p1 = vec3(a0.zw, h.y);
                vec3 p2 = vec3(a1.xy, h.z);
                vec3 p3 = vec3(a1.zw, h.w);
                vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
                p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
                vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
                m = m * m;
                return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
            }

            void main() {
                vec3 flowDir = normalize(vPosition);
                // Inward flow
                float noise = snoise(vPosition * 5.0 - (flowDir * uTime * 0.6));
                
                // Sharp chaotic veins
                float veins = smoothstep(0.4, 0.45, noise);
                
                vec3 colorDark = vec3(0.05, 0.0, 0.2);
                vec3 colorPurple = vec3(0.5, 0.0, 1.0);
                vec3 colorWhite = vec3(1.0, 1.0, 1.0);
                
                vec3 finalColor = mix(colorDark, colorPurple, veins);
                finalColor += colorWhite * smoothstep(0.5, 0.55, noise); 
                
                gl_FragColor = vec4(finalColor * 5.0, 1.0);
            }
        \`;

        const coreShaderMaterial = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: coreVertexShader,
            fragmentShader: coreFragmentShader,
        });

        // --- GEOMETRY CONSTRUCTION ---

        const artifactGroup = new THREE.Group();
        scene.add(artifactGroup);

        // 1. The Outer Shell (Icosahedron)
        const shellGeo = new THREE.IcosahedronGeometry(1.6, 1); 
        // Slight stretch
        shellGeo.scale(1, 1.1, 1);
        const shell = new THREE.Mesh(shellGeo, iceMaterial);
        artifactGroup.add(shell);

        const shellWireframe = new THREE.Mesh(shellGeo, wireframeMaterial);
        shell.add(shellWireframe);
        
        // Glitch Shell
        const glitchShell = new THREE.Mesh(shellGeo, glitchMaterial);
        glitchShell.scale.set(1.02, 1.02, 1.02);
        artifactGroup.add(glitchShell);

        // 2. The Inner Core & Gyroscope
        const coreGeo = new THREE.OctahedronGeometry(0.6, 2);
        const coreMesh = new THREE.Mesh(coreGeo, coreShaderMaterial);
        artifactGroup.add(coreMesh);

        // Gyro Rings
        const gyroGroup = new THREE.Group();
        coreMesh.add(gyroGroup);
        
        const ringGeo1 = new THREE.TorusGeometry(0.8, 0.02, 8, 50);
        const gyro1 = new THREE.Mesh(ringGeo1, techMaterial);
        gyroGroup.add(gyro1);
        
        const ringGeo2 = new THREE.TorusGeometry(0.95, 0.02, 8, 50);
        const gyro2 = new THREE.Mesh(ringGeo2, techMaterial);
        gyro2.rotation.x = Math.PI / 2;
        gyroGroup.add(gyro2);
        
        const ringGeo3 = new THREE.TorusGeometry(1.1, 0.02, 8, 50);
        const gyro3 = new THREE.Mesh(ringGeo3, techMaterial);
        gyro3.rotation.y = Math.PI / 2;
        gyroGroup.add(gyro3);


        // 3. SUSPENDED MATRIX DEBRIS
        const shardGeo = new THREE.TetrahedronGeometry(0.1, 0);
        const shardMat = new THREE.MeshPhysicalMaterial({
            color: 0x330055, 
            metalness: 1.0,
            roughness: 0.2,
            transmission: 0.0, 
        });
        
        const debrisCount = 400;
        const debrisMesh = new THREE.InstancedMesh(shardGeo, shardMat, debrisCount);
        const dummy = new THREE.Object3D();
        
        for (let i = 0; i < debrisCount; i++) {
            const r = 2.8 + Math.random() * 3.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            dummy.position.setFromSphericalCoords(r, phi, theta);
            dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            const s = 0.5 + Math.random();
            dummy.scale.set(s, s*0.2, s*0.2);
            dummy.updateMatrix();
            debrisMesh.setMatrixAt(i, dummy.matrix);
        }
        scene.add(debrisMesh);
        
        // 4. TEMPORAL DUST
        const dustGeo = new THREE.BufferGeometry();
        const dustCount = 1000;
        const dustPos = new Float32Array(dustCount * 3);
        const dustSpeeds = new Float32Array(dustCount);
        for(let i=0; i<dustCount; i++) {
            dustPos[i*3] = (Math.random() - 0.5) * 15;
            dustPos[i*3+1] = (Math.random() - 0.5) * 15;
            dustPos[i*3+2] = (Math.random() - 0.5) * 15;
            dustSpeeds[i] = 0.005 + Math.random() * 0.01;
        }
        dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
        const dustMat = new THREE.PointsMaterial({
            color: 0xaa88ff,
            size: 0.025,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });
        const dustSystem = new THREE.Points(dustGeo, dustMat);
        scene.add(dustSystem);


        // 5. ORBITAL STRUCTURES

        // Segmented Rail (Massive Ring)
        const railBlockGeo = new THREE.BoxGeometry(0.1, 0.1, 0.4);
        const railCount = 100;
        const railMesh = new THREE.InstancedMesh(railBlockGeo, techMaterial, railCount);
        for(let i=0; i<railCount; i++) {
            const angle = (i / railCount) * Math.PI * 2;
            dummy.position.set(Math.cos(angle) * 3.2, Math.sin(angle) * 3.2, 0);
            dummy.rotation.set(0, 0, angle);
            dummy.updateMatrix();
            railMesh.setMatrixAt(i, dummy.matrix);
        }
        railMesh.rotation.x = Math.PI / 3;
        railMesh.rotation.y = Math.PI / 6;
        scene.add(railMesh);

        // Thin Wireframe Ring
        const orbitGeo = new THREE.TorusGeometry(3.8, 0.005, 16, 100);
        const ring2 = new THREE.Mesh(orbitGeo, new THREE.MeshBasicMaterial({color: 0xaa00ff}));
        ring2.rotation.x = -Math.PI / 4;
        scene.add(ring2);

        // CONTAINMENT PYLONS & BEAMS
        const pylonGroup = new THREE.Group();
        // Geometry for pylon: Base + Rod + Floating bits
        const baseGeo = new THREE.CylinderGeometry(0.1, 0.3, 1, 6);
        const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 6);
        const emitterGeo = new THREE.ConeGeometry(0.2, 0.5, 8, 1, true); // Open cone
        
        // Beam Geometry
        const beamGeo = new THREE.ConeGeometry(0.3, 4, 32, 1, true);
        beamGeo.translate(0, -2, 0); // Pivot at top
        beamGeo.rotateX(-Math.PI/2); // Point Z

        for(let i=0; i<3; i++) {
            const pylon = new THREE.Group();
            const angle = (i / 3) * Math.PI * 2;
            
            // Build visual pylon
            const base = new THREE.Mesh(baseGeo, techMaterial);
            base.rotation.x = Math.PI / 2;
            
            const rod = new THREE.Mesh(rodGeo, techMaterial);
            rod.rotation.x = Math.PI / 2;
            
            const emitter = new THREE.Mesh(emitterGeo, emissiveTechMat);
            emitter.rotation.x = -Math.PI / 2;
            emitter.position.z = -1.8; // Tip
            
            pylon.add(base, rod, emitter);
            
            // Add Beam
            const beam = new THREE.Mesh(beamGeo, beamMaterial);
            beam.position.z = -1.8;
            beam.lookAt(0,0,0);
            pylon.add(beam);
            
            pylon.position.set(Math.cos(angle) * 4.5, 0, Math.sin(angle) * 4.5);
            pylon.lookAt(0,0,0);
            pylonGroup.add(pylon);
        }
        scene.add(pylonGroup);

        // DATA RING (Inner)
        const dataGeo = new THREE.BoxGeometry(0.04, 0.1, 0.02);
        const dataCount = 48;
        const dataRing = new THREE.InstancedMesh(dataGeo, new THREE.MeshBasicMaterial({color: 0xaa00ff}), dataCount);
        for(let i=0; i<dataCount; i++) {
            const angle = (i / dataCount) * Math.PI * 2;
            dummy.position.set(Math.cos(angle) * 1.3, 0, Math.sin(angle) * 1.3);
            dummy.rotation.set(0, angle, 0);
            dummy.scale.set(1, 1 + Math.random(), 1); // Varied heights
            dummy.updateMatrix();
            dataRing.setMatrixAt(i, dummy.matrix);
        }
        artifactGroup.add(dataRing);


        // --- LIGHTING ---
        const internalLight1 = new THREE.PointLight(0xaa00ff, 8, 6); 
        internalLight1.position.set(0, 0, 0);
        artifactGroup.add(internalLight1);
        
        // Orbiting Lights
        const light1 = new THREE.PointLight(0x8800ff, 12, 25);
        scene.add(light1);

        const light2 = new THREE.PointLight(0xffffff, 6, 25);
        scene.add(light2);
        
        const rimLight = new THREE.DirectionalLight(0x440088, 2);
        rimLight.position.set(0, 10, 0);
        scene.add(rimLight);

        // --- POST PROCESSING ---
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const afterimagePass = new AfterimagePass();
        afterimagePass.uniforms["damp"].value = 0.82; 
        composer.addPass(afterimagePass);

        // --- ANIMATION LOGIC ---
        
        let targetRotation = new THREE.Vector3(0, 0, 0);
        let lastTickTime = 0;
        const tickInterval = 1.4;
        
        const clock = new THREE.Clock();
        const tempEl = document.getElementById('temp-val');
        const entropyEl = document.getElementById('entropy-val');
        const logEl = document.getElementById('sys-log');
        


        function animate() {
            requestAnimationFrame(animate);
            
            const time = clock.getElapsedTime();

            coreShaderMaterial.uniforms.uTime.value = time;

            if (time - lastTickTime > tickInterval) {
                lastTickTime = time;
                targetRotation.y += Math.PI / 5; 
                targetRotation.x += (Math.random() - 0.5) * 0.4;
                targetRotation.z += (Math.random() - 0.5) * 0.4;
                
                glitchMaterial.opacity = 0.6; 
                entropyEl.style.color = Math.random() > 0.5 ? '#ff0055' : '#fff';
                addLog();
            }

            // Artifact Movement
            artifactGroup.rotation.x = THREE.MathUtils.lerp(artifactGroup.rotation.x, targetRotation.x, 0.1);
            artifactGroup.rotation.y = THREE.MathUtils.lerp(artifactGroup.rotation.y, targetRotation.y, 0.1);
            artifactGroup.rotation.z = THREE.MathUtils.lerp(artifactGroup.rotation.z, targetRotation.z, 0.1);

            glitchMaterial.opacity = THREE.MathUtils.lerp(glitchMaterial.opacity, 0.0, 0.1); 
            if(glitchMaterial.opacity > 0.01) {
                const s = 1.02 + Math.random() * 0.1;
                glitchShell.scale.set(s, s, s);
            }

            // Orbital Rotations
            railMesh.rotation.z += 0.002;
            ring2.rotation.y -= 0.003;
            pylonGroup.rotation.y += 0.005;
            dataRing.rotation.y -= 0.01;
            
            // Gyroscope Physics
            gyro1.rotation.x += 0.02;
            gyro2.rotation.y += 0.03;
            gyro3.rotation.z += 0.01;

            // Lights
            light1.position.set(Math.sin(time)*9, 6, Math.cos(time)*9);
            light2.position.set(Math.sin(time*0.7)*-9, -6, Math.cos(time*0.7)*-9);

            artifactGroup.position.y = Math.sin(time * 0.5) * 0.4;
            
            // Dust
            const positions = dustSystem.geometry.attributes.position.array;
            for(let i=0; i<dustCount; i++) {
                positions[i*3+1] += dustSpeeds[i]; 
                if(positions[i*3+1] > 7.5) positions[i*3+1] = -7.5;
            }
            dustSystem.geometry.attributes.position.needsUpdate = true;
            
            // UI Fluctuation
            if (Math.random() > 0.8) {
                tempEl.innerText = (Math.random() * 0.00001).toFixed(7) + " K";
            }

            controls.update();
            composer.render();
        }

        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            if(camera && renderer && composer) {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
                composer.setSize(width, height);
            }
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
            title="Frozen Time"
        />
    );
};