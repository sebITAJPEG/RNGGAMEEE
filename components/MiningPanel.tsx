import React, { useState, useRef, useEffect } from 'react';
import { Ore } from '../types';

interface Props {
    onMine: () => void;
    lastBatch: Ore[];
    totalMined: number;
    isAutoMining: boolean;
    onToggleAuto: () => void;
    onOpenInventory: () => void;
    currentDimension: 'NORMAL' | 'GOLD' | 'PRISM';
    onToggleDimension: () => void;
    setDimension?: (dim: 'NORMAL' | 'GOLD' | 'PRISM') => void;
    isGoldUnlocked: boolean;
    isPrismUnlocked?: boolean;
    balance: number;
    isMuted: boolean;
    onToggleMute: () => void;
}

interface FloatingText {
    id: number;
    x: number;
    y: number;
    text: string;
    color: string;
}

export const MiningPanel: React.FC<Props> = ({
    onMine, lastBatch, totalMined, isAutoMining, onToggleAuto, onOpenInventory,
    currentDimension, onToggleDimension, setDimension, isGoldUnlocked, isPrismUnlocked, balance,
    isMuted, onToggleMute
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

    const isGold = currentDimension === 'GOLD';
    const isPrism = currentDimension === 'PRISM';

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 100);
        onMine();

        // Add floating text effect
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const id = clickCount.current++;
        let floatColor = "text-white";
        if (isGold) floatColor = "text-yellow-300";
        if (isPrism) floatColor = "text-cyan-300";

        setFloatingTexts(prev => [
            ...prev,
            { id, x, y, text: `+${lastBatch.length || 1}`, color: floatColor }
        ]);
    };

    let containerClass = "bg-background/40 border-surface-highlight";
    if (isGold) containerClass = "bg-gradient-to-b from-yellow-900/30 to-yellow-950/50 border-yellow-700/50";
    if (isPrism) containerClass = "bg-gradient-to-b from-cyan-900/30 to-slate-900/50 border-cyan-500/50";

    return (
        <div className={`h-full w-full border-l flex flex-col p-6 relative overflow-hidden transition-colors duration-500 ${containerClass} backdrop-blur-sm`}>

            {/* Header */}
            <div className="flex justify-between items-start mb-8 z-20 relative pointer-events-none">
                <div>
                    <h2 className={`text-lg font-mono font-bold tracking-widest ${isGold ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : isPrism ? 'text-cyan-300 drop-shadow-[0_0_5px_rgba(103,232,249,0.5)]' : 'text-text'}`}>
                        {isGold ? 'GOLD_RUSH' : isPrism ? 'PRISM_CORE' : 'DEEP_DIVING'}
                    </h2>
                    <div className={`text-[10px] font-mono ${isGold ? 'text-yellow-600' : isPrism ? 'text-cyan-600' : 'text-text-dim'}`}>
                        {isGold ? 'DIMENSION: AU-79' : isPrism ? 'DIMENSION: C-137' : 'SECTOR 7G'}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-end pointer-events-auto">
                    {/* Mute Button - Added z-index and pointer-events-auto */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
                        className={`text-[10px] font-mono border px-2 py-1 transition-all z-50 relative ${isMuted ? 'border-red-500 text-red-500 bg-red-950/30' : 'border-neutral-600 text-neutral-400 hover:text-white hover:border-neutral-400'}`}
                        title={isMuted ? "Unmute Mining Sounds" : "Mute Mining Sounds"}
                    >
                        {isMuted ? '🔇' : '🔊'}
                    </button>

                    {/* Dimension Dropdown */}
                    {(isGoldUnlocked || isPrismUnlocked) && setDimension ? (
                        <select
                            value={currentDimension}
                            onChange={(e) => setDimension(e.target.value as any)}
                            className={`
                                text-[10px] font-mono border px-2 py-1 transition-all appearance-none cursor-pointer outline-none
                                ${isGold
                                    ? 'border-yellow-500 bg-yellow-900/20 text-yellow-300'
                                    : isPrism
                                        ? 'border-cyan-500 bg-cyan-900/20 text-cyan-300'
                                        : 'border-neutral-600 bg-neutral-900 text-neutral-400'
                                }
                            `}
                        >
                            <option value="NORMAL" className="bg-neutral-900 text-neutral-400">SECTOR 7G</option>
                            {isGoldUnlocked && <option value="GOLD" className="bg-yellow-950 text-yellow-300">GOLD DIMENSION</option>}
                            {isPrismUnlocked && <option value="PRISM" className="bg-cyan-950 text-cyan-300">PRISM MINE</option>}
                        </select>
                    ) : (isGoldUnlocked || balance >= 1000000) && (
                        <button
                            onClick={onToggleDimension}
                            className={`
                                text-[10px] font-mono border px-2 py-1 transition-all
                                ${isGold
                                    ? 'border-yellow-500 bg-yellow-900/20 text-yellow-300 hover:bg-yellow-900/40'
                                    : 'border-neutral-600 bg-neutral-900 text-neutral-400 hover:border-yellow-500 hover:text-yellow-500 animate-pulse'
                                }
                            `}
                        >
                            {isGold ? 'EXIT GOLD' : 'ENTER GOLD'}
                        </button>
                    )}
                    <button
                        onClick={onOpenInventory}
                        className={`text-[10px] font-mono border px-2 py-1 transition-colors ${isGold ? 'border-yellow-800 text-yellow-600 hover:text-yellow-300 hover:border-yellow-500' : isPrism ? 'border-cyan-800 text-cyan-600 hover:text-cyan-300 hover:border-cyan-500' : 'border-border hover:bg-surface-highlight text-text-dim hover:text-text'}`}
                    >
                        SILO
                    </button>
                </div>
            </div>

            {/* The Rock / Nugget */}
            <div className="flex-1 flex flex-col items-center justify-center z-10 min-h-[200px]">
                <div className="relative">
                    <button
                        onClick={handleClick}
                        className={`
                        relative group cursor-pointer outline-none transition-transform duration-100 select-none
                        ${isAnimating ? 'scale-95' : 'scale-100 hover:scale-105'}
                    `}
                    >
                        <pre className={`font-mono text-[8px] leading-[8px] md:text-[10px] md:leading-[10px] transition-colors whitespace-pre ${isGold ? 'text-yellow-500 group-hover:text-yellow-300 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]' : isPrism ? 'text-cyan-400 group-hover:text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'text-text-dim group-hover:text-text'}`}>
                            {isGold ? `
                ______________
    __,.,---'''''              '''''---..._
 ,-'             .....:::''::.:            '\`-.
'           ...:::.....       '
            ''':::'''''       .               ,
|'-.._           ''''':::..::':          __,,-
 '-.._''\`---.....______________.....---''__,,-
      ''\`---.....______________.....---''
` : isPrism ? `
      .
     / \\
    /   \\
   /     \\
  /       \\
 /         \\
/___________\\
 \\         /
  \\       /
   \\     /
    \\   /
     \\ /
      '
` : `
      /\\
     /  \\
    /    \\  _
   /      \\/ \\
  /   /\\   \\  \\
 /   /  \\   \\  \\
/___/    \\___\\__\\
`}
                        </pre>

                        {/* Hit Particle Effect */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className={`w-full h-full rounded-full blur-xl transition-opacity duration-100 ${isAnimating ? 'opacity-100' : 'opacity-0'} ${isGold ? 'bg-yellow-500/20' : isPrism ? 'bg-cyan-400/30' : 'bg-text/10'}`} />
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

                {/* Last Mined Batch Display */}
                <div className="mt-8 min-h-[6rem] flex flex-col items-center justify-center w-full">
                    {lastBatch.length > 0 ? (
                        <div key={totalMined} className="animate-fade-in-up w-full flex flex-col gap-2 items-center">
                            {lastBatch.slice(0, 3).map((ore, idx) => (
                                <div key={idx} className={`flex items-center gap-3 p-2 rounded border w-full max-w-[240px] ${isGold ? 'bg-yellow-950/30 border-yellow-800' : isPrism ? 'bg-cyan-950/30 border-cyan-800' : 'bg-background/40 border-surface-highlight'}`} style={{ animationDelay: `${idx * 0.05}s` }}>
                                    <div className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded min-w-[40px] text-center ${isGold ? 'bg-yellow-900 text-yellow-300 border border-yellow-700' : isPrism ? 'bg-cyan-900 text-cyan-300 border border-cyan-700' : 'bg-surface border border-surface-highlight text-neutral-400'}`}>
                                        {ore.tierName.substring(0, 6)}
                                    </div>
                                    <div className={`text-sm font-bold ${ore.color} truncate flex-1 text-left`} style={{ textShadow: `0 0 5px ${ore.glowColor}44` }}>
                                        {ore.name}
                                    </div>
                                </div>
                            ))}
                            {lastBatch.length > 3 && (
                                <div className="text-[10px] font-mono text-neutral-500">+{lastBatch.length - 3} more...</div>
                            )}
                        </div>
                    ) : (
                        <span className={`text-xs font-mono ${isGold ? 'text-yellow-700' : isPrism ? 'text-cyan-700' : 'text-text-dim'}`}>READY TO MINE</span>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="mt-auto space-y-4 z-10">
                <div className={`flex justify-between text-[10px] font-mono ${isGold ? 'text-yellow-800' : isPrism ? 'text-cyan-800' : 'text-neutral-500'}`}>
                    <span>TOTAL YIELD</span>
                    <span className={isGold ? 'text-yellow-400' : isPrism ? 'text-cyan-400' : 'text-text'}>{totalMined.toLocaleString()}</span>
                </div>

                <button
                    onClick={(e) => handleClick(e)}
                    className={`w-full py-3 border font-mono font-bold tracking-widest transition-all active:scale-95 ${isGold
                            ? 'bg-yellow-600 hover:bg-yellow-500 text-yellow-950 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                            : isPrism
                                ? 'bg-cyan-600 hover:bg-cyan-500 text-cyan-950 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                                : 'bg-surface-highlight hover:bg-secondary border-border text-text hover:text-text'
                        }`}
                >
                    MINE {isGold ? 'GOLD' : isPrism ? 'PRISM' : 'ORE'}
                </button>

                <button
                    onClick={onToggleAuto}
                    className={`
                    w-full py-2 border text-[10px] font-mono font-bold tracking-widest transition-all
                    ${isAutoMining
                            ? 'bg-orange-900/20 border-orange-600 text-orange-500 animate-pulse'
                            : isGold
                                ? 'bg-transparent border-yellow-800 text-yellow-700 hover:border-yellow-500 hover:text-yellow-400'
                                : isPrism
                                    ? 'bg-transparent border-cyan-800 text-cyan-700 hover:border-cyan-500 hover:text-cyan-400'
                                    : 'bg-transparent border-surface-highlight text-text-dim hover:border-border hover:text-text'
                        }
                `}
                >
                    {isAutoMining ? 'AUTO-MINING ACTIVE' : 'ENABLE AUTO-MINER'}
                </button>
            </div>

            {/* Background Noise */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 pointer-events-none" />
            {isGold && <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent pointer-events-none" />}
            {isPrism && <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />}

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
