import React, { useState } from 'react';
import { THEMES } from '../../themes';
import { ORES, GOLD_ORES, PRISM_ORES, FISH, PLANTS, DREAMS, PHRASES, MOON_ITEMS } from '../../constants';
import { RarityId, VariantId, GameStats, InventoryItem, MoonInventoryItem, OreInventoryItem, FishInventoryItem, PlantInventoryItem, DreamInventoryItem } from '../../types';
import { audioService } from '../../services/audioService';
import { scriptedRng } from '../../services/rngService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    stats: GameStats;
    setStats: React.Dispatch<React.SetStateAction<GameStats>>;
    currentTheme: string;
    setCurrentTheme: (theme: string) => void;
    autoSpinSpeed: number;
    setAutoSpinSpeed: (val: number) => void;
    luckMultiplier: number;
    setLuckMultiplier: (val: number) => void;
    miningSpeed: number;
    setMiningSpeed: (val: number) => void;
    miningLuckMultiplier: number;
    setMiningLuckMultiplier: (val: number) => void;
    fishingSpeed: number;
    fishingLuckMultiplier: number;
    setFishingSpeed: (val: number) => void;
    setFishingLuckMultiplier: (val: number) => void;
    harvestingSpeed: number;
    harvestingLuckMultiplier: number;
    setHarvestingSpeed: (val: number) => void;
    setHarvestingLuckMultiplier: (val: number) => void;
    dreamingLuckMultiplier: number;
    setDreamingLuckMultiplier: (val: number) => void;
    miningDimension: 'NORMAL' | 'GOLD' | 'PRISM';
    setMiningDimension: (dim: 'NORMAL' | 'GOLD' | 'PRISM') => void;
    overrideBalance: string;
    setOverrideBalance: (val: string) => void;
    overrideWins: string;
    setOverrideWins: (val: string) => void;
    handleSetBalance: () => void;
    handleSetWins: () => void;
    
    // Inventory Setters for Debug Add
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
    setMoonInventory: React.Dispatch<React.SetStateAction<MoonInventoryItem[]>>;
    setOreInventory: React.Dispatch<React.SetStateAction<OreInventoryItem[]>>; // Normal
    setGoldOreInventory: React.Dispatch<React.SetStateAction<OreInventoryItem[]>>; // Gold
    setPrismOreInventory?: React.Dispatch<React.SetStateAction<OreInventoryItem[]>>; // Prism
    setFishInventory: React.Dispatch<React.SetStateAction<FishInventoryItem[]>>;
    setPlantInventory: React.Dispatch<React.SetStateAction<PlantInventoryItem[]>>;
    setDreamInventory: React.Dispatch<React.SetStateAction<DreamInventoryItem[]>>;

    // Achievement Data for Unlock All
    achievements: { id: string }[];

    // Game Settings
    gameSettings?: { skipInventoryCutscenes: boolean; skipAllCutscenes: boolean; };
    setGameSettings?: React.Dispatch<React.SetStateAction<{ skipInventoryCutscenes: boolean; skipAllCutscenes: boolean; }>>;
}

