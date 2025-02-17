import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchUserSubmissions } from "../../services/dbServices";
import { useWallet } from "@solana/wallet-adapter-react";

const Submissions = () => {
    const wallet = useWallet();
    const [userSubmissions, setUserSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!wallet?.publicKey) return;

        const runAsync = async () => {
            setLoading(true);
            try {
                const data = await fetchUserSubmissions(wallet.publicKey.toString());
                
                setUserSubmissions(data || []);
            } catch (error) {
                console.error("Error fetching submissions:", error);
            } finally {
                setLoading(false);
            }
        };

        runAsync();
    }, [wallet.publicKey]);

    return (
        <div className="submissions-container sidenav-scrollbar">
            <h2 className="submissions-title">Your Submissions</h2>

            {loading ? (
                <p className="loading-text">Loading your submissions...</p>
            ) : userSubmissions?.length === 0 ? (
                <p className="no-submissions-text">You haven't submitted any characters yet.</p>
            ) : (
                <div className="submissions-list">
                    {userSubmissions.map((submission) => (
                        <motion.div
                            key={submission._id}
                            className="submission-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3 className="submission-name">Name: {submission.name}</h3>
                            <p className="submission-description">{submission.description}</p>
                            <p className="submission-status"><strong>Status:</strong> {submission.status}</p>
                            <p className="submission-date"><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>

                            <div className="submission-buttons">
                                {/* View Transaction */}
                                <a 
                                    href={`https://explorer.solana.com/tx/${submission.paymentTx}?cluster=devnet`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="view-button"
                                >
                                    View Transaction
                                </a>

                                {/* View Image */}
                                <a 
                                    href={submission.imageUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="view-button"
                                >
                                    View Image
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Submissions;
