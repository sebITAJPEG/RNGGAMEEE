import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';

// --- SHADERS ---

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vDistortion;
  varying vec3 vPosition;

  // Simplex 3D Noise 
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
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    vPosition = position;
    
    // Layered Noise Distortion
    float noiseBase = snoise(position * 1.0 + uTime * 0.2);
    float noiseDetail = snoise(position * 4.0 - uTime * 0.5);
    
    float combinedNoise = noiseBase * 0.8 + noiseDetail * 0.2;
    vDistortion = combinedNoise;
    
    vec3 newPos = position + normal * (combinedNoise * 0.6);
    
    // Twist effect
    float angle = length(position.xy) * sin(uTime * 0.5) * 1.5;
    float s = sin(angle);
    float c = cos(angle);
    mat2 rotation = mat2(c, -s, s, c);
    newPos.xy = rotation * newPos.xy;
    newPos.yz = rotation * newPos.yz; // Double twist

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;
  varying float vDistortion;
  varying vec3 vPosition;

  void main() {
    // RGB Split / Local Glitch
    float split = 0.02 * sin(uTime * 10.0 + vPosition.y); // Glitch offset
    
    // Function to calculate intensity based on distortion + offset
    // We approximate the color mix logic here for 3 channels
    
    float d1 = vDistortion; // Red (no offset basically, or slight)
    float d2 = vDistortion + split; // Green 
    float d3 = vDistortion - split; // Blue

    vec3 c1 = mix(uColorA, uColorB, d1 * 0.5 + 0.5);
    vec3 c2 = mix(uColorA, uColorB, d2 * 0.5 + 0.5);
    vec3 c3 = mix(uColorA, uColorB, d3 * 0.5 + 0.5);

    vec3 color = vec3(c1.r, c2.g, c3.b);
    
    // Grid/Scanline effect
    float grid = abs(sin(vPosition.y * 20.0 + uTime * 2.0)) * abs(cos(vPosition.x * 20.0));
    if (grid > 0.95) {
        color += vec3(0.3, 0.8, 1.0) * 0.5;
    }

    // "Electric" bands along distortion peaks
    float bands = sin(vUv.y * 50.0 + uTime * 5.0 + vDistortion * 20.0);
    if(bands > 0.9) {
        color += vec3(1.0);
    }

    float rim = 1.0 - max(dot(viewMatrix[2].xyz, vec3(0.0, 0.0, 1.0)), 0.0);
    
    // Inner pulse
    float pulse = sin(uTime * 3.0) * 0.5 + 0.5;
    color += uColorB * pulse * 0.2;

    gl_FragColor = vec4(color + rim * 0.4, 0.9);
  }
