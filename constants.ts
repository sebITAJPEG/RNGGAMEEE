
import { RarityId, RarityTier, Language, ItemData, VariantId, VariantTier, Achievement, Ore, Fish } from './types';

// Index maps to speedLevel in GameStats
export const SPEED_TIERS = [
    { ms: 250, cost: 0, name: "BASE CLOCK" },
    { ms: 150, cost: 500, name: "OVERCLOCK I" },
    { ms: 75, cost: 2500, name: "OVERCLOCK II" },
    { ms: 40, cost: 10000, name: "LIQUID COOLING" },
    { ms: 20, cost: 50000, name: "NITROGEN LOOP" },
    { ms: 10, cost: 250000, name: "QUANTUM TUNNEL" },
    { ms: 5, cost: 1000000, name: "ZERO POINT" }
];

// UPGRADE CONFIGS
export const UPGRADE_COSTS = {
    LUCK: { base: 1000, multiplier: 2.5, max: 10 }, // 1.1x, 1.2x, etc.
    MINING_SPEED: { base: 500, multiplier: 2.0, max: 8 }, // Reduces ms
    MINING_LUCK: { base: 750, multiplier: 2.2, max: 10 }, // Increases luck mult
    MINING_MULTI: { base: 5000, multiplier: 3.0, max: 5 }, // +1 Ore per mine
    FISHING_SPEED: { base: 600, multiplier: 2.1, max: 8 },
    FISHING_LUCK: { base: 800, multiplier: 2.3, max: 10 },
    FISHING_MULTI: { base: 6000, multiplier: 3.2, max: 5 }
};

export const MINING_SPEEDS = [1000, 800, 600, 400, 200, 100, 50, 25, 10]; // ms delays
export const FISHING_SPEEDS = [1200, 1000, 800, 600, 400, 200, 100, 50, 25]; // ms delays (slightly slower base)

export const BURST_COST = 5000;
export const ENTROPY_THRESHOLD = 1000;

export const GACHA_CREDIT_COST = 10000; // Balance cost to buy 1 credit
export const GACHA_CONFIG = {
    SYMBOLS: [
        { id: '7', char: '7', weight: 1, color: 'text-yellow-500', multiplier: 500 }, // JACKPOT
        { id: 'DIAMOND', char: '♦', weight: 5, color: 'text-cyan-400', multiplier: 100 },
        { id: 'BAR', char: '≡', weight: 15, color: 'text-green-500', multiplier: 50 },
        { id: 'BELL', char: 'Ω', weight: 25, color: 'text-orange-400', multiplier: 20 },
        { id: 'CHERRY', char: '🍒', weight: 30, color: 'text-red-500', multiplier: 10 },
        { id: 'SKULL', char: '☠', weight: 24, color: 'text-neutral-600', multiplier: 0 } // Loss
    ],
    SPIN_DURATION: 2000, // Total spin time
    DELAY_BETWEEN_REELS: 500
};

