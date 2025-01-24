import axios from 'axios';

import { URI_SERVER } from "../config/config";

export const fetchBabyBooh = async (address) => {
    

    try{

        const response = await axios.get(`${URI_SERVER}/api/boohbrawlers/usercoins`, 
            {
                params: {address}
            }
        );
        
        return response.data;

    }catch(e){
        console.log(e);
    }
};

export const deductBabyBooh = () => {

}

// const buildURL = `${import.meta.env.VITE_VERCEL_URL}${import.meta.env.VITE_VERCEL_GET}${address}`;
    // console.log(buildURL);

    // try {
    //     const response = await axios.get(buildURL, {
    //         headers: {
    //             Authorization: `Bearer ${import.meta.env.VITE_TOKEN_BEARER}`,
    //         },
    //     });

    //     console.log(response.data);
    //     return response.data; // Return the data for further use
    // } catch (e) {
    //     console.error("Get Baby Booh Amount failed:", e.message);
    //     throw e; // Optionally re-throw the error for the calling function to handle
    // }