
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RarityId } from '../types';
import { audioService } from '../services/audioService';

interface Props {
  text: string;
  rarityId: RarityId;
  cutscenePhrase?: string;
  onComplete: () => void;
}

// --- HELPERS ---

// Helper to generate random particles
const useParticles = (count: number) => {
    return useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1,
            duration: Math.random() * 2 + 1,
            delay: Math.random() * 2
        }));
    }, [count]);
};

export const Cutscene: React.FC<Props> = ({ text, rarityId, cutscenePhrase, onComplete }) => {
  const [stage, setStage] = useState(0);
  const [shake, setShake] = useState(0);
  
  // Refs for effects
  const requestRef = useRef<number>(0);

  useEffect(() => {
    // Safety wrapper for audio
    try {
        audioService.playCutsceneAmbience(rarityId);
    } catch (e) {
        console.error("Audio playback failed", e);
    }

    // Timing logic
    let times = [1500, 3500, 6500, 8000];
    
    if (rarityId >= RarityId.THE_ONE) {
        // Extended cuts for the insane tiers
        times = [2000, 5000, 9000, 12000]; 
    }

    const t1 = setTimeout(() => { setStage(1); setShake(5); }, times[0]);
    const t2 = setTimeout(() => { setStage(2); setShake(20); }, times[1]);
    const t3 = setTimeout(() => setStage(3), times[2]);
    const t4 = setTimeout(() => onComplete(), times[3]);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [onComplete, rarityId]);

  const phrase = cutscenePhrase || "RARE DROP";
  const particles = useParticles(40);

  const CinematicBars = () => (
      <>
        <motion.div initial={{ height: 0 }} animate={{ height: "12vh" }} className="absolute top-0 left-0 w-full bg-black z-[150]" />
        <motion.div initial={{ height: 0 }} animate={{ height: "12vh" }} className="absolute bottom-0 left-0 w-full bg-black z-[150]" />
      </>
  );

  // --- PRIMORDIAL (Magma) ---
  if (rarityId === RarityId.PRIMORDIAL) {
    return (
      <motion.div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden font-mono text-white">
        <CinematicBars />
        <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ x: [0, -shake, shake, 0], y: [0, shake, -shake, 0] }}
            transition={{ duration: 0.1, repeat: Infinity }}
        >
            <motion.div 
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-600 via-red-950 to-black"
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <svg className="absolute inset-0 w-full h-full opacity-30 mix-blend-color-dodge" xmlns="http://www.w3.org/2000/svg">
                <filter id="turbulence"><feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" /><feDisplacementMap in="SourceGraphic" scale="20" /></filter>
                <motion.rect width="100%" height="100%" fill="transparent" stroke="orange" strokeWidth="2" filter="url(#turbulence)" animate={{ strokeWidth: [1, 3, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 0.5, repeat: Infinity }} />
            </svg>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute bg-orange-400 rounded-full mix-blend-screen blur-[1px]"
                    style={{ left: `${p.x}%`, bottom: "-10%", width: p.size, height: p.size }}
                    animate={{ y: "-120vh", opacity: [0, 1, 0], scale: [1, 0] }}
                    transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
                />
            ))}
            <AnimatePresence>
                {stage === 1 && (
                    <motion.div initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }} className="relative z-20 text-4xl md:text-6xl font-black text-orange-100 tracking-[0.2em] uppercase text-center drop-shadow-[0_0_30px_rgba(255,100,0,1)]">
                        {phrase}
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {stage >= 2 && (
                    <motion.div className="relative z-20 flex flex-col items-center px-4" initial={{ scale: 0.8, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}>
                        <motion.div className="text-sm text-orange-500 font-bold tracking-[1em] mb-6 border-b-2 border-orange-500 pb-2 uppercase" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.5, duration: 0.5 }}>
                            <span className="whitespace-nowrap">Primordial Artifact</span>
                        </motion.div>
                        <motion.div className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-orange-200 to-orange-500 text-center" style={{ textShadow: "0 0 50px rgba(255, 69, 0, 0.8)" }} animate={{ filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] }} transition={{ repeat: Infinity, duration: 2 }}>
                            {text}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
      </motion.div>
    );
  }

  // --- INFINITE (Speed) ---
  if (rarityId === RarityId.INFINITE) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden font-sans">
        <CinematicBars />
        <motion.div className="absolute inset-0 perspective-[500px]" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.1, repeat: Infinity }}>
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_355deg,white_360deg)] opacity-10 animate-[spin_0.5s_linear_infinite]" />
            <motion.div className="absolute inset-[-50%] bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:50px_50px] opacity-50" animate={{ scale: [1, 3], opacity: [0.5, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }} />
        </motion.div>
        <motion.div className="absolute top-1/2 left-0 w-full h-1 bg-cyan-400 blur-md mix-blend-screen" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.2 }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] z-10" />
        <AnimatePresence>
            {stage === 1 && (
                 <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 10, opacity: 0 }} transition={{ duration: 1.5, ease: "easeIn" }} className="relative z-20 text-6xl font-black tracking-tighter text-white uppercase whitespace-nowrap mix-blend-overlay">
                    {phrase}
                </motion.div>
            )}
        </AnimatePresence>
        <AnimatePresence>
            {stage >= 2 && (
                <motion.div className="relative z-20 text-center">
                    <motion.div initial={{ scale: 5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 20, stiffness: 100 }} className="relative">
                        <motion.h1 className="absolute top-0 left-0 w-full text-6xl md:text-9xl font-bold text-red-500 mix-blend-screen opacity-80" animate={{ x: [-4, 4], opacity: [0.5, 0.8] }} transition={{ repeat: Infinity, duration: 0.05 }}>{text}</motion.h1>
                        <motion.h1 className="absolute top-0 left-0 w-full text-6xl md:text-9xl font-bold text-blue-500 mix-blend-screen opacity-80" animate={{ x: [4, -4], opacity: [0.5, 0.8] }} transition={{ repeat: Infinity, duration: 0.05 }}>{text}</motion.h1>
                        <h1 className="text-6xl md:text-9xl font-bold text-white drop-shadow-[0_0_50px_cyan] relative z-10 italic tracking-tighter">{text}</h1>
                    </motion.div>
                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-8 shadow-[0_0_20px_cyan]" />
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    );
  }

  // --- CHAOS (Glitch) ---
  if (rarityId === RarityId.CHAOS) {
    return (
      <div className="fixed inset-0 z-[100] bg-neutral-950 flex items-center justify-center overflow-hidden font-mono">
         {/* Stage 0: Noise/Build Up */}
         {stage === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-fuchsia-500 font-mono text-xs animate-pulse tracking-widest">INITIALIZING_ENTROPY...</div>
            </div>
         )}
         
         {/* Glitch Background - Lower Z-Index to not cover text */}
         <motion.div 
            className="absolute inset-0 bg-white mix-blend-difference z-0" 
            animate={{ opacity: [0, 1, 0, 0, 1, 0] }} 
            transition={{ duration: 0.2, repeat: Infinity, times: [0, 0.1, 0.2, 0.8, 0.9, 1] }} 
         />
         
         <div className="relative z-20 w-full flex justify-center pointer-events-none">
            <AnimatePresence>
                {stage === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-4xl md:text-6xl font-black bg-white text-black px-12 py-4 transform -skew-x-12 border-4 border-fuchsia-600 shadow-[10px_10px_0_#d946ef]">
                        {phrase}
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {stage >= 2 && (
                    <motion.div initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full text-center">
                        {/* Multiple layers of text for glitch effect */}
                        <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none" animate={{ clipPath: ["inset(0 0 0 0)", "inset(20% 0 40% 0)", "inset(0 0 0 0)", "inset(60% 0 10% 0)"] }} transition={{ duration: 0.1, repeat: Infinity }}>
                             <h1 className="text-6xl md:text-8xl font-black text-red-500 absolute transform translate-x-2 mix-blend-exclusion opacity-70">{text}</h1>
                        </motion.div>
                        <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none" animate={{ clipPath: ["inset(0 0 0 0)", "inset(40% 0 20% 0)", "inset(0 0 0 0)"] }} transition={{ duration: 0.15, repeat: Infinity }}>
                             <h1 className="text-6xl md:text-8xl font-black text-blue-500 absolute transform -translate-x-2 mix-blend-exclusion opacity-70">{text}</h1>
                        </motion.div>
                        
                        {/* Main Text - Ensure High Contrast */}
                        <div className="text-6xl md:text-8xl font-black text-white relative z-30 drop-shadow-[0_0_10px_rgba(255,255,255,1)]">
                            {text}
                        </div>
                        
                        <div className="absolute top-full w-full text-center mt-8">
                             <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.05, repeat: Infinity }} className="text-fuchsia-500 font-mono bg-black inline-block px-2">ERR_REALITY_OVERFLOW :: 0x94F2</motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
         </div>
      </div>
    );
  }

  // --- THE ONE (Ascension) ---
  if (rarityId === RarityId.THE_ONE) {
      return (
        <motion.div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden font-mono bg-black">
            {/* Stage 0: Loading State to prevent black screen */}
            {stage === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                        animate={{ opacity: [0.2, 1, 0.2] }} 
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-green-500 font-mono text-xs tracking-[0.5em]"
                    >
                        OVERRIDING_SYSTEM_CORE...
                    </motion.div>
                </div>
            )}

            {stage < 2 && (
                <motion.div className="absolute inset-0 z-50 bg-white pointer-events-none" initial={{ opacity: 0 }} animate={stage === 1 ? { opacity: [0, 0.1, 0] } : {}} />
            )}
            {stage === 2 && (
                <motion.div className="absolute inset-0 bg-white z-50 pointer-events-none" initial={{ scale: 0, borderRadius: "100%" }} animate={{ scale: [0, 20], opacity: [1, 1, 0] }} transition={{ duration: 1.5, ease: "circIn" }} />
            )}
            {stage >= 2 && (
                <motion.div className="absolute inset-0 bg-white z-10 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-[50vw] h-[50vw] border border-black rounded-full border-dashed" />
                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute w-[40vw] h-[40vw] border border-black rounded-full" />
                    </div>
                    <motion.div className="relative z-20 text-center p-10">
                         <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
                            <div className="text-xs text-neutral-500 tracking-[2em] uppercase mb-12 text-center w-full flex justify-center"><span>Simulation Complete</span></div>
                            <h1 className="text-6xl md:text-9xl font-black text-black tracking-tighter drop-shadow-2xl scale-110">{text}</h1>
                         </motion.div>
                         <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.5, duration: 1.5 }} className="w-full h-[1px] bg-gradient-to-r from-transparent via-black to-transparent mt-12" />
                    </motion.div>
                </motion.div>
            )}
            <AnimatePresence>
                {stage === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-20 text-xl md:text-2xl text-green-500 font-bold font-mono bg-black p-4 border border-green-900 shadow-[0_0_20px_#22c55e]">
                        <div className="flex flex-col gap-1">
                            {['INITIALIZING_FINAL_SEQUENCE...', 'DECRYPTING_REALITY...', 'BYPASSING_PHYSICS_ENGINE...', 'ACCESSING_CORE...'].map((line, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.4 }}>{'>'} {line}</motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
      )
  }

  return null;
};
