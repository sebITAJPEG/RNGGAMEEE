import React, { useEffect, useMemo } from 'react';

interface Props {
    onComplete: () => void;
}

export const HypercubeFragmentCutscene: React.FC<Props> = ({ onComplete }) => {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data === 'HYPERCUBE_CUTSCENE_COMPLETE') {
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
    <title>Dimensional Unfolding</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Orbitron', sans-serif; }
        canvas { display: block; }
        
        #ui-layer {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10;
        }

        .title {
            color: #fff;
            font-size: 3rem;
            font-weight: 900;
            letter-spacing: 0.5rem;
            text-shadow: 0 0 20px #a78bfa;
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.5s ease-out, transform 2s ease-out;
            text-align: center;
        }

        .subtitle {
            color: #a78bfa;
            font-size: 1.2rem;
            margin-top: 1rem;
            letter-spacing: 0.2rem;
            opacity: 0;
            font-family: monospace;
        }

        .glitch-text {
            animation: glitch 0.3s infinite;
            color: #ff00ff;
            text-shadow: 2px 0 #00ffff, -2px 0 #ff0000;
        }

        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }

        #flash {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: white;
            opacity: 0;
            pointer-events: none;
            z-index: 100;
            mix-blend-mode: overlay;
            transition: opacity 0.1s linear;
        }

        #scanlines {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
            background-size: 100% 4px;
            pointer-events: none;
            z-index: 5;
            opacity: 0.3;
        }
    </style>
    <script type="importmap">
        {
            "imports": {
                "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
                "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/",
                "tone": "https://cdn.jsdelivr.net/npm/tone@14.7.77/+esm"
            }
        }
    </script>
