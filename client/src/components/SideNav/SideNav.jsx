import React, { useState } from 'react';

const SideNav = ({
    info,
    attributes,
    storeInfo,
    handleInputChange,
    handleStoreChange,
    handleAttributeChange,
    handleImageChange,
    addOrUpdateToDB,
    page,
    createOffchainMetadata,
    deleteMetadata,
    isDisabled,
    setIsDisabled
}) => {


    const [isCreating, setIsCreating] = useState(false);
    const [isCreated, setIsCreated] = useState(false);

    const typeOptions = [
        'armor',
        'weapon',
        'skin',
        'accesories'
    ]

    const armorOptions = [
        'light',
        'medium',
        'heavy',
        'colossal'
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

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const title = page === 'create' ? 'Create Solana NFT Metadata' : 'Update Solana NFT Metadata';

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
                overflowX: 'hidden'
            }}
        >
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{title}</h2>
            <form onSubmit={async (e) => {
                e.preventDefault(); // Prevent default form submission
                const form = e.target;

                // Example validation for the select field
                if (!storeInfo.available || storeInfo.available === "") {
                    alert("Please answer the 'Available' question.");
                    return;
                }

                //Disables user from creating multiple new DB entries
                if (page === 'create') {
                    setIsDisabled(true);
                }

                setIsCreating(true);

                // Check if the form is valid
                if (form.checkValidity()) {

                    try {
                        setIsCreating(false);
                        setIsCreated(true);
                        addOrUpdateToDB(); // Call the addOrUpdateToDB function if the form is valid
                    } catch (e) {
                        alert('Failed creating NFT Data', e);
                        setIsDisabled(false);
                    }

                } else {
                    form.reportValidity(); // Show validation errors for required fields
                }
            }}
                style={{
                    display: 'flex', flexDirection: 'column', gap: '20px'
                }}>
                {/* Store Info */}
                <div>
                    <h4>Store Info</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {Object.entries(storeInfo)
                            .filter(([key]) => key !== 'metadataUri') // Filter out metadataUri
                            .map(([key, value], index) => (
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
                                            <option value=''>Select...</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    ) : key === 'creator' ? (
                                        <input
                                            type="text"
                                            value={value || ''}
                                            placeholder='Connect Wallet'
                                            required
                                            onChange={(e) => handleStoreChange(key, e.target.value)}
                                            disabled={true}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: '4px',
                                                border: '1px solid #555',
                                                backgroundColor: '#2E2E2E',
                                                color: '#FFF',
                                            }}
                                        />
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

                {/* NFT Name */}
                <div>
                    <h4>Metadata</h4>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>NFT Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={info.name}
                        onChange={(e) => handleInputChange(e)}
                        required
                        placeholder="EX: Axe"
                        disabled={!!storeInfo.metadataUri} //disabled
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
                        disabled={!!storeInfo.metadataUri} //disabled
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
                                    // disabled={!!storeInfo.metadataUri} //disabled
                                    disabled={true} //Always Solana for now
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
                                    disabled={!!storeInfo.metadataUri} //disabled
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
                                    <option value="weapon">Weapon</option>
                                    <option value="armor">Armor</option>
                                    <option value="skin">Skin</option>
                                    <option value="accessories">Accessory</option>
                                </select>
                            ) : attribute.trait_type === 'subType' ? (
                                <select
                                    value={attribute.value}
                                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                    disabled={!!storeInfo.metadataUri} //disabled
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
                                        } else if (type === 'weapon') {
                                            return weaponOptions.map((weapon, i) => (
                                                <option key={i} value={weapon}>
                                                    {weapon.charAt(0).toUpperCase() + weapon.slice(1)} {/* Capitalize the first letter */}
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
                                    disabled={!!storeInfo.metadataUri} //disabled
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
                                    disabled={!!storeInfo.metadataUri} //disabled
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
                    className='button-click'
                    style={{ marginTop: '0px' }}
                    disabled={isDisabled} // Add the disabled attribute
                >
                    {page === 'create' ? (
                        <>
                            {isCreating ? (
                                <div className="d-flex justify-content-center gap-3 align-items-center">
                                    <div>Creating...</div>
                                    <div class='loader'></div>
                                </div>
                            ) : isCreated ? (
                                <div>Metadata Created!</div>
                            ) : (
                                <div>Generate NFT Metadata</div>
                            )}
                        </>
                    ) : (
                        <div>Update NFT Metadata</div>
                    )}
                </button>
            </form>
            {page === "create" && isCreated && (
                <>
                    {storeInfo.metadataUri ? (
                        <>Locked</>
                    ) : (
                        <button
                            className="button-click metadata-button"
                            onClick={createOffchainMetadata}
                        >
                            Lock Metadata
                        </button>
                    )}
                    <button
                        className="button-click"
                        onClick={() => setIsCreated(false)}
                    >
                        Create New (Reset)
                    </button>
                </>
            )}
            {page === "update" && (
                <>
                    {storeInfo.metadataUri ? (
                        <div className="d-flex justify-content-center flex-column align-items-center" style={{ width: '100%', marginTop: '10px' }}>
                            <a href={storeInfo.metadataUri} target="_blank" rel="noopener noreferrer">
                                View Locked Data
                            </a>
                            <button
                                className="button-click metadata-button"
                                onClick={deleteMetadata}
                            >
                                Delete Metadata
                            </button>
                        </div>
                    ) : (
                        <button
                            className="button-click metadata-button"
                            onClick={createOffchainMetadata}
                        >
                            Lock Metadata
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default SideNav;
