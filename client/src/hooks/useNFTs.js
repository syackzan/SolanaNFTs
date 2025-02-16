import { useState, useEffect } from "react";
import { filterNfts, sortNftsByRarity } from '../Utils/filterByNfts';
import { useGlobalVariables } from "../providers/GlobalVariablesProvider";

export const useNFTs = ({ inStoreOnly = false } = {}) => {
    const { nftConcepts, searchItem } = useGlobalVariables(); // Retrieve all NFT Concepts from database

    const [nfts, setNfts] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null); // Track the selected button
    const [nftConceptsLoadingState, setNftConceptsLoadingState] = useState("loading");

    const [selectedType, setSelectedType] = useState("all");
    const [selectedSubType, setSelectedSubType] = useState("all");
    const [selectedRarity, setSelectedRarity] = useState("all");
    const [selectedCreator, setSelectedCreator] = useState("all");

    const fetchAndFilterNFTs = async () => {
        if (nftConcepts.length === 0) return;

        try {
            console.log("Fetching and filtering NFT Concepts...");

            // ✅ Apply initial filtering on store availability
            let filteredNFTs = nftConcepts;
            if (inStoreOnly) {
                filteredNFTs = nftConcepts.filter((nft) => nft.storeInfo.available === true);
            }

            // ✅ Apply selected filters
            const searchFilter = {
                type: selectedType,
                subtype: selectedSubType,
                rarity: selectedRarity,
                creator: selectedCreator,
            };

            let finalNFTs = sortNftsByRarity(filterNfts(filteredNFTs, searchFilter));

            // ✅ Apply Search Filter (Case-Insensitive Matching)
            if (searchItem.trim() !== "") {
                const lowercasedSearch = searchItem.toLowerCase();
                finalNFTs = finalNFTs.filter((nft) =>
                    nft.name.toLowerCase().includes(lowercasedSearch) 
                    // || nft.description.toLowerCase().includes(lowercasedSearch)
                );
            }

            // ✅ Update state once (avoid multiple re-renders)
            setNftConceptsLoadingState(finalNFTs.length > 0 ? "loaded" : "empty");
            setNfts(finalNFTs);

            console.log("Final Filtered NFTs: ", finalNFTs);
        } catch (e) {
            console.error("Error when accessing data", e.response?.data || e.message);
        }
    };

    // ✅ useEffect: Fetch & Filter NFTs on Load and when Filters Change
    useEffect(() => {
        fetchAndFilterNFTs();
    }, [
        nftConcepts,
        selectedType,
        selectedSubType,
        selectedRarity,
        selectedCreator,
        searchItem
    ]);

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
