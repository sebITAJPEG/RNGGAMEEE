
import React from 'react';
import { Ore, Fish, Plant } from '../types';

interface BaseItem {
    id: number;
    name: string;
    tierName: string;
    color: string;
    glowColor: string;
    probability: number;
}

interface InventoryItem {
    id: number;
    count: number;
}

interface Props {
  items: InventoryItem[];
  definitions: BaseItem[];
  isOpen: boolean;
  onClose: () => void;
  onSell: () => void;
  config: {
      title: string;
      itemName: string;
      valueDivisor: number;
      themeColor: string;      // e.g. 'text-green-400'
      borderColor: string;     // e.g. 'border-green-900'
      bgColor: string;         // e.g. 'bg-green-950/20'
      emptyIcon: string;
      emptyText: string;
  };
}

export const ResourceInventory: React.FC<Props> = ({ items, definitions, isOpen, onClose, onSell, config }) => {
  if (!isOpen) return null;

  // Sort by ID (Common -> Rare)
  const sortedItems = [...items].sort((a, b) => b.id - a.id);
  const totalCount = items.reduce((acc, i) => acc + i.count, 0);
  
  // Calculate Total Estimated Value
  let totalValue = 0;
  items.forEach(item => {
      const def = definitions.find(d => d.id === item.id);
      if (def) {
          const unitValue = Math.max(1, Math.floor(def.probability / config.valueDivisor));
          totalValue += unitValue * item.count;
      }
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className={`w-full max-w-2xl bg-neutral-900 border ${config.borderColor} rounded-lg shadow-2xl flex flex-col max-h-[80vh]`}>
        <div className={`flex justify-between items-center p-6 border-b ${config.borderColor.replace('border-', 'border-opacity-50 border-')}`}>
          <div className="flex items-center gap-4">
             <h2 className={`text-xl font-bold ${config.themeColor} tracking-wider font-mono`}>{config.title}</h2>
             <span className={`text-xs font-mono ${config.themeColor.replace('text-', 'bg-')}/10 ${config.themeColor} px-2 py-1 rounded`}>
                {totalCount.toLocaleString()} {config.itemName}
             </span>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white font-mono">[CLOSE]</button>
        </div>
        
        <div className={`overflow-y-auto p-6 flex-1 ${config.bgColor.replace('bg-', 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-').replace('/20', '/10')} to-transparent`}>
           {sortedItems.length === 0 ? (
               <div className={`text-center py-12 ${config.themeColor} font-mono opacity-70`}>
                   <div className="text-4xl mb-4 opacity-50">{config.emptyIcon}</div>
                   {config.emptyText}
               </div>
           ) : (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                   {sortedItems.map(item => {
                       const def = definitions.find(d => d.id === item.id);
                       if (!def) return null;
                       const unitValue = Math.max(1, Math.floor(def.probability / config.valueDivisor));

                       return (
                           <div 
                                key={item.id} 
                                className={`
                                    p-3 rounded bg-black/40 border ${config.borderColor.replace('border-', 'border-opacity-30 border-')} hover:bg-white/5 transition-all
                                    flex flex-col items-center text-center gap-2 relative group
                                `}
                                style={{ 
                                    borderColor: item.id > 15 ? def.glowColor : undefined,
                                    boxShadow: item.id > 20 ? `0 0 10px ${def.glowColor}33` : 'none'
                                }}
                           >
                                <div className={`text-[10px] font-mono uppercase tracking-wider opacity-70`} style={{ color: def.glowColor }}>
                                    {def.tierName}
                                </div>
                                <div className={`font-bold ${def.color} drop-shadow-md`}>
                                    {def.name}
                                </div>
                                <div className="mt-auto flex justify-between w-full text-xs font-mono">
                                     <span className="text-white bg-white/10 px-2 py-1 rounded">x{item.count.toLocaleString()}</span>
                                     <span className="text-yellow-500 py-1">${unitValue}</span>
                                </div>
                           </div>
                       );
                   })}
               </div>
           )}
        </div>

        {/* Footer Sell Action */}
        <div className={`p-6 border-t ${config.borderColor.replace('border-', 'border-opacity-30 border-')} bg-black/40`}>
             <div className="flex justify-between items-center mb-2">
                 <span className={`text-xs ${config.themeColor} font-mono`}>MARKET VALUE</span>
                 <span className="text-xl text-yellow-500 font-bold font-mono">${totalValue.toLocaleString()}</span>
             </div>
             <button 
                onClick={onSell}
                disabled={totalValue === 0}
                className="w-full py-3 bg-green-900/20 hover:bg-green-800/40 border border-green-700 text-green-500 hover:text-white font-mono font-bold tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             >
                SELL COLLECTION
             </button>
        </div>

      </div>
    </div>
  );
};
