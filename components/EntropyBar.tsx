
import React from 'react';
import { ENTROPY_THRESHOLD } from '../constants';

interface Props {
    value: number;
}

export const EntropyBar: React.FC<Props> = ({ value }) => {
    const percentage = Math.min(100, (value / ENTROPY_THRESHOLD) * 100);
    const isFull = value >= ENTROPY_THRESHOLD;

    return (
        <div className="w-full max-w-xs mb-4 relative group">
            <div className="flex justify-between text-[10px] font-mono text-neutral-500 mb-1 uppercase tracking-widest">
                <span>System Entropy</span>
                <span className={isFull ? "text-red-500 animate-pulse" : ""}>
                    {isFull ? "CRITICAL STABILITY" : `${Math.floor(percentage)}%`}
                </span>
            </div>
            <div className="h-2 w-full bg-neutral-900 border border-neutral-800 rounded-full overflow-hidden relative">
                <div 
                    className={`h-full transition-all duration-300 ease-out ${isFull ? 'bg-red-500 animate-pulse shadow-[0_0_10px_red]' : 'bg-purple-600'}`}
                    style={{ width: `${percentage}%` }}
                />
                {/* Glitch effects when high */}
                {percentage > 80 && (
                    <div className="absolute inset-0 w-full h-full bg-white/20 animate-pulse mix-blend-overlay" />
                )}
            </div>
            {isFull && (
                 <div className="absolute -bottom-6 left-0 w-full text-center text-[9px] text-red-400 font-mono uppercase animate-bounce">
                    Next Roll Boosted (500x)
                 </div>
            )}
        </div>
    );
};
