// General Information Data
export const infoData = {
    name: '', // Default name for the entity
    symbol: 'BOOH', // Default symbol
    description: '', // Placeholder for description
    image: '', // Placeholder for the image URL
    external_link: 'https://nft.boohworld.io/marketplace', // External link for more details
};

// Talents List
export const talents = [
    "health",
    "damage",
    "defense",
    "evasion",
    "coinMultiplier",
    "criticalStrikeDamage",
    "specialAttack",
    "specialDefense",
    "focus",
    "gasReserve",
]; // Key talents used in the attributes system

// Base Attributes Data
export const attributesData = [
    { trait_type: "blockchain", value: "solana" }, // Blockchain type
    { trait_type: "type", value: "" }, // Item type
    { trait_type: "subType", value: "" }, // Item sub-type
    { trait_type: "rarity", value: "common" }, // Default rarity
    { trait_type: "affinity", value: "" }, // Default affinity
    { trait_type: "division", value: "none" },
    { trait_type: "level", value: "1"} //Level Requirement
];

// Function to dynamically add missing talents to attributesData
export const getAttributesData = () => {
    // Extract existing talents from attributesData
    const existingTalents = attributesData
        .filter(attr => talents.includes(attr.trait_type))
        .map(attr => attr.trait_type);

    // Add any missing talents with default values
    const newTalents = talents
        .filter(talent => !existingTalents.includes(talent))
        .map(talent => ({ trait_type: talent, value: "0" }));

    // Return the updated attributesData array
    return [...attributesData, ...newTalents];
};

// Properties Data for Metadata
export const propertiesData = {
    files: [
        {
            uri: null, // Placeholder for the file URI
            type: "image/png", // Default file type
        },
    ],
    category: "image", // Default category for the file
};

export const mintCost = 0.004;

// Cost Associated with Each Rarity Level
export const creatorCosts = {
    common: 0.05,
    uncommon: 0.11,
    rare: 0.99,
    epic: 3.99,
    legendary: 5.99,
};

// Pricing Values (Base price adjusted dynamically)
const priceIncrease = 0; // Adjustable price increment
export const pricingValues = {
    common: 4.99 + priceIncrease,
    uncommon: 9.99 + priceIncrease,
    rare: 15.99 + priceIncrease,
    epic: 29.99 + priceIncrease,
    legendary: 44.99 + priceIncrease,
};

// Talent Point Distribution Based on Rarity
const basePercIncrease = 0; // Adjustable base percentage increase
export const talenPointSpread = {
    common: 3 + basePercIncrease,
    uncommon: 5 + basePercIncrease,
    rare: 7 + basePercIncrease,
    epic: 10 + basePercIncrease,
    legendary: 13 + basePercIncrease,
};

const baseInGameIncrease = 0
export const inGameCurrencyCost = {
    common: 10000 + baseInGameIncrease,
    uncommon: 50000 + baseInGameIncrease,
    rare: 150000 + baseInGameIncrease,
    epic: 300000 + baseInGameIncrease,
    legendary: 1000000 + baseInGameIncrease
}

// Store Information Defaults
const startingPrice = 0.99; // Default starting price
const currentSeason = 1; // Current season number
const startingAvailability = false; // Default availability status
export const storeInfoData = {
    available: startingAvailability, // Indicates whether the item is available
    price: startingPrice, // Initial price of the item
    season: currentSeason, // Season the item belongs to
    metadataUri: '', // URI for metadata
    creator: '', // Default creator
    mintLimit: -1, // -1 is default, and sets the mint limit to infinite
    goldCost: 0,
    babyBoohCost: 0
};

export const sellingThreshold = {
    common: 100,
    uncommon: 100,
    rare: 75,
    epic: 50,
    legendary: 50
}

// Option Types for Select Inputs

export const generalTypes = [
    'skin',
    'weapon',
    'armor',
    'accessory'
]

export const affinityOptions = [
    'fire',
    'ice',
    'water',
    'lightning',
    'earth',
    'wind',
    'light',
    'dark',
    'poison',
];

export const armorOptions = [
    'chest',
    'gloves',
    'leggings',
    'helm',
];

export const weaponOptions = [
    'sword',
    'axe',
    'dagger',
    'staff',
    'bow',
    'scythe'
];

export const skinOptions = [
    'body',
];

export const accessoriesOptions = [
    'pendant',
    'tome',
    'necklace',
    'ring',
    'amulet'
];

export const rarityOptions = [
    'common',
    'uncommon',
    'rare',
    'epic',
    'legendary',
    'unique',
    'event'
];

export const divisionOptions = [
    'crebel',
    'elites'
]

export const defaultMintCost = .004;

export const submissionCost = 24.99;

export const newStats = {
    strength: ''
}