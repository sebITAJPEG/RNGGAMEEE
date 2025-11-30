
import React from 'react';
import { OreInventoryItem, OreRarityId, GoldRarityId, PrismRarityId } from '../types';
import { ORES, GOLD_ORES, PRISM_ORES, ORE_RARITY_TIERS, GOLD_RARITY_TIERS, PRISM_RARITY_TIERS } from '../constants';

interface Props {
  items: OreInventoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSell: () => void;
}

export const OreInventory: React.FC<Props> = ({ items, isOpen, onClose, onSell }) => {
  if (!isOpen) return null;

  // Sort by ID (Common -> Rare)
  const sortedItems = [...items].sort((a, b) => b.id - a.id);

  const totalCount = items.reduce((acc, i) => acc + i.count, 0);
  
  // Calculate Total Estimated Value
  let totalValue = 0;
  items.forEach(item => {
      const ore = ORES.find(o => o.id === item.id) || GOLD_ORES.find(o => o.id === item.id) || PRISM_ORES.find(o => o.id === item.id);
      if (ore) {
          const unitValue = Math.max(1, Math.floor(ore.probability / 5));
          totalValue += unitValue * item.count;
      }
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-6 border-b border-neutral-800">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold text-white tracking-wider font-mono">ORE SILO</h2>
             <span className="text-xs font-mono text-neutral-500 bg-neutral-800 px-2 py-1 rounded">{totalCount.toLocaleString()} RES</span>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white font-mono">[CLOSE]</button>
        </div>
        
        <div className="overflow-y-auto p-6 flex-1">
           {sortedItems.length === 0 ? (
               <div className="text-center py-12 text-neutral-500 font-mono">
                   <div className="text-4xl mb-4">∅</div>
                   SILO EMPTY. START MINING.
               </div>
           ) : (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                   {sortedItems.map(item => {
                       const ore = ORES.find(o => o.id === item.id) || GOLD_ORES.find(o => o.id === item.id) || PRISM_ORES.find(o => o.id === item.id);
                       if (!ore) return null;
                       const unitValue = Math.max(1, Math.floor(ore.probability / 5));

                       // Resolve Rarity
                       let rarity: any = { name: ore.tierName, textColor: 'text-neutral-500', color: 'border-neutral-700' };
                       if (ore.rarityId) {
                           if (ore.dimension === 'GOLD') {
                               rarity = GOLD_RARITY_TIERS[ore.rarityId as GoldRarityId];
                           } else if (ore.dimension === 'PRISM') {
                               rarity = PRISM_RARITY_TIERS[ore.rarityId as PrismRarityId];
                           } else {
                               rarity = ORE_RARITY_TIERS[ore.rarityId as OreRarityId];
                           }
                       }

                       return (
                           <div 
                                key={item.id} 
                                className={`
                                    p-3 rounded bg-neutral-800/50 border ${rarity.color || 'border-neutral-700'} hover:bg-neutral-800 transition-all
                                    flex flex-col items-center text-center gap-2 relative group
                                `}
                                style={{ 
                                    // Use rarity shadow color if available, fallback to item glowColor logic
                                    boxShadow: rarity.shadowColor ? `0 0 10px ${rarity.shadowColor}` : (item.id > 20 ? `0 0 10px ${ore.glowColor}33` : 'none')
                                }}
                           >
                                <div className={`text-[10px] ${rarity.textColor || 'text-neutral-500'} font-mono uppercase tracking-wider`}>
                                    {rarity.name}
                                </div>
                                <div className={`font-bold ${ore.color} drop-shadow-md`}>
                                    {ore.name}
                                </div>
                                <div className="mt-auto flex justify-between w-full text-xs font-mono">
                                     <span className="text-white bg-black/30 px-2 py-1 rounded">x{item.count.toLocaleString()}</span>
                                     <span className="text-yellow-500 py-1">${unitValue}</span>
                                </div>
                           </div>
                       );
                   })}
               </div>
           )}
        </div>

        {/* Footer Sell Action */}
        <div className="p-6 border-t border-neutral-800 bg-black/20">
             <div className="flex justify-between items-center mb-2">
                 <span className="text-xs text-neutral-500 font-mono">ESTIMATED VALUE</span>
                 <span className="text-xl text-yellow-500 font-bold font-mono">${totalValue.toLocaleString()}</span>
             </div>
             <button 
                onClick={onSell}
                disabled={totalValue === 0}
                className="w-full py-3 bg-green-900/20 hover:bg-green-800/40 border border-green-700 text-green-500 hover:text-white font-mono font-bold tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             >
                SELL ALL ORES
             </button>
        </div>

      </div>
    </div>
  );
};
