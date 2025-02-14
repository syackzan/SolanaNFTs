import { useState, useEffect } from "react";

import { filterNfts, sortNftsByRarity } from '../Utils/filterByNfts'

import { useGlobalVariables } from "../providers/GlobalVariablesProvider";

export const useNFTs = ({ inStoreOnly = false } = {}) => {

    const { nftConcepts } = useGlobalVariables(); // Retrieve all Nft Concepts from database

    const [nfts, setNfts] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null); // Track the selected button
    const [nftConceptsLoadingState, setNftConceptsLoadingState] = useState("loading");

    const [selectedType, setSelectedType] = useState("all");
    const [selectedSubType, setSelectedSubType] = useState("all");
    const [selectedRarity, setSelectedRarity] = useState("all");
    const [selectedCreator, setSelectedCreator] = useState('all');

    const fetchAndFilterNFTs = async () => {
        if (nftConcepts.length === 0) return;
    
        try {
            console.log("Fetching and filtering NFT Concepts...");
    
            // ✅ Apply initial filtering on store availability without tracking `inStoreOnly`
            let filteredNFTs = nftConcepts;
            if (inStoreOnly) {
                filteredNFTs = nftConcepts.filter((nft) => nft.storeInfo.available === true);
            }
    
            // ✅ Apply selected filters
            const searchFilter = {
                type: selectedType,
                subtype: selectedSubType,
                rarity: selectedRarity,
                creator: selectedCreator
            };
    
            const finalNFTs = sortNftsByRarity(filterNfts(filteredNFTs, searchFilter));
    
            // ✅ Update state once (avoid multiple re-renders)
            setNftConceptsLoadingState(finalNFTs.length > 0 ? "loaded" : "empty"); // ✅ Set state accordingly
            setNfts(finalNFTs);
    
            console.log("Final Filtered NFTs: ", finalNFTs);
        } catch (e) {
            console.error("Error when accessing data", e.response?.data || e.message);
        }
    };
    
    // ✅ useEffect: Fetch & Filter NFTs on Load and when Filters Change
    useEffect(() => {
        fetchAndFilterNFTs();
    }, [nftConcepts, selectedType, selectedSubType, selectedRarity, selectedCreator]); 

    return {
        nfts,
        selectedType,
        setSelectedType,
        selectedSubType,
        setSelectedSubType,
        selectedRarity,
        setSelectedRarity,
        selectedCreator,
        setSelectedCreator,
        setSelectedIndex,
        selectedIndex,
        nftConceptsLoadingState,
    };
};

// export default useNFTs;