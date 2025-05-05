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

export const fetchUsdToSolPrice = async () => {
    const CACHE_KEY = 'cachedUsdToSolPrice';
    const CACHE_TIME_KEY = 'cachedUsdToSolPrice_timestamp';
    const CACHE_DURATION = 60 * 1000 * 5;

    const cachedPrice = localStorage.getItem(CACHE_KEY);
    const cacheTimestamp = localStorage.getItem(CACHE_TIME_KEY);

    const now = Date.now();
    if (cachedPrice && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
        console.log(`returning cached pricing ${parseFloat(cachedPrice)}`)
        return parseFloat(cachedPrice);
    }

    // Fetch new price
    try {
        const response = await axios.get(`https://public.jupiterapi.com/quote?inputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&outputMint=So11111111111111111111111111111111111111112&amount=${1e6}`);
        const result = response.data;

        if (result?.outAmount) {
            const swapPrice = result.outAmount / 1e9;
            localStorage.setItem(CACHE_KEY, swapPrice);
            localStorage.setItem(CACHE_TIME_KEY, now.toString());
            return swapPrice;
        }
    } catch (error) {
        console.error("Error fetching USD to SOL price:", error.message || error);
    }

    return 0.009;
};

export const convertUsdToSolPrice = async (amountUSDC) => {

    console.log(amountUSDC);
    
    if(amountUSDC <= 0)
        return;

    console.log("Is not fetching price");

    const microUSD = amountUSDC * 1e6; //Convert dollars to micro dollars

    const usdToSolUrl = `https://public.jupiterapi.com/quote?inputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&outputMint=So11111111111111111111111111111111111111112&amount=${microUSD}`; // 1 USD in micro-USD

    try {
        const response = await axios.get(usdToSolUrl);
        const result = response.data;
        console.log(result);
        // Extract the swap price from the response
        if (result) {
            const swapPrice = result.outAmount / 1e9; // Convert lamports to SOL
            console.log(`${amountUSDC} USD is approximately ${swapPrice.toFixed(6)} SOL`);

            return Number(swapPrice);
        } else {
            console.error("No valid data found in the response.");
        }
    } catch (error) {
        console.error("Error fetching USD to SOL price:", error);
    }
};