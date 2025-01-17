import React from 'react';
import { Link } from 'react-router-dom'

import SolConnection from '../Connection/SolConnection';

import BoohLogo from '../../assets/BoohCoinLogo.svg';

const Navbar = ({ setPage, resetMetadata, setIsDisabled }) => {

    return (
        <nav className="store-navbar-main">
            {/*  */}
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-3 align-items-center">
                    <div>
                        <Link className="d-flex align-items-center gap-1 header-fonts" to="/" style={{fontSize: '1.4rem', color: 'white'}}>
                            <img
                                src={BoohLogo} // Replace with your logo
                                alt="Marketplace Logo"
                                style={{ width: '30px', height: '30px' }}
                            />
                            Booh Brawlers
                        </Link>
                    </div>
                    <div style={{borderRight: '2px solid white', height: '40px'}}></div>
                    <div className='d-flex gap-4 store-nav marykate' style={{fontSize: '1.5rem'}}>
                        <Link to='https://t.me/BoohBrawlBot/BoohBrawlers' target='_blank'>Play Game</Link>
                        {/* <div style={{ borderRight: '2px solid #fff', margin: '10px 0px' }}></div> */}
                        <Link to='/marketplace'>Marketplace</Link>
                        {/* <div style={{ borderRight: '2px solid #fff', margin: '10px 0px' }}></div> */}
                        <Link to='/dashboard?action=update'>Creator Hub</Link>
                        {/* <div style={{ borderRight: '2px solid #fff', margin: '10px 0px' }}></div> */}
                        <Link to='https://boohworld.io' target='_blank'>Token</Link>
                        {/* <div style={{ borderRight: '2px solid #fff', margin: '10px 0px' }}></div> */}
                        <Link to='https://discord.gg/WkWcNFEA' target='_blank'>Discord</Link>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    {/* Searchbox */}
                    <div className="searchbox">
                        {/* Inline SVG for Search Icon */}
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
                    </div>
                    <SolConnection />
                </div>
            </div>
        </nav>
    )

    // const location = useLocation();

    // const [isMenuOpen, setIsMenuOpen] = useState(false);

    // const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    // return (
    //     <div className="navbar-parent">
    //         <Link to='/' className="d-flex justify-content-center gap-3 align-items-center">
    //             <img src={BoohLogo} style={{ width: '50px', height: '50px' }} />
    //             <h2 className="lazy-dog" style={{ color: 'white' }}>BOOH BRAWLERS</h2>
    //         </Link>
    // <div className="d-flex justify-content-between w-100 style-links">
    //     <div className='d-flex gap-4'>
    //         <Link>Play Game</Link>
    //         <div style={{ borderRight: '2px solid #fff', margin: '10px 0px' }}></div>
    //         <Link to='/marketplace'>Marketplace</Link>
    //         <div style={{ borderRight: '2px solid #fff', margin: '10px 0px' }}></div>
    //         <Link to='/dashboard?action=update'>Creator Hub</Link>
    //         <div style={{ borderRight: '2px solid #fff', margin: '10px 0px' }}></div>
    //         <Link to='https://boohworld.io'>Token</Link>
    //         <div style={{ borderRight: '2px solid #fff', margin: '10px 0px' }}></div>
    //         <Link>Discord</Link>
    //     </div>
    //             {location.pathname === '/dashboard' && (
    //                 <div className="d-flex justify-content-center gap-3">
    //                     <button className="darkmode-button" onClick={() => { setPage('create'), resetMetadata(), setIsDisabled(false) }}>Create</button>
    //                     <button className="darkmode-button" onClick={() => { setPage('update'), resetMetadata(), setIsDisabled(false) }}>Edit</button>
    //                     <SolConnection />
    //                 </div>
    //             )}
    //             {location.pathname === '/collection' && (
    //                 <div className="d-flex justify-content-center gap-3">
    //                     <SolConnection />
    //                 </div>
    //             )}
    //             {location.pathname === '/marketplace' && (
    //                 <div className="d-flex justify-content-center gap-3">
    //                     <SolConnection />
    //                 </div>
    //             )}
    //         </div>
    //     </div>
    // )
}

export default Navbar;