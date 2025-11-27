export enum RarityId {
    COMMON = 1,
    UNCOMMON,
    RARE,
    EPIC,
    LEGENDARY,
    MYTHICAL,
    DIVINE,
    OTHERWORLDLY,
    COSMIC,
    EXTREME,
    ABYSSAL,
    PRIMORDIAL,
    INFINITE,
    CHAOS,
    THE_ONE,
    MOON = 99
}

export enum VariantId {
    NONE = 0,
    GILDED,      // x2
    HOLOGRAPHIC, // x5
    RADIOACTIVE, // x10
    VOLCANIC,    // x25
    GLACIAL,     // x50
    ABYSSAL,     // x100
    CELESTIAL,   // x250
    QUANTUM,     // x500
    NEGATIVE,    // x1000
    PURE         // x10000
}

export type Language = 'en';

export interface RarityTier {
    id: RarityId;
    name: string;
    probability: number;
    color: string;
    textColor: string;
    shadowColor: string;
    animate?: boolean;
}

export interface VariantTier {
    id: VariantId;
    name: string;
    prefix: string;
    multiplier: number; // Multiplies base rarity probability
    styleClass: string; // Tailwind classes for text effects
    borderClass: string; // For visualizer borders
}

export interface ItemData {
    text: string;
    description: string;
    cutscenePhrase?: string;
}

export interface MoonItem extends ItemData {
    id: number;
    probability: number; // 1 in X
}

export interface Drop {
    text: string;
    description: string;
    cutscenePhrase?: string;
    rarityId: RarityId;
    variantId?: VariantId; // New optional field
    timestamp: number;
    rollNumber: number;
}

export interface InventoryItem {
    text: string;
    description: string;
    rarityId: RarityId;
    variantId?: VariantId;
    count: number;
    discoveredAt: number;
    locked?: boolean;
}

// --- MINING TYPES ---

export interface Ore {
    id: number;
    name: string;
    description: string;
    probability: number; // 1 in X
    color: string; // Text color class
    glowColor: string; // CSS color for shadows
    tierName: string;
    dimension?: 'NORMAL' | 'GOLD' | 'PRISM'; // New field
}

export interface OreInventoryItem {
    id: number; // Reference to Ore ID
    count: number;
    discoveredAt: number;
    locked?: boolean;
}

// --- FISHING TYPES ---

export interface Fish {
    id: number;
    name: string;
    description: string;
    probability: number; // 1 in X
    color: string;
    glowColor: string;
    tierName: string;
}

export interface FishInventoryItem {
    id: number; // Reference to Fish ID
    count: number;
    discoveredAt: number;
    locked?: boolean;
}

// --- HARVESTING TYPES ---

export interface Plant {
    id: number;
    name: string;
    description: string;
    probability: number; // 1 in X
    color: string;
    glowColor: string;
    tierName: string;
}

export interface PlantInventoryItem {
    id: number; // Reference to Plant ID
    count: number;
    discoveredAt: number;
    locked?: boolean;
}

// --- DREAMING TYPES ---

export interface Dream {
    id: number;
    name: string;
    description: string;
    probability: number; // 1 in X (Base)
    stabilityDrain: number; // How much stability this dream costs
    color: string;
    glowColor: string;
    tierName: string; // "Lucid", "Nightmare", etc.
}

export interface DreamInventoryItem {
    id: number;
    count: number;
    discoveredAt: number;
    locked?: boolean;
}

// --- MOON INVENTORY ---
export interface MoonInventoryItem {
    id: number; // Reference to MOON_ITEMS id
    count: number;
    discoveredAt: number;
    locked?: boolean;
}

export interface Achievement {
    id: string;
    title: string; // The reward title
    description: string;
    condition: (stats: GameStats, inventory: InventoryItem[]) => boolean;
}

// --- CRAFTING TYPES ---

