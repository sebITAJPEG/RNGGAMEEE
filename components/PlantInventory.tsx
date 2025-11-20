
import React from 'react';
import { PlantInventoryItem } from '../types';
import { PLANTS } from '../constants';

interface Props {
  items: PlantInventoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSell: () => void;
}

export const PlantInventory: React.FC<Props> = ({ items, isOpen, onClose, onSell }) => {
  if (!isOpen) return null;

  // Sort by ID (Common -> Rare)
  const sortedItems = [...items].sort((a, b) => b.id - a.id);

  const totalCount = items.reduce((acc, i) => acc + i.count, 0);
  
  // Calculate Total Estimated Value
  let totalValue = 0;
  items.forEach(item => {
      const plant = PLANTS.find(p => p.id === item.id);
      if (plant) {
          // Plants value logic
          const unitValue = Math.max(1, Math.floor(plant.probability / 4.5));
          totalValue += unitValue * item.count;
      }
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-neutral-900 border border-green-900 rounded-lg shadow-[0_0_30px_rgba(34,197,94,0.2)] flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-6 border-b border-green-900/50">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold text-green-400 tracking-wider font-mono">GREENHOUSE</h2>
             <span className="text-xs font-mono text-green-800 bg-green-950/30 px-2 py-1 rounded">{totalCount.toLocaleString()} PLANTS</span>
          </div>
          <button onClick={onClose} className="text-green-700 hover:text-green-400 font-mono">[CLOSE]</button>
        </div>
        
        <div className="overflow-y-auto p-6 flex-1 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/10 to-transparent">
           {sortedItems.length === 0 ? (
               <div className="text-center py-12 text-green-900 font-mono">
                   <div className="text-4xl mb-4 opacity-50">❀</div>
                   GREENHOUSE EMPTY. START HARVESTING.
               </div>
           ) : (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                   {sortedItems.map(item => {
                       const plant = PLANTS.find(p => p.id === item.id);
                       if (!plant) return null;
                       const unitValue = Math.max(1, Math.floor(plant.probability / 4.5));

                       return (
                           <div 
                                key={item.id} 
                                className={`
                                    p-3 rounded bg-black/40 border border-green-900/50 hover:bg-green-950/30 transition-all
                                    flex flex-col items-center text-center gap-2 relative group
                                `}
                                style={{ 
                                    borderColor: item.id > 15 ? plant.glowColor : undefined,
                                    boxShadow: item.id > 20 ? `0 0 10px ${plant.glowColor}33` : 'none'
                                }}
                           >
                                <div className="text-[10px] text-green-600 font-mono uppercase tracking-wider">
                                    {plant.tierName}
                                </div>
                                <div className={`font-bold ${plant.color} drop-shadow-md`}>
                                    {plant.name}
                                </div>
                                <div className="mt-auto flex justify-between w-full text-xs font-mono">
                                     <span className="text-green-100 bg-green-900/50 px-2 py-1 rounded">x{item.count.toLocaleString()}</span>
                                     <span className="text-yellow-500 py-1">${unitValue}</span>
                                </div>
                           </div>
                       );
                   })}
               </div>
           )}
        </div>

        {/* Footer Sell Action */}
        <div className="p-6 border-t border-green-900/50 bg-black/40">
             <div className="flex justify-between items-center mb-2">
                 <span className="text-xs text-green-600 font-mono">MARKET VALUE</span>
                 <span className="text-xl text-yellow-500 font-bold font-mono">${totalValue.toLocaleString()}</span>
             </div>
             <button 
                onClick={onSell}
                disabled={totalValue === 0}
                className="w-full py-3 bg-green-900/20 hover:bg-green-800/40 border border-green-700 text-green-500 hover:text-white font-mono font-bold tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             >
                SELL HARVEST
             </button>
        </div>

      </div>
    </div>
  );
};
