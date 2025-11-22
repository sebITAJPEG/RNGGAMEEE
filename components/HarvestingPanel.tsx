
import React, { useState, useRef, useEffect } from 'react';
import { Plant } from '../types';

interface Props {
    onHarvest: () => void;
    lastBatch: Plant[];
    totalHarvested: number;
    isAutoHarvesting: boolean;
    onToggleAuto: () => void;
    onOpenInventory: () => void;
}

interface FloatingText {
    id: number;
    x: number;
    y: number;
    text: string;
    color: string;
}

export const HarvestingPanel: React.FC<Props> = ({
    onHarvest, lastBatch, totalHarvested, isAutoHarvesting, onToggleAuto, onOpenInventory
}) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
    const clickCount = useRef(0);

    // Cleanup floating text
    useEffect(() => {
        const t = setInterval(() => {
            if (floatingTexts.length > 0) {
                setFloatingTexts(prev => prev.slice(1));
            }
        }, 500);
        return () => clearInterval(t);
    }, [floatingTexts.length]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 150);
        onHarvest();

        // Add floating text effect
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left + (Math.random() * 20 - 10);
        const y = e.clientY - rect.top;

        const id = clickCount.current++;
        setFloatingTexts(prev => [
            ...prev,
            { id, x, y, text: "SNIP!", color: "text-green-300" }
        ]);
    };

    return (
        <div className="h-full w-full border-l border-surface-highlight bg-background/40 backdrop-blur-sm flex flex-col p-6 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 z-10">
                <div>
                    <h2 className="text-lg font-mono font-bold text-green-400 tracking-widest">BIO_LABS</h2>
                    <div className="text-[10px] text-green-800 font-mono">HYDROPONICS BAY</div>
                </div>
                <button
                    onClick={onOpenInventory}
                    className="text-[10px] font-mono border border-green-900 px-2 py-1 bg-green-950/30 hover:bg-green-900 text-green-400 hover:text-white transition-colors"
                >
                    GREENHOUSE
                </button>
            </div>

            {/* The Plant */}
            <div className="flex-1 flex flex-col items-center justify-center z-10 min-h-[200px]">
                <div className="relative">
                    <button
                        onClick={handleClick}
                        className={`
                        relative group cursor-pointer outline-none transition-transform duration-300 select-none
                        ${isAnimating ? 'scale-90 rotate-3' : 'scale-100 hover:scale-105'}
                    `}
                    >
                        <pre className="font-mono text-[8px] leading-[8px] md:text-[10px] md:leading-[10px] text-green-600 group-hover:text-green-400 transition-colors whitespace-pre text-center">
                            {`
      ,.,
    ,\`   \`,
   ;       ;
   ;  ,.,  ;
    ;\`   \`;
     ;   ;
    ;     ;
   ;   |   ;
  ;    |    ;
 ;     |     ;
;      |      ;
 \`----.|.----'
      | |
    __| |__
   |_______|
`}
                        </pre>

                        {/* Cut Effect */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className={`w-full h-[1px] bg-white/50 transition-all duration-100 ${isAnimating ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`} />
                        </div>
                    </button>

                    {/* Floating Text Layer */}
                    {floatingTexts.map(ft => (
                        <div
                            key={ft.id}
                            className={`absolute pointer-events-none font-mono font-bold text-xs ${ft.color} animate-float-up`}
                            style={{ left: ft.x, top: ft.y }}
                        >
                            {ft.text}
                        </div>
                    ))}
                </div>

                {/* Last Harvested Batch Display */}
                <div className="mt-8 min-h-[6rem] flex flex-col items-center justify-center w-full">
                    {lastBatch.length > 0 ? (
                        <div key={totalHarvested} className="animate-fade-in-up w-full flex flex-col gap-2 items-center">
                            {lastBatch.map((plant, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-background/40 p-2 rounded border border-green-900 w-full max-w-[240px]" style={{ animationDelay: `${idx * 0.05}s` }}>
                                    <div className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface border border-surface-highlight min-w-[40px] text-center ${plant.color.replace('text-', 'text-')}`}>
                                        {plant.tierName}
                                    </div>
                                    <div className={`text-sm font-bold ${plant.color} truncate flex-1 text-left`} style={{ textShadow: `0 0 5px ${plant.glowColor}44` }}>
                                        {plant.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className="text-xs text-green-900 font-mono animate-pulse">SOWING SEEDS...</span>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="mt-auto space-y-4 z-10">
                <div className="flex justify-between text-[10px] font-mono text-green-700">
                    <span>TOTAL HARVEST</span>
                    <span className="text-green-300">{totalHarvested.toLocaleString()}</span>
                </div>

                <button
                    onClick={(e) => handleClick(e)}
                    className="w-full py-3 bg-green-950/30 hover:bg-green-900/50 border border-green-800 text-green-400 font-mono font-bold tracking-widest hover:text-white transition-all active:scale-95"
                >
                    HARVEST
                </button>

                <button
                    onClick={onToggleAuto}
                    className={`
                    w-full py-2 border text-[10px] font-mono font-bold tracking-widest transition-all
                    ${isAutoHarvesting
                            ? 'bg-lime-900/20 border-lime-500 text-lime-400 animate-pulse'
                            : 'bg-transparent border-surface-highlight text-text-dim hover:border-green-900 hover:text-green-500'
                        }
                `}
                >
                    {isAutoHarvesting ? 'AUTO-HARVEST ACTIVE' : 'ENABLE AUTO-HARVEST'}
                </button>
            </div>

            {/* Background Noise/Vines */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-900/10 pointer-events-none" />

            <style>{`
            @keyframes floatUp {
                0% { opacity: 1; transform: translateY(0) scale(1); }
                100% { opacity: 0; transform: translateY(-30px) scale(1.2); }
            }
            .animate-float-up {
                animation: floatUp 0.5s ease-out forwards;
            }
        `}</style>
        </div>
    );
};