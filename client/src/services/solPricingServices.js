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

export const fetchUsdToSolPrice = async (amountUSD) => {

    console.log(amountUSD);
    
    if(amountUSD <= 0)
        return;

    console.log("Is not fetching price");

    const microUSD = amountUSD * 1e6; //Convert dollars to micro dollars

    const usdToSolUrl = `https://public.jupiterapi.com/quote?inputMint=EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm&outputMint=So11111111111111111111111111111111111111112&amount=${microUSD}`; // 1 USD in micro-USD

    try {
        const response = await axios.get(usdToSolUrl);
        const result = response.data;
        console.log(result);
        // Extract the swap price from the response
        if (result) {
            const swapPrice = result.outAmount / 1e9; // Convert lamports to SOL
            console.log(`${amountUSD} USD is approximately ${swapPrice.toFixed(6)} SOL`);

            return Number(swapPrice);
        } else {
            console.error("No valid data found in the response.");
        }
    } catch (error) {
        console.error("Error fetching USD to SOL price:", error);
    }
};