import React from "react";
import '../../Docs.css'; // Add the CSS styles below to this file
import Navbar from "../Navbar/Navbar";

import { infoData, attributesData, talents, rarityOptions, talenPointSpread, pricingValues, creatorCosts } from "../../config/gameConfig";

import boohLogo from '../../assets/BoohLogo.svg'
import metadataClipx from '../../assets/metadataClipx.png'

const CreatorHubDocs = () => {

    // Utility function to capitalize the first letter of a string
    const capitalizeFirstLetter = (string) => {
        if (!string) return ""; // Handle empty or undefined strings
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className='d-flex justify-content-center' style={{ backgroundColor: 'rgb(30, 30, 30)', width: '100vw' }}>
            <Navbar />
            <div className="docs-container" style={{ marginTop: '60px' }}>
                <div className="docs-header">
                    <h1 className="docs-title">Creator Hub Docs & Rules</h1>
                </div>

                <section className="docs-section">
                    <h2 className="docs-subtitle">Introduction</h2>
                    <p className="docs-text">
                        Are you ready to become a creator in <strong>Booh World</strong>?
                        Will you fight for crypto and the planet, or follow the path of an elite banker chasing profits?
                        Here at <strong>Booh Brawlers</strong>, the choice is yours.
                        <br /><br />
                        By designing and creating your own <strong>NFTs</strong>, you have the exciting opportunity to contribute to the
                        Booh Brawlers community. Your NFTs may even be featured in-game! If they make it to the store,
                        you'll earn <strong>10% kick-back of sales</strong> whenever someone mints from your NFT metadata [excluding Baby Booh mints].
                    </p>
                </section>

                {/* <section className="docs-section">
                    <h2 className="docs-subtitle">Storyline</h2>
                    <p className="docs-text">
                        Greed and corruption have destroyed planet Earth. The old world is dead. The elites poisoned our
                        minds and bodies, stole our future, and left us shackled in chains of despair.
                    </p>
                    <p className="docs-text">
                        But hope is not lost. From the ashes of their destruction, a ghostly spirit has awakened, BOOH. BOOH
                        is rising, and it’s not just a coin. It's a call to arms. A symbol of resistance. A revolution. He
                        has revived and summoned his crypto allies, uniting the Rebels to build a new world order.
                    </p>
                    <p className="docs-text">
                        In the underworld, the economy is clean, decentralized, and free from corruption. The Booh World
                        Order is all about skill, courage, and justice, and power is earned, not given.
                    </p>
                    <p className="docs-text">
                        But... The elites have found out about the underworld, and they’re coming to try and take back power.
                        Banks, crooked politicians, and big corps are trying to infiltrate the underworld with their greedy
                        fingers. The elites are trying to buy our freedom and manipulate our economy, threatening to destroy
                        our community. It's time for the final battle – and you must choose a side. Rebel or Elite? Decide
                        your destiny in Booh Brawlers.
                    </p>
                </section> */}

                <section className="docs-section">
                    <h2 className="docs-subtitle">Creating NFTs</h2>
                    <p className="docs-text">
                        The first step is to connect a Solana-based crypto wallet on the creator page. Wallet providers like
                        <strong> Phantom</strong> and <strong>Solflare</strong> work seamlessly with the Creation Hub.
                        <br /><br />
                        When creating a new dataset for NFT creation, it's important to focus on four major sections:
                        <strong> Store Info</strong>, <strong>Basic Info</strong>, <strong>Attributes</strong>, and <strong>Talents</strong>.
                        <br /><br />
                        These categories form the foundation of your NFT and will provide crucial data to support players in
                        <strong>Booh Brawlers</strong>. While some data fields can be freely edited, others will be preset to ensure consistency.
                    </p>

                </section>

                <section className="docs-section d-flex flex-wrap justify-content-between">
                    <div>
                        <h3 className="docs-subsection-title">Editable Data</h3>
                        <h4 className="docs-text">Base Info:</h4>
                        <ul className='docs-list'>
                            {Object.entries(infoData).map(([key, value]) => (
                                <li key={key} className="docs-list-item">
                                    {capitalizeFirstLetter(key)}
                                </li>
                            ))}
                        </ul>
                        <h4 className="docs-text">Base Attributes:</h4>
                        <ul className='docs-list'>
                            {attributesData.map((attribute) => {
                                return (
                                    <li className='docs-list-item'>{capitalizeFirstLetter(attribute.trait_type)}</li>
                                )
                            })}
                        </ul>
                        <h4 className="docs-text">Talents:</h4>
                        <ul className="docs-list">
                            {talents.map((talent) => {
                                return (
                                    <li className='docs-list-item'>{capitalizeFirstLetter(talent)}</li>
                                )
                            })}
                        </ul>

                    </div>
                    <div className="d-flex align-items-center" style={{ paddingRight: '50px' }}>
                        <img src={metadataClipx} style={{ width: 'auto', height: '500px', borderRadius: '5px' }} />
                    </div>
                </section>

                <section className="docs-section">
                    <h2 className="docs-subtitle">Image Requirements</h2>
                    <p className="docs-text">
                        Best fits for an NFT are 256px by 256px! jpg, png, and svg's are acceptable.
                    </p>
                </section>

                <section className="docs-section">
                    <h2 className="docs-subtitle">Rarity-Price-Talents</h2>
                    <p className="docs-text">
                        <strong>Rarity</strong> determines the price of the NFT and defines the allowable talent point distribution.
                        Talent points are calculated as whole percentages, and depending on an item's rarity, players are limited
                        in how they can allocate these points.
                        <br /><br />
                        To prevent creators from monopolizing and producing only epic and legendary items,
                        gateways have been implemented for these rarer items.
                        <br /><br />
                        Refer to the grid below for a detailed breakdown.
                    </p>

                    <table className="docs-table">
                        <thead>
                            <tr>
                                <th>Rarity</th>
                                <th>Talent Spread</th>
                                <th>Store Price</th>
                                <th>Creator Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rarityOptions.map((rarity) => (
                                <tr key={rarity}>
                                    <td>{rarity.charAt(0).toUpperCase() + rarity.slice(1)}</td>
                                    <td>{talenPointSpread[rarity]}</td>
                                    <td>${pricingValues[rarity].toFixed(2)}</td>
                                    <td>${creatorCosts[rarity].toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="docs-section">
                    <h2 className="docs-subtitle">Earnings and Payouts</h2>
                    <p className="docs-text">
                        Any NFT that is created by you and featured in the store will be tracked via purchases (outside of
                        Baby Booh). As the creator of the NFT, you will receive 10% of these funds at the end of the month,
                        sent directly to your wallet. Note: Payments will only be sent to the creator's wallet to prevent
                        scamming.
                    </p>
                </section>

                <section className="docs-section">
                    <h2 className="docs-subtitle">Updating NFTs</h2>
                    <p className="docs-text">
                        As long as an NFT's metadata has not been locked and sealed to an off-chain URI, you can update the
                        same fields you had access to in the creator's form, except the image.
                    </p>
                    <p className="docs-text">
                        If your NFT is selected to be in the store, a community admin will lock your metadata by creating
                        off-chain data and switching it to be available in-store. At this point, you will no longer be able
                        to update any data, but you have a chance at real value if people purchase it from the NFT store.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default CreatorHubDocs;
