import React, { useMemo } from 'react';

export const SoundShardView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Sound Shard [Harmonic Resonance]</title>
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&family=Orbitron:wght@700&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Rajdhani', sans-serif; }
        #canvas-container { width: 100vw; height: 100vh; }
        
        #ui {
            position: absolute;
            bottom: 30px;
            left: 30px;
            color: #ffffff;
            pointer-events: none;
            text-transform: uppercase;
            letter-spacing: 2px;
            z-index: 10;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            opacity: 1; 
            transition: opacity 2s;
        }
        .rarity { color: #00ffff; font-weight: bold; font-size: 0.8em; text-shadow: 0 0 20px #00ffff; }
        .sub { font-size: 0.7em; opacity: 0.7; margin-top: 5px; color: #aaaaff; }
        
        /* Scanline Overlay */
        .scanlines {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
            background-size: 100% 4px;
            pointer-events: none;
            z-index: 5;
            opacity: 0.3;
        }

        #flash-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: white;
            opacity: 1; /* Start white */
            pointer-events: none;
            z-index: 60;
            transition: opacity 1s ease-out;
        }

        /* Controls */
        #controls {
            position: absolute;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            z-index: 20;
        }
        .hud-btn {
            width: 40px;
            height: 40px;
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 50%;
            color: #00ffff;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        .hud-btn:hover {
            border-color: #00ffff;
            box-shadow: 0 0 10px rgba(0,255,255,0.3);
            background: rgba(0, 255, 255, 0.1);
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
    <div class="scanlines"></div>
    <div id="flash-overlay"></div>

    <div id="canvas-container"></div>
    
    <div id="ui">
        <h2>The Sound Shard</h2>
        <p class="rarity">Rarity: 1 in 2,000,000,000</p>
        <div class="sub">Status: Harmonic Synchronization</div>
    </div>

    <div id="controls">
        <div id="mute-btn" class="hud-btn" title="Toggle Audio">🔇</div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

        // --- SCENE SETUP ---
        const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        scene.fog = new THREE.FogExp2(0x000005, 0.015); 

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
        
        // Final position directly
        camera.position.set(0, 5, 20);
        camera.lookAt(0,0,0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.maxDistance = 60;
        controls.enabled = true;

        // --- AUDIO ENGINE ---
        let audioContext = null;
        let analyser = null;
        let dataArray = null;
        let masterGain = null;
        let isMuted = false;
        let isPlaying = false;
        let sequencerInterval = null;

        const scale = [130.81, 155.56, 174.61, 196.00, 233.08, 261.63, 311.13, 349.23, 392.00, 466.16]; 

        function initAudio() {
            if (audioContext) return;

            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            dataArray = new Uint8Array(analyser.frequencyBinCount);

            masterGain = audioContext.createGain();
            masterGain.gain.value = isMuted ? 0 : 0.4;
            masterGain.connect(analyser);
            analyser.connect(audioContext.destination);
        }

        function startMusic() {
            if (!audioContext) return;
            
            // Clear existing
            if(sequencerInterval) clearInterval(sequencerInterval);

            // 1. Bass Drone
            const bassOsc = audioContext.createOscillator();
            bassOsc.type = 'sawtooth';
            bassOsc.frequency.value = 65.41; 
            const bassFilter = audioContext.createBiquadFilter();
            bassFilter.type = 'lowpass';
            bassFilter.frequency.value = 200;
            const bassGain = audioContext.createGain();
            bassGain.gain.value = 0.4;
            bassOsc.connect(bassFilter);
            bassFilter.connect(bassGain);
            bassGain.connect(masterGain);
            bassOsc.start();

            // Sequencer Loop
            sequencerInterval = setInterval(() => {
                if(Math.random() > 0.3) playNote(masterGain);
            }, 250); 

            isPlaying = true;
        }

        function playNote(output) {
            if(isMuted) return;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            const noteIndex = Math.floor(Math.random() * scale.length);
            const octave = Math.random() > 0.8 ? 2 : 1;
            osc.frequency.value = scale[noteIndex] * octave;
            osc.type = 'triangle';

            const now = audioContext.currentTime;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.1, now + 0.05); 
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5); 

            osc.connect(gain);
            gain.connect(output);
            
            osc.start(now);
            osc.stop(now + 1.5);
        }

        // Controls
        const muteBtn = document.getElementById('mute-btn');
        muteBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            if(masterGain) masterGain.gain.setTargetAtTime(isMuted ? 0 : 0.4, audioContext.currentTime, 0.1);
            muteBtn.innerText = isMuted ? "🔇" : "🔊";
            muteBtn.style.color = isMuted ? "#666" : "#00ffff";
        });

        // --- SHARED GEOMETRIES & MATERIALS ---
        const voidGeo = new THREE.SphereGeometry(1.4, 64, 64);
        const voidMat = new THREE.MeshPhysicalMaterial({ color: 0x000000, metalness: 1.0, roughness: 0.0 });
        const cageGeo = new THREE.IcosahedronGeometry(1.5, 1);
        const cageMatTemplate = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.3 });
        const barGeo = new THREE.BoxGeometry(0.05, 1, 0.05); 
        const barMatTemplate = new THREE.MeshBasicMaterial({ color: 0xFF00FF }); 
        const satGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const hologramMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 }, uColor: { value: new THREE.Color(0x00FFFF) }, uSpeed: { value: 1.0 }
            },
            vertexShader: \`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }\`,
            fragmentShader: \`uniform float uTime; uniform vec3 uColor; uniform float uSpeed; varying vec2 vUv; void main() { float scan = sin(vUv.x * 20.0 + uTime * uSpeed) * 0.5 + 0.5; float scan2 = sin(vUv.x * 50.0 - uTime * uSpeed * 2.0) * 0.5 + 0.5; float alpha = pow(scan * scan2, 2.0); float edge = smoothstep(0.2, 0.0, abs(vUv.y - 0.5)); vec3 finalColor = uColor * (1.0 + alpha * 2.0); gl_FragColor = vec4(finalColor, alpha * 0.8 + edge * 0.5); }\`,
            transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
        });

        // --- BACKGROUND ---
        const ambienceGroup = new THREE.Group();
        scene.add(ambienceGroup);
        const dustGeo = new THREE.BufferGeometry();
        const dustPos = [];
        for(let i=0; i<1000; i++) { dustPos.push((Math.random()-0.5)*100, (Math.random()-0.5)*50, (Math.random()-0.5)*100); }
        dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustPos, 3));
        ambienceGroup.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x4444aa, size: 0.15, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending })));

        const bgBarCount = 120;
        const bgEqualizer = new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({ color: 0x110033, transparent: true, opacity: 0.3 }), bgBarCount);
        ambienceGroup.add(bgEqualizer);
        
        const gridGeo = new THREE.PlaneGeometry(100, 100, 40, 40);
        const floorGrid = new THREE.Mesh(gridGeo, new THREE.MeshBasicMaterial({ color: 0x001133, wireframe: true, transparent: true, opacity: 0.1 }));
        floorGrid.rotation.x = -Math.PI/2; floorGrid.position.y = -10; ambienceGroup.add(floorGrid);

        // --- SHARD FACTORY ---
        const shards = []; 
        function createShard(scale, orbitRadius, orbitSpeed, startAngle, yOffset, config = {}) {
            const { color1 = 0x00ffff, color2 = 0xff00ff, ringCount = 6, ringSpeedMult = 1.0 } = config;
            const root = new THREE.Group();
            root.scale.setScalar(scale);
            scene.add(root);

            const coreGroup = new THREE.Group(); root.add(coreGroup);
            coreGroup.add(new THREE.Mesh(voidGeo, voidMat));
            const cageMat = cageMatTemplate.clone(); cageMat.color.setHex(color1);
            coreGroup.add(new THREE.Mesh(cageGeo, cageMat));
            coreGroup.add(new THREE.PointLight(color1, 5 * scale, 5 * scale));

            const rings = [];
            const ringGroup = new THREE.Group(); root.add(ringGroup);
            for(let i=0; i<ringCount; i++) {
                const mat = hologramMaterial.clone();
                mat.uniforms.uSpeed.value = (2.0 + Math.random() * 3.0) * ringSpeedMult;
                if(i % 2 === 0) mat.uniforms.uColor.value.setHex(color2); else mat.uniforms.uColor.value.setHex(color1);
                const ring = new THREE.Mesh(new THREE.TorusGeometry(2.2 + i * 0.5, 0.03, 16, 100), mat);
                ring.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
                ring.userData = { rotSpeed: new THREE.Vector3((Math.random()-0.5)*0.3*ringSpeedMult, (Math.random()-0.5)*0.3*ringSpeedMult, 0) };
                rings.push(ring); ringGroup.add(ring);
                const sat = new THREE.Mesh(satGeo, satMat); sat.position.x = 2.2 + i * 0.5; ring.add(sat);
            }

            const eqGroup = new THREE.Group(); root.add(eqGroup);
            const bars = [];
            const barMat = barMatTemplate.clone(); barMat.color.setHex(color2);
            for(let i=0; i<40; i++) {
                const bar = new THREE.Mesh(barGeo, barMat);
                const a = (i/40) * Math.PI * 2;
                bar.position.set(Math.cos(a)*1.7, 0, Math.sin(a)*1.7); bar.lookAt(0,0,0); bar.userData = { index: i };
                bars.push(bar); eqGroup.add(bar);
            }

            const pCount = 300;
            const pPos = new Float32Array(pCount * 3);
            const pData = [];
            for(let i=0; i<pCount; i++) {
                const r = 4 + Math.random()*10; const th = Math.random()*Math.PI*2; const ph = Math.acos((Math.random()*2)-1);
                const x = r*Math.sin(ph)*Math.cos(th); const y = r*Math.sin(ph)*Math.sin(th); const z = r*Math.cos(ph);
                pPos[i*3]=x; pPos[i*3+1]=y; pPos[i*3+2]=z;
                pData.push({ basePos: new THREE.Vector3(x,y,z), speed: 0.5+Math.random(), offset: Math.random()*100 });
            }
            const pGeo = new THREE.BufferGeometry();
            pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
            const pSys = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: color1, size: 0.05, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }));
            root.add(pSys);

            shards.push({ root, orbit: { radius: orbitRadius, speed: orbitSpeed, angle: startAngle, y: yOffset }, core: { sphere: null, cage: coreGroup.children[1] }, rings, eqGroup, bars, particles: { system: pSys, data: pData, positions: pGeo.attributes.position } });
        }

        createShard(1.0, 0, 0, 0, 0, { color1: 0x00ffff, color2: 0xff00ff, ringCount: 6 });
        const satConfigs = [
            { color1: 0x0055ff, color2: 0x0000aa, ringCount: 3, ringSpeedMult: 0.5 }, 
            { color1: 0xffffff, color2: 0x00ffff, ringCount: 8, ringSpeedMult: 2.0 }, 
            { color1: 0xff5500, color2: 0xff0000, ringCount: 5, ringSpeedMult: 1.0 }, 
            { color1: 0x00ff55, color2: 0x00aa00, ringCount: 4, ringSpeedMult: 1.2 }, 
            { color1: 0xaa00ff, color2: 0xff00aa, ringCount: 6, ringSpeedMult: 0.8 }
        ];
        for(let i=0; i<5; i++) {
            const a = (i/5)*Math.PI*2; createShard(0.25, 6.5, 0.2, a, (Math.random()-0.5)*4, satConfigs[i]);
        }

        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.5, 0.05));

        const clock = new THREE.Clock();
        const dummy = new THREE.Object3D(); 

        // Start automatically
        setTimeout(() => {
            try { 
                initAudio();
                startMusic();
            } catch(e) {}
            
            // Fade out overlay
            document.getElementById('flash-overlay').style.opacity = 0;
            setTimeout(() => {
                document.getElementById('flash-overlay').style.display = 'none';
            }, 1000);
        }, 500);

        function animate() {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            // AUDIO LEVEL
            let audioLevel = 0.5;
            if (isPlaying && analyser && !isMuted) {
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for(let i=0; i<dataArray.length; i++) sum += dataArray[i];
                audioLevel = sum / dataArray.length / 256.0; 
            }

            // ANIMATION LOGIC
            // Background
            ambienceGroup.rotation.y = time * 0.02;
            for(let i=0; i<bgBarCount; i++) {
                const angle = (i / bgBarCount) * Math.PI * 2;
                let val = 0;
                if (isPlaying && dataArray && !isMuted) {
                    const bin = Math.floor((i / bgBarCount) * 32);
                    val = dataArray[bin] / 255.0;
                } else {
                    val = Math.sin(time * 2.0 + angle * 8.0) * 0.5 + 0.5;
                }
                const h = 2.0 + val * 8.0;
                dummy.position.set(Math.cos(angle) * 35, 0, Math.sin(angle) * 35);
                dummy.rotation.y = -angle;
                dummy.scale.set(1, Math.max(0.1, h), 1);
                dummy.updateMatrix();
                bgEqualizer.setMatrixAt(i, dummy.matrix);
            }
            bgEqualizer.instanceMatrix.needsUpdate = true;

            // Shards
            shards.forEach((shard, index) => {
                if (shard.orbit.radius > 0) {
                    shard.orbit.angle += shard.orbit.speed * 0.01; 
                    shard.root.position.x = Math.cos(shard.orbit.angle) * shard.orbit.radius;
                    shard.root.position.z = Math.sin(shard.orbit.angle) * shard.orbit.radius;
                    shard.root.position.y = shard.orbit.y + Math.sin(time * 0.5 + index) * 0.5; 
                    shard.root.rotation.y = time * 0.2; 
                } else {
                    shard.root.position.y = Math.sin(time * 0.2) * 0.2;
                }

                const beat = 1.0 + audioLevel * 0.2;
                shard.core.cage.rotation.y = -time * 0.2;
                shard.core.cage.rotation.z = time * 0.1;
                shard.core.cage.scale.setScalar(beat * 1.05);

                shard.rings.forEach((ring) => {
                    ring.rotation.x += ring.userData.rotSpeed.x * 0.1;
                    ring.rotation.y += ring.userData.rotSpeed.y * 0.1;
                    ring.material.uniforms.uTime.value = time;
                });

                shard.bars.forEach((bar) => {
                    let height = 0.2;
                    if (isPlaying && dataArray && !isMuted) {
                        const bin = Math.floor((bar.userData.index / 40) * 64);
                        height = 0.2 + (dataArray[bin] / 255.0) * 3.0;
                    } else {
                        const freq = time * 4.0 + bar.userData.index * 0.5 + index;
                        height = 0.2 + Math.abs(Math.sin(freq) * Math.cos(freq * 0.5)) * 2.5;
                    }
                    bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, height, 0.2);
                    const hue = (height * 0.1 + time * 0.1) % 1;
                    bar.material.color.setHSL(hue, 1.0, 0.5);
                });
                shard.eqGroup.rotation.y = time * 0.1;
                shard.eqGroup.rotation.z = Math.sin(time * 0.5) * 0.15;

                const pPos = shard.particles.positions.array;
                const pData = shard.particles.data;
                for(let i=0; i<pData.length; i++) {
                    const data = pData[i];
                    const breath = 1.0 + Math.sin(time * data.speed + data.offset) * 0.05 * (1.0 + audioLevel);
                    pPos[i*3] = data.basePos.x * breath;
                    pPos[i*3+1] = data.basePos.y * breath;
                    pPos[i*3+2] = data.basePos.z * breath;
                }
                shard.particles.positions.needsUpdate = true;
                shard.particles.system.rotation.y = time * 0.05;
            });

            controls.update();
            composer.render();
        }

        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            composer.setSize(width, height);
        });

        const rimLight = new THREE.DirectionalLight(0x4444ff, 2.0);
        rimLight.position.set(-5, 5, 2);
        scene.add(rimLight);

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
            title="Sound Shard View"
        />
    );
};
