import { 
    infoData, 
    attributesData, 
    talents, 
    rarityOptions, 
    talenPointSpread, 
    pricingValues, 
    creatorCosts,
    sellingThreshold } from "../../config/gameConfig";

const NftCostTable = () => {
    return (
        <section className="docs-section d-flex flex-wrap justify-content-between">
            <div>
                <h3 className="docs-subsection-title">NFT Costs & Creator Earnings</h3>
                <p>NFT pricing is influenced by **rarity, talents, and game balance factors**.</p>

                <table className="docs-table">
                    <thead>
                        <tr>
                            <th>Rarity</th>
                            <th>Store Price</th>
                            <th>Creator Cost</th>
                            <th>Talent Points</th>
                            <th>Threshold</th>
                            <th>Royalties</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rarityOptions.map((rarity) => (
                            <tr key={rarity}>
                                <td>{rarity.charAt(0).toUpperCase() + rarity.slice(1)}</td>
                                <td>${pricingValues[rarity].toFixed(2)}</td>
                                <td>${creatorCosts[rarity].toFixed(2)}</td>
                                <td>{talenPointSpread[rarity]}</td>
                                <td>{sellingThreshold[rarity]}</td>
                                <td>10%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default NftCostTable;