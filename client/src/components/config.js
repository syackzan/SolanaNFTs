export const IS_MAINNET = false;
export const IS_PRODUCTION = true;

export const URI_SERVER = IS_PRODUCTION === true ? import.meta.env.VITE_G_SERVER : 'http://localhost:8080';