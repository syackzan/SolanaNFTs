import { fetchUsdToSolPrice, getSolPriceInUSD } from '../services/solPricingServices';

export const convertUsdToSol = async (payment, mintCosts = 0) => {
    try {

        console.log('Entering Pricing Method 1');
        const paymentInSol = await fetchUsdToSolPrice(payment);

        console.log("Captured pricing method 1");
        return Number(paymentInSol + mintCosts);

    } catch (e) {
        try{
            console.log("Failed to capture pricing Data from Jupiter");
            const SOL_TO_USD = await getSolPriceInUSD();

            const paymentInSol = Number((payment / SOL_TO_USD).toFixed(6));
            console.log("capture pricing data 2")

            return Number(paymentInSol + mintCosts);
        } catch(e){

            console.log("Failed to capture pricing data 2");
            const paymentInSol =Number(payment/200).toFixed(6)

            return Number(paymentInSol + mintCosts);
        }
    }
}

