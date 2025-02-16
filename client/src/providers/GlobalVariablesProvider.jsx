import React, { createContext, useContext, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getCoreNftsClient } from "../services/blockchainServices";
import { fetchAllNftConcepts } from "../services/dbServices";

// ✅ Create Context (Renamed to `GlobalVariablesContext`)
const GlobalVariablesContext = createContext();

// ✅ Provider Component (Renamed to `GlobalVariablesProvider`)
export const GlobalVariablesProvider = ({ children }) => {
    // Game Currency & Tokens
    const [inGameCurrency, setInGameCurrency] = useState(0);
    const [boohToken, setBoohToken] = useState(0);

    // NFTs & Concepts
    const [userNfts, setUserNfts] = useState([]);
    const [nftConcepts, setNftConcepts] = useState([]);

    // Control Search Bar
    const [searchItem, setSearchItem] = useState('');

    // Solana Wallet
    const wallet = useWallet();

    // ✅ Fetch User NFTs (Runs when wallet changes)
    useEffect(() => {
        const fetchUserNFTs = async () => {
            if (wallet.publicKey) {
                const data = await getCoreNftsClient(wallet.publicKey.toString());
                console.log(data);
                setUserNfts(data);
            }
        };

        fetchUserNFTs();
    }, [wallet.publicKey]);

    // ✅ Fetch All NFT Concepts (Runs once on mount)
    useEffect(() => {
        const fetchNftConcepts = async () => {
            try {
                const data = await fetchAllNftConcepts();
                setNftConcepts(data || []);
            } catch (error) {
                console.error("Error fetching NFT Concepts:", error);
                
            }
        };

        fetchNftConcepts();
    }, []);

    // ✅ Manual Refetch Function
    const refetchNftConcepts = async () => {
        try {
            const data = await fetchAllNftConcepts();
            setNftConcepts(data || []);
        } catch (error) {
            console.error("Error refetching NFT Concepts:", error);
        }
    };

    // ✅ Provider Wrapper
    return (
        <GlobalVariablesContext.Provider
            value={{
                inGameCurrency,
                setInGameCurrency,
                boohToken,
                setBoohToken,
                userNfts,
                nftConcepts,
                refetchNftConcepts,
                searchItem,
                setSearchItem
            }}
        >
            {children}
        </GlobalVariablesContext.Provider>
    );
};

// ✅ Custom Hook for Consuming Context (Renamed to `useGlobalVariables`)
export const useGlobalVariables = () => {
    return useContext(GlobalVariablesContext);
};
