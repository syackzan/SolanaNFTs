import React from 'react'

import { useTransactionsController } from '../../../providers/TransactionsProvider';

import BoohLogo from '../../../assets/BoohLogo.svg';

const TxModalHeader = ({ title = 'Confirmation', disableSimpleClose = false }) => {

    const {
        redirectSecret,
        resetTxModal,
        simpleModalClose
    } = useTransactionsController();

    // Function to handle closing and redirecting
    const handleClose = (e) => {
        e.preventDefault();
        resetTxModal();
        window.location.href = '/marketplace';
    };

    return (
        <>
            {/* Close button */}
            {!disableSimpleClose ?
                (<div className="d-flex justify-content-end">
                    {redirectSecret ? (
                        <a href="/marketplace" className="modal-close-top-right" onClick={handleClose}>&times;</a>
                    ) : (
                        <button className="modal-close-top-right" onClick={resetTxModal}>&times;</button>
                    )}
                </div> 
                ) : (
                    <div className="d-flex justify-content-end">
                        <button className="modal-close-top-right" onClick={simpleModalClose}>&times;</button>
                    </div>
                )
            }

            {/* Header */}
            <div className="d-flex justify-content-center align-items-center gap-2" style={{ marginBottom: '10px' }}>
                <img src={BoohLogo} style={{ width: "40px", height: "40px" }} />
                <h2 className="modal-header marykate m-0" style={{ fontSize: "2rem" }}>{title}</h2>
            </div>
        </>
    )
}

export default TxModalHeader;