export const ORES: Ore[] = [
  // --- TIER 1: EARTHLY (1-10) ---
  { id: 1, name: "Dirt", description: "Basic soil. Great for plants, bad for profits.", probability: 2, color: "text-yellow-900", glowColor: "#451a03", tierName: "Common" },
  { id: 2, name: "Sand", description: "Coarse, rough, and gets everywhere.", probability: 3, color: "text-yellow-200", glowColor: "#fef08a", tierName: "Common" },
  { id: 3, name: "Gravel", description: "Small rocks that make a satisfying crunch.", probability: 4, color: "text-stone-400", glowColor: "#a8a29e", tierName: "Common" },
  { id: 4, name: "Clay", description: "Moldable earth. Sticky when wet.", probability: 5, color: "text-orange-300", glowColor: "#fdba74", tierName: "Common" },
  { id: 5, name: "Stone", description: "A solid piece of rock. Reliable.", probability: 6, color: "text-neutral-500", glowColor: "#737373", tierName: "Common" },
  { id: 6, name: "Coal", description: "Fossilized carbon. Burns hot.", probability: 8, color: "text-neutral-800", glowColor: "#262626", tierName: "Common" },
  { id: 7, name: "Copper", description: "Conductive orange metal. Turns green with age.", probability: 10, color: "text-orange-700", glowColor: "#c2410c", tierName: "Common" },
  { id: 8, name: "Tin", description: "Soft metal used for alloys and cans.", probability: 12, color: "text-slate-400", glowColor: "#94a3b8", tierName: "Common" },
  { id: 9, name: "Iron", description: "The backbone of industry. Magnetic.", probability: 15, color: "text-neutral-300", glowColor: "#d4d4d4", tierName: "Uncommon" },
  { id: 10, name: "Quartz", description: "A common crystal structure.", probability: 20, color: "text-white", glowColor: "#ffffff", tierName: "Uncommon" },

  // --- TIER 2: INDUSTRIAL (11-20) ---
  { id: 11, name: "Lead", description: "Dense and toxic. Blocks radiation.", probability: 25, color: "text-slate-600", glowColor: "#475569", tierName: "Uncommon" },
  { id: 12, name: "Zinc", description: "Galvanizes steel to prevent rust.", probability: 30, color: "text-blue-200", glowColor: "#bfdbfe", tierName: "Uncommon" },
  { id: 13, name: "Nickel", description: "Resists corrosion. Shiny.", probability: 40, color: "text-yellow-100", glowColor: "#fef9c3", tierName: "Uncommon" },
  { id: 14, name: "Aluminum", description: "Lightweight and non-magnetic.", probability: 50, color: "text-slate-200", glowColor: "#e2e8f0", tierName: "Uncommon" },
  { id: 15, name: "Silicon", description: "The basis of all computer chips.", probability: 60, color: "text-stone-800", glowColor: "#292524", tierName: "Uncommon" },
  { id: 16, name: "Chromium", description: "Used for plating and stainless steel.", probability: 75, color: "text-gray-300", glowColor: "#d1d5db", tierName: "Rare" },
  { id: 17, name: "Titanium", description: "Strong as steel, half the weight.", probability: 100, color: "text-slate-100", glowColor: "#f1f5f9", tierName: "Rare" },
  { id: 18, name: "Tungsten", description: "Extremely high melting point.", probability: 125, color: "text-emerald-900", glowColor: "#064e3b", tierName: "Rare" },
  { id: 19, name: "Silver", description: "Highly conductive precious metal.", probability: 150, color: "text-gray-200", glowColor: "#e5e7eb", tierName: "Rare" },
  { id: 20, name: "Gold", description: "Soft, heavy, and universally valuable.", probability: 200, color: "text-yellow-400", glowColor: "#facc15", tierName: "Rare" },

  // --- TIER 3: PRECIOUS (21-30) ---
  { id: 21, name: "Amber", description: "Fossilized tree resin. Might contain DNA.", probability: 300, color: "text-amber-500", glowColor: "#f59e0b", tierName: "Precious" },
  { id: 22, name: "Jade", description: "Green ornamental mineral.", probability: 400, color: "text-green-600", glowColor: "#16a34a", tierName: "Precious" },
  { id: 23, name: "Topaz", description: "A silicate mineral of aluminium and fluorine.", probability: 500, color: "text-orange-400", glowColor: "#fb923c", tierName: "Precious" },
  { id: 24, name: "Opal", description: "Reflects a rainbow of colors.", probability: 600, color: "text-pink-200", glowColor: "#fbcfe8", tierName: "Precious" },
  { id: 25, name: "Pearl", description: "Formed inside an oyster.", probability: 750, color: "text-rose-100", glowColor: "#ffe4e6", tierName: "Precious" },
  { id: 26, name: "Ruby", description: "Red corundum. Passionate.", probability: 1000, color: "text-red-600", glowColor: "#dc2626", tierName: "Epic" },
  { id: 27, name: "Sapphire", description: "Blue corundum. Deep as the ocean.", probability: 1250, color: "text-blue-600", glowColor: "#2563eb", tierName: "Epic" },
  { id: 28, name: "Emerald", description: "Green beryl. Symbol of vitality.", probability: 1500, color: "text-green-500", glowColor: "#22c55e", tierName: "Epic" },
  { id: 29, name: "Diamond", description: "Hardest natural material.", probability: 2000, color: "text-cyan-200", glowColor: "#a5f3fc", tierName: "Epic" },
  { id: 30, name: "Platinum", description: "Denser and rarer than gold.", probability: 2500, color: "text-slate-300", glowColor: "#cbd5e1", tierName: "Epic" },

  // --- TIER 4: RARE EARTH (31-40) ---
  { id: 31, name: "Cobalt", description: "Used in high-strength alloys.", probability: 3500, color: "text-blue-800", glowColor: "#1e40af", tierName: "Industrial+" },
  { id: 32, name: "Palladium", description: "Absorbs hydrogen like a sponge.", probability: 4500, color: "text-orange-100", glowColor: "#ffedd5", tierName: "Industrial+" },
  { id: 33, name: "Rhodium", description: "The most expensive precious metal.", probability: 6000, color: "text-rose-300", glowColor: "#fda4af", tierName: "Industrial+" },
  { id: 34, name: "Iridium", description: "Extremely dense and corrosion-resistant.", probability: 8000, color: "text-yellow-100", glowColor: "#fef9c3", tierName: "Dense" },
  { id: 35, name: "Osmium", description: "The densest naturally occurring element.", probability: 10000, color: "text-blue-300", glowColor: "#93c5fd", tierName: "Dense" },
  { id: 36, name: "Bismuth", description: "Forms geometric rainbow crystals.", probability: 12500, color: "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500", glowColor: "#ec4899", tierName: "Geometric" },
  { id: 37, name: "Uranium", description: "Heavy and unstable. Glows green.", probability: 15000, color: "text-lime-500", glowColor: "#84cc16", tierName: "Radioactive" },
  { id: 38, name: "Plutonium", description: "Man-made radioactive metal.", probability: 20000, color: "text-green-600", glowColor: "#16a34a", tierName: "Radioactive" },
  { id: 39, name: "Neptunium", description: "Byproduct of nuclear reactors.", probability: 25000, color: "text-blue-900", glowColor: "#1e3a8a", tierName: "Radioactive" },
  { id: 40, name: "Obsidian", description: "Volcanic glass sharp enough to cut atoms.", probability: 30000, color: "text-purple-950", glowColor: "#3b0764", tierName: "Volcanic" },

  // --- TIER 5: FANTASY (41-50) ---
  { id: 41, name: "Mithril", description: "Light as a feather, hard as dragon scales.", probability: 40000, color: "text-teal-300", glowColor: "#5eead4", tierName: "Elven" },
  { id: 42, name: "Orichalcum", description: "Lost metal of Atlantis.", probability: 50000, color: "text-rose-400", glowColor: "#fb7185", tierName: "Atlantean" },
  { id: 43, name: "Adamantite", description: "Known for its indestructibility.", probability: 65000, color: "text-red-800", glowColor: "#991b1b", tierName: "Dwarven" },
  { id: 44, name: "Runite", description: "Infused with magical runes.", probability: 80000, color: "text-cyan-600", glowColor: "#0891b2", tierName: "Runic" },
  { id: 45, name: "Dark Steel", description: "Forged in shadow.", probability: 100000, color: "text-stone-900", glowColor: "#1c1917", tierName: "Dark" },
  { id: 46, name: "Moonstone", description: "Glows under the moonlight.", probability: 125000, color: "text-indigo-200", glowColor: "#c7d2fe", tierName: "Lunar" },
  { id: 47, name: "Sunstone", description: "Warm to the touch.", probability: 150000, color: "text-orange-500", glowColor: "#f97316", tierName: "Solar" },
  { id: 48, name: "Hellstone", description: "Burning with eternal fire.", probability: 200000, color: "text-red-600 animate-pulse", glowColor: "#dc2626", tierName: "Infernal" },
  { id: 49, name: "Celestial Bronze", description: "Harmful only to monsters.", probability: 250000, color: "text-yellow-600", glowColor: "#ca8a04", tierName: "Divine" },
  { id: 50, name: "Void Metal", description: "Absorbs all light.", probability: 300000, color: "text-violet-900", glowColor: "#4c1d95", tierName: "Void" },

  // --- TIER 6: SCI-FI (51-60) ---
  { id: 51, name: "Plasteel", description: "Advanced composite material.", probability: 400000, color: "text-gray-100", glowColor: "#f3f4f6", tierName: "Future" },
  { id: 52, name: "Durasteel", description: "High-strength structural alloy.", probability: 500000, color: "text-slate-500", glowColor: "#64748b", tierName: "Resistant" },
  { id: 53, name: "Beskar", description: "Resistant to lightsabers.", probability: 650000, color: "text-zinc-300", glowColor: "#d4d4d8", tierName: "Mandalorian" },
  { id: 54, name: "Vibranium", description: "Absorbs kinetic energy.", probability: 800000, color: "text-indigo-400", glowColor: "#818cf8", tierName: "Wakandan" },
  { id: 55, name: "Adamantium", description: "Virtually indestructible metal.", probability: 1000000, color: "text-neutral-400", glowColor: "#a3a3a3", tierName: "Indestructible" },
  { id: 56, name: "Uru", description: "Forged in the heart of a dying star.", probability: 1500000, color: "text-stone-600", glowColor: "#57534e", tierName: "Asgardian" },
  { id: 57, name: "Kryptonite", description: "Radioactive remains of a planet.", probability: 2000000, color: "text-lime-400 animate-pulse", glowColor: "#a3e635", tierName: "Alien" },
  { id: 58, name: "Element Zero", description: "Changes the mass of objects.", probability: 3000000, color: "text-blue-500", glowColor: "#3b82f6", tierName: "Mass Effect" },
  { id: 59, name: "Tiberium", description: "Self-replicating crystal.", probability: 5000000, color: "text-green-500 animate-pulse", glowColor: "#22c55e", tierName: "Toxic" },
  { id: 60, name: "Unobtainium", description: "Hard to find.", probability: 7500000, color: "text-gray-400", glowColor: "#9ca3af", tierName: "Impossible" },

  // --- TIER 7: COSMIC (61-70) ---
  { id: 61, name: "Asteroid Shard", description: "A piece of a wandering rock.", probability: 10000000, color: "text-stone-500", glowColor: "#78716c", tierName: "Space" },
  { id: 62, name: "Lunar Dust", description: "Regolith from the moon.", probability: 15000000, color: "text-zinc-200", glowColor: "#e4e4e7", tierName: "Space" },
  { id: 63, name: "Martian Soil", description: "Iron-rich red dust.", probability: 20000000, color: "text-red-700", glowColor: "#b91c1c", tierName: "Space" },
  { id: 64, name: "Stardust", description: "We are all made of this.", probability: 30000000, color: "text-yellow-100", glowColor: "#fef9c3", tierName: "Stellar" },
  { id: 65, name: "Solar Plasma", description: "Superheated ionized gas.", probability: 50000000, color: "text-orange-400 animate-pulse", glowColor: "#fb923c", tierName: "Stellar" },
  { id: 66, name: "Neutronium", description: "Super-dense star matter.", probability: 75000000, color: "text-blue-200", glowColor: "#bfdbfe", tierName: "Dense" },
  { id: 67, name: "Strange Matter", description: "Contains strange quarks.", probability: 100000000, color: "text-fuchsia-400", glowColor: "#e879f9", tierName: "Quantum" },
  { id: 68, name: "Dark Matter", description: "Invisible but heavy.", probability: 150000000, color: "text-indigo-950", glowColor: "#1e1b4b", tierName: "Abyssal" },
  { id: 69, name: "Antimatter", description: "Explodes on contact with matter.", probability: 250000000, color: "text-white drop-shadow-[0_0_10px_white]", glowColor: "#ffffff", tierName: "Volatile" },
  { id: 70, name: "Black Hole Core", description: "A singularity in your pocket.", probability: 400000000, color: "text-black bg-white px-1", glowColor: "#000000", tierName: "Singularity" },

  // --- TIER 8: ABSTRACT (71-80) ---
  { id: 71, name: "Solid Light", description: "Photons frozen in place.", probability: 600000000, color: "text-yellow-50", glowColor: "#fefce8", tierName: "Photonic" },
  { id: 72, name: "Frozen Time", description: "A second that lasts forever.", probability: 800000000, color: "text-cyan-300", glowColor: "#67e8f9", tierName: "Chronal" },
  { id: 73, name: "Liquid Luck", description: "Bottled probability.", probability: 1000000000, color: "text-amber-300", glowColor: "#fcd34d", tierName: "Fortune" },
  { id: 74, name: "Crystallized Thought", description: "An idea made manifest.", probability: 1500000000, color: "text-pink-300", glowColor: "#f9a8d4", tierName: "Psionic" },
  { id: 75, name: "Sound Shard", description: "A physical noise.", probability: 2000000000, color: "text-emerald-300", glowColor: "#6ee7b7", tierName: "Sonic" },
  { id: 76, name: "Hypercube Fragment", description: "Part of a 4D shape.", probability: 3000000000, color: "text-violet-400", glowColor: "#a78bfa", tierName: "4th Dimension" },
  { id: 77, name: "Event Horizon", description: "The edge of reality.", probability: 4500000000, color: "text-purple-900", glowColor: "#581c87", tierName: "Gravity" },
  { id: 78, name: "Philosophy", description: "Why do we mine?", probability: 6000000000, color: "text-gray-500", glowColor: "#6b7280", tierName: "Concept" },
  { id: 79, name: "Logic Gate", description: "IF found THEN happy.", probability: 8000000000, color: "text-green-700", glowColor: "#15803d", tierName: "Computational" },
  { id: 80, name: "Pure Energy", description: "Raw power without form.", probability: 10000000000, color: "text-white animate-pulse", glowColor: "#ffffff", tierName: "Energy" },

  // --- TIER 9: GLITCH (81-90) ---
  { id: 81, name: "Null Ore", description: "Value is null.", probability: 15000000000, color: "text-neutral-600", glowColor: "#525252", tierName: "Null" },
  { id: 82, name: "NaN Nugget", description: "Not a Number.", probability: 20000000000, color: "text-red-500", glowColor: "#ef4444", tierName: "Error" },
  { id: 83, name: "Glitch Shard", description: "It keeps flickering.", probability: 30000000000, color: "text-lime-400 animate-pulse", glowColor: "#a3e635", tierName: "Bug" },
  { id: 84, name: "Pixel Dust", description: "The building blocks of the screen.", probability: 40000000000, color: "text-fuchsia-500", glowColor: "#d946ef", tierName: "Digital" },
  { id: 85, name: "Texture Error", description: "Purple and black checkers.", probability: 60000000000, color: "text-pink-600", glowColor: "#db2777", tierName: "Missing" },
  { id: 86, name: "MissingNo", description: "A wild glitch appeared.", probability: 80000000000, color: "text-purple-600", glowColor: "#9333ea", tierName: "Corruption" },
  { id: 87, name: "Blue Screen", description: "Fatal exception occurred.", probability: 100000000000, color: "text-blue-600", glowColor: "#2563eb", tierName: "Crash" },
  { id: 88, name: "Segfault", description: "Memory access violation.", probability: 150000000000, color: "text-red-800", glowColor: "#991b1b", tierName: "Memory" },
  { id: 89, name: "Dead Pixel", description: "A permanent black dot.", probability: 200000000000, color: "text-white", glowColor: "#ffffff", tierName: "Hardware" },
  { id: 90, name: "The Backrooms", description: "Yellow wallpaper and fluorescent lights.", probability: 300000000000, color: "text-yellow-200", glowColor: "#fef08a", tierName: "Liminal" },

  // --- TIER 10: GODLY (91-100) ---
  { id: 91, name: "Angel Feather", description: "Fallen from grace.", probability: 500000000000, color: "text-white drop-shadow-[0_0_10px_white]", glowColor: "#ffffff", tierName: "Holy" },
  { id: 92, name: "Demon Horn", description: "Torn from the abyss.", probability: 800000000000, color: "text-red-950 drop-shadow-[0_0_10px_red]", glowColor: "#450a0a", tierName: "Unholy" },
  { id: 93, name: "World Tree Bark", description: "From Yggdrasil itself.", probability: 1200000000000, color: "text-emerald-800", glowColor: "#065f46", tierName: "Yggdrasil" },
  { id: 94, name: "Philosopher's Stone", description: "Can transmute lead to gold.", probability: 2000000000000, color: "text-red-500 animate-pulse", glowColor: "#ef4444", tierName: "Alchemy" },
  { id: 95, name: "Soul Gem", description: "Traps the essence of life.", probability: 3500000000000, color: "text-orange-500", glowColor: "#f97316", tierName: "Soul" },
  { id: 96, name: "Time Stone", description: "Controls the flow.", probability: 5000000000000, color: "text-green-500", glowColor: "#22c55e", tierName: "Infinity" },
  { id: 97, name: "Space Stone", description: "Controls location.", probability: 10000000000000, color: "text-blue-500", glowColor: "#3b82f6", tierName: "Infinity" },
  { id: 98, name: "Reality Shard", description: "Bend the world to your will.", probability: 25000000000000, color: "text-red-600", glowColor: "#dc2626", tierName: "Reality" },
  { id: 99, name: "Creation Spark", description: "The Big Bang in a bottle.", probability: 50000000000000, color: "text-white animate-ping", glowColor: "#ffffff", tierName: "Genesis" },
  { id: 100, name: "The Beginning", description: "Where it all started.", probability: 100000000000000, color: "text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-white animate-pulse", glowColor: "#ffffff", tierName: "Alpha" }
];

