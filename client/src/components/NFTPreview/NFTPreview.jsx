import React from 'react';

import tempImage from '../../assets/itemBGs/tempImage.png';

import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";

const NFTPreview = ({
    info,
    attributes,
    storeInfo,
    image,
}) => {

    // Determine rarity and background shadow
    const rarity = attributes.find(attr => attr.trait_type === "rarity")?.value || "Epic";
    const subType = attributes.find(attr => attr.trait_type === "subType")?.value || "unknown";

    const rarityClass = `nft-box shadow-${rarity.toLowerCase()}`; // Convert rarity to lowercase for className
    const bannerClass = `banner-standards banner-${rarity.toLowerCase()}`
    const nftBlockchain = attributes.find(attr => attr.trait_type === "blockchain")?.value || "solana";
    const nftBlockchainClass = `blockchain-${nftBlockchain}`

    const damage = attributes.find(attr => attr.trait_type === "damage")?.value || 0;
    const defense = attributes.find(attr => attr.trait_type === "defense")?.value || 0;
    const dodge = attributes.find(attr => attr.trait_type === "dodge")?.value || 0;
    const coinMultiplier = attributes.find(attr => attr.trait_type === "coinMultiplier")?.value || 0;


    return (
        <div
            style={{
                width: '60vw',
                backgroundColor: '#1E1E1E',
                color: '#FFFFFF',
                padding: '20px',
                boxShadow: '2px 0 5px rgba(0, 0, 0, 0.5)',
            }}
        >
            <div style={{ display: 'inline-block' }}>
                <div className="d-flex justify-content-between" style={{ marginBottom: '5px' }}>
                    <div>Price: ${storeInfo.price}</div>
                    {storeInfo.metadataUri ? (<div><FaLock /></div>) : (<div><FaLockOpen /></div>)}
                </div>
                <button className={rarityClass} >
                    <div className='d-flex' style={{ marginBottom: '10px' }}>
                        <div className="d-flex justify-content-center align-items-center">
                            <img
                                src={image ? URL.createObjectURL(image) : tempImage}
                                alt={info.name}
                                style={{ width: "100px", height: "100px" }}
                            />
                        </div>
                        <div className="d-flex flex-column w-100">
                            <h3 className="nft-name lazy-dog">{info.name}</h3>
                            <div className="nft-stats d-flex flex-column justify-content-around align-items-center h-100 w-100 marykate">
                                <div
                                    className="d-flex w-100"
                                >
                                    <p
                                        style={{
                                            flex: 0.45,
                                            textAlign: 'left', // Optional for alignment
                                        }}
                                    >
                                        <strong>DAMAGE:</strong> {damage > 0 ? `+${damage}%` : "-"}
                                    </p>
                                    <p
                                        style={{
                                            flex: 0.55,
                                            textAlign: 'left', // Optional for alignment
                                        }}
                                    >
                                        <strong>DODGE:</strong> {dodge > 0 ? `+${dodge}%` : "-"}
                                    </p>
                                </div>
                                <div
                                    className="d-flex"
                                    style={{ width: '100%' }}
                                >
                                    <p
                                        style={{
                                            flex: 0.45,
                                            textAlign: 'left', // Optional for alignment
                                        }}
                                    >
                                        <strong>DEFENSE:</strong> {defense > 0 ? `+${defense}%` : "-"}
                                    </p>
                                    <p
                                        style={{
                                            flex: 0.55,
                                            textAlign: 'left', // Optional for alignment
                                        }}
                                    >
                                        <strong>COIN BOOST:</strong> {coinMultiplier > 0 ? `+${coinMultiplier}%` : "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid white', padding: '5px 0px' }}>

                    </div>
                    <div className="d-flex gap-3">
                        <div className={nftBlockchainClass}>{nftBlockchain}</div>
                        <div className={bannerClass}>{subType}</div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default NFTPreview;