`;

// --- NEW SHADERS ---

const singularityVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const singularityFragmentShader = `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = dot(viewDir, vNormal);
    float rim = pow(1.0 - abs(fresnel), 4.0);
    
    // Swirling Void Texture
    float noise = sin(vPosition.x * 10.0 + uTime * 2.0) * sin(vPosition.y * 10.0 + uTime * 3.0) * sin(vPosition.z * 10.0);
    
    vec3 color = vec3(0.0);
    
    // Accretion Disk / Event Horizon Glow
    vec3 glowColor = vec3(0.6, 0.0, 1.0); // Violet
    vec3 edgeColor = vec3(0.0, 1.0, 1.0); // Cyan
    
    color += glowColor * rim * 2.0;
    color += edgeColor * pow(rim, 8.0) * 5.0;
    
    // Dark chaotic spots
    if (noise > 0.5) color *= 0.0; 

    gl_FragColor = vec4(color, 1.0);
}
`;

const runeFragmentShader = `
uniform float uTime;
varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 p = vUv - 0.5;
    float r = length(p);
    float a = atan(p.y, p.x);
    
    // Time step for shifting glyphs
    float t = floor(uTime * 8.0); 
    float seed = random(vec2(t));
    
    // Generate glyph pattern
    float glyph = sin(a * (2.0 + floor(seed * 6.0))) * sin(r * (10.0 + seed * 20.0));
    
    // Hard edges
    float shape = step(0.3, abs(glyph));
    
    // Outer ring crop
    if (r > 0.45 || r < 0.1) shape = 0.0;
    
    vec3 color = vec3(1.0, 0.0, 1.0); // Magenta
    if (random(vec2(seed + 1.0)) > 0.5) color = vec3(0.0, 1.0, 1.0); // Occasional Cyan
    
    gl_FragColor = vec4(color, shape * 0.8);
}
`;

const beamVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const beamFragmentShader = `
uniform float uTime;
varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    // Gradient fade from bottom to top
    float fade = 1.0 - vUv.y;
    fade = pow(fade, 2.0);
    
    // Scrolling noise/energy
    float noise = sin(vUv.y * 20.0 - uTime * 5.0) + sin(vUv.x * 10.0);
    float beam = smoothstep(0.0, 1.0, noise);
    
    // Edges of the cone fade (horizontal)
    float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
    edge = smoothstep(0.0, 0.5, edge);
    
    vec3 color = vec3(0.5, 0.0, 1.0); // Purple beam
    
    gl_FragColor = vec4(color + vec3(0.5), fade * beam * edge * 0.3);
}
`;

const FloatingParticles = () => {
    const count = 100;
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.001 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (!meshRef.current) return;

        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            // Orbit logic
            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );

            // Limit distance
            const dist = dummy.position.length();
            if (dist > 15) dummy.position.normalize().multiplyScalar(15);
            if (dist < 4) dummy.position.normalize().multiplyScalar(4);

            dummy.scale.setScalar(s * 0.1 + 0.2); // Random breathing scale
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();

            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <tetrahedronGeometry args={[0.2, 0]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.4} wireframe />
        </instancedMesh>
    );
};

const GeodeMesh = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const wireframeRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.002;
            meshRef.current.rotation.z += 0.001;
        }
        if (wireframeRef.current) {
            wireframeRef.current.rotation.y -= 0.003; // Counter-rotate
            wireframeRef.current.rotation.z -= 0.002;
        }
    });

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color('#2e004d') }, // Darker Indigo
        uColorB: { value: new THREE.Color('#00ffff') }, // Cyan
    }), []);

    return (
        <group>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                {/* Main distorted mesh */}
                <mesh ref={meshRef}>
                    <icosahedronGeometry args={[2.5, 64]} />
                    <shaderMaterial
                        ref={materialRef}
                        vertexShader={vertexShader}
                        fragmentShader={fragmentShader}
                        uniforms={uniforms}
                        wireframe={false}
                        transparent={true}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>

                {/* Outer static wireframe shell for contrast */}
                <mesh ref={wireframeRef} scale={[1.2, 1.2, 1.2]}>
                    <icosahedronGeometry args={[2.8, 2]} />
                    <meshBasicMaterial color="#4b0082" wireframe transparent opacity={0.1} />
                </mesh>

                {/* Inner Glow Core / Singularity */}
                <mesh scale={[0.5, 0.5, 0.5]}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <shaderMaterial
                        vertexShader={singularityVertexShader}
                        fragmentShader={singularityFragmentShader}
                        uniforms={useMemo(() => ({ uTime: { value: 0 } }), [])}
                        transparent={true}
                    />
                </mesh>
            </Float>
            <FloatingParticles />
        </group>
    );
};

interface Props {
    onClose?: () => void;
}

// --- 2. SACRED GEOMETRY (Rotating Wireframes) ---
const SacredGeometry = () => {
    const group = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (group.current) {
            group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3; // Faster wobble
            group.current.rotation.y += 0.01; // Faster rotation
            group.current.rotation.z += 0.005;
        }
    });

    return (
        <group ref={group}>
            {/* Outer Dodecahedron */}
            <mesh scale={[5, 5, 5]}>
                <dodecahedronGeometry args={[1, 0]} />
                <meshBasicMaterial color="#4b0082" wireframe transparent opacity={0.05} />
            </mesh>
            {/* Inner Octahedron */}
            <mesh scale={[3.5, 3.5, 3.5]} rotation={[0.4, 0.2, 0]}>
                <octahedronGeometry args={[1, 0]} />
                <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.1} />
            </mesh>
        </group>
    );
};

// --- 3. NEBULA BACKGROUND ---
const nebulaVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const nebulaFragmentShader = `
uniform float uTime;
varying vec2 vUv;

// Simple dust noise
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 st = vUv;
    float n = random(st + uTime * 0.0001);
    
    // Violet/Teal clouds - Faster movement
    vec3 color = mix(vec3(0.05, 0.0, 0.1), vec3(0.0, 0.05, 0.1), st.y + sin(uTime * 0.5));
    
    // Add stars/dust
    if (n > 0.99) color += vec3(0.5);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

const NebulaBackground = () => {
    return (
        <mesh scale={[50, 50, 50]}>
            <sphereGeometry args={[1, 32, 32]} />
            <shaderMaterial
                side={THREE.BackSide}
                vertexShader={nebulaVertexShader}
                fragmentShader={nebulaFragmentShader}
                uniforms={{ uTime: { value: 0 } }}
            />
        </mesh>
    );
};