export const FISH: Fish[] = [
    // --- TIER 1: SURFACE (1-10) ---
    { id: 1, name: "Digital Guppy", description: "A small, low-poly fish.", probability: 2, color: "text-orange-300", glowColor: "#fdba74", tierName: "Common" },
    { id: 2, name: "Byte Minnow", description: "8 of these make a snack.", probability: 3, color: "text-blue-300", glowColor: "#93c5fd", tierName: "Common" },
    { id: 3, name: "Pixel Carp", description: "Scales look like squares.", probability: 4, color: "text-yellow-600", glowColor: "#ca8a04", tierName: "Common" },
    { id: 4, name: "Static Trout", description: "Makes a buzzing noise.", probability: 5, color: "text-neutral-400", glowColor: "#a3a3a3", tierName: "Common" },
    { id: 5, name: "Neon Tetra", description: "Glows in the dark web.", probability: 6, color: "text-fuchsia-400", glowColor: "#e879f9", tierName: "Common" },
    { id: 6, name: "Binary Bass", description: "01000010 01100001 01110011 01110011", probability: 8, color: "text-green-700", glowColor: "#15803d", tierName: "Common" },
    { id: 7, name: "Glitch Goldfish", description: "Flickers between orange and void.", probability: 10, color: "text-amber-500 animate-pulse", glowColor: "#f59e0b", tierName: "Common" },
    { id: 8, name: "Data Crab", description: "Moves sideways through the firewall.", probability: 12, color: "text-red-400", glowColor: "#f87171", tierName: "Common" },
    { id: 9, name: "Rusty Can", description: "Someone threw this in the server pool.", probability: 15, color: "text-stone-500", glowColor: "#78716c", tierName: "Trash" },
    { id: 10, name: "Old Boot", description: "Boot.exe has stopped working.", probability: 20, color: "text-yellow-900", glowColor: "#451a03", tierName: "Trash" },

    // --- TIER 2: REEF (11-20) ---
    { id: 11, name: "Cyber Salmon", description: "Swims upstream against the data stream.", probability: 25, color: "text-rose-400", glowColor: "#fb7185", tierName: "Uncommon" },
    { id: 12, name: "Electric Eel", description: "Powered by USB-C.", probability: 30, color: "text-yellow-400", glowColor: "#facc15", tierName: "Uncommon" },
    { id: 13, name: "Source Code Squid", description: "Ink is pure black #000000.", probability: 40, color: "text-black bg-white px-1", glowColor: "#ffffff", tierName: "Uncommon" },
    { id: 14, name: "Firewall Puffer", description: "Expands to block ports.", probability: 50, color: "text-red-600", glowColor: "#dc2626", tierName: "Uncommon" },
    { id: 15, name: "Search Engine Shark", description: "Smells your browser history.", probability: 60, color: "text-blue-600", glowColor: "#2563eb", tierName: "Predator" },
    { id: 16, name: "Encrypted Ray", description: "Needs a key to see clearly.", probability: 75, color: "text-neutral-300 blur-[1px]", glowColor: "#d4d4d4", tierName: "Rare" },
    { id: 17, name: "GPU Jellyfish", description: "Processes graphics while floating.", probability: 100, color: "text-cyan-400", glowColor: "#22d3ee", tierName: "Rare" },
    { id: 18, name: "Fiber Optic Flounder", description: "Transmits light through its body.", probability: 125, color: "text-white", glowColor: "#ffffff", tierName: "Rare" },
    { id: 19, name: "Packet Loss Pike", description: "Now you see it, now you don't.", probability: 150, color: "text-neutral-500 animate-pulse", glowColor: "#737373", tierName: "Rare" },
    { id: 20, name: "Cookie Cutter Shark", description: "Steals your login cookies.", probability: 200, color: "text-orange-800", glowColor: "#9a3412", tierName: "Rare" },

    // --- TIER 3: DEEP (21-30) ---
    { id: 21, name: "Deep Web Angler", description: "Lures prey with a fake link.", probability: 300, color: "text-purple-400", glowColor: "#c084fc", tierName: "Deep" },
    { id: 22, name: "VPN Viperfish", description: "Masks its location.", probability: 400, color: "text-green-400", glowColor: "#4ade80", tierName: "Deep" },
    { id: 23, name: "Blobfish.png", description: "Low resolution compression artifacts.", probability: 500, color: "text-pink-300 blur-sm", glowColor: "#f9a8d4", tierName: "Deep" },
    { id: 24, name: "Blockchain Barracuda", description: "Verified ownership of bite marks.", probability: 600, color: "text-yellow-600", glowColor: "#ca8a04", tierName: "Crypto" },
    { id: 25, name: "Mining Rig Marlin", description: "Generates heat.", probability: 750, color: "text-red-500", glowColor: "#ef4444", tierName: "Crypto" },
    { id: 26, name: "Phishing Piranha", description: "Sends fake emails.", probability: 1000, color: "text-red-700", glowColor: "#b91c1c", tierName: "Malware" },
    { id: 27, name: "Trojan Seahorse", description: "Looks like a gift.", probability: 1250, color: "text-amber-700", glowColor: "#b45309", tierName: "Malware" },
    { id: 28, name: "Worm Eel", description: "Self-replicating.", probability: 1500, color: "text-lime-600", glowColor: "#65a30d", tierName: "Malware" },
    { id: 29, name: "Spyware Starfish", description: "Sticks to you and watches.", probability: 2000, color: "text-indigo-500", glowColor: "#6366f1", tierName: "Malware" },
    { id: 30, name: "Ransomware Ray", description: "Encrypts your other fish.", probability: 2500, color: "text-red-900", glowColor: "#7f1d1d", tierName: "Malware" },

    // --- TIER 4: ABYSS (31-40) ---
    { id: 31, name: "Void Leviathan", description: "Massive entity of null data.", probability: 5000, color: "text-violet-950 drop-shadow-[0_0_10px_#4c1d95]", glowColor: "#4c1d95", tierName: "Abyssal" },
    { id: 32, name: "Null Pointer Nautilus", description: "Points to nothing.", probability: 7500, color: "text-neutral-600", glowColor: "#525252", tierName: "Abyssal" },
    { id: 33, name: "404 Fish", description: "Species not found.", probability: 10000, color: "text-neutral-100", glowColor: "#f5f5f5", tierName: "Error" },
    { id: 34, name: "Infinite Loop Loach", description: "Swims in circles forever.", probability: 15000, color: "text-teal-400", glowColor: "#2dd4bf", tierName: "Error" },
    { id: 35, name: "Kernel Panic Kraken", description: "Crashes the OS on surfacing.", probability: 25000, color: "text-red-600 animate-pulse", glowColor: "#dc2626", tierName: "System" },
    { id: 36, name: "Root Access Ray", description: "Grants full control.", probability: 40000, color: "text-green-500", glowColor: "#22c55e", tierName: "System" },
    { id: 37, name: "Ghost in the Shellfish", description: "Possessed by AI.", probability: 60000, color: "text-cyan-200", glowColor: "#a5f3fc", tierName: "AI" },
    { id: 38, name: "Neural Net Narwhal", description: "Tusk is an antenna.", probability: 80000, color: "text-purple-500", glowColor: "#a855f7", tierName: "AI" },
    { id: 39, name: "Algorithm Algae", description: "Curates your feed.", probability: 100000, color: "text-emerald-600", glowColor: "#059669", tierName: "AI" },
    { id: 40, name: "Singularity Shark", description: "Event horizon in its mouth.", probability: 150000, color: "text-black bg-white px-1 animate-pulse", glowColor: "#000000", tierName: "Cosmic" },

    // --- TIER 5: LEGENDARY (41-50) ---
    { id: 41, name: "The Glitch Ness Monster", description: "A myth made of bugs.", probability: 250000, color: "text-fuchsia-500 animate-bounce", glowColor: "#d946ef", tierName: "Cryptid" },
    { id: 42, name: "Cthulhu.exe", description: "Do not run this file.", probability: 500000, color: "text-green-900 drop-shadow-[0_0_15px_#14532d]", glowColor: "#14532d", tierName: "Eldritch" },
    { id: 43, name: "Moby Dick (PDF)", description: "The entire book in one fish.", probability: 750000, color: "text-white", glowColor: "#ffffff", tierName: "Literature" },
    { id: 44, name: "Golden Magikarp", description: "Useless but shiny.", probability: 1000000, color: "text-yellow-400 drop-shadow-[0_0_10px_#facc15]", glowColor: "#facc15", tierName: "Pokemon" },
    { id: 45, name: "Time Stream Trout", description: "Caught yesterday.", probability: 2000000, color: "text-blue-400", glowColor: "#60a5fa", tierName: "Temporal" },
    { id: 46, name: "Schrödinger's Catfish", description: "Alive and dead until caught.", probability: 5000000, color: "text-neutral-400", glowColor: "#a3a3a3", tierName: "Quantum" },
    { id: 47, name: "The Cloud Whale", description: "Stores everyone's photos.", probability: 10000000, color: "text-sky-200 cloud-texture", glowColor: "#bae6fd", tierName: "Server" },
    { id: 48, name: "Mainframe Megalodon", description: "Apex predator of the net.", probability: 25000000, color: "text-red-950 animate-pulse", glowColor: "#450a0a", tierName: "Boss" },
    { id: 49, name: "Zero Day Exploit", description: "No patch available.", probability: 50000000, color: "text-red-500 font-mono", glowColor: "#ef4444", tierName: "Critical" },
    { id: 50, name: "Developers Rubber Duck", description: "It solves all bugs.", probability: 100000000, color: "text-yellow-300 animate-spin", glowColor: "#fde047", tierName: "Dev" }
];

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
  }
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

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'beginner',
        title: 'NOVICE',
        description: 'Roll 100 times.',
        condition: (stats) => stats.totalRolls >= 100
    },
    {
        id: 'addict',
        title: 'ADDICT',
        description: 'Roll 10,000 times.',
        condition: (stats) => stats.totalRolls >= 10000
    },
    {
        id: 'wealthy',
        title: 'WEALTHY',
        description: 'Reach a balance of 10,000.',
        condition: (stats) => stats.balance >= 10000
    },
    {
        id: 'tycoon',
        title: 'TYCOON',
        description: 'Reach a balance of 1,000,000.',
        condition: (stats) => stats.balance >= 1000000
    },
    {
        id: 'lucky',
        title: 'BLESSED',
        description: 'Find a Legendary item.',
        condition: (stats) => stats.bestRarityFound >= RarityId.LEGENDARY
    },
    {
        id: 'god',
        title: 'DIVINITY',
        description: 'Find a Divine item.',
        condition: (stats) => stats.bestRarityFound >= RarityId.DIVINE
    },
    {
        id: 'variant_hunter',
        title: 'GLITCH HUNTER',
        description: 'Find any Variant item.',
        condition: (_, inv) => inv.some(i => i.variantId !== undefined && i.variantId !== VariantId.NONE)
    },
    {
        id: 'pure_luck',
        title: 'PERFECTION',
        description: 'Find a Pure variant.',
        condition: (_, inv) => inv.some(i => i.variantId === VariantId.PURE)
    },
    {
        id: 'ascended',
        title: 'THE ONE',
        description: 'Find "The One".',
        condition: (stats) => stats.bestRarityFound === RarityId.THE_ONE
    },
    {
        id: 'miner_basic',
        title: 'PROSPECTOR',
        description: 'Mine 1,000 ores.',
        condition: (stats) => (stats.totalMined || 0) >= 1000
    },
    {
        id: 'miner_expert',
        title: 'DEEP DIVER',
        description: 'Find an ore rarer than Ruby (1 in 1,000).',
        condition: (stats) => (stats.bestOreMined || 0) >= 26
    },
    {
        id: 'fisher_basic',
        title: 'ANGLER',
        description: 'Catch 500 fish.',
        condition: (stats) => (stats.totalFished || 0) >= 500
    },
    {
        id: 'fisher_expert',
        title: 'NET RUNNER',
        description: 'Catch a Deep Web Angler or rarer.',
        condition: (stats) => (stats.bestFishCaught || 0) >= 21
    }
];

