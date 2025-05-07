import React, { useState, useMemo } from "react";

import { useGlobalVariables } from "../../providers/GlobalVariablesProvider";

import { shortenAddress } from "../../Utils/generalUtils";

import { duplicateData } from "../../Utils/generalUtils";

const AdminTransactionsPanel = ({ setRenderState }) => {

    const { nftConcepts } = useGlobalVariables();

    const [loading, setLoading] = useState(false);

    const transactions = useMemo(() => {
        // Flatten all NFT transactions into one array with nft reference
        const allTxs = nftConcepts.flatMap(nft =>
            nft.purchases.transactions.map(tx => ({
                ...tx,
                nft, // keep reference to parent NFT
            }))
        );

        // Sort by timestamp descending (newest first)
        return allTxs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }, [nftConcepts]);

    if (loading) {
        return <div className="admin-loading">Loading transactions...</div>;
    }

    const modifiedAmount = (currency, amount) => {
        switch (currency) {
            case 'CARD':
                return `$${amount}`;
            default:
                return amount;
        }
    }


    return (
        <div className="admin-transactions-container">
            <button className="admin-back-button" onClick={() => setRenderState("home")}>Back</button>
            <h2 className="admin-title">NFT Transactions</h2>
            <div className="transactions-table">
                <div className="table-header">
                    <span>NFT Name</span>
                    <span>Type</span>
                    <span>User</span>
                    <span>Amount</span>
                    <span>Currency</span>
                    <span>Transaction</span>
                    <span>Date</span>
                </div>

                {transactions.map((tx, index) => (
                    <div key={`${tx.nft._id}-${index}`} className="table-row">
                        <span className="nft-id">{tx.nft.name}</span>
                        <span className={`tx-type ${tx.type}`}>{tx.type.toUpperCase()}</span>
                        <span className="tx-user">{shortenAddress(tx.user)}</span>
                        <span className="tx-amount">{modifiedAmount(tx.currency, tx.amount)}</span>
                        <span className="tx-currency">{tx.currency}</span>
                        <span className="tx-signature">
                            <a href={`https://solscan.io/tx/${tx.txSignature}`} target="_blank" rel="noopener noreferrer">
                                View
                            </a>
                        </span>
                        <span className="tx-date">{new Date(tx.timestamp).toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminTransactionsPanel;
