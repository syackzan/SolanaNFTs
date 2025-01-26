import axios from 'axios';
import { URI_SERVER } from '../config/config';

export const createPaymentIntent = async (payment) => {

    try{

        const builtUrl = `${URI_SERVER}/api/stripe/payment`;

        const response = await axios.get(builtUrl);

        return response.data;

    }catch (e){
        console.log('Error creating Payment Intent', e);
    }
}