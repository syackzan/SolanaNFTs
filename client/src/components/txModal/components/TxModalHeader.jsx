import React from 'react'

import { useMarketplace } from '../../../context/MarketplaceProvider';

import BoohLogo from '../../../assets/BoohLogo.svg';

const TxModalHeader = () => {

    const {
            redirectSecret,
            resetTxModal
        } = useMarketplace();

        // Function to handle closing and redirecting
    const handleClose = (e) => {
        e.preventDefault();
        resetTxModal();
        window.location.href = '/marketplace';
    };

    return (
        <>
            {/* Close button */}
            <div className="d-flex justify-content-end">
                {redirectSecret ? (
                    <a href="/marketplace" className="modal-close-top-right" onClick={handleClose}>&times;</a>
                ) : (
                    <button className="modal-close-top-right" onClick={resetTxModal}>&times;</button>
                )}
            </div>

            {/* Header */}
            <div className="d-flex justify-content-center align-items-center gap-2" style={{ marginBottom: '10px' }}>
                <img src={BoohLogo} style={{ width: "40px", height: "40px" }} />
                <h2 className="modal-header marykate m-0" style={{ fontSize: "2rem" }}>Confirmation</h2>
            </div>
        </>
    )
}

export default TxModalHeader;