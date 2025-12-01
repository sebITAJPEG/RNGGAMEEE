import React, { useMemo } from 'react';

export const AntimatterView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Antimatter Ore - Rarity: Legendary</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #050505;
            overflow: hidden;
            font-family: 'Courier New', Courier, monospace;
        }
        canvas {
            display: block;
        }
        #ui {
            position: absolute;
            bottom: 30px;
            left: 30px;
            color: rgba(255, 255, 255, 0.8);
            pointer-events: none;
            user-select: none;
        }
        h1 {
            margin: 0;
            font-size: 1.2rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #d8b4ff;
            text-shadow: 0 0 10px #8a2be2;
        }
        p {
            margin: 5px 0 0 0;
            font-size: 0.8rem;
            color: #888;
        }
        .rarity {
            color: #ff0055;
            font-weight: bold;
            text-shadow: 0 0 8px #ff0055;
        }
        #loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 1.5rem;
            letter-spacing: 5px;
            pointer-events: none;
            transition: opacity 0.5s;
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

    <div id="loading">INITIALIZING CONTAINMENT FIELD...</div>
    
    <div id="ui">
        <h1>Antimatter Ore</h1>
        <p>Class: <span class="rarity">ANOMALY</span> // Stability: 12%</p>
        <p>Drop Rate: 1 : 250,000,000</p>
    </div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x020205); // Very deep dark blue/black
        scene.fog = new THREE.FogExp2(0x020205, 0.02);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 7);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ReinhardToneMapping;
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.minDistance = 3;
        controls.maxDistance = 15;

        // --- SHADER MATERIALS ---

        // GLSL Noise function (Simplex 3D)
        const noiseGLSL = \`
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

            float snoise(vec3 v) { 
                const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
                const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

                // First corner
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 = v - i + dot(i, C.xxx) ;

                // Other corners
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );

                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
                vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

                // Permutations
                i = mod289(i); 
                vec4 p = permute( permute( permute( 
                            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

                // Gradients: 7x7 points over a square, mapped onto an octahedron.
                // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
                float n_ = 0.142857142857; // 1.0/7.0
                vec3  ns = n_ * D.wyz - D.xzx;

                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

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

                //Normalise gradients
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;

                // Mix final noise value
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                            dot(p2,x2), dot(p3,x3) ) );
            }
        \`;

        const vertexShader = \`
            uniform float uTime;
            varying vec2 vUv;
            varying vec3 vNormal;
            varying float vDisplacement;
            varying vec3 vViewPosition;
            
            \${noiseGLSL}

            void main() {
                vUv = uv;
                
                // Base noise for shape irregularity
                float t = uTime * 0.5;
                float noise = snoise(vec3(position.x * 1.5 + t, position.y * 1.5 + t, position.z * 1.5));
                
                // Secondary high frequency noise for "glitching" edges
                float noiseHigh = snoise(vec3(position * 4.0 + t * 2.0));
                
                // Combine
                float displacement = noise * 0.3 + noiseHigh * 0.05;
                vDisplacement = displacement;

                // Displace the vertex along its normal
                vec3 newPosition = position + normal * displacement;

                vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
                vViewPosition = -mvPosition.xyz;
                vNormal = normalMatrix * normal;
                
                gl_Position = projectionMatrix * mvPosition;
            }
        \`;

        const fragmentShader = \`
            uniform float uTime;
            uniform vec3 uColorCore;
            uniform vec3 uColorGlow;
            uniform vec3 uColorRim;
            
            varying vec3 vNormal;
            varying float vDisplacement;
            varying vec3 vViewPosition;

            void main() {
                // Normalize normal
                vec3 normal = normalize(vNormal);
                vec3 viewDir = normalize(vViewPosition);

                // Fresnel Effect (Rim Lighting)
                float fresnel = dot(viewDir, normal);
                fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
                fresnel = pow(fresnel, 2.5); // Sharpen the rim

                // Pulse factor
                float pulse = sin(uTime * 2.0) * 0.5 + 0.5;

                // Mix colors based on displacement (Deep valleys are dark, peaks are bright)
                // vDisplacement ranges roughly -0.3 to 0.3
                float mixFactor = smoothstep(-0.2, 0.3, vDisplacement);
                
                vec3 baseColor = mix(uColorCore, uColorGlow, mixFactor);
                
                // Add intense light to the "cracks" or high displacement areas
                if(vDisplacement > 0.15) {
                    baseColor += uColorGlow * 1.5;
                }

                // Add Fresnel Rim
                vec3 finalColor = mix(baseColor, uColorRim, fresnel * 1.5);
                
                // Add an unstable blinking void effect
                if (sin(uTime * 10.0 + vDisplacement * 20.0) > 0.95) {
                     finalColor = vec3(1.0); // White glitch sparks
                }

                gl_FragColor = vec4(finalColor, 1.0);
            }
        \`;

        // --- MESH CREATION ---

        // The Crystal Core
        const geometry = new THREE.IcosahedronGeometry(1.5, 30); // High detail for shader displacement
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColorCore: { value: new THREE.Color(0x0a001a) }, // Deep void black/purple
                uColorGlow: { value: new THREE.Color(0x5200cc) }, // Dark Violet
                uColorRim: { value: new THREE.Color(0x00ffff) }   // Cyan/White edge
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            wireframe: false
        });

        const coreMesh = new THREE.Mesh(geometry, material);
        scene.add(coreMesh);

        // Floating Debris Particles (InstancedMesh for performance)
        const debrisCount = 150;
        const debrisGeo = new THREE.TetrahedronGeometry(0.05, 0);
        const debrisMat = new THREE.MeshBasicMaterial({ color: 0xaa55ff }); // Bright purple
        const debrisSystem = new THREE.InstancedMesh(debrisGeo, debrisMat, debrisCount);
        
        const dummy = new THREE.Object3D();
        const debrisData = []; // Store radius and speed for each particle

        for (let i = 0; i < debrisCount; i++) {
            // Random orbit radius
            const r = 2.5 + Math.random() * 3.0;
            // Random angle
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            // Random rotation speed
            const speed = (Math.random() - 0.5) * 0.01;
            
            dummy.position.setFromSphericalCoords(r, phi, theta);
            dummy.lookAt(0, 0, 0); // Point shards inward
            dummy.updateMatrix();
            debrisSystem.setMatrixAt(i, dummy.matrix);
            
            debrisData.push({ r, theta, phi, speed, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize() });
        }
        scene.add(debrisSystem);

        // Background Stars/Dust
        const starsGeo = new THREE.BufferGeometry();
        const starsCount = 1000;
        const posArray = new Float32Array(starsCount * 3);
        for(let i = 0; i < starsCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 50;
        }
        starsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const starsMat = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xffffff,
            transparent: true,
            opacity: 0.4
        });
        const starMesh = new THREE.Points(starsGeo, starsMat);
        scene.add(starMesh);

        // --- POST PROCESSING ---
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        // The Glow
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            2.0,  // Strength (High for legendary feel)
            0.5,  // Radius
            0.1   // Threshold (Low to capture the dark violets)
        );
        composer.addPass(bloomPass);

        // --- LIGHTING ---
        // Lights mainly affect the debris since the core is unlit shader
        const pointLight = new THREE.PointLight(0xaaddff, 2, 20);
        pointLight.position.set(2, 2, 2);
        scene.add(pointLight);
        
        const pointLight2 = new THREE.PointLight(0xff00aa, 2, 20);
        pointLight2.position.set(-2, -2, 2);
        scene.add(pointLight2);

        // --- ANIMATION LOOP ---
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Update Shader
            material.uniforms.uTime.value = elapsedTime;

            // Rotate Core
            coreMesh.rotation.y = elapsedTime * 0.1;
            coreMesh.rotation.z = elapsedTime * 0.05;

            // Animate Debris
            for (let i = 0; i < debrisCount; i++) {
                const d = debrisData[i];
                
                // Orbit Logic
                d.theta += d.speed; 
                // Add some "breathing" movement to radius
                const currentR = d.r + Math.sin(elapsedTime * 2.0 + i) * 0.1;

                dummy.position.setFromSphericalCoords(currentR, d.phi, d.theta);
                
                // Self-rotation of shards
                dummy.rotateOnAxis(d.axis, 0.02);
                
                dummy.updateMatrix();
                debrisSystem.setMatrixAt(i, dummy.matrix);
            }
            debrisSystem.instanceMatrix.needsUpdate = true;
            
            // Subtle camera sway
            camera.position.x += Math.sin(elapsedTime * 0.5) * 0.005;
            camera.position.y += Math.cos(elapsedTime * 0.5) * 0.005;
            camera.lookAt(0,0,0);

            controls.update();
            
            // IMPORTANT: Render via Composer, not Renderer
            composer.render();
        }

        // --- RESIZE HANDLER ---
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        });

        // Hide loading text once things start
        document.getElementById('loading').style.opacity = 0;

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
            title="Antimatter View"
        />
    );
};
