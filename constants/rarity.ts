import { RarityId, RarityTier, VariantId, VariantTier, OreRarityId, GoldRarityId, PrismRarityId, FishRarityId, PlantRarityId, DreamRarityId, MoonRarityId } from '../types';

export const RARITY_TIERS: Record<RarityId, RarityTier> = {
    [RarityId.COMMON]: {
        id: RarityId.COMMON,
        name: "Common",
        probability: 5,
        color: "border-gray-600",
        textColor: "text-gray-400",
        shadowColor: "rgba(156, 163, 175, 0)",
    },
    [RarityId.UNCOMMON]: {
        id: RarityId.UNCOMMON,
        name: "Uncommon",
        probability: 20,
        color: "border-green-600",
        textColor: "text-green-400",
        shadowColor: "rgba(74, 222, 128, 0.2)",
    },
    [RarityId.RARE]: {
        id: RarityId.RARE,
        name: "Rare",
        probability: 100,
        color: "border-blue-600",
        textColor: "text-blue-400",
        shadowColor: "rgba(96, 165, 250, 0.3)",
    },
    [RarityId.EPIC]: {
        id: RarityId.EPIC,
        name: "Epic",
        probability: 500,
        color: "border-purple-600",
        textColor: "text-purple-400",
        shadowColor: "rgba(192, 132, 252, 0.4)",
    },
    [RarityId.LEGENDARY]: {
        id: RarityId.LEGENDARY,
        name: "Legendary",
        probability: 2500,
        color: "border-yellow-600",
        textColor: "text-yellow-400",
        shadowColor: "rgba(250, 204, 21, 0.5)",
    },
    [RarityId.MYTHICAL]: {
        id: RarityId.MYTHICAL,
        name: "Mythical",
        probability: 12500,
        color: "border-pink-600",
        textColor: "text-pink-400",
        shadowColor: "rgba(244, 114, 182, 0.5)",
    },
    [RarityId.DIVINE]: {
        id: RarityId.DIVINE,
        name: "Divine",
        probability: 100000,
        color: "border-cyan-500",
        textColor: "text-cyan-300",
        shadowColor: "rgba(103, 232, 249, 0.6)",
        animate: true,
    },
    [RarityId.OTHERWORLDLY]: {
        id: RarityId.OTHERWORLDLY,
        name: "Otherworldly",
        probability: 500000,
        color: "border-indigo-500",
        textColor: "text-indigo-300",
        shadowColor: "rgba(165, 180, 252, 0.6)",
        animate: true,
    },
    [RarityId.COSMIC]: {
        id: RarityId.COSMIC,
        name: "Cosmic",
        probability: 2500000,
        color: "border-violet-500",
        textColor: "text-violet-300",
        shadowColor: "rgba(196, 181, 253, 0.7)",
        animate: true,
    },
    [RarityId.EXTREME]: {
        id: RarityId.EXTREME,
        name: "Extreme",
        probability: 10000000,
        color: "border-red-600",
        textColor: "text-red-500",
        shadowColor: "rgba(239, 68, 68, 0.8)",
        animate: true,
    },
    [RarityId.ABYSSAL]: {
        id: RarityId.ABYSSAL,
        name: "Abyssal",
        probability: 50000000,
        color: "border-slate-800",
        textColor: "text-slate-200",
        shadowColor: "rgba(15, 23, 42, 0.9)",
        animate: true,
    },
    [RarityId.PRIMORDIAL]: {
        id: RarityId.PRIMORDIAL,
        name: "Primordial",
        probability: 250000000,
        color: "border-orange-600",
        textColor: "text-orange-500",
        shadowColor: "rgba(249, 115, 22, 0.9)",
        animate: true,
    },
    [RarityId.INFINITE]: {
        id: RarityId.INFINITE,
        name: "Infinite",
        probability: 1000000000,
        color: "border-teal-400",
        textColor: "text-teal-200",
        shadowColor: "rgba(45, 212, 191, 1)",
        animate: true,
    },
    [RarityId.CHAOS]: {
        id: RarityId.CHAOS,
        name: "Chaos",
        probability: 10000000000,
        color: "border-fuchsia-600",
        textColor: "text-fuchsia-500",
        shadowColor: "rgba(217, 70, 239, 1)",
        animate: true,
    },
    [RarityId.THE_ONE]: {
        id: RarityId.THE_ONE,
        name: "The One",
        probability: 1000000000000,
        color: "border-white",
        textColor: "text-white",
        shadowColor: "rgba(255, 255, 255, 1)",
        animate: true,
    },
    [RarityId.MOON]: {
        id: RarityId.MOON,
        name: "Moon",
        probability: 1, // Variable, handled by subgame logic
        color: "border-slate-400",
        textColor: "text-slate-200",
        shadowColor: "rgba(226, 232, 240, 0.8)",
        animate: true
    }
};

