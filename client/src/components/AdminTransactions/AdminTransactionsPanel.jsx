import React, { useState, useMemo } from "react";

import { useGlobalVariables } from "../../providers/GlobalVariablesProvider";

import { shortenAddress } from "../../Utils/generalUtils";

import { duplicateData } from "../../Utils/generalUtils";

const AdminTransactionsPanel = () => {

    const {nftConcepts} = useGlobalVariables();
    
    const [loading, setLoading] = useState(false);

    const transactions = useMemo(() => {

        // const testData = duplicateData(nftConcepts, 0, 25);
        // return testData;

        return nftConcepts;
    })

    if (loading) {
        return <div className="admin-loading">Loading transactions...</div>;
    }

    return (
        <div className="admin-transactions-container">
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

                {transactions.map((nft) => (
                    nft.purchases.transactions.map((tx, index) => (
                        <div key={`${nft._id}-${index}`} className="table-row">
                            <span className="nft-id">{nft.name}</span>
                            <span className={`tx-type ${tx.type}`}>{tx.type.toUpperCase()}</span>
                            <span className="tx-user">{shortenAddress(tx.user)}</span>
                            <span className="tx-amount">{tx.amount}</span>
                            <span className="tx-currency">{tx.currency}</span>
                            <span className="tx-signature">
                                <a href={`https://solscan.io/tx/${tx.txSignature}`} target="_blank" rel="noopener noreferrer">
                                    View
                                </a>
                            </span>
                            <span className="tx-date">{new Date(tx.timestamp).toLocaleString()}</span>
                        </div>
                    ))
                ))}
            </div>
        </div>
    );
};

export default AdminTransactionsPanel;
