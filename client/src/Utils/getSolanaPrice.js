// Replace with your QuickNode HTTP URL
const QUICKNODE_URL = import.meta.env.VITE_SOLANA_NODE;

import axios from 'axios';

export const getSolPriceInUSD = async () => {
    try {
        const response = await axios.get(
            "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        const solPrice = response.data.solana.usd;
        return solPrice; // Return the price
    } catch (error) {
        console.error("Error fetching SOL price:", error.message);
        throw error; // Re-throw the error for further handling
    }
};