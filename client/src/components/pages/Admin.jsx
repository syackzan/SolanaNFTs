import React, { useState, useEffect } from "react";
import "../../css/admin.css"; // Import CSS file for styling

import Navbar from "../Navbar/Navbar";
import TxModalManager from '../txModal/TxModalManager';
import AdminTransactionsPanel from "../AdminTransactions/AdminTransactionsPanel";

import { useTransactionsController } from "../../providers/TransactionsProvider";
import { useWalletAdmin } from "../../hooks/useWalletAdmin";

const Admin = () => {
    const { userRole } = useWalletAdmin();
    const {isModalOpen} = useTransactionsController();

    const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

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

    // 🚀 Main Admin UI
    return (
        <div>
            <Navbar />
            <div className="admin-panel-container">
                <AdminTransactionsPanel />
            </div>
            {isModalOpen && <TxModalManager />}
        </div>
    );
};

export default Admin;
