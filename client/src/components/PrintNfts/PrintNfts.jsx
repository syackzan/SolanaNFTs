import React, { useState } from 'react'

import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";

import { useTransactionsController } from '../../providers/TransactionsProvider';

import { useGlobalVariables } from '../../providers/GlobalVariablesProvider';

const PrintNfts = ({
    nfts,
    selectedIndex,
    setSelectedIndex,
    location,
    openModal,
    isAdmin = false,
    setEditData,
    setPaymentTracker,
    nftConceptsLoadingState }) => {

    const { userNfts } = useGlobalVariables();

    const [reBuying, setReBuying] = useState({}); // Track NFTs that can be rebought

    const isLocked = nfts[selectedIndex]?.storeInfo?.metadataUri ? true : false;

    const {
        setIsModalOpen,
        setModalType
    } = useTransactionsController();

    // Check if NFT is purchased
    const isPurchased = (nft) => userNfts.some((ownedNft) => ownedNft.name === nft.name);

    const buyAgain = (nft) => {
        setReBuying((prev) => ({ ...prev, [nft.description]: true }));
    };

    // ✅ **Handle Loading States**
    if (nftConceptsLoadingState === "loading") {
        return (
            <div className="d-flex gap-2 align-items-center justify-content-center"
                style={{
                    width: "100%",
                    backgroundColor: "#1E1E1E",
                    color: "#FFFFFF",
                    padding: "20px",
                    height: "100vh",
                    overflow: "auto",
                }}
            >
                <div className="loader"></div>
                <div className="marykate" style={{ fontSize: "1.5rem" }}>Loading NFTs...</div>
            </div>
        );
    }

    if (nftConceptsLoadingState === "empty") {
        return (
            <div className="d-flex align-items-center justify-content-center"
                style={{
                    width: "100%",
                    backgroundColor: "#1E1E1E",
                    color: "#FFFFFF",
                    padding: "20px",
                    height: "100vh",
                    textAlign: "center",
                }}
            >
                <h2>No NFTs Available</h2>
            </div>
        );
    }

    return (
        <div
            style={{
                width: '100%',
                backgroundColor: "#1E1E1E",
                color: "#FFFFFF",
                padding: "20px",
                height: "100vh",
                overflow: "auto", // Enables vertical scrolling
            }}
        >
            <div className="d-flex gap-3 flex-wrap justify-content-center">
                {nfts.map((nft, index) => {
                    const rarity = nft.attributes.find(
                        (attr) => attr.trait_type === "rarity"
                    )?.value || "unknown";
                    const type = nft.attributes.find(
                        (attr) => attr.trait_type === "type"
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
                    const purchased = isPurchased(nft); // Check if the NFT is owned

                    console.log(purchased, nft.name);

                    return (
                        <div key={index} style={{ display: 'inline-block' }}>
                            <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '5px' }}>
                                <div>Price: ${nft.storeInfo.price}</div>
                                {nft.storeInfo.available ? (<div>in-store✅</div>) : (<div>in-store❌</div>)}
                                {nft.storeInfo.metadataUri ? (<div>Data <FaLock /></div>) : (<div>Data <FaLockOpen /></div>)}
                            </div>
                            <button
                                className={`${rarityClass} ${isSelected ? "selected" : ""}`}
                                style={{
                                    marginBottom: "5px",
                                    opacity: purchased ? 0.6 : 1,  // 🔹 Gray effect for owned items
                                    filter: purchased ? "grayscale(50%)" : "none", // 🔹 Subtle desaturation effect
                                }}
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
                                    <div className={bannerClass}>{type}</div>
                                    <div className={bannerClass}>{subType}</div>
                                </div>
                            </button>
                            {location === 'creator-hub' && isAdmin && isSelected ? (
                                <div className="d-flex align-items-center justify-content-between p-2" style={{ backgroundColor: "#1e1e2f", borderRadius: "8px", color: "#ffffff" }}>
                                    <div style={{ fontSize: "1rem", fontWeight: "500" }}>[ADMIN ONLY]:</div>
                                    <div className="d-flex gap-2">
                                        <button onClick={() => { setIsModalOpen(true); setModalType('delete') }} className='button-style-delete'>
                                            DELETE
                                        </button>
                                        {isLocked ?
                                            (
                                                <button onClick={() => { openModal('SOL') }} className='button-style-regular'>
                                                    CREATE NFT
                                                </button>
                                            ) : (
                                                <button onClick={() => { setIsModalOpen(true); setModalType('lock') }} className='button-style-regular'>
                                                    LOCK DATA
                                                </button>
                                            )}
                                    </div>
                                </div>
                            ) : location === "marketplace" && isSelected ? (
                                <>
                                    <div className="d-flex align-items-center justify-content-between p-2" style={{ backgroundColor: "#1e1e2f", borderRadius: "8px", color: "#ffffff" }}>
                                        {purchased && !reBuying[nft.description] ? (
                                            <>
                                                <div style={{ fontSize: "1rem", fontWeight: "500" }}>ALREADY OWNED:</div>
                                                <button onClick={() => buyAgain(nft)} className='button-style-regular'>BUY AGAIN</button>
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ fontSize: "1rem", fontWeight: "500" }}>BUY WITH:</div>
                                                <div className="d-flex gap-2">
                                                    <button onClick={() => { openModal('CARD'); setPaymentTracker('CARD'); }} className='button-style-regular'>Card</button>
                                                    <button onClick={() => { openModal('BABYBOOH'); setPaymentTracker('BABYBOOH'); }} className='button-style-regular'>BabyBooh</button>
                                                    <button onClick={() => { openModal('SOL'); setPaymentTracker('SOL'); }} className='button-style-regular'>SOL</button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default PrintNfts;