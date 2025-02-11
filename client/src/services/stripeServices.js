import axios from 'axios';
import { URI_SERVER } from '../config/config';

export const createPaymentIntent = async (payment, id, walletAddress) => {

    try{

        const builtUrl = `${URI_SERVER}/api/stripe/payment?payment=${payment}&id=${id}&walletAddress=${walletAddress}`;

        const response = await axios.get(builtUrl);

        return response.data;

    }catch (e){
        console.log('Error creating Payment Intent', e);
    }
}