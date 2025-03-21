import React, { useState, useEffect } from 'react';
import { IoIosInfinite } from "react-icons/io";

import {
    generalTypes,
    affinityOptions,
    armorOptions,
    weaponOptions,
    skinOptions,
    accessoriesOptions,
    rarityOptions,
    pricingValues,
    talenPointSpread,
    talents,
    divisionOptions
} from '../../config/gameConfig';

import { useScreen } from "../../providers/ScreenProvider";

import { RxDoubleArrowRight } from "react-icons/rx";

import { creatorCosts } from '../../config/gameConfig';

import { useTransactionsController } from '../../providers/TransactionsProvider';

import { useWallet } from '@solana/wallet-adapter-react';
import SolConnection from '../Connection/SolConnection';

import { convertUsdToSol } from '../../Utils/pricingModifiers';

import { delay, capitalizeFirstLetter } from '../../Utils/generalUtils';

const SideNav = ({
    info,
    attributes,
    storeInfo,
    setStoreInfo,
    handleInfoChange,
    handleStoreChange,
    handleAttributeChange,
    page,
    setPage,
    isDisabled,
    setIsDisabled,
    userRole,
    walletAddress,
    resetNftConceptForm,
    lockedStatus,
    createLockStatus,
    setCreateLockStatus,
    handleUpdateNftConcept,
    isNameTaken,
    resetDivisionOnTypeChange
}) => {

    const {
        setIsModalOpen,
        setModalType,
        imageName,
        loadTxModal
    } = useTransactionsController()

    const wallet = useWallet();

    const { windowWidth, isSideNavOpen, toggleSideNav } = useScreen();

    const IS_MOBILE_SIDENAV_OPEN = windowWidth <= 650 && isSideNavOpen;
    const MOBILE_SIDENAV_STYLING = IS_MOBILE_SIDENAV_OPEN ? 'nft-styling-mobile-enable' : 'nft-styling-mobile-disable';

    // State variables
    const [maxTalentPoints, setMaxTalentPoints] = useState(0); // Maximum talent points based on rarity
    const [isCreating, setIsCreating] = useState(false); // Indicates if a creation process is ongoing
    const [isCreated, setIsCreated] = useState(false); // Indicates if the metadata has been successfully created

    // Function to update pricing in the storeInfo state
    const updatePricing = (value) => {
        setStoreInfo((prev) => ({
            ...prev,
            price: value,
        }));
    };

    // Extract the current rarity value from attributes
    const rarity = attributes.find((attr) => attr.trait_type === "rarity")?.value;

    // useEffect to update pricing and max talent points when rarity changes
    useEffect(() => {
        if (rarity && pricingValues[rarity]) {
            updatePricing(pricingValues[rarity]); // Update pricing based on rarity
        }

        if (rarity && talenPointSpread[rarity]) {
            setMaxTalentPoints(talenPointSpread[rarity]); // Set max talent points based on rarity
        }
    }, [rarity]); // Trigger this effect whenever rarity changes

    // Determine the page title dynamically
    const title = page === 'create' ? 'Concept Creator' : 'Concept Editor';

    // Check if the metadata is locked
    const isMetadataLocked = !!storeInfo.metadataUri;

    // Check if the current user is the creator
    const isCreator = storeInfo.creator === walletAddress;

    // Check if the user has admin privileges
    const isAdmin = userRole === "admin";

    // Determine if the user can edit fields
    const canEditFields =
        (isAdmin && !isMetadataLocked) ||
        (userRole === 'member' && isCreator && !isMetadataLocked);

    // List of attributes to track for talents
    const attributesToTrack = talents;

    // Calculate remaining points for talent allocation
    const remainingPoints = maxTalentPoints - attributes
        .filter((attr) => attributesToTrack.includes(attr.trait_type))
        .reduce((sum, attr) => sum + parseInt(attr.value || "0", 10), 0);

    // Handle input changes for attributes
    const handleAttributeInputChange = (index, traitType, inputValue) => {
        if (attributesToTrack.includes(traitType)) {
            // Enforce rules for point allocation
            if (!/^\d*$/.test(inputValue)) {
                return; // Reject invalid input (non-numeric)
            }

            const newValue = parseInt(inputValue || "0", 10);
            const currentAttributeValue = parseInt(attributes[index].value || "0", 10);

            // Calculate new total points after input
            const newTotal = maxTalentPoints - remainingPoints + newValue - currentAttributeValue;

            if (newTotal > maxTalentPoints && userRole !== "admin") {
                alert(`You can only allocate up to ${maxTalentPoints} points in total.`);
                return;
            }
        }

        // Update the attribute value
        handleAttributeChange(index, "value", inputValue);
    };

    // Reset all state and metadata
    const resetEverything = () => {
        resetNftConceptForm();
        setIsDisabled(false);
        setCreateLockStatus(false);
        setIsCreated(false);
    };

    return (
        <div className={`sidenav-styling sidenav-scrollbar ${MOBILE_SIDENAV_STYLING}`}>
            <div className={`d-flex ${IS_MOBILE_SIDENAV_OPEN ? "justify-content-between" : "justify-content-end"}`} style={{ marginBottom: '5px' }}>
                <div className="d-flex gap-3 p-2" style={{ backgroundColor: "#1e1e2f", borderRadius: "8px", color: "#ffffff" }}>
                    <button
                        className={`button-style-thin ${page === 'create' ? 'selected' : ''}`}
                        onClick={() => { resetEverything(); setPage('create'); }}
                    >
                        Create
                    </button>

                    <button
                        className={`button-style-thin ${page === 'update' ? 'selected' : ''}`}
                        onClick={() => { resetEverything(); setPage('update'); }}
                    >
                        Edit
                    </button>

                </div>
                {IS_MOBILE_SIDENAV_OPEN && <button className={`button-style-sidenav-close ${MOBILE_SIDENAV_STYLING}`} onClick={toggleSideNav}>preview<RxDoubleArrowRight /></button>}
            </div>
            <h2 className="sidenav-title marykate m-0" >{title}</h2>
            {(page === 'update' && !info.name) && <h5 className='text-center marykate' style={{ fontSize: '1.25rem' }}>[select an item to update]</h5>}
            {page === 'create' && <h5 className='text-center marykate' style={{ fontSize: '1.25rem' }}>[Connect Wallet - Fill out form below]</h5>}
            <form onSubmit={async (e) => {
                e.preventDefault(); // Prevent default form submission
                const form = e.target;

                if (page === 'create') {

                    if (isNameTaken) {
                        alert('Name taken. Please select a new name');
                        throw new error('Name is already taken');
                    }

                    const creatorPayment = isAdmin
                        ? 0
                        : await convertUsdToSol(creatorCosts[attributes.find(attr => attr.trait_type === "rarity")?.value]);

                    loadTxModal('create', info.name, creatorPayment, 'SOL', true);
                }

                if (page === 'update') {

                    if (!info.name) {
                        alert('Select and item');
                    }

                    handleUpdateNftConcept();
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
                                    <label className="form-label" style={{ display: 'block', marginBottom: '5px' }}>
                                        {capitalizeFirstLetter(key)}
                                        {key === "price" && <> [set by rarity]</>}
                                    </label>
                                    {key === 'available' ? (
                                        <select
                                            value={value === true ? "yes" : value === false ? "no" : ""}
                                            onChange={(e) => handleStoreChange(key, e.target.value === "yes")}
                                            required
                                            disabled={!isAdmin}
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
                                    ) : key === 'mintLimit' ? (
                                        <select
                                            value={value}
                                            onChange={(e) => handleStoreChange(key, Number(e.target.value))} // Convert to number
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: '4px',
                                                border: '1px solid #555',
                                                backgroundColor: '#2E2E2E',
                                                color: '#FFF',
                                            }}
                                            disabled={!isAdmin}
                                        >
                                            <option value="-1">∞ (Unlimited)</option>
                                            <option value="1">1</option>
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                            <option value="500">500</option>
                                            <option value="1000">1000</option>
                                        </select>
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
                        onChange={(e) => handleInfoChange(e)}
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
                    {/* Display Name Availability Message */}
                    {(page === 'create' && info.name) && (
                        <p className={`name-status ${isNameTaken ? "taken" : "available"}`}>
                            {isNameTaken ? "❌ Name already taken!" : "✅ Name is available!"}
                        </p>
                    )}
                </div>
                {/* Description */}
                <div>
                    <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={info.description}
                        onChange={(e) => handleInfoChange(e)}
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
                    <div className="d-flex align-items-center gap-2"
                        style={{ width: '100%', backgroundColor: '#2E2E2E', padding: '10px', border: '1px solid gray', opacity: !canEditFields ? '0.5' : '1' }}>
                        <button
                            type="button"
                            className='button-style-regular'
                            disabled={!canEditFields} //disabled
                            onClick={() => { setIsModalOpen(true); setModalType('image') }}>
                            Select Image
                        </button>
                        {imageName ? (<>{imageName}</>) : (<>No image selected</>)}
                    </div>
                </div>}

                {/* Attributes */}
                <div>
                    <h4 className="marykate" style={{ fontSize: "2rem" }}>Attributes</h4>
                    {attributes.map((attribute, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            {attribute.trait_type === "damage" &&
                                <div style={{ marginTop: '20px' }}>
                                    <h5 className="marykate m-0" style={{ fontSize: "1.75rem" }}>Talents</h5>
                                    <div className='d-flex align-items-center button-container marykate' style={{ fontSize: "1.25rem" }}>
                                        <p className='m-0'>Remaining Points: {remainingPoints}</p>
                                        {isAdmin && remainingPoints < 0 && <p className='m-0'>[Admin Only]</p>}
                                    </div>
                                </div>
                            }
                            <label style={{ display: "block", marginBottom: "5px" }}>
                                {attribute.trait_type.toUpperCase()}
                            </label>
                            {attribute.trait_type === "blockchain" ? (
                                <select
                                    value={attribute.value}
                                    onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                                    disabled={!isAdmin || storeInfo.metadataUri}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "4px",
                                        border: "1px solid #555",
                                        backgroundColor: "#2E2E2E",
                                        color: "#FFF",
                                    }}
                                >
                                    <option value="">Select...</option>
                                    <option value="solana">Solana</option>
                                    <option value="ethereum">Ethereum</option>
                                </select>
                            ) : attribute.trait_type === "type" ? (
                                <select
                                    value={attribute.value}
                                    onChange={(e) => {handleAttributeChange(index, "value", e.target.value), resetDivisionOnTypeChange()}}
                                    disabled={!canEditFields}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "4px",
                                        border: "1px solid #555",
                                        backgroundColor: "#2E2E2E",
                                        color: "#FFF",
                                    }}
                                >
                                    <option value="">Select...</option>
                                    {generalTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitalizes first letter */}
                                        </option>
                                    ))}
                                </select>
                            ) : attribute.trait_type === "subType" ? (
                                <select
                                    value={attribute.value}
                                    onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                                    disabled={!canEditFields}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "4px",
                                        border: "1px solid #555",
                                        backgroundColor: "#2E2E2E",
                                        color: "#FFF",
                                    }}
                                >
                                    <option value="">Select...</option>
                                    {(() => {
                                        const type = attributes.find((attr) => attr.trait_type === "type")?.value;
                                        if (type === "skin") {
                                            return skinOptions.map((skin, i) => (
                                                <option key={i} value={skin}>
                                                    {skin.charAt(0).toUpperCase() + skin.slice(1)}
                                                </option>
                                            ));
                                        } else if (type === "weapon") {
                                            return weaponOptions.map((weapon, i) => (
                                                <option key={i} value={weapon}>
                                                    {weapon.charAt(0).toUpperCase() + weapon.slice(1)}
                                                </option>
                                            ));
                                        } else if (type === "armor") {
                                            return armorOptions.map((armor, i) => (
                                                <option key={i} value={armor}>
                                                    {armor.charAt(0).toUpperCase() + armor.slice(1)}
                                                </option>
                                            ));
                                        } else if (type === "accessories") {
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
                            ) : attribute.trait_type === 'division' ? (
                                <>
                                    {attributes.find((attr) => attr.trait_type === "type")?.value === 'skin' ? (
                                        <>
                                            <select
                                                value={attribute.value}
                                                onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                                                disabled={!canEditFields || (page === 'update' && !isAdmin)}
                                                style={{
                                                    width: "100%",
                                                    padding: "10px",
                                                    borderRadius: "4px",
                                                    border: "1px solid #555",
                                                    backgroundColor: "#2E2E2E",
                                                    color: "#FFF",
                                                }}
                                            >
                                                <option value="">Select...</option>
                                                {divisionOptions.map((division, i) => (
                                                    <option key={i} value={division}>
                                                        {division.charAt(0).toUpperCase() + division.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </>
                                    ) : (
                                        <>
                                            <select
                                                value={attribute.value}
                                                onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                                                disabled={true}
                                                style={{
                                                    width: "100%",
                                                    padding: "10px",
                                                    borderRadius: "4px",
                                                    border: "1px solid #555",
                                                    backgroundColor: "#2E2E2E",
                                                    color: "#FFF",
                                                }}
                                            >
                                                <option value="none">None [Skins Only]</option>
                                            </select>
                                        </>
                                    )}
                                </>
                            ) : attribute.trait_type === "rarity" ? (
                                <>
                                    <select
                                        value={attribute.value}
                                        onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                                        disabled={!canEditFields || (page === 'update' && !isAdmin)}
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            borderRadius: "4px",
                                            border: "1px solid #555",
                                            backgroundColor: "#2E2E2E",
                                            color: "#FFF",
                                        }}
                                    >
                                        <option value="">Select...</option>
                                        {rarityOptions.map((rarity, i) => (
                                            <option key={i} value={rarity}>
                                                {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    {page === 'create' &&
                                        <div className="d-flex justify-content-end marykate" style={{ paddingRight: '10px', fontSize: '1rem' }}>
                                            Creator Costs: ${creatorCosts[attributes.find(attr => attr.trait_type === "rarity").value]}
                                        </div>
                                    }
                                </>
                            ) : attribute.trait_type === "affinity" ? (
                                <select
                                    value={attribute.value}
                                    onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                                    disabled={!canEditFields}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "4px",
                                        border: "1px solid #555",
                                        backgroundColor: "#2E2E2E",
                                        color: "#FFF",
                                    }}
                                >
                                    <option value="" disabled>
                                        Select...
                                    </option>
                                    {affinityOptions.map((affinity, i) => (
                                        <option key={i} value={affinity}>
                                            {affinity.charAt(0).toUpperCase() + affinity.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            ) : attributesToTrack.includes(attribute.trait_type) ? (
                                <>
                                    <input
                                        type="number"
                                        value={attribute.value}
                                        placeholder="0"
                                        onChange={(e) => handleAttributeInputChange(index, attribute.trait_type, e.target.value)}
                                        onBlur={(e) => {
                                            // Set value to 0 if left empty
                                            if (e.target.value === "") {
                                                handleAttributeChange(index, "value", "0");
                                            }
                                        }}
                                        max={20} // Limit per attribute (if needed)
                                        disabled={!canEditFields}
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            borderRadius: "4px",
                                            border: "1px solid #555",
                                            backgroundColor: "#2E2E2E",
                                            color: "#FFF",
                                        }}
                                    />
                                </>
                            ) : (
                                <input
                                    type="text"
                                    value={attribute.value}
                                    placeholder="Enter value"
                                    onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                                    disabled={!canEditFields}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "4px",
                                        border: "1px solid #555",
                                        backgroundColor: "#2E2E2E",
                                        color: "#FFF",
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
                {/* Submit Button */}
                {!isCreated && (
                    <>
                        <button
                            type="submit"
                            className='button-click'
                            style={{ marginTop: '0px' }}
                            disabled={isDisabled}
                        >
                            {page === 'create' ? (
                                isCreating ? (
                                    <div className="d-flex justify-content-center gap-3 align-items-center">
                                        <div className='loader'></div>
                                        <div>Generating concept...</div>
                                    </div>
                                ) : isCreated ? (
                                    <div>NFT Concept Created!</div>
                                ) : wallet.publicKey ? (
                                    <>Create NFT Concept</>
                                ) : (
                                    <>Connect a wallet to submit</> // Placeholder
                                )
                            ) : (
                                <div>Update NFT Concept</div>
                            )}
                        </button>

                        {/* Render the SolConnection button separately */}
                        {!wallet.publicKey && <div className='d-flex justify-content-center'><SolConnection /></div>}
                    </>
                )}
            </form>
            {page === "create" && isCreated && (
                <>
                    <button
                        className="button-click"
                        onClick={() => { setPage('update'), resetEverything() }}>
                        View New Creation!
                    </button>
                    <button
                        className="button-click"
                        onClick={() => { resetEverything() }}
                    >
                        Create New (Reset)
                    </button>
                    {isAdmin && (<>
                        {lockedStatus ? (
                            <div className="button-container">
                                <div style={{ fontSize: "1rem", fontWeight: "500" }}>[ADMIN ONLY]:</div>
                                <div className="d-flex gap-2">
                                    <strong>LOCKING...</strong>
                                    <div className='loader'></div>
                                </div>
                            </div>
                        ) : (
                            <>
                            </>
                        )}
                    </>)}
                </>
            )}
            {page === "update" && info.name && (
                <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap" style={{ width: '100%', marginTop: '10px' }}>
                    {storeInfo.metadataUri ? (
                        <>
                            <a className="button-click text-center" href={storeInfo.metadataUri} target="_blank" rel="noopener noreferrer">
                                View Off-Chain Data
                            </a>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            )}
        </div>
    );
};

export default SideNav;
