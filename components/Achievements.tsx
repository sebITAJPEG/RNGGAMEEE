import React from 'react';
import { Achievement, GameStats } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    stats: GameStats;
    onEquipTitle: (title: string | null) => void;
}

export const Achievements: React.FC<Props> = ({ isOpen, onClose, stats, onEquipTitle }) => {
    if (!isOpen) return null;

    // Calculate progress
    const unlockedCount = stats.unlockedAchievements.length;
    const totalCount = ACHIEVEMENTS.length;
    const percent = Math.floor((unlockedCount / totalCount) * 100);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-2xl h-[70vh] bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-neutral-800">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-wider font-mono">ACHIEVEMENTS</h2>
                        <div className="text-[10px] text-neutral-500 font-mono mt-1">
                            PROGRESS: {percent}% ({unlockedCount}/{totalCount})
                        </div>
                    </div>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white font-mono ml-4">[X]</button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {ACHIEVEMENTS.map((ach) => {
                        const isUnlocked = stats.unlockedAchievements.includes(ach.id);
                        const isEquipped = stats.equippedTitle === ach.title;

                        return (
                            <div 
                                key={ach.id}
                                className={`
                                    relative p-4 border rounded-lg flex justify-between items-center transition-all
                                    ${isUnlocked 
                                        ? 'bg-neutral-800/50 border-neutral-600' 
                                        : 'bg-neutral-900/50 border-neutral-800 opacity-50'
                                    }
                                `}
                            >
                                <div>
                                    <h3 className={`font-bold font-mono ${isUnlocked ? 'text-white' : 'text-neutral-500'}`}>
                                        {ach.title}
                                    </h3>
                                    <p className="text-xs text-neutral-400 font-mono mt-1">{ach.description}</p>
                                </div>

                                <div>
                                    {isUnlocked ? (
                                        <button
                                            onClick={() => onEquipTitle(isEquipped ? null : ach.title)}
                                            className={`
                                                px-3 py-1 text-[10px] font-mono border rounded uppercase tracking-wider transition-colors
                                                ${isEquipped 
                                                    ? 'bg-yellow-600 text-white border-yellow-500' 
                                                    : 'bg-transparent text-neutral-400 border-neutral-600 hover:border-white hover:text-white'
                                                }
                                            `}
                                        >
                                            {isEquipped ? 'EQUIPPED' : 'EQUIP TITLE'}
                                        </button>
                                    ) : (
                                        <div className="text-[10px] font-mono text-neutral-600 uppercase">LOCKED</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};