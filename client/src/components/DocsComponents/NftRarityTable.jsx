const NftRarityTable = () => {
    const rarities = [
        { name: "Common", features: "+3", availability: "Most accessible", color: "rgba(240, 240, 240, 0.4)", textColor: "#000000" },
        { name: "Uncommon", features: "+5", availability: "Fairly common", color: "rgba(47, 111, 47, 0.8)", textColor: "#000000" },
        { name: "Rare", features: "+10", availability: "Less common", color: "rgba(34, 35, 115, 0.8)", textColor: "#000000" },
        { name: "Epic", features: "+15", availability: "Limited", color: "rgba(105, 37, 105, 0.8)", textColor: "#000000" },
        { name: "Legendary", features: "+25", availability: "Extremely rare", color: "rgba(255, 41, 41, 0.78)", textColor: "#000000" }
    ];

    return (
        <table className="docs-table">
            <thead>
                <tr>
                    <th>Rarity</th>
                    <th>Talent Points</th>
                    <th>Availability</th>
                </tr>
            </thead>
            <tbody>
                {rarities.map((rarity) => (
                    <tr key={rarity.name} style={{ backgroundColor: rarity.color, color: rarity.textColor }}>
                        <td>{rarity.name}</td>
                        <td>{rarity.features}</td>
                        <td>{rarity.availability}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default NftRarityTable;
