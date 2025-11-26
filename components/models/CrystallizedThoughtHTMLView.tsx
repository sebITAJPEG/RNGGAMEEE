import React, { useMemo } from 'react';

export const CrystallizedThoughtHTMLView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crystallized Thought</title>
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; }
        /* Deep Purple Gradient Background */
        #canvas-container {
            width: 100%;
            height: 100vh;
            background: radial-gradient(circle at center, #1a0b1a 0%, #0a000a 60%, #000000 100%);
        }
        #ui {
            position: absolute;
            bottom: 30px;
            right: 30px;
            color: #ffccff;
            font-family: 'Courier New', serif;
            text-align: right;
            pointer-events: none;
            text-shadow: 0 0 10px rgba(255, 204, 255, 0.5);
            opacity: 0.8;
        }
        h2 { margin: 0; font-weight: 300; letter-spacing: 4px; font-size: 1.5rem; }
        p { margin: 5px 0 0 0; font-size: 0.8rem; letter-spacing: 2px; color: #cc99cc; }
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
    <div id="ui">
        <h2>Crystallized Thought</h2>
        <p>Neural Resonance: 99.9%</p>
        <p style="font-size: 0.7rem; opacity: 0.7; letter-spacing: 1px; margin-top: 4px;">1 in 1.5B</p>
    </div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
        import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

        // --- SCENE SETUP ---
        const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        // Background handled by CSS for smoother gradient, so scene.background is null (transparent)
        
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 12); // Moved back slightly to fit rings

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = false;

        // --- ENVIRONMENT (HDRI) ---
        new RGBELoader()
            .load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/moonless_golf_1k.hdr', function (texture) {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                // Only set environment for reflections, keep background solid color/gradient
                scene.environment = texture; 
            });

        // --- 1. THE CORE (NEURAL NETWORK) ---
        const pointCount = 100;
        const radius = 1.5;
        const points = [];
        
        for(let i=0; i<pointCount; i++) {
            const vec = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize().multiplyScalar(Math.random() * radius);
            points.push(vec);
        }

        const linePositions = [];
        const lineProgress = []; 

        for(let i=0; i<pointCount; i++) {
            const p1 = points[i];
            const others = points.map((p, idx) => ({ idx, dist: p.distanceTo(p1) }))
                                 .filter(o => o.dist > 0) 
                                 .sort((a, b) => a.dist - b.dist)
                                 .slice(0, 3); 

            others.forEach(o => {
                const p2 = points[o.idx];
                linePositions.push(p1.x, p1.y, p1.z);
                linePositions.push(p2.x, p2.y, p2.z);
                lineProgress.push(0.0);
                lineProgress.push(1.0);
            });
        }

        const networkGeo = new THREE.BufferGeometry();
        networkGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        networkGeo.setAttribute('aProgress', new THREE.Float32BufferAttribute(lineProgress, 1));

        const networkMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 }
            },
            vertexShader: \`
                attribute float aProgress;
                varying float vProgress;
                void main() {
                    vProgress = aProgress;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            \`,
            fragmentShader: \`
                uniform float uTime;
                varying float vProgress;

                void main() {
                    float wave = sin(vProgress * 20.0 - uTime * 4.0);
                    float pulse = smoothstep(0.8, 1.0, wave);
                    float base = 0.1;
                    vec3 col1 = vec3(0.0, 1.0, 1.0); // Cyan
                    vec3 col2 = vec3(1.0, 0.0, 1.0); // Magenta
                    vec3 color = mix(col1, col2, sin(uTime + vProgress * 5.0) * 0.5 + 0.5);
                    color = mix(color, vec3(1.0), pulse * 0.8);
                    float alpha = base + pulse;
                    gl_FragColor = vec4(color, alpha);
                }
            \`,
            transparent: true,
            depthWrite: false, 
            blending: THREE.AdditiveBlending
        });

        const network = new THREE.LineSegments(networkGeo, networkMat);
        scene.add(network);

        // --- 2. THE SHELL (CRYSTAL MIND) ---
        const shellGeo = new THREE.IcosahedronGeometry(1.8, 0); 
        const shellMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            roughness: 0.0,
            metalness: 0.1,
            transmission: 1.0,  
            thickness: 2.0,     
            iridescence: 1.0,   
            iridescenceIOR: 1.33,
            side: THREE.DoubleSide,
            transparent: true
        });
        const shell = new THREE.Mesh(shellGeo, shellMat);
        scene.add(shell);

        // --- 3. AMBIENT RINGS (NEW) ---
        const ringGeo = new THREE.TorusGeometry(3.0, 0.02, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ 
            color: 0xcc99ff, 
            transparent: true, 
            opacity: 0.2, 
            blending: THREE.AdditiveBlending 
        });

        const ring1 = new THREE.Mesh(ringGeo, ringMat);
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.015, 16, 100), ringMat);
        const ring3 = new THREE.Mesh(new THREE.TorusGeometry(4.0, 0.01, 16, 100), ringMat);
        const ring4 = new THREE.Mesh(new THREE.TorusGeometry(4.5, 0.01, 16, 100), ringMat);
        const ring5 = new THREE.Mesh(new THREE.TorusGeometry(5, 0.01, 16, 100), ringMat);

        scene.add(ring1);
        scene.add(ring2);
        scene.add(ring3);
        scene.add(ring4);
        scene.add(ring5);

        // --- 4. THE AURA (FLOATING RUNES - INCREASED) ---
        const runeCount = 2000; 
        const runeGeo = new THREE.TetrahedronGeometry(0.03, 0);
        const runeMat = new THREE.MeshBasicMaterial({ color: 0xcc99ff, wireframe: true });
        const runes = new THREE.InstancedMesh(runeGeo, runeMat, runeCount);
        scene.add(runes);

        const runeOffsets = []; 
        const runeSpeeds = [];  
        const runeRadii = [];
        const runeHeights = []; // Added for vertical spread
        const dummy = new THREE.Object3D();

        for(let i=0; i<runeCount; i++) {
            runeOffsets.push(Math.random() * Math.PI * 2);
            runeSpeeds.push((Math.random() - 0.5) * 0.2); 
            runeRadii.push(2.5 + Math.random() * 40.0);    
            runeHeights.push((Math.random() - 0.5) * 50.0); // Spread vertically everywhere
        }

        // --- 5. POST PROCESSING ---
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.8, 
            0.8, 
            0.1  
        );
        composer.addPass(bloomPass);

        const rgbShiftShader = {
            uniforms: {
                tDiffuse: { value: null },
                amount: { value: 0.0025 }
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
                uniform float amount;
                varying vec2 vUv;

                void main() {
                    vec2 dist = vUv - 0.5;
                    float len = length(dist);
                    vec2 offset = dist * amount * len * 2.0;
                    float r = texture2D(tDiffuse, vUv + offset).r;
                    float g = texture2D(tDiffuse, vUv).g;
                    float b = texture2D(tDiffuse, vUv - offset).b;
                    gl_FragColor = vec4(r, g, b, 1.0);
                }
            \`
        };
        const rgbShiftPass = new ShaderPass(rgbShiftShader);
        composer.addPass(rgbShiftPass);

        // --- ANIMATION LOOP ---
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            // Rotate Shell
            shell.rotation.y = time * 0.1;
            shell.rotation.z = time * 0.05;

            // Rotate Network
            network.rotation.y = -time * 0.15;
            network.rotation.x = Math.sin(time * 0.2) * 0.1;

            // Rotate Rings (Ambience)
            ring1.rotation.x = time * 0.1;
            ring1.rotation.y = time * 0.05;
            
            ring2.rotation.x = time * 0.15 + 1;
            ring2.rotation.z = -time * 0.05;

            ring3.rotation.y = -time * 0.1;
            ring3.rotation.z = time * 0.02;

            ring4.rotation.y = -time * 0.2;
            ring4.rotation.z = time * 0.04;

            ring5.rotation.y = -time * 0.5;
            ring5.rotation.z = time * 0.10;

            // Update Shader Pulse
            networkMat.uniforms.uTime.value = time;

            // Animate Runes
            for(let i=0; i<runeCount; i++) {
                const angle = time * runeSpeeds[i] + runeOffsets[i];
                const r = runeRadii[i];
                
                const x = Math.cos(angle) * r;
                const z = Math.sin(angle) * r;
                // Use the random height + a gentle float wave
                const y = runeHeights[i] + Math.sin(time * 0.5 + runeOffsets[i]) * 1.0; 

                dummy.position.set(x, y, z);
                dummy.rotation.set(time + i, time * 2, 0);
                dummy.scale.setScalar(1.0 + Math.sin(time * 3 + i)*0.2); 

                dummy.updateMatrix();
                runes.setMatrixAt(i, dummy.matrix);
            }
            runes.instanceMatrix.needsUpdate = true;

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
            title="Crystallized Thought"
        />
    );
};