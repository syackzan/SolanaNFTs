import React, { useState } from 'react'

import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";

import { useTransactionsController } from '../../providers/TransactionsProvider';

import { useGlobalVariables } from '../../providers/GlobalVariablesProvider';

import { useWallet } from '@solana/wallet-adapter-react';
import NftConceptVoting from '../NftConceptVoting/NftConceptVoting';

import { prelaunch } from '../../config/config';
import { mintCost } from '../../config/gameConfig';
import { getTraitRows } from '../../Utils/renderNftHelper';

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

    const wallet = useWallet();

    const { userNfts, approxSolToUSD } = useGlobalVariables();

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

    const calculateRemainingMints = (nft) => {

        const mintLimit = nft.storeInfo.mintLimit;

        if (mintLimit < 0 || !mintLimit) {
            return <div>Remaining: Infinite</div>
        }

        const nftsRemainingToMint = nft.storeInfo.mintLimit - nft.purchases.totalCreates;

        if (nftsRemainingToMint <= 0) {
            return <div style={{ color: '#C04000' }}>Sold Out!</div>
        } else {
            return <div>Remaining: {nftsRemainingToMint}</div>
        }

    }

    const isBuyDisabled = (nft) => {
        const { mintLimit } = nft.storeInfo;
        return mintLimit !== -1 && mintLimit && mintLimit - nft.purchases.totalCreates <= 0 && location !== 'creator-hub';
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
                {prelaunch ? (
                    <div>
                        <h2 className="marykate" style={{ fontSize: '45px' }}>No NFTs Found!</h2>
                        {/* <h2 className="marykate" style={{ fontSize: '45px' }}>PVP NFT Launch Coming Soon!</h2>
                        <h3 className="marykate" style={{ fontSize: '35px' }}>Preview NFTs in Creator Hub</h3> */}
                    </div>
                ) : (
                    <h2 className="marykate" style={{ fontSize: '45px' }}>No NFTs Found!</h2>
                )}

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
                    const division = nft.attributes.find(
                        (attr) => attr.trait_type === "division"
                    )?.value || null;
                    const level = nft.attributes.find((attr) => attr.trait_type === "level")?.value || '1';

                    const divisionClassName = `division-${division}`;

                    const rarityClass = `nft-box shadow-${rarity.toLowerCase()}`;
                    const bannerClass = `banner-standards banner-${rarity.toLowerCase()}`;
                    const nftBlockchain = nft.attributes.find(
                        (attr) => attr.trait_type === "blockchain"
                    )?.value || "solana";
                    const nftBlockchainClass = `blockchain-${nftBlockchain}`;

                    // Organize NFT Stat Attributes
                    const traitRows = getTraitRows(nft);

                    const isSelected = selectedIndex === index;
                    const purchased = isPurchased(nft); // Check if the NFT is owned

                    return (
                        <div key={index} style={{ display: 'inline-block' }}>
                            <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                                <div>Cost: {nft.storeInfo.price} USDC | ~{((nft.storeInfo.price * approxSolToUSD)).toFixed(4)} SOL</div>
                                {nft.storeInfo.available ? (<div>In-store✅</div>) : (<div>In-store❌</div>)}
                                {nft.storeInfo.metadataUri ? (<div>Metadata <FaLock /></div>) : (<div>Metadata <FaLockOpen /></div>)}
                            </div>
                            <button
                                className={`${rarityClass} ${isSelected ? "selected" : ""}`}
                                style={{
                                    marginBottom: "5px",
                                    opacity: purchased ? 0.6 : 1,  // 🔹 Gray effect for owned items
                                    filter: purchased ? "grayscale(50%)" : "none", // 🔹 Subtle desaturation effect
                                }}
                                onClick={() => { setEditData(nft), setSelectedIndex(index) }}
                                disabled={isBuyDisabled(nft)}
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
                                        <div className="nft-stats d-flex flex-column  align-items-center h-100 w-100 marykate">
                                            {/* PRINT NFT STAT ATTRIBUTES */}
                                            {traitRows.map((row, idx) => (
                                                <div className="d-flex w-100" key={idx}>
                                                    {row.map((trait, j) => (
                                                        <p
                                                            key={j}
                                                            style={{
                                                                flex: row.length === 1 ? 1 : j === 0 ? 0.45 : 0.55,
                                                                textAlign: 'left',
                                                            }}
                                                        >
                                                            <strong>{trait.label}:</strong> {trait.value}
                                                        </p>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid white', padding: '5px 0px' }}></div>
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex gap-3">
                                        <div className={nftBlockchainClass}>{nftBlockchain}</div>
                                        <div className={bannerClass}>{type}</div>
                                        <div className={bannerClass}>{subType}</div>
                                        <div className={bannerClass}>Lvl. {level}</div>
                                    </div>
                                    {(division === "crebel" || division === "elites") &&
                                        <div className={divisionClassName}>
                                            {division}
                                        </div>
                                    }
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
                                                    <button onClick={() => { openModal('SOL'); setPaymentTracker('SOL'); }} className='button-style-regular'>SOL</button>
                                                    <button disabled={true} onClick={() => { openModal('BABYBOOH'); setPaymentTracker('BABYBOOH'); }} className='button-style-regular-disabled'>BabyBooh</button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : null}
                            <div className='d-flex justify-content-between marykate' style={{ fontSize: '1.2rem' }}>
                                <div className='d-flex gap-2'>
                                    <p className='m-0'>Minted: {nft.purchases.totalCreates}</p>
                                    {wallet?.publicKey?.toString() === nft.storeInfo.creator &&
                                        <>
                                            <p className='m-0'>|</p>
                                            <p className='m-0'>Buys: {nft.purchases.totalBuys}</p>
                                        </>
                                    }
                                </div>
                                {location === 'creator-hub' && (
                                    <NftConceptVoting nft={nft} />
                                )}
                                {location === 'marketplace' &&
                                    (
                                        <div>
                                            {calculateRemainingMints(nft)}
                                        </div>
                                    )}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    )
}

export default PrintNfts;