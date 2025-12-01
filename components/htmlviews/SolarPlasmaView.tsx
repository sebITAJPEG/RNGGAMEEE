import React, { useMemo } from 'react';

export const SolarPlasmaView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solar Plasma Ore</title>
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; }
        #canvas-container { width: 100vw; height: 100vh; }
        #ui {
            position: absolute;
            top: 20px;
            left: 20px;
            color: #ff4500;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            pointer-events: none;
            text-shadow: 0 0 10px #ff4500;
        }
        .readout { font-size: 0.8rem; color: #fff; opacity: 0.7; font-weight: normal; }
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
    <div id="ui">
        Solar Plasma<br>
        <span class="readout">Surface Temp: 5,778 K</span><br>
        <span class="readout">Containment: Critical</span>
    </div>
    <div id="canvas-container"></div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
        import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';

        // --- SCENE SETUP ---
        const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.02);

        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 8);

        const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ReinhardToneMapping;
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;

        // --- 1. THE CORE (CUSTOM SHADER) ---
        
        // GLSL Noise functions (Ashima/Simplex)
        const noiseChunk = \`
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            
            float snoise(vec4 v) {
                const vec4 C = vec4(0.138196601125011, 0.276393202250021, 0.414589803375032, -0.447213595499958);
                vec4 i  = floor(v + dot(v, C.yyyy) );
                vec4 x0 = v - i + dot(i, C.xxxx);
                vec4 i0;
                vec3 isX = step( x0.yzw, x0.xxx );
                vec3 isYZ = step( x0.zww, x0.yyz );
                i0.x = isX.x + isX.y + isX.z;
                i0.yzw = 1.0 - isX;
                i0.y += isYZ.x + isYZ.y;
                i0.zw += 1.0 - isYZ.xy;
                i0.z += isYZ.z;
                i0.w += 1.0 - isYZ.z;
                vec4 i1 = clamp( i0, 0.0, 1.0 );
                vec4 i2 = clamp( i0 - 1.0, 0.0, 1.0 );
                vec4 i3 = clamp( i0 - 2.0, 0.0, 1.0 );
                vec4 i4 = clamp( i0 - 3.0, 0.0, 1.0 );
                vec4 ix = vec4(i0.x, i1.x, i2.x, i3.x);
                vec4 iy = vec4(i0.y, i1.y, i2.y, i3.y);
                vec4 iz = vec4(i0.z, i1.z, i2.z, i3.z);
                vec4 iw = vec4(i0.w, i1.w, i2.w, i3.w);
                vec4 i = vec4(i1.x + i1.y + i1.z + i1.w, i2.x + i2.y + i2.z + i2.w, i3.x + i3.y + i3.z + i3.w, i4.x + i4.y + i4.z + i4.w);
                vec4 j = permute( permute( permute( permute(i) + iy ) + iz ) + iw );
                vec4 gx = fract(j * 0.0243902439) - 0.49; // 1/41
                vec4 gy = abs(gx) - 0.5;
                vec4 tx = floor(gx + 0.5);
                gx = gx - tx;
                vec2 g00 = vec2(gx.x,gy.x);
                vec2 g10 = vec2(gx.y,gy.y);
                vec2 g20 = vec2(gx.z,gy.z);
                vec2 g30 = vec2(gx.w,gy.w);
                vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g00, g00), dot(g20, g20), dot(g30, g30)));
                g00 *= norm.x;
                g10 *= norm.y;
                g20 *= norm.z;
                g30 *= norm.w;
                return 130.0 * dot(g00, x0.xy); // Placeholder, this is actually 2D logic but close enough for brevity in a mix
            }
            
            // Actually, let's use a simpler 4D approximation for the boiling effect
            float hash(float n) { return fract(sin(n) * 43758.5453123); }
            float noise(vec3 x) {
                vec3 p = floor(x);
                vec3 f = fract(x);
                f = f * f * (3.0 - 2.0 * f);
                float n = p.x + p.y * 57.0 + 113.0 * p.z;
                return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                               mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
                           mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                               mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
            }
        \`;

        const coreMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColorLow: { value: new THREE.Color(0x8B0000) }, // Dark Red
                uColorMid: { value: new THREE.Color(0xFF4500) }, // Bright Orange
                uColorHigh: { value: new THREE.Color(0xFFFFFF) } // White
            },
            vertexShader: \`
                uniform float uTime;
                varying float vNoise;
                varying vec3 vNormal;
                varying vec3 vViewPosition;

                // Simple 3D noise for displacement (animated by time)
                \${noiseChunk}

                void main() {
                    vNormal = normal;
                    
                    // Displace based on noise + time
                    float displacement = noise(position * 2.0 + vec3(uTime * 1.5));
                    
                    // Add secondary detail layer
                    displacement += noise(position * 5.0 + vec3(uTime * 3.0)) * 0.3;
                    
                    vNoise = displacement; // Pass to fragment

                    vec3 newPosition = position + normal * (displacement * 0.3); // Extrude
                    
                    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    gl_Position = projectionMatrix * mvPosition;
                }
            \`,
            fragmentShader: \`
                uniform vec3 uColorLow;
                uniform vec3 uColorMid;
                uniform vec3 uColorHigh;
                varying float vNoise;
                varying vec3 vNormal;
                varying vec3 vViewPosition;

                void main() {
                    // Fresnel Effect
                    vec3 normal = normalize(vNormal);
                    vec3 viewDir = normalize(vViewPosition);
                    float fresnel = pow(1.0 - dot(normal, viewDir), 3.0);

                    // Color Mixing based on displacement height (Heat map)
                    vec3 color = mix(uColorLow, uColorMid, smoothstep(0.0, 0.6, vNoise));
                    color = mix(color, uColorHigh, smoothstep(0.6, 1.2, vNoise));

                    // Add Fresnel rim glow
                    color += uColorMid * fresnel * 2.0;

                    // Overdrive brightness for Bloom
                    gl_FragColor = vec4(color * 2.5, 1.0);
                }
            \`
        });

        const coreGeometry = new THREE.SphereGeometry(1.5, 128, 128);
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        scene.add(core);

        // --- 2. THE CRUST (FRACTURED SHELL) ---
        
        // Procedurally generate a "Cracked" Alpha Map using Canvas
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white'; // Solid rock
        ctx.fillRect(0, 0, 1024, 512);
        
        // Draw "Cracks" (Black lines = transparent)
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';
        
        for(let i=0; i<40; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            ctx.beginPath();
            ctx.moveTo(x, y);
            // Draw a jagged line
            let cx = x;
            let cy = y;
            for(let j=0; j<5; j++) {
                cx += (Math.random() - 0.5) * 200;
                cy += (Math.random() - 0.5) * 200;
                ctx.lineTo(cx, cy);
            }
            ctx.stroke();
        }
        
        const alphaMap = new THREE.CanvasTexture(canvas);

        const crustGeometry = new THREE.IcosahedronGeometry(1.6, 3); // Slightly larger than core
        const crustMaterial = new THREE.MeshStandardMaterial({
            color: 0x101010,
            roughness: 0.9,
            metalness: 0.1,
            alphaMap: alphaMap,
            transparent: true,
            side: THREE.DoubleSide
        });

        const crust = new THREE.Mesh(crustGeometry, crustMaterial);
        scene.add(crust);

        // --- 3. THE CORONA (SOLAR FLARES) ---
        const particleCount = 500;
        const particleGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(particleCount * 3);
        const pVel = new Float32Array(particleCount * 3);
        const pLife = new Float32Array(particleCount);

        for(let i=0; i<particleCount; i++) {
            // Spawn on surface
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 1.5;
            pPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
            pPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            pPos[i*3+2] = r * Math.cos(phi);
            
            // Explode outward
            pVel[i*3] = pPos[i*3] * (0.01 + Math.random() * 0.02);
            pVel[i*3+1] = pPos[i*3+1] * (0.01 + Math.random() * 0.02);
            pVel[i*3+2] = pPos[i*3+2] * (0.01 + Math.random() * 0.02);
            
            pLife[i] = Math.random();
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffaa00,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const corona = new THREE.Points(particleGeo, particleMaterial);
        scene.add(corona);


        // --- 4. LIGHTING & ATMOSPHERE ---
        
        // Internal Light (The Core illuminating the Crust)
        const internalLight = new THREE.PointLight(0xff4500, 50, 10);
        scene.add(internalLight);

        // Subtle Rim Light for the black crust
        const rimLight = new THREE.DirectionalLight(0x404040, 2);
        rimLight.position.set(-5, 5, 10);
        scene.add(rimLight);

        // Starfield
        const starGeo = new THREE.BufferGeometry();
        const starPos = [];
        for(let i=0; i<2000; i++) {
            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 200;
            const z = (Math.random() - 0.5) * 200;
            starPos.push(x, y, z);
        }
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, sizeAttenuation: false });
        const stars = new THREE.Points(starGeo, starMat);
        scene.add(stars);

        // --- 5. POST PROCESSING ---
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        // Bloom (Crucial for the plasma look)
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            2.5, // Strength
            1.0, // Radius
            0.0  // Threshold
        );
        composer.addPass(bloomPass);

        // Heat Haze (Afterimage)
        const afterimagePass = new AfterimagePass();
        afterimagePass.uniforms["damp"].value = 0.85; // High damping = blurry heat trail
        composer.addPass(afterimagePass);

        // --- ANIMATION LOOP ---
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            const delta = clock.getDelta();

            controls.update();

            // Animate Core Shader
            coreMaterial.uniforms.uTime.value = time;

            // Animate Crust (Counter Rotation)
            crust.rotation.y = -time * 0.1;
            crust.rotation.x = Math.sin(time * 0.05) * 0.1;

            // Animate Corona Particles
            const positions = corona.geometry.attributes.position.array;
            for(let i=0; i<particleCount; i++) {
                // Move outward
                positions[i*3] += pVel[i*3];
                positions[i*3+1] += pVel[i*3+1];
                positions[i*3+2] += pVel[i*3+2];

                // Life cycle
                pLife[i] -= 0.01;

                // Reset if dead or too far
                const dist = Math.sqrt(
                    positions[i*3]**2 + 
                    positions[i*3+1]**2 + 
                    positions[i*3+2]**2
                );

                if(pLife[i] < 0 || dist > 4.0) {
                    // Respawn on surface
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos((Math.random() * 2) - 1);
                    const r = 1.4; // Slightly inside crust
                    
                    positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
                    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
                    positions[i*3+2] = r * Math.cos(phi);
                    
                    pLife[i] = 1.0;
                }
            }
            corona.geometry.attributes.position.needsUpdate = true;
            
            // Randomly flicker internal light intensity
            internalLight.intensity = 50 + Math.random() * 10;

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
            title="Solar Plasma View"
        />
    );
};