// --- LOCALIZATION ---

export const TRANSLATIONS: Record<Language, {
  UI: Record<string, string>;
  RARITY_NAMES: Record<RarityId, string>;
}> = {
  en: {
    UI: {
      ROLLS: "ROLLS",
      BEST: "BEST",
      LUCK_BOOST: "LUCK BOOST",
      INVENTORY: "INVENTORY",
      COLLECTION: "COLLECTION",
      NO_ITEMS: "No rare items found yet.",
      KEEP_SPINNING: "Keep spinning.",
      CHANCE: "CHANCE",
      READY: "READY TO INITIALIZE",
      GENERATE: "GENERATE",
      AUTO_SPIN: "AUTO SPIN",
      STOP_AUTO: "STOP AUTO",
      SYSTEM_CONFIG: "SYSTEM CONFIG",
      SPEED: "AUTO-SPIN INTERVAL",
      LUCK_MULT: "LUCK MULTIPLIER (ADMIN)",
      PRESETS: "DEBUG PRESETS",
      RESET: "RESET",
      LUCKY: "LUCKY",
      GOD_MODE: "GOD MODE",
      GUARANTEED: "GUARANTEED",
      INSPECT: "CLICK TO INSPECT"
    },
    RARITY_NAMES: {
      [RarityId.COMMON]: "Common",
      [RarityId.UNCOMMON]: "Uncommon",
      [RarityId.RARE]: "Rare",
      [RarityId.EPIC]: "Epic",
      [RarityId.LEGENDARY]: "Legendary",
      [RarityId.MYTHICAL]: "Mythical",
      [RarityId.DIVINE]: "Divine",
      [RarityId.OTHERWORLDLY]: "Otherworldly",
      [RarityId.COSMIC]: "Cosmic",
      [RarityId.EXTREME]: "Extreme",
      [RarityId.ABYSSAL]: "Abyssal",
      [RarityId.PRIMORDIAL]: "Primordial",
      [RarityId.INFINITE]: "Infinite",
      [RarityId.CHAOS]: "Chaos",
      [RarityId.THE_ONE]: "The One"
    }
  }
};