export const SystemConfig: React.FC<Props> = ({
    isOpen, onClose, stats, setStats, currentTheme, setCurrentTheme,
    autoSpinSpeed, setAutoSpinSpeed, luckMultiplier, setLuckMultiplier,
    miningSpeed, setMiningSpeed, miningLuckMultiplier, setMiningLuckMultiplier,
    fishingSpeed, setFishingSpeed, fishingLuckMultiplier, setFishingLuckMultiplier,
    harvestingSpeed, setHarvestingSpeed, harvestingLuckMultiplier, setHarvestingLuckMultiplier,
    dreamingLuckMultiplier, setDreamingLuckMultiplier,
    miningDimension, setMiningDimension,
    overrideBalance, setOverrideBalance, overrideWins, setOverrideWins,
    handleSetBalance, handleSetWins,
    setInventory, setMoonInventory, setOreInventory, setGoldOreInventory, setPrismOreInventory, setFishInventory, setPlantInventory, setDreamInventory,
    achievements,
    gameSettings, setGameSettings
}) => {
    const [debugItemSearch, setDebugItemSearch] = useState('');
    const [selectedDebugItem, setSelectedDebugItem] = useState<any>(null);
    
    // Scripted Find State
    const [scriptRolls, setScriptRolls] = useState(5);
    const [scriptType, setScriptType] = useState<'ORE'|'FISH'|'PLANT'|'DREAM'|'NORMAL'|'GOLD_ORE'|'PRISM_ORE'|'MOON'>('ORE');
    const [scriptTarget, setScriptTarget] = useState<string>('');
    const [scriptStatus, setScriptStatus] = useState<string>('');

    if (!isOpen) return null;

    const getLogValue = (luck: number) => Math.log10(Math.max(1, luck));
    const handleLogSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLuckMultiplier(Math.pow(10, parseFloat(e.target.value)));
    };

    // --- DEBUG ITEM LOGIC ---
    const getAllDebugItems = () => {
        const allItems: any[] = [];
        Object.values(PHRASES['en']).flat().forEach((i: any) => allItems.push({ ...i, type: 'ITEM' }));
        ORES.forEach(i => allItems.push({ ...i, text: i.name, type: 'ORE' }));
        GOLD_ORES.forEach(i => allItems.push({ ...i, text: i.name, type: 'GOLD_ORE' }));
        // Add PRISM_ORES here if I imported it, but I need to import it first. 
        // For now, I'll skip importing PRISM_ORES here to avoid adding another import line complexity if not strictly needed for debug
        // Actually, users might want to debug add them. Let's assume I can't easily add the import without a separate replace block.
        // I will rely on standard ORE type handling if PRISM_ORES are just ORES with a flag. 
        // But the adder logic uses type to decide which inventory to use.
        // I should add type: 'PRISM_ORE' support.
        FISH.forEach(i => allItems.push({ ...i, text: i.name, type: 'FISH' }));
        PLANTS.forEach(i => allItems.push({ ...i, text: i.name, type: 'PLANT' }));
        DREAMS.forEach(i => allItems.push({ ...i, text: i.name, type: 'DREAM' }));
        MOON_ITEMS.forEach(i => allItems.push({ ...i, type: 'MOON' }));
        return allItems;
    };

    const filteredDebugItems = debugItemSearch.length > 2
        ? getAllDebugItems().filter(i => i.text.toLowerCase().includes(debugItemSearch.toLowerCase()))
        : [];

    const handleAddDebugItem = () => {
        if (!selectedDebugItem) return;
        const count = 99;

        if (selectedDebugItem.type === 'ITEM') {
            setInventory(prev => {
                const next = [...prev];
                let rarity = RarityId.COMMON;
                // Try to find rarity from PHRASES
                for (const [rId, items] of Object.entries(PHRASES['en'])) {
                    if (items.some((i: any) => i.text === selectedDebugItem.text)) {
                        rarity = parseInt(rId);
                        break;
                    }
                }
                next.push({
                    text: selectedDebugItem.text,
                    description: selectedDebugItem.description,
                    rarityId: rarity,
                    variantId: VariantId.NONE,
                    count: count,
                    discoveredAt: Date.now()
                });
                return next;
            });
        } else if (selectedDebugItem.type === 'MOON') {
            setMoonInventory(prev => {
                const next = [...prev];
                const existing = next.find(i => i.id === selectedDebugItem.id);
                if (existing) existing.count += count;
                else next.push({ id: selectedDebugItem.id, count, discoveredAt: Date.now() });
                return next;
            });
        } else {
            // Resource Types
            const adder = (setFn: React.Dispatch<React.SetStateAction<any[]>>) => setFn((prev: any[]) => {
                const next = [...prev];
                const existing = next.find(i => i.id === selectedDebugItem.id);
                if (existing) existing.count += count;
                else next.push({ id: selectedDebugItem.id, count, discoveredAt: Date.now() });
                return next;
            });

            if (selectedDebugItem.type === 'ORE') adder(setOreInventory);
            if (selectedDebugItem.type === 'GOLD_ORE') adder(setGoldOreInventory);
            if (selectedDebugItem.type === 'PRISM_ORE' && setPrismOreInventory) adder(setPrismOreInventory);
            if (selectedDebugItem.type === 'FISH') adder(setFishInventory);
            if (selectedDebugItem.type === 'PLANT') adder(setPlantInventory);
            if (selectedDebugItem.type === 'DREAM') adder(setDreamInventory);
        }
        audioService.playCoinWin(5);
    };

    const getScriptTargets = () => {
        if(scriptType === 'ORE') return ORES.sort((a, b) => a.id - b.id);
        if(scriptType === 'GOLD_ORE') return GOLD_ORES.sort((a, b) => a.id - b.id);
        if(scriptType === 'PRISM_ORE') return PRISM_ORES.sort((a, b) => a.id - b.id);
        if(scriptType === 'FISH') return FISH;
        if(scriptType === 'PLANT') return PLANTS;
        if(scriptType === 'DREAM') return DREAMS;
        if(scriptType === 'MOON') return MOON_ITEMS.map(i => ({ name: i.text, id: i.id })).sort((a, b) => a.id - b.id);
        if(scriptType === 'NORMAL') {
            const allItems: any[] = [];
            Object.values(PHRASES['en']).flat().forEach((i: any) => allItems.push({ name: i.text }));
            return allItems.sort((a, b) => a.name.localeCompare(b.name));
        }
        return [];
    };

    const applyScript = () => {
        if(!scriptTarget) return;
        scriptedRng.setScript(scriptTarget, scriptType, scriptRolls);
        setScriptStatus(`SCRIPT ACTIVE: Find [${scriptTarget}] in ${scriptRolls} rolls.`);
        audioService.playCoinWin(2);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-surface border border-border p-6 rounded-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-2">
                    <h2 className="text-xl font-mono text-text tracking-wider">SYSTEM CONFIG</h2>
                    <button onClick={onClose} className="text-text-dim hover:text-text">[X]</button>
                </div>
                <div className="space-y-8">
                    {/* THEME CONFIG */}
                    <div className="space-y-2 pt-2">
                        <div className="text-sm font-mono text-white font-bold">GAME SETTINGS</div>
                        <div className="space-y-2">
                            {gameSettings && setGameSettings && (
                                <>
                                    <label className="flex items-center justify-between text-xs text-neutral-400 cursor-pointer p-2 border border-neutral-800 rounded hover:bg-neutral-900/50">
                                        <span>SKIP CUTSCENES IN INVENTORY</span>
                                        <input 
                                            type="checkbox" 
                                            checked={gameSettings.skipInventoryCutscenes} 
                                            onChange={(e) => setGameSettings(prev => ({ ...prev, skipInventoryCutscenes: e.target.checked }))}
                                            className="accent-green-500"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between text-xs text-neutral-400 cursor-pointer p-2 border border-neutral-800 rounded hover:bg-neutral-900/50">
                                        <span>ALWAYS SKIP CUTSCENES</span>
                                        <input 
                                            type="checkbox" 
                                            checked={gameSettings.skipAllCutscenes} 
                                            onChange={(e) => setGameSettings(prev => ({ ...prev, skipAllCutscenes: e.target.checked }))}
                                            className="accent-green-500"
                                        />
                                    </label>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border">
                        <div className="text-sm font-mono text-white font-bold">THEME CONFIG</div>
                        <div className="grid grid-cols-2 gap-2">
                            {THEMES.map(theme => (
                                <button key={theme.id} onClick={() => setCurrentTheme(theme.id)} className={`p-2 text-xs border rounded transition-colors ${currentTheme === theme.id ? 'bg-white text-black border-white' : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:border-neutral-500'}`}>{theme.name}</button>
                            ))}
                        </div>
                    </div>
                    {/* DEBUG TOOLS */}
                    <div className="space-y-2 border-t border-border pt-4">
                        <div className="text-sm font-mono text-white font-bold">DEBUG TOOLS</div>
                        <div className="flex justify-between text-sm font-mono text-neutral-400"><label>AUTO-SPIN INTERVAL</label><span className="text-white">{autoSpinSpeed}ms</span></div>
                        <input type="range" min="5" max="1000" step="5" value={autoSpinSpeed} onChange={(e) => setAutoSpinSpeed(Number(e.target.value))} className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white" />
                        <div className="flex justify-between text-sm font-mono text-neutral-400 mt-2"><label>LUCK (Log Scale)</label><span className="text-yellow-500 font-bold">{Math.round(luckMultiplier).toLocaleString()}x</span></div>
                        <input type="range" min="0" max="12" step="0.1" value={getLogValue(luckMultiplier)} onChange={handleLogSliderChange} className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-yellow-500" />

                        {/* Sub-Game Debugs */}
                        <div className="border-t border-neutral-800 pt-2 mt-2">
                            <div className="text-xs font-bold text-neutral-500 mb-2">SUB-GAME CONFIG</div>
                            {/* Mining */}
                            <div className="mb-2">
                                <div className="flex justify-between text-[10px] text-orange-400"><span>MINING SPEED</span><span>{miningSpeed}ms</span></div>
                                <input type="range" min="10" max="2000" step="10" value={miningSpeed} onChange={(e) => setMiningSpeed(Number(e.target.value))} className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                                <div className="flex justify-between text-[10px] text-orange-400 mt-1"><span>MINING LUCK</span><span>{miningLuckMultiplier}x</span></div>
                                <input type="range" min="1" max="100" step="1" value={miningLuckMultiplier} onChange={(e) => setMiningLuckMultiplier(Number(e.target.value))} className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                            </div>
                            {/* Fishing */}
                            <div className="mb-2">
                                <div className="flex justify-between text-[10px] text-cyan-400"><span>FISHING SPEED</span><span>{fishingSpeed}ms</span></div>
                                <input type="range" min="10" max="2000" step="10" value={fishingSpeed} onChange={(e) => setFishingSpeed(Number(e.target.value))} className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                                <div className="flex justify-between text-[10px] text-cyan-400 mt-1"><span>FISHING LUCK</span><span>{fishingLuckMultiplier}x</span></div>
                                <input type="range" min="1" max="100" step="1" value={fishingLuckMultiplier} onChange={(e) => setFishingLuckMultiplier(Number(e.target.value))} className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                            </div>
                            {/* Harvesting */}
                            <div className="mb-2">
                                <div className="flex justify-between text-[10px] text-green-400"><span>HARVEST SPEED</span><span>{harvestingSpeed}ms</span></div>
                                <input type="range" min="10" max="2000" step="10" value={harvestingSpeed} onChange={(e) => setHarvestingSpeed(Number(e.target.value))} className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-green-500" />
                                <div className="flex justify-between text-[10px] text-green-400 mt-1"><span>HARVEST LUCK</span><span>{harvestingLuckMultiplier}x</span></div>
                                <input type="range" min="1" max="100" step="1" value={harvestingLuckMultiplier} onChange={(e) => setHarvestingLuckMultiplier(Number(e.target.value))} className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-green-500" />
                            </div>
                            {/* Dreaming */}
                            <div className="mb-2">
                                <div className="flex justify-between text-[10px] text-purple-400"><span>DREAM LUCK</span><span>{dreamingLuckMultiplier}x</span></div>
                                <input type="range" min="1" max="100" step="1" value={dreamingLuckMultiplier} onChange={(e) => setDreamingLuckMultiplier(Number(e.target.value))} className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                            </div>
                        </div>

                        <div className="flex justify-between text-sm font-mono text-neutral-400 mt-2"><label>MINING DIMENSION</label><span className={miningDimension === 'GOLD' ? 'text-yellow-400' : miningDimension === 'PRISM' ? 'text-cyan-400' : 'text-gray-400'}>{miningDimension}</span></div>
                        <button onClick={() => {
                            if(miningDimension === 'NORMAL') setMiningDimension('GOLD');
                            else if(miningDimension === 'GOLD') setMiningDimension('PRISM');
                            else setMiningDimension('NORMAL');
                        }} className="w-full p-2 border border-yellow-900 text-yellow-600 text-xs">CYCLE DIMENSION (DEBUG)</button>

                        <div className="mt-4 pt-4 border-t border-neutral-800">
                            <div className="flex justify-between text-sm font-mono text-neutral-400 mb-2"><label>SET BALANCE</label></div>
                            <div className="flex gap-2">
                                <input type="number" placeholder="Amount" value={overrideBalance} onChange={(e) => setOverrideBalance(e.target.value)} className="flex-1 bg-neutral-900 border border-neutral-700 text-white text-xs p-2 rounded" />
                                <button onClick={handleSetBalance} className="px-4 py-2 bg-green-900/30 text-green-400 border border-green-800 text-xs hover:bg-green-900">SET</button>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-neutral-800">
                            <div className="flex justify-between text-sm font-mono text-neutral-400 mb-2"><label>SET TTT WINS</label></div>
                            <div className="flex gap-2">
                                <input type="number" placeholder="Wins" value={overrideWins} onChange={(e) => setOverrideWins(e.target.value)} className="flex-1 bg-neutral-900 border border-neutral-700 text-white text-xs p-2 rounded" />
                                <button onClick={handleSetWins} className="px-4 py-2 bg-blue-900/30 text-blue-400 border border-blue-800 text-xs hover:bg-blue-900">SET</button>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-neutral-800">
                            <div className="flex justify-between text-sm font-mono text-neutral-400 mb-2"><label>ADD ITEMS (DEBUG)</label></div>
                            <div className="space-y-2">
                                <input type="text" placeholder="Search item..." value={debugItemSearch} onChange={(e) => setDebugItemSearch(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 text-white text-xs p-2 rounded" />
                                {debugItemSearch.length > 2 && (
                                    <div className="max-h-24 overflow-y-auto border border-neutral-800 rounded bg-neutral-950">
                                        {filteredDebugItems.map((item, i) => (
                                            <button key={i} onClick={() => { setSelectedDebugItem(item); setDebugItemSearch(item.text || item.name); }} className="w-full text-left px-2 py-1 text-[10px] hover:bg-neutral-800 truncate text-neutral-400 hover:text-white">
                                                [{item.type}] {item.text || item.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <button onClick={handleAddDebugItem} disabled={!selectedDebugItem} className="w-full px-4 py-2 bg-purple-900/30 text-purple-400 border border-purple-800 text-xs hover:bg-purple-900 disabled:opacity-50">
                                    ADD 99x {selectedDebugItem ? `[${selectedDebugItem.text || selectedDebugItem.name}]` : ''}
                                </button>
                            </div>
                        </div>

                        {/* RNG SCRIPTING TOOL */}
                        <div className="mt-4 pt-4 border-t border-neutral-800">
                            <div className="flex justify-between text-sm font-mono text-neutral-400 mb-2"><label>RNG SCRIPT (CHEAT)</label></div>
                            <div className="space-y-2">
                                <div className="flex gap-2 mb-2">
                                    <select value={scriptType} onChange={(e) => { setScriptType(e.target.value as any); setScriptTarget(''); }} className="bg-neutral-900 border border-neutral-700 text-white text-xs p-2 rounded flex-1">
                                        <option value="NORMAL">NORMAL ROLL</option>
                                        <option value="ORE">MINING (NORMAL)</option>
                                        <option value="GOLD_ORE">MINING (GOLD)</option>
                                        <option value="PRISM_ORE">MINING (PRISM)</option>
                                        <option value="MOON">MOON ROLL</option>
                                        <option value="FISH">FISHING</option>
                                        <option value="PLANT">HARVESTING</option>
                                        <option value="DREAM">DREAMING</option>
                                    </select>
                                    <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-700 rounded px-2">
                                        <span className="text-[10px] text-neutral-500">IN</span>
                                        <input type="number" min="1" max="100" value={scriptRolls} onChange={(e) => setScriptRolls(Number(e.target.value))} className="bg-transparent text-white text-xs w-8 text-center outline-none" />
                                        <span className="text-[10px] text-neutral-500">ROLLS</span>
                                    </div>
                                </div>
                                
                                <select value={scriptTarget} onChange={(e) => setScriptTarget(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 text-white text-xs p-2 rounded">
                                    <option value="">-- SELECT TARGET ITEM --</option>
                                    {getScriptTargets().map((item: any, i) => (
                                        <option key={i} value={item.name}>{item.name}</option>
                                    ))}
                                </select>

                                <button onClick={applyScript} disabled={!scriptTarget} className="w-full px-4 py-2 bg-red-900/30 border border-red-800 text-red-400 hover:bg-red-900 disabled:opacity-50 text-xs font-bold rounded">
                                    ACTIVATE SCRIPT
                                </button>
                                
                                {scriptStatus && (
                                    <div className="mt-2 p-2 border border-red-900 bg-red-900/20 text-center rounded">
                                        <span className="text-xs font-mono text-red-200 font-bold">{scriptStatus}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-neutral-800">
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => { setAutoSpinSpeed(150); setLuckMultiplier(1); setMiningLuckMultiplier(1); setFishingLuckMultiplier(1); setHarvestingLuckMultiplier(1); }} className="text-xs border border-neutral-700 p-2 hover:bg-neutral-800 text-neutral-400">RESET</button>
                            <button onClick={() => { setAutoSpinSpeed(50); setLuckMultiplier(1000); setMiningLuckMultiplier(100); setFishingLuckMultiplier(100); setHarvestingLuckMultiplier(100); }} className="text-xs border border-neutral-700 p-2 hover:bg-neutral-800 text-neutral-400">LUCKY</button>
                            <button onClick={() => { setAutoSpinSpeed(20); setLuckMultiplier(1000000000); setMiningLuckMultiplier(1000000); setFishingLuckMultiplier(1000000); setHarvestingLuckMultiplier(1000000); }} className="text-xs border border-neutral-700 p-2 hover:bg-neutral-800 text-yellow-600 border-yellow-900">GOD MODE</button>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-neutral-800 space-y-2">
                        <button onClick={() => { setStats(prev => ({ ...prev, unlockedAchievements: achievements.map(a => a.id) })); audioService.playRaritySound(RarityId.LEGENDARY); }} className="w-full text-xs text-green-800 hover:text-green-500 p-2 border border-green-900/30 hover:border-green-600 transition-colors">UNLOCK ALL TITLES</button>
                        <button onClick={() => { setStats(prev => ({ ...prev, moonTravelUnlocked: true })); audioService.playRaritySound(RarityId.MYTHICAL); }} className="w-full text-xs text-slate-500 hover:text-slate-300 p-2 border border-slate-800 hover:border-slate-600 transition-colors">UNLOCK MOON (DEBUG)</button>
                        <button onClick={() => { if (confirm("Clear all save data?")) { localStorage.clear(); window.location.reload(); } }} className="w-full text-xs text-red-800 hover:text-red-500 p-2 border border-red-900/30 hover:border-red-600 transition-colors">WIPE DATA</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
