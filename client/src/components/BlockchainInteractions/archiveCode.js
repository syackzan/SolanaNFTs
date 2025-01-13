/* START - WORKING FROM A STORED PRIVATE KEY */
// Usually Keypairs are saved as Uint8Array, so you  
// need to transform it into a usable keypair.  
// let keypair = umi.eddsa.createKeypairFromSecretKey(bs58.decode(import.meta.env.VITE_TEST_PRIVATE_KEY));

// Before Umi can use this Keypair you need to generate 
// a Signer type with it.  
// const signer = createSignerFromKeypair(umi, keypair);

// console.log(signer);

// umi.use(signerIdentity(signer));

/* END - WORKING FROM A STORED PRIVATE KEY */

// DESIGN FOR NFT

<div>
    <div className="d-flex justify-content-between" style={{ marginBottom: '5px' }}>
        <div>Price: ${nft.storeInfo.price}</div>
        {nft.storeInfo.metadataUri ? (<div><FaLock /></div>) : (<div><FaLockOpen /></div>)}
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