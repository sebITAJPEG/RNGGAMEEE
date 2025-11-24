import React from 'react';
import { GameStats, RarityId } from '../../types';
import { RARITY_TIERS, TRANSLATIONS } from '../../constants';
import { MiniTicTacToe } from '../MiniTicTacToe';
import { TrophySystem } from '../TrophySystem';
import { getEquippedItemName } from '../../utils/gameHelpers';

interface Props {
    stats: GameStats;
    // Removing showExtendedStats props as they are replaced by the modal
    currentGlobalLuck: number;
    autoSpinSpeed: number;
    generalMulti: number;
    onOpenStats: () => void; // New prop to open stats modal
    trophyLuckMult: number;
    onTicTacToeWin: () => void;
}

export const LeftPanel: React.FC<Props> = ({
    stats, currentGlobalLuck, autoSpinSpeed,
    generalMulti, onOpenStats, trophyLuckMult, onTicTacToeWin
}) => {
    const T = TRANSLATIONS['en'];

    return (
        <div className="flex flex-col gap-4 pointer-events-auto max-h-[80vh] overflow-y-auto no-scrollbar">
            {/* Main Economy Stats with Mini Game */}
            <div className="flex items-start gap-2">
                <div className="space-y-1 font-mono text-xs md:text-sm text-text-dim bg-black/60 backdrop-blur p-3 rounded border border-white/10 min-w-[200px]">
                    <p>{T.UI.ROLLS}: <span className="text-text">{stats.totalRolls.toLocaleString()}</span></p>
                    <p>BALANCE: <span className="text-yellow-500">{stats.balance.toLocaleString()}</span></p>
                    {/* MOON BALANCE DISPLAY */}
                    {stats.moonTravelUnlocked && (
                        <p>MOON COINS: <span className="text-slate-300 text-shadow-sm">{stats.moonBalance?.toLocaleString() || 0} ☾</span></p>
                    )}
                    <p>CREDITS: <span className="text-purple-400">{stats.gachaCredits}</span></p>
                    <p>{T.UI.BEST}: <span className={`${RARITY_TIERS[stats.bestRarityFound]?.textColor || 'text-text'}`}>{T.RARITY_NAMES[stats.bestRarityFound]}</span></p>

                    {/* Player Stats */}
                    <div className="my-2 border-t border-white/10 pt-2">
                        <p>LUCK: <span className="text-green-400">{currentGlobalLuck.toFixed(2)}x</span></p>
                        <p>SPEED: <span className="text-cyan-400">{autoSpinSpeed}ms</span></p>
                        <p>BATCH: <span className="text-purple-300">x{generalMulti}</span></p>
                    </div>

                    {stats.equippedTitle && (
                        <p>TITLE: <span className="text-yellow-400 font-bold border-b border-yellow-600">{stats.equippedTitle}</span></p>
                    )}
                    
                    <button
                        onClick={onOpenStats}
                        className="w-full py-1.5 mt-2 text-[10px] font-bold border border-neutral-600 bg-neutral-800/50 hover:bg-neutral-700 text-white uppercase tracking-wider transition-colors rounded"
                    >
                        SHOW FULL STATS
                    </button>
                </div>

                {/* MINI TIC-TAC-TOE & TROPHY */}
                <div className="flex flex-col gap-2 pointer-events-auto">
                    <div className="flex">
                        <MiniTicTacToe onWin={onTicTacToeWin} />
                        <TrophySystem wins={stats.ticTacToeWins || 0} />
                    </div>
                </div>
            </div>
        </div>
    );
};