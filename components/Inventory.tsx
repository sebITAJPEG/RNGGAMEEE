
import React, { useState, useMemo } from 'react';
import { InventoryItem, VariantId } from '../types';
import { RARITY_TIERS, VARIANTS, TRANSLATIONS } from '../constants';
import { RarityBadge } from './RarityBadge';

interface Props {
  items: InventoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onInspect: (item: InventoryItem) => void;
}

export const Inventory: React.FC<Props> = ({ items, isOpen, onClose, onInspect }) => {
  const T = TRANSLATIONS['en'];
  const [selectedVariant, setSelectedVariant] = useState<VariantId>(VariantId.NONE);
  
  // Group items by variant
  const { groups, counts } = useMemo(() => {
    const g: Record<number, InventoryItem[]> = {};
    const c: Record<number, number> = {};
    
    // Init
    Object.values(VARIANTS).forEach(v => {
        g[v.id] = [];
        c[v.id] = 0;
    });

    items.forEach(item => {
        const vId = item.variantId || VariantId.NONE;
        if (!g[vId]) g[vId] = [];
        g[vId].push(item);
        // Count unique items (rows) per variant
        c[vId] = (c[vId] || 0) + 1;
    });

    // Sort items: Rarity Desc, then Count Desc
    Object.keys(g).forEach(key => {
        const k = parseInt(key);
        g[k].sort((a, b) => {
            if (b.rarityId !== a.rarityId) return b.rarityId - a.rarityId;
            return b.count - a.count;
        });
    });

    return { groups: g, counts: c };
  }, [items]);

  const sortedVariants = useMemo(() => {
      return Object.values(VARIANTS).sort((a, b) => a.multiplier - b.multiplier);
  }, []);

  const displayedItems = groups[selectedVariant] || [];
  const activeVariant = VARIANTS[selectedVariant];

  const formatProbability = (p: number, m: number = 1) => {
    const finalP = p * m;
    if (finalP >= 1000000000000) return `1 in ${Math.round(finalP / 1000000000000)}T`;
    if (finalP >= 1000000000) return `1 in ${Math.round(finalP / 1000000000 * 10) / 10}B`;
    if (finalP >= 1000000) return `1 in ${Math.round(finalP / 1000000 * 10) / 10}M`;
    if (finalP >= 1000) return `1 in ${Math.round(finalP / 1000 * 10) / 10}k`;
    return `1 in ${Math.round(finalP)}`;
  };

  return (
    <>
        {/* Backdrop */}
        <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        />
        
        {/* Drawer */}
        <div 
            className={`
                fixed inset-y-0 right-0 w-full md:w-[900px] bg-neutral-900 border-l border-neutral-800 
                shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-neutral-800 bg-black/40">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold tracking-wider text-white font-mono">{T.UI.INVENTORY}</h2>
                    <span className="text-xs font-mono text-neutral-500 bg-neutral-800 px-2 py-1 rounded">
                        {items.reduce((acc, i) => acc + i.count, 0).toLocaleString()} ITEMS
                    </span>
                </div>
                <button onClick={onClose} className="text-neutral-500 hover:text-white font-mono transition-colors">
                    [CLOSE]
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar (Variants) */}
                <div className="w-32 md:w-64 bg-black/20 border-r border-neutral-800 overflow-y-auto flex-none">
                    <div className="p-2 space-y-1">
                        <div className="px-3 py-2 text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
                            VARIANTS
                        </div>
                        {sortedVariants.map(v => {
                            const count = counts[v.id] || 0;
                            const isActive = selectedVariant === v.id;
                            
                            return (
                                <button
                                    key={v.id}
                                    onClick={() => setSelectedVariant(v.id)}
                                    className={`
                                        w-full text-left px-3 py-3 rounded flex flex-col md:flex-row md:justify-between md:items-center gap-2 transition-all group relative overflow-hidden
                                        ${isActive ? 'bg-neutral-800 text-white ring-1 ring-inset ring-neutral-700' : 'text-neutral-500 hover:bg-neutral-800/50 hover:text-neutral-300'}
                                    `}
                                >
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />}
                                    
                                    <div className="flex flex-col pl-2">
                                        <span className={`text-xs font-mono font-bold ${isActive ? v.styleClass.split(' ')[0] : ''}`}>
                                            {v.name}
                                        </span>
                                        <span className="text-[9px] opacity-50 font-mono">x{v.multiplier}</span>
                                    </div>
                                    
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full text-center min-w-[2rem] ${count > 0 ? 'bg-neutral-700 text-white' : 'bg-neutral-800/50 text-neutral-600'}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content (Items Grid) */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-900/50">
                    <div className="mb-6 flex items-end gap-4 pb-4 border-b border-neutral-800">
                         <div>
                            <h3 className={`text-2xl font-bold ${activeVariant.styleClass} filter drop-shadow-lg`}>
                                {activeVariant.name} Storage
                            </h3>
                            <p className="text-xs text-neutral-500 font-mono mt-1">
                                Rarity Multiplier: x{activeVariant.multiplier}
                            </p>
                         </div>
                         <div className="text-xs font-mono text-neutral-500 ml-auto">
                             Showing {displayedItems.length} items
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {displayedItems.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-neutral-600">
                                <div className="text-4xl mb-4 opacity-20">∅</div>
                                <p className="font-mono text-sm">{T.UI.NO_ITEMS}</p>
                                <p className="text-xs mt-2 opacity-50 max-w-xs text-center">
                                    You haven't discovered any {activeVariant.name} items yet. 
                                    {activeVariant.id !== VariantId.NONE && " These are extremely rare!"}
                                </p>
                            </div>
                        ) : (
                            displayedItems.map((item, idx) => {
                                const tier = RARITY_TIERS[item.rarityId];
                                const tierName = T.RARITY_NAMES[item.rarityId];
                                const hasVariant = (item.variantId ?? VariantId.NONE) !== VariantId.NONE;
                                const displayVariant = VARIANTS[item.variantId || VariantId.NONE];

                                return (
                                    <button 
                                        key={`${item.rarityId}-${item.text}-${idx}`}
                                        onClick={() => onInspect(item)}
                                        className={`
                                            relative text-left p-4 rounded border bg-black/40 hover:bg-neutral-800 transition-all group overflow-hidden
                                            ${hasVariant ? displayVariant.borderClass : 'border-neutral-800 hover:border-neutral-600'}
                                        `}
                                    >
                                        <div 
                                            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                                            style={{ backgroundColor: tier.shadowColor }}
                                        />

                                        <div className="flex justify-between items-start mb-3">
                                            <RarityBadge rarityId={item.rarityId} variantId={item.variantId} size="sm" label={tierName} />
                                            <div className="text-right">
                                                <span className="block text-xs font-mono text-neutral-400">x{item.count} Owned</span>
                                                <span className="block text-[9px] text-neutral-600 font-mono mt-0.5">
                                                    {formatProbability(tier.probability, displayVariant.multiplier)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className={`text-sm font-medium leading-snug ${tier.textColor} ${hasVariant ? displayVariant.styleClass : ''}`}>
                                            {hasVariant ? displayVariant.prefix : ''} {item.text}
                                        </div>

                                        <div className="mt-3 flex justify-between items-end">
                                            <div className="text-[10px] text-neutral-500 font-mono truncate max-w-[70%]">
                                                {item.description}
                                            </div>
                                            <div className="text-[9px] uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                Inspect →
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};
