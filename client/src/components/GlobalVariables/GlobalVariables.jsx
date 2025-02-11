import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const GlobalVars = createContext();

import { useWallet } from '@solana/wallet-adapter-react';
import { getCoreNftsClient } from '../BlockchainInteractions/blockchainInteractions';

import { URI_SERVER } from "../../config/config";

import axios from 'axios';

// Create the provider component
export const GlobalVariables = ({ children }) => {
    const [inGameCurrency, setInGameCurrency] = useState(0); // First state variable
    const [boohToken, setBoohToken] = useState(0); // Second state variable
    const [userNfts, setUserNfts] = useState([]);
    const [nftConcepts, setNftConcepts] = useState([]);

    const wallet = useWallet();

    useEffect(() => {

        const runAsync = async () => {

            if (wallet.publicKey) {
                const data = await getCoreNftsClient(wallet.publicKey.toString());
                setUserNfts(data);
            }

        }

        runAsync();

    }, [wallet.publicKey])

    useEffect(() => {
        const fetchNftsAsync = async () => {
            const response = await axios.get(`${URI_SERVER}/api/nft/all`);
            const allNftConcepts = response.data || [];
            setNftConcepts(allNftConcepts);
        }

        fetchNftsAsync();
    }, []);

    const refetchNftConcepts = async () => {
        const response = await axios.get(`${URI_SERVER}/api/nft/all`);
        const allNftConcepts = response.data || [];
        setNftConcepts(allNftConcepts);
    }

    return (
        <GlobalVars.Provider value={{
            inGameCurrency,
            setInGameCurrency,
            boohToken,
            setBoohToken,
            userNfts,
            nftConcepts,
            refetchNftConcepts
        }}>
            {children}
        </GlobalVars.Provider>
    );
};