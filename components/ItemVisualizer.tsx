import React, { useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import {
  OrbitControls,
  Float,
  Stars,
  Sparkles,
  MeshTransmissionMaterial,
  MeshDistortMaterial,
  Icosahedron,
  Octahedron,
  Torus,
  Sphere,
  Line,
  shaderMaterial
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { RarityId, ItemData, VariantId } from '../types';
import { RARITY_TIERS, VARIANTS, ORES, GOLD_ORES } from '../constants';

// --- SHADER DEFINITION ---

// Custom Liquid Shader Material
const LiquidShaderMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(1.0, 0.8, 0.0), // Golden yellow base
    rimColor: new THREE.Color(1.0, 1.0, 0.8), // Brighter rim
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform vec3 color;
    uniform vec3 rimColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    // Simple noise function
    float random (in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // 2D Noise based on Morgan McGuire @morgan3d
    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    void main() {
      // Distort UVs over time to create "swirl"
      vec2 distortedUv = vUv + vec2(
          noise(vUv * 3.0 + time * 0.5),
          noise(vUv * 3.0 - time * 0.3)
      ) * 0.1;

      // Create a liquid-like pattern
      float n = noise(distortedUv * 5.0 + time);
      
      // Fresnel effect for rim lighting
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0);

      // Combine color, noise pattern, and rim light
      vec3 finalColor = mix(color, color * 1.2, n); 
      finalColor = mix(finalColor, rimColor, fresnel);

      gl_FragColor = vec4(finalColor, 0.95); 
    }
  `
);

// Register the shader so it can be used as a JSX element
extend({ LiquidShaderMaterial });

// --- 3D COMPONENTS ---

const BlackHoleModel = () => {
  const particlesCount = 1500;
  const particlesRef = useRef<THREE.Points>(null);
  const ringRef1 = useRef<THREE.Group>(null);
  const ringRef2 = useRef<THREE.Group>(null);

  // Generate spiral particles for accretion disk
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.2 + Math.random() * 2.5 + Math.pow(Math.random(), 3) * 2;
      const y = (Math.random() - 0.5) * 0.15 * (radius * 0.5);

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (particlesRef.current) particlesRef.current.rotation.y = -t * 0.2;
    if (ringRef1.current) {
      ringRef1.current.rotation.z = t * 0.1;
      ringRef1.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.05;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -t * 0.15;
      ringRef2.current.rotation.x = Math.PI / 2 + Math.cos(t * 0.3) * 0.05;
    }
  });

  return (
    <group>
      <Sphere args={[0.8, 64, 64]}><meshBasicMaterial color="#000000" /></Sphere>
      <Sphere args={[1.3, 32, 32]}>
        <MeshTransmissionMaterial backside backsideThickness={5} thickness={2} roughness={0} chromaticAberration={0.5} anisotropicBlur={0.1} distortion={1.5} distortionScale={0.5} temporalDistortion={0.1} background={new THREE.Color('#000')} />
      </Sphere>
      <group ref={ringRef1}><Torus args={[1.6, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.1]}><meshBasicMaterial color="#ff6600" transparent opacity={0.8} toneMapped={false} /></Torus></group>
      <group ref={ringRef2}><Torus args={[2.2, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.1]}><meshBasicMaterial color="#ffaa00" transparent opacity={0.4} toneMapped={false} /></Torus></group>
      <points ref={particlesRef}>
        <bufferGeometry><bufferAttribute attach="attributes-position" count={particlePositions.length / 3} array={particlePositions} itemSize={3} /></bufferGeometry>
        <pointsMaterial size={0.04} color="#00aaff" transparent opacity={0.6} blending={THREE.AdditiveBlending} sizeAttenuation={true} toneMapped={false} />
      </points>
      <pointLight color="#ff6600" intensity={5} distance={10} />
    </group>
  );
};

const GoldenRatioModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsCount = 500;
  const spiralPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const phi = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * phi;
    for (let i = 0; i < pointsCount; i++) {
      const t = i / pointsCount;
      const angle = angleIncrement * i;
      const radius = 4 * Math.sqrt(t);
      const x = radius * Math.cos(angle);
      const y = (t - 0.5) * 4;
      const z = radius * Math.sin(angle);
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, []);

  useFrame((state) => {
      if (groupRef.current) {
          groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
          groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.2;
      }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Icosahedron args={[0.8, 0]}>
             <MeshTransmissionMaterial backside samples={16} thickness={1} roughness={0} chromaticAberration={0.6} anisotropy={0.5} distortion={0.4} distortionScale={0.5} temporalDistortion={0.2} color="#ffd700" emissive="#ffbf00" emissiveIntensity={1} />
        </Icosahedron>
      </Float>
      <Line points={spiralPoints} color="#fbbf24" lineWidth={2} transparent opacity={0.4} />
      {spiralPoints.map((point, i) => {
          if (i % 5 !== 0) return null;
          const scale = 0.05 + (i / pointsCount) * 0.1; 
          return <mesh key={i} position={point}><sphereGeometry args={[scale, 8, 8]} /><meshBasicMaterial color="#fde047" /></mesh>
      })}
      <pointLight color="#fbbf24" intensity={2} distance={6} />
      <Sparkles count={50} scale={5} size={4} speed={0.5} opacity={0.5} color="#fef08a" />
    </group>
  );
}

// UPDATED: Now using Custom Shader
const LiquidLuckModel = () => {
  const materialRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.time += delta;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Glass Bottle */}
        <mesh>
            <cylinderGeometry args={[0.5, 0.8, 2, 32]} /> 
            <MeshTransmissionMaterial
                backside
                thickness={0.2}
                roughness={0.05}
                transmission={1}
                ior={1.5}
                chromaticAberration={0.1}
                anisotropy={0.1}
            />
        </mesh>

        {/* Liquid Content */}
        <mesh scale={[0.9, 0.8, 0.9]} position={[0, -0.1, 0]}>
             <cylinderGeometry args={[0.45, 0.75, 1.8, 32]} />
             {/* @ts-ignore */}
             <liquidShaderMaterial 
                ref={materialRef} 
                transparent 
                color={new THREE.Color("#ffd700")} 
                rimColor={new THREE.Color("#fffacd")}
             />
        </mesh>

        <Sparkles count={30} scale={1.5} size={2} speed={0.8} opacity={0.6} color="#fff" position={[0, 0, 0]} />
      </Float>
    </group>
  );
};

const SoundShardModel = () => {
  return (
    <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
        <MeshDistortMaterial color="#6ee7b7" emissive="#10b981" emissiveIntensity={2} distort={0.6} speed={5} toneMapped={false} />
      </mesh>
      <Torus args={[1, 0.02, 16, 32]} rotation={[Math.PI / 2, 0, 0]}><meshBasicMaterial color="#6ee7b7" transparent opacity={0.5} /></Torus>
    </Float>
  );
};

const HypercubeFragmentModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) { coreRef.current.rotation.x = t * 0.5; coreRef.current.rotation.y = t * 0.8; }
    if (innerRef.current) { innerRef.current.rotation.x = t * 0.2; innerRef.current.rotation.z = t * 0.2; }
    if (outerRef.current) { outerRef.current.rotation.y = -t * 0.1; outerRef.current.rotation.z = -t * 0.1; }
    if (groupRef.current) { groupRef.current.position.y = Math.sin(t) * 0.1; }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}><boxGeometry args={[0.8, 0.8, 0.8]} /><meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} roughness={0.1} metalness={1} /></mesh>
      <mesh ref={innerRef}><boxGeometry args={[1.4, 1.4, 1.4]} /><meshBasicMaterial color="#d8b4fe" wireframe transparent opacity={0.5} /></mesh>
      <mesh ref={outerRef}><boxGeometry args={[2, 2, 2]} /><meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.3} /></mesh>
      <Sparkles count={30} scale={4} size={2} speed={0.4} opacity={0.5} color="#a855f7" />
      <pointLight color="#a855f7" intensity={5} distance={5} />
    </group>
  );
};

const FrozenTimeModel = () => {
  return (
    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere args={[0.4, 32, 32]}><meshBasicMaterial color="#ffffff" toneMapped={false} /></Sphere>
      <pointLight color="#06b6d4" intensity={2} distance={3} />
      <Octahedron args={[1.2, 0]}>
        <MeshTransmissionMaterial backside samples={16} thickness={2} roughness={0.1} chromaticAberration={0.5} anisotropy={0.5} distortion={0.5} distortionScale={0.5} temporalDistortion={0.1} color="#cffafe" emissive="#06b6d4" emissiveIntensity={0.2} />
      </Octahedron>
      <group rotation={[Math.PI / 4, 0, 0]}><Torus args={[1.8, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}><meshBasicMaterial color="#06b6d4" transparent opacity={0.4} /></Torus></group>
      <group rotation={[-Math.PI / 4, Math.PI / 4, 0]}><Torus args={[2.2, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}><meshBasicMaterial color="#06b6d4" transparent opacity={0.2} /></Torus></group>
      <Sparkles count={50} scale={4} size={3} speed={0.1} opacity={0.6} color="#cffafe" />
    </Float>
  );
};

const SolarPlasmaModel = () => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere args={[1, 32, 32]}><MeshDistortMaterial color="#f97316" emissive="#ef4444" emissiveIntensity={2} distort={0.4} speed={3} roughness={0} /></Sphere>
      <Sphere args={[1.2, 32, 32]}><meshBasicMaterial color="#eab308" transparent opacity={0.1} side={THREE.BackSide} /></Sphere>
      <Sparkles count={100} scale={3} size={5} speed={0.4} opacity={0.5} color="#fbbf24" />
      <pointLight color="#f97316" intensity={10} distance={10} />
    </Float>
  );
};

const AntimatterModel = () => {
  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={2}>
      <Sphere args={[0.8, 32, 32]}><MeshDistortMaterial color="#000000" emissive="#8b5cf6" emissiveIntensity={1.5} distort={0.8} speed={5} roughness={0.2} /></Sphere>
      <group rotation={[Math.PI / 4, Math.PI / 4, 0]}><Icosahedron args={[1.5, 0]}><meshBasicMaterial color="#4c1d95" wireframe transparent opacity={0.3} /></Icosahedron></group>
      <Sparkles count={80} scale={4} size={2} speed={2} opacity={0.8} color="#d8b4fe" noise={1} />
      <pointLight color="#8b5cf6" intensity={5} distance={8} />
    </Float>
  );
};

const AngelFeatherModel = () => {
  return (
    <Float speed={1} rotationIntensity={1} floatIntensity={2} floatingRange={[0, 0.5]}>
      <group rotation={[0, 0, Math.PI / 4]}>
        <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.02, 0.05, 4.5, 8]} /><meshStandardMaterial color="#e2e8f0" roughness={0.3} /></mesh>
        <mesh position={[0, 0.5, 0]} scale={[1, 1, 0.1]}>
          <coneGeometry args={[1.2, 3.5, 32]} />
          <MeshDistortMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} roughness={0.1} metalness={0.1} distort={0.2} speed={1} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.5, 0]} scale={[0.5, 0.8, 0.2]}><coneGeometry args={[1, 3, 16]} /><meshBasicMaterial color="#fefce8" transparent opacity={0.5} /></mesh>
      </group>
      <Sparkles count={60} scale={4} size={3} speed={0.2} opacity={0.6} color="#fefce8" />
      <Sparkles count={20} scale={3} size={5} speed={0.5} opacity={1} color="#fbbf24" noise={0.5} />
      <pointLight color="#ffffff" intensity={3} distance={6} decay={2} />
    </Float>
  );
};

const LunarDustModel = () => {
  const count = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.5 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} /></bufferGeometry>
        <pointsMaterial size={0.03} color="#e5e7eb" transparent opacity={0.6} sizeAttenuation={true} />
      </points>
      <Sparkles count={50} scale={3} size={2} speed={0.2} opacity={0.4} color="#ffffff" />
      <pointLight color="#ffffff" intensity={2} distance={5} />
    </Float>
  );
};

const MartianSoilModel = () => {
  const count = 1200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return pos;
  }, []);

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} /></bufferGeometry>
        <pointsMaterial size={0.04} color="#c2410c" transparent opacity={0.8} sizeAttenuation={true} />
      </points>
      <Sparkles count={30} scale={3} size={4} speed={0.5} opacity={0.5} color="#ea580c" />
      <pointLight color="#ea580c" intensity={3} distance={6} />
    </Float>
  );
};

const StardustModel = () => {
  return (
    <Float speed={1} rotationIntensity={2} floatIntensity={1}>
      <Sparkles count={200} scale={4} size={6} speed={0.5} opacity={1} color="#fbbf24" />
      <Sparkles count={100} scale={3} size={4} speed={0.8} opacity={0.7} color="#60a5fa" />
      <Sparkles count={50} scale={5} size={8} speed={0.2} opacity={0.5} color="#f472b6" />
      <pointLight color="#fbbf24" intensity={4} distance={8} />
      <pointLight color="#60a5fa" intensity={4} distance={8} position={[2, 2, 2]} />
    </Float>
  );
};

const StandardOreModel = ({ color, intensity }: { color: string, intensity: number }) => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      <mesh>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.8} emissive={color} emissiveIntensity={0.2 + (intensity * 0.05)} />
      </mesh>
      {intensity > 5 && (
        <mesh scale={[1.1, 1.1, 1.1]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.2} />
        </mesh>
      )}
    </Float>
  );
};

const SceneContent: React.FC<{ item: ItemData; color: string; intensity: number }> = ({ item, color, intensity }) => {
  const isBlackHole = item.text === "Black Hole Core";
  const isLiquidLuck = item.text === "Liquid Luck";
  const isSoundShard = item.text === "Sound Shard";
  const isHypercube = item.text === "Hypercube Fragment";
  const isFrozenTime = item.text === "Frozen Time";
  const isSolarPlasma = item.text === "Solar Plasma";
  const isAntimatter = item.text === "Antimatter";
  const isAngelFeather = item.text === "Angel Feather";
  const isLunarDust = item.text === "Lunar Dust";
  const isMartianSoil = item.text === "Martian Soil";
  const isStardust = item.text === "Stardust";
  const isGoldenRatio = item.text === "The Golden Ratio";

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color={color} intensity={2} />

      {isBlackHole ? <BlackHoleModel />
      : isLiquidLuck ? <LiquidLuckModel />
      : isSoundShard ? <SoundShardModel />
      : isHypercube ? <HypercubeFragmentModel />
      : isFrozenTime ? <FrozenTimeModel />
      : isSolarPlasma ? <SolarPlasmaModel />
      : isAntimatter ? <AntimatterModel />
      : isAngelFeather ? <AngelFeatherModel />
      : isLunarDust ? <LunarDustModel />
      : isMartianSoil ? <MartianSoilModel />
      : isStardust ? <StardustModel />
      : isGoldenRatio ? <GoldenRatioModel />
      : <StandardOreModel color={color} intensity={intensity} />}

      {isBlackHole ? (
        <>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <EffectComposer>
            <Bloom luminanceThreshold={0} mipmapBlur intensity={1.5} radius={0.6} />
            <Noise opacity={0.1} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </>
      ) : isGoldenRatio ? (
         <EffectComposer>
            <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.8} />
            <Noise opacity={0.05} />
         </EffectComposer>
      ) : (
        <EffectComposer>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} radius={0.4} />
        </EffectComposer>
      )}

      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={isBlackHole ? 0.5 : 2} />
    </>
  );
};

interface Props {
  item: ItemData & { rarityId: RarityId, variantId?: VariantId };
  onClose: () => void;
}

export const ItemVisualizer: React.FC<Props> = ({ item, onClose }) => {
  const tier = RARITY_TIERS[item.rarityId];
  const variant = VARIANTS[item.variantId || 0]; // Default to NONE
  const hasVariant = (item.variantId ?? 0) !== 0;

  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 50 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const oreData = useMemo(() => {
      return ORES.find(o => o.name === item.text) || GOLD_ORES.find(o => o.name === item.text);
  }, [item.text]);

  const isSpecial = [
    "Black Hole Core", "Liquid Luck", "Sound Shard", "Hypercube Fragment",
    "Frozen Time", "Solar Plasma", "Antimatter", "Angel Feather",
    "Lunar Dust", "Martian Soil", "Stardust", "The Golden Ratio"
  ].includes(item.text);

  const isOre = !!oreData;
  const modelColor = oreData ? oreData.glowColor : '#888';
  const borderClass = hasVariant ? variant.borderClass : tier.color;
  const intensity = (tier.id / 2) + (variant.multiplier > 1 ? 2 : 0);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-md perspective-1000" onClick={onClose}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        // @ts-ignore
        onPointerMove={handlePointerMove}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg h-[600px] rounded-xl border-2 ${borderClass} bg-neutral-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group cursor-default flex flex-col`}
      >
        {(isOre || isSpecial) && (
          <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: false, alpha: true }}>
              <SceneContent item={item} color={modelColor} intensity={intensity} />
            </Canvas>
          </div>
        )}

        <div className="relative z-10 h-full flex flex-col justify-between p-6 pointer-events-none">
          <div className="flex justify-between items-start border-b border-white/10 pb-4 bg-gradient-to-b from-neutral-900/80 to-transparent">
            <div className="text-left">
              <div className={`text-xs font-mono uppercase tracking-widest ${tier.textColor} drop-shadow-md`}>
                {tier.name} // NO.{item.rarityId}
              </div>
              {hasVariant && (
                <div className={`text-xs font-mono uppercase tracking-widest mt-1 ${variant.styleClass.split(' ')[0]}`}>
                  VARIANT: {variant.name}
                </div>
              )}
            </div>
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest border border-neutral-700 px-2 py-1 rounded bg-black/50">
              {isSpecial ? 'ARTIFACT' : 'MATERIAL'}
            </div>
          </div>

          <div className="pt-8 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent pointer-events-auto">
            <h1 className={`text-3xl md:text-4xl font-bold ${tier.textColor} drop-shadow-md mb-2 ${hasVariant ? variant.styleClass : ''}`}>
              {hasVariant ? variant.prefix : ''} {item.text}
            </h1>
            <p className="text-sm font-mono text-neutral-400 leading-relaxed max-w-xs">
              {item.description}
            </p>
            <div className="mt-6 flex gap-2">
              <div className="flex-1 text-[10px] font-mono text-neutral-600 uppercase border-t border-white/10 pt-2">
                ID: {Math.random().toString(36).substring(7).toUpperCase()}
              </div>
              <button onClick={onClose} className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white font-mono text-xs tracking-widest uppercase transition-all border border-neutral-700 hover:border-white">
                CLOSE
              </button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none border-4 border-transparent rounded-xl mix-blend-overlay opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-20" />
        {hasVariant && <div className={`absolute inset-0 pointer-events-none border-2 ${variant.borderClass} opacity-50 z-20`} />}
      </motion.div>
    </div>
  );
};