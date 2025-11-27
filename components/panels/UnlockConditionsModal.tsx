import React from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    stats: any;
}

export const UnlockConditionsModal: React.FC<Props> = ({ isOpen, onClose, stats }) => {
    if (!isOpen) return null;

    const conditions = [
        {
            title: "GOLD DIMENSION",
            description: "A dimension of pure wealth.",
            condition: "Reach a balance of 1,000,000 coins.",
            unlocked: stats.goldDimensionUnlocked
        },
        {
            title: "PRISM MINE (Crystalline)",
            description: "A dimension of refracted light.",
            condition: "Craft the 'Prism Key' in the Crafting Menu.",
            unlocked: stats.prismDimensionUnlocked
        },
        {
            title: "MOON TRAVEL",
            description: "Journey to the lunar surface.",
            condition: "Craft the 'Moon Amulet' in the Crafting Menu.",
            unlocked: stats.moonTravelUnlocked
        }
    ];

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-lg bg-surface border border-border p-6 rounded-lg shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 border-b border-border pb-2">
                    <h2 className="text-xl font-mono text-text tracking-wider">UNLOCK CONDITIONS</h2>
                    <button onClick={onClose} className="text-text-dim hover:text-text">[X]</button>
                </div>

                <div className="space-y-4">
                    {conditions.map((c, i) => (
                        <div key={i} className={`border p-4 rounded transition-colors ${c.unlocked ? 'border-green-800 bg-green-950/20' : 'border-neutral-700 bg-neutral-900/50'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={`font-bold font-mono tracking-wide ${c.unlocked ? 'text-green-400' : 'text-neutral-300'}`}>{c.title}</h3>
                                    <p className="text-xs text-neutral-500 mb-2">{c.description}</p>
                                </div>
                                {c.unlocked && <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">UNLOCKED</span>}
                            </div>
                            <div className="text-sm font-mono text-neutral-400 mt-2">
                                <span className="text-neutral-600">REQ:</span> {c.condition}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
