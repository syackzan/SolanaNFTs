import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageCarousel from '../ImageCarousel/ImageCarousel';
import Navbar from '../Navbar/Navbar';
import { FaArrowLeft } from "react-icons/fa6";
import { FaEdit, FaBook, FaGhost, FaStore } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence

import { useTransactionsController } from '../../providers/TransactionsProvider';
import TxModalManager  from '../txModal/TxModalManager';
  
const LandingPage = () => {
    const [landingPage, setLandingPage] = useState('main');

    const { isModalOpen } = useTransactionsController();

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, transition: { duration: 0.3 } }, // Ensures smooth transition on exit
    };

    // Detect if mobile
    const isMobile = window.innerWidth <= 650;

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

                {/* AnimatePresence for smooth enter/exit animation */}
                <AnimatePresence mode="wait">
                    {landingPage === 'main' ? (
                        <motion.div
                            key="main"
                            className="dashboard-grid marykate"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={fadeIn}
                        >
                            <Link className="darkmode-button" to="/marketplace">
                                <FaStore className="dashboard-icon" />
                                Marketplace
                            </Link>
                            <Link className="darkmode-button" to="#" onClick={() => setLandingPage('creator')}>
                                <FaEdit className="dashboard-icon" />
                                Create/Edit
                            </Link>
                            <Link className="darkmode-button" to="/creatorHubDocs">
                                <FaBook className="dashboard-icon" />
                                Docs & Rules
                            </Link>
                            <Link className="darkmode-button" to="/character-submit">
                                <FaGhost className="dashboard-icon" />
                                Submit Ghost
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="creator"
                            style={{ height: '211px' }}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={fadeIn}
                        >
                            <div className="d-flex justify-content-start" style={{ width: isMobile ? "350px" : "400px" }}>
                                <button className="strip-button" onClick={() => setLandingPage('main')}>
                                    <FaArrowLeft />
                                </button>
                            </div>
                            <div className="d-flex justify-content-center" style={{ margin: '10px 0px' }}>
                                <Link className="darkmode-button" to="/dashboard?action=create">
                                    <FaEdit className="dashboard-icon" />
                                    Create
                                </Link>
                                <Link className="darkmode-button" to="/dashboard?action=update">
                                    <FaEdit className="dashboard-icon" />
                                    Edit
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <ImageCarousel />

                {/* TX MODAL MANAGER FOR CONNECTING WALLET */}
                {isModalOpen && <TxModalManager />}
            </div>
        </div>
    );
};

export default LandingPage;