</head>
<body>
    <div id="ui-layer">
        <div id="title" class="title"></div>
        <div id="subtitle" class="subtitle"></div>
    </div>
    <div id="scanlines"></div>
    <div id="flash"></div>

    <script type="module">
        import * as THREE from 'three';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
        import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
        import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
        import * as Tone from 'tone';

        // --- AUDIO SYSTEM (Tone.js) ---
        class AudioEngine {
            constructor() {
                this.initialized = false;
                this.synth = null;
                this.drone = null;
                this.glitchSynth = null;
                this.riser = null;
                this.reverb = null;
                this.delay = null;
                this.bitCrusher = null;
            }

            async init() {
                if (this.initialized) return;
                await Tone.start();
                this.initialized = true;

                // Effects Chain
                this.reverb = new Tone.Reverb({ decay: 5, wet: 0.5 }).toDestination();
                this.delay = new Tone.PingPongDelay({ delayTime: "8n", feedback: 0.4, wet: 0.3 }).connect(this.reverb);
                this.bitCrusher = new Tone.BitCrusher(4).toDestination();
                this.filter = new Tone.Filter(2000, "lowpass").connect(this.delay);

                // 1. Cinematic Drone (Deep, evolving pad)
                this.drone = new Tone.PolySynth(Tone.FMSynth, {
                    harmonicity: 0.5,
                    modulationIndex: 2,
                    oscillator: { type: "sine" },
                    envelope: { attack: 2, decay: 1, sustain: 1, release: 4 },
                    modulation: { type: "square" },
                    modulationEnvelope: { attack: 0.5, decay: 0, sustain: 1, release: 0.5 }
                }).connect(this.filter);
                this.drone.volume.value = -12;

                // 2. Main Synth (Crystal clear chords)
                this.synth = new Tone.PolySynth(Tone.Synth, {
                    oscillator: { type: "triangle" },
                    envelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 2 }
                }).connect(this.delay);
                this.synth.volume.value = -8;

                // 3. Glitch FX (Noisy, crushed)
                this.glitchSynth = new Tone.NoiseSynth({
                    noise: { type: "pink" },
                    envelope: { attack: 0.01, decay: 0.1, sustain: 0 }
                }).connect(this.bitCrusher);
                this.glitchSynth.volume.value = -5;

                // 4. Riser (Ascension sound)
                this.riser = new Tone.Oscillator(100, "sawtooth").connect(this.reverb);
                this.riser.volume.value = -20;
            }

            playDrone() {
                if (!this.initialized) return;
                // Play a dark, suspended chord: D2, A2, E3, F#3
                this.drone.triggerAttack(["D2", "A2", "E3", "F#3"]);
                
                // Automate filter
                const now = Tone.now();
                this.filter.frequency.setValueAtTime(100, now);
                this.filter.frequency.linearRampToValueAtTime(3000, now + 10);
            }

            playChord() {
                if (!this.initialized) return;
                // Ethereal chord: D4, F#4, A4, C#5 (D Maj 7)
                this.synth.triggerAttackRelease(["D4", "F#4", "A4", "C#5"], "2n");
            }

            playStab() {
                if (!this.initialized) return;
                // Sharp impact
                this.synth.triggerAttackRelease(["D2", "D3"], "8n");
                this.glitchSynth.triggerAttackRelease("16n");
            }

            playGlitchSequence() {
                if (!this.initialized) return;
                const now = Tone.now();
                for(let i=0; i<5; i++) {
                    this.glitchSynth.triggerAttackRelease("32n", now + Math.random() * 0.5);
                }
            }

            startRiser() {
                if (!this.initialized) return;
                const now = Tone.now();
                this.riser.start(now);
                this.riser.frequency.setValueAtTime(100, now);
                this.riser.frequency.exponentialRampToValueAtTime(2000, now + 4);
                this.riser.volume.linearRampToValueAtTime(-5, now + 3);
                this.riser.stop(now + 4);
            }

            stopAll() {
                if (!this.initialized) return;
                this.drone.releaseAll();
                this.synth.releaseAll();
                this.riser.stop();
            }
        }
        const audio = new AudioEngine();

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.03);
        
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 8);

        const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.body.appendChild(renderer.domElement);

        // --- POST PROCESSING ---
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));

        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 2.5, 0.5, 0.1);
        composer.addPass(bloomPass);

        const glitchPass = new GlitchPass();
        glitchPass.enabled = false;
        glitchPass.goWild = true;
        composer.addPass(glitchPass);

        // Scanline/Chromatic Aberration Shader
        const retroShader = {
            uniforms: {
                tDiffuse: { value: null },
                uTime: { value: 0 },
                uDistortion: { value: 0.0 }
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
                uniform float uTime;
                uniform float uDistortion;
                varying vec2 vUv;

                void main() {
                    vec2 uv = vUv;
                    
                    // Chromatic Aberration
                    float r = texture2D(tDiffuse, uv + vec2(uDistortion * 0.005, 0.0)).r;
                    float g = texture2D(tDiffuse, uv).g;
                    float b = texture2D(tDiffuse, uv - vec2(uDistortion * 0.005, 0.0)).b;
                    
                    vec3 color = vec3(r, g, b);
                    
                    // Scanline
                    float scanline = sin(uv.y * 800.0 + uTime * 10.0) * 0.05;
                    color -= scanline;

                    gl_FragColor = vec4(color, 1.0);
                }
            \`
        };
        const retroPass = new ShaderPass(retroShader);
        composer.addPass(retroPass);

        // --- TESSERACT GEOMETRY ---
        // 4D Vertices
        const vertices4D = [];
        for(let i=0; i<16; i++) {
            vertices4D.push({
                x: (i & 1) ? 1 : -1,
                y: (i & 2) ? 1 : -1,
                z: (i & 4) ? 1 : -1,
                w: (i & 8) ? 1 : -1
            });
        }

        // 4D Edges (Indices)
        const edges = [];
        for(let i=0; i<16; i++) {
            for(let j=i+1; j<16; j++) {
                let diff = 0;
                if(vertices4D[i].x !== vertices4D[j].x) diff++;
                if(vertices4D[i].y !== vertices4D[j].y) diff++;
                if(vertices4D[i].z !== vertices4D[j].z) diff++;
                if(vertices4D[i].w !== vertices4D[j].w) diff++;
                if(diff === 1) edges.push([i, j]);
            }
        }

        // Geometry for lines
        const lineGeo = new THREE.BufferGeometry();
        const linePos = new Float32Array(edges.length * 2 * 3); // 2 points per edge, 3 coords per point
        lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3).setUsage(THREE.DynamicDrawUsage));
        
        const lineMat = new THREE.LineBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.8 });
        const tesseractLines = new THREE.LineSegments(lineGeo, lineMat);
        scene.add(tesseractLines);

        // Geometry for nodes
        const nodeGeo = new THREE.IcosahedronGeometry(0.08, 1);
        const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const nodes = new THREE.InstancedMesh(nodeGeo, nodeMat, 16);
        nodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        scene.add(nodes);

        // Inner glowing core
        const coreGeo = new THREE.SphereGeometry(0.1, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        // Background Particles
        const starsGeo = new THREE.BufferGeometry();
        const starCount = 1000;
        const starPos = new Float32Array(starCount * 3);
        for(let i=0; i<starCount*3; i++) starPos[i] = (Math.random() - 0.5) * 40;
        starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({ size: 0.05, color: 0x444444 }));
        scene.add(stars);

        // --- MATH FUNCTIONS ---
        function rotate4D(v, xy, xz, xw, yz, yw, zw) {
            let x = v.x, y = v.y, z = v.z, w = v.w;
            
            // XW Rotation
            if (xw !== 0) {
                let tx = x * Math.cos(xw) - w * Math.sin(xw);
                let tw = x * Math.sin(xw) + w * Math.cos(xw);
                x = tx; w = tw;
            }
            // YZ Rotation
            if (yz !== 0) {
                let ty = y * Math.cos(yz) - z * Math.sin(yz);
                let tz = y * Math.sin(yz) + z * Math.cos(yz);
                y = ty; z = tz;
            }
            // ZW Rotation
            if (zw !== 0) {
                let tz = z * Math.cos(zw) - w * Math.sin(zw);
                let tw = z * Math.sin(zw) + w * Math.cos(zw);
                z = tz; w = tw;
            }

            return { x, y, z, w };
        }

        function project4D(v) {
            const distance = 3.0;
            const wInv = 1 / (distance - v.w);
            return new THREE.Vector3(
                v.x * wInv,
                v.y * wInv,
                v.z * wInv
            );
        }

        // --- SEQUENCER ---
        const titleEl = document.getElementById('title');
        const subEl = document.getElementById('subtitle');
        const flashEl = document.getElementById('flash');

        const state = {
            t: 0,
            xwSpeed: 0,
            yzSpeed: 0,
            zwSpeed: 0,
            scale: 0.1,
            distortion: 0,
            phase: 0 // 0: Init, 1: Expansion, 2: Tesseract, 3: Transcend
        };

        const sequence = [
            // PHASE 0: Init
            { t: 0.5, action: () => {
                audio.init().then(() => {
                    audio.playDrone();
                    audio.playGlitchSequence();
                });
                titleEl.innerText = "ANOMALY DETECTED";
                subEl.innerText = "DIMENSIONAL BREACH IMMINENT";
                titleEl.style.opacity = 1;
                subEl.style.opacity = 1;
            }},
            // PHASE 1: Expansion
            { t: 3.0, action: () => {
                state.phase = 1;
                audio.playChord();
                audio.playStab();
                titleEl.style.opacity = 0;
                subEl.style.opacity = 0;
            }},
            // PHASE 2: Tesseract
            { t: 5.0, action: () => {
                state.phase = 2;
                titleEl.innerText = "HYPERCUBE";
                subEl.innerText = "4TH DIMENSION STABILIZED";
                titleEl.style.opacity = 1;
                subEl.style.opacity = 1;
                titleEl.style.color = "#a78bfa";
                glitchPass.enabled = true;
                setTimeout(() => glitchPass.enabled = false, 200);
                audio.playStab();
                audio.playGlitchSequence();
            }},
            // PHASE 3: Transcend
            { t: 10.0, action: () => {
                state.phase = 3;
                audio.startRiser();
                titleEl.innerText = "TRANSCENDING";
                subEl.innerText = "";
                titleEl.classList.add('glitch-text');
            }},
            // End
            { t: 13.0, action: () => {
                flashEl.style.opacity = 1;
            }},
            { t: 13.5, action: () => {
                audio.stopAll();
                window.parent.postMessage('HYPERCUBE_CUTSCENE_COMPLETE', '*');
            }}
        ];

        let seqIdx = 0;
        const clock = new THREE.Clock();
        const dummy = new THREE.Object3D();

        function animate() {
            requestAnimationFrame(animate);
            
            const dt = clock.getDelta();
            const elapsed = clock.getElapsedTime();
            state.t += dt;

            // Sequencer
            if (seqIdx < sequence.length && elapsed >= sequence[seqIdx].t) {
                sequence[seqIdx].action();
                seqIdx++;
            }

            // Logic per phase
            if (state.phase === 0) {
                // Pulsing core
                const pulse = 1 + Math.sin(elapsed * 10) * 0.1;
                core.scale.setScalar(pulse);
                state.scale = THREE.MathUtils.lerp(state.scale, 0.1, dt);
            } else if (state.phase === 1) {
                // Expansion
                core.scale.setScalar(0.1);
                state.scale = THREE.MathUtils.lerp(state.scale, 1.5, dt * 2);
                state.xwSpeed = THREE.MathUtils.lerp(state.xwSpeed, 0.5, dt);
                state.yzSpeed = THREE.MathUtils.lerp(state.yzSpeed, 0.3, dt);
            } else if (state.phase === 2) {
                // Tesseract
                state.xwSpeed = 1.0;
                state.yzSpeed = 0.5;
                state.zwSpeed = Math.sin(elapsed) * 0.5;
                camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6, dt);
                
                // Random glitches
                if (Math.random() > 0.98) {
                    state.distortion = 1.0;
                    audio.playGlitchSequence();
                } else {
                    state.distortion = THREE.MathUtils.lerp(state.distortion, 0, dt * 5);
                }
            } else if (state.phase === 3) {
                // Transcend
                state.xwSpeed += dt * 2;
                state.yzSpeed += dt * 2;
                state.scale += dt * 0.5;
                state.distortion += dt * 0.2;
                camera.position.z -= dt * 2;
                bloomPass.strength += dt;
            }

            // Update Tesseract
            const angleXW = state.t * state.xwSpeed;
            const angleYZ = state.t * state.yzSpeed;
            const angleZW = state.t * state.zwSpeed;

            const projectedVerts = [];
            
            for(let i=0; i<16; i++) {
                const v4 = vertices4D[i];
                const rotated = rotate4D(v4, 0, 0, angleXW, angleYZ, 0, angleZW);
                const v3 = project4D(rotated);
                v3.multiplyScalar(state.scale);
                projectedVerts.push(v3);

                // Update Node
                dummy.position.copy(v3);
                dummy.scale.setScalar(state.scale * 0.15 * (1 / (3 - rotated.w))); // Size depth cue
                dummy.updateMatrix();
                nodes.setMatrixAt(i, dummy.matrix);
            }
            nodes.instanceMatrix.needsUpdate = true;

            // Update Lines
            const linePositions = lineGeo.attributes.position.array;
            let idx = 0;
            for(const edge of edges) {
                const v1 = projectedVerts[edge[0]];
                const v2 = projectedVerts[edge[1]];
                
                linePositions[idx++] = v1.x;
                linePositions[idx++] = v1.y;
                linePositions[idx++] = v1.z;
                
                linePositions[idx++] = v2.x;
                linePositions[idx++] = v2.y;
                linePositions[idx++] = v2.z;
            }
            lineGeo.attributes.position.needsUpdate = true;

            // Render
            retroPass.uniforms.uTime.value = elapsed;
            retroPass.uniforms.uDistortion.value = state.distortion;
            
            tesseractLines.rotation.y += dt * 0.1;
            nodes.rotation.y += dt * 0.1;
            stars.rotation.z -= dt * 0.05;

            composer.render();
        }

        // Start
        setTimeout(() => {
            animate();
            // Try auto-init audio
            audio.init();
        }, 100);

        window.addEventListener('click', () => {
            audio.init();
        });

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
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
            title="Hypercube Cutscene"
        />
    );
};
