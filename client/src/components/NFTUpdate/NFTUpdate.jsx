import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";

const NFTUpdate = ({ setInfo, setAttributes, setProperties, setStoreInfo, refetchNFTs, deleteMetadata }) => {
    const [nfts, setNfts] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null); // Track the selected button

    // Fetch NFT metadata
    const fetchNFTs = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/nft/all");
            setNfts(response.data || []); // Ensure `nfts` is an array
            console.log("NFT DATA", response.data);
        } catch (e) {
            console.error("Error when accessing data", e.response?.data || e.message);
        }
    };

    // Initial fetch on component mount
    useEffect(() => {
        fetchNFTs();
    }, [refetchNFTs]);

    const setEditData = async (nft) => {
        console.log(nft);

        const infoToUpdate = {
            name: nft.name,
            description: nft.description,
            external_link: nft.external_link,
            image: nft.image,
            symbol: nft.symbol,
            _id: nft._id,
            _v: nft._v
        }
        setInfo(infoToUpdate);
        setProperties(nft.properties);
        setAttributes(nft.attributes);
        setStoreInfo(nft.storeInfo);
    }

    return (
        <div
            style={{
                width: "60vw",
                backgroundColor: "#1E1E1E",
                color: "#FFFFFF",
                padding: "20px",
                height: "100vh",
                overflowY: "auto",
                boxShadow: "2px 0 5px rgba(0, 0, 0, 0.5)",
                marginTop: "60px",
                overflow: "hidden",
            }}
        >
            <div className="d-flex gap-3 flex-wrap">
                {nfts.map((nft, index) => {
                    const rarity = nft.attributes.find(
                        (attr) => attr.trait_type === "rarity"
                    )?.value || "unknown";
                    const subType = nft.attributes.find(
                        (attr) => attr.trait_type === "subType"
                    )?.value || "unknown";

                    const rarityClass = `nft-box shadow-${rarity.toLowerCase()}`;
                    const bannerClass = `banner-standards banner-${rarity.toLowerCase()}`;
                    const nftBlockchain = nft.attributes.find(
                        (attr) => attr.trait_type === "blockchain"
                    )?.value || "solana";
                    const nftBlockchainClass = `blockchain-${nftBlockchain}`;

                    const damage = nft.attributes.find(
                        (attr) => attr.trait_type === "damage"
                    )?.value || 0;
                    const defense = nft.attributes.find(
                        (attr) => attr.trait_type === "defense"
                    )?.value || 0;
                    const dodge = nft.attributes.find(
                        (attr) => attr.trait_type === "dodge"
                    )?.value || 0;
                    const coinMultiplier = nft.attributes.find(
                        (attr) => attr.trait_type === "coinMultiplier"
                    )?.value || 0;

                    const isSelected = selectedIndex === index;

                    return (
                        <div>
                            <div className="d-flex justify-content-between" style={{marginBottom: '5px'}}>
                                <div>Price: ${nft.storeInfo.price}</div>
                                {nft.storeInfo.metadataUri ? (<div><FaLock/></div>) : (<div><FaLockOpen /></div>)}
                            </div>
                            <button key={index}
                                className={`${rarityClass} ${isSelected ? "selected" : ""}`}
                                style={{ marginBottom: "20px" }}
                                onClick={() => { setEditData(nft), setSelectedIndex(index) }}>
                                <div
                                    className="d-flex justify-content-between"
                                    style={{ marginBottom: "10px" }}
                                >
                                    <div className={bannerClass}>{subType}</div>
                                    <div className={nftBlockchainClass}>{nftBlockchain}</div>
                                </div>
                                <img
                                    src={nft.image || "/path/to/default-image.png"} // Replace with a default image path if necessary
                                    alt={nft.name || "NFT"}
                                    style={{ width: "150px", height: "150px" }}
                                />
                                <h3 className="nft-name">{nft.name || "Unnamed NFT"}</h3>
                                <div className="nft-stats">
                                    <p>
                                        <strong>Damage Boost:</strong> {damage > 0 ? `+${damage}%` : "-"}
                                    </p>
                                    <p>
                                        <strong>Defense:</strong> {defense > 0 ? `+${defense}%` : "-"}
                                    </p>
                                    <p>
                                        <strong>Dodge:</strong> {dodge > 0 ? `+${dodge}%` : "-"}
                                    </p>
                                    <p>
                                        <strong>Coin Multiplier:</strong> {coinMultiplier > 0 ? `+${coinMultiplier}%` : "-"}
                                    </p>
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export default NFTUpdate;