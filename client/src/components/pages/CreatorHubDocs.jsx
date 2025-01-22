import React from "react";
import '../../Docs.css'; // Add the CSS styles below to this file
import Navbar from "../Navbar/Navbar";

const CreatorHubDocs = () => {
    return (
        <div className='d-flex justify-content-center' style={{ backgroundColor: 'rgb(30, 30, 30)', width: '100vw'}}>
            <Navbar />
            <div className="docs-container" style={{ marginTop: '60px' }}>
                <div className="docs-header">
                    <h1 className="docs-title">Creator Hub Docs & Rules</h1>
                </div>

                <section className="docs-section">
                    <h2 className="docs-subtitle">Introduction</h2>
                    <p className="docs-text">
                        So, you're thinking about becoming a creator of Booh World! Do you fight for crypto and the planet
                        or do you wish to make as much money as you possibly can? Well, here at Booh Brawlers, you can do
                        just that. Excitingly, you can help the Booh Brawlers community by designing and creating your own
                        NFTs that may have a chance to be in-game. If they are in-game, that means they are in the store, and
                        anyone who mints from your NFT metadata earns you 10% of the rewards.
                    </p>
                </section>

                <section className="docs-section">
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
                </section>

                <section className="docs-section">
                    <h2 className="docs-subtitle">Creating NFTs</h2>
                    <p className="docs-text">
                        The first step is to connect a wallet when on the creator page. Store info is only changeable by
                        community admins whose identities have been verified. Pricing is automatically set when selecting
                        the rarity of the NFT.
                    </p>
                </section>

                <section className="docs-section">
                    <h3 className="docs-subsection-title">Rules for Creating NFTs</h3>
                    <ul className="docs-list">
                        <li className="docs-list-item">Name</li>
                        <li className="docs-list-item">Description</li>
                        <li className="docs-list-item">Image (must be 512x512)</li>
                        <li className="docs-list-item">#Attributes</li>
                        <li className="docs-list-item">Type</li>
                        <li className="docs-list-item">Subtype</li>
                        <li className="docs-list-item">Rarity</li>
                        <li className="docs-list-item">Affinity</li>
                    </ul>
                    <p className="docs-text">Talents:</p>
                    <ul className="docs-list">
                        <li className="docs-list-item">Damage</li>
                        <li className="docs-list-item">Defense</li>
                        <li className="docs-list-item">Dodge</li>
                        <li className="docs-list-item">CoinMultiplier</li>
                    </ul>
                    <p className="docs-text">
                        Rarity sets the price of the NFT along with allowable talent point distribution. Talent points are
                        calculated as whole percentage points as of now. To prevent creators from monopolizing and creating
                        only epic and legendary items, gateways have been put in place for these items.
                    </p>
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