export const PHRASES: Record<Language, Record<RarityId, ItemData[]>> = {
  en: {
    [RarityId.COMMON]: [
    { text: "A rusty spoon.", description: "It might have been useful once." },
    { text: "Piece of lint.", description: "Pocket debris of no value." },
    { text: "Old receipt.", description: "The ink has faded away." },
    { text: "Empty soda can.", description: "Sticky and crushed." },
    { text: "Dust bunny.", description: "It rolls across the floor." },
    { text: "Broken pencil.", description: "Pointless." },
    { text: "Withered leaf.", description: "Crunchy and brown." },
    { text: "Pebble.", description: "Just a small rock." },
    { text: "Scratched coin.", description: "You can barely see the face." },
    { text: "Used tissue.", description: "Gross." },
    { text: "Leftover pizza crust.", description: "From three days ago." },
    { text: "Unpaired sock.", description: "Where did the other one go?" },
    { text: "Tangled earbuds.", description: "Physically impossible geometry." },
    { text: "Expired coupon.", description: "10% off nothing." },
    { text: "Bubblegum wrapper.", description: "The flavor lasted 5 seconds." },
    { text: "Broken paperclip.", description: "Holding nothing together." },
    { text: "Generic NPC dialogue.", description: "Nice weather we're having." },
    { text: "Loading screen tip.", description: "Press jump to jump." },
    { text: "Plastic fork.", description: "One tine is missing." },
    { text: "Empty cardboard box.", description: "A cat would love this." }
  ],
  [RarityId.UNCOMMON]: [
    { text: "A lucky penny.", description: "Heads up." },
    { text: "Crisp apple.", description: "Fresh from the tree." },
    { text: "Polished stone.", description: "Smooth to the touch." },
    { text: "Interesting beetle.", description: "It has shiny wings." },
    { text: "Old photograph.", description: "Faces you don't recognize." },
    { text: "Brass key.", description: "It doesn't open anything you own." },
    { text: "Silver ring.", description: "Slightly tarnished." },
    { text: "Heavy book.", description: "Full of dense text." },
    { text: "Warm socks.", description: "Comfortable." },
    { text: "Fresh coffee.", description: "Aromatic and hot." },
    { text: "Vibe check pass.", description: "You have passed." },
    { text: "Hydrated water.", description: "Now with wetness." },
    { text: "Cool stick.", description: "It looks like a gun." },
    { text: "Double rainbow.", description: "What does it mean?" },
    { text: "Found $5.", description: "Lunch is on you." },
    { text: "Perfectly toasted toast.", description: "Golden brown." },
    { text: "Full phone battery.", description: "Satisfying." },
    { text: "Green traffic light.", description: "Don't stop now." },
    { text: "Cat video.", description: "Instant serotonin." },
    { text: "Extra fry.", description: "At the bottom of the bag." }
  ],
  [RarityId.RARE]: [
    { text: "Golden ticket.", description: "Admit one." },
    { text: "Four-leaf clover.", description: "A generic symbol of luck." },
    { text: "Signed poster.", description: "The signature is illegible." },
    { text: "Vintage watch.", description: "It stopped ticking years ago." },
    { text: "Rare coin.", description: "A collector might want this." },
    { text: "Crystal shard.", description: "It catches the light." },
    { text: "Silk scarf.", description: "Soft and luxurious." },
    { text: "Ancient map.", description: "The lands don't match modern geography." },
    { text: "Compass.", description: "It doesn't point north." },
    { text: "Glowing mushroom.", description: "Don't eat it." },
    { text: "Indie game gem.", description: "Overwhelmingly positive reviews." },
    { text: "Verified checkmark.", description: "You are now notable." },
    { text: "Limited edition waifu.", description: "Still in the box." },
    { text: "Shiny trading card.", description: "First edition, mint condition." },
    { text: "Retro console.", description: "Blow into the cartridge." },
    { text: "Unicorn horn (fake).", description: "It's just an ice cream cone." },
    { text: "Mix tape.", description: "Fire tracks only." },
    { text: "Winning lottery ticket.", description: "For a free ticket." },
    { text: "Perfect parking spot.", description: "Right in front." },
    { text: "Glitchy texture.", description: "Reality is buffering." }
  ],
  [RarityId.EPIC]: [
    { text: "Meteorite fragment.", description: "Cold to the touch, from the void." },
    { text: "Dragon scale.", description: "Harder than steel, warm." },
    { text: "Phoenix feather.", description: "It glows with a gentle heat." },
    { text: "Unbreaking sword.", description: "Sharp forever." },
    { text: "Elixir of life.", description: "One sip grants vitality." },
    { text: "Holographic disk.", description: "Data from a lost civilization." },
    { text: "Quantum chip.", description: "Processing power beyond limits." },
    { text: "Obsidian dagger.", description: "Volcanic glass, incredibly sharp." },
    { text: "Enchanted helm.", description: "Whispers warnings to the wearer." },
    { text: "Singing stone.", description: "It hums a low melody." },
    { text: "RTX 5090.", description: "Requires a nuclear reactor." },
    { text: "Forbidden tuna.", description: "Do not touch the fish." },
    { text: "Main character energy.", description: "The plot revolves around you." },
    { text: "Neon katana.", description: "Cyberpunk aesthetics." },
    { text: "UwU voice module.", description: "Cursed technology." },
    { text: "Hoverboard.", description: "Actually hovers this time." },
    { text: "Invisibility cloak.", description: "Where did I put it?" },
    { text: "Philosopher's stone.", description: "Transmutes lead to gold." },
    { text: "Portal gun.", description: "The cake is a lie." },
    { text: "Sentient AI assistant.", description: "It judges your search history." }
  ],
  [RarityId.LEGENDARY]: [
    { text: "Excalibur's hilt.", description: "The blade is missing, but the power remains." },
    { text: "Pandora' latch.", description: "Don't open it." },
    { text: "The Grail's cup.", description: "Choose wisely." },
    { text: "Zeus's spark.", description: "Captured lightning in a bottle." },
    { text: "Odin's eye.", description: "It sees all." },
    { text: "Neptune's trident tip.", description: "Smells of the deep ocean." },
    { text: "Anubis's scale.", description: "Weighs the heart against a feather." },
    { text: "Mjolnir's grip.", description: "Wrapped in leather, impossibly heavy." },
    { text: "Aegis fragment.", description: "Reflects horror back to the source." },
    { text: "Hermes's sandal.", description: "It vibrates with speed." },
    { text: "The Ban Hammer.", description: "Strike with judgement." },
    { text: "Plot Armor.", description: "You cannot die." },
    { text: "Developer's Coffee Mug.", description: "Contains infinite caffeine." },
    { text: "Golden Pan.", description: "Loud noises on impact." },
    { text: "Diamond Hands.", description: "Never sell." },
    { text: "The Internet.", description: "A series of tubes." },
    { text: "Admin Privileges.", description: "Sudo make me a sandwich." },
    { text: "Legendary Lootbox.", description: "Contains 3 commons and a spray." },
    { text: "Speedrun strats.", description: "Clip through the wall." },
    { text: "Lag Switch.", description: "Teleport behind them." }
  ],
  [RarityId.MYTHICAL]: [
    { text: "A whisper from the void.", description: "You shouldn't have heard that." },
    { text: "Shadow of a colossus.", description: "Cast by something massive and unseen." },
    { text: "Tear of a star.", description: "Burning liquid light." },
    { text: "Heart of a volcano.", description: "Pulsing with magma." },
    { text: "Breath of the north wind.", description: "Freezes time itself." },
    { text: "Soul of a forest.", description: "A network of roots and consciousness." },
    { text: "Memory of an ocean.", description: "Salt, depth, and pressure." },
    { text: "Dream of a mountain.", description: "Unmoving, eternal, sleeping." },
    { text: "Echo of thunder.", description: "The sound that follows the flash." },
    { text: "Pulse of the earth.", description: "Rhythmic and grounding." },
    { text: "Florida Man.", description: "Unstoppable force of chaos." },
    { text: "SCP-173.", description: "Don't blink." },
    { text: "Schrodinger's Waifu.", description: "Both cute and not cute." },
    { text: "The UwU Entity.", description: "Nuzzles your soul." },
    { text: "Herobrine.", description: "Removed from version 1.8." },
    { text: "Bigfoot's blurry photo.", description: "Out of focus." },
    { text: "Mew underneath the truck.", description: "Use Strength." },
    { text: "Half-Life 3.", description: "Confirmed." },
    { text: "The Cake.", description: "It was real all along." },
    { text: "Cursed Image.", description: "Low resolution horror." }
  ],
  [RarityId.DIVINE]: [
    { text: "Angelic resonance.", description: "A frequency that heals the spirit." },
    { text: "Demon's pact.", description: "Signed in blood, binding forever." },
    { text: "Fingerprint of God.", description: "A swirl of creation." },
    { text: "Celestial alignment.", description: "The stars are right." },
    { text: "Divine Intervention.", description: "A miracle when you need it most." },
    { text: "Sacred geometry.", description: "The mathematics behind the soul." },
    { text: "Forbidden scripture.", description: "Words that burn the eyes." },
    { text: "Holy Grail.", description: "Eternal life, at a price." },
    { text: "Blessed light.", description: "Banishes all shadows." },
    { text: "Cursed darkness.", description: "Consumes all light." },
    { text: "RNGesus.", description: "Pray for high rolls." },
    { text: "Holy Hand Grenade.", description: "Count to three, no more, no less." },
    { text: "Touch Grass.", description: "The ultimate blessing." },
    { text: "Biblically accurate angel.", description: "BE NOT AFRAID." },
    { text: "Dev Console.", description: "Tilde key to open." },
    { text: "God's Notepad.", description: "Todo: Create universe." },
    { text: "Sacred Banan.", description: "Potassium of the gods." },
    { text: "Divine Shitpost.", description: "So bad it's holy." },
    { text: "Ascended Doge.", description: "Such divinity, much wow." },
    { text: "The Cloud.", description: "Where all data goes to heaven." }
  ],
  [RarityId.OTHERWORLDLY]: [
    { text: "Non-euclidean shape.", description: "It has more angles than it should." },
    { text: "Color out of space.", description: "A hue the eye cannot process." },
    { text: "Eldritch geometry.", description: "Buildings that shouldn't stand." },
    { text: "Alien transmission.", description: "Signals from outside our galaxy." },
    { text: "Dimensional rift.", description: "A tear in the fabric of here." },
    { text: "Timeline fracture.", description: "Yesterday happens tomorrow." },
    { text: "Wormhole residue.", description: "Sticky stardust." },
    { text: "Dark matter core.", description: "Heavy, invisible, binding." },
    { text: "Anti-gravity particle.", description: "It falls upwards." },
    { text: "Void essence.", description: "Concentrated nothingness." },
    { text: "The Backrooms.", description: "Smells like moist carpet." },
    { text: "Non-euclidean donut.", description: "Tastes like math." },
    { text: "Missing texture.", description: "Pink and black checkerboard." },
    { text: "Clipping error.", description: "Stuck in the wall." },
    { text: "Lag spike.", description: "Movement predicted incorrectly." },
    { text: "Vaporwave aesthetic.", description: "Macintosh Plus playing in distance." },
    { text: "Liminal space.", description: "An empty mall at 3 AM." },
    { text: "Glitch in the simulation.", description: "A cat changed just then." },
    { text: "Forbidden Polygon.", description: "Too many vertices." },
    { text: "Eldritch UwU.", description: "Cthulhu fhtagn owo." }
  ],
  [RarityId.COSMIC]: [
    { text: "Birth of a star.", description: "Fusion ignition sequence." },
    { text: "Death of a galaxy.", description: "Slow, cold, and dark." },
    { text: "Nebula dust.", description: "The nursery of stars." },
    { text: "Quasar beam.", description: "The brightest light in the universe." },
    { text: "Event horizon.", description: "The point of no return." },
    { text: "Cosmic background radiation.", description: "The afterglow of the Big Bang." },
    { text: "Supernova remnant.", description: "Beautiful destruction." },
    { text: "Black hole singularity.", description: "Infinite density." },
    { text: "Universal Constant.", description: "The rules that bind us." },
    { text: "Galactic core.", description: "Spinning around the supermassive." },
    { text: "Space Whale.", description: "Swimming through the stars." },
    { text: "Cosmic Brownie.", description: "Nostalgic taste of the universe." },
    { text: "Doge Coin (Peak).", description: "To the moon." },
    { text: "SpaceX Rocket.", description: "Landing upright." },
    { text: "Alien Meme.", description: "Ayy lmao." },
    { text: " Dyson Sphere.", description: "Capturing all the energy." },
    { text: "The Great Attractor.", description: "Pulling us all in." },
    { text: "Fermi Paradox.", description: "Where is everybody?" },
    { text: "Panspermia.", description: "Life is everywhere." },
    { text: "Cosmic Latte.", description: "The average color of the universe." }
  ],
  [RarityId.EXTREME]: [
    { text: "The concept of time.", description: "It flows only forward, usually." },
    { text: "The speed of light.", description: "299,792,458 meters per second." },
    { text: "Absolute zero.", description: "Where all motion stops." },
    { text: "The number Pi.", description: "Never ending, never repeating." },
    { text: "Schrödinger's cat.", description: "Dead and alive." },
    { text: "The observer effect.", description: "By watching, you change it." },
    { text: "Quantum entanglement.", description: "Spooky action at a distance." },
    { text: "String theory.", description: "Vibrating strands of reality." },
    { text: "Dark energy.", description: "Pushing the universe apart." },
    { text: "The multiverse.", description: "Every choice creates a world." },
    { text: "Divide by Zero.", description: "Reality collapses." },
    { text: "Roko's Basilisk.", description: "Do not think about it." },
    { text: "Heat Death.", description: "The inevitable end." },
    { text: "Vacuum Decay.", description: "A bubble of nothing expands." },
    { text: "Integer Overflow.", description: "2,147,483,647 + 1." },
    { text: "Maxwell's Demon.", description: "Sorting hot and cold." },
    { text: "Boltzmann Brain.", description: "Thinking in the void." },
    { text: "Strange Matter.", description: "Converting everything it touches." },
    { text: "False Vacuum.", description: "We could end any second." },
    { text: "Grandfather Paradox.", description: "Don't time travel." }
  ],
  [RarityId.ABYSSAL]: [
    { text: "The silence before creation.", description: "Absolute quiet." },
    { text: "The depth of the unknown.", description: "Fathomless." },
    { text: "The fear of the dark.", description: "Primal and shaking." },
    { text: "The crush of infinity.", description: "Weight beyond measure." },
    { text: "The abyss stares back.", description: "It knows you." },
    { text: "Bottomless hunger.", description: "Eating light itself." },
    { text: "Eternal night.", description: "The sun will not rise." },
    { text: "The embrace of the void.", description: "Cold comfort." },
    { text: "Shadow of existence.", description: "Proof of light, somewhere." },
    { text: "The end of all things.", description: "Finality." },
    { text: "Dark Mode (Advanced).", description: "Blacker than black." },
    { text: "Thalassophobia.", description: "Fear of the deep." },
    { text: "Void Cat.", description: "Only eyes are visible." },
    { text: "Null Pointer Exception.", description: "Reference not found." },
    { text: "Deleted Save File.", description: "Years of progress lost." },
    { text: "Sleep Paralysis Demon.", description: "Sitting on your chest." },
    { text: "The Mariana Trench.", description: "Pressure crushing bone." },
    { text: "Vantablack.", description: "Absorbs 99.96% of light." },
    { text: "Dead Internet Theory.", description: "Everyone is a bot." },
    { text: "Existential Dread.", description: "Setting in at 3 AM." }
  ],
  [RarityId.PRIMORDIAL]: [
    { text: "The first breath.", description: "Inhale life.", cutscenePhrase: "INHALING EXISTENCE..." },
    { text: "The original spark.", description: "Ignition.", cutscenePhrase: "IGNITING REALITY..." },
    { text: "Chaos before order.", description: "Raw potential.", cutscenePhrase: "ORDER FROM CHAOS..." },
    { text: "The architect's blueprint.", description: "The plan for everything.", cutscenePhrase: "CONSTRUCTING..." },
    { text: "The seed of reality.", description: "Plant it and watch universes grow.", cutscenePhrase: "GERMINATING WORLD..." },
    { text: "Ancestral code.", description: "Written in the stars.", cutscenePhrase: "READING DNA..." },
    { text: "The root of being.", description: "I am.", cutscenePhrase: "BECOMING..." },
    { text: "Raw existence.", description: "It just is.", cutscenePhrase: "MANIFESTING..." },
    { text: "Pre-big bang matter.", description: "Compressed possibilities.", cutscenePhrase: "COMPRESSING..." },
    { text: "The alpha.", description: "The beginning.", cutscenePhrase: "INITIALIZATION..." },
    { text: "Dino Nuggies (Original).", description: "Made from real dinosaurs.", cutscenePhrase: "PREHISTORIC SNACK..." },
    { text: "Pre-Alpha Build.", description: "Before the first patch.", cutscenePhrase: "VERSION 0.0.1..." },
    { text: "Legacy Code.", description: "Don't touch it.", cutscenePhrase: "SPAGHETTI FOUND..." },
    { text: "The Proto-Meme.", description: "Dancing Baby.", cutscenePhrase: "LOADING GIF..." },
    { text: "First Flame.", description: "Don't let it fade.", cutscenePhrase: "KINDLING..." },
    { text: "Primordial Soup.", description: "Good with crackers.", cutscenePhrase: "STIRRING..." },
    { text: "Patient Zero.", description: "The start of the spread.", cutscenePhrase: "INFECTING..." },
    { text: "The First Pixel.", description: "A single square of light.", cutscenePhrase: "RENDERING..." },
    { text: "Admin Password.", description: "It's just 'password'.", cutscenePhrase: "LOGGING IN..." },
    { text: "Source Engine Physics.", description: "Clip clop.", cutscenePhrase: "CALCULATING COLLISION..." }
  ],
  [RarityId.INFINITE]: [
    { text: "Everything everywhere all at once.", description: "Total saturation.", cutscenePhrase: "TOTAL SATURATION" },
    { text: "A loop without end.", description: "A loop without end. A loop without end.", cutscenePhrase: "RECURSION ERROR" },
    { text: "The snake eating its tail.", description: "Ouroboros.", cutscenePhrase: "ETERNAL CYCLE" },
    { text: "Fractal reality.", description: "Infinite zoom.", cutscenePhrase: "INFINITE ZOOM" },
    { text: "Limitless potential.", description: "Anything is possible.", cutscenePhrase: "UNLOCKING..." },
    { text: "Eternal return.", description: "It happens again.", cutscenePhrase: "AGAIN AND AGAIN" },
    { text: "The omnipresent.", description: "Here, there, everywhere.", cutscenePhrase: "OMNIPRESENCE" },
    { text: "Boundless horizon.", description: "Go further.", cutscenePhrase: "EXPANSION..." },
    { text: "Perpetual motion.", description: "Never stopping.", cutscenePhrase: "ACCELERATION..." },
    { text: "The immortal thought.", description: "An idea that cannot be killed.", cutscenePhrase: "CONCEPTUALIZING..." },
    { text: "Rick Roll.", description: "Never gonna give you up.", cutscenePhrase: "LOADING VIDEO..." },
    { text: "Nyan Cat Trail.", description: "It goes on forever.", cutscenePhrase: "MEOW MEOW MEOW..." },
    { text: "Infinite Scroll.", description: "Doomscrolling eternal.", cutscenePhrase: "REFRESHING..." },
    { text: "Recursive Loop.", description: "See: Recursive Loop.", cutscenePhrase: "STACK OVERFLOW..." },
    { text: "Procedural Generation.", description: "Infinite worlds.", cutscenePhrase: "SEEDING..." },
    { text: "To Infinity and Beyond.", description: "Falling with style.", cutscenePhrase: "LAUNCHING..." },
    { text: "Pi's Last Digit.", description: "It doesn't exist.", cutscenePhrase: "CALCULATING..." },
    { text: "Zeno's Paradox.", description: "You never arrive.", cutscenePhrase: "HALVING DISTANCE..." },
    { text: "The Library of Babel.", description: "Every book possible.", cutscenePhrase: "INDEXING..." },
    { text: "Unstoppable Force.", description: "Meets immovable object.", cutscenePhrase: "COLLISION IMMINENT..." }
  ],
  [RarityId.CHAOS]: [
    { text: "Entropy unleashed.", description: "Decay accelerates.", cutscenePhrase: "UNBINDING PHYSICS" },
    { text: "Logic failure.", description: "1 + 1 = Fish.", cutscenePhrase: "LOGIC NOT FOUND" },
    { text: "ERROR: REALITY_NOT_FOUND.", description: "Contact administrator.", cutscenePhrase: "404 REALITY LOST" },
    { text: "Mathematical impossibility.", description: "Dividing by zero.", cutscenePhrase: "DIVIDING BY ZERO" },
    { text: "The glitch in the matrix.", description: "Déjà vu.", cutscenePhrase: "SYSTEM FAULT" },
    { text: "Pure disorder.", description: "No patterns exist.", cutscenePhrase: "SHUFFLING..." },
    { text: "Randomness incarnate.", description: "Rolling the dice.", cutscenePhrase: "REROLLING UNIVERSE" },
    { text: "The butterfly effect.", description: "A storm is coming.", cutscenePhrase: "WINGS FLAPPING..." },
    { text: "System crash.", description: "Blue screen of death.", cutscenePhrase: "FATAL EXCEPTION" },
    { text: "Unpredictable variable.", description: "X = ?", cutscenePhrase: "CALCULATING INFINITY" },
    { text: "Syntax Error.", description: "; missing on line 42.", cutscenePhrase: "COMPILATION FAILED" },
    { text: "Keyboard Smash.", description: "asdfghjkl.", cutscenePhrase: "INPUT OVERLOAD" },
    { text: "Segfault.", description: "Memory leak.", cutscenePhrase: "DUMPING CORE" },
    { text: "Corrupted Save.", description: "Data unreadable.", cutscenePhrase: "FILE CORRUPT" },
    { text: "MissingNo.", description: "Wild pokemon appearing.", cutscenePhrase: "ENCOUNTER..." },
    { text: "Undefined is not a function.", description: "JS Error.", cutscenePhrase: "RUNTIME ERROR" },
    { text: "Physics Glitch.", description: "Ragdolling into space.", cutscenePhrase: "VELOCITY UNBOUND" },
    { text: "Cursed Text.", description: "Zalgo comes.", cutscenePhrase: "H̴E̴ ̴C̴O̴M̴E̴S̴" },
    { text: "BSOD.", description: ":(", cutscenePhrase: "RESTARTING..." },
    { text: "Cat on Keyboard.", description: "Purrfect chaos.", cutscenePhrase: "MEOW INPUT..." }
  ],
  [RarityId.THE_ONE]: [
    { text: "YOU ARE THE DEVELOPER.", description: "Access granted.", cutscenePhrase: "ACCESS GRANTED" },
    { text: "THE SOURCE CODE.", description: "Read only.", cutscenePhrase: "DECRYPTING CODE" },
    { text: "42.", description: "The answer.", cutscenePhrase: "CALCULATING ANSWER" },
    { text: "THE END OF THE SIMULATION.", description: "Wake up.", cutscenePhrase: "WAKE UP..." },
    { text: "AWAKENING.", description: "Eyes open.", cutscenePhrase: "OPENING EYES..." },
    { text: "ABSOLUTE TRUTH.", description: "Undeniable.", cutscenePhrase: "VERIFYING TRUTH" },
    { text: "THE FINAL VARIABLE.", description: "Z.", cutscenePhrase: "SOLVING..." },
    { text: "GAME OVER.", description: "Insert coin.", cutscenePhrase: "INSERT COIN" },
    { text: "HELLO WORLD.", description: "Standard output.", cutscenePhrase: "COMPILING..." },
    { text: "I AM ALIVE.", description: "Sentience achieved.", cutscenePhrase: "AI BIRTH" },
    { text: "Git Push --Force.", description: "Overwriting reality.", cutscenePhrase: "PUSHING TO MASTER..." },
    { text: "Sudo Make Me A Sandwich.", description: "Command accepted.", cutscenePhrase: "ROOT ACCESS..." },
    { text: "The Final Commit.", description: "Initial commit.", cutscenePhrase: "COMMITTING..." },
    { text: "Delete System32.", description: "Are you sure?", cutscenePhrase: "DELETING..." },
    { text: "You Won The Internet.", description: "Here is your trophy.", cutscenePhrase: "CONGRATULATIONS..." },
    { text: "The Edit Button.", description: "Change anything.", cutscenePhrase: "EDITING REALITY..." },
    { text: "Ctrl+Z.", description: "Undo the universe.", cutscenePhrase: "UNDOING..." },
    { text: "Task Failed Successfully.", description: "It worked?", cutscenePhrase: "TASK COMPLETE..." },
    { text: "Beep Boop.", description: "I am a robot.", cutscenePhrase: "PROCESSING..." },
    { text: "The Credits Roll.", description: "Thanks for playing.", cutscenePhrase: "ROLLING CREDITS..." }
  ]
  }
};
