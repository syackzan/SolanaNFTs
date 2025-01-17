import React, {useState} from 'react';

import { LuRefreshCcw } from "react-icons/lu";

import { useWallet } from '@solana/wallet-adapter-react';

import Switch from 'react-switch';

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
    setIsFetched }) => {

    const wallet = useWallet();

    const [checked, setChecked] = useState(false);

    const address = wallet.publicKey ? wallet.publicKey.toString() : 'all';

    const handleChange = () => {

        if(selectedCreator === 'all'){
            setSelectedCreator(address);
            setChecked(!checked);
        } else {
            setSelectedCreator('all');
            setChecked(!checked);
        }
    }

    return (
        <div className="d-flex flex-column" style={{ color: 'white', padding: '0px 25px' }}>
            <h1 className="align-self-start">{title} <span style={{ fontSize: '16px' }}>[solana]</span></h1>
            <div className="d-flex justify-content-between align-items-end">
                <div className="d-flex gap-3">
                    {["skin", "weapon", "armor", "accessory", "all"].map((item) => (
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
                {/* <div>
                    <button className="" onClick={() => setSelectedCreator(address)}>My NFTs</button>
                    <button className="" onClick={() => setSelectedCreator('all')}>All NFTs</button>
                </div> */}
                <div className="d-flex align-items-end gap-2">
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
                    <p className="m-0 marykate" style={{fontSize: '1.2rem'}}>Created By Me</p>
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
                            {["sword", "dagger", "bow", "axe", "staff", "all"].map((item) => (
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
                            {["chest", "leggings", "helm", 'gloves', "all"].map((item) => (
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
                <div className="d-flex gap-2">
                    +
                    {["common", "uncommon", "rare", "epic", "legendary", "all"].map((item) => (
                        <button
                            key={item}
                            className={selectedRarity === item ? "circle-button-selected" : "circle-button"}
                            onClick={() => setSelectedRarity(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Filter;