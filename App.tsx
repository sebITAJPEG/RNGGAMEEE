import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameStats, Drop, InventoryItem, RarityId, ItemData, VariantId, OreInventoryItem, FishInventoryItem, PlantInventoryItem, CraftableItem, MoonInventoryItem } from './types';
import { RARITY_TIERS, TRANSLATIONS, VARIANTS, ACHIEVEMENTS, SPEED_TIERS, ENTROPY_THRESHOLD, MINING_SPEEDS, ORES, GOLD_ORES, PRISM_ORES, FISHING_SPEEDS, FISH, HARVESTING_SPEEDS, PLANTS, DREAMS, PHRASES, MOON_ITEMS, SPECIAL_HTML_ITEMS } from './constants';
import { generateDrop, generateMoonDrop } from './services/rngService';
import { mineOre } from './services/miningService';
import { catchFish } from './services/fishingService';
import { harvestPlant } from './services/harvestingService';
import { audioService } from './services/audioService';
import { SpecialEffects } from './components/SpecialEffects';
import { ItemVisualizer } from './components/ItemVisualizer';
import { useSubGame } from './hooks/useSubGame';
import { useDreaming } from './hooks/useDreaming';
import { useBuildUpSequence } from './hooks/useBuildUpSequence';
import { THEMES, applyTheme } from './themes';

import { SpectrumStyles } from './components/SpectrumEffects';
import { LunarStyles } from './components/LunarEffects';
import { LeftPanel } from './components/panels/LeftPanel';
import { CenterPanel } from './components/panels/CenterPanel';
import { RightPanel } from './components/panels/RightPanel';
import { GameModals } from './components/panels/GameModals';
import { SystemConfig } from './components/panels/SystemConfig';
import { StatsModal } from './components/panels/StatsModal';
import { UnlockConditionsModal } from './components/panels/UnlockConditionsModal';
import { getCraftingBonuses, getTrophyMultiplier } from './utils/gameHelpers';

