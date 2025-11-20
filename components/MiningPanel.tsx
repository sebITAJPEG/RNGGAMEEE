
import React, { useState, useRef, useEffect } from 'react';
import { Ore } from '../types';
import { ORES } from '../constants';
import { audioService } from '../services/audioService';

interface Props {
  onMine: () => void;
  lastBatch: Ore[];
  totalMined: number;
  isAutoMining: boolean;
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

export const MiningPanel: React.FC<Props> = ({ 
    onMine, lastBatch, totalMined, isAutoMining, onToggleAuto, onOpenInventory 
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
      setTimeout(() => setIsAnimating(false), 100);
      onMine();

      // Add floating text effect
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const id = clickCount.current++;
      setFloatingTexts(prev => [
          ...prev, 
          { id, x, y, text: "+1", color: "text-white" }
      ]);
  };

  return (
    <div className="h-full w-full border-l border-neutral-800 bg-black/40 backdrop-blur-sm flex flex-col p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 z-10">
            <div>
                <h2 className="text-lg font-mono font-bold text-white tracking-widest">DEEP_DIVING</h2>
                <div className="text-[10px] text-neutral-500 font-mono">SECTOR 7G</div>
            </div>
            <button 
                onClick={onOpenInventory}
                className="text-[10px] font-mono border border-neutral-700 px-2 py-1 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
                SILO
            </button>
        </div>

        {/* The Rock */}
        <div className="flex-1 flex flex-col items-center justify-center z-10 min-h-[200px]">
            <div className="relative">
                <button
                    onClick={handleClick}
                    className={`
                        relative group cursor-pointer outline-none transition-transform duration-100 select-none
                        ${isAnimating ? 'scale-95' : 'scale-100 hover:scale-105'}
                    `}
                >
                    <pre className="font-mono text-[8px] leading-[8px] md:text-[10px] md:leading-[10px] text-neutral-600 group-hover:text-neutral-400 transition-colors whitespace-pre">
{`
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
                        <div className={`w-full h-full bg-white/10 rounded-full blur-xl transition-opacity duration-100 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} />
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
                        {lastBatch.map((ore, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-black/40 p-2 rounded border border-neutral-800 w-full max-w-[240px]" style={{ animationDelay: `${idx * 0.05}s` }}>
                                <div className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 min-w-[40px] text-center ${ore.color.replace('text-', 'text-')}`}>
                                    {ore.tierName}
                                </div>
                                <div className={`text-sm font-bold ${ore.color} truncate flex-1 text-left`} style={{ textShadow: `0 0 5px ${ore.glowColor}44` }}>
                                    {ore.name}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <span className="text-xs text-neutral-700 font-mono">READY TO MINE</span>
                )}
            </div>
        </div>

        {/* Controls */}
        <div className="mt-auto space-y-4 z-10">
            <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>TOTAL YIELD</span>
                <span className="text-white">{totalMined.toLocaleString()}</span>
            </div>

            <button
                onClick={(e) => handleClick(e)}
                className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-neutral-300 font-mono font-bold tracking-widest hover:text-white transition-all active:scale-95"
            >
                MINE
            </button>

            <button
                onClick={onToggleAuto}
                className={`
                    w-full py-2 border text-[10px] font-mono font-bold tracking-widest transition-all
                    ${isAutoMining 
                        ? 'bg-orange-900/20 border-orange-600 text-orange-500 animate-pulse' 
                        : 'bg-transparent border-neutral-800 text-neutral-600 hover:border-neutral-600 hover:text-neutral-400'
                    }
                `}
            >
                {isAutoMining ? 'AUTO-MINING ACTIVE' : 'ENABLE AUTO-MINER'}
            </button>
        </div>
        
        {/* Background Noise */}
        <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 pointer-events-none" />
        
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