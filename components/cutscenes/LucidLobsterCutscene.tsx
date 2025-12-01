import React, { useEffect, useMemo } from 'react';

interface Props {
    onComplete: () => void;
}

export const LucidLobsterCutscene: React.FC<Props> = ({ onComplete }) => {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data === 'LUCID_LOBSTER_CUTSCENE_COMPLETE') {
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
    <title>The Lucid Entity</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Cinzel', serif; }
        canvas { display: block; }
        
        #ui-layer {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            z-index: 10;
        }

        .text-glitch {
            color: #fff;
            font-size: 3rem;
            font-weight: 700;
            text-shadow: 2px 2px #ff00ff;
            opacity: 0;
            letter-spacing: 0.5rem;
            transform: scale(0.8);
            transition: opacity 0.5s ease-in;
        }
        
        .visible {
            opacity: 1;
            transform: scale(1);
            animation: shake 0.2s infinite;
        }

        @keyframes shake {
            0% { transform: translate(0,0) scale(1); }
            25% { transform: translate(-2px,2px) scale(1.02); }
            50% { transform: translate(2px,-2px) scale(0.98); }
            75% { transform: translate(-2px,-2px) scale(1.01); }
            100% { transform: translate(0,0) scale(1); }
        }

        #flash {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: white;
            opacity: 0;
            pointer-events: none;
            z-index: 100;
            mix-blend-mode: exclusion;
            transition: opacity 0.1s linear;
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
        <div id="main-text" class="text-glitch"></div>
    </div>
    <div id="flash"></div>

    <script type="module">
        import * as THREE from 'three';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
        import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
        import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
        import * as Tone from 'tone';

        // --- AUDIO ENGINE ---
        class CosmicAudio {
            constructor() {
                this.initialized = false;
            }

            async init() {
                if (this.initialized) return;
                await Tone.start();
                this.initialized = true;

                this.reverb = new Tone.Reverb({ decay: 10, wet: 0.7 }).toDestination();
                this.delay = new Tone.PingPongDelay("8n", 0.4).connect(this.reverb);
                this.crusher = new Tone.BitCrusher(4).connect(this.reverb);

                // 1. Alien Voice (Grainy)
                this.voice = new Tone.MetalSynth({
                    harmonicity: 5.1,
                    modulationIndex: 32,
                    resonance: 4000,
                    octaves: 1.5
                }).connect(this.delay);
                this.voice.volume.value = -12;

                // 2. Cosmic Drone
                this.drone = new Tone.PolySynth(Tone.FMSynth, {
                    harmonicity: 3,
                    modulationIndex: 10,
                    oscillator: { type: "sawtooth" },
                    envelope: { attack: 2, decay: 1, sustain: 1, release: 4 }
                }).connect(this.reverb);
                this.drone.volume.value = -15;

                // 3. Shepard Riser (Simulated)
                this.riser = new Tone.Oscillator(50, "sawtooth").connect(this.reverb);
                this.riser2 = new Tone.Oscillator(100, "sawtooth").connect(this.reverb);
                this.riser.volume.value = -20;
                this.riser2.volume.value = -20;

                // 4. Impact
                this.impact = new Tone.MembraneSynth().connect(this.crusher);
                this.impact.volume.value = 0;
            }

            playDrone() {
                if(!this.initialized) return;
                this.drone.triggerAttack(["C2", "G2", "C3", "F#3"]);
            }

            playVoice() {
                if(!this.initialized) return;
                const now = Tone.now();
                // Random alien chatter
                for(let i=0; i<5; i++) {
                    this.voice.triggerAttackRelease(Math.random()*1000 + 200, "32n", now + i*0.1);
                }
            }

            startRiser() {
                if(!this.initialized) return;
                const now = Tone.now();
                this.riser.start();
                this.riser2.start();
                this.riser.frequency.exponentialRampToValueAtTime(1000, now + 5);
                this.riser2.frequency.exponentialRampToValueAtTime(2000, now + 5);
                this.riser.volume.linearRampToValueAtTime(-5, now + 4);
                this.riser2.volume.linearRampToValueAtTime(-5, now + 4);
            }

            playDrop() {
                if(!this.initialized) return;
                this.impact.triggerAttackRelease("C1", "1n");
                this.voice.triggerAttackRelease("C5", "8n");
            }

            stop() {
                if(!this.initialized) return;
                this.drone.releaseAll();
                this.riser.stop();
                this.riser2.stop();
            }
        }
        const audio = new CosmicAudio();

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 10);

        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.body.appendChild(renderer.domElement);

        // --- POST PROCESSING ---
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 2.0, 0.5, 0.1);
        composer.addPass(bloomPass);

        const glitchPass = new GlitchPass();
        glitchPass.enabled = false;
        composer.addPass(glitchPass);

        // Custom "Dream Warp" Shader
        const warpShader = {
            uniforms: {
                tDiffuse: { value: null },
                uTime: { value: 0 },
                uAmount: { value: 0.0 }
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
                uniform float uAmount;
                varying vec2 vUv;
                
                void main() {
                    vec2 uv = vUv;
                    // Spiral distortion
                    vec2 center = vec2(0.5);
                    float d = distance(uv, center);
                    float angle = atan(uv.y - 0.5, uv.x - 0.5);
                    float distort = sin(d * 10.0 - uTime * 2.0) * uAmount * 0.1;
                    
                    uv.x += cos(angle) * distort;
                    uv.y += sin(angle) * distort;
                    
                    // Chromatic Aberration
                    float r = texture2D(tDiffuse, uv + vec2(uAmount * 0.02, 0.0)).r;
                    float g = texture2D(tDiffuse, uv).g;
                    float b = texture2D(tDiffuse, uv - vec2(uAmount * 0.02, 0.0)).b;
                    
                    gl_FragColor = vec4(r, g, b, 1.0);
                }
            \`
        };
        const warpPass = new ShaderPass(warpShader);
        composer.addPass(warpPass);

        // --- GEOMETRY (THE ENTITY) ---
        const entityGroup = new THREE.Group();
        scene.add(entityGroup);

        // 1. The Eye (Central)
        const eyeGeo = new THREE.SphereGeometry(1, 64, 64);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black pupil
        const eye = new THREE.Mesh(eyeGeo, eyeMat);
        // Iris ring
        const irisGeo = new THREE.TorusGeometry(1.2, 0.2, 16, 64);
        const irisMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
        const iris = new THREE.Mesh(irisGeo, irisMat);
        entityGroup.add(eye);
        entityGroup.add(iris);

        // 2. The Claws (Abstract)
        const clawGroup = new THREE.Group();
        entityGroup.add(clawGroup);
        
        for(let i=0; i<2; i++) {
            const side = i === 0 ? 1 : -1;
            const armPoints = [];
            for(let j=0; j<10; j++) armPoints.push(new THREE.Vector3(side * j * 0.5, -j * 0.5, 0));
            const armCurve = new THREE.CatmullRomCurve3(armPoints);
            const armGeo = new THREE.TubeGeometry(armCurve, 20, 0.2, 8, false);
            const armMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.5 });
            const arm = new THREE.Mesh(armGeo, armMat);
            
            // Claw Pincer
            const pincerGeo = new THREE.ConeGeometry(0.5, 2, 8);
            const pincer = new THREE.Mesh(pincerGeo, new THREE.MeshBasicMaterial({ color: 0xff00ff }));
            pincer.position.set(side * 5, -5, 0);
            pincer.rotation.z = side * -0.5;
            
            arm.add(pincer);
            clawGroup.add(arm);
        }

        // 3. Sacred Geometry Background
        const ringCount = 5;
        const rings = [];
        for(let i=0; i<ringCount; i++) {
            const geo = new THREE.TorusGeometry(3 + i * 2, 0.05, 16, 100);
            const mat = new THREE.MeshBasicMaterial({ color: 0x4444ff });
            const ring = new THREE.Mesh(geo, mat);
            ring.rotation.x = Math.random() * Math.PI;
            ring.userData = { speed: (Math.random() - 0.5) * 0.5 };
            scene.add(ring);
            rings.push(ring);
        }

        // 4. Stars
        const starGeo = new THREE.BufferGeometry();
        const starCount = 2000;
        const starPos = new Float32Array(starCount * 3);
        for(let i=0; i<starCount*3; i++) starPos[i] = (Math.random() - 0.5) * 50;
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.05, color: 0xffffff }));
        scene.add(stars);

        // --- SEQUENCE ---
        const mainText = document.getElementById('main-text');
        const flash = document.getElementById('flash');

        const state = {
            phase: 0,
            pulse: 0
        };

        const sequence = [
            { t: 0.5, action: () => {
                audio.init().then(() => audio.playDrone());
                mainText.innerText = "YOU ARE STILL DREAMING";
                mainText.classList.add('visible');
            }},
            { t: 3.0, action: () => {
                state.phase = 1; // Eye Open
                audio.playVoice();
                mainText.classList.remove('visible');
                // Iris colors shift
                irisMat.color.setHex(0xffffff);
            }},
            { t: 5.0, action: () => {
                state.phase = 2; // Riser
                audio.startRiser();
                mainText.innerText = "WAKE UP";
                mainText.style.color = "#ff0000";
                mainText.style.fontSize = "5rem";
                mainText.classList.add('visible');
                warpPass.uniforms.uAmount.value = 0.5;
            }},
            { t: 8.0, action: () => {
                state.phase = 3; // Drop
                audio.playDrop();
                flash.style.opacity = 1;
                glitchPass.enabled = true;
                glitchPass.goWild = true;
            }},
            { t: 9.0, action: () => {
                audio.stop();
                window.parent.postMessage('LUCID_LOBSTER_CUTSCENE_COMPLETE', '*');
            }}
        ];

        let seqIdx = 0;
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const dt = clock.getDelta();
            const elapsed = clock.getElapsedTime();

            if (seqIdx < sequence.length && elapsed >= sequence[seqIdx].t) {
                sequence[seqIdx].action();
                seqIdx++;
            }

            // Visual Logic
            warpPass.uniforms.uTime.value = elapsed;
            
            // Entity Animation
            entityGroup.rotation.y = Math.sin(elapsed * 0.2) * 0.2;
            iris.scale.setScalar(1 + Math.sin(elapsed * 5) * 0.1);
            
            // Rings
            rings.forEach(r => {
                r.rotation.x += r.userData.speed * dt;
                r.rotation.y += r.userData.speed * dt * 0.5;
            });

            // Camera
            if (state.phase === 0) {
                camera.position.z = 10 - elapsed * 0.5;
            } else if (state.phase === 1) {
                camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5, dt);
                warpPass.uniforms.uAmount.value = THREE.MathUtils.lerp(warpPass.uniforms.uAmount.value, 0.2, dt);
            } else if (state.phase === 2) {
                // Shake
                camera.position.x = (Math.random() - 0.5) * 0.5;
                camera.position.y = (Math.random() - 0.5) * 0.5;
                warpPass.uniforms.uAmount.value += dt * 0.5;
            }

            composer.render();
        }

        setTimeout(() => {
            animate();
            audio.init();
        }, 100);

        window.addEventListener('click', () => audio.init());
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
            title="Lucid Lobster Cutscene"
        />
    );
};
