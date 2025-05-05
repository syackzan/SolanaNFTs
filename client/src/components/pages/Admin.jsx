import React, { useState, useEffect } from "react";
import "../../css/admin.css"; // Import CSS file for styling

import Navbar from "../Navbar/Navbar";
import TxModalManager from '../txModal/TxModalManager';
import AdminTransactionsPanel from "../AdminTransactions/AdminTransactionsPanel";

import { useTransactionsController } from "../../providers/TransactionsProvider";
import { useWalletAdmin } from "../../hooks/useWalletAdmin";
import { updateRarityOnAllNfts } from "../../services/dbServices";

import { pricingValues } from "../../config/gameConfig";

const Admin = () => {
    const { userRole, wallet } = useWalletAdmin();
    const { isModalOpen } = useTransactionsController();

    const [isMobile, setIsMobile] = useState(window.innerWidth < 500);
    const [renderState, setRenderState] = useState('home'); //home, adminConfig, transacitons

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 500);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 🚀 Return early if mobile
    if (isMobile) {
        return (
            <>
                <Navbar />
                <div className="d-flex justify-content-center align-items-center" style={{ width: "100vw", height: "100vh", color: "white" }}>
                    Please access the Admin panel on a desktop.
                </div>
            </>
        );
    }

    // 🚀 Return early if user is not an admin
    if (!userRole) {
        return (
            <>
                <Navbar />
                <div className="d-flex justify-content-center align-items-center" style={{ width: "100vw", height: "100vh", color: "white" }}>
                    Admin Access Required
                </div>
            </>
        );
    }

    const updateNftPricing = async () => {
        const resp = await updateRarityOnAllNfts(1, pricingValues, wallet.publicKey.toString());
        console.log(resp);
    }

    // 🚀 Main Admin UI
    return (
        <div>
            <Navbar />

            {renderState === 'home' && (
                <div style={{ marginTop: '80px' }} className="d-flex flex-column align-items-center gap-4">
                    <button
                        onClick={() => setRenderState('adminConfig')}
                        style={{ width: '200px', height: '80px', fontSize: '20px' }}
                    >
                        Admin Config
                    </button>
                    <button
                        onClick={() => setRenderState('transactions')}
                        style={{ width: '200px', height: '80px', fontSize: '20px' }}
                    >
                        NFT Transactions
                    </button>
                </div>
            )}

            {renderState === 'adminConfig' && (
                <div className="admin-panel-container">
                    {/* <AdminConfigPanel /> */}
                    <button className="mt-3" onClick={() => setRenderState('home')}>← Back</button>
                </div>
            )}

            {renderState === 'transactions' && (
                <div className="admin-panel-container">
                    <AdminTransactionsPanel setRenderState={setRenderState} />
                    <button className="mt-3" onClick={() => setRenderState('home')}>← Back</button>
                </div>
            )}

            {/* Optional action button */}
            {renderState !== 'home' && (
                <div className="text-center mt-4">
                    <div className="mt-4">
                        {Object.entries(pricingValues).map(([rarity, price]) => (
                            <div key={rarity} style={{ marginBottom: '8px', fontSize: '16px', color: 'white' }}>
                                <strong>{rarity.charAt(0).toUpperCase() + rarity.slice(1)}:</strong> ${price.toFixed(2)}
                            </div>
                        ))}
                    </div>
                    <button onClick={updateNftPricing}>Update NFT Pricing</button>
                </div>
            )}

            {isModalOpen && <TxModalManager />}
        </div>
    );
};

export default Admin;
