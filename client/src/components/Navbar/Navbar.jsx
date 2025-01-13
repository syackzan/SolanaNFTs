import React from 'react';
import { Link } from 'react-router-dom'
import { useLocation } from "react-router-dom";

import SolConnection from '../Connection/SolConnection';

import BoohLogo from '../../assets/BoohCoinLogo.svg';

const Navbar = ({ setPage, resetMetadata, setIsDisabled }) => {

    const location = useLocation();

    return (
        <div className="navbar-parent">
            <Link to='/' className="d-flex justify-content-center gap-3 align-items-center">
                <img src={BoohLogo} style={{ width: '50px', height: '50px' }} />
                <h2 className="lazy-dog" style={{color: 'white'}}>BOOH BRAWLERS</h2>
            </Link>
            <div className='d-flex gap-4 style-links'>
                <Link>Play Game</Link>
                <div style={{borderRight: '2px solid #fff', margin: '10px 0px'}}></div>
                <Link>Marketplace</Link>
                <div style={{borderRight: '2px solid #fff', margin: '10px 0px'}}></div>
                <Link>Booh World</Link>
                <div style={{borderRight: '2px solid #fff', margin: '10px 0px'}}></div>
                <Link>Discord</Link>
            </div>
            {location.pathname === '/dashboard' && (
                <div className="d-flex justify-content-center gap-3">
                    <button className="darkmode-button" onClick={() => { setPage('create'), resetMetadata(), setIsDisabled(false) }}>Create</button>
                    <button className="darkmode-button" onClick={() => { setPage('update'), resetMetadata(), setIsDisabled(false) }}>Update</button>
                    <SolConnection />
                </div>
            )}
        </div>
    )
}

export default Navbar;