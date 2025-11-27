import { Ore } from '../../types';

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
    // --- TIER 8: ABSTRACT (71-79) - Liquid Luck Removed ---
    { id: 71, name: "Solid Light", description: "Photons frozen in place.", probability: 600000000, color: "text-yellow-50", glowColor: "#fefce8", tierName: "Photonic" },
    { id: 72, name: "Frozen Time", description: "A second that lasts forever.", probability: 800000000, color: "text-cyan-300", glowColor: "#67e8f9", tierName: "Chronal" },
    // { id: 73, name: "Liquid Luck", description: "Bottled probability.", probability: 1000000000, color: "text-amber-300", glowColor: "#fcd34d", tierName: "Fortune" }, // REMOVED
    { id: 74, name: "Crystallized Thought", description: "An idea made manifest.", probability: 1500000000, color: "text-pink-300", glowColor: "#f9a8d4", tierName: "Psionic" },
    { id: 75, name: "Sound Shard", description: "A physical noise.", probability: 2000000000, color: "text-emerald-300", glowColor: "#6ee7b7", tierName: "Sonic" },
    { id: 76, name: "Hypercube Fragment", description: "Part of a 4D shape.", probability: 3000000000, color: "text-violet-400", glowColor: "#a78bfa", tierName: "4th Dimension" }
];

export const GOLD_ORES: Ore[] = [
    // --- TIER 1: GLITTERING (1-10) ---
    { id: 1001, name: "Fool's Gold", description: "Looks valuable, but it's just shiny dirt.", probability: 100, color: "text-yellow-700", glowColor: "#a16207", tierName: "Gilded", dimension: 'GOLD' },
    { id: 1002, name: "Gilded Pebble", description: "A rock dipped in cheap paint.", probability: 150, color: "text-yellow-600", glowColor: "#ca8a04", tierName: "Gilded", dimension: 'GOLD' },
    { id: 1003, name: "Pyrite Dust", description: "Sparkles in the light.", probability: 200, color: "text-amber-600", glowColor: "#d97706", tierName: "Gilded", dimension: 'GOLD' },
    { id: 1004, name: "Bronze Nugget", description: "A simple alloy.", probability: 250, color: "text-orange-800", glowColor: "#9a3412", tierName: "Gilded", dimension: 'GOLD' },
    { id: 1005, name: "Brass Shard", description: "Used for instruments.", probability: 300, color: "text-yellow-500", glowColor: "#eab308", tierName: "Gilded", dimension: 'GOLD' },
    { id: 1006, name: "Amber Fossil", description: "Trapped in gold resin.", probability: 350, color: "text-amber-500", glowColor: "#f59e0b", tierName: "Gilded", dimension: 'GOLD' },
    { id: 1007, name: "Golden Sand", description: "Soft and warm.", probability: 400, color: "text-yellow-200", glowColor: "#fef08a", tierName: "Gilded", dimension: 'GOLD' },
    { id: 1008, name: "Sunstone Chip", description: "Radiates faint heat.", probability: 450, color: "text-orange-400", glowColor: "#fb923c", tierName: "Gilded", dimension: 'GOLD' },
    { id: 1009, name: "Citrine Geode", description: "Yellow crystals inside.", probability: 500, color: "text-yellow-300", glowColor: "#fde047", tierName: "Gilded", dimension: 'GOLD' },
    { id: 1010, name: "Electrum Ore", description: "Natural alloy of gold and silver.", probability: 600, color: "text-yellow-100", glowColor: "#fef9c3", tierName: "Gilded", dimension: 'GOLD' },

    // --- TIER 2: RADIANT (11-20) ---
    { id: 1011, name: "Solid Gold Bar", description: "Standard currency.", probability: 1000, color: "text-yellow-400 font-bold", glowColor: "#facc15", tierName: "Radiant", dimension: 'GOLD' },
    { id: 1012, name: "Royal Quartz", description: "Veined with pure gold.", probability: 2500, color: "text-purple-300", glowColor: "#d8b4fe", tierName: "Radiant", dimension: 'GOLD' },
    { id: 1013, name: "Topaz Crystal", description: "Hard and brilliant.", probability: 5000, color: "text-blue-300", glowColor: "#93c5fd", tierName: "Radiant", dimension: 'GOLD' },
    { id: 1014, name: "Golden Beryl", description: "Heliodor.", probability: 7500, color: "text-lime-300", glowColor: "#bef264", tierName: "Radiant", dimension: 'GOLD' },
    { id: 1015, name: "Sunfire Opal", description: "Burning from within.", probability: 10000, color: "text-orange-500 animate-pulse", glowColor: "#f97316", tierName: "Radiant", dimension: 'GOLD' },
    { id: 1016, name: "Imperial Jade", description: "Worth more than gold.", probability: 15000, color: "text-emerald-400", glowColor: "#34d399", tierName: "Radiant", dimension: 'GOLD' },
    { id: 1017, name: "Pharaoh's Lapis", description: "Gold flecked blue stone.", probability: 20000, color: "text-blue-600", glowColor: "#2563eb", tierName: "Radiant", dimension: 'GOLD' },
    { id: 1018, name: "Dragon's Hoard Coin", description: "Ancient and cursed.", probability: 30000, color: "text-red-500", glowColor: "#ef4444", tierName: "Radiant", dimension: 'GOLD' },
    { id: 1019, name: "Crown Jewel", description: "Fit for a king.", probability: 40000, color: "text-fuchsia-400", glowColor: "#e879f9", tierName: "Radiant", dimension: 'GOLD' },
    { id: 1020, name: "Aurora Gold", description: "Shimmers with colors.", probability: 50000, color: "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-500", glowColor: "#f0abfc", tierName: "Radiant", dimension: 'GOLD' },

    // --- TIER 3: DIVINE (21-25) ---
    { id: 1021, name: "Midas Touch Stone", description: "Turns things to gold.", probability: 100000, color: "text-yellow-300 drop-shadow-[0_0_10px_gold]", glowColor: "#fcd34d", tierName: "Divine", dimension: 'GOLD' },
    { id: 1022, name: "Celestial Gold", description: "Forged in a holy fire.", probability: 250000, color: "text-white drop-shadow-[0_0_10px_gold]", glowColor: "#ffffff", tierName: "Divine", dimension: 'GOLD' },
    { id: 1023, name: "Seraphim Ingot", description: "Burning with eyes.", probability: 500000, color: "text-orange-200 animate-pulse", glowColor: "#fed7aa", tierName: "Divine", dimension: 'GOLD' },
    { id: 1024, name: "Golden Fleece", description: "Wool of the gods.", probability: 750000, color: "text-amber-300", glowColor: "#fcd34d", tierName: "Divine", dimension: 'GOLD' },
    { id: 1025, name: "Ambrosia Crystal", description: "Solidified nectar.", probability: 1000000, color: "text-pink-300", glowColor: "#f9a8d4", tierName: "Divine", dimension: 'GOLD' },

    // --- TIER 4: ABSOLUTE (26-29) ---
    { id: 1026, name: "Liquid Sunlight", description: "Pure star matter.", probability: 5000000, color: "text-yellow-100 animate-pulse", glowColor: "#fef9c3", tierName: "Absolute", dimension: 'GOLD' },
    { id: 1027, name: "Philosopher's Gold", description: "The magnum opus.", probability: 10000000, color: "text-red-600 font-bold", glowColor: "#dc2626", tierName: "Absolute", dimension: 'GOLD' },
    { id: 1028, name: "Time-Lost Treasure", description: "From a golden timeline.", probability: 25000000, color: "text-cyan-400", glowColor: "#22d3ee", tierName: "Absolute", dimension: 'GOLD' },
    { id: 1029, name: "Universe Nugget", description: "A galaxy of gold.", probability: 50000000, color: "text-violet-500", glowColor: "#8b5cf6", tierName: "Absolute", dimension: 'GOLD' },

    // --- TIER 5: THE GOLDEN ONE (30) ---
    { id: 1030, name: "The Golden Ratio", description: "Perfect perfection.", probability: 100000000, color: "text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-800 drop-shadow-[0_0_25px_gold] animate-pulse", glowColor: "#facc15", tierName: "THE GOLD", dimension: 'GOLD' }
];

