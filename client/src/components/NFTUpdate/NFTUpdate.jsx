import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";

import { createCoreNft, sendSol } from '../BlockchainInteractions/blockchainInteractions';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';

const NFTUpdate = ({ setInfo, setAttributes, setProperties, setStoreInfo, refetchNFTs, userRole, wallet }) => {
    const [nfts, setNfts] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null); // Track the selected button

    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

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


    const isAdmin = userRole === "admin";

    const createNft = async () => {

        await createCoreNft(nfts[selectedIndex], wallet);
        return;

        console.log("Entering into core create");
        // await coreCreate(nfts[selectedIndex], wallet); //Works Successfully
        // const response = await simulateTransaction(nfts[selectedIndex], wallet);
        // const resp = await sendSol(wallet);

        if (!publicKey) {
            console.error("Wallet not connected");
            return;
        }

        try {
            const transaction = await sendSol(publicKey);
            const signature = await sendTransaction(transaction, connection);
            console.log(`Transaction signature: ${signature}`);

            const latestBlockhash = await connection.getLatestBlockhash(); // Required for the new strategy
            const confirmation = await connection.confirmTransaction(
                { signature, ...latestBlockhash }, // Use the signature and blockhash
                'confirmed' // Commitment level
            );

            if (confirmation.value.err) {
                throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
            }

            console.log("Transaction confirmed:", confirmation);

            try {
                if (confirmation) {
                    await createCoreNft(nfts[selectedIndex], wallet);
                }
            } catch (e) {
                console.log("Failed at Create NFT", e);
            }

        } catch (error) {
            console.error("Transaction failed", error);
        }

        console.log("NFT creation complete");
    }

    return (
        <div
            className="sidenav"
            style={{
                width: "60vw",
                backgroundColor: "#1E1E1E",
                color: "#FFFFFF",
                padding: "20px",
                height: "100vh",
                overflow: "auto", // Enables vertical scrolling
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
                        <div style={{ display: 'inline-block' }}>
                            <div className="d-flex justify-content-between" style={{ marginBottom: '5px' }}>
                                <div>Price: ${nft.storeInfo.price}</div>
                                {nft.storeInfo.metadataUri ? (<div><FaLock /></div>) : (<div><FaLockOpen /></div>)}
                            </div>
                            <button
                                key={index}
                                className={`${rarityClass} ${isSelected ? "selected" : ""}`}
                                style={{ marginBottom: "20px" }}
                                onClick={() => { setEditData(nft), setSelectedIndex(index) }}
                            >
                                <div className="d-flex" style={{ marginBottom: '10px' }}>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <img
                                            src={nft.image || "/path/to/default-image.png"}
                                            alt={nft.name || "NFT"}
                                            style={{ width: "100px", height: "100px" }}
                                        />
                                    </div>
                                    <div className="d-flex flex-column w-100">
                                        <h3 className="nft-name lazy-dog">{nft.name || "Unnamed NFT"}</h3>
                                        <div className="nft-stats d-flex flex-column justify-content-around align-items-center h-100 w-100 marykate">
                                            <div className="d-flex w-100">
                                                <p
                                                    style={{
                                                        flex: 0.45,
                                                        textAlign: 'left',
                                                    }}
                                                >
                                                    <strong>DAMAGE:</strong> {damage > 0 ? `+${damage}%` : "-"}
                                                </p>
                                                <p
                                                    style={{
                                                        flex: 0.55,
                                                        textAlign: 'left',
                                                    }}
                                                >
                                                    <strong>DODGE:</strong> {dodge > 0 ? `+${dodge}%` : "-"}
                                                </p>
                                            </div>
                                            <div className="d-flex" style={{ width: '100%' }}>
                                                <p
                                                    style={{
                                                        flex: 0.45,
                                                        textAlign: 'left',
                                                    }}
                                                >
                                                    <strong>DEFENSE:</strong> {defense > 0 ? `+${defense}%` : "-"}
                                                </p>
                                                <p
                                                    style={{
                                                        flex: 0.55,
                                                        textAlign: 'left',
                                                    }}
                                                >
                                                    <strong>COIN BOOST:</strong> {coinMultiplier > 0 ? `+${coinMultiplier}%` : "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid white', padding: '5px 0px' }}></div>
                                <div className="d-flex gap-3">
                                    <div className={nftBlockchainClass}>{nftBlockchain}</div>
                                    <div className={bannerClass}>{subType}</div>
                                </div>
                            </button>
                            {isAdmin && (
                                <div>
                                    <button onClick={createNft}>Create NFT</button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export default NFTUpdate;