// UPDATED: Added GOLD_MINING and PRISM_MINING category
export type CraftingCategory = 'GENERAL' | 'MINING' | 'GOLD_MINING' | 'PRISM_MINING' | 'FISHING' | 'HARVESTING' | 'DREAMING';
export type CraftingType = 'BOOST' | 'MULTI' | 'SPECIAL';

export interface CraftingMaterial {
    type: 'ORE' | 'FISH' | 'PLANT' | 'DREAM' | 'ITEM' | 'MOON';
    id: number | string; // ID of the resource
    count: number;
}

export interface CraftableItem {
    id: string;
    name: string;
    description: string;
    tier: number; // 1 to 15
    category: CraftingCategory;
    type: CraftingType; // New: Determines which slot it occupies
    bonuses: {
        luck?: number; // Multiplier add (e.g. 0.1 for +10%)
        speed?: number; // ms reduction
        yield?: number; // deprecated/unused for now, using multi
        multi?: number; // Additive to multi-roll

        // Dreaming Specific
        stability?: number; // Additive to base stability
        stabilityRegen?: number; // Chance to regen
    };
    recipe: {
        materials: CraftingMaterial[];
        cost: number;
    };
    unlocksFeature?: 'MOON_TRAVEL' | 'PRISM_MINE'; // Special unlock flag
}

export interface GameStats {
    totalRolls: number;
    totalMoonRolls?: number; // New: Explicit counter for Moon rolls
    balance: number;
    moonBalance?: number; // New Moon Currency
    startTime: number;
    bestRarityFound: RarityId;

    // Main Upgrades
    multiRollLevel: number; // 1 to 10 (or higher via Admin)
    speedLevel: number; // Index for SPEED_TIERS
    luckLevel: number; // New: Global Luck Multiplier Level

    entropy: number; // Pity counter
    hasBurst: boolean; // Unlock status
    moonTravelUnlocked?: boolean; // New: Moon Travel Unlock

    unlockedAchievements: string[]; // Array of achievement IDs
    equippedTitle: string | null;

    // Crafting
    craftedItems: Record<string, boolean>; // ID -> owned status
    equippedItems: {
        // Format: "CATEGORY_TYPE": "itemId"
        // e.g. "GENERAL_BOOST": "gen_1", "GOLD_MINING_BOOST": "gold_1"
        [key: string]: string | null;
    };

    // Mining Stats & Upgrades
    totalMined: number;
    totalGoldMined?: number; // New: Explicit counter for Gold Mined
    totalPrismMined?: number; // New: Explicit counter for Prism Mined
    bestOreMined: number; // ID of best ore
    bestGoldOreMined?: number; // New: Track separate gold ore best
    bestPrismOreMined?: number; // New: Track separate prism ore best

    // Standard Mining Upgrades
    miningSpeedLevel: number;
    miningLuckLevel: number;
    miningMultiLevel: number;

    // Gold Mining Upgrades (Separated)
    goldMiningSpeedLevel?: number;
    goldMiningLuckLevel?: number;
    goldMiningMultiLevel?: number;

    // Prism Mining Upgrades (Separated)
    prismMiningSpeedLevel?: number;
    prismMiningLuckLevel?: number;
    prismMiningMultiLevel?: number;

    goldDimensionUnlocked: boolean; // New: Gold Dimension Unlock
    prismDimensionUnlocked?: boolean; // New: Prism Dimension Unlock

    // Fishing Stats & Upgrades
    totalFished: number;
    bestFishCaught: number;
    fishingSpeedLevel: number;
    fishingLuckLevel: number;
    fishingMultiLevel: number;

    // Harvesting Stats & Upgrades
    totalHarvested: number;
    bestPlantHarvested: number;
    harvestingSpeedLevel: number;
    harvestingLuckLevel: number;
    harvestingMultiLevel: number;

    // Dreaming Stats
    totalDreamt: number;
    bestDreamFound: number;

    // Moon Stats
    bestMoonItemFound?: number; // New

    // Gacha
    gachaCredits: number;

    // --- NEW ---
    ticTacToeWins: number;
}