export const PRISM_ORES: Ore[] = [
    // --- TIER 1: REFRACTIVE (2001-2003) ---
    { id: 2001, name: "Glass Shard", description: "A sharp fragment of clear glass.", probability: 500, color: "text-cyan-100", glowColor: "#cffafe", tierName: "Refractive", dimension: 'PRISM' },
    { id: 2002, name: "Quartz Dust", description: "Sparkles like snow.", probability: 1000, color: "text-white", glowColor: "#ffffff", tierName: "Refractive", dimension: 'PRISM' },
    { id: 2003, name: "Faint Glimmer", description: "Barely visible light trapped in rock.", probability: 2500, color: "text-yellow-50", glowColor: "#fefce8", tierName: "Refractive", dimension: 'PRISM' },

    // --- TIER 2: CHROMATIC (2004-2006) ---
    { id: 2004, name: "Fiber Optic Root", description: "A natural light-carrying structure.", probability: 10000, color: "text-emerald-200", glowColor: "#a7f3d0", tierName: "Chromatic", dimension: 'PRISM' },
    { id: 2005, name: "Hard Light", description: "Solid photons.", probability: 50000, color: "text-blue-300 font-bold", glowColor: "#93c5fd", tierName: "Chromatic", dimension: 'PRISM' },
    { id: 2006, name: "Rainbow Crystal", description: "Refracts light into all colors.", probability: 250000, color: "text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-pulse", glowColor: "#a855f7", tierName: "Chromatic", dimension: 'PRISM' },

    // --- TIER 3: LUMINOUS (2007-2009) ---
    { id: 2007, name: "Bifrost Fragment", description: "A piece of the rainbow bridge.", probability: 1000000, color: "text-indigo-400", glowColor: "#818cf8", tierName: "Luminous", dimension: 'PRISM' },
    { id: 2008, name: "Photon Cluster", description: "A dense ball of pure light.", probability: 5000000, color: "text-yellow-100 drop-shadow-[0_0_15px_white]", glowColor: "#fef9c3", tierName: "Luminous", dimension: 'PRISM' },
    { id: 2009, name: "Mirror of Truth", description: "Reflects your soul.", probability: 25000000, color: "text-slate-200 italic", glowColor: "#e2e8f0", tierName: "Luminous", dimension: 'PRISM' },

    // --- TIER 3.5: SPECTRAL (2011-2015) ---
    { id: 2011, name: "Prism Shard", description: "A jagged piece of pure refraction.", probability: 50000000, color: "text-pink-200", glowColor: "#fbcfe8", tierName: "Spectral", dimension: 'PRISM' },
    { id: 2012, name: "Diffracted Gem", description: "Splits light into impossible colors.", probability: 60000000, color: "text-fuchsia-300", glowColor: "#f0abfc", tierName: "Spectral", dimension: 'PRISM' },
    { id: 2013, name: "Laser Geode", description: "Focuses light into a beam.", probability: 70000000, color: "text-red-400 animate-pulse", glowColor: "#f87171", tierName: "Spectral", dimension: 'PRISM' },
    { id: 2014, name: "Holographic Rock", description: "Is it really there?", probability: 80000000, color: "text-cyan-200 opacity-80", glowColor: "#a5f3fc", tierName: "Spectral", dimension: 'PRISM' },
    { id: 2015, name: "Neon Cluster", description: "Buzzes with noble gas energy.", probability: 90000000, color: "text-lime-300 drop-shadow-[0_0_5px_lime]", glowColor: "#bef264", tierName: "Spectral", dimension: 'PRISM' },

    // --- TIER 3.8: RADIANT (2016-2020) ---
    { id: 2016, name: "Plasma Crystal", description: "Solidified state of matter.", probability: 100000000, color: "text-violet-400", glowColor: "#a78bfa", tierName: "Radiant", dimension: 'PRISM' },
    { id: 2017, name: "Gamma Ore", description: "High frequency radiation trapped in stone.", probability: 125000000, color: "text-green-400 animate-pulse", glowColor: "#4ade80", tierName: "Radiant", dimension: 'PRISM' },
    { id: 2018, name: "X-Ray Stone", description: "You can see right through it.", probability: 150000000, color: "text-slate-200", glowColor: "#e2e8f0", tierName: "Radiant", dimension: 'PRISM' },
    { id: 2019, name: "Ultraviolet Gem", description: "Visible only to bees and machines.", probability: 200000000, color: "text-purple-600", glowColor: "#9333ea", tierName: "Radiant", dimension: 'PRISM' },
    { id: 2020, name: "Infrared Ingot", description: "Radiates pure heat.", probability: 250000000, color: "text-red-700", glowColor: "#b91c1c", tierName: "Radiant", dimension: 'PRISM' },

    // --- TIER 3.9: DIMENSIONAL (2021-2025) ---
    { id: 2021, name: "Tesseract Fragment", description: "A shadow of a 4D cube.", probability: 300000000, color: "text-indigo-500", glowColor: "#6366f1", tierName: "Dimensional", dimension: 'PRISM' },
    { id: 2022, name: "Klein Bottle Shard", description: "Has only one side.", probability: 400000000, color: "text-orange-300", glowColor: "#fdba74", tierName: "Dimensional", dimension: 'PRISM' },
    { id: 2023, name: "Mobius Strip Ore", description: "Infinite surface area.", probability: 500000000, color: "text-teal-400", glowColor: "#2dd4bf", tierName: "Dimensional", dimension: 'PRISM' },
    { id: 2024, name: "Non-Euclidean Geode", description: "Angles don't add up.", probability: 750000000, color: "text-rose-400 italic", glowColor: "#fb7185", tierName: "Dimensional", dimension: 'PRISM' },
    { id: 2025, name: "Singularity Crystal", description: "Infinite density at a single point.", probability: 900000000, color: "text-black bg-white px-1 drop-shadow-[0_0_10px_black]", glowColor: "#000000", tierName: "Dimensional", dimension: 'PRISM' },

    // --- TIER 4: THE SOURCE (2030) ---
    { id: 2030, name: "The Spectrum", description: "All colors, all light, all at once.", probability: 1000000000, color: "text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 drop-shadow-[0_0_30px_white] animate-pulse text-xl font-bold", glowColor: "#ffffff", tierName: "THE SOURCE", dimension: 'PRISM' }
];
