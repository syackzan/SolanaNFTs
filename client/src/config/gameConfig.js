// General Information Data
export const infoData = {
    name: '', // Default name for the entity
    symbol: 'BOOH', // Default symbol
    description: '', // Placeholder for description
    image: '', // Placeholder for the image URL
    external_link: 'https://boohworld.io/boohbrawlers/marketplace', // External link for more details
};

// Talents List
export const talents = ["damage", "defense", "dodge", "coinMultiplier"]; // Key talents used in the attributes system

// Base Attributes Data
export const attributesData = [
    { trait_type: "blockchain", value: "solana" }, // Blockchain type
    { trait_type: "type", value: "" }, // Item type
    { trait_type: "subType", value: "" }, // Item sub-type
    { trait_type: "rarity", value: "common" }, // Default rarity
    { trait_type: "affinity", value: "" }, // Default affinity
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

// Cost Associated with Each Rarity Level
export const creatorCosts = {
    common: 0,
    uncommon: 0,
    rare: 0.05,
    epic: 1.99,
    legendary: 4.99,
};

// Pricing Values (Base price adjusted dynamically)
const priceIncrease = 0; // Adjustable price increment
export const pricingValues = {
    common: 0.99 + priceIncrease,
    uncommon: 1.99 + priceIncrease,
    rare: 4.99 + priceIncrease,
    epic: 9.99 + priceIncrease,
    legendary: 15.99 + priceIncrease,
};

// Talent Point Distribution Based on Rarity
const basePercIncrease = 0; // Adjustable base percentage increase
export const talenPointSpread = {
    common: 3 + basePercIncrease,
    uncommon: 6 + basePercIncrease,
    rare: 10 + basePercIncrease,
    epic: 15 + basePercIncrease,
    legendary: 25 + basePercIncrease,
};

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
};

// Option Types for Select Inputs
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
];

export const skinOptions = [
    'body',
];

export const accessoriesOptions = [
    'pendant',
];

export const rarityOptions = [
    'common',
    'uncommon',
    'rare',
    'epic',
    'legendary',
];

export const defaultMintCost = .004;
