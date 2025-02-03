import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const GlobalVars = createContext();

import { useWallet } from '@solana/wallet-adapter-react';
import { getCoreNftsClient } from '../BlockchainInteractions/blockchainInteractions';

// Create the provider component
export const GlobalVariables = ({ children }) => {
    const [inGameCurrency, setInGameCurrency] = useState(0); // First state variable
    const [boohToken, setBoohToken] = useState(0); // Second state variable
    const [userNfts, setUserNfts] = useState([]);

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

    return (
        <GlobalVars.Provider value={{ inGameCurrency, setInGameCurrency, boohToken, setBoohToken, userNfts }}>
            {children}
        </GlobalVars.Provider>
    );
};