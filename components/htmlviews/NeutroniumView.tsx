import React, { useMemo } from 'react';

export const NeutroniumView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neutronium - The Gravity Well</title>
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; }
        #canvas-container { width: 100vw; height: 100vh; }
        #ui {
            position: absolute;
            bottom: 30px;
            left: 30px;
            color: #00FFFF;
            font-family: 'Courier New', Courier, monospace;
            pointer-events: none;
            text-transform: uppercase;
            letter-spacing: 2px;
            z-index: 10;
            text-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
        }
        .warning { color: #ff0055; font-size: 0.8em; animation: flash 1s infinite; }
        @keyframes flash { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
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
        <h2>Neutronium Core</h2>
        <p>Mass: 1.4 M☉</p>
        <p>Spin: 716 Hz</p>
        <p class="warning">⚠ RELATIVISTIC BEAMING ACTIVE</p>
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
        scene.fog = new THREE.FogExp2(0x000000, 0.002);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 3, 100);

        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        controls.minDistance = 5;
        controls.maxDistance = 40;

        // --- 1. GRAVITATIONAL LENSING STARFIELD ---
        const starCount = 6000;
        const starGeo = new THREE.BufferGeometry();
        const starPos = new Float32Array(starCount * 3);
        
        for(let i=0; i<starCount; i++) {
            const r = 0.5 + Math.random() * 100; 
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            starPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
            starPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            starPos[i*3+2] = r * Math.cos(phi);
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));

        const starMaterial = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: \`
                uniform float uTime;
                varying float vAlpha;
                void main() {
                    vec3 pos = position;
                    vec3 direction = normalize(pos);
                    float dist = length(pos);
                    // Stronger lensing near center
                    float distortion = 6.0 / (dist * dist + 0.05); 
                    vec3 newPos = pos + (direction * distortion);
                    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = 2.0 * (30.0 / -mvPosition.z);
                    vAlpha = 0.5 + 0.5 * sin(uTime * 3.0 + pos.x * 10.0);
                }
            \`,
            fragmentShader: \`
                varying float vAlpha;
                void main() {
                    vec2 coord = gl_PointCoord - vec2(0.5);
                    if(length(coord) > 0.5) discard;
                    gl_FragColor = vec4(0.8, 0.9, 1.0, vAlpha);
                }
            \`,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const starfield = new THREE.Points(starGeo, starMaterial);
        scene.add(starfield);

        // --- 2. THE NEUTRONIUM CORE ---
        const coreGroup = new THREE.Group();
        scene.add(coreGroup);

        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
        const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
        coreGroup.add(cubeCamera);

        const sphereGeo = new THREE.SphereGeometry(1.2, 64, 64);
        const sphereMat = new THREE.MeshPhysicalMaterial({
            color: 0x000000,
            metalness: 1.0,
            roughness: 0.0,
            clearcoat: 1.0,
            envMap: cubeRenderTarget.texture,
            envMapIntensity: 1.5,
            iridescence: 0.3,
            iridescenceIOR: 1.3
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        coreGroup.add(sphere);

        // PHOTON RING (Trapped Light)
        const photonGeo = new THREE.RingGeometry(1.22, 1.3, 64);
        const photonMat = new THREE.MeshBasicMaterial({ 
            color: 0x00FFFF, 
            side: THREE.DoubleSide, 
            transparent: true, 
            opacity: 0.8,
            blending: THREE.AdditiveBlending 
        });
        const photonRing = new THREE.Mesh(photonGeo, photonMat);
        photonRing.lookAt(camera.position); // Always face camera (billboard)
        scene.add(photonRing); // Add to scene, not coreGroup, to manage billboard separately

        // --- 3. RELATIVISTIC ACCRETION DISK ---
        const diskGeo = new THREE.RingGeometry(1.6, 5.0, 128, 4);
        diskGeo.rotateX(-Math.PI / 2); 

        const diskMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColorInner: { value: new THREE.Color(0x88FFFF) },
                uColorOuter: { value: new THREE.Color(0x110033) },
                // cameraPosition is handled automatically by Three.js ShaderMaterial
            },
            vertexShader: \`
                varying vec2 vUv;
                varying vec3 vPos;
                varying vec3 vWorldPos;
                void main() {
                    vUv = uv;
                    vPos = position;
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPos = worldPosition.xyz;
                    gl_Position = projectionMatrix * viewMatrix * worldPosition;
                }
            \`,
            fragmentShader: \`
                uniform float uTime;
                uniform vec3 uColorInner;
                uniform vec3 uColorOuter;
                // uniform vec3 cameraPosition; // Automatically injected by Three.js
                varying vec2 vUv;
                varying vec3 vPos;
                varying vec3 vWorldPos;

                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }

                void main() {
                    vec2 centered = vUv - 0.5;
                    float r = length(centered) * 2.0; 
                    float theta = atan(centered.y, centered.x);

                    // Spiral animation
                    float spiral = theta + uTime * 6.0;
                    
                    float noise = sin(spiral * 15.0) * 0.5 + 0.5;
                    noise += sin(spiral * 30.0 + r * 20.0) * 0.3;
                    
                    float distFromCenter = length(vPos);
                    float gradient = smoothstep(1.6, 5.0, distFromCenter);

                    // --- RELATIVISTIC DOPPLER BEAMING ---
                    // Calculate velocity vector of the spinning disk at this pixel
                    // Disk is in XZ plane, rotating around Y
                    vec3 velocityDir = normalize(vec3(-vPos.z, 0.0, vPos.x)); // Tangent vector
                    
                    // Vector from pixel to camera
                    vec3 viewDir = normalize(cameraPosition - vWorldPos);
                    
                    // Dot product: 1.0 = moving toward cam, -1.0 = moving away
                    float doppler = dot(velocityDir, viewDir);
                    
                    // Beaming effect: Brighten approaching side, darken receding side
                    float beaming = 1.0 + doppler * 0.6; 
                    
                    // Shift color slightly: Blue for approach, Red for recede
                    vec3 colBase = mix(uColorInner, uColorOuter, gradient);
                    vec3 colDoppler = mix(colBase, colBase + vec3(0.2, 0.2, 0.5), smoothstep(0.0, 1.0, doppler)); // Blue shift
                    colDoppler = mix(colDoppler, colDoppler * vec3(1.0, 0.5, 0.5), smoothstep(0.0, -1.0, doppler)); // Red dim
                    
                    vec3 finalColor = colDoppler * beaming;
                    finalColor += vec3(noise * 0.5 * (1.0 - gradient)) * beaming;

                    float alpha = 1.0 - smoothstep(0.7, 1.0, gradient);
                    alpha *= smoothstep(0.0, 0.05, gradient);
                    
                    gl_FragColor = vec4(finalColor * 2.5, alpha); 
                }
            \`,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const disk = new THREE.Mesh(diskGeo, diskMat);
        coreGroup.add(disk);

        // --- 4. VOLUMETRIC PULSAR JETS (Turbulent Noise) ---
        const jetGeo = new THREE.CylinderGeometry(0.1, 0.8, 10, 32, 16, true);
        jetGeo.translate(0, 5, 0); 

        const jetMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(0x00FFFF) }
            },
            vertexShader: \`
                varying vec2 vUv;
                varying vec3 vPos;
                void main() {
                    vUv = uv;
                    vPos = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            \`,
            fragmentShader: \`
                uniform float uTime;
                uniform vec3 uColor;
                varying vec2 vUv;
                varying vec3 vPos;

                // 3D Simplex Noise (Simplified)
                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
                vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
                float snoise(vec3 v) {
                    const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
                    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
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
                    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
                    p0 *= norm.x;
                    p1 *= norm.y;
                    p2 *= norm.z;
                    p3 *= norm.w;
                    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                    m = m * m;
                    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
                }

                void main() {
                    // Flowing noise along the Y axis
                    float noise = snoise(vec3(vPos.x * 2.0, vPos.y * 0.5 - uTime * 5.0, vPos.z * 2.0));
                    
                    // Core intensity fades out as we go up
                    float intensity = 1.0 - vUv.y;
                    
                    // Add turbulence
                    float alpha = smoothstep(0.2, 0.8, noise + intensity * 0.5);
                    
                    // Edge fade
                    alpha *= smoothstep(0.0, 0.2, vUv.y); // Fade in at base
                    alpha *= (1.0 - vUv.y); // Fade out at tip

                    gl_FragColor = vec4(uColor * 2.0, alpha * 0.6);
                }
            \`,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const jetTop = new THREE.Mesh(jetGeo, jetMat);
        const jetBot = new THREE.Mesh(jetGeo, jetMat);
        jetBot.rotation.x = Math.PI;

        coreGroup.add(jetTop);
        coreGroup.add(jetBot);


        // --- 5. POST PROCESSING ---
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            2.5, // High Strength
            0.3, // Radius
            0.0
        );
        composer.addPass(bloomPass);

        // --- 6. ANIMATION LOOP ---
        const clock = new THREE.Clock();
        
        // Initial Tilt
        coreGroup.rotation.z = Math.PI / 8;
        coreGroup.rotation.x = Math.PI / 6;

        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            // Update Uniforms
            diskMat.uniforms.uTime.value = time;
            // diskMat.uniforms.cameraPosition.value.copy(camera.position); // REMOVED: Auto-handled
            jetMat.uniforms.uTime.value = time;
            starMaterial.uniforms.uTime.value = time;

            // Precession (Wobble)
            const wobble = Math.sin(time * 2.0) * 0.05;
            coreGroup.rotation.y += 0.005; 
            coreGroup.rotation.x = (Math.PI / 6) + wobble;
            coreGroup.rotation.z = (Math.PI / 8) + Math.cos(time * 1.5) * 0.05;

            // Update Photon Ring (Billboard)
            photonRing.lookAt(camera.position);

            // Hide/Show for Reflections
            sphere.visible = false;
            photonRing.visible = false; // Don't reflect the fake billboard
            cubeCamera.update(renderer, scene);
            sphere.visible = true;
            photonRing.visible = true;

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
            title="Neutronium View"
        />
    );
};
