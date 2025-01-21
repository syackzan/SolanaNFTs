import { useState, useEffect } from "react";
import axios from "axios";
import { filterNFTs, sortNFTsByRarity } from '../../Utils/filterUtils'

import { URI_SERVER } from "../../config/config";

const useNFTs = ({ inStoreOnly = false, refetchNFTs } = {}) => {
    const [nfts, setNfts] = useState([]);
    const [nftsToSort, setNftsToSort] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null); // Track the selected button

    const [selectedType, setSelectedType] = useState("all");
    const [selectedSubType, setSelectedSubType] = useState("all");
    const [selectedRarity, setSelectedRarity] = useState("all");
    const [selectedCreator, setSelectedCreator] = useState('all');
    const [isFetched, setIsFetched] = useState(false);

    // Fetch NFT metadata
    const fetchNFTs = async () => {

        console.log(inStoreOnly);

        try {

            setSelectedIndex(null);

            if (!isFetched) {
                console.log("Fetching NFT data from API...");
                const response = await axios.get(`${URI_SERVER}/api/nft/all`);
                const allNFTs = response.data || [];

                let filteredNFTs = allNFTs;

                // Apply the inStoreOnly filter if the flag is true
                if (inStoreOnly) {
                    filteredNFTs = allNFTs.filter((nft) => nft.storeInfo.available === true);
                }

                const nftsForStore = sortNFTsByRarity(filteredNFTs);
                setNfts(nftsForStore);
                setNftsToSort(nftsForStore);

                console.log("store nfts: ", nftsForStore);
                setIsFetched(true);
            } else {
                console.log("NFT data already fetched. Running filter.");

                const searchFilter = {
                    type: selectedType,
                    subtype: selectedSubType,
                    rarity: selectedRarity,
                    creator: selectedCreator
                };

                setNfts(sortNFTsByRarity(filterNFTs(nftsToSort, searchFilter)));
            }
        } catch (e) {
            console.error("Error when accessing data", e.response?.data || e.message);
        }
    };

    // Re-fetch whenever filters change
    useEffect(() => {
        fetchNFTs();
    }, [selectedType, selectedRarity, selectedSubType, selectedCreator]);

    useEffect(() => {
        const updatedDatabase = async () => {
            console.log("Fetching NFT data from API...");
            const response = await axios.get(`${URI_SERVER}/api/nft/all`);
            const allNFTs = response.data || [];

            let filteredNFTs = allNFTs;

            // Apply the inStoreOnly filter if the flag is true
            if (inStoreOnly) {
                filteredNFTs = allNFTs.filter((nft) => nft.storeInfo.available === true);
            }

            const searchFilter = {
                type: selectedType,
                subtype: selectedSubType,
                rarity: selectedRarity,
                creator: selectedCreator
            };

            setNfts(sortNFTsByRarity(filterNFTs(filteredNFTs, searchFilter)));
            setSelectedIndex(null);
        }

        updatedDatabase();
    }, [refetchNFTs])

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
        isFetched,
        setIsFetched,
        fetchNFTs,
        setSelectedIndex,
        selectedIndex,
    };
};

export default useNFTs;