import React, { useMemo } from 'react';

export const GoldenRatioView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Golden Ratio Ore</title>
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; }
        #canvas-container {
            width: 100%;
            height: 100vh;
            background: radial-gradient(circle at center, #1a1500 0%, #000000 100%);
            cursor: move;
        }
        /* Original UI Styling Restored */
        #ui {
            position: absolute;
            bottom: 30px;
            left: 30px;
            color: #FFD700;
            font-family: 'Courier New', monospace;
            pointer-events: none;
            text-transform: uppercase;
            letter-spacing: 2px;
            z-index: 10;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        .glitch-text { animation: glitch 1s infinite alternate; }
        @keyframes glitch {
            0% { opacity: 1; transform: translateX(0); }
            95% { opacity: 1; transform: translateX(0); }
            96% { opacity: 0.8; transform: translateX(-2px); }
            97% { opacity: 0.8; transform: translateX(2px); }
            100% { opacity: 1; transform: translateX(0); }
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
    <div id="ui">
        <h2>Entity: Golden Ratio</h2>
        <p class="glitch-text">Stability: <span id="stability">98.4%</span></p>
        <p style="font-size: 0.7em; opacity: 0.7;">Interaction: Enabled</p>
    </div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
        import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

        const PHI = (1 + Math.sqrt(5)) / 2;
        const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
        const SHARD_COUNT = 250;
        const PARTICLE_COUNT = 3000;

        const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        scene.background = null; 

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 18);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ReinhardToneMapping;
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.0;
        controls.enablePan = false;
        controls.minDistance = 5;
        controls.maxDistance = 30;

        const coreGroup = new THREE.Group();
        scene.add(coreGroup);

        const coreGeo = new THREE.IcosahedronGeometry(1.2, 16);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        coreGroup.add(core);

        const cageGeo = new THREE.IcosahedronGeometry(1.4, 2);
        const cageMat = new THREE.MeshBasicMaterial({ 
            color: 0xffaa00, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.3 
        });
        const cage = new THREE.Mesh(cageGeo, cageMat);
        coreGroup.add(cage);

        const coreLight = new THREE.PointLight(0xFFD700, 15, 25);
        scene.add(coreLight);

        const beamGeo = new THREE.CylinderGeometry(0.02, 0.1, 8, 8);
        beamGeo.translate(0, 4, 0);
        beamGeo.rotateX(Math.PI / 2);
        const beamMat = new THREE.MeshBasicMaterial({
            color: 0xffdd44,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        const beamCount = 12;
        const beams = new THREE.InstancedMesh(beamGeo, beamMat, beamCount);
        coreGroup.add(beams);

        const beamDummy = new THREE.Object3D();
        for(let i=0; i<beamCount; i++) {
            beamDummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            beamDummy.scale.set(1, 1, 0.5 + Math.random());
            beamDummy.updateMatrix();
            beams.setMatrixAt(i, beamDummy.matrix);
        }

        const shardGeo = new THREE.DodecahedronGeometry(0.25, 0);
        const shardMat = new THREE.MeshPhysicalMaterial({
            color: 0x050505,
            roughness: 0.05,
            metalness: 0.2,
            transmission: 0.1,
            thickness: 1.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.0,
            side: THREE.DoubleSide
        });

        const shellMesh = new THREE.InstancedMesh(shardGeo, shardMat, SHARD_COUNT);
        scene.add(shellMesh);

        const shardDirs = [];
        const shardRotAxes = [];
        const shardRotSpeeds = [];
        const dummy = new THREE.Object3D();

        for (let i = 0; i < SHARD_COUNT; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const x = Math.sin(phi) * Math.cos(theta);
            const y = Math.sin(phi) * Math.sin(theta);
            const z = Math.cos(phi);
            const dir = new THREE.Vector3(x, y, z);
            shardDirs.push(dir);
            shardRotAxes.push(new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize());
            shardRotSpeeds.push((Math.random() - 0.5) * 3.0);
            
            const scale = 0.4 + Math.random() * 1.2;
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            shellMesh.setMatrixAt(i, dummy.matrix);
        }

        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const randoms = new Float32Array(PARTICLE_COUNT);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = GOLDEN_ANGLE * i;
            const r = 4.5 + Math.random() * 3; 

            positions[i * 3] = Math.cos(theta) * radius * r;
            positions[i * 3 + 1] = y * r;
            positions[i * 3 + 2] = Math.sin(theta) * radius * r;
            randoms[i] = Math.random();
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

        const particleMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(0xFFD700) }
            },
            vertexShader: \`
                uniform float uTime;
                attribute float aRandom;
                varying float vAlpha;
                void main() {
                    vec3 pos = position;
                    float speed = 0.1 + aRandom * 0.1;
                    float angle = uTime * speed + aRandom * 6.0;
                    float c = cos(angle);
                    float s = sin(angle);
                    
                    float nx = pos.x * c - pos.z * s;
                    float nz = pos.x * s + pos.z * c;
                    pos.x = nx;
                    pos.z = nz;
                    
                    pos.y += sin(uTime * 0.5 + aRandom * 10.0) * 0.2;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    
                    gl_PointSize = (3.0 * aRandom + 1.0) * (15.0 / -mvPosition.z);
                    vAlpha = 0.4 + 0.6 * sin(uTime * 2.0 + aRandom * 20.0);
                }
            \`,
            fragmentShader: \`
                uniform vec3 uColor;
                varying float vAlpha;
                void main() {
                    float r = distance(gl_PointCoord, vec2(0.5));
                    if (r > 0.5) discard;
                    float glow = 1.0 - (r * 2.0);
                    glow = pow(glow, 2.0);
                    gl_FragColor = vec4(uColor, vAlpha * glow);
                }
            \`,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            2.5, 0.8, 0.0
        );
        composer.addPass(bloomPass);

        const chromaticAberrationShader = {
            uniforms: {
                tDiffuse: { value: null },
                amount: { value: 0 }
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
                    vec2 offset = amount * vec2(0.005, 0.0);
                    float r = texture2D(tDiffuse, vUv + offset).r;
                    float g = texture2D(tDiffuse, vUv).g;
                    float b = texture2D(tDiffuse, vUv - offset).b;
                    gl_FragColor = vec4(r, g, b, 1.0);
                }
            \`
        };
        const chromPass = new ShaderPass(chromaticAberrationShader);
        composer.addPass(chromPass);

        const grainShader = {
            uniforms: {
                tDiffuse: { value: null },
                amount: { value: 0.05 },
                time: { value: 0 }
            },
            vertexShader: \`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            \`,
            fragmentShader: \`
                uniform float amount;
                uniform float time;
                uniform sampler2D tDiffuse;
                varying vec2 vUv;
                float random(vec2 p) {
                    vec2 K1 = vec2(23.14069263277926, 2.665144142690225);
                    return fract(cos(dot(p,K1)) * 12345.6789);
                }
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    vec2 uvRandom = vUv;
                    uvRandom.y *= random(vec2(uvRandom.y, time));
                    color.rgb += random(uvRandom) * amount;
                    gl_FragColor = vec4(color);
                }
            \`
        };
        const grainPass = new ShaderPass(grainShader);
        grainPass.renderToScreen = true;
        composer.addPass(grainPass);

        const rimLight = new THREE.DirectionalLight(0xffffff, 4);
        rimLight.position.set(10, 10, 5);
        scene.add(rimLight);
        const fillLight = new THREE.DirectionalLight(0x4433aa, 2);
        fillLight.position.set(-10, -5, -5);
        scene.add(fillLight);

        const clock = new THREE.Clock();
        const uiStability = document.getElementById('stability');

        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            controls.update(); 

            cage.rotation.y = -time * 0.2;
            cage.rotation.x = time * 0.1;

            let chromaticAmount = 0.002; 
            
            if (Math.random() > 0.98) {
                const glitchScale = 1.0 + Math.random() * 0.6;
                core.scale.setScalar(glitchScale);
                cage.scale.setScalar(glitchScale * 1.1);
                coreMat.color.setHex(0xFFFFFF); 
                
                beamMat.opacity = 0.8;
                beams.rotation.z += Math.random();

                chromaticAmount = 0.02 + Math.random() * 0.03;
                
                if(uiStability) {
                    uiStability.innerText = (Math.random() * 50 + 40).toFixed(1) + "%";
                    uiStability.style.color = "red";
                }
            } else {
                core.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
                cage.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
                coreMat.color.lerp(new THREE.Color(0xFFD700), 0.1);
                beamMat.opacity = THREE.MathUtils.lerp(beamMat.opacity, 0.15, 0.1);
                
                beams.rotation.y = time * 0.1;
                beams.rotation.x = time * 0.05;

                if (Math.random() > 0.5 && uiStability) {
                    uiStability.innerText = "98.4%";
                    uiStability.style.color = "#FFD700";
                }
            }
            
            chromPass.uniforms.amount.value = THREE.MathUtils.lerp(chromPass.uniforms.amount.value, chromaticAmount, 0.1);

            const breath = Math.sin(time * PHI) * 0.2 + 1.0;
            
            for (let i = 0; i < SHARD_COUNT; i++) {
                const dir = shardDirs[i];
                const noise = Math.sin(time * 2 + i) * 0.1;
                const dist = 2.0 + breath * 0.5 + noise;
                
                dummy.position.copy(dir).multiplyScalar(dist);
                
                const rotAxis = shardRotAxes[i];
                const rotSpeed = shardRotSpeeds[i];
                dummy.rotateOnAxis(rotAxis, rotSpeed * 0.02);

                const s = (0.4 + (i%5)*0.1) * (1.0 - (breath - 1.0) * 0.2);
                dummy.scale.setScalar(s);
                
                dummy.updateMatrix();
                shellMesh.setMatrixAt(i, dummy.matrix);
            }
            shellMesh.instanceMatrix.needsUpdate = true;
            shellMesh.rotation.y = time * 0.05;

            particleMat.uniforms.uTime.value = time;
            grainPass.uniforms.time.value = time;

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
            title="The Golden Ratio"
        />
    );
};
