import React, { useState, useEffect } from 'react';

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
    setPage,
    createOffchainMetadata,
    deleteMetadata,
    isDisabled,
    setIsDisabled,
    userRole,
    walletAddress,
    resetMetadata,
    lockedStatus
}) => {


    const [isCreating, setIsCreating] = useState(false);
    const [isCreated, setIsCreated] = useState(false);

    const affinityOptions = [
        'fire',
        'ice',
        'water',
        'lightning',
        'earth',
        'wind',
        'light',
        'dark',
        'poison',
    ]

    const armorOptions = [
        'chest',
        'gloves',
        'leggings',
        'helm'
    ]

    const weaponOptions = [
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

    const title = page === 'create' ? 'Metadata Creator' : 'Metadata Editor';

    const isMetadataLocked = !!storeInfo.metadataUri; // Check if metadata is locked
    const isCreator = storeInfo.creator === walletAddress; // Check if the current user is the creator

    const isAdmin = userRole === "admin"

    // Determine if the user can edit fields
    const canEditFields = (isAdmin && !isMetadataLocked) || (userRole === 'member' && isCreator && !isMetadataLocked);

    // Determine if the user can edit storeInfo
    const canEditStoreInfo = isAdmin || (userRole === 'member' && page === 'create');

    return (
        <div
            className="sidenav"
            style={{
                width: '40vw',
                backgroundColor: '#1E1E1E',
                color: '#FFFFFF',
                padding: '10px 20px 20px 20px',
                height: 'calc(100vh - 60px)'
            }}
        >
            <div className="d-flex justify-content-end" style={{ marginBottom: '5px' }}>
                <div className="d-flex gap-3 p-2" style={{ backgroundColor: "#1e1e2f", borderRadius: "8px", color: "#ffffff" }}>
                    <button className="button-style-thin" onClick={() => { setPage('create'), resetMetadata(), setIsDisabled(false) }}>Create</button>
                    <button className="button-style-thin" onClick={() => { setPage('update'), resetMetadata(), setIsDisabled(false) }}>Edit</button>
                </div>
            </div>
            <h2 className="marykate" style={{ textAlign: 'center', marginBottom: '20px', fontSize: '3.5rem' }}>{title}</h2>
            <form onSubmit={async (e) => {
                e.preventDefault(); // Prevent default form submission
                const form = e.target;

                if (page === "update" && !info.name) {
                    alert('Select and item');
                    return;
                }

                // Example validation for the select field
                if (storeInfo.available === "") {
                    alert("Please answer the 'Available' question.");
                    return;
                }

                //Disables user from creating multiple new DB entries
                setIsDisabled(true);

                // Check if the form is valid
                if (form.checkValidity()) {

                    try {

                        await addOrUpdateToDB(); // Call the addOrUpdateToDB function if the form is valid

                        if(page === 'update'){
                            await delay(1000);
                            setIsDisabled(false);
                        }

                        if (page === 'create') {
                            setIsCreating(false);
                            setIsCreated(true);
                        }

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
                    <h4 className="marykate" style={{ fontSize: '2rem' }}>Store Info</h4>
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
                                            disabled={!canEditStoreInfo}
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
                                            placeholder='Connect Wallet / Login'
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
                                            type="text" // Use "text" to handle input flexibility and control formatting
                                            value={value || ''}
                                            placeholder={key === 'price' ? '$' : 'ex. 1'}
                                            required
                                            onChange={(e) => {
                                                const input = e.target.value;

                                                // Allow only valid USD format: digits, optional decimal point, and up to two decimals
                                                if (/^\$?\d*\.?\d{0,2}$/.test(input)) {
                                                    handleStoreChange(key, input);
                                                }
                                            }}
                                            disabled={!canEditStoreInfo}
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
                    <h4 className="marykate" style={{ fontSize: '2rem' }}>Metadata</h4>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>NFT Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={info.name}
                        onChange={(e) => handleInputChange(e)}
                        required
                        placeholder="EX: Axe"
                        disabled={!canEditFields} //disabled
                        maxLength={15}
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
                        disabled={!canEditFields}
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
                    <h4 className="marykate" style={{ fontSize: '2rem' }}>Attributes</h4>
                    {attributes.map((attribute, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>
                                {attribute.trait_type}
                            </label>
                            {attribute.trait_type === 'blockchain' ? (
                                <select
                                    value={attribute.value}
                                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                    disabled={!canEditFields}
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
                                    disabled={!canEditFields}
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
                                    disabled={!canEditFields}
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
                                        const type = attributes.find((attr) => attr.trait_type === 'type')?.value;
                                        if (type === 'skin') {
                                            return skinOptions.map((skin, i) => (
                                                <option key={i} value={skin}>
                                                    {skin.charAt(0).toUpperCase() + skin.slice(1)}
                                                </option>
                                            ));
                                        } else if (type === 'weapon') {
                                            return weaponOptions.map((weapon, i) => (
                                                <option key={i} value={weapon}>
                                                    {weapon.charAt(0).toUpperCase() + weapon.slice(1)}
                                                </option>
                                            ));
                                        } else if (type === 'armor') {
                                            return armorOptions.map((armor, i) => (
                                                <option key={i} value={armor}>
                                                    {armor.charAt(0).toUpperCase() + armor.slice(1)}
                                                </option>
                                            ));
                                        } else if (type === 'accessories') {
                                            return accessoriesOptions.map((accessory, i) => (
                                                <option key={i} value={accessory}>
                                                    {accessory.charAt(0).toUpperCase() + accessory.slice(1)}
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
                                    disabled={!canEditFields}
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
                                            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            ) : attribute.trait_type === 'affinity' ? (
                                <select
                                    value={attribute.value}
                                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                    disabled={!canEditFields}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #555',
                                        backgroundColor: '#2E2E2E',
                                        color: '#FFF',
                                    }}
                                >
                                    {/* Placeholder option */}
                                    <option value='' disabled>
                                        Select...
                                    </option>

                                    {/* Map through the affinity options */}
                                    {affinityOptions.map((affinity, i) => (
                                        <option key={i} value={affinity}>
                                            {affinity.charAt(0).toUpperCase() + affinity.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={attribute.value}
                                    placeholder="0"
                                    onChange={(e) => {
                                        const inputValue = e.target.value;

                                        // Ensure input is a valid positive number or 0
                                        if (/^\d*$/.test(inputValue)) { // Only allow digits
                                            if (userRole !== "admin" && inputValue !== "" && parseInt(inputValue, 10) > 20) {
                                                // If not admin and input exceeds 20%, prevent it
                                                alert("Non-admin users cannot exceed 20%");
                                                return;
                                            }

                                            if (inputValue === "" || inputValue === "0") {
                                                // Allow empty string (placeholder) or 0 as valid inputs
                                                handleAttributeChange(index, 'value', inputValue);
                                            } else if (!/^0/.test(inputValue)) {
                                                // Prevent numbers starting with 0 (e.g., 0123)
                                                handleAttributeChange(index, 'value', inputValue);
                                            }
                                        }
                                    }}
                                    onBlur={(e) => {
                                        // Ensure default value is 0 if input is left empty
                                        if (e.target.value === "") {
                                            handleAttributeChange(index, 'value', "0");
                                        }
                                    }}
                                    disabled={!canEditFields}
                                    maxLength={2} // Restrict to 10 characters
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
                    <button
                        className="button-click"
                        onClick={() => {setIsCreated(false), setIsDisabled(false)}}
                    >
                        Create New (Reset)
                    </button>
                    {isAdmin && (<>
                        {lockedStatus ? (
                            <div className="button-container">
                                <div style={{ fontSize: "1rem", fontWeight: "500" }}>[ADMIN ONLY]:</div>
                                <div className="d-flex gap-2">
                                    <strong>LOCKING...</strong>
                                    <div class='loader'></div>
                                </div>
                            </div>
                        ) : (
                            <div className="button-container">
                                <div style={{ fontSize: "1rem", fontWeight: "500" }}>[ADMIN ONLY]:</div>
                                <div className="d-flex gap-2">
                                    <button onClick={() => { createOffchainMetadata() }} style={{ width: '150px' }} className='button-style-regular'>Lock off chain data</button>
                                </div>
                            </div>
                        )}
                    </>)}
                </>
            )}
            {page === "update" && info.name && (
                <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap" style={{ width: '100%', marginTop: '10px' }}>
                    {storeInfo.metadataUri ? (
                        <>
                            <a className="button-style-regular" href={storeInfo.metadataUri} target="_blank" rel="noopener noreferrer">
                                View Off-Chain Data
                            </a>
                            {isAdmin && (
                                <div className="d-flex align-items-center justify-content-between p-2 gap-5" style={{ backgroundColor: "#1e1e2f", borderRadius: "8px", color: "#ffffff" }}>
                                    <div style={{ fontSize: "1rem", fontWeight: "500" }}>[ADMIN ONLY]:</div>
                                    <div className="d-flex gap-2">
                                        <button onClick={() => { deleteMetadata() }} className='button-style-regular'>Delete NFT</button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="d-flex flex-column w-100 gap-2">
                            {isAdmin && (<>
                                {lockedStatus ? (
                                    <div className="button-container">
                                        <div style={{ fontSize: "1rem", fontWeight: "500" }}>[ADMIN ONLY]:</div>
                                        <div className="d-flex gap-2">
                                            <strong>LOCKING...</strong>
                                            <div class='loader'></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="button-container">
                                        <div style={{ fontSize: "1rem", fontWeight: "500" }}>[ADMIN ONLY]:</div>
                                        <div className="d-flex gap-2">
                                            <button onClick={() => { createOffchainMetadata() }} style={{ width: '150px' }} className='button-style-regular'>Lock off chain data</button>
                                        </div>
                                    </div>
                                )}
                            </>)}
                            {isAdmin && (
                                <div className="d-flex align-items-center justify-content-between p-2 gap-5" style={{ backgroundColor: "#1e1e2f", borderRadius: "8px", color: "#ffffff" }}>
                                    <div style={{ fontSize: "1rem", fontWeight: "500" }}>[ADMIN ONLY]:</div>
                                    <div className="d-flex gap-2">
                                        <button onClick={() => { deleteMetadata() }} className='button-style-regular'>Delete NFT</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SideNav;