export const MOON_RARITY_TIERS: Record<MoonRarityId, Partial<RarityTier>> = {
    [MoonRarityId.COMMON]: { name: "Common", color: "border-gray-500", textColor: "text-gray-400", shadowColor: "#9ca3af" },
    [MoonRarityId.UNCOMMON]: { name: "Uncommon", color: "border-slate-400", textColor: "text-slate-300", shadowColor: "#cbd5e1" },
    [MoonRarityId.RARE]: { name: "Rare", color: "border-blue-400", textColor: "text-blue-300", shadowColor: "#93c5fd" },
    [MoonRarityId.EPIC]: { name: "Epic", color: "border-indigo-400", textColor: "text-indigo-300", shadowColor: "#a5b4fc" },
    [MoonRarityId.LEGENDARY]: { name: "Legendary", color: "border-purple-500", textColor: "text-purple-300", shadowColor: "#c084fc" },
    [MoonRarityId.MYTHICAL]: { name: "Mythical", color: "border-pink-500", textColor: "text-pink-300", shadowColor: "#f472b6" },
    [MoonRarityId.DIVINE]: { name: "Divine", color: "border-yellow-400", textColor: "text-yellow-200", shadowColor: "#fde047", animate: true },
    [MoonRarityId.COSMIC]: { name: "Cosmic", color: "border-cyan-400", textColor: "text-cyan-200", shadowColor: "#67e8f9", animate: true },
    [MoonRarityId.INFINITE]: { name: "Infinite", color: "border-teal-400", textColor: "text-teal-200", shadowColor: "#5eead4", animate: true },
    [MoonRarityId.THE_MOON]: { name: "The Moon", color: "border-white", textColor: "text-white", shadowColor: "#ffffff", animate: true },
};

