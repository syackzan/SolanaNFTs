import React, { useState } from 'react';

const SideNav = ({
    info,
    attributes,
    storeInfo,
    handleInputChange,
    handleStoreChange,
    handleAttributeChange,
    handleImageChange,
    addToDB,
    page,
}) => {

    const typeOptions = [
        'equipment',
        'skin',
        'accesories'
    ]

    const armorOptions = [
        'chest'
    ]

    const weaponOptions = [
        'sword',
        'axe',
        'dagger',
        'staff',
        'bow'
    ]

    const equipmentOptions = [
        'chest',
        'sword',
        'axe',
        'dagger',
        'staff',
        'bow'
    ]

    const skinOptions = [
        'body'
    ]

    const accessoriesOptions = [
        'pendant'
    ]

    const rarityOptions = [
        'common',
        'uncommon',
        'rare',
        'epic',
        'legendary'
    ]

    return (
        <div
            className="sidenav"
            style={{
                width: '40vw',
                backgroundColor: '#1E1E1E',
                color: '#FFFFFF',
                padding: '20px',
                height: '100vh',
                overflowY: 'auto',
                boxShadow: '2px 0 5px rgba(0, 0, 0, 0.5)',
                marginTop: '60px',
                overflowX: 'hidden'
            }}
        >
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create a Solana NFT Metadata</h2>
            <form onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                const form = e.target;

                // Example validation for the select field
                if (!storeInfo.available || storeInfo.available === "") {
                    alert("Please answer the 'Available' question.");
                    return;
                }

                // Check if the form is valid
                if (form.checkValidity()) {
                    addToDB(); // Call the addToDB function if the form is valid
                } else {
                    form.reportValidity(); // Show validation errors for required fields
                }
            }}
                style={{
                    display: 'flex', flexDirection: 'column', gap: '20px'

                }}>
                {/* NFT Name */}
                <div>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>NFT Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={info.name}
                        onChange={(e) => handleInputChange(e)}
                        required
                        placeholder="EX: Axe"
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #555',
                            backgroundColor: '#2E2E2E',
                            color: '#FFF',
                        }}
                    />
                </div>

                {/* Store Info */}
                <div>
                    <h4>Store Info</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {Object.entries(storeInfo).map(([key, value], index) => (
                            <div key={index} style={{ flex: '1 1 48%' }}>
                                <label className="form-label" style={{ display: 'block', marginBottom: '5px' }}>{key}</label>
                                {key === 'available' ? (
                                    <select
                                        value={value === true ? "yes" : value === false ? "no" : ""}
                                        onChange={(e) => handleStoreChange(key, e.target.value === "yes")}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            border: '1px solid #555',
                                            backgroundColor: '#2E2E2E',
                                            color: '#FFF',
                                        }}
                                        placeholder='Select...'
                                    >
                                        {/* <option value="">Select...</option> */}
                                        <option value=''>Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                ) : (
                                    <input
                                        type="number"
                                        value={value || ''}
                                        placeholder={key === 'price' ? '$' : 'ex. 1'}
                                        required
                                        onChange={(e) => handleStoreChange(key, e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            border: '1px solid #555',
                                            backgroundColor: '#2E2E2E',
                                            color: '#FFF',
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={info.description}
                        onChange={(e) => handleInputChange(e)}
                        required
                        placeholder="Describe your NFT"
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #555',
                            backgroundColor: '#2E2E2E',
                            color: '#FFF',
                            minHeight: '80px',
                        }}
                    />
                </div>

                {/* Image Upload */}
                {page === 'create' && <div>
                    <label htmlFor="image" style={{ display: 'block', marginBottom: '5px' }}>Upload Image:</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #555',
                            backgroundColor: '#2E2E2E',
                            color: '#FFF',
                        }}
                    />
                </div>}

                {/* Attributes */}
                <div>
                    <h4>Attributes</h4>
                    {attributes.map((attribute, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>
                                {attribute.trait_type}
                            </label>
                            {attribute.trait_type === 'blockchain' ? (
                                <select
                                    value={attribute.value}
                                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #555',
                                        backgroundColor: '#2E2E2E',
                                        color: '#FFF',
                                    }}
                                >
                                    <option value="">Select...</option>
                                    <option value="solana">Solana</option>
                                    <option value="ethereum">Ethereum</option>
                                </select>
                            ) : attribute.trait_type === 'type' ? (
                                <select
                                    value={attribute.value}
                                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #555',
                                        backgroundColor: '#2E2E2E',
                                        color: '#FFF',
                                    }}
                                >
                                    <option value="">Select...</option>
                                    <option value="equipment">Equipment</option>
                                    <option value="skin">Skin</option>
                                    <option value="accessories">Accessory</option>
                                </select>
                            ) : attribute.trait_type === 'subType' ? (
                                <select
                                    value={attribute.value}
                                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #555',
                                        backgroundColor: '#2E2E2E',
                                        color: '#FFF',
                                    }}
                                >
                                    <option value="">Select...</option>
                                    {(() => {
                                        // Determine options based on the selected 'type'
                                        const type = attributes.find((attr) => attr.trait_type === 'type')?.value;
                                        if (type === 'skin') {
                                            return skinOptions.map((skin, i) => (
                                                <option key={i} value={skin}>
                                                    {skin.charAt(0).toUpperCase() + skin.slice(1)} {/* Capitalize the first letter */}
                                                </option>
                                            ));
                                        } else if (type === 'equipment') {
                                            return equipmentOptions.map((equipment, i) => (
                                                <option key={i} value={equipment}>
                                                    {equipment.charAt(0).toUpperCase() + equipment.slice(1)} {/* Capitalize the first letter */}
                                                </option>
                                            ));
                                        } else if (type === 'armor') {
                                            return armorOptions.map((armor, i) => (
                                                <option key={i} value={armor}>
                                                    {armor.charAt(0).toUpperCase() + armor.slice(1)} {/* Capitalize the first letter */}
                                                </option>
                                            ));
                                        } else if (type === 'accessories') {
                                            return accessoriesOptions.map((accessories, i) => (
                                                <option key={i} value={accessories}>
                                                    {accessories.charAt(0).toUpperCase() + accessories.slice(1)} {/* Capitalize the first letter */}
                                                </option>
                                            ));
                                        } else {
                                            return <option value="">Select a Type First</option>;
                                        }
                                    })()}
                                </select>
                            ) : attribute.trait_type === 'rarity' ? (
                                <select
                                    value={attribute.value}
                                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #555',
                                        backgroundColor: '#2E2E2E',
                                        color: '#FFF',
                                    }}
                                >
                                    {rarityOptions.map((rarity, i) => (
                                        <option key={i} value={rarity}>
                                            {rarity.charAt(0).toUpperCase() + rarity.slice(1)} {/* Capitalize the first letter */}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={attribute.value}
                                    placeholder="Value"
                                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #555',
                                        backgroundColor: '#2E2E2E',
                                        color: '#FFF',
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '4px',
                        backgroundColor: '#3A3A3A',
                        color: '#FFF',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#505050')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#3A3A3A')}
                >
                    Generate NFT Metadata
                </button>
            </form>
        </div>
    );
};

export default SideNav;