export default function App() {
    // --- STATE ---
    const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('textbound_theme') || 'default');
    const [currentDrops, setCurrentDrops] = useState<Drop[]>([]);
    const [miningDimension, setMiningDimension] = useState<'NORMAL' | 'GOLD' | 'PRISM'>('NORMAL');
    const [isMoon, setIsMoon] = useState(false);
    const [overrideBalance, setOverrideBalance] = useState('');
    const [overrideWins, setOverrideWins] = useState('');
    const [debugItemSearch, setDebugItemSearch] = useState('');
    const [selectedDebugItem, setSelectedDebugItem] = useState<any>(null);
    const [volume, setVolume] = useState(0.4);
    const { activeSequence, triggerSequence } = useBuildUpSequence();

    // New state for muting only mining sounds
    const [isMiningMuted, setIsMiningMuted] = useState(false);

    const [stats, setStats] = useState<GameStats>(() => {
        const saved = localStorage.getItem('textbound_stats');
        if (saved) {
            const parsed = JSON.parse(saved);
            let bestRarity = parsed.bestRarityFound || RarityId.COMMON;
            if (bestRarity > RarityId.THE_ONE) bestRarity = RarityId.THE_ONE;
            return {
                ...parsed,
                bestRarityFound: bestRarity,
                // Ensure new stats exist
                goldMiningSpeedLevel: parsed.goldMiningSpeedLevel || 0,
                goldMiningLuckLevel: parsed.goldMiningLuckLevel || 0,
                goldMiningMultiLevel: parsed.goldMiningMultiLevel || 1,
                prismMiningSpeedLevel: parsed.prismMiningSpeedLevel || 0,
                prismMiningLuckLevel: parsed.prismMiningLuckLevel || 0,
                prismMiningMultiLevel: parsed.prismMiningMultiLevel || 1
            };
        }
        return {
            totalRolls: 0, totalMoonRolls: 0, balance: 0, moonBalance: 0, startTime: Date.now(), bestRarityFound: RarityId.COMMON,
            multiRollLevel: 1, speedLevel: 0, luckLevel: 0, entropy: 0, hasBurst: false, moonTravelUnlocked: false,
            unlockedAchievements: [], equippedTitle: null, craftedItems: {}, equippedItems: {},

            totalMined: 0, totalGoldMined: 0, totalPrismMined: 0, bestOreMined: 0, bestGoldOreMined: 0, bestPrismOreMined: 0,
            miningSpeedLevel: 0, miningLuckLevel: 0, miningMultiLevel: 1,
            goldMiningSpeedLevel: 0, goldMiningLuckLevel: 0, goldMiningMultiLevel: 1,
            prismMiningSpeedLevel: 0, prismMiningLuckLevel: 0, prismMiningMultiLevel: 1,
            goldDimensionUnlocked: false, prismDimensionUnlocked: false,

            totalFished: 0, bestFishCaught: 0, fishingSpeedLevel: 0, fishingLuckLevel: 0, fishingMultiLevel: 1,
            totalHarvested: 0, bestPlantHarvested: 0, harvestingSpeedLevel: 0, harvestingLuckLevel: 0, harvestingMultiLevel: 1,
            totalDreamt: 0, bestDreamFound: 0, bestMoonItemFound: 0,
            gachaCredits: 0, ticTacToeWins: 0
        };
    });

    const [inventory, setInventory] = useState<InventoryItem[]>(() => {
        const saved = localStorage.getItem('textbound_inventory');
        return saved ? JSON.parse(saved) : [];
    });

    const [moonInventory, setMoonInventory] = useState<MoonInventoryItem[]>(() => {
        const saved = localStorage.getItem('textbound_moon_inventory');
        return saved ? JSON.parse(saved) : [];
    });

    const [goldOreInventory, setGoldOreInventory] = useState<OreInventoryItem[]>(() => {
        const saved = localStorage.getItem('textbound_gold_ore_inventory');
        return saved ? JSON.parse(saved) : [];
    });

    const [prismOreInventory, setPrismOreInventory] = useState<OreInventoryItem[]>(() => {
        const saved = localStorage.getItem('textbound_prism_ore_inventory');
        return saved ? JSON.parse(saved) : [];
    });

    const [isAutoSpinning, setIsAutoSpinning] = useState(false);
    const [activeRightPanel, setActiveRightPanel] = useState<'MINING' | 'FISHING' | 'HARVESTING' | 'DREAMING'>('MINING');

    const [modalsState, setModalsState] = useState({
        isInventoryOpen: false, isOreInventoryOpen: false, isFishInventoryOpen: false,
        isPlantInventoryOpen: false, isDreamInventoryOpen: false, isMoonInventoryOpen: false,
        isCraftingOpen: false, isGachaOpen: false, isChangelogOpen: false, isIndexOpen: false,
        isAchievementsOpen: false, isCoinTossOpen: false, isAdminOpen: false,
        isStatsOpen: false, isUnlockConditionsOpen: false
    });

    const [inspectedItem, setInspectedItem] = useState<(ItemData & { rarityId: RarityId, variantId?: VariantId, isFullScreen?: boolean }) | null>(null);

    // Config State
    const [autoSpinSpeed, setAutoSpinSpeed] = useState(SPEED_TIERS[stats.speedLevel]?.ms || 250);
    const [luckMultiplier, setLuckMultiplier] = useState(1);
    const [miningLuckMultiplier, setMiningLuckMultiplier] = useState(1);
    const [miningSpeed, setMiningSpeed] = useState(1000);
    const [goldMiningSpeed, setGoldMiningSpeed] = useState(1000); // Separate state for gold mining
    const [prismMiningSpeed, setPrismMiningSpeed] = useState(1000); // Separate state for prism mining
    const [fishingSpeed, setFishingSpeed] = useState(1200);
    const [fishingLuckMultiplier, setFishingLuckMultiplier] = useState(1);
    const [harvestingSpeed, setHarvestingSpeed] = useState(1100);
    const [harvestingLuckMultiplier, setHarvestingLuckMultiplier] = useState(1);
    const [dreamingLuckMultiplier, setDreamingLuckMultiplier] = useState(1);

    const [autoStopRarity, setAutoStopRarity] = useState<RarityId>(() => {
        const saved = localStorage.getItem('textbound_settings_autostop');
        const val = saved ? parseInt(saved) : RarityId.DIVINE;
        return val > RarityId.THE_ONE ? RarityId.THE_ONE : val;
    });

    const T = TRANSLATIONS['en'];
    const autoSpinRef = useRef<number | null>(null);

    // --- EFFECTS ---
    useEffect(() => { localStorage.setItem('textbound_stats', JSON.stringify(stats)); }, [stats]);
    useEffect(() => { localStorage.setItem('textbound_inventory', JSON.stringify(inventory)); }, [inventory]);
    useEffect(() => { localStorage.setItem('textbound_moon_inventory', JSON.stringify(moonInventory)); }, [moonInventory]);
    useEffect(() => { localStorage.setItem('textbound_gold_ore_inventory', JSON.stringify(goldOreInventory)); }, [goldOreInventory]);
    useEffect(() => { localStorage.setItem('textbound_prism_ore_inventory', JSON.stringify(prismOreInventory)); }, [prismOreInventory]);
    useEffect(() => { localStorage.setItem('textbound_settings_autostop', autoStopRarity.toString()); }, [autoStopRarity]);
    useEffect(() => { applyTheme(currentTheme); localStorage.setItem('textbound_theme', currentTheme); }, [currentTheme]);

    const trophyLuckMult = getTrophyMultiplier(stats.ticTacToeWins || 0);

    useEffect(() => {
        if (stats.balance >= 1000000 && !stats.goldDimensionUnlocked) {
            setStats(prev => ({ ...prev, goldDimensionUnlocked: true }));
            audioService.playRaritySound(RarityId.DIVINE);
        }
    }, [stats.balance, stats.goldDimensionUnlocked]);

    useEffect(() => {
        const baseMineSpeed = MINING_SPEEDS[Math.min(stats.miningSpeedLevel || 0, MINING_SPEEDS.length - 1)] || 1000;
        const baseGoldMineSpeed = MINING_SPEEDS[Math.min(stats.goldMiningSpeedLevel || 0, MINING_SPEEDS.length - 1)] || 1000;
        const basePrismMineSpeed = MINING_SPEEDS[Math.min(stats.prismMiningSpeedLevel || 0, MINING_SPEEDS.length - 1)] || 1000;
        const baseFishSpeed = FISHING_SPEEDS[Math.min(stats.fishingSpeedLevel || 0, FISHING_SPEEDS.length - 1)] || 1200;
        const baseHarvSpeed = HARVESTING_SPEEDS[Math.min(stats.harvestingSpeedLevel || 0, HARVESTING_SPEEDS.length - 1)] || 1100;

        const mineBonuses = getCraftingBonuses(stats.equippedItems, 'MINING');
        const goldMineBonuses = getCraftingBonuses(stats.equippedItems, 'GOLD_MINING');
        const fishBonuses = getCraftingBonuses(stats.equippedItems, 'FISHING');
        const harvBonuses = getCraftingBonuses(stats.equippedItems, 'HARVESTING');

        setAutoSpinSpeed(SPEED_TIERS[stats.speedLevel]?.ms || 250);
        setMiningSpeed(Math.max(10, baseMineSpeed - mineBonuses.bonusSpeed));
        setGoldMiningSpeed(Math.max(10, baseGoldMineSpeed - goldMineBonuses.bonusSpeed));
        setPrismMiningSpeed(Math.max(10, basePrismMineSpeed)); // No crafting bonuses for Prism yet
        setFishingSpeed(Math.max(25, baseFishSpeed - fishBonuses.bonusSpeed));
        setHarvestingSpeed(Math.max(15, baseHarvSpeed - harvBonuses.bonusSpeed));
    }, [stats.speedLevel, stats.miningSpeedLevel, stats.goldMiningSpeedLevel, stats.prismMiningSpeedLevel, stats.fishingSpeedLevel, stats.harvestingSpeedLevel, stats.equippedItems]);

    // --- SUB-GAMES ---
    const mineBonuses = getCraftingBonuses(stats.equippedItems, 'MINING');
    const goldMineBonuses = getCraftingBonuses(stats.equippedItems, 'GOLD_MINING');

    // Helper for auto-inspecting special items found in sub-games
    const handleSubGameFind = (item: any) => {
        if (item.name && SPECIAL_HTML_ITEMS.includes(item.name)) {
            if (item.name === "The Spectrum") {
                triggerSequence('SPECTRUM', () => {
                    handleInspectResource(item);
                });
            } else if (item.name === "Nightmare Eel") {
                triggerSequence('NIGHTMARE', () => {
                    handleInspectResource(item);
                });
            } else if (item.name === "Lunar Divinity") {
                triggerSequence('LUNAR', () => {
                    handleInspectResource(item);
                });
            } else {
                handleInspectResource(item);
            }
        }
    };

    // NOTE: We pass a wrapper function for playing sound that checks the mute state
    const playNormalMineSound = () => { if (!isMiningMuted) audioService.playMineSound(); };
    const playGoldMineSound = () => { if (!isMiningMuted) audioService.playGoldMineSound(); };
    const playPrismMineSound = () => { if (!isMiningMuted) audioService.playPrismMineSound(); };

    const normalMiningGame = useSubGame({
        storageKey: 'textbound_ore_inventory',
        dropFn: (l) => mineOre(l, 'NORMAL'),
        playSound: playNormalMineSound,
        speed: miningSpeed,
        luck: ((miningLuckMultiplier * (1 + (stats.miningLuckLevel * 0.5))) + mineBonuses.bonusLuck) * trophyLuckMult,
        multi: (stats.miningMultiLevel || 1) + mineBonuses.bonusMulti,
        thresholds: { boom: 30, rare: 10, boomDivisor: 6 },
        isMuted: isMiningMuted // Pass mute state to subgame
    }, {
        onUpdate: (count, bestId, gacha) => setStats(prev => ({ ...prev, totalMined: (prev.totalMined || 0) + count, bestOreMined: Math.max(prev.bestOreMined || 0, bestId), gachaCredits: prev.gachaCredits + gacha })),
        onFind: handleSubGameFind,
        playBoom: audioService.playBoom.bind(audioService),
        playRare: audioService.playRaritySound.bind(audioService),
        playCoinWin: audioService.playCoinWin.bind(audioService)
    });

    const goldMiningGame = useSubGame({
        storageKey: 'textbound_gold_ore_inventory',
        dropFn: (l) => mineOre(l, 'GOLD'),
        playSound: playGoldMineSound,
        speed: goldMiningSpeed,
        luck: ((miningLuckMultiplier * (1 + ((stats.goldMiningLuckLevel || 0) * 0.5))) + goldMineBonuses.bonusLuck) * trophyLuckMult,
        multi: (stats.goldMiningMultiLevel || 1) + goldMineBonuses.bonusMulti,
        thresholds: { boom: 10000, rare: 10000, boomDivisor: 3 }, // Increased thresholds to stop constant rarity sounds
        isMuted: isMiningMuted // Pass mute state to subgame
    }, {
        onUpdate: (count, bestId, gacha) => setStats(prev => ({ ...prev, totalGoldMined: (prev.totalGoldMined || 0) + count, bestGoldOreMined: Math.max(prev.bestGoldOreMined || 0, bestId), gachaCredits: prev.gachaCredits + gacha })),
        onFind: handleSubGameFind,
        playBoom: audioService.playBoom.bind(audioService),
        playRare: audioService.playRaritySound.bind(audioService),
        playCoinWin: audioService.playCoinWin.bind(audioService)
    });

    const prismMiningGame = useSubGame({
        storageKey: 'textbound_prism_ore_inventory',
        dropFn: (l) => mineOre(l, 'PRISM'),
        playSound: playPrismMineSound,
        speed: prismMiningSpeed,
        luck: ((miningLuckMultiplier * (1 + ((stats.prismMiningLuckLevel || 0) * 0.5)))) * trophyLuckMult, // No bonuses yet
        multi: (stats.prismMiningMultiLevel || 1),
        thresholds: { boom: 2030, rare: 2007, boomDivisor: 135 },
        isMuted: isMiningMuted
    }, {
        onUpdate: (count, bestId, gacha) => setStats(prev => ({ ...prev, totalPrismMined: (prev.totalPrismMined || 0) + count, bestPrismOreMined: Math.max(prev.bestPrismOreMined || 0, bestId), gachaCredits: prev.gachaCredits + gacha })),
        onFind: handleSubGameFind,
        playBoom: audioService.playPrismRaritySound.bind(audioService),
        playRare: audioService.playPrismRaritySound.bind(audioService),
        playCoinWin: audioService.playCoinWin.bind(audioService)
    });

    const currentMiningGame = miningDimension === 'GOLD' ? goldMiningGame : miningDimension === 'PRISM' ? prismMiningGame : normalMiningGame;

    const fishBonuses = getCraftingBonuses(stats.equippedItems, 'FISHING');
    const fishingGame = useSubGame({
        storageKey: 'textbound_fish_inventory',
        dropFn: catchFish,
        playSound: audioService.playFishSound.bind(audioService),
        speed: fishingSpeed,
        luck: ((fishingLuckMultiplier * (1 + (stats.fishingLuckLevel * 0.5))) + fishBonuses.bonusLuck) * trophyLuckMult,
        multi: (stats.fishingMultiLevel || 1) + fishBonuses.bonusMulti,
        thresholds: { boom: 25, rare: 15, boomDivisor: 3 }
    }, {
        onUpdate: (count, bestId, gacha) => setStats(prev => ({ ...prev, totalFished: (prev.totalFished || 0) + count, bestFishCaught: Math.max(prev.bestFishCaught || 0, bestId), gachaCredits: prev.gachaCredits + gacha })),
        onFind: handleSubGameFind,
        playBoom: audioService.playBoom.bind(audioService),
        playRare: audioService.playRaritySound.bind(audioService),
        playCoinWin: audioService.playCoinWin.bind(audioService)
    });

    const harvBonuses = getCraftingBonuses(stats.equippedItems, 'HARVESTING');
    const harvestingGame = useSubGame({
        storageKey: 'textbound_plant_inventory',
        dropFn: harvestPlant,
        playSound: audioService.playHarvestSound.bind(audioService),
        speed: harvestingSpeed,
        luck: ((harvestingLuckMultiplier * (1 + (stats.harvestingLuckLevel * 0.5))) + harvBonuses.bonusLuck) * trophyLuckMult,
        multi: (stats.harvestingMultiLevel || 1) + harvBonuses.bonusMulti,
        thresholds: { boom: 25, rare: 15, boomDivisor: 3 }
    }, {
        onUpdate: (count, bestId, gacha) => setStats(prev => ({ ...prev, totalHarvested: (prev.totalHarvested || 0) + count, bestPlantHarvested: Math.max(prev.bestPlantHarvested || 0, bestId), gachaCredits: prev.gachaCredits + gacha })),
        onFind: handleSubGameFind,
        playBoom: audioService.playBoom.bind(audioService),
        playRare: audioService.playRaritySound.bind(audioService),
        playCoinWin: audioService.playCoinWin.bind(audioService)
    });

    const dreamBonuses = getCraftingBonuses(stats.equippedItems, 'DREAMING');
    const dreamingGame = useDreaming({
        storageKey: 'textbound_dream_inventory',
        baseStability: 100 + dreamBonuses.bonusStability
    }, {
        onUpdateStats: (count, bestId) => setStats(prev => ({ ...prev, totalDreamt: (prev.totalDreamt || 0) + count, bestDreamFound: Math.max(prev.bestDreamFound || 0, bestId) })),
        onCrash: () => { },
        onWake: (count) => { }
    });

    useEffect(() => {
        const currentLuck = (1 + (stats.luckLevel || 0) * 0.2) * luckMultiplier * trophyLuckMult * dreamingLuckMultiplier;
        dreamingGame.updateParams(currentLuck, dreamBonuses.bonusStabilityRegen || 0);
    }, [stats.luckLevel, luckMultiplier, dreamBonuses.bonusStabilityRegen, trophyLuckMult, dreamingLuckMultiplier]);

    useEffect(() => {
        const newUnlocks: string[] = [];
        ACHIEVEMENTS.forEach(ach => {
            if (!stats.unlockedAchievements.includes(ach.id)) {
                if (ach.condition(stats, inventory)) newUnlocks.push(ach.id);
            }
        });
        if (newUnlocks.length > 0) {
            audioService.playRaritySound(RarityId.LEGENDARY);
            setStats(prev => ({ ...prev, unlockedAchievements: [...prev.unlockedAchievements, ...newUnlocks] }));
        }
    }, [stats, inventory]);

    // --- HANDLERS ---

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        audioService.setVolume(val);
    };

    // ... (Rest of handlers remain unchanged)
    const toggleResourceLock = (type: 'ORES' | 'GOLD_ORES' | 'FISH' | 'PLANTS' | 'MOON', id: number) => {
        if (type === 'ORES') normalMiningGame.setInventory(prev => prev.map(i => i.id === id ? { ...i, locked: !i.locked } : i));
        else if (type === 'GOLD_ORES') goldMiningGame.setInventory(prev => prev.map(i => i.id === id ? { ...i, locked: !i.locked } : i));
        else if (type === 'FISH') fishingGame.setInventory(prev => prev.map(i => i.id === id ? { ...i, locked: !i.locked } : i));
        else if (type === 'PLANTS') harvestingGame.setInventory(prev => prev.map(i => i.id === id ? { ...i, locked: !i.locked } : i));
        else if (type === 'MOON') setMoonInventory(prev => prev.map(i => i.id === id ? { ...i, locked: !i.locked } : i));
        audioService.playClick();
    };

    const handleSellResources = (type: 'ORES' | 'GOLD_ORES' | 'FISH' | 'PLANTS') => {
        let totalValue = 0;
        let setInv: any;
        let currentInv: any[];
        let defs: any[];
        let divisor: number;

        if (type === 'ORES') {
            currentInv = normalMiningGame.inventory;
            setInv = normalMiningGame.setInventory;
            defs = ORES;
            divisor = 5;
        } else if (type === 'GOLD_ORES') {
            currentInv = goldMiningGame.inventory;
            setInv = goldMiningGame.setInventory;
            defs = GOLD_ORES;
            divisor = 2;
        }
        else if (type === 'FISH') { currentInv = fishingGame.inventory; setInv = fishingGame.setInventory; defs = FISH; divisor = 4; }
        else { currentInv = harvestingGame.inventory; setInv = harvestingGame.setInventory; defs = PLANTS; divisor = 4.5; }

        currentInv.forEach(item => {
            if (item.locked) return;
            const def = defs.find(d => d.id === item.id);
            if (def) totalValue += Math.max(1, Math.floor(def.probability / divisor)) * item.count;
        });

        if (totalValue > 0) {
            audioService.playCoinWin(5);
            setStats(prev => ({ ...prev, balance: prev.balance + totalValue }));
            setInv((prev: any[]) => prev.filter(i => i.locked));
        }
    };

    const handleSellMoonItems = () => {
        let totalValue = 0;
        moonInventory.forEach(item => {
            if (item.locked) return;
            const def = MOON_ITEMS.find(i => i.id === item.id);
            if (def) totalValue += Math.max(10, Math.floor(def.probability / 10)) * item.count;
        });

        if (totalValue > 0) {
            audioService.playCoinWin(5);
            setStats(prev => ({ ...prev, balance: prev.balance + totalValue }));
            setMoonInventory(prev => prev.filter(i => i.locked));
        }
    };

    const handleSellDreams = () => {
        let totalValue = 0;
        dreamingGame.inventory.forEach(item => {
            const def = DREAMS.find(d => d.id === item.id);
            if (def) totalValue += Math.max(5, Math.floor(def.probability / 3)) * item.count;
        });
        if (totalValue > 0) {
            audioService.playCoinWin(5);
            setStats(prev => ({ ...prev, balance: prev.balance + totalValue }));
            dreamingGame.setInventory([]);
        }
    };

    const handleInspectResource = (item: { id: number; name: string; description: string }) => {
        let rarityId = RarityId.COMMON;
        if (item.id < 1000) rarityId = Math.min(Math.ceil(item.id / 10), 15) as RarityId;
        else if (item.id < 2000) rarityId = Math.min(Math.max(1, Math.ceil((item.id - 1000) / 10) * 2 + 1), 15) as RarityId;
        else rarityId = RarityId.MOON;

        audioService.playClick();
        setIsAutoSpinning(false);
        setInspectedItem({ text: item.name, description: item.description, rarityId: rarityId, variantId: VariantId.NONE, isFullScreen: true });
        setModalsState(prev => ({ ...prev, isOreInventoryOpen: false, isFishInventoryOpen: false, isPlantInventoryOpen: false, isIndexOpen: false, isMoonInventoryOpen: false }));
    };

    const handleCraftItem = (item: CraftableItem) => {
        if (stats.balance < item.recipe.cost) return;
        const missingMaterial = item.recipe.materials.find(mat => {
            if (mat.type === 'ORE') {
                if (typeof mat.id === 'number' && mat.id > 1000) return (goldMiningGame.inventory.find(i => i.id === mat.id)?.count || 0) < mat.count;
                return (normalMiningGame.inventory.find(i => i.id === mat.id)?.count || 0) < mat.count;
            }
            if (mat.type === 'FISH') return (fishingGame.inventory.find(i => i.id === mat.id)?.count || 0) < mat.count;
            if (mat.type === 'PLANT') return (harvestingGame.inventory.find(i => i.id === mat.id)?.count || 0) < mat.count;
            if (mat.type === 'DREAM') return (dreamingGame.inventory.find(i => i.id === mat.id)?.count || 0) < mat.count;
            if (mat.type === 'MOON') return (moonInventory.find(i => i.id === mat.id)?.count || 0) < mat.count;
            return true;
        });
        if (missingMaterial) return;

        setStats(prev => {
            const updated = { ...prev, balance: prev.balance - item.recipe.cost, craftedItems: { ...prev.craftedItems, [item.id]: true } };
            if (item.unlocksFeature === 'MOON_TRAVEL') {
                updated.moonTravelUnlocked = true;
            }
            if (item.unlocksFeature === 'PRISM_MINE') {
                updated.prismDimensionUnlocked = true;
            }
            return updated;
        });

        item.recipe.materials.forEach(mat => {
            const deduct = (inv: any[], setInv: any) => setInv((prev: any[]) => prev.map(i => i.id === mat.id ? { ...i, count: i.count - mat.count } : i).filter(i => i.count > 0));
            if (mat.type === 'ORE') {
                if (typeof mat.id === 'number' && mat.id > 1000) deduct(goldMiningGame.inventory, goldMiningGame.setInventory);
                else deduct(normalMiningGame.inventory, normalMiningGame.setInventory);
            }
            else if (mat.type === 'FISH') deduct(fishingGame.inventory, fishingGame.setInventory);
            else if (mat.type === 'PLANT') deduct(harvestingGame.inventory, harvestingGame.setInventory);
            else if (mat.type === 'DREAM') deduct(dreamingGame.inventory, dreamingGame.setInventory);
            else if (mat.type === 'MOON') deduct(moonInventory, setMoonInventory);
        });
        
        if (item.unlocksFeature === 'PRISM_MINE') {
            audioService.playRaritySound(RarityId.COSMIC);
        } else {
            audioService.playRaritySound(RarityId.MYTHICAL);
        }
    };

    const handleEquipItem = (item: CraftableItem) => {
        audioService.playClick();
        setStats(prev => ({ ...prev, equippedItems: { ...prev.equippedItems, [`${item.category}_${item.type}`]: item.id } }));
    };

    const handleUnequipItem = (item: CraftableItem) => {
        audioService.playClick();
        setStats(prev => {
            const newEquipped = { ...prev.equippedItems };
            newEquipped[`${item.category}_${item.type}`] = null;
            return { ...prev, equippedItems: newEquipped };
        });
    };

    const handleIndexSelectItem = (item: ItemData, rarityId: RarityId) => {
        audioService.playClick();
        setIsAutoSpinning(false);
        setInspectedItem({ text: item.text, description: item.description, rarityId: rarityId, cutscenePhrase: item.cutscenePhrase, isFullScreen: false });
    };

    const toggleLock = (item: InventoryItem) => {
        setInventory(prev => prev.map(i => {
            if (i.text === item.text && i.rarityId === item.rarityId && i.variantId === item.variantId) return { ...i, locked: !i.locked };
            return i;
        }));
        audioService.playClick();
    };

    const formatProb = (p: number, variantMultiplier: number = 1) => {
        const levelLuck = 1 + (stats.luckLevel * 0.2);
        const genBonuses = getCraftingBonuses(stats.equippedItems, 'GENERAL');
        const totalLuck = luckMultiplier * (levelLuck + genBonuses.bonusLuck) * trophyLuckMult;
        const adjustedP = (p / totalLuck) * variantMultiplier;
        if (adjustedP >= 1000000000000) return `1 in ${Math.round(adjustedP / 1000000000000)}T`;
        if (adjustedP >= 1000000000) return `1 in ${Math.round(adjustedP / 1000000000 * 10) / 10}B`;
        if (adjustedP >= 1000000) return `1 in ${Math.round(adjustedP / 1000000 * 10) / 10}M`;
        if (adjustedP >= 1000) return `1 in ${Math.round(adjustedP / 1000 * 10) / 10}k`;
        if (adjustedP < 1) return T.UI.GUARANTEED;
        return `1 in ${Math.round(adjustedP)}`;
    };

    const getBestDrop = (drops: Drop[]) => {
        if (drops.length === 0) return null;
        return drops.reduce((prev, current) => {
            if (current.rarityId > prev.rarityId && current.rarityId !== RarityId.MOON) return current;
            return prev;
        }, drops[0]);
    };

    const batchUpdateStatsAndInventory = (drops: Drop[], rollsCount: number, finalEntropy: number) => {
        let creditsFound = 0;
        if (Math.random() < (0.001 * rollsCount)) creditsFound = 1;

        setStats(prev => {
            const maxRarityInBatch = Math.max(...drops.filter(d => d.rarityId !== RarityId.MOON).map(d => d.rarityId), prev.bestRarityFound);
            const moonGain = isMoon ? Math.floor(rollsCount * 1.5) : 0;
            const moonDrops = drops.filter(d => d.rarityId === RarityId.MOON);
            let bestMoonId = prev.bestMoonItemFound || 0;
            moonDrops.forEach(d => {
                const item = MOON_ITEMS.find(m => m.text === d.text);
                if (item && item.id > bestMoonId) bestMoonId = item.id;
            });

            return {
                ...prev,
                totalRolls: prev.totalRolls + rollsCount,
                balance: prev.balance + (isMoon ? 0 : rollsCount),
                moonBalance: (prev.moonBalance || 0) + moonGain,
                bestRarityFound: maxRarityInBatch,
                bestMoonItemFound: bestMoonId,
                entropy: finalEntropy,
                gachaCredits: prev.gachaCredits + creditsFound,
                totalMoonRolls: (prev.totalMoonRolls || 0) + (isMoon ? rollsCount : 0)
            };
        });

        if (creditsFound > 0) audioService.playCoinWin(3);

        if (drops.some(d => d.rarityId >= autoStopRarity && d.rarityId !== RarityId.MOON)) setIsAutoSpinning(false);

        if (isMoon) {
            setMoonInventory(prev => {
                const next = [...prev];
                drops.forEach(drop => {
                    if (drop.rarityId === RarityId.MOON) {
                        const def = MOON_ITEMS.find(m => m.text === drop.text);
                        if (def) {
                            const existing = next.find(i => i.id === def.id);
                            if (existing) existing.count += 1;
                            else next.push({ id: def.id, count: 1, discoveredAt: Date.now() });
                        }
                    }
                });
                return next;
            });
        } else {
            setInventory(prev => {
                let newInv = [...prev];
                drops.forEach(drop => {
                    if (drop.rarityId >= RarityId.RARE && drop.rarityId !== RarityId.MOON) {
                        const existingIndex = newInv.findIndex(i => i.text === drop.text && i.rarityId === drop.rarityId && i.variantId === drop.variantId);
                        if (existingIndex >= 0) newInv[existingIndex].count += 1;
                        else newInv.push({ text: drop.text, description: drop.description, rarityId: drop.rarityId, variantId: drop.variantId, count: 1, discoveredAt: Date.now() });
                    }
                });
                return newInv;
            });
        }
    };

    const handleRoll = useCallback((manualBatchSize?: number) => {
        if (!manualBatchSize) audioService.playRollSound();
        const genBonuses = getCraftingBonuses(stats.equippedItems, 'GENERAL');
        const rollsToPerform = manualBatchSize || (stats.multiRollLevel + genBonuses.bonusMulti);
        const generatedDrops: Drop[] = [];
        let currentEntropy = stats.entropy;
        const levelLuck = 1 + (stats.luckLevel * 0.2);
        const totalLuckMult = luckMultiplier * (levelLuck + genBonuses.bonusLuck) * trophyLuckMult;
        let effectiveLuck = totalLuckMult;
        let consumedPity = false;

        if (currentEntropy >= ENTROPY_THRESHOLD) { effectiveLuck = totalLuckMult * 500; consumedPity = true; }

        for (let i = 0; i < rollsToPerform; i++) {
            const useLuck = (i === 0 && consumedPity) ? effectiveLuck : totalLuckMult;

            let drop: Drop;
            if (isMoon) {
                drop = generateMoonDrop(stats.totalRolls + i, useLuck);
            } else {
                drop = generateDrop(stats.totalRolls + i, useLuck);
            }

            generatedDrops.push(drop);

            if (!isMoon && drop.rarityId >= RarityId.LEGENDARY) { currentEntropy = 0; consumedPity = false; }
            else { if (!consumedPity) currentEntropy++; else currentEntropy = 0; }
        }

        const bestDrop = getBestDrop(generatedDrops);
        if (!bestDrop) return;
        setCurrentDrops(generatedDrops);
        batchUpdateStatsAndInventory(generatedDrops, rollsToPerform, currentEntropy);

        if (bestDrop.text === "Lucid Lobster") {
            audioService.playLucidSound();
        } else if (!isMoon) {
            audioService.playBoom(bestDrop.rarityId);
        } else {
            audioService.playRaritySound(RarityId.MYTHICAL);
        }

        // Auto-inspect special HTML items
        if (SPECIAL_HTML_ITEMS.includes(bestDrop.text)) {
            setIsAutoSpinning(false);
            if (bestDrop.text === "The Spectrum") {
                triggerSequence('SPECTRUM', () => {
                    setInspectedItem({ 
                        text: bestDrop.text, 
                        description: bestDrop.description, 
                        rarityId: bestDrop.rarityId, 
                        variantId: bestDrop.variantId,
                        cutscenePhrase: bestDrop.cutscenePhrase,
                        isFullScreen: true 
                    });
                });
            } else if (bestDrop.text === "Nightmare Eel") {
                triggerSequence('NIGHTMARE', () => {
                    setInspectedItem({ 
                        text: bestDrop.text, 
                        description: bestDrop.description, 
                        rarityId: bestDrop.rarityId, 
                        variantId: bestDrop.variantId,
                        cutscenePhrase: bestDrop.cutscenePhrase,
                        isFullScreen: true 
                    });
                });
            } else if (bestDrop.text === "Lunar Divinity") {
                triggerSequence('LUNAR', () => {
                    setInspectedItem({ 
                        text: bestDrop.text, 
                        description: bestDrop.description, 
                        rarityId: bestDrop.rarityId, 
                        variantId: bestDrop.variantId,
                        cutscenePhrase: bestDrop.cutscenePhrase,
                        isFullScreen: true 
                    });
                });
            } else {
                setInspectedItem({ 
                    text: bestDrop.text, 
                    description: bestDrop.description, 
                    rarityId: bestDrop.rarityId, 
                    variantId: bestDrop.variantId,
                    cutscenePhrase: bestDrop.cutscenePhrase,
                    isFullScreen: true 
                });
            }
        }
    }, [stats.totalRolls, stats.multiRollLevel, stats.entropy, luckMultiplier, stats.luckLevel, stats.equippedItems, trophyLuckMult, autoStopRarity, isMoon]);

    const savedHandleRoll = useRef(handleRoll);
    useEffect(() => { savedHandleRoll.current = handleRoll; }, [handleRoll]);

    useEffect(() => {
        if (isAutoSpinning && !inspectedItem) {
            if (autoSpinRef.current) clearInterval(autoSpinRef.current);
            autoSpinRef.current = window.setInterval(() => { if (savedHandleRoll.current) savedHandleRoll.current(); }, autoSpinSpeed);
        } else {
            if (autoSpinRef.current) clearInterval(autoSpinRef.current);
            autoSpinRef.current = null;
        }
        return () => { if (autoSpinRef.current) clearInterval(autoSpinRef.current); };
    }, [isAutoSpinning, autoSpinSpeed, inspectedItem]);

    const handleInspectItem = (item: InventoryItem) => {
        audioService.playClick();
        setIsAutoSpinning(false);
        setInspectedItem({ text: item.text, description: item.description, rarityId: item.rarityId, variantId: item.variantId, cutscenePhrase: '', isFullScreen: true });
        setModalsState(prev => ({ ...prev, isInventoryOpen: false }));
    };

    const handleBurstClick = () => { audioService.playClick(); handleRoll(50); };
    const handleTicTacToeWin = () => { setStats(prev => ({ ...prev, ticTacToeWins: (prev.ticTacToeWins || 0) + 1 })); };

    const handleSetBalance = () => {
        const val = parseInt(overrideBalance);
        if (!isNaN(val)) {
            setStats(prev => ({ ...prev, balance: val }));
            audioService.playCoinWin(3);
        }
    };

    const handleSetWins = () => {
        const val = parseInt(overrideWins);
        if (!isNaN(val)) {
            setStats(prev => ({ ...prev, ticTacToeWins: val }));
            audioService.playRaritySound(RarityId.LEGENDARY);
        }
    };

    // --- DERIVED STATE ---
    const activeRarityVFX = inspectedItem ? inspectedItem.rarityId : getBestDrop(currentDrops)?.rarityId;
    const currentGlobalLuck = (1 + (stats.luckLevel * 0.2) + getCraftingBonuses(stats.equippedItems, 'GENERAL').bonusLuck) * luckMultiplier * trophyLuckMult;
    const currentMineLuck = ((1 + (stats.miningLuckLevel * 0.5)) + getCraftingBonuses(stats.equippedItems, 'MINING').bonusLuck) * trophyLuckMult * miningLuckMultiplier;
    const currentGoldMineLuck = ((1 + (stats.goldMiningLuckLevel * 0.5)) + getCraftingBonuses(stats.equippedItems, 'GOLD_MINING').bonusLuck) * trophyLuckMult * miningLuckMultiplier;
    const currentPrismMineLuck = ((1 + (stats.prismMiningLuckLevel * 0.5)) + getCraftingBonuses(stats.equippedItems, 'PRISM_MINING').bonusLuck) * trophyLuckMult * miningLuckMultiplier;
    const currentFishLuck = ((1 + (stats.fishingLuckLevel * 0.5)) + getCraftingBonuses(stats.equippedItems, 'FISHING').bonusLuck) * trophyLuckMult * fishingLuckMultiplier;
    const currentHarvLuck = ((1 + (stats.harvestingLuckLevel * 0.5)) + getCraftingBonuses(stats.equippedItems, 'HARVESTING').bonusLuck) * trophyLuckMult * harvestingLuckMultiplier;

    const containerClass = isMoon
        ? "bg-slate-950 text-slate-200 selection:bg-slate-200 selection:text-slate-950"
        : "bg-background text-text selection:bg-text selection:text-background";

    return (
        <div className={`relative min-h-screen flex transition-colors duration-1000 ${containerClass} ${activeSequence === 'SPECTRUM' ? 'animate-spectrum-buildup' : activeSequence === 'NIGHTMARE' ? 'animate-nightmare-buildup' : activeSequence === 'LUNAR' ? 'animate-lunar-buildup' : ''}`}>
            {activeRarityVFX && <SpecialEffects rarityId={activeRarityVFX} />}
            {inspectedItem && <ItemVisualizer item={inspectedItem} onClose={() => setInspectedItem(null)} />}
            {isMoon && (
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,_rgba(255,255,255,0.1),transparent_70%)]" />
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="absolute bg-slate-400 rounded-full animate-float opacity-20"
                            style={{ width: Math.random() * 4 + 1 + 'px', height: Math.random() * 4 + 1 + 'px', left: Math.random() * 100 + '%', top: Math.random() * 100 + '%', animationDuration: Math.random() * 10 + 10 + 's' }}
                        />
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_300px] xl:grid-cols-[1fr_2fr_350px] w-full h-screen relative z-10">
                <div className="relative flex flex-col items-center justify-center col-span-1 lg:col-span-2 lg:border-r border-surface-highlight h-full">
                    <div className="absolute top-0 left-0 w-full p-6 z-20 pointer-events-none flex flex-col md:flex-row justify-between items-start gap-4">
                        <div style={{ pointerEvents: 'auto' }}>
                            <LeftPanel
                                stats={stats}
                                currentGlobalLuck={currentGlobalLuck}
                                autoSpinSpeed={autoSpinSpeed}
                                generalMulti={(stats.multiRollLevel || 1) + getCraftingBonuses(stats.equippedItems, 'GENERAL').bonusMulti}
                                trophyLuckMult={trophyLuckMult}
                                onTicTacToeWin={handleTicTacToeWin}
                                onOpenStats={() => { console.log('App: onOpenStats called'); setModalsState(p => ({ ...p, isStatsOpen: true })); }}
                            />
                        </div>
                        <div className="flex flex-wrap justify-end gap-2 pointer-events-auto ml-auto" style={{ pointerEvents: 'auto' }}>
                            {stats.moonTravelUnlocked && (
                                <>
                                    <button onClick={() => { audioService.playRaritySound(RarityId.DIVINE); setIsMoon(!isMoon); }} className={`border px-4 py-2 transition-all uppercase backdrop-blur font-bold ${isMoon ? 'bg-slate-800 border-slate-500 text-slate-300' : 'bg-black/50 border-indigo-500 text-indigo-400 hover:bg-indigo-900/30'}`}>
                                        {isMoon ? "RETURN EARTH" : "MOON TRAVEL"}
                                    </button>
                                    <button onClick={() => setModalsState(p => ({ ...p, isMoonInventoryOpen: true }))} className="border border-slate-600 text-slate-400 hover:bg-slate-800 px-4 py-2 transition-all uppercase bg-black/50 backdrop-blur">
                                        LUNAR VAULT
                                    </button>
                                </>
                            )}
                            <div className="flex items-center gap-2 border border-neutral-700 bg-black/50 backdrop-blur px-2 py-1 rounded min-w-[120px]">
                                <span className="text-xs text-neutral-400 font-mono">{volume > 0 ? '🔊' : '🔇'}</span>
                                <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="w-20 h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-white" />
                            </div>
                            <button onClick={() => { console.log('GACHA clicked'); audioService.playClick(); setModalsState(p => ({ ...p, isGachaOpen: true })); }} className="border border-purple-700 text-purple-400 hover:bg-purple-900/30 px-4 py-2 transition-all uppercase bg-black/50 backdrop-blur">GACHA</button>
                            <button onClick={() => { audioService.playClick(); setModalsState(p => ({ ...p, isCraftingOpen: true })); }} className="border border-green-700 text-green-500 hover:bg-green-900/30 px-4 py-2 transition-all uppercase bg-black/50 backdrop-blur">CRAFT</button>
                            <button onClick={() => { audioService.playClick(); setModalsState(p => ({ ...p, isCoinTossOpen: true })); }} className="border border-yellow-700 text-yellow-500 hover:bg-yellow-900/30 px-4 py-2 transition-all uppercase bg-black/50 backdrop-blur animate-pulse">FLIP</button>
                            <button onClick={() => { console.log('TITLES clicked'); audioService.playClick(); setModalsState(p => ({ ...p, isAchievementsOpen: true })); }} className="border border-amber-700 text-amber-500 hover:bg-amber-900/30 px-4 py-2 transition-all uppercase bg-black/50 backdrop-blur">TITLES</button>
                            <button onClick={() => { audioService.playClick(); setModalsState(p => ({ ...p, isIndexOpen: true })); }} className="border border-indigo-900 text-indigo-400 hover:bg-indigo-900/30 hover:text-white px-4 py-2 transition-all uppercase bg-black/50 backdrop-blur">INDEX</button>
                            <button onClick={() => { audioService.playClick(); setModalsState(p => ({ ...p, isInventoryOpen: true })); }} className="border border-neutral-700 hover:border-white hover:text-white px-4 py-2 transition-all uppercase bg-black/50 backdrop-blur">{T.UI.INVENTORY} [{inventory.length}]</button>
                        </div>
                    </div>

                    <CenterPanel
                        stats={stats}
                        currentDrops={currentDrops}
                        isAutoSpinning={isAutoSpinning}
                        inspectedItem={inspectedItem}
                        autoSpinSpeed={autoSpinSpeed}
                        handleRoll={handleRoll}
                        handleBurstClick={handleBurstClick}
                        setIsAutoSpinning={setIsAutoSpinning}
                        generalMulti={(stats.multiRollLevel || 1) + getCraftingBonuses(stats.equippedItems, 'GENERAL').bonusMulti}
                        formatProb={formatProb}
                    />

                    <div className="absolute bottom-0 w-full p-6 flex justify-between items-end z-20 pointer-events-none">
                        <div className="flex gap-4 items-center pointer-events-auto">
                            <div className="text-neutral-800 text-xs font-mono uppercase tracking-widest">v3.5.0 PRISM</div>
                            <button onClick={() => setModalsState(p => ({ ...p, isChangelogOpen: true }))} className="text-neutral-700 hover:text-white text-xs font-mono underline">CHANGELOG</button>
                            <button onClick={() => setModalsState(p => ({ ...p, isUnlockConditionsOpen: true }))} className="text-neutral-700 hover:text-white text-xs font-mono underline uppercase">UNLOCKS</button>
                        </div>
                        <button onClick={() => setModalsState(p => ({ ...p, isAdminOpen: true }))} className="pointer-events-auto text-neutral-800 hover:text-neutral-500 text-xs font-mono uppercase transition-colors">[ {T.UI.SYSTEM_CONFIG} ]</button>
                    </div>
                </div>

                <RightPanel
                    activeRightPanel={activeRightPanel}
                    setActiveRightPanel={setActiveRightPanel}
                    miningGame={{
                        ...currentMiningGame,
                        currentDimension: miningDimension,
                        setDimension: setMiningDimension, // Pass setter for Dropdown
                        onToggleDimension: () => {
                            // Keep toggle for backward compat or if needed
                            if (miningDimension === 'NORMAL') {
                                if (stats.goldDimensionUnlocked) setMiningDimension('GOLD');
                                else if (stats.prismDimensionUnlocked) setMiningDimension('PRISM');
                            } else if (miningDimension === 'GOLD') {
                                if (stats.prismDimensionUnlocked) setMiningDimension('PRISM');
                                else setMiningDimension('NORMAL');
                            } else {
                                setMiningDimension('NORMAL');
                            }
                        },
                        // Mute Controls
                        isMuted: isMiningMuted,
                        toggleMute: () => setIsMiningMuted(prev => !prev)
                    }}
                    fishingGame={fishingGame}
                    harvestingGame={harvestingGame}
                    dreamingGame={dreamingGame}
                    stats={stats}
                    luckMultiplier={luckMultiplier}
                    trophyLuckMult={trophyLuckMult}
                    dreamBonuses={dreamBonuses}
                    setIsOreInventoryOpen={(v) => setModalsState(p => ({ ...p, isOreInventoryOpen: v }))}
                    setIsFishInventoryOpen={(v) => setModalsState(p => ({ ...p, isFishInventoryOpen: v }))}
                    setIsPlantInventoryOpen={(v) => setModalsState(p => ({ ...p, isPlantInventoryOpen: v }))}
                    setIsDreamInventoryOpen={(v) => setModalsState(p => ({ ...p, isDreamInventoryOpen: v }))}
                />
            </div>

            <GameModals
                stats={stats}
                inventory={inventory}
                miningGame={normalMiningGame}
                goldMiningGame={goldMiningGame}
                prismMiningGame={prismMiningGame}
                moonInventory={moonInventory}
                fishingGame={fishingGame}
                harvestingGame={harvestingGame}
                dreamingGame={dreamingGame}
                modalsState={modalsState}
                setModalsState={setModalsState}
                handlers={{
                    handleInspectItem, handleInspectResource, toggleLock, toggleResourceLock,
                    handleSellResources, handleSellDreams, handleSellMoonItems, handleCraftItem, handleEquipItem,
                    handleUnequipItem, handleIndexSelectItem, setStats
                }}
            />

            <SystemConfig
                isOpen={modalsState.isAdminOpen}
                onClose={() => setModalsState(p => ({ ...p, isAdminOpen: false }))}
                stats={stats}
                setStats={setStats}
                currentTheme={currentTheme}
                setCurrentTheme={setCurrentTheme}
                autoSpinSpeed={autoSpinSpeed}
                setAutoSpinSpeed={setAutoSpinSpeed}
                luckMultiplier={luckMultiplier}
                setLuckMultiplier={setLuckMultiplier}
                miningSpeed={miningSpeed}
                setMiningSpeed={setMiningSpeed}
                miningLuckMultiplier={miningLuckMultiplier}
                setMiningLuckMultiplier={setMiningLuckMultiplier}
                fishingSpeed={fishingSpeed}
                setFishingSpeed={setFishingSpeed}
                fishingLuckMultiplier={fishingLuckMultiplier}
                setFishingLuckMultiplier={setFishingLuckMultiplier}
                harvestingSpeed={harvestingSpeed}
                setHarvestingSpeed={setHarvestingSpeed}
                harvestingLuckMultiplier={harvestingLuckMultiplier}
                setHarvestingLuckMultiplier={setHarvestingLuckMultiplier}
                dreamingLuckMultiplier={dreamingLuckMultiplier}
                setDreamingLuckMultiplier={setDreamingLuckMultiplier}
                miningDimension={miningDimension}
                setMiningDimension={setMiningDimension}
                overrideBalance={overrideBalance}
                setOverrideBalance={setOverrideBalance}
                overrideWins={overrideWins}
                setOverrideWins={setOverrideWins}
                handleSetBalance={handleSetBalance}
                handleSetWins={handleSetWins}
                setInventory={setInventory}
                setMoonInventory={setMoonInventory}
                setOreInventory={normalMiningGame.setInventory}
                setGoldOreInventory={goldMiningGame.setInventory}
                setFishInventory={fishingGame.setInventory}
                setPlantInventory={harvestingGame.setInventory}
                setDreamInventory={dreamingGame.setInventory}
                achievements={ACHIEVEMENTS}
            />

            <StatsModal
                isOpen={modalsState.isStatsOpen}
                onClose={() => setModalsState(p => ({ ...p, isStatsOpen: false }))}
                stats={stats}
                currentGlobalLuck={currentGlobalLuck}
                autoSpinSpeed={autoSpinSpeed}
                generalMulti={(stats.multiRollLevel || 1) + getCraftingBonuses(stats.equippedItems, 'GENERAL').bonusMulti}
                currentMineLuck={currentMineLuck}
                miningSpeed={miningSpeed}
                currentGoldMineLuck={currentGoldMineLuck}
                goldMiningSpeed={goldMiningSpeed}
                currentPrismMineLuck={currentPrismMineLuck}
                prismMiningSpeed={prismMiningSpeed}
                currentFishLuck={currentFishLuck}
                fishingSpeed={fishingSpeed}
                currentHarvLuck={currentHarvLuck}
                harvestingSpeed={harvestingSpeed}
                dreamBonuses={dreamBonuses}
            />

            <UnlockConditionsModal
                isOpen={modalsState.isUnlockConditionsOpen}
                onClose={() => setModalsState(p => ({ ...p, isUnlockConditionsOpen: false }))}
                stats={stats}
            />

            {activeRarityVFX && activeRarityVFX >= RarityId.DIVINE && (
                <div key={Date.now()} className="absolute inset-0 bg-white pointer-events-none animate-flash z-40 mix-blend-overlay opacity-50" />
            )}

            <SpectrumStyles />
            <LunarStyles />

            <style>{`
        @keyframes flash { 0% { opacity: 0.8; } 100% { opacity: 0; } }
        .animate-flash { animation: flash 0.5s ease-out forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.2s ease-out forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes float { 
            0% { transform: translateY(0px) translateX(0px); } 
            33% { transform: translateY(-10px) translateX(5px); } 
            66% { transform: translateY(5px) translateX(-5px); } 
            100% { transform: translateY(0px) translateX(0px); } 
        }
        .animate-float { animation: float linear infinite; }
      `}</style>
        </div>
    );
}