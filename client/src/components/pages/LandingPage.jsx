import React from 'react';

import { Link } from 'react-router-dom'

import ImageCarousel from '../ImageCarousel/ImageCarousel';
import Navbar from '../Navbar/Navbar';

import { FaFileAlt, FaEdit, FaBook, FaGhost, FaStore } from 'react-icons/fa'; // Import icons

const LandingPage = () => {

    return (
        <div className='landing-page-container'>
            <Navbar />
            <div className="landing-page">
                <h1 className='lazy-dog landing-page-title'>
                    Booh Brawlers
                </h1>
                <h3 className='marykate landing-page-subtitle'>
                    NFT Creation Hub
                </h3>
                <div className="dashboard-grid marykate">
                    <Link className="darkmode-button" to="/marketplace">
                        <FaStore className="dashboard-icon" />
                        Marketplace
                    </Link>
                    <Link className="darkmode-button" to="/dashboard?action=create">
                        <FaEdit className="dashboard-icon" />
                        Create/Edit
                    </Link>
                    <Link className="darkmode-button" to="/creatorHubDocs">
                        <FaBook className="dashboard-icon" />
                        Docs & Rules
                    </Link>
                    <Link className="darkmode-button" to="/dashboard?action=submit">
                        <FaGhost className="dashboard-icon" />
                        Submit Ghost
                    </Link>
                </div>
                <ImageCarousel />
            </div>
        </div>
    )
}

export default LandingPage;