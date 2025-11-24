import React from 'react';
import { GameStats } from '../../types';
import { getEquippedItemName, getBestResourceName } from '../../utils/gameHelpers';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    stats: GameStats;
    currentGlobalLuck: number;
    autoSpinSpeed: number;
    generalMulti: number;
    currentMineLuck: number;
    miningSpeed: number;
    currentFishLuck: number;
    fishingSpeed: number;
    currentHarvLuck: number;
    harvestingSpeed: number;
    dreamBonuses: any; // Using any for brevity as per previous files, can be refined
}

export const StatsModal: React.FC<Props> = ({
    isOpen, onClose, stats, currentGlobalLuck, autoSpinSpeed, generalMulti,
    currentMineLuck, miningSpeed, currentFishLuck, fishingSpeed,
    currentHarvLuck, harvestingSpeed, dreamBonuses
}) => {
    if (!isOpen) return null;

    const StatSection = ({ title, color, children }: { title: string, color: string, children: React.ReactNode }) => (
        <div className={`bg-black/40 p-4 rounded border border-${color}-900/30 mb-4`}>
            <h3 className={`text-sm font-bold font-mono ${color.replace('border-', 'text-')} mb-2 border-b border-${color}-900/30 pb-1`}>{title}</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono text-neutral-400">
                {children}
            </div>
        </div>
    );

    const StatRow = ({ label, value, valueColor = "text-white" }: { label: string, value: string | number, valueColor?: string }) => (
        <>
            <span>{label}:</span>
            <span className={`${valueColor} text-right`}>{value}</span>
        </>
    );

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
            <div className="w-full max-w-2xl h-[85vh] bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-neutral-800 bg-black/40">
                    <h2 className="text-xl font-bold text-white tracking-wider font-mono">PLAYER STATISTICS</h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white font-mono">[CLOSE]</button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                    
                    <StatSection title="GENERAL GEAR" color="white">
                        <StatRow label="BOOST" value={getEquippedItemName(stats.equippedItems, 'GENERAL', 'BOOST')} valueColor="text-yellow-200" />
                        <StatRow label="MULTI" value={getEquippedItemName(stats.equippedItems, 'GENERAL', 'MULTI')} valueColor="text-purple-300" />
                    </StatSection>

                    <StatSection title="MINING" color="orange">
                        <StatRow label="LUCK" value={`${currentMineLuck.toFixed(2)}x`} valueColor="text-orange-300" />
                        <StatRow label="SPEED" value={`${miningSpeed}ms`} valueColor="text-orange-300" />
                        <StatRow label="BOOST" value={getEquippedItemName(stats.equippedItems, 'MINING', 'BOOST')} valueColor="text-yellow-200" />
                        <StatRow label="MULTI" value={getEquippedItemName(stats.equippedItems, 'MINING', 'MULTI')} valueColor="text-purple-300" />
                    </StatSection>

                    <StatSection title="FISHING" color="cyan">
                        <StatRow label="LUCK" value={`${currentFishLuck.toFixed(2)}x`} valueColor="text-cyan-300" />
                        <StatRow label="SPEED" value={`${fishingSpeed}ms`} valueColor="text-cyan-300" />
                        <StatRow label="BOOST" value={getEquippedItemName(stats.equippedItems, 'FISHING', 'BOOST')} valueColor="text-yellow-200" />
                        <StatRow label="MULTI" value={getEquippedItemName(stats.equippedItems, 'FISHING', 'MULTI')} valueColor="text-purple-300" />
                    </StatSection>

                    <StatSection title="HARVESTING" color="green">
                        <StatRow label="LUCK" value={`${currentHarvLuck.toFixed(2)}x`} valueColor="text-green-300" />
                        <StatRow label="SPEED" value={`${harvestingSpeed}ms`} valueColor="text-green-300" />
                        <StatRow label="BOOST" value={getEquippedItemName(stats.equippedItems, 'HARVESTING', 'BOOST')} valueColor="text-yellow-200" />
                        <StatRow label="MULTI" value={getEquippedItemName(stats.equippedItems, 'HARVESTING', 'MULTI')} valueColor="text-purple-300" />
                    </StatSection>

                    {/* Best Finds Section */}
                    <div className="bg-black/40 p-4 rounded border border-purple-900/30 mb-4">
                        <h3 className="text-sm font-bold font-mono text-purple-400 mb-2 border-b border-purple-900/30 pb-1">BEST DISCOVERIES</h3>
                        <div className="grid grid-cols-1 gap-y-1 text-xs font-mono text-neutral-400">
                            <div className="flex justify-between"><span>Rarest Object:</span> <span className="text-white">{/* Logic for best item name needed, currently stats.bestRarityFound is ID */} Tier {stats.bestRarityFound}</span></div>
                            {stats.bestMoonItemFound ? (
                                <div className="flex justify-between"><span>Rarest Moon Object:</span> <span className="text-slate-300">ID: {stats.bestMoonItemFound}</span></div>
                            ) : null}
                            <div className="flex justify-between"><span>Rarest Gold Ore:</span> <span className="text-yellow-400">{getBestResourceName('ORE', stats.bestGoldOreMined || 0)}</span></div>
                            <div className="flex justify-between"><span>Rarest Mine Ore:</span> <span className="text-orange-400">{getBestResourceName('ORE', stats.bestOreMined)}</span></div>
                            <div className="flex justify-between"><span>Rarest Fish:</span> <span className="text-cyan-400">{getBestResourceName('FISH', stats.bestFishCaught)}</span></div>
                            <div className="flex justify-between"><span>Rarest Harvest:</span> <span className="text-green-400">{getBestResourceName('PLANT', stats.bestPlantHarvested)}</span></div>
                            <div className="flex justify-between"><span>Rarest Dream:</span> <span className="text-purple-400">ID: {stats.bestDreamFound}</span></div>
                        </div>
                    </div>

                    {/* Counters Section */}
                    <div className="bg-black/40 p-4 rounded border border-neutral-700/50 mb-4">
                        <h3 className="text-sm font-bold font-mono text-white mb-2 border-b border-neutral-700/50 pb-1">LIFETIME STATS</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono text-neutral-400">
                            <StatRow label="Mine Rolls" value={stats.totalMined.toLocaleString()} />
                            <StatRow label="Fish Caught" value={stats.totalFished.toLocaleString()} />
                            <StatRow label="Plants Harvested" value={stats.totalHarvested.toLocaleString()} />
                            <StatRow label="Dreams Entered" value={stats.totalDreamt.toLocaleString()} />
                            {/* Note: Specific roll counts for sub-categories like 'Gold Mine Rolls' or 'Moon Rolls' might not be tracked separately in current GameStats structure unless we infer or add them. 
                                I will display what is available or sum them if possible. 
                                'Moon Rolls' isn't explicitly tracked as a counter in GameStats yet, only totalRolls which includes moon rolls if in moon mode? 
                                Actually App.tsx updates totalRolls for both. 
                                I'll add what we have.
                            */}
                             <StatRow label="Total Rolls" value={stats.totalRolls.toLocaleString()} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};