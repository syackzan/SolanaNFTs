export const infoData = { 
    name: '', 
    symbol: 'BOOH', 
    description: '', 
    image: '', 
    external_link: 'https://boohworld.io/boohbrawlers/marketplace' };

export const attributesData = [
    { trait_type: "blockchain", value: "solana" },
    { trait_type: "type", value: "" },
    { trait_type: "subType", value: "" },
    { trait_type: "rarity", value: "common" },
    { trait_type: "affinity", value: "" },
    { trait_type: "damage", value: "0" },
    { trait_type: "defense", value: "0" },
    { trait_type: "dodge", value: "0" },
    { trait_type: "coinMultiplier", value: "0" },
];

export const propertiesData = {
    files: [
        {
            uri: null,
            type: "image/png"
        }
    ],
    category: "image"
}

const priceIncrease = 0;

export const pricingValues = {
    common: 0.99 + priceIncrease,
    uncommon: 1.99 + priceIncrease,
    rare: 4.99 + priceIncrease,
    epic: 9.99 + priceIncrease,
    legendary: 15.99 + priceIncrease
}

const basePercIncrease = 0

export const talenPointSpread = {
    common: 3 + basePercIncrease,
    uncommon: 6 + basePercIncrease,
    rare: 10 + basePercIncrease,
    epic: 15 + basePercIncrease,
    legendary: 25 + basePercIncrease
}

const startingPrice = 0.99
const currentSeason = 1;
const startingAvailability = false;

export const storeInfoData = {
    available: startingAvailability,
    price: startingPrice,
    season: currentSeason,
    metadataUri: '',
    creator: '',
}

// Option Types
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
]

export const armorOptions = [
    'chest',
    'gloves',
    'leggings',
    'helm'
]

export const weaponOptions = [
    'sword',
    'axe',
    'dagger',
    'staff',
    'bow'
]

export const skinOptions = [
    'body'
]

export const accessoriesOptions = [
    'pendant'
]

export const rarityOptions = [
    'common',
    'uncommon',
    'rare',
    'epic',
    'legendary'
]