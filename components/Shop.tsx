
import React from 'react';
import { SPEED_TIERS, BURST_COST, UPGRADE_COSTS, MINING_SPEEDS, FISHING_SPEEDS } from '../constants';
import { GameStats } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onBuyMultiRoll: (cost: number) => void;
  onBuySpeed: (cost: number) => void;
  onBuyBurst: () => void;
  onBuyLuck: (cost: number) => void;
  onBuyMiningSpeed: (cost: number) => void;
  onBuyMiningLuck: (cost: number) => void;
  onBuyMiningMulti: (cost: number) => void;
  onBuyFishingSpeed?: (cost: number) => void;
  onBuyFishingLuck?: (cost: number) => void;
  onBuyFishingMulti?: (cost: number) => void;
}

export const Shop: React.FC<Props> = ({ 
    isOpen, onClose, stats,
    onBuyMultiRoll, onBuySpeed, onBuyBurst, onBuyLuck,
    onBuyMiningSpeed, onBuyMiningLuck, onBuyMiningMulti,
    onBuyFishingSpeed, onBuyFishingLuck, onBuyFishingMulti
}) => {
  if (!isOpen) return null;

  const balance = stats.balance;

  // --- MAIN GAME UPGRADES ---
  
  // Speed
  const nextSpeedLevel = stats.speedLevel + 1;
  const nextSpeedTier = SPEED_TIERS[nextSpeedLevel];
  const isSpeedMaxed = nextSpeedLevel >= SPEED_TIERS.length;

  // Multi Roll
  const nextMultiLevel = stats.multiRollLevel + 1;
  const multiCost = Math.floor(1000 * Math.pow(1.5, stats.multiRollLevel));
  const isMultiMaxed = stats.multiRollLevel >= 10;

  // Luck
  const nextLuckLevel = (stats.luckLevel || 0) + 1;
  const luckCost = Math.floor(UPGRADE_COSTS.LUCK.base * Math.pow(UPGRADE_COSTS.LUCK.multiplier, stats.luckLevel || 0));
  const isLuckMaxed = nextLuckLevel > UPGRADE_COSTS.LUCK.max;

  // --- MINING UPGRADES ---

  // Mining Speed
  const nextMineSpeedLevel = (stats.miningSpeedLevel || 0) + 1;
  const mineSpeedCost = Math.floor(UPGRADE_COSTS.MINING_SPEED.base * Math.pow(UPGRADE_COSTS.MINING_SPEED.multiplier, stats.miningSpeedLevel || 0));
  const isMineSpeedMaxed = nextMineSpeedLevel >= MINING_SPEEDS.length;
  const currentMineSpeed = MINING_SPEEDS[Math.min(stats.miningSpeedLevel || 0, MINING_SPEEDS.length-1)];
  const nextMineSpeed = MINING_SPEEDS[Math.min(nextMineSpeedLevel, MINING_SPEEDS.length-1)];

  // Mining Luck
  const nextMineLuckLevel = (stats.miningLuckLevel || 0) + 1;
  const mineLuckCost = Math.floor(UPGRADE_COSTS.MINING_LUCK.base * Math.pow(UPGRADE_COSTS.MINING_LUCK.multiplier, stats.miningLuckLevel || 0));
  const isMineLuckMaxed = nextMineLuckLevel > UPGRADE_COSTS.MINING_LUCK.max;

  // Mining Multi
  const nextMineMultiLevel = (stats.miningMultiLevel || 1) + 1;
  const mineMultiCost = Math.floor(UPGRADE_COSTS.MINING_MULTI.base * Math.pow(UPGRADE_COSTS.MINING_MULTI.multiplier, (stats.miningMultiLevel || 1) - 1));
  const isMineMultiMaxed = nextMineMultiLevel > UPGRADE_COSTS.MINING_MULTI.max;

  // --- FISHING UPGRADES ---

  // Fishing Speed
  const nextFishSpeedLevel = (stats.fishingSpeedLevel || 0) + 1;
  const fishSpeedCost = Math.floor(UPGRADE_COSTS.FISHING_SPEED.base * Math.pow(UPGRADE_COSTS.FISHING_SPEED.multiplier, stats.fishingSpeedLevel || 0));
  const isFishSpeedMaxed = nextFishSpeedLevel >= FISHING_SPEEDS.length;
  const currentFishSpeed = FISHING_SPEEDS[Math.min(stats.fishingSpeedLevel || 0, FISHING_SPEEDS.length-1)];
  const nextFishSpeed = FISHING_SPEEDS[Math.min(nextFishSpeedLevel, FISHING_SPEEDS.length-1)];

  // Fishing Luck
  const nextFishLuckLevel = (stats.fishingLuckLevel || 0) + 1;
  const fishLuckCost = Math.floor(UPGRADE_COSTS.FISHING_LUCK.base * Math.pow(UPGRADE_COSTS.FISHING_LUCK.multiplier, stats.fishingLuckLevel || 0));
  const isFishLuckMaxed = nextFishLuckLevel > UPGRADE_COSTS.FISHING_LUCK.max;

  // Fishing Multi
  const nextFishMultiLevel = (stats.fishingMultiLevel || 1) + 1;
  const fishMultiCost = Math.floor(UPGRADE_COSTS.FISHING_MULTI.base * Math.pow(UPGRADE_COSTS.FISHING_MULTI.multiplier, (stats.fishingMultiLevel || 1) - 1));
  const isFishMultiMaxed = nextFishMultiLevel > UPGRADE_COSTS.FISHING_MULTI.max;

  const UpgradeCard = ({ title, desc, current, next, cost, isMaxed, onBuy, colorClass, borderColor }: any) => (
      <div className={`p-4 bg-neutral-800/50 rounded border ${borderColor} flex flex-col justify-between h-full`}>
        <div>
            <h4 className={`text-sm font-bold font-mono mb-1 ${colorClass}`}>{title}</h4>
            <p className="text-xs text-neutral-400 font-mono mb-3 min-h-[3rem]">{desc}</p>
            
            {!isMaxed && (
                <div className="flex justify-between text-[10px] font-mono text-neutral-500 mb-2">
                    <span>CUR: {current}</span>
                    <span>NEXT: {next}</span>
                </div>
            )}
        </div>
        
        {isMaxed ? (
            <button disabled className={`w-full py-2 ${colorClass.replace('text-', 'bg-')}/20 border ${borderColor} ${colorClass} font-mono font-bold text-xs`}>
                MAXED OUT
            </button>
        ) : (
            <button 
                onClick={onBuy}
                disabled={balance < cost}
                className={`w-full py-2 border font-mono font-bold text-xs transition-all
                    ${balance >= cost 
                        ? `bg-neutral-900 hover:bg-neutral-800 ${colorClass} ${borderColor}` 
                        : 'bg-neutral-800 border-neutral-700 text-neutral-600 cursor-not-allowed'
                    }
                `}
            >
                UPGRADE [{cost.toLocaleString()}]
            </button>
        )}
      </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-white tracking-wider font-mono">UPGRADE STATION</h2>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <span className="block text-xs text-neutral-500 font-mono">BALANCE</span>
                <span className="block text-lg text-yellow-500 font-bold font-mono">{balance.toLocaleString()} PTS</span>
             </div>
             <button onClick={onClose} className="text-neutral-500 hover:text-white font-mono ml-4">[X]</button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8">
            
            {/* MAIN SECTION */}
            <div>
                <h3 className="text-sm font-bold text-white font-mono mb-4 border-b border-neutral-800 pb-2">SYSTEM UPGRADES</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <UpgradeCard 
                        title="CPU OVERCLOCK (SPEED)"
                        desc="Reduces auto-spin interval."
                        current={`${SPEED_TIERS[stats.speedLevel].ms}ms`}
                        next={nextSpeedTier ? `${nextSpeedTier.ms}ms` : '-'}
                        cost={nextSpeedTier?.cost}
                        isMaxed={isSpeedMaxed}
                        onBuy={() => onBuySpeed(nextSpeedTier.cost)}
                        colorClass="text-cyan-400"
                        borderColor="border-cyan-800"
                    />
                    <UpgradeCard 
                        title="RAM EXPANSION (MULTI)"
                        desc="Increases items per roll."
                        current={`${stats.multiRollLevel}x`}
                        next={`${nextMultiLevel}x`}
                        cost={multiCost}
                        isMaxed={isMultiMaxed}
                        onBuy={() => onBuyMultiRoll(multiCost)}
                        colorClass="text-yellow-400"
                        borderColor="border-yellow-800"
                    />
                    <UpgradeCard 
                        title="ALGORITHM OPTIMIZER (LUCK)"
                        desc="Global luck multiplier."
                        current={`${(1 + ((stats.luckLevel||0) * 0.2)).toFixed(1)}x`}
                        next={`${(1 + (nextLuckLevel * 0.2)).toFixed(1)}x`}
                        cost={luckCost}
                        isMaxed={isLuckMaxed}
                        onBuy={() => onBuyLuck(luckCost)}
                        colorClass="text-green-400"
                        borderColor="border-green-800"
                    />
                    
                    {/* Burst Module (Special) */}
                    <div className="p-4 bg-neutral-800/50 rounded border border-purple-900 flex flex-col justify-between h-full relative overflow-hidden">
                        <div>
                            <h4 className="text-sm font-bold font-mono mb-1 text-purple-400">BURST GPU</h4>
                            <p className="text-xs text-neutral-400 font-mono mb-3">Unlock 50x Burst Roll button.</p>
                        </div>
                         {stats.hasBurst ? (
                            <button disabled className="w-full py-2 bg-purple-900/20 border border-purple-800 text-purple-500 font-mono font-bold text-xs">
                                INSTALLED
                            </button>
                        ) : (
                            <button 
                                onClick={onBuyBurst}
                                disabled={balance < BURST_COST}
                                className={`w-full py-2 border font-mono font-bold text-xs transition-all
                                    ${balance >= BURST_COST 
                                        ? 'bg-purple-900/30 border-purple-500 text-purple-400 hover:text-white' 
                                        : 'bg-neutral-800 border-neutral-700 text-neutral-600 cursor-not-allowed'
                                    }
                                `}
                            >
                                BUY [{BURST_COST.toLocaleString()}]
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* MINING SECTION */}
            <div>
                <h3 className="text-sm font-bold text-white font-mono mb-4 border-b border-neutral-800 pb-2">MINING MODULES</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <UpgradeCard 
                        title="DRILL RPM (SPEED)"
                        desc="Reduces auto-mine interval."
                        current={`${currentMineSpeed}ms`}
                        next={`${nextMineSpeed}ms`}
                        cost={mineSpeedCost}
                        isMaxed={isMineSpeedMaxed}
                        onBuy={() => onBuyMiningSpeed(mineSpeedCost)}
                        colorClass="text-orange-400"
                        borderColor="border-orange-800"
                    />
                    <UpgradeCard 
                        title="SENSOR ARRAY (LUCK)"
                        desc="Increases chance for rare ores."
                        current={`${(1 + ((stats.miningLuckLevel||0) * 0.5)).toFixed(1)}x`}
                        next={`${(1 + (nextMineLuckLevel * 0.5)).toFixed(1)}x`}
                        cost={mineLuckCost}
                        isMaxed={isMineLuckMaxed}
                        onBuy={() => onBuyMiningLuck(mineLuckCost)}
                        colorClass="text-red-400"
                        borderColor="border-red-800"
                    />
                    <UpgradeCard 
                        title="MULTI-TOOL HEAD"
                        desc="Mine multiple ores per action."
                        current={`${stats.miningMultiLevel||1}x`}
                        next={`${nextMineMultiLevel}x`}
                        cost={mineMultiCost}
                        isMaxed={isMineMultiMaxed}
                        onBuy={() => onBuyMiningMulti(mineMultiCost)}
                        colorClass="text-blue-400"
                        borderColor="border-blue-800"
                    />
                </div>
            </div>

            {/* FISHING SECTION */}
            {onBuyFishingSpeed && (
                <div>
                    <h3 className="text-sm font-bold text-white font-mono mb-4 border-b border-neutral-800 pb-2">FISHING MODULES</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <UpgradeCard 
                            title="CAST RATE (SPEED)"
                            desc="Reduces auto-fish interval."
                            current={`${currentFishSpeed}ms`}
                            next={`${nextFishSpeed}ms`}
                            cost={fishSpeedCost}
                            isMaxed={isFishSpeedMaxed}
                            onBuy={() => onBuyFishingSpeed(fishSpeedCost)}
                            colorClass="text-teal-400"
                            borderColor="border-teal-800"
                        />
                        <UpgradeCard 
                            title="LURE QUALITY (LUCK)"
                            desc="Increases chance for rare fish."
                            current={`${(1 + ((stats.fishingLuckLevel||0) * 0.5)).toFixed(1)}x`}
                            next={`${(1 + (nextFishLuckLevel * 0.5)).toFixed(1)}x`}
                            cost={fishLuckCost}
                            isMaxed={isFishLuckMaxed}
                            onBuy={() => onBuyFishingLuck && onBuyFishingLuck(fishLuckCost)}
                            colorClass="text-pink-400"
                            borderColor="border-pink-800"
                        />
                        <UpgradeCard 
                            title="NET SIZE (MULTI)"
                            desc="Catches multiple fish per cast."
                            current={`${stats.fishingMultiLevel||1}x`}
                            next={`${nextFishMultiLevel}x`}
                            cost={fishMultiCost}
                            isMaxed={isFishMultiMaxed}
                            onBuy={() => onBuyFishingMulti && onBuyFishingMulti(fishMultiCost)}
                            colorClass="text-indigo-400"
                            borderColor="border-indigo-800"
                        />
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
