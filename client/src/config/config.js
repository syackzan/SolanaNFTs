export const IS_MAINNET = false;
export const IS_PRODUCTION = import.meta.env.MODE === 'production';
export const COLLECTION_ADDRESS = '';

export const URI_SERVER = IS_PRODUCTION ? import.meta.env.VITE_G_SERVER : 'http://localhost:8080';
export const URI_FRONTEND = IS_PRODUCTION ? 'https://nft.boohworld.io' : 'http://localhost:5173';
