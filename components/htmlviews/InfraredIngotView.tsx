import React, { useMemo } from 'react';

export const InfraredIngotView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Infrared Ingot [Radiant]</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #050000; font-family: 'Share Tech Mono', monospace; }
        #canvas-container { width: 100vw; height: 100vh; }
        
        /* Main UI */
        #ui {
            position: absolute;
            bottom: 30px; 
            left: 30px;
            color: #ff3333;
            pointer-events: none;
            text-transform: uppercase;
            letter-spacing: 2px;
            z-index: 10;
            text-shadow: 0 0 15px rgba(255, 50, 50, 0.6);
            opacity: 0;
            transition: opacity 2s ease;
        }
        h2 { margin: 0; font-family: 'Orbitron', sans-serif; font-size: 2rem; }
        .rarity { color: #ffaa00; font-weight: bold; font-size: 0.9em; margin-top: 5px; }
        .sub { font-size: 0.7em; opacity: 0.8; color: #fff; margin-top: 5px; }
        
        #flash-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: #ffcccc;
            opacity: 1;
            pointer-events: none;
            z-index: 60;
        }

        /* Buttons Container */
        #controls {
            position: absolute;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            z-index: 20;
            pointer-events: auto;
        }

        .hud-btn {
            width: 40px;
            height: 40px;
            border: 1px solid rgba(255, 50, 50, 0.5);
            border-radius: 50%;
            color: #ff3333;
            background: rgba(20, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        .hud-btn:hover {
            border-color: #ff8888;
            box-shadow: 0 0 15px rgba(255, 50, 50, 0.5);
            background: rgba(40, 0, 0, 0.8);
            color: #fff;
        }

        canvas { display: block; width: 100%; height: 100%; }

        #heat-warning {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            color: #ff0000;
            font-family: 'Orbitron', sans-serif;
            font-size: 5rem;
            opacity: 0;
            pointer-events: none;
            text-shadow: 0 0 20px red;
            letter-spacing: 10px;
            z-index: 5;
            white-space: nowrap;
        }

        /* Audio hint */
        #audio-hint {
            position: absolute;
            bottom: 20px;
            width: 100%;
            text-align: center;
            color: rgba(255, 100, 100, 0.5);
            font-size: 0.8rem;
            pointer-events: none;
            transition: opacity 1s;
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
    <div id="canvas-container"></div>
    
    <div id="flash-overlay"></div>
    <div id="heat-warning">CRITICAL TEMP</div>

    <div id="ui">
        <h2>Infrared Ingot</h2>
        <p>Class: Radiant Material</p>
        <p class="rarity">Rarity: 1 in 250,000,000</p>
        <div class="sub">
            Output: <span style="color: #ffaa00">12,500 K</span> | 
            Emission: <span style="color: #ff3333">λ > 700nm</span>
        </div>
    </div>
    
    <div id="controls">
        <div id="mute-btn" class="hud-btn" title="Toggle Audio">🔇</div>
    </div>

    <div id="audio-hint">[ Click anywhere to enable thermal scanners ]</div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
        import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

        // --- SCENE SETUP ---
        const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050000);
        scene.fog = new THREE.FogExp2(0x050000, 0.05);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        const defaultPos = new THREE.Vector3(4, 3, 5);
        camera.position.copy(defaultPos);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ReinhardToneMapping;
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false; // Zoom handled by transition? Maybe re-enable later
        controls.minDistance = 2;
        controls.maxDistance = 15;
        controls.enabled = true;

        // --- AUDIO ENGINE ---
        let audioContext = null;
        let masterGain = null;
        let isMuted = false;

        function initAudio() {
            if (audioContext) {
                if(audioContext.state === 'suspended') audioContext.resume();
                return;
            }

            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();

            masterGain = audioContext.createGain();
            masterGain.gain.value = isMuted ? 0 : 0.6;
            masterGain.connect(audioContext.destination);

            // --- LAYER 1: THE CORE (Sub & Drone) ---
            // Sub-bass heavy sine for "weight"
            const subOsc = audioContext.createOscillator();
            subOsc.type = 'sine'; subOsc.frequency.value = 35;
            const subGain = audioContext.createGain();
            subGain.gain.value = 0.4;
            subOsc.connect(subGain); subGain.connect(masterGain);
            subOsc.start();

            // Industrial Drone (Sawtooth with slow filter sweep)
            const droOsc = audioContext.createOscillator();
            droOsc.type = 'sawtooth'; droOsc.frequency.value = 55;
            const droFilter = audioContext.createBiquadFilter();
            droFilter.type = 'lowpass'; droFilter.frequency.value = 100;
            droFilter.Q.value = 5;
            const droGain = audioContext.createGain();
            droGain.gain.value = 0.15;
            
            // LFO for drone filter
            const filterLfo = audioContext.createOscillator();
            filterLfo.type = 'sine'; filterLfo.frequency.value = 0.1; // slow breath
            const filterLfoGain = audioContext.createGain();
            filterLfoGain.gain.value = 50; // modulate frequency by +/- 50Hz
            filterLfo.connect(filterLfoGain); filterLfoGain.connect(droFilter.frequency);
            filterLfo.start();

            droOsc.connect(droFilter); droFilter.connect(droGain); droGain.connect(masterGain);
            droOsc.start();


            // --- LAYER 2: SINGING METAL (Harmonics) ---
            // Primary High Sine
            const singOsc1 = audioContext.createOscillator();
            singOsc1.type = 'sine'; singOsc1.frequency.value = 600;
            const singGain1 = audioContext.createGain();
            singGain1.gain.value = 0.05;
            
            // Vibrato LFO
            const vibLfo = audioContext.createOscillator();
            vibLfo.frequency.value = 4.0; 
            const vibGain = audioContext.createGain();
            vibGain.gain.value = 10;
            vibLfo.connect(vibGain); vibGain.connect(singOsc1.frequency);
            vibLfo.start();

            singOsc1.connect(singGain1); singGain1.connect(masterGain);
            singOsc1.start();

            // Detuned Harmony (Creates 'beating' texture)
            const singOsc2 = audioContext.createOscillator();
            singOsc2.type = 'sine'; singOsc2.frequency.value = 604; // 4Hz beat
            const singGain2 = audioContext.createGain();
            singGain2.gain.value = 0.04;
            singOsc2.connect(singGain2); singGain2.connect(masterGain);
            singOsc2.start();

            // Upper Harmonic
            const singOsc3 = audioContext.createOscillator();
            singOsc3.type = 'triangle'; singOsc3.frequency.value = 1200;
            const singGain3 = audioContext.createGain();
            singGain3.gain.value = 0.01;
            singOsc3.connect(singGain3); singGain3.connect(masterGain);
            singOsc3.start();


            // --- LAYER 3: HEAT CRACKLE & STEAM ---
            const bufferSize = audioContext.sampleRate * 2;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1);
            }

            // Continuous Micro-Crackle
            const crackleSrc = audioContext.createBufferSource();
            crackleSrc.buffer = buffer; crackleSrc.loop = true;
            const crackleFilter = audioContext.createBiquadFilter();
            crackleFilter.type = 'highpass'; crackleFilter.frequency.value = 3000;
            const crackleGain = audioContext.createGain();
            crackleGain.gain.value = 0.02;

            // Random modulation for crackle
            const crackleMod = audioContext.createOscillator();
            crackleMod.type = 'square'; crackleMod.frequency.value = 12; // Fast random-ish clicks
            const crackleModGain = audioContext.createGain();
            crackleModGain.gain.value = 0.02;
            crackleMod.connect(crackleModGain); crackleModGain.connect(crackleGain.gain);
            crackleMod.start();

            crackleSrc.connect(crackleFilter); crackleFilter.connect(crackleGain); crackleGain.connect(masterGain);
            crackleSrc.start();

            // Occasional Steam Bursts (Simulated via filtered noise bursts)
            // We'll create a function to trigger these randomly
            function triggerSteam() {
                if(isMuted || !audioContext) return;
                
                const steamSrc = audioContext.createBufferSource();
                steamSrc.buffer = buffer;
                
                const steamFilter = audioContext.createBiquadFilter();
                steamFilter.type = 'bandpass'; 
                steamFilter.frequency.value = 800 + Math.random() * 500;
                steamFilter.Q.value = 1;

                const steamEnv = audioContext.createGain();
                steamEnv.gain.setValueAtTime(0, audioContext.currentTime);
                steamEnv.gain.linearRampToValueAtTime(0.1 + Math.random()*0.1, audioContext.currentTime + 0.1);
                steamEnv.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5 + Math.random());

                steamSrc.connect(steamFilter); 
                steamFilter.connect(steamEnv);
                steamEnv.connect(masterGain);
                
                steamSrc.start();
                steamSrc.stop(audioContext.currentTime + 2);

                setTimeout(triggerSteam, 200 + Math.random() * 3000); // Random interval
            }
            triggerSteam();

            document.getElementById('audio-hint').style.opacity = 0;
        }

        window.addEventListener('click', initAudio);
        window.addEventListener('keydown', initAudio);

        const muteBtn = document.getElementById('mute-btn');
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            initAudio();
            isMuted = !isMuted;
            if(masterGain) masterGain.gain.setTargetAtTime(isMuted ? 0 : 0.6, audioContext.currentTime, 0.1);
            muteBtn.innerText = isMuted ? "🔇" : "🔊";
            muteBtn.style.color = isMuted ? "#666" : "#ff3333";
            muteBtn.style.borderColor = isMuted ? "#666" : "rgba(255, 50, 50, 0.5)";
        });

        // --- SCENE OBJECTS ---

        // Ingot Geometry
        const ingotGeo = new THREE.BoxGeometry(1.2, 0.4, 2.5, 32, 10, 64);
        
        // Custom Shader Material for "Molten" look
        const ingotMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uBaseColor: { value: new THREE.Color(0x330000) },
                uHotColor: { value: new THREE.Color(0xffaa00) },
                uPulseColor: { value: new THREE.Color(0xff3333) }
            },
            vertexShader: \`
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPos;
                uniform float uTime;
                
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vPos = position;
                    
                    // Subtle breathing effect
                    vec3 p = position;
                    float breath = sin(uTime * 2.0 + p.z * 2.0) * 0.02;
                    p += normal * breath;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
                }
            \`,
            fragmentShader: \`
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPos;
                uniform float uTime;
                uniform vec3 uBaseColor;
                uniform vec3 uHotColor;
                uniform vec3 uPulseColor;

                // Simple noise function
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }

                float noise(vec2 st) {
                    vec2 i = floor(st);
                    vec2 f = fract(st);
                    float a = random(i);
                    float b = random(i + vec2(1.0, 0.0));
                    float c = random(i + vec2(0.0, 1.0));
                    float d = random(i + vec2(1.0, 1.0));
                    vec2 u = f * f * (3.0 - 2.0 * f);
                    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
                }

                void main() {
                    // 1. Base Heat Noise (Low Freq)
                    float n = noise(vPos.xz * 3.0 + vec2(0.0, uTime * 0.5));
                    float n2 = noise(vPos.xz * 6.0 - vec2(uTime * 0.2, 0.0));
                    
                    // 2. Surface Grain (High Freq)
                    float grain = noise(vPos.xz * 50.0);
                    
                    float heat = n * 0.6 + n2 * 0.4;
                    heat += grain * 0.1; // Add texture
                    
                    // 3. Edge Glowing
                    vec3 viewDir = vec3(0.0, 0.0, 1.0);
                    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.0);
                    
                    // 4. Pulse
                    float pulse = sin(uTime * 3.0) * 0.5 + 0.5;
                    
                    // Mix Colors
                    vec3 finalColor = mix(uBaseColor, uHotColor, heat * (0.8 + pulse * 0.2));
                    finalColor += uPulseColor * fresnel * 2.0;
                    
                    // Add "cracks" - dark lines where noise is low
                    float crack = smoothstep(0.3, 0.35, heat);
                    finalColor *= (0.5 + 0.5 * crack); 

                    gl_FragColor = vec4(finalColor * 2.5, 1.0);
                }
            \`,
        });

        const ingot = new THREE.Mesh(ingotGeo, ingotMat);
        scene.add(ingot);

        // Floor Grid (Reflective)
        const gridHelper = new THREE.GridHelper(20, 20, 0x440000, 0x110000);
        gridHelper.position.y = -2;
        scene.add(gridHelper);

        // Particles (Sparks)
        const particlesCount = 200;
        const posArray = new Float32Array(particlesCount * 3);
        const speedArray = new Float32Array(particlesCount);
        const offsetArray = new Float32Array(particlesCount);

        for (let i = 0; i < particlesCount; i++) {
            posArray[i * 3] = (Math.random() - 0.5) * 4;
            posArray[i * 3 + 1] = Math.random() * 5 - 2;
            posArray[i * 3 + 2] = (Math.random() - 0.5) * 4;
            speedArray[i] = 0.02 + Math.random() * 0.05;
            offsetArray[i] = Math.random() * Math.PI * 2;
        }

        const particlesGeo = new THREE.BufferGeometry();
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMat = new THREE.PointsMaterial({
            color: 0xffaa00,
            size: 0.05,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particles);

        // Dripping System (InstancedMesh for 3D drops)
        const dripCount = 30;
        const dripGeo = new THREE.SphereGeometry(0.06, 8, 8);
        const dripMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        const dripMesh = new THREE.InstancedMesh(dripGeo, dripMat, dripCount);
        dripMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        scene.add(dripMesh);

        // --- DETAILS: CONTAINMENT RINGS ---
        const ringGeo = new THREE.TorusGeometry(2.5, 0.02, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
        
        const ring1 = new THREE.Mesh(ringGeo, ringMat);
        scene.add(ring1);
        
        const ring2 = new THREE.Mesh(ringGeo, ringMat);
        ring2.rotation.x = Math.PI / 2;
        ring2.scale.setScalar(1.2);
        scene.add(ring2);
        
        // Tech markers on rings
        const markerGeo = new THREE.BoxGeometry(0.2, 0.1, 0.1);
        const markerMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        for (let i = 0; i < 4; i++) {
            const m = new THREE.Mesh(markerGeo, markerMat);
            m.position.set(2.5 * Math.cos(i * Math.PI / 2), 2.5 * Math.sin(i * Math.PI / 2), 0);
            ring1.add(m);
        }

        // Drip Logic Data
        const dripData = [];
        const dummy = new THREE.Object3D();

        for (let i = 0; i < dripCount; i++) {
            dripData.push({
                x: 0, y: -10, z: 0,
                speed: 0,
                life: -Math.random() * 5.0, // Delay
                scaleY: 1
            });
            dummy.position.set(0, -10, 0);
            dummy.updateMatrix();
            dripMesh.setMatrixAt(i, dummy.matrix);
        }

        // Post Processing
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0.2;
        bloomPass.strength = 1.2;
        bloomPass.radius = 0.5;
        composer.addPass(bloomPass);

        // Heat Haze / Distortion Pass (Simple RGB shift for now)
        const aberrationPass = new ShaderPass({
            uniforms: { tDiffuse: { value: null }, amount: { value: 0.002 }, uTime: { value: 0 } },
            vertexShader: \`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }\`,
            fragmentShader: \`
                uniform sampler2D tDiffuse; 
                uniform float amount; 
                uniform float uTime;
                varying vec2 vUv; 
                
                void main() { 
                    vec2 dist = vUv - 0.5;
                    // Wobbly heat effect
                    float heat = sin(vUv.y * 20.0 + uTime * 5.0) * 0.005;
                    vec2 heatOffset = vec2(heat, 0.0);
                    
                    float r = texture2D(tDiffuse, vUv + heatOffset + vec2(amount, 0.0)).r; 
                    float g = texture2D(tDiffuse, vUv + heatOffset).g; 
                    float b = texture2D(tDiffuse, vUv + heatOffset - vec2(amount, 0.0)).b; 
                    gl_FragColor = vec4(r, g, b, 1.0); 
                }
            \`,
        });
        composer.addPass(aberrationPass);

        // Lights
        const light = new THREE.PointLight(0xff3300, 2, 20);
        light.position.set(2, 4, 3);
        scene.add(light);
        const light2 = new THREE.PointLight(0xffaa00, 1, 20);
        light2.position.set(-2, -4, -3);
        scene.add(light2);

        // --- TRANSITION & ANIMATION ---
        let isTransitioning = true;
        const startTime = performance.now() / 1000;
        const flashOverlay = document.getElementById('flash-overlay');
        const uiDiv = document.getElementById('ui');
        const heatWarning = document.getElementById('heat-warning');

        setTimeout(() => { try{ initAudio(); } catch(e){} }, 500);

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            const now = performance.now() / 1000;

            if (isTransitioning) {
                const t = now - startTime;
                
                flashOverlay.style.opacity = Math.max(0, 1.0 - t * 1.5);
                
                if (t > 0.5 && t < 2.0) {
                     heatWarning.style.opacity = Math.sin((t - 0.5) * Math.PI) * 0.8;
                } else {
                    heatWarning.style.opacity = 0;
                }

                if (t > 2.0) {
                    uiDiv.style.opacity = Math.min(1, t - 2.0);
                }

                if (t >= 3.5) {
                    isTransitioning = false;
                    flashOverlay.style.display = 'none';
                }
            } else {
                controls.update();
            }

            // Ingot Animation
            ingot.rotation.y = time * 0.2;
            ingot.rotation.x = Math.sin(time * 0.5) * 0.1;
            ingotMat.uniforms.uTime.value = time;

            // Particles Update
            const p = particlesGeo.attributes.position.array;
            for(let i=0; i<particlesCount; i++) {
                const ix = i * 3;
                p[ix+1] += speedArray[i];
                // Reset if too high
                if(p[ix+1] > 3) {
                    p[ix+1] = -2;
                    p[ix] = (Math.random() - 0.5) * 4;
                    p[ix+2] = (Math.random() - 0.5) * 4;
                }
            }
            particlesGeo.attributes.position.needsUpdate = true;

            // Drip Animation (Instanced)
            for(let i=0; i<dripCount; i++) {
                const d = dripData[i];
                
                if (d.life > 0) {
                    // Normalize physics
                    d.speed += 0.005; // Gravity
                    d.y -= d.speed;
                    
                    // Stretch based on speed
                    d.scaleY = 1.0 + d.speed * 8.0; 
                    
                    dummy.position.set(d.x, d.y, d.z);
                    dummy.scale.set(1.0 - d.speed, d.scaleY, 1.0 - d.speed); // Thin out as it stretches
                    dummy.updateMatrix();
                    dripMesh.setMatrixAt(i, dummy.matrix);

                    // Reset floor
                    if (d.y < -3.0) {
                        d.life = -Math.random() * 2.0;
                        d.speed = 0;
                        dummy.position.set(0, -100, 0); // Hide
                        dummy.updateMatrix();
                        dripMesh.setMatrixAt(i, dummy.matrix);
                    }
                } else {
                    d.life += 0.02;
                    if (d.life > 0) {
                        // Spawn randomly on bottom of ingot
                        const xOffset = (Math.random() - 0.5) * 1.0;
                        const zOffset = (Math.random() - 0.5) * 2.0;
                        
                        d.x = xOffset * Math.cos(ingot.rotation.y) - zOffset * Math.sin(ingot.rotation.y);
                        // d.z = xOffset * Math.sin(ingot.rotation.y) + zOffset * Math.cos(ingot.rotation.y);
                        // Simplified:
                        d.x = (Math.random() - 0.5) * 1.0;
                        d.z = (Math.random() - 0.5) * 2.0;

                        d.y = -0.25; // Just below ingot center
                        d.speed = 0;
                        d.scaleY = 1;
                    }
                }
            }
            dripMesh.instanceMatrix.needsUpdate = true;

            // Lights flickering
            light.intensity = 2 + Math.sin(time * 10) * 0.5;
            light2.intensity = 1 + Math.cos(time * 8) * 0.3;
            
            // Rings Animation
            if(ring1) {
                ring1.rotation.x = time * 0.5;
                ring1.rotation.y = time * 0.2;
            }
            if(ring2) {
                ring2.rotation.y = time * -0.4;
                ring2.rotation.z = time * 0.1;
                ring2.scale.setScalar(1.0 + Math.sin(time) * 0.05);
            }

            aberrationPass.uniforms.uTime.value = time;

            composer.render();
        }
        animate();

        window.addEventListener('resize', () => {
             camera.aspect = window.innerWidth / window.innerHeight;
             camera.updateProjectionMatrix();
             renderer.setSize(window.innerWidth, window.innerHeight);
             bloomPass.resolution.set(window.innerWidth, window.innerHeight);
        });

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
            title="Infrared Ingot"
        />
    );
};
