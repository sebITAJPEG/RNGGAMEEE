import React, { useMemo } from 'react';

export const HypercubeFragmentView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hypercube Fragment [Ascended]</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Share Tech Mono', monospace; }
        #canvas-container { width: 100vw; height: 100vh; }
        
        /* Main UI */
        #ui {
            position: absolute;
            bottom: 30px; 
            left: 30px;
            color: #00FFFF;
            pointer-events: none;
            text-transform: uppercase;
            letter-spacing: 2px;
            z-index: 10;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            opacity: 0;
            transition: opacity 2s ease;
        }
        .rarity { color: #ff0050; font-weight: bold; font-size: 0.8em; }
        .sub { font-size: 0.7em; opacity: 0.8; color: #fff; margin-top: 5px; }
        
        #flash-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: white;
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

        canvas { display: block; width: 100%; height: 100%; }

        /* Audio hint */
        #audio-hint {
            position: absolute;
            bottom: 20px;
            width: 100%;
            text-align: center;
            color: rgba(0, 255, 255, 0.4);
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

    <div id="ui">
        <h2>Hypercube Fragment</h2>
        <p>Class: 4D Anomaly</p>
        <p class="rarity">Rarity: 1 in 3,000,000,000</p>
        <div class="sub">
            <span style="color: #00ffff">Cyan: +W (Near)</span> | 
            <span style="color: #ff00ff">Magenta: -W (Far)</span>
        </div>
    </div>
    
    <div id="controls">
        <div id="mute-btn" class="hud-btn" title="Toggle Audio">🔇</div>
    </div>

    <div id="audio-hint">[ Click anywhere to enable audio sync ]</div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
        import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

        // --- CONFIG ---
        const TESSERACT_SIZE = 1.4;
        
        // --- SCENE SETUP ---
        const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        
        // Transition positions
        const defaultPos = new THREE.Vector3(0, 0, 11);
        const startPos = new THREE.Vector3(0, 0, 3.5); 
        
        // Start at close position to animate out
        camera.position.copy(startPos);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, stencil: true, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(1); // Force 1x for performance/smoothness
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        controls.zoomSpeed = 1.0; 
        controls.rotateSpeed = 0.8;
        controls.enablePan = false;
        controls.minDistance = 1.5;
        controls.maxDistance = 100;
        controls.enabled = false; 

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
            masterGain.gain.value = isMuted ? 0 : 0.4;
            masterGain.connect(audioContext.destination);

            // 1. Deep Drone (Ambience)
            const osc1 = audioContext.createOscillator();
            const osc2 = audioContext.createOscillator();
            osc1.type = 'sine'; osc1.frequency.value = 55; 
            osc2.type = 'sine'; osc2.frequency.value = 55.5; 
            const oscGain = audioContext.createGain();
            oscGain.gain.value = 0.2;
            osc1.connect(oscGain); osc2.connect(oscGain);
            oscGain.connect(masterGain);
            osc1.start(); osc2.start();

            // 2. Glassy Pad (Ambience)
            const glassOsc = audioContext.createOscillator();
            glassOsc.type = 'triangle'; glassOsc.frequency.value = 110; 
            const glassGain = audioContext.createGain();
            glassGain.gain.value = 0.05;
            const lfo = audioContext.createOscillator();
            lfo.type = 'sine'; lfo.frequency.value = 0.1;
            const lfoGain = audioContext.createGain();
            lfoGain.gain.value = 0.02;
            lfo.connect(lfoGain); lfoGain.connect(glassGain.gain);
            lfo.start();
            glassOsc.connect(glassGain); glassGain.connect(masterGain);
            glassOsc.start();

            // 3. Atmosphere Noise (Ambience)
            const bufferSize = audioContext.sampleRate * 2;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.1;
            }
            const noise = audioContext.createBufferSource();
            noise.buffer = buffer; noise.loop = true;
            const filter = audioContext.createBiquadFilter();
            filter.type = 'lowpass'; filter.frequency.value = 400;
            const noiseGain = audioContext.createGain();
            noiseGain.gain.value = 0.05;
            noise.connect(filter); filter.connect(noiseGain);
            noiseGain.connect(masterGain);
            noise.start();

            document.getElementById('audio-hint').style.opacity = 0;
        }

        // Global Audio Unlock
        window.addEventListener('click', initAudio);
        window.addEventListener('keydown', initAudio);

        // Buttons
        const muteBtn = document.getElementById('mute-btn');
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            initAudio();
            isMuted = !isMuted;
            if(masterGain) {
                masterGain.gain.setTargetAtTime(isMuted ? 0 : 0.4, audioContext.currentTime, 0.1);
            }
            muteBtn.innerText = isMuted ? "🔇" : "🔊";
            muteBtn.style.color = isMuted ? "#666" : "#00ffff";
        });

        // --- SCENE OBJECTS ---
        
        // 1. Tesseract
        const tesseractGroup = new THREE.Group();
        tesseractGroup.renderOrder = 2; 
        scene.add(tesseractGroup);

        const vertices4D = [];
        for(let i=0; i<16; i++) {
            vertices4D.push({
                x: (i & 1) ? 1 : -1,
                y: (i & 2) ? 1 : -1,
                z: (i & 4) ? 1 : -1,
                w: (i & 8) ? 1 : -1
            });
        }
        const edgeIndices = [];
        for(let i=0; i<16; i++) {
            for(let j=i+1; j<16; j++) {
                let diff = 0;
                if(vertices4D[i].x !== vertices4D[j].x) diff++;
                if(vertices4D[i].y !== vertices4D[j].y) diff++;
                if(vertices4D[i].z !== vertices4D[j].z) diff++;
                if(vertices4D[i].w !== vertices4D[j].w) diff++;
                if(diff === 1) edgeIndices.push(i, j);
            }
        }
        const tesseractGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(edgeIndices.length * 3);
        const colors = new Float32Array(edgeIndices.length * 3); 
        tesseractGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        tesseractGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const tesseractMat = new THREE.LineBasicMaterial({
            vertexColors: true, linewidth: 2, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending,
            stencilWrite: true, stencilFunc: THREE.EqualStencilFunc, stencilRef: 1
        });
        const tesseractMesh = new THREE.LineSegments(tesseractGeo, tesseractMat);
        tesseractGroup.add(tesseractMesh);

        // Nodes & Mirror
        const nodeGeo = new THREE.SphereGeometry(0.06, 16, 16);
        const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, stencilWrite: true, stencilFunc: THREE.EqualStencilFunc, stencilRef: 1 });
        const nodes = new THREE.InstancedMesh(nodeGeo, nodeMat, 16);
        tesseractGroup.add(nodes);

        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
        const cubeCamera = new THREE.CubeCamera(0.01, 10, cubeRenderTarget);
        tesseractGroup.add(cubeCamera);
        const mirrorGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const mirrorMat = new THREE.MeshPhysicalMaterial({
            color: 0x000000, metalness: 1.0, roughness: 0.0, envMap: cubeRenderTarget.texture, side: THREE.DoubleSide,
            stencilWrite: true, stencilFunc: THREE.EqualStencilFunc, stencilRef: 1
        });
        const mirrorBox = new THREE.Mesh(mirrorGeo, mirrorMat);
        tesseractGroup.add(mirrorBox);

        // 2. Rock
        const rockBaseGeo = new THREE.DodecahedronGeometry(2.5, 0); 
        const nonIndexedGeo = rockBaseGeo.toNonIndexed(); 
        const pos = nonIndexedGeo.attributes.position;
        const newPosArray = [];
        for(let i=0; i<pos.count; i+=3) {
            const cx = (pos.getX(i) + pos.getX(i+1) + pos.getX(i+2)) / 3;
            const cy = (pos.getY(i) + pos.getY(i+1) + pos.getY(i+2)) / 3;
            const cz = (pos.getZ(i) + pos.getZ(i+1) + pos.getZ(i+2)) / 3;
            if(Math.abs(new THREE.Vector3(cx, cy, cz).normalize().z) <= 0.8) {
                newPosArray.push(pos.getX(i), pos.getY(i), pos.getZ(i), pos.getX(i+1), pos.getY(i+1), pos.getZ(i+1), pos.getX(i+2), pos.getY(i+2), pos.getZ(i+2));
            }
        }
        const rockGeo = new THREE.BufferGeometry();
        rockGeo.setAttribute('position', new THREE.Float32BufferAttribute(newPosArray, 3));
        rockGeo.computeVertexNormals();
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9, metalness: 0.2, side: THREE.DoubleSide });
        const rock = new THREE.Mesh(rockGeo, rockMat);
        rock.renderOrder = 0; 
        scene.add(rock);
        const rockEdges = new THREE.LineSegments(new THREE.EdgesGeometry(rockGeo), new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 }));
        rock.add(rockEdges);

        // 3. Masks
        const maskGeo = new THREE.PlaneGeometry(1.8, 1.8);
        const maskMat = new THREE.MeshBasicMaterial({
            color: 0x000000, colorWrite: false, depthWrite: false, stencilWrite: true, stencilRef: 1,
            stencilFunc: THREE.AlwaysStencilFunc, stencilFail: THREE.KeepStencilOp, stencilZFail: THREE.KeepStencilOp, stencilZPass: THREE.ReplaceStencilOp 
        });
        const mask1 = new THREE.Mesh(maskGeo, maskMat);
        mask1.position.z = 1.2; mask1.renderOrder = 1; scene.add(mask1);
        const mask2 = mask1.clone();
        mask2.rotation.y = Math.PI; mask2.position.z = -1.2; scene.add(mask2);

        // 4. Debris
        const debrisCount = 400;
        const debrisGeo = new THREE.BufferGeometry();
        const debrisPos = new Float32Array(debrisCount * 3);
        const debrisSpeed = new Float32Array(debrisCount);
        for(let i=0; i<debrisCount; i++) {
            const r = 3 + Math.random() * 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            debrisPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
            debrisPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            debrisPos[i*3+2] = r * Math.cos(phi);
            debrisSpeed[i] = 0.02 + Math.random() * 0.05;
        }
        debrisGeo.setAttribute('position', new THREE.BufferAttribute(debrisPos, 3));
        const debris = new THREE.Points(debrisGeo, new THREE.PointsMaterial({ color: 0x00ffff, size: 0.03, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending }));
        scene.add(debris);

        // 5. Grid
        const gridGeo = new THREE.PlaneGeometry(100, 100, 50, 50);
        const gridMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: \`
                uniform float uTime;
                varying float vDist;
                void main() {
                    vec3 pos = position;
                    float d = distance(pos.xy, vec2(0.0));
                    float z = sin(d * 0.4 - uTime * 2.0) * 3.0;
                    z *= smoothstep(15.0, 0.0, d); 
                    vec4 mvPosition = modelViewMatrix * vec4(pos.x, pos.y, z, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    vDist = d;
                }
            \`,
            fragmentShader: \`varying float vDist; void main() { float alpha = smoothstep(50.0, 5.0, vDist) * 0.15; gl_FragColor = vec4(0.0, 1.0, 1.0, alpha); }\`,
            transparent: true, wireframe: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
        });
        const floorGrid = new THREE.Mesh(gridGeo, gridMat); floorGrid.rotation.x = -Math.PI / 2; floorGrid.position.y = -8; scene.add(floorGrid);
        const ceilingGrid = new THREE.Mesh(gridGeo, gridMat); ceilingGrid.rotation.x = Math.PI / 2; ceilingGrid.position.y = 8; scene.add(ceilingGrid);

        // Post Processing
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        // Use half-res for bloom to improve performance
        composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth/2, window.innerHeight/2), 1.0, 0.3, 0.05));
        const aberrationPass = new ShaderPass({
            uniforms: { tDiffuse: { value: null }, amount: { value: 0.003 } },
            vertexShader: \`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }\`,
            fragmentShader: \`uniform sampler2D tDiffuse; uniform float amount; varying vec2 vUv; void main() { vec2 dist = vUv - 0.5; float pulse = amount * (1.0 + sin(dist.x * 10.0)); vec2 offset = dist * pulse * 2.0; float r = texture2D(tDiffuse, vUv + offset).r; float g = texture2D(tDiffuse, vUv).g; float b = texture2D(tDiffuse, vUv - offset).b; gl_FragColor = vec4(r, g, b, 1.0); }\`
        });
        composer.addPass(aberrationPass);

        // Lights
        const light = new THREE.PointLight(0x00ffff, 3, 20); light.position.set(3, 3, 3); scene.add(light);
        const light2 = new THREE.PointLight(0xff00ff, 3, 20); light2.position.set(-3, -3, 0); scene.add(light2);

        // --- TRANSITION LOGIC ---
        let isTransitioning = true;
        const startTime = performance.now() / 1000;
        const flashOverlay = document.getElementById('flash-overlay');
        const uiDiv = document.getElementById('ui');

        // Auto-init audio after a moment
        setTimeout(() => {
            try{ initAudio(); } catch(e){}
        }, 500);

        // --- ANIMATION ---
        const clock = new THREE.Clock();
        const tempObj = new THREE.Object3D();
        const colorCyan = new THREE.Color(0x00ffff);
        const colorMagenta = new THREE.Color(0xff00ff);

        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            const now = performance.now() / 1000;

            // Transition Updates
            if (isTransitioning) {
                const t = now - startTime;
                
                // Flash Fade
                flashOverlay.style.opacity = Math.max(0, 1.0 - t * 1.5);
                
                // Portal Pop
                const pop = Math.min(t * 2.0, 1.0);
                const elastic = 1 + Math.pow(2, -10 * pop) * Math.sin((pop - 0.1) / 0.4);
                const finalScale = (pop > 0.99) ? 1.0 : elastic;
                mask1.scale.setScalar(finalScale);
                mask2.scale.setScalar(finalScale);

                // Camera Fly Back
                const duration = 3.0;
                const alpha = Math.min(t / duration, 1.0);
                const ease = 1 - Math.pow(1 - alpha, 3);
                camera.position.lerpVectors(startPos, defaultPos, ease);
                camera.lookAt(0,0,0);
                
                // UI Fade In
                if (t > 2.0) {
                    uiDiv.style.opacity = Math.min(1, (t - 2.0));
                }
                
                if (alpha >= 1.0) {
                    isTransitioning = false;
                    controls.enabled = true;
                    flashOverlay.style.display = 'none';
                }
            } else {
                controls.update();
                mask1.scale.set(1,1,1);
                mask2.scale.set(1,1,1);
            }

            // Tesseract Math
            const angle = time * 0.6; 
            const posAttr = tesseractGeo.attributes.position;
            const colAttr = tesseractGeo.attributes.color;
            const distance = 3;
            const transformedVerts = [];
            
            for(let i=0; i<16; i++) {
                let x = vertices4D[i].x; let y = vertices4D[i].y; let z = vertices4D[i].z; let w = vertices4D[i].w;
                let tx = x * Math.cos(angle) - w * Math.sin(angle); let tw = x * Math.sin(angle) + w * Math.cos(angle); x = tx; w = tw;
                let tz = z * Math.cos(angle * 0.5) - w * Math.sin(angle * 0.5); tw = z * Math.sin(angle * 0.5) + w * Math.cos(angle * 0.5); z = tz; w = tw;
                const wNorm = (w + 1.5) / 3.0; 
                const vertColor = new THREE.Color().lerpColors(colorMagenta, colorCyan, wNorm);
                const scale = 1 / (distance - w);
                const p3d = new THREE.Vector3(x * scale * TESSERACT_SIZE, y * scale * TESSERACT_SIZE, z * scale * TESSERACT_SIZE);
                transformedVerts.push({ pos: p3d, col: vertColor });
                tempObj.position.copy(p3d); tempObj.scale.setScalar(scale * 0.8); tempObj.updateMatrix();
                nodes.setMatrixAt(i, tempObj.matrix); nodes.setColorAt(i, vertColor);
            }
            nodes.instanceMatrix.needsUpdate = true; nodes.instanceColor.needsUpdate = true;

            let idx = 0;
            for(let i=0; i<edgeIndices.length; i+=2) {
                const v1 = transformedVerts[edgeIndices[i]]; const v2 = transformedVerts[edgeIndices[i+1]];
                posAttr.setXYZ(idx, v1.pos.x, v1.pos.y, v1.pos.z); colAttr.setXYZ(idx, v1.col.r, v1.col.g, v1.col.b); idx++;
                posAttr.setXYZ(idx, v2.pos.x, v2.pos.y, v2.pos.z); colAttr.setXYZ(idx, v2.col.r, v2.col.g, v2.col.b); idx++;
            }
            posAttr.needsUpdate = true; colAttr.needsUpdate = true;

            rock.rotation.x = Math.sin(time * 0.1) * 0.15;
            rock.rotation.y = time * 0.08;
            rockEdges.material.opacity = 0.5 + Math.sin(time * 5.0) * 0.3; 

            mask1.position.copy(new THREE.Vector3(0, 0, 1.5).applyEuler(rock.rotation)); mask1.rotation.copy(rock.rotation);
            mask2.position.copy(new THREE.Vector3(0, 0, -1.5).applyEuler(rock.rotation)); mask2.rotation.copy(rock.rotation); mask2.rotateY(Math.PI); 

            // Debris Animation
            const dp = debris.geometry.attributes.position.array;
            for(let i=0; i<debrisCount; i++) {
                const ix = i * 3;
                let x = dp[ix], y = dp[ix+1], z = dp[ix+2];
                x -= x * debrisSpeed[i]; y -= y * debrisSpeed[i]; z -= z * debrisSpeed[i];
                const s = Math.sin(time * 2.0) * 0.01; const c = Math.cos(time * 2.0) * 0.01;
                const nx = x * c - z * s; const nz = x * s + z * c; x = nx; z = nz;
                if(Math.abs(x) < 0.2 && Math.abs(y) < 0.2 && Math.abs(z) < 0.2) {
                    const r = 5 + Math.random() * 2; const theta = Math.random() * Math.PI * 2; const phi = Math.acos((Math.random() * 2) - 1);
                    x = r * Math.sin(phi) * Math.cos(theta); y = r * Math.sin(phi) * Math.sin(theta); z = r * Math.cos(phi);
                }
                dp[ix] = x; dp[ix+1] = y; dp[ix+2] = z;
            }
            debris.geometry.attributes.position.needsUpdate = true;

            mirrorBox.visible = false; nodes.visible = true; 
            cubeCamera.update(renderer, scene); mirrorBox.visible = true;
            tesseractGroup.rotation.y = -time * 0.15; tesseractGroup.rotation.z = Math.sin(time * 0.2) * 0.1;
            gridMat.uniforms.uTime.value = time;
            composer.render();
        }
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
            title="Hypercube Fragment"
        />
    );
};
