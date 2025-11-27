import React, { useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Stars,
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { RarityId, ItemData, VariantId } from '../types';
import { RARITY_TIERS, VARIANTS, ORES, GOLD_ORES, SPECIAL_HTML_ITEMS } from '../constants';

// Import all localized models
import { BlackHoleModel } from './models/BlackHoleModel';
// Removed LiquidLuckModel import
// Removed SoundShardModel as it's replaced by HTML view
import { StandardOreModel } from './models/StandardOreModel';
import { HtmlModelView } from './models/HtmlModelView'; // Generic HTML View
import { SolarPlasmaHTMLView } from './models/SolarPlasmaHTMLView';
import { GoldenRatioHTMLView } from './models/GoldenRatioHTMLView';
import { NeutroniumHTMLView } from './models/NeutroniumHTMLView';
import { CrystallizedThoughtHTMLView } from './models/CrystallizedThoughtHTMLView';
import { HypercubeFragmentHTMLView } from './models/HypercubeFragmentHTMLView';
import { SoundShardHTMLView } from './models/SoundShardHTMLView';
import { AntimatterHTMLView } from './models/AntimatterHTMLView';
import { DarkMatterHTMLView } from './models/DarkMatterHTMLView';
import { FrozenTimeHTMLView } from './models/FrozenTimeHTMLView'; // Add Frozen Time
import { SolidLightHTMLView } from './models/SolidLightHTMLView';
import { StrangeMatterHTMLView } from './models/StrangeMatterHTMLView';
import { TheSpectrumHTMLView } from './models/TheSpectrumHTMLView';

// --- SCENE CONTENT ---

const SceneContent: React.FC<{ item: ItemData; color: string; intensity: number }> = ({ item, color, intensity }) => {
  const isBlackHole = item.text === "Black Hole Core";
  // Removed LiquidLuck Logic

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color={color} intensity={2} />

      {isBlackHole ? <BlackHoleModel />
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

  const isSpecial = SPECIAL_HTML_ITEMS.includes(item.text);

  // Special HTML Views
  const isSolarPlasma = item.text === "Solar Plasma";
  const isGoldenRatio = item.text === "The Golden Ratio";
  const isNeutronium = item.text === "Neutronium";
  const isCrystallizedThought = item.text === "Crystallized Thought";
  const isHypercubeFragment = item.text === "Hypercube Fragment";
  const isSoundShard = item.text === "Sound Shard";
  const isAntimatter = item.text === "Antimatter";
  const isDarkMatter = item.text === "Dark Matter";
  const isFrozenTime = item.text === "Frozen Time";
  const isSolidLight = item.text === "Solid Light";
  const isStrangeMatter = item.text === "Strange Matter";
  const isTheSpectrum = item.text === "The Spectrum";
  
  const isHtmlView = isSpecial; // Assume all special items are HTML views now
  // @ts-ignore - isFullScreen might not be in ItemData type definition yet but passed from App
  const isFullScreen = isHtmlView && (item.isFullScreen !== false);

  const isOre = !!oreData;
  const modelColor = oreData ? oreData.glowColor : '#888';
  const borderClass = hasVariant ? variant.borderClass : tier.color;
  const intensity = (tier.id / 2) + (variant.multiplier > 1 ? 2 : 0);

  const containerClasses = isFullScreen
    ? "fixed inset-0 w-full h-full z-[100] bg-black"
    : `relative w-full max-w-lg h-[600px] rounded-xl border-2 ${borderClass} bg-neutral-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group cursor-default flex flex-col`;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-md perspective-1000" onClick={onClose}>
      <motion.div
        ref={ref}
        style={!isFullScreen ? { rotateX, rotateY, transformStyle: "preserve-3d" } : {}}
        // @ts-ignore
        onPointerMove={!isFullScreen ? handlePointerMove : undefined}
        onMouseLeave={!isFullScreen ? handleMouseLeave : undefined}
        onClick={(e) => e.stopPropagation()}
        className={containerClasses}
      >
        {isFullScreen && (
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-[110] text-white/50 hover:text-white text-2xl font-bold p-2 bg-black/20 hover:bg-black/50 rounded-full transition-colors w-10 h-10 flex items-center justify-center"
            >
                ✕
            </button>
        )}

        {(isOre || isSpecial) && (
          <div className="absolute inset-0 z-0">
            {isSolarPlasma ? (
              <SolarPlasmaHTMLView />
            ) : isGoldenRatio ? (
              <GoldenRatioHTMLView />
            ) : isNeutronium ? (
              <NeutroniumHTMLView />
            ) : isCrystallizedThought ? (
              <CrystallizedThoughtHTMLView />
            ) : isHypercubeFragment ? (
              <HypercubeFragmentHTMLView />
            ) : isSoundShard ? (
              <SoundShardHTMLView />
            ) : isAntimatter ? (
              <AntimatterHTMLView />
            ) : isDarkMatter ? (
              <DarkMatterHTMLView />
            ) : isFrozenTime ? (
              <FrozenTimeHTMLView />
            ) : isSolidLight ? (
              <SolidLightHTMLView />
            ) : isStrangeMatter ? (
              <StrangeMatterHTMLView />
            ) : isTheSpectrum ? (
              <TheSpectrumHTMLView />
            ) : (
              <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: false, alpha: true }}>
                <SceneContent item={item} color={modelColor} intensity={intensity} />
              </Canvas>
            )}
          </div>
        )}

        {/* UI Overlay - HIDDEN if using a full HTML view which has its own UI */}
        {!isHtmlView && (
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
        )}

        {/* Default Effects Overlay - HIDDEN if using HTML view */}
        {!isHtmlView && (
          <>
            <div className="absolute inset-0 pointer-events-none border-4 border-transparent rounded-xl mix-blend-overlay opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-20" />
            {hasVariant && <div className={`absolute inset-0 pointer-events-none border-2 ${variant.borderClass} opacity-50 z-20`} />}
          </>
        )}
      </motion.div>
    </div>
  );
};