export const ORE_RARITY_TIERS: Record<OreRarityId, Partial<RarityTier>> = {
    [OreRarityId.COMMON]: { name: "Common", color: "border-stone-500", textColor: "text-stone-400", shadowColor: "#78716c" },
    [OreRarityId.UNCOMMON]: { name: "Uncommon", color: "border-slate-500", textColor: "text-slate-400", shadowColor: "#64748b" },
    [OreRarityId.RARE]: { name: "Rare", color: "border-emerald-600", textColor: "text-emerald-400", shadowColor: "#34d399" },
    [OreRarityId.PRECIOUS]: { name: "Precious", color: "border-amber-500", textColor: "text-amber-400", shadowColor: "#fbbf24" },
    [OreRarityId.EPIC]: { name: "Epic", color: "border-purple-600", textColor: "text-purple-400", shadowColor: "#a855f7" },
    [OreRarityId.INDUSTRIAL_PLUS]: { name: "Industrial+", color: "border-blue-700", textColor: "text-blue-500", shadowColor: "#3b82f6" },
    [OreRarityId.DENSE]: { name: "Dense", color: "border-indigo-800", textColor: "text-indigo-400", shadowColor: "#6366f1" },
    [OreRarityId.GEOMETRIC]: { name: "Geometric", color: "border-fuchsia-500", textColor: "text-fuchsia-400", shadowColor: "#e879f9" },
    [OreRarityId.RADIOACTIVE]: { name: "Radioactive", color: "border-lime-500", textColor: "text-lime-400", shadowColor: "#84cc16", animate: true },
    [OreRarityId.VOLCANIC]: { name: "Volcanic", color: "border-red-800", textColor: "text-red-500", shadowColor: "#ef4444" },
    [OreRarityId.ELVEN]: { name: "Elven", color: "border-teal-300", textColor: "text-teal-200", shadowColor: "#5eead4" },
    [OreRarityId.ATLANTEAN]: { name: "Atlantean", color: "border-cyan-500", textColor: "text-cyan-400", shadowColor: "#22d3ee" },
    [OreRarityId.DWARVEN]: { name: "Dwarven", color: "border-red-900", textColor: "text-red-700", shadowColor: "#991b1b" },
    [OreRarityId.RUNIC]: { name: "Runic", color: "border-sky-600", textColor: "text-sky-500", shadowColor: "#0ea5e9" },
    [OreRarityId.DARK]: { name: "Dark", color: "border-black", textColor: "text-gray-500", shadowColor: "#000000" },
    [OreRarityId.LUNAR]: { name: "Lunar", color: "border-indigo-200", textColor: "text-indigo-100", shadowColor: "#c7d2fe" },
    [OreRarityId.SOLAR]: { name: "Solar", color: "border-orange-500", textColor: "text-orange-400", shadowColor: "#f97316" },
    [OreRarityId.INFERNAL]: { name: "Infernal", color: "border-red-600", textColor: "text-red-500", shadowColor: "#dc2626", animate: true },
    [OreRarityId.DIVINE]: { name: "Divine", color: "border-yellow-400", textColor: "text-yellow-300", shadowColor: "#facc15", animate: true },
    [OreRarityId.VOID]: { name: "Void", color: "border-violet-900", textColor: "text-violet-500", shadowColor: "#4c1d95" },
    [OreRarityId.FUTURE]: { name: "Future", color: "border-gray-100", textColor: "text-gray-200", shadowColor: "#f3f4f6" },
    [OreRarityId.RESISTANT]: { name: "Resistant", color: "border-slate-600", textColor: "text-slate-500", shadowColor: "#64748b" },
    [OreRarityId.MANDALORIAN]: { name: "Mandalorian", color: "border-zinc-400", textColor: "text-zinc-300", shadowColor: "#d4d4d8" },
    [OreRarityId.WAKANDAN]: { name: "Wakandan", color: "border-indigo-500", textColor: "text-indigo-400", shadowColor: "#818cf8" },
    [OreRarityId.INDESTRUCTIBLE]: { name: "Indestructible", color: "border-neutral-500", textColor: "text-neutral-400", shadowColor: "#a3a3a3" },
    [OreRarityId.ASGARDIAN]: { name: "Asgardian", color: "border-stone-600", textColor: "text-stone-500", shadowColor: "#57534e" },
    [OreRarityId.ALIEN]: { name: "Alien", color: "border-lime-400", textColor: "text-lime-300", shadowColor: "#a3e635", animate: true },
    [OreRarityId.MASS_EFFECT]: { name: "Mass Effect", color: "border-blue-500", textColor: "text-blue-400", shadowColor: "#3b82f6" },
    [OreRarityId.TOXIC]: { name: "Toxic", color: "border-green-500", textColor: "text-green-400", shadowColor: "#22c55e", animate: true },
    [OreRarityId.IMPOSSIBLE]: { name: "Impossible", color: "border-gray-500", textColor: "text-gray-400", shadowColor: "#9ca3af" },
    [OreRarityId.SPACE]: { name: "Space", color: "border-stone-500", textColor: "text-stone-400", shadowColor: "#78716c" },
    [OreRarityId.STELLAR]: { name: "Stellar", color: "border-yellow-200", textColor: "text-yellow-100", shadowColor: "#fef9c3", animate: true },
    [OreRarityId.QUANTUM]: { name: "Quantum", color: "border-fuchsia-500", textColor: "text-fuchsia-400", shadowColor: "#e879f9" },
    [OreRarityId.ABYSSAL]: { name: "Abyssal", color: "border-indigo-950", textColor: "text-indigo-800", shadowColor: "#1e1b4b" },
    [OreRarityId.VOLATILE]: { name: "Volatile", color: "border-white", textColor: "text-white", shadowColor: "#ffffff", animate: true },
    [OreRarityId.SINGULARITY]: { name: "Singularity", color: "border-black", textColor: "text-gray-200", shadowColor: "#000000", animate: true },
    [OreRarityId.PHOTONIC]: { name: "Photonic", color: "border-yellow-50", textColor: "text-yellow-100", shadowColor: "#fefce8" },
    [OreRarityId.CHRONAL]: { name: "Chronal", color: "border-cyan-300", textColor: "text-cyan-200", shadowColor: "#67e8f9" },
    [OreRarityId.PSIONIC]: { name: "Psionic", color: "border-pink-300", textColor: "text-pink-200", shadowColor: "#f9a8d4" },
    [OreRarityId.SONIC]: { name: "Sonic", color: "border-emerald-300", textColor: "text-emerald-200", shadowColor: "#6ee7b7" },
    [OreRarityId.FOURTH_DIMENSION]: { name: "4th Dimension", color: "border-violet-400", textColor: "text-violet-300", shadowColor: "#a78bfa" }
};

