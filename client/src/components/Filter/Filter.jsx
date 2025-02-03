import React, { useState, useEffect } from 'react';

import { LuRefreshCcw } from "react-icons/lu";

import { useWallet } from '@solana/wallet-adapter-react';

import Switch from 'react-switch';

import '../../css/mobile-Filter.css'

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
    talents
} from '../../config/gameConfig';
import { useLocation } from 'react-router-dom';

const Filter = ({
    title,
    selectedType,
    setSelectedType,
    selectedSubType,
    setSelectedSubType,
    selectedRarity,
    setSelectedRarity,
    selectedCreator,
    setSelectedCreator,
    setIsFetched,
    filterByCreator = false }) => {

    const wallet = useWallet();

    const [checked, setChecked] = useState(false);

    const [isDropdownOpenType, setIsDropdownOpenType] = useState(false);
    const [isDropdownOpenRarity, setIsDropdownOpenRarity] = useState(false);

    const handleDropdownToggleOfType = () => {
        setIsDropdownOpenType(!isDropdownOpenType);
    };

    const handleDropdownToggleOfRarity = () => {
        setIsDropdownOpenRarity(!isDropdownOpenRarity);
    };

    const address = wallet.publicKey ? wallet.publicKey.toString() : 'all';

    const handleChange = () => {

        if (selectedCreator === 'all') {
            setSelectedCreator(address);
            setChecked(!checked);
        } else {
            setSelectedCreator('all');
            setChecked(!checked);
        }
    }

    const location = useLocation();
    useEffect(() => {
        
        if(location.pathname === '/dashboard' && wallet.publicKey){
            setChecked(true);
            setSelectedCreator(wallet.publicKey.toString())
        } else if (location.pathname === '/dashboard' && !wallet.publicKey){
            setChecked(false);
            setSelectedCreator('all');
        }

    }, [wallet.publicKey])

    const filteredGeneralTypes = [...generalTypes, 'all'];; //Add all for search filters
    const filteredWeaponOptions = [...weaponOptions, 'all'];
    const filteredArmorOptions = [...armorOptions, 'all'];
    const filteredRarityOptions = [...rarityOptions, 'all'];

    return (
        <div className="d-flex flex-column" style={{ color: 'white', padding: '0px 25px' }}>
            <h1 className="align-self-start filter-title">{title} <span className='disable-on-mobile' style={{ fontSize: '16px' }}>[solana]</span></h1>
            <div className="d-flex justify-content-between align-items-end">

                {/* Desktop Button Group */}
                <div className="disable-on-mobile d-flex gap-3">
                    {filteredGeneralTypes.map((item) => (
                        <button
                            key={item}
                            href="#"
                            className={selectedType === item ? "selected-button" : "strip-button"}
                            onClick={() => { setSelectedType(item), setSelectedSubType('all') }}
                        >
                            {item.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Mobile Dropdown */}
                <div className="dropdown">
                    <div className="d-flex gap-2">
                        <div className="marykate" style={{ fontSize: '1.25rem' }}>Type</div>
                        <button
                            className="dropdown-toggle"
                            onClick={handleDropdownToggleOfType}
                        >
                            {selectedType ? selectedType.toUpperCase() : "SELECT"}
                        </button>
                    </div>
                    {isDropdownOpenType && (
                        <ul className="dropdown-menu">
                            {filteredGeneralTypes.map((item) => (
                                <li key={item} className="dropdown-item">
                                    <button
                                        className="dropdown-item-button"
                                        onClick={() => handleItemClick(item)}
                                    >
                                        {item.toUpperCase()}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="d-flex align-items-center gap-2">
                    <Switch
                        onChange={handleChange}
                        checked={checked}
                        offColor="#888"
                        onColor="#6a0dad"
                        offHandleColor="#444"
                        onHandleColor="#fff"
                        uncheckedIcon={false}
                        checkedIcon={false}
                    />
                    <p className="m-0 marykate" style={{ fontSize: '1.3rem' }}>By Me</p>
                </div>
                <div>
                    <button className="strip-button" onClick={() => setIsFetched(false)}>
                        <LuRefreshCcw />
                    </button>
                </div>
            </div>
            <div style={{ width: '100%', borderTop: '1px solid white', margin: '5px 0px 10px 0px' }}></div>
            <div>
                {selectedType === "weapon" && (
                    <div>
                        <div className="d-flex gap-2" style={{ marginBottom: '10px' }}>
                            +
                            {filteredWeaponOptions.map((item) => (
                                <button
                                    key={item}
                                    className={selectedSubType === item ? "circle-button-selected" : "circle-button"}
                                    onClick={() => { setSelectedSubType(item) }}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {selectedType === "armor" && (
                    <div>
                        <div className="d-flex gap-2" style={{ marginBottom: '10px' }}>
                            +
                            {filteredArmorOptions.map((item) => (
                                <button
                                    key={item}
                                    className={selectedSubType === item ? "circle-button-selected" : "circle-button"}
                                    onClick={() => setSelectedSubType(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Desktop Filter */}
                <div className="d-flex gap-2 disable-on-mobile">
                    +
                    {filteredRarityOptions.map((item) => (
                        <button
                            key={item}
                            className={selectedRarity === item ? "circle-button-selected" : "circle-button"}
                            onClick={() => setSelectedRarity(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Mobile Filter */}
                <div className="dropdown">
                    <div className="d-flex gap-2">
                        <div className="marykate" style={{ fontSize: '1.25rem' }}>Rarity</div>
                        <button
                            className="dropdown-toggle"
                            onClick={handleDropdownToggleOfRarity}
                        >
                            {selectedType ? selectedType.toUpperCase() : "SELECT"}
                        </button>
                    </div>
                    {isDropdownOpenRarity && (
                        <ul className="dropdown-menu">
                            {filteredRarityOptions.map((item) => (
                                <li key={item} className="dropdown-item">
                                    <button
                                        className="dropdown-item-button"
                                        onClick={() => handleItemClick(item)}
                                    >
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Filter;