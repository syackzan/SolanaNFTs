import React, { createContext, useContext, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getCoreNftsClient } from "../BlockchainInteractions/blockchainInteractions";
import axios from "axios";
import { URI_SERVER } from "../../config/config";

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

    // Solana Wallet
    const wallet = useWallet();

    // ✅ Fetch User NFTs (Runs when wallet changes)
    useEffect(() => {
        const fetchUserNFTs = async () => {
            if (wallet.publicKey) {
                const data = await getCoreNftsClient(wallet.publicKey.toString());
                setUserNfts(data);
            }
        };

        fetchUserNFTs();
    }, [wallet.publicKey]);

    // ✅ Fetch All NFT Concepts (Runs once on mount)
    useEffect(() => {
        const fetchNftConcepts = async () => {
            try {
                const response = await axios.get(`${URI_SERVER}/api/nft/all`);
                setNftConcepts(response.data || []);
            } catch (error) {
                console.error("Error fetching NFT Concepts:", error);
            }
        };

        fetchNftConcepts();
    }, []);

    // ✅ Manual Refetch Function
    const refetchNftConcepts = async () => {
        try {
            const response = await axios.get(`${URI_SERVER}/api/nft/all`);
            setNftConcepts(response.data || []);
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