// --- 4. ORBITAL RINGS ---
const OrbitalRings = () => {
    const group = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (group.current) {
            group.current.rotation.z = state.clock.elapsedTime * 0.2; // Much faster
            group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
            group.current.rotation.y = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <group ref={group}>
            {/* Ring 1 */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[4, 0.02, 16, 100]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
            </mesh>
            {/* Ring 2 */}
            <mesh rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[4.5, 0.01, 16, 100]} />
                <meshBasicMaterial color="#ff00ff" transparent opacity={0.2} />
            </mesh>
            {/* Ring 3 */}
            <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                <torusGeometry args={[5, 0.03, 16, 100]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
            </mesh>
        </group>
    );
};

// --- 5. POINT CLOUD SHELL ---
const PointShell = () => {
    const group = useRef<THREE.Points>(null);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 2000; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);
            const r = 3 + Math.random() * 0.5;
            const x = r * Math.sin(theta) * Math.cos(phi);
            const y = r * Math.sin(theta) * Math.sin(phi);
            const z = r * Math.cos(theta);
            temp.push(x, y, z);
        }
        return new Float32Array(temp);
    }, []);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = -state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <points ref={group}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.03} color="#00ffff" transparent opacity={0.4} />
        </points>
    );
};

// --- 6. ANCIENT RUNES ---
const AncientRunes = () => {
    const group = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = -state.clock.elapsedTime * 0.2; // Faster orbit
            // Pulse scale of entire ring
            const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.1;
            group.current.scale.setScalar(scale);
        }
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

    return (
        <group ref={group}>
            {Array.from({ length: 8 }).map((_, i) => (
                <mesh key={i} position={[Math.sin(i * Math.PI / 4) * 6, Math.sin(i * 2) * 2, Math.cos(i * Math.PI / 4) * 6]} rotation={[0, -i * Math.PI / 4, 0]}>
                    <planeGeometry args={[0.8, 0.8]} />
                    <shaderMaterial
                        ref={materialRef}
                        vertexShader={beamVertexShader} // Resusing simple vertex shader
                        fragmentShader={runeFragmentShader}
                        uniforms={uniforms}
                        transparent
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
};

// --- 7. ENERGY BEAMS ---
const EnergyBeams = () => {
    const group = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.z = state.clock.elapsedTime * 0.1;
        }
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <group ref={group}>
            {[0, 1, 2].map((i) => (
                <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]} position={[0, 0, 0]}>
                    <coneGeometry args={[0.5, 10, 32, 1, true]} />
                    <shaderMaterial
                        ref={materialRef}
                        vertexShader={beamVertexShader}
                        fragmentShader={beamFragmentShader}
                        uniforms={useMemo(() => ({ uTime: { value: 0 } }), [])}
                        transparent
                        side={THREE.DoubleSide}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
        </group>
    );
};

// --- 8. CONTAINMENT FIELD ---
const ContainmentField = () => {
    const group = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = -state.clock.elapsedTime * 0.1; // Faster
            group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

            // Breach pulses
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.05;
            group.current.scale.setScalar(pulse);
        }
    });

    return (
        <group ref={group}>
            <mesh>
                <dodecahedronGeometry args={[6, 0]} />
                <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.1} />
            </mesh>
            <mesh rotation={[0.5, 0.5, 0]}>
                <dodecahedronGeometry args={[6.2, 0]} />
                <meshBasicMaterial color="#4b0082" wireframe transparent opacity={0.1} />
            </mesh>
        </group>
    );
};

// --- 8. HYPER GRID ---
const gridVertexShader = `
varying vec2 vUv;
varying vec3 vPos;
void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const gridFragmentShader = `
uniform float uTime;
varying vec2 vUv;
varying vec3 vPos;

