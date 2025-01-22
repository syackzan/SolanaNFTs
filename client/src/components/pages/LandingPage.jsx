import React from 'react';

import { Link } from 'react-router-dom'

import ImageCarousel from '../ImageCarousel/ImageCarousel';
import Navbar from '../Navbar/Navbar';

const LandingPage = () => {

    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <Navbar />
            <div className="landing-page">
                <h1 className='lazy-dog' style={{
                    color: 'white',
                    fontSize: '4rem',  // Adjust as needed
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(255, 255, 255, 0.5)',  // Adds a glowing effect
                    marginBottom: '10px',
                }}>
                    Booh Brawlers
                </h1>
                <h3 className='marykate' style={{
                    color: '#ccc',  // Softer gray for secondary text
                    fontSize: '3rem',
                    textShadow: '1px 1px 3px rgba(255, 255, 255, 0.3)',
                    marginTop: '0',
                    marginBottom: '15px'
                }}>
                    NFT Creation Hub
                </h3>
                <div className="d-flex justify-content-center gap-3 p-2" style={{ backgroundColor: "#1e1e2f", borderRadius: "8px", color: "#ffffff", marginBottom: '15px' }}>
                    <Link className="darkmode-button" to='/dashboard?action=create' >Create</Link>
                    <Link className="darkmode-button" to='/dashboard?action=update' >Edit</Link>
                    <Link className="darkmode-button" to='/documentation' >Docs</Link>
                </div>
                <ImageCarousel />
            </div>
        </div>
    )
}

export default LandingPage;