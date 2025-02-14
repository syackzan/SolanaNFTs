import React, { useState, useEffect } from "react";
import { voteForNFT } from "../../services/dbServices";
import { useWallet } from "@solana/wallet-adapter-react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

import "../../css/voting-system.css";

const NftVoting = ({ nft }) => {
    const wallet = useWallet();
    const userId = wallet?.publicKey?.toBase58();

    const [voteCount, setVoteCount] = useState(nft.votes.count);
    const [userVote, setUserVote] = useState(null);

    useEffect(() => {
        if (userId && nft.votes.voters.includes(userId)) {
            setUserVote("upvote");
        }
    }, [userId, nft.votes.voters]);

    const handleVote = async (voteType) => {
        if (!userId) {
            alert("Connect your wallet to vote!");
            return;
        }

        if (voteType === "downvote" && voteCount <= 0) return;

        try {
            if (userVote === voteType) {
                // 🔹 If user clicks the same vote type, remove their vote
                setUserVote(null);
                setVoteCount((prev) => Math.max(0, prev - 1)); // Ensure no negative votes
            } else if (voteType === "downvote") {
                // 🔹 Instantly reflect downvote
                setUserVote("downvote");
                setVoteCount((prev) => Math.max(0, prev - 1));
            } else {
                // 🔹 Handle Upvotes
                setUserVote("upvote");
                setVoteCount((prev) => prev + 1);
            }

            await voteForNFT(nft._id, userId, voteType);
        } catch (error) {
            console.error("Voting failed:", error);
            alert("Error processing your vote.");
        }
    };


    return (
        <div className="nft-voting-container d-flex align-items-center gap-1">
            <button
                className={`vote-button ${userVote === "upvote" ? "voted" : ""}`}
                onClick={() => handleVote("upvote")}
                disabled={wallet?.publicKey?.toString() === nft.storeInfo.creator}
            >
                <FaArrowUp />
            </button>
            <span className="vote-count">{voteCount}</span>
            <button
                className={`vote-button ${userVote === "downvote" ? "voted" : ""}`}
                onClick={() => handleVote("downvote")}
                disabled={voteCount <= 0}
            >
                <FaArrowDown />
            </button>
        </div>
    );
};

export default NftVoting;
