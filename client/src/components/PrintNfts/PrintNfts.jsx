import React from 'react'

import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";

import { useMarketplace } from '../../context/MarketplaceProvider';

const PrintNfts = ({
    nfts,
    selectedIndex,
    setSelectedIndex,
    location,
    openModal,
    isAdmin = false,
    setEditData,
    setPaymentTracker,
    setIsLockModalOpen }) => {

    const isLocked = nfts[selectedIndex]?.storeInfo?.metadataUri ? true : false;

    const {
            setIsModalOpen,
            setModalType,
        } = useMarketplace();

    return (
        <>
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

                        return (
                            <div key={index} style={{ display: 'inline-block' }}>
                                <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '5px' }}>
                                    <div>Price: ${nft.storeInfo.price}</div>
                                    {nft.storeInfo.available ? (<div>in-store✅</div>) : (<div>in-store❌</div>)}
                                    {nft.storeInfo.metadataUri ? (<div>Data <FaLock /></div>) : (<div>Data <FaLockOpen /></div>)}
                                </div>
                                <button
                                    className={`${rarityClass} ${isSelected ? "selected" : ""}`}
                                    style={{ marginBottom: "5px" }}
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
                                            <button onClick={() => {setIsModalOpen(true); setModalType('delete')}} className='button-style-delete'>
                                                DELETE
                                            </button>
                                            {isLocked ?
                                                (
                                                    <button onClick={() => { openModal('SOL') }} className='button-style-regular'>
                                                        CREATE NFT
                                                    </button>
                                                ) : (
                                                    <button onClick={() => { setIsLockModalOpen(true) }} className='button-style-regular'>
                                                        LOCK DATA
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                ) : location === "marketplace" && isSelected ? (
                                    <>
                                        <div className="d-flex align-items-center justify-content-between p-2" style={{ backgroundColor: "#1e1e2f", borderRadius: "8px", color: "#ffffff" }}>
                                            <div style={{ fontSize: "1rem", fontWeight: "500" }}>BUY WITH:</div>
                                            <div className="d-flex gap-2">
                                                <button onClick={() => { openModal('CARD'), setPaymentTracker('CARD') }} className='button-style-regular'>Card</button>
                                                <button onClick={() => { openModal('BABYBOOH'), setPaymentTracker('BABYBOOH') }} className='button-style-regular'>BabyBooh</button>
                                                <button onClick={() => { openModal('SOL'), setPaymentTracker('SOL') }} className='button-style-regular'>SOL</button>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    )
}

const buttonStyle = {
    backgroundColor: "#3a3a4f",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.2s ease",
};

const buttonHoverStyle = {
    backgroundColor: "#57576c",
};

export default PrintNfts;