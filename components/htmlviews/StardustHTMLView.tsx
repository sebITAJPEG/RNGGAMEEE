import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { motion } from 'framer-motion';

const StardustParticles = ({ count = 2000 }) => {
    const mesh = useRef<THREE.Points>(null!);
    const lightRef = useRef<THREE.PointLight>(null!);

    const particles = useMemo(() => {
        const temp = [];
        const colors = [];
        // Golden/Stellar colors
        const colorPalette = [
            new THREE.Color('#fef9c3'), // yellow-100
            new THREE.Color('#fbbf24'), // amber-400
            new THREE.Color('#f59e0b'), // amber-500
            new THREE.Color('#ffffff'), // white
            new THREE.Color('#e0f2fe'), // sky-100 (faint blue star tint)
        ];

        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const x = (Math.random() - 0.5) * 10;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 10;

            temp.push(x, y, z);

            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors.push(color.r, color.g, color.b);
        }
        return { positions: new Float32Array(temp), colors: new Float32Array(colors) };
    }, [count]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (mesh.current) {
            mesh.current.rotation.y = time * 0.05;
            mesh.current.rotation.x = Math.sin(time * 0.1) * 0.1;
        }
        if (lightRef.current) {
            lightRef.current.intensity = 1 + Math.sin(time * 2) * 0.5;
        }
    });

    return (
        <>
            <pointLight ref={lightRef} position={[0, 0, 0]} color="#fbbf24" distance={5} decay={2} />
            <points ref={mesh}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particles.positions.length / 3}
                        array={particles.positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={particles.colors.length / 3}
                        array={particles.colors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.05}
                    vertexColors
                    transparent
                    opacity={0.8}
                    sizeAttenuation
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </>
    );
};

const ConnectingLines = () => {
    const linesRef = useRef<THREE.LineSegments>(null!);
    // Create a few random lines to simulate constellations or connections
    const { positions } = useMemo(() => {
        const pos = [];
        for (let i = 0; i < 50; i++) {
            const x1 = (Math.random() - 0.5) * 8;
            const y1 = (Math.random() - 0.5) * 8;
            const z1 = (Math.random() - 0.5) * 8;

            // Connect to a nearby point
            const x2 = x1 + (Math.random() - 0.5) * 2;
            const y2 = y1 + (Math.random() - 0.5) * 2;
            const z2 = z1 + (Math.random() - 0.5) * 2;

            pos.push(x1, y1, z1);
            pos.push(x2, y2, z2);
        }
        return { positions: new Float32Array(pos) };
    }, []);

    useFrame((state) => {
        if (linesRef.current) {
            linesRef.current.rotation.y = -state.clock.getElapsedTime() * 0.02;
        }
    });

    return (
        <lineSegments ref={linesRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color="#ffffff" transparent opacity={0.1} />
        </lineSegments>
    )
}

interface Props {
    onClose?: () => void;
    showHud?: boolean;
}

export const StardustHTMLView: React.FC<Props> = ({ onClose, showHud = true }) => {
    return (
        <div className={`inset-0 z-0 font-sans text-white overflow-hidden ${showHud ? 'fixed z-[100] bg-black' : 'absolute w-full h-full bg-black/90'}`}>
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;500;700&display=swap');
          .font-orbitron { font-family: 'Orbitron', sans-serif; }
          .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
          .glass-panel {
             background: rgba(20, 10, 0, 0.4);
             border: 1px solid rgba(251, 191, 36, 0.3);
             border-left: 2px solid #fbbf24;
             backdrop-filter: blur(4px);
             box-shadow: 0 0 20px rgba(251, 191, 36, 0.1);
          }
        `}
            </style>

            {/* BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 6], fov: 60 }} gl={{ antialias: false }}>
                    <color attach="background" args={['#050505']} />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={0.5} />
                    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                        <StardustParticles />
                    </Float>
                    <ConnectingLines />
                    <EffectComposer>
                        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.6} />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    </EffectComposer>
                </Canvas>
            </div>

            {/* HUD UI CONTAINERS */}
            {showHud && (
                <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-10 pointer-events-none">

                    {/* TOP HEADER */}
                    <div className="flex justify-between items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="glass-panel p-6 rounded-br-3xl min-w-[300px]"
                        >
                            <div className="flex flex-col">
                                <h1 className="font-orbitron text-4xl text-amber-300 tracking-wider font-bold drop-shadow-md">STARDUST</h1>
                                <div className="h-px w-full bg-gradient-to-r from-amber-500 to-transparent my-2" />
                                <div className="flex justify-between font-rajdhani text-lg text-amber-100/80">
                                    <span>ID-064</span>
                                    <span>STELLAR MATTER</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="glass-panel px-4 py-2 rounded-bl-xl"
                        >
                            <div className="font-orbitron text-sm text-green-400 tracking-widest flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                STATUS: STABLE
                            </div>
                        </motion.div>
                    </div>

                    {/* CENTER CONTENT (OPTIONAL OR EMPTY FOR VIEW) */}

                    {/* BOTTOM FOOTER */}
                    <div className="flex justify-between items-end">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="glass-panel p-6 rounded-tr-3xl max-w-md"
                        >
                            <div className="space-y-4">
                                <div>
                                    <div className="font-rajdhani text-xs text-amber-500 tracking-[0.2em] mb-1">DESCRIPTION</div>
                                    <p className="font-rajdhani text-xl text-white leading-tight">
                                        "We are all made of this."
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="font-rajdhani text-xs text-amber-500 tracking-[0.2em]">SPECTRAL ANALYSIS</div>
                                    <div className="flex gap-1 h-2 opacity-80">
                                        <div className="flex-1 bg-amber-600 animate-pulse" />
                                        <div className="flex-[2] bg-yellow-400" />
                                        <div className="flex-1 bg-white" />
                                        <div className="flex-[0.5] bg-blue-300" />
                                    </div>
                                    <div className="flex justify-between font-rajdhani text-xs text-amber-200/60">
                                        <span>He</span>
                                        <span>H</span>
                                        <span>C</span>
                                        <span>Fe</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-t border-amber-900/50 pt-2 mt-2">
                                    <span className="font-rajdhani text-sm text-amber-200">RARITY</span>
                                    <span className="font-orbitron text-amber-400 font-bold">1 in 30,000,000</span>
                                </div>
                            </div>
                        </motion.div>

                        {onClose && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                onClick={onClose}
                                className="pointer-events-auto group relative px-8 py-3 overflow-hidden rounded-full glass-panel hover:bg-amber-900/40 transition-all duration-300"
                            >
                                <span className="relative z-10 font-orbitron text-sm tracking-[0.2em] text-amber-200 group-hover:text-white transition-colors">
                                    RETURN
                                </span>
                                <div className="absolute inset-0 bg-amber-500/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </motion.button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
