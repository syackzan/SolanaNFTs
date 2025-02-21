import React from "react";

// NFT Blueprint Fields
const blueprintFields = [
    { field: "Available", description: "Availabel in marketplace?", value: "No", mutable: false },
    { field: "Price", description: "Automatically set based on rarity.", value: "Set by rarity", mutable: false },
    { field: "Season", description: "Determines the season in which NFT blueprint was created.", value: "Current Season", mutable: false },
    { field: "Creator", description: "Creator is set by connected wallet.", mutable: false },
];

// General Information Data
const infoData = {
    name: { value: "Unique identifier", mutable: true },
    symbol: { value: "Preset Symbol on Nfts", mutable: false },
    description: { value: "Unique Description of item and purpose. Have fun!", mutable: true },
    image: { value: "Image upload", mutable: true },
};

// Talents List
const talents = [
    { trait: "damage", description: "Increases attack power", mutable: true },
    { trait: "defense", description: "Reduces incoming damage", mutable: true },
    { trait: "dodge", description: "Increases evasion rate", mutable: true },
    { trait: "coinMultiplier", description: "Boosts earned in-game currency", mutable: true },
];

// Base Attributes Data
const attributesData = [
    { trait_type: "blockchain", value: "solana", description: "Blockchain type (Solana by default)", mutable: false },
    { trait_type: "type", value: "", description: "Defines the NFT item type", mutable: true },
    { trait_type: "subType", value: "", description: "Specific sub-type within the item category", mutable: true },
    { trait_type: "rarity", value: "common", description: "Defines NFT rarity (affects pricing & talent points)", mutable: true },
    { trait_type: "affinity", value: "", description: "Determines affinity category for the NFT", mutable: true },
];

const NftBlueprintDetails = () => {
    return (
        <div className="docs-table-headers">
            <h2 style={{ marginBottom: "10px" }}>NFT Blueprint Details</h2>

            {/* NFT Blueprint Fields Table */}
            <h3>Store Fields</h3>
            <table className="docs-table">
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>Description</th>
                        <th>Mutable</th>
                        <th>Preset Value</th>
                    </tr>
                </thead>
                <tbody>
                    {blueprintFields.map((item, index) => (
                        <tr key={index}>
                            <td>{item.field}</td>
                            <td>{item.description}</td>
                            <td>{item.mutable ? "Yes" : "No"}</td>
                            <td>{item.mutable ? "N/A" : item.value || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* General Info Table */}
            <h3>General Information</h3>
            <table className="docs-table">
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>Description</th>
                        <th>Mutable</th>
                        <th>Preset Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(infoData).map(([key, data], index) => (
                        <tr key={index}>
                            <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                            <td>{data.value}</td>
                            <td>{data.mutable ? "Yes" : "No"}</td>
                            <td>{data.mutable ? "N/A" : data.value || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Attributes Table */}
            <h3>Attributes</h3>
            <table className="docs-table">
                <thead>
                    <tr>
                        <th>Trait Type</th>
                        <th>Description</th>
                        <th>Mutable</th>
                        <th>Preset Value</th>
                    </tr>
                </thead>
                <tbody>
                    {attributesData.map((attr, index) => (
                        <tr key={index}>
                            <td>{attr.trait_type}</td>
                            <td>{attr.description}</td>
                            <td>{attr.mutable ? "Yes" : "No"}</td>
                            <td>{attr.mutable ? "N/A" : attr.value || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Talents Table */}
            <h3>Talents</h3>
            <table className="docs-table">
                <thead>
                    <tr>
                        <th>Talent</th>
                        <th>Description</th>
                        <th>Mutable</th>
                    </tr>
                </thead>
                <tbody>
                    {talents.map((talent, index) => (
                        <tr key={index}>
                            <td>{talent.trait}</td>
                            <td>{talent.description}</td>
                            <td>{talent.mutable ? "Yes" : "No"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            
        </div>
    );
};

export default NftBlueprintDetails;
