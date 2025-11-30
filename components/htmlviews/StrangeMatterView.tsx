import React, { useMemo } from 'react';

export const StrangeMatterView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Strange Matter - 1/100M Rarity</title>
    <style>
        body { margin: 0; overflow: hidden; background-color: #020005; }
        canvas { display: block; }

        /* UI Overlay */
        #ui-layer {
            position: absolute;
            bottom: 40px;
            left: 40px;
            color: white;
            font-family: 'Courier New', Courier, monospace;
            pointer-events: none;
            z-index: 10;
            max-width: 800px;
        }

        h1 {
            margin: 0;
            font-size: 4rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -2px;
            line-height: 0.9;
            background: linear-gradient(90deg, #fff, #b08aff, #fff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 30px rgba(160, 32, 240, 0.6);
            animation: glitchText 3s infinite alternate;
        }

        .rarity-badge {
            display: inline-block;
            margin-top: 15px;
            padding: 8px 16px;
            border: 1px solid #ff0050;
            background: rgba(255, 0, 80, 0.1);
            color: #ff0050;
            font-weight: bold;
            font-size: 0.9rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            box-shadow: 0 0 15px #ff0050;
            animation: pulseBadge 0.5s infinite alternate;
        }

        .stats {
            margin-top: 15px;
            font-size: 0.8rem;
            color: #aaa;
            line-height: 1.5;
            text-shadow: 0 0 5px rgba(0,0,0,0.8);
        }

        @keyframes pulseBadge {
            from { box-shadow: 0 0 10px #ff0050; opacity: 0.8; }
            to { box-shadow: 0 0 25px #ff0050; opacity: 1; }
        }

        /* Responsive Fixes */
        @media (max-width: 768px) {
            #ui-layer {
                left: 0;
                width: 100%;
                bottom: 30px;
                text-align: center;
                padding: 0 20px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            h1 { font-size: 2.5rem; text-shadow: 0 0 15px rgba(160, 32, 240, 0.8); }
            .rarity-badge { font-size: 0.7rem; padding: 6px 12px; margin-top: 10px; }
            .stats { font-size: 0.7rem; margin-top: 10px; }
        }
    </style>

    <script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
            }
        }
    </script>
</head>
<body>

    <div id="ui-layer">
        <h1>Strange Matter</h1>
        <div class="rarity-badge">Rarity: 1 in 100M</div>
        <div class="stats">
            ID: #ERROR_NULL<br>
            Stability: CRITICAL (0.02%)<br>
            Composition: Unstable Dark Energy
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        // Deep cosmetic fog to blend the floor into the void
        scene.fog = new THREE.Fog(0x020005, 5, 25);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1, 5);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = THREE.ReinhardToneMapping;
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
        controls.enablePan = false;
        controls.maxDistance = 8;
        controls.minDistance = 3;

        // --- CORE ORE SHADER (Same as before) ---
        const vertexShader = \`
            uniform float uTime;
            uniform float uIntensity;
            varying vec2 vUv;
            varying float vDisplacement;
            varying vec3 vNormal;

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
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
            }

            void main() {
                vUv = uv;
                vNormal = normal;
                float noise1 = snoise(position * 2.5 + uTime * 0.5);
                float noise2 = snoise(position * 5.0 - uTime * 0.2);
                float combined = noise1 + (noise2 * 0.3);
                vec3 newPosition = position + normal * (combined * uIntensity);
                vDisplacement = combined;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
        \`;

        const fragmentShader = \`
            uniform float uTime;
            varying float vDisplacement;
            varying vec3 vNormal;

            void main() {
                vec3 coreBlack = vec3(0.05, 0.0, 0.1);
                vec3 midPurple = vec3(0.5, 0.0, 0.8);
                vec3 highPink = vec3(1.0, 0.1, 0.6);
                vec3 glitchCyan = vec3(0.0, 1.0, 1.0);

                float intensity = smoothstep(-0.5, 1.0, vDisplacement);
                vec3 color = mix(coreBlack, midPurple, intensity);
                color = mix(color, highPink, smoothstep(0.2, 0.8, vDisplacement));

                float vein = sin(vDisplacement * 20.0 + uTime * 3.0);
                if(vein > 0.95) {
                    color = mix(color, glitchCyan, 0.8);
                }

                vec3 viewDir = vec3(0.0, 0.0, 1.0);
                float rim = 1.0 - max(dot(vNormal, viewDir), 0.0);
                rim = pow(rim, 2.5);
                color += rim * vec3(0.6, 0.2, 1.0);

                if(vDisplacement < -0.2) color *= 0.1;

                gl_FragColor = vec4(color, 1.0);
            }
        \`;

        // --- MAIN ORE & RINGS ---
        const oreGroup = new THREE.Group();
        scene.add(oreGroup);

        const geometry = new THREE.IcosahedronGeometry(1.0, 80);
        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: { uTime: { value: 0 }, uIntensity: { value: 0.4 } }
        });
        const strangeMatter = new THREE.Mesh(geometry, material);
        oreGroup.add(strangeMatter);

        const ringGeo = new THREE.TorusGeometry(1.6, 0.02, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 });
        const ring1 = new THREE.Mesh(ringGeo, ringMat);
        const ring2 = new THREE.Mesh(ringGeo, ringMat);
        const ring3 = new THREE.Mesh(ringGeo, ringMat);
        ring1.rotation.x = Math.PI / 2;
        ring2.rotation.y = Math.PI / 2;
        ring3.rotation.z = Math.PI / 4;
        const ringGroup = new THREE.Group();
        ringGroup.add(ring1, ring2, ring3);
        oreGroup.add(ringGroup);

        // --- SHARDS ---
        const shardCount = 80;
        const shardGeo = new THREE.TetrahedronGeometry(0.08, 0);
        const shardMat = new THREE.MeshStandardMaterial({
            color: 0xff00ff, roughness: 0.1, metalness: 0.9, emissive: 0x5500aa, emissiveIntensity: 0.5
        });
        const shards = new THREE.InstancedMesh(shardGeo, shardMat, shardCount);
        const dummy = new THREE.Object3D();
        const shardData = [];
        for(let i = 0; i < shardCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 1.8 + Math.random() * 1.5;
            shardData.push({ radius: r, theta: theta, phi: phi, speed: 0.2 + Math.random() * 0.5, rotationSpeed: (Math.random() - 0.5) * 2.0 });
        }
        oreGroup.add(shards);

        // --- BACKGROUND ELEMENTS ---

        // 1. Undulating Grid Floor
        const gridRes = 40;
        const gridGeo = new THREE.PlaneGeometry(50, 50, gridRes, gridRes);
        const gridMat = new THREE.MeshBasicMaterial({
            color: 0x440088,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const grid = new THREE.Mesh(gridGeo, gridMat);
        grid.rotation.x = -Math.PI / 2;
        grid.position.y = -3;
        scene.add(grid);

        // Save original position for animation
        const gridPosAttribute = gridGeo.attributes.position;
        const gridInitialZ = [];
        for (let i = 0; i < gridPosAttribute.count; i++) {
            gridInitialZ.push(gridPosAttribute.getZ(i));
        }

        // 2. Distant Monoliths (Dark background shapes)
        const monolithGeo = new THREE.BoxGeometry(2, 10, 2);
        const monolithMat = new THREE.MeshBasicMaterial({ color: 0x050010, wireframe: true, transparent: true, opacity: 0.05 });
        const monoliths = [];

        for(let i=0; i<6; i++) {
            const m = new THREE.Mesh(monolithGeo, monolithMat);
            const angle = (i / 6) * Math.PI * 2;
            const dist = 15;
            m.position.set(Math.cos(angle)*dist, Math.random()*5 - 5, Math.sin(angle)*dist);
            m.rotation.y = Math.random() * Math.PI;
            scene.add(m);
            monoliths.push(m);
        }

        // 3. Shooting Stars / Data Streams
        const starsGeo = new THREE.BufferGeometry();
        const starsCount = 100;
        const starsPos = new Float32Array(starsCount * 3);
        const starsSpeeds = [];

        for(let i=0; i<starsCount; i++) {
            starsPos[i*3] = (Math.random() - 0.5) * 30; // x
            starsPos[i*3+1] = (Math.random() - 0.5) * 30; // y
            starsPos[i*3+2] = (Math.random() - 0.5) * 10 - 5; // z (behind ore)
            starsSpeeds.push(0.1 + Math.random() * 0.4);
        }
        starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
        const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.5 });
        const starField = new THREE.Points(starsGeo, starsMat);
        scene.add(starField);

        // --- LIGHTING ---
        const pointLight = new THREE.PointLight(0x00ffff, 5, 20);
        pointLight.position.set(3, 3, 3);
        scene.add(pointLight);
        const pointLight2 = new THREE.PointLight(0xff0055, 5, 20);
        pointLight2.position.set(-3, -3, 3);
        scene.add(pointLight2);
        scene.add(new THREE.AmbientLight(0x220033));

        // --- POST PROCESSING ---
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.1));

        // --- ANIMATION LOOP ---
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            // Core Animation
            material.uniforms.uTime.value = t;
            material.uniforms.uIntensity.value = 0.4 + Math.sin(t * 3) * 0.05;

            // Rings
            ring1.rotation.x = Math.PI/2 + t * 0.5; ring1.rotation.y = t * 0.2;
            ring2.rotation.y = Math.PI/2 + t * 0.5; ring2.rotation.x = t * 0.3;
            ring3.rotation.z = t * 0.8;
            ringGroup.rotation.x = Math.sin(t * 0.5) * 0.1;

            // Shards
            for(let i = 0; i < shardCount; i++) {
                const d = shardData[i];
                d.theta += d.speed * 0.01;
                d.phi += d.speed * 0.005;
                const x = d.radius * Math.sin(d.phi) * Math.cos(d.theta);
                const y = d.radius * Math.sin(d.phi) * Math.sin(d.theta);
                const z = d.radius * Math.cos(d.phi);
                dummy.position.set(x, y, z);
                dummy.rotation.x += d.rotationSpeed * 0.02; dummy.rotation.y += d.rotationSpeed * 0.02;
                dummy.lookAt(0,0,0);
                dummy.updateMatrix();
                shards.setMatrixAt(i, dummy.matrix);
            }
            shards.instanceMatrix.needsUpdate = true;

            // Lights
            pointLight.position.x = Math.sin(t) * 4; pointLight.position.z = Math.cos(t) * 4;
            pointLight2.position.y = Math.sin(t * 1.5) * 4;

            // --- BACKGROUND ANIMATION ---

            // 1. Grid Undulation (Wave effect)
            const positions = grid.geometry.attributes.position.array;
            for(let i = 0; i < gridPosAttribute.count; i++) {
                const x = positions[i * 3];
                const y = positions[i * 3 + 1]; // This is actually Z in world space before rotation
                // Create a rolling wave
                const wave = Math.sin(x * 0.5 + t) * 0.5 + Math.cos(y * 0.5 + t) * 0.5;
                positions[i * 3 + 2] = gridInitialZ[i] + wave;
            }
            grid.geometry.attributes.position.needsUpdate = true;

            // 2. Monoliths
            monoliths.forEach((m, idx) => {
                m.rotation.y += 0.005 * (idx % 2 === 0 ? 1 : -1);
                m.position.y += Math.sin(t + idx) * 0.01;
            });

            // 3. Stars (Falling/Rising effect)
            const sPos = starField.geometry.attributes.position.array;
            for(let i=0; i<starsCount; i++) {
                sPos[i*3+1] += starsSpeeds[i]; // Move Up
                if(sPos[i*3+1] > 15) sPos[i*3+1] = -15; // Reset
            }
            starField.geometry.attributes.position.needsUpdate = true;

            controls.update();
            composer.render();
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
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
            title="Strange Matter"
        />
    );
};