void main() {
    // Scrolling UVs
    vec2 gridUv = vUv * 50.0;
    gridUv.y += uTime * 2.0;

    // Grid lines
    vec2 grid = abs(fract(gridUv - 0.5) - 0.5) / fwidth(gridUv);
    float line = min(grid.x, grid.y);
    float alpha = 1.0 - min(line, 1.0);

    // Color
    vec3 color = vec3(0.0, 1.0, 1.0); // Cyan base
    
    // Distance fade (circular)
    float dist = distance(vUv, vec2(0.5));
    float fade = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Pulse effect
    float pulse = 0.5 + 0.5 * sin(uTime + vUv.y * 10.0);
    
    gl_FragColor = vec4(color * pulse, alpha * fade * 0.5);
}
`;

const GeodeGrid = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
            <planeGeometry args={[60, 60]} />
            <shaderMaterial
                ref={materialRef}
                transparent
                vertexShader={gridVertexShader}
                fragmentShader={gridFragmentShader}
                uniforms={useMemo(() => ({ uTime: { value: 0 } }), [])}
                side={THREE.DoubleSide}
                depthWrite={false}
            />
        </mesh>
    );
};

// --- 9. SCANNING HUD ---
const ScanningHUD = () => {
    const [scannedPct, setScannedPct] = React.useState(0);
    const [textFrame, setTextFrame] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setScannedPct(prev => (prev < 100 ? prev + 0.5 : 0));
            setTextFrame(prev => prev + 1);
        }, 30); // Faster updates
        return () => clearInterval(interval);
    }, []);

    const glitchText = textFrame % 10 === 0 ? "ERR_#X9F" : "ANALYSIS_IN_PROGRESS";

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-40">
            <div className="absolute inset-0 border border-teal-500/30 rounded-full animate-spin-slow-reverse" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-4 border border-purple-500/20 rounded-full animate-spin-slow" style={{ animationDuration: '12s' }} />
            <div className="absolute top-0 left-1/2 w-[2px] h-4 bg-teal-500" />
            <div className="absolute bottom-0 left-1/2 w-[2px] h-4 bg-teal-500" />
            <div className="absolute left-0 top-1/2 w-4 h-[2px] bg-teal-500" />
            <div className="absolute right-0 top-1/2 w-4 h-[2px] bg-teal-500" />

            {/* Scanning Text */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-teal-400 font-mono text-xs tracking-widest bg-black/50 px-2 py-1">
                {glitchText}: {scannedPct.toFixed(1)}%
            </div>
        </div>
    );
};

import { audioService } from '../../services/audioService';

import { NonEuclideanGeodeCutscene } from '../cutscenes/NonEuclideanGeodeCutscene';

export const NonEuclideanGeodeHTMLView: React.FC<Props> = ({ onClose }) => {
    const [showCutscene, setShowCutscene] = React.useState(true);

    React.useEffect(() => {
        // Only start ambience after cutscene is done
        if (!showCutscene) {
            audioService.startNonEuclideanAmbience();
        }
        return () => {
            audioService.stopNonEuclideanAmbience();
        };
    }, [showCutscene]);

    if (showCutscene) {
        return <NonEuclideanGeodeCutscene onComplete={() => setShowCutscene(false)} />;
    }

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: 'black', overflow: 'hidden' }}>
            <Canvas camera={{ position: [0, 0, 14], fov: 45 }}>
                <PerspectiveCamera makeDefault position={[0, 0, 14]} />
                <NebulaBackground />
                <Stars radius={100} depth={50} count={9000} factor={4} saturation={1} fade speed={0.2} />

                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#ff00ff" />
                <pointLight position={[-10, -10, -10]} intensity={2} color="#00ffff" />
                <pointLight position={[0, 5, 0]} intensity={1} color="#ffffff" />

                <GeodeMesh />
                <SacredGeometry />
                <OrbitalRings />
                <PointShell />
                <ContainmentField />
                <EnergyBeams />
                <AncientRunes />
                <GeodeGrid />

                <EffectComposer>
                    <ChromaticAberration
                        offset={new THREE.Vector2(0.003, 0.003)}
                        radialModulation={false}
                        modulationOffset={0}
                    />
                    <Noise opacity={0.08} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI} minPolarAngle={0} />
            </Canvas>

            {/* Overlay UI */}
            <ScanningHUD />
            <div className="absolute top-8 left-8 z-10 pointer-events-none">
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)] tracking-widest uppercase" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    Non-Euclidean Geode
                </h1>
                <div className="mt-2 space-y-1">
                    <div className="text-sm md:text-base text-cyan-200 font-mono tracking-[0.2em] uppercase opacity-80 flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                        Class: Spatial Anomaly
                    </div>
                    <div className="text-xs md:text-sm text-purple-300 font-mono tracking-[0.2em] uppercase opacity-60">
                        1 in 750,000,000
                    </div>
                </div>
            </div>

            {/* Decorative HUD Elements */}
            <div className="absolute bottom-8 left-8 space-y-2 font-mono text-xs text-teal-500/50 pointer-events-none">
                <div>COORD: [NaN, NaN, NaN]</div>
                <div>FLUX: UNSTABLE</div>
                <div className="text-[10px] opacity-70">
                    ERR: GEOMETRY_VIOLATION_DETECTED
                </div>
            </div>

            <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-purple-500/30 rounded-br-3xl pointer-events-none" />
        </div>
    );
};
