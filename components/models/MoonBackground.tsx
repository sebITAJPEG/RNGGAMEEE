import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const MoonMesh = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    
    // Load texture
    const texture = useLoader(THREE.TextureLoader, '/lroc_color_poles_1k.jpg');

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.02;
        }
        if (glowRef.current) {
            glowRef.current.rotation.y = clock.getElapsedTime() * 0.02;
        }
    });

    return (
        <group>
            {/* Main Moon */}
            <mesh ref={meshRef} rotation={[0.2, 0, 0]}>
                <sphereGeometry args={[3.2, 128, 128]} />
                <meshStandardMaterial 
                    map={texture}
                    displacementMap={texture}
                    displacementScale={0.05}
                    color="#ffffff" 
                    roughness={0.8}
                    metalness={0.1}
                />
            </mesh>
            
            {/* Atmosphere Glow */}
            <mesh ref={glowRef} position={[0, 0, -0.5]}>
                 <sphereGeometry args={[3.35, 64, 64]} />
                 <meshBasicMaterial 
                    color="#6666ff"
                    transparent
                    opacity={0.2}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                 />
            </mesh>
        </group>
    );
};

interface Props {
    isVisible: boolean;
}

export const MoonBackground: React.FC<Props> = ({ isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 600, opacity: 0, rotate: -20 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 600, opacity: 0, rotate: 20 }}
                    transition={{ 
                        duration: 2.0, 
                        type: "spring", 
                        stiffness: 40, 
                        damping: 20 
                    }}
                    // Increased size to prevent cropping
                    className="fixed -bottom-48 -left-48 w-[800px] h-[800px] z-0 pointer-events-none"
                >
                    <Canvas camera={{ position: [0, 0, 14], fov: 45 }} gl={{ alpha: true, antialias: true }}>
                        <ambientLight intensity={0.2} />
                        <directionalLight position={[5, 3, 5]} intensity={2.0} color="#ffeecc" />
                        <pointLight position={[-10, -5, 5]} intensity={0.5} color="#4444ff" />
                        <Suspense fallback={null}>
                            <MoonMesh />
                        </Suspense>
                    </Canvas>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
