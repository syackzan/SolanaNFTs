import React, { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { useGlobalVariables } from "../../providers/GlobalVariablesProvider";

const ImageCarousel = () => {

    const { nftConcepts } = useGlobalVariables();

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === nftConcepts.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000); // Slides every 3 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [nftConcepts.length]);

    return (
        <div className="carousel-wrapper">
            <AnimatePresence mode="wait">
                {nftConcepts.length > 0 && (
                    <motion.div
                        key={currentIndex} // Key ensures AnimatePresence recognizes slide changes
                        initial={{ x: 300, opacity: 0 }} // Start off-screen to the right
                        animate={{ x: 0, opacity: 1 }} // Slide in to the center
                        exit={{ x: -300, opacity: 0 }} // Slide out to the left
                        transition={{ duration: 0.5 }} // Smooth transition
                        className="carousel-slide"
                    >
                        {(() => {
                            const nft = nftConcepts[currentIndex];

                            if (!nft) {
                                return <div className="loader-advanced"></div>; // Show loading if NFT is undefined
                            }

                            const rarity =
                                nft.attributes.find((attr) => attr.trait_type === "rarity")?.value ||
                                "unknown";
                            const subType =
                                nft.attributes.find((attr) => attr.trait_type === "subType")?.value ||
                                "unknown";
                            const rarityClass = `nft-box shadow-${rarity.toLowerCase()}`;
                            const bannerClass = `banner-standards banner-${rarity.toLowerCase()}`;
                            const nftBlockchain =
                                nft.attributes.find(
                                    (attr) => attr.trait_type === "blockchain"
                                )?.value || "solana";
                            const nftBlockchainClass = `blockchain-${nftBlockchain}`;
                            const damage =
                                nft.attributes.find((attr) => attr.trait_type === "damage")
                                    ?.value || 0;
                            const defense =
                                nft.attributes.find((attr) => attr.trait_type === "defense")
                                    ?.value || 0;
                            const dodge =
                                nft.attributes.find((attr) => attr.trait_type === "dodge" || attr.trait_type === "evasion")
                                    ?.value || 0;
                            const coinMultiplier =
                                nft.attributes.find(
                                    (attr) => attr.trait_type === "coinMultiplier"
                                )?.value || 0;

                            return (
                                <div style={{ display: "inline-block", padding: "5px 0px" }}>
                                    <button key={currentIndex} className={rarityClass} disabled={true}>
                                        <div
                                            className="d-flex"
                                            style={{ marginBottom: "10px" }}
                                        >
                                            <div className="d-flex justify-content-center align-items-center">
                                                <img
                                                    src={nft.image}
                                                    alt={nft.name}
                                                    style={{ width: "100px", height: "100px" }}
                                                />
                                            </div>
                                            <div className="d-flex flex-column w-100">
                                                <h3 className="nft-name lazy-dog">{nft.name}</h3>
                                                <div className="nft-stats d-flex flex-column justify-content-around align-items-center h-100 w-100 marykate">
                                                    <div className="d-flex w-100">
                                                        <p style={{ flex: 0.45, textAlign: "left" }}>
                                                            <strong>DAMAGE:</strong>{" "}
                                                            {damage > 0 ? `+${damage}%` : "-"}
                                                        </p>
                                                        <p style={{ flex: 0.55, textAlign: "left" }}>
                                                            <strong>EVASION:</strong>{" "}
                                                            {dodge > 0 ? `+${dodge}%` : "-"}
                                                        </p>
                                                    </div>
                                                    <div
                                                        className="d-flex"
                                                        style={{ width: "100%" }}
                                                    >
                                                        <p style={{ flex: 0.45, textAlign: "left" }}>
                                                            <strong>DEFENSE:</strong>{" "}
                                                            {defense > 0 ? `+${defense}%` : "-"}
                                                        </p>
                                                        <p style={{ flex: 0.55, textAlign: "left" }}>
                                                            <strong>COIN BOOST:</strong>{" "}
                                                            {coinMultiplier > 0
                                                                ? `+${coinMultiplier}%`
                                                                : "-"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                borderTop: "1px solid white",
                                                padding: "5px 0px",
                                            }}
                                        ></div>
                                        <div className="d-flex gap-3">
                                            <div className={nftBlockchainClass}>
                                                {nftBlockchain}
                                            </div>
                                            <div className={bannerClass}>{subType}</div>
                                        </div>
                                    </button>
                                </div>
                            );
                        })()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageCarousel;