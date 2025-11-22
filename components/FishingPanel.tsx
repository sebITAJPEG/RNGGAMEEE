
import React, { useState, useRef, useEffect } from 'react';
import { Fish } from '../types';

interface Props {
    onFish: () => void;
    lastBatch: Fish[];
    totalFished: number;
    isAutoFishing: boolean;
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

export const FishingPanel: React.FC<Props> = ({
    onFish, lastBatch, totalFished, isAutoFishing, onToggleAuto, onOpenInventory
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
        onFish();

        // Add floating text effect
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left + (Math.random() * 20 - 10);
        const y = e.clientY - rect.top;

        const id = clickCount.current++;
        setFloatingTexts(prev => [
            ...prev,
            { id, x, y, text: "SPLASH!", color: "text-cyan-300" }
        ]);
    };

    return (
        <div className="h-full w-full border-l border-surface-highlight bg-background/40 backdrop-blur-sm flex flex-col p-6 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 z-10">
                <div>
                    <h2 className="text-lg font-mono font-bold text-cyan-400 tracking-widest">NET_RUNNING</h2>
                    <div className="text-[10px] text-cyan-800 font-mono">DEEP WEB OCEAN</div>
                </div>
                <button
                    onClick={onOpenInventory}
                    className="text-[10px] font-mono border border-cyan-900 px-2 py-1 bg-cyan-950/30 hover:bg-cyan-900 text-cyan-400 hover:text-white transition-colors"
                >
                    CRYO TANK
                </button>
            </div>

            {/* The Ocean */}
            <div className="flex-1 flex flex-col items-center justify-center z-10 min-h-[200px]">
                <div className="relative">
                    <button
                        onClick={handleClick}
                        className={`
                        relative group cursor-pointer outline-none transition-transform duration-300 select-none
                        ${isAnimating ? 'translate-y-2' : 'translate-y-0 hover:-translate-y-1'}
                    `}
                    >
                        <pre className="font-mono text-[8px] leading-[8px] md:text-[10px] md:leading-[10px] text-cyan-600 group-hover:text-cyan-400 transition-colors whitespace-pre text-center">
                            {`
      _J""L_
  ,-'      \`-.
 /            \\
|              |
|,  .-.  .-.  ,|
| )(__/  \\__)( |
|/     /\\     \\|
(_     ^^     _)
 \\__|IIIIII|__/
  | \\IIIIII/ |
  \\          /
   \`--------\`
`}
                        </pre>

                        {/* Ripple Effect */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className={`w-full h-full border-2 border-cyan-500/30 rounded-full transition-all duration-300 ${isAnimating ? 'scale-150 opacity-0' : 'scale-100 opacity-0'}`} />
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

                {/* Last Fished Batch Display */}
                <div className="mt-8 min-h-[6rem] flex flex-col items-center justify-center w-full">
                    {lastBatch.length > 0 ? (
                        <div key={totalFished} className="animate-fade-in-up w-full flex flex-col gap-2 items-center">
                            {lastBatch.map((fish, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-background/40 p-2 rounded border border-cyan-900 w-full max-w-[240px]" style={{ animationDelay: `${idx * 0.05}s` }}>
                                    <div className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface border border-surface-highlight min-w-[40px] text-center ${fish.color.replace('text-', 'text-')}`}>
                                        {fish.tierName}
                                    </div>
                                    <div className={`text-sm font-bold ${fish.color} truncate flex-1 text-left`} style={{ textShadow: `0 0 5px ${fish.glowColor}44` }}>
                                        {fish.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className="text-xs text-cyan-900 font-mono animate-pulse">WAITING FOR SIGNAL...</span>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="mt-auto space-y-4 z-10">
                <div className="flex justify-between text-[10px] font-mono text-cyan-700">
                    <span>TOTAL CATCH</span>
                    <span className="text-cyan-300">{totalFished.toLocaleString()}</span>
                </div>

                <button
                    onClick={(e) => handleClick(e)}
                    className="w-full py-3 bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-800 text-cyan-400 font-mono font-bold tracking-widest hover:text-white transition-all active:scale-95"
                >
                    CAST NET
                </button>

                <button
                    onClick={onToggleAuto}
                    className={`
                    w-full py-2 border text-[10px] font-mono font-bold tracking-widest transition-all
                    ${isAutoFishing
                            ? 'bg-blue-900/20 border-blue-500 text-blue-400 animate-pulse'
                            : 'bg-transparent border-surface-highlight text-text-dim hover:border-cyan-900 hover:text-cyan-500'
                        }
                `}
                >
                    {isAutoFishing ? 'AUTO-FISHER ACTIVE' : 'ENABLE AUTO-FISHER'}
                </button>
            </div>

            {/* Background Noise/Water */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-900/10 pointer-events-none" />

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
