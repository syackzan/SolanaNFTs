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
                height: '100vh',
                overflowY: 'auto',
                boxShadow: '2px 0 5px rgba(0, 0, 0, 0.5)',
                marginTop: '60px',
                overflow: 'hidden'
            }}
        >
            <div style={{display: 'inline-block'}}>
                <div className="d-flex justify-content-between" style={{ marginBottom: '5px' }}>
                    <div>Price: ${storeInfo.price}</div>
                    {storeInfo.metadataUri ? (<div><FaLock /></div>) : (<div><FaLockOpen /></div>)}
                </div>
                <button className={rarityClass} >
                    <div className="d-flex justify-content-between" style={{ marginBottom: '10px' }}>
                        <div className={bannerClass}>{subType}</div>
                        <div className={nftBlockchainClass}>{nftBlockchain}</div>
                    </div>
                    <img
                        src={image ? URL.createObjectURL(image) : tempImage}
                        alt={info.name}
                        style={{ width: "150px", height: "150px" }}
                    />
                    <h3 className="nft-name">{info.name}</h3>
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

        </div>
    );
};

export default NFTPreview;