export const GOLD_RARITY_TIERS: Record<GoldRarityId, Partial<RarityTier>> = {
    [GoldRarityId.GILDED]: { name: "Gilded", color: "border-yellow-600", textColor: "text-yellow-500", shadowColor: "#ca8a04" },
    [GoldRarityId.RADIANT]: { name: "Radiant", color: "border-amber-400", textColor: "text-amber-300", shadowColor: "#fbbf24", animate: true },
    [GoldRarityId.DIVINE]: { name: "Divine", color: "border-yellow-200", textColor: "text-yellow-100", shadowColor: "#fef08a", animate: true },
    [GoldRarityId.ABSOLUTE]: { name: "Absolute", color: "border-red-500", textColor: "text-red-400", shadowColor: "#ef4444", animate: true },
    [GoldRarityId.THE_GOLD]: { name: "THE GOLD", color: "border-yellow-500", textColor: "text-yellow-400", shadowColor: "#eab308", animate: true }
};

export const PRISM_RARITY_TIERS: Record<PrismRarityId, Partial<RarityTier>> = {
    [PrismRarityId.REFRACTIVE]: { name: "Refractive", color: "border-cyan-100", textColor: "text-cyan-50", shadowColor: "#cffafe" },
    [PrismRarityId.CHROMATIC]: { name: "Chromatic", color: "border-emerald-300", textColor: "text-emerald-200", shadowColor: "#6ee7b7" },
    [PrismRarityId.LUMINOUS]: { name: "Luminous", color: "border-indigo-300", textColor: "text-indigo-200", shadowColor: "#a5b4fc" },
    [PrismRarityId.SPECTRAL]: { name: "Spectral", color: "border-fuchsia-300", textColor: "text-fuchsia-200", shadowColor: "#f0abfc", animate: true },
    [PrismRarityId.RADIANT]: { name: "Radiant", color: "border-violet-400", textColor: "text-violet-300", shadowColor: "#a78bfa", animate: true },
    [PrismRarityId.DIMENSIONAL]: { name: "Dimensional", color: "border-rose-400", textColor: "text-rose-300", shadowColor: "#fb7185", animate: true },
    [PrismRarityId.THE_SOURCE]: { name: "THE SOURCE", color: "border-white", textColor: "text-white", shadowColor: "#ffffff", animate: true }
};

