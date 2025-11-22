
import React, { useState, useMemo } from 'react';
import { InventoryItem, VariantId } from '../types';
import { RARITY_TIERS, VARIANTS, TRANSLATIONS } from '../constants';
import { RarityBadge } from './RarityBadge';

interface Props {
    items: InventoryItem[];
    isOpen: boolean;
    onClose: () => void;
    onInspect: (item: InventoryItem) => void;
    onToggleLock: (item: InventoryItem) => void;
}

export const Inventory: React.FC<Props> = ({ items, isOpen, onClose, onInspect, onToggleLock }) => {
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
                className={`fixed inset-0 bg-background/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`
                fixed inset-y-0 right-0 w-full md:w-[900px] bg-surface border-l border-surface-highlight 
                shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-surface-highlight bg-background/40">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold tracking-wider text-text font-mono">{T.UI.INVENTORY}</h2>
                        <span className="text-xs font-mono text-text-dim bg-surface-highlight px-2 py-1 rounded">
                            {items.reduce((acc, i) => acc + i.count, 0).toLocaleString()} ITEMS
                        </span>
                    </div>
                    <button onClick={onClose} className="text-text-dim hover:text-text font-mono transition-colors">
                        [CLOSE]
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar (Variants) */}
                    <div className="w-32 md:w-64 bg-background/20 border-r border-surface-highlight overflow-y-auto flex-none">
                        <div className="p-2 space-y-1">
                            <div className="px-3 py-2 text-[10px] font-mono text-text-dim uppercase tracking-widest">
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
                                        ${isActive ? 'bg-surface-highlight text-text ring-1 ring-inset ring-border' : 'text-text-dim hover:bg-surface-highlight/50 hover:text-text'}
                                    `}
                                    >
                                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-text" />}

                                        <div className="flex flex-col pl-2">
                                            <span className={`text-xs font-mono font-bold ${isActive ? v.styleClass.split(' ')[0] : ''}`}>
                                                {v.name}
                                            </span>
                                            <span className="text-[9px] opacity-50 font-mono">x{v.multiplier}</span>
                                        </div>

                                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full text-center min-w-[2rem] ${count > 0 ? 'bg-secondary text-text' : 'bg-surface-highlight/50 text-text-dim'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content (Items Grid) */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface/50">
                        <div className="mb-6 flex items-end gap-4 pb-4 border-b border-surface-highlight">
                            <div>
                                <h3 className={`text-2xl font-bold ${activeVariant.styleClass} filter drop-shadow-lg`}>
                                    {activeVariant.name} Storage
                                </h3>
                                <p className="text-xs text-text-dim font-mono mt-1">
                                    Rarity Multiplier: x{activeVariant.multiplier}
                                </p>
                            </div>
                            <div className="text-xs font-mono text-text-dim ml-auto">
                                Showing {displayedItems.length} items
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {displayedItems.length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-text-dim">
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
                                        <div
                                            key={`${item.rarityId}-${item.text}-${idx}`}
                                            onClick={() => onInspect(item)}
                                            className={`
                                            relative text-left p-4 rounded border bg-background/40 hover:bg-surface-highlight transition-all group overflow-hidden cursor-pointer
                                            ${hasVariant ? displayVariant.borderClass : 'border-surface-highlight hover:border-border'}
                                        `}
                                        >
                                            <div
                                                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                                                style={{ backgroundColor: tier.shadowColor }}
                                            />

                                            <div className="flex justify-between items-start mb-3">
                                                <RarityBadge rarityId={item.rarityId} variantId={item.variantId} size="sm" label={tierName} />
                                                <div className="flex flex-col items-end gap-1">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onToggleLock(item); }}
                                                        className={`
                                                        p-1.5 rounded transition-colors z-10
                                                        ${item.locked ? 'text-accent bg-accent/20 hover:bg-accent/40' : 'text-text-dim hover:text-text-dim hover:bg-surface-highlight'}
                                                    `}
                                                        title={item.locked ? "Unlock Item" : "Lock Item"}
                                                    >
                                                        {item.locked ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
                                                        )}
                                                    </button>
                                                    <div className="text-right">
                                                        <span className="block text-xs font-mono text-text-dim">x{item.count} Owned</span>
                                                        <span className="block text-[9px] text-text-dim font-mono mt-0.5">
                                                            {formatProbability(tier.probability, displayVariant.multiplier)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`text-sm font-medium leading-snug ${tier.textColor} ${hasVariant ? displayVariant.styleClass : ''}`}>
                                                {hasVariant ? displayVariant.prefix : ''} {item.text}
                                            </div>

                                            <div className="mt-3 flex justify-between items-end">
                                                <div className="text-[10px] text-text-dim font-mono truncate max-w-[70%]">
                                                    {item.description}
                                                </div>
                                                <div className="text-[9px] uppercase tracking-widest text-text opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Inspect →
                                                </div>
                                            </div>
                                        </div>
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
