import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom'

import { GlobalVars } from '../GlobalVariables/GlobalVariables';

import SolConnection from '../Connection/SolConnection';

import BoohLogo from '../../assets/BoohCoinLogo.svg';

import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { fetchBabyBooh } from '../../Utils/babyBooh';
import { getTokenBalance } from '../BlockchainInteractions/blockchainInteractions';

import { GiHamburgerMenu } from "react-icons/gi";
import { motion } from 'framer-motion'

import { IS_MAINNET } from '../../config/config';

import '../../css/mobile-Navbar.css'

const Navbar = ({ setPage, resetMetadata, setIsDisabled }) => {

    const wallet = useWallet();
    const { connection } = useConnection();

    const { inGameCurrency, setInGameCurrency, boohToken, setBoohToken } = useContext(GlobalVars);

    const [isMobileNavbar, setIsMobileNavbar] = useState(false);
    const [isHubDropdownOpen, setIsHubDropdownOpen] = useState(false);

    useEffect(() => {

        const callAsync = async () => {
            if (wallet.publicKey) {
                const babyBooh = await fetchBabyBooh(wallet.publicKey.toString());

                if (babyBooh > -1) {
                    console.log
                    setInGameCurrency(babyBooh);
                }

                const fetchedBoohToken = await getTokenBalance(wallet.publicKey.toString(), connection);

                if (fetchedBoohToken >= 0 && IS_MAINNET === true) {
                    setBoohToken(fetchedBoohToken);
                }
            }
        }

        callAsync();

    }, [wallet.publicKey]);

    return (
        <nav className="store-navbar-main">
            {/*  */}
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-3 align-items-center">
                    <div>
                        <Link className="d-flex align-items-center gap-1 header-fonts" to="/" style={{ fontSize: '1.4rem', color: 'white' }}>
                            <img
                                src={BoohLogo} // Replace with your logo
                                alt="Marketplace Logo"
                                style={{ width: '30px', height: '30px' }}
                            />
                            Booh Brawlers
                        </Link>
                    </div>

                    {/* Desktop Navbar */}
                    <div className="disable-on-mobile" style={{ borderRight: '2px solid white', height: '40px' }}></div>
                    <div className='d-flex gap-4 store-nav marykate disable-on-mobile'>
                        <Link to='https://t.me/BoohBrawlBot/BoohBrawlers' target='_blank'>Play Game</Link>
                        {/* <div style={{ borderRight: '2px solid #fff', margin: '10px 0px' }}></div> */}
                        <Link to='/marketplace'>Marketplace</Link>
                        {/* <div style={{ borderRight: '2px solid #fff', margin: '10px 0px' }}></div> */}
                        {/* Dropdown Wrapper */}
                        <div
                            className="dropdown-container"
                            onMouseEnter={() => setIsHubDropdownOpen(true)}
                            onMouseLeave={() => setIsHubDropdownOpen(false)}
                        >
                            <Link to="/dashboard?action=update" className="dropdown-trigger">
                                Creator Hub
                            </Link>

                            {/* Keep menu in the DOM, just toggle the 'open' class */}
                            <div className={`dropdown-menu ${isHubDropdownOpen ? "open" : ""}`}>
                                <Link to="/dashboard?action=create">Create MD</Link>
                                <Link to="/dashboard?action=update">Edit MD</Link>
                                <Link to="/submission">Character</Link>
                            </div>
                        </div>
                        {/* <div style={{ borderRight: '2px solid #fff', margin: '10px 0px' }}></div> */}
                        <Link to='https://boohworld.io' target='_blank'>Token</Link>
                        {/* <div style={{ borderRight: '2px solid #fff', margin: '10px 0px' }}></div> */}
                        <Link to='https://discord.gg/WkWcNFEA' target='_blank'>Discord</Link>
                        <Link to='/creatorHubDocs'>Docs</Link>
                    </div>
                </div>

                {/* Desktop Navbar */}
                <div className="d-flex gap-5 disable-on-mobile">
                    <div className="d-flex flex-column marykate" style={{ fontSize: '0.9rem' }}>
                        <p className="m-0">Baby Booh: {inGameCurrency}</p>
                        <p className="m-0">Booh Token: {boohToken}</p>
                    </div>
                    <div>
                        <SolConnection />
                    </div>
                </div>

                {/* Mobile Navbar */}
                <div className='d-flex gap-2 enable-on-mobile'>
                    <div>
                        {isMobileNavbar ? (
                            <button
                                className="close-nav-modal-button"
                                onClick={() => { setIsMobileNavbar(!isMobileNavbar) }}>
                                &times;
                            </button>
                        ) : (
                            <button
                                className="button-style-regular"
                                onClick={() => { setIsMobileNavbar(!isMobileNavbar) }}>
                                <GiHamburgerMenu />
                            </button>
                        )}
                    </div>
                </div>

                {isMobileNavbar && (
                    <motion.div
                        className="nav-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsMobileNavbar(false)}
                    >
                        <motion.div
                            className="nav-modal-tx"
                            initial={{ x: "100%" }} // Start off-screen to the right
                            animate={isMobileNavbar ? { x: 0 } : { x: "100%" }} // Slide in/out based on state
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <div className="modal-content d-flex flex-column justify-content-between">
                                {/* Navigation Links */}
                                <div className="d-flex flex-column marykate" style={{ padding: '20px' }}>
                                    <Link to="https://t.me/BoohBrawlBot/BoohBrawlers" target="_blank">Play Game</Link>
                                    <Link to="/marketplace">Marketplace</Link>
                                    <Link to="/dashboard?action=update">Creator Hub</Link>
                                    <Link to="https://boohworld.io" target="_blank">Token</Link>
                                    <Link to="https://discord.gg/WkWcNFEA" target="_blank">Discord</Link>
                                    <Link to="/creatorHubDocs">Docs & Rules</Link>
                                </div>
                                <div className="mobile-nav-login">
                                    <div className="d-flex gap-5 justify-content-between align-items-center h-100" style={{ padding: '0px 20px' }}>
                                        <div className="d-flex flex-column marykate" style={{ fontSize: '0.9rem' }}>
                                            <p className="m-0">Baby Booh: {inGameCurrency}</p>
                                            <p className="m-0">Booh Token: {boohToken}</p>
                                        </div>
                                        <div>
                                            <SolConnection />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

            </div>
        </nav >
    )
}

export default Navbar;

{/* Searchbox */ }
{/* <div className="searchbox">
<svg
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '25px' }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
>
    <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 17a7 7 0 100-14 7 7 0 000 14zM21 21l-4.35-4.35"
    />
</svg>
<input
    type="text"
    placeholder="Skins, Weapons, Equipment..."
    className="search-input"
/>
</div> */}