export const FISH_RARITY_TIERS: Record<FishRarityId, Partial<RarityTier>> = {
    [FishRarityId.COMMON]: { name: "Common", color: "border-blue-300", textColor: "text-blue-200", shadowColor: "#93c5fd" },
    [FishRarityId.TRASH]: { name: "Trash", color: "border-stone-500", textColor: "text-stone-400", shadowColor: "#78716c" },
    [FishRarityId.UNCOMMON]: { name: "Uncommon", color: "border-green-500", textColor: "text-green-400", shadowColor: "#22c55e" },
    [FishRarityId.PREDATOR]: { name: "Predator", color: "border-red-500", textColor: "text-red-400", shadowColor: "#ef4444" },
    [FishRarityId.RARE]: { name: "Rare", color: "border-cyan-500", textColor: "text-cyan-400", shadowColor: "#06b6d4" },
    [FishRarityId.DEEP]: { name: "Deep", color: "border-indigo-600", textColor: "text-indigo-400", shadowColor: "#4f46e5" },
    [FishRarityId.CRYPTO]: { name: "Crypto", color: "border-yellow-500", textColor: "text-yellow-400", shadowColor: "#eab308" },
    [FishRarityId.MALWARE]: { name: "Malware", color: "border-red-700", textColor: "text-red-500", shadowColor: "#b91c1c" },
    [FishRarityId.ABYSSAL]: { name: "Abyssal", color: "border-violet-900", textColor: "text-violet-400", shadowColor: "#4c1d95" },
    [FishRarityId.ERROR]: { name: "Error", color: "border-neutral-500", textColor: "text-neutral-400", shadowColor: "#737373" },
    [FishRarityId.SYSTEM]: { name: "System", color: "border-green-600", textColor: "text-green-500", shadowColor: "#16a34a" },
    [FishRarityId.AI]: { name: "AI", color: "border-purple-500", textColor: "text-purple-400", shadowColor: "#a855f7" },
    [FishRarityId.COSMIC]: { name: "Cosmic", color: "border-black", textColor: "text-gray-300", shadowColor: "#000000", animate: true },
    [FishRarityId.CRYPTID]: { name: "Cryptid", color: "border-fuchsia-500", textColor: "text-fuchsia-400", shadowColor: "#d946ef" },
    [FishRarityId.ELDRITCH]: { name: "Eldritch", color: "border-green-900", textColor: "text-green-700", shadowColor: "#14532d" },
    [FishRarityId.LITERATURE]: { name: "Literature", color: "border-white", textColor: "text-gray-300", shadowColor: "#ffffff" },
    [FishRarityId.POKEMON]: { name: "Pokemon", color: "border-yellow-400", textColor: "text-yellow-300", shadowColor: "#facc15" },
    [FishRarityId.TEMPORAL]: { name: "Temporal", color: "border-blue-400", textColor: "text-blue-300", shadowColor: "#60a5fa" },
    [FishRarityId.QUANTUM]: { name: "Quantum", color: "border-neutral-400", textColor: "text-neutral-300", shadowColor: "#a3a3a3" },
    [FishRarityId.SERVER]: { name: "Server", color: "border-sky-300", textColor: "text-sky-200", shadowColor: "#7dd3fc" },
    [FishRarityId.BOSS]: { name: "Boss", color: "border-red-950", textColor: "text-red-800", shadowColor: "#450a0a", animate: true },
    [FishRarityId.CRITICAL]: { name: "Critical", color: "border-red-500", textColor: "text-red-500", shadowColor: "#ef4444" },
    [FishRarityId.DEV]: { name: "Dev", color: "border-yellow-300", textColor: "text-yellow-200", shadowColor: "#fde047" },
    [FishRarityId.SKY]: { name: "Sky", color: "border-cyan-200", textColor: "text-cyan-100", shadowColor: "#a5f3fc" },
    [FishRarityId.MAGMA]: { name: "Magma", color: "border-orange-600", textColor: "text-orange-500", shadowColor: "#ea580c" },
    [FishRarityId.DREAM]: { name: "Dream", color: "border-indigo-300", textColor: "text-indigo-200", shadowColor: "#a5b4fc" }
};

export const PLANT_RARITY_TIERS: Record<PlantRarityId, Partial<RarityTier>> = {
    [PlantRarityId.COMMON]: { name: "Common", color: "border-green-600", textColor: "text-green-500", shadowColor: "#16a34a" },
    [PlantRarityId.UNCOMMON]: { name: "Uncommon", color: "border-lime-500", textColor: "text-lime-400", shadowColor: "#84cc16" },
    [PlantRarityId.RARE]: { name: "Rare", color: "border-emerald-500", textColor: "text-emerald-400", shadowColor: "#10b981" },
    [PlantRarityId.MAGICAL]: { name: "Magical", color: "border-purple-500", textColor: "text-purple-400", shadowColor: "#a855f7" },
    [PlantRarityId.EPIC]: { name: "Epic", color: "border-amber-400", textColor: "text-amber-300", shadowColor: "#fbbf24" },
    [PlantRarityId.CELESTIAL]: { name: "Celestial", color: "border-sky-300", textColor: "text-sky-200", shadowColor: "#7dd3fc" },
    [PlantRarityId.VOID]: { name: "Void", color: "border-violet-900", textColor: "text-violet-500", shadowColor: "#4c1d95" },
    [PlantRarityId.COSMIC]: { name: "Cosmic", color: "border-indigo-500", textColor: "text-indigo-400", shadowColor: "#6366f1" },
    [PlantRarityId.SINGULARITY]: { name: "Singularity", color: "border-black", textColor: "text-gray-300", shadowColor: "#000000" },
    [PlantRarityId.MYTHIC]: { name: "Mythic", color: "border-emerald-400", textColor: "text-emerald-300", shadowColor: "#34d399" },
    [PlantRarityId.CHRONO]: { name: "Chrono", color: "border-teal-400", textColor: "text-teal-300", shadowColor: "#2dd4bf" },
    [PlantRarityId.REALITY]: { name: "Reality", color: "border-neutral-300", textColor: "text-neutral-200", shadowColor: "#d4d4d4" },
    [PlantRarityId.GLITCH]: { name: "Glitch", color: "border-fuchsia-600", textColor: "text-fuchsia-500", shadowColor: "#c026d3", animate: true },
    [PlantRarityId.DIGITAL]: { name: "Digital", color: "border-green-500", textColor: "text-green-400", shadowColor: "#22c55e" },
    [PlantRarityId.QUANTUM]: { name: "Quantum", color: "border-blue-300", textColor: "text-blue-200", shadowColor: "#93c5fd" },
    [PlantRarityId.PRIMORDIAL]: { name: "Primordial", color: "border-white", textColor: "text-white", shadowColor: "#ffffff" },
    [PlantRarityId.DIVINE]: { name: "Divine", color: "border-yellow-400", textColor: "text-yellow-300", shadowColor: "#facc15" },
    [PlantRarityId.ALPHA]: { name: "Alpha", color: "border-transparent", textColor: "text-white", shadowColor: "#ffffff", animate: true },
    [PlantRarityId.CODE]: { name: "Code", color: "border-green-600", textColor: "text-green-500", shadowColor: "#16a34a" },
    [PlantRarityId.NETWORK]: { name: "Network", color: "border-blue-500", textColor: "text-blue-400", shadowColor: "#3b82f6" },
    [PlantRarityId.MALWARE]: { name: "Malware", color: "border-red-600", textColor: "text-red-500", shadowColor: "#dc2626" }
};

export const DREAM_RARITY_TIERS: Record<DreamRarityId, Partial<RarityTier>> = {
    [DreamRarityId.SURFACE]: { name: "Surface", color: "border-slate-300", textColor: "text-slate-200", shadowColor: "#cbd5e1" },
    [DreamRarityId.LUCID]: { name: "Lucid", color: "border-sky-400", textColor: "text-sky-300", shadowColor: "#38bdf8" },
    [DreamRarityId.SURREAL]: { name: "Surreal", color: "border-purple-400", textColor: "text-purple-300", shadowColor: "#c084fc" },
    [DreamRarityId.NIGHTMARE]: { name: "Nightmare", color: "border-red-900", textColor: "text-red-500", shadowColor: "#7f1d1d" },
    [DreamRarityId.ABSTRACT]: { name: "Abstract", color: "border-white", textColor: "text-white", shadowColor: "#ffffff", animate: true }
};

export const VARIANTS: Record<VariantId, VariantTier> = {
    [VariantId.NONE]: {
        id: VariantId.NONE,
        name: "Normal",
        prefix: "",
        multiplier: 1,
        styleClass: "",
        borderClass: ""
    },
    [VariantId.GILDED]: {
        id: VariantId.GILDED,
        name: "Gilded",
        prefix: "Gilded",
        multiplier: 2,
        styleClass: "text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)] font-serif italic",
        borderClass: "border-yellow-400"
    },
    [VariantId.HOLOGRAPHIC]: {
        id: VariantId.HOLOGRAPHIC,
        name: "Holographic",
        prefix: "Holo",
        multiplier: 5,
        styleClass: "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-cyan-400 to-purple-500 animate-pulse",
        borderClass: "border-cyan-400"
    },
    [VariantId.RADIOACTIVE]: {
        id: VariantId.RADIOACTIVE,
        name: "Radioactive",
        prefix: "Toxic",
        multiplier: 10,
        styleClass: "text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,1)] animate-pulse",
        borderClass: "border-lime-500"
    },
    [VariantId.VOLCANIC]: {
        id: VariantId.VOLCANIC,
        name: "Volcanic",
        prefix: "Magmatic",
        multiplier: 25,
        styleClass: "text-orange-600 drop-shadow-[0_0_15px_rgba(234,88,12,0.9)] tracking-widest",
        borderClass: "border-orange-600"
    },
    [VariantId.GLACIAL]: {
        id: VariantId.GLACIAL,
        name: "Glacial",
        prefix: "Frozen",
        multiplier: 50,
        styleClass: "text-cyan-100 drop-shadow-[0_0_12px_rgba(165,243,252,0.9)]",
        borderClass: "border-cyan-200"
    },
    [VariantId.ABYSSAL]: {
        id: VariantId.ABYSSAL,
        name: "Abyssal",
        prefix: "Void",
        multiplier: 100,
        styleClass: "text-slate-900 bg-white px-2 drop-shadow-[0_0_20px_rgba(0,0,0,1)]",
        borderClass: "border-slate-900 bg-slate-200"
    },
    [VariantId.CELESTIAL]: {
        id: VariantId.CELESTIAL,
        name: "Celestial",
        prefix: "Starforged",
        multiplier: 250,
        styleClass: "text-white drop-shadow-[0_0_25px_rgba(255,255,255,1)] tracking-[0.2em]",
        borderClass: "border-white"
    },
    [VariantId.QUANTUM]: {
        id: VariantId.QUANTUM,
        name: "Quantum",
        prefix: "Glitch",
        multiplier: 500,
        styleClass: "text-emerald-400 font-mono tracking-tighter blur-[0.5px] animate-pulse",
        borderClass: "border-emerald-500"
    },
    [VariantId.NEGATIVE]: {
        id: VariantId.NEGATIVE,
        name: "Negative",
        prefix: "Inverted",
        multiplier: 1000,
        styleClass: "invert filter drop-shadow-[0_0_10px_white]",
        borderClass: "border-white invert"
    },
    [VariantId.PURE]: {
        id: VariantId.PURE,
        name: "Pure",
        prefix: "Perfect",
        multiplier: 10000,
        styleClass: "text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-400 drop-shadow-[0_0_30px_white] text-[1.1em]",
        borderClass: "border-white bg-white/10"
    }
};
