import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUpload } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";

import '../../css/character-submit.css'

import { useWallet } from "@solana/wallet-adapter-react";
import SolConnection from "../Connection/SolConnection";
import { useTransactionsController } from "../../providers/TransactionsProvider";
import TxModalManager from "../txModal/TxModalManager";

const CharacterSubmission = () => {

    const wallet = useWallet();
    const {isModalOpen} = useTransactionsController();

    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Please upload a valid image file.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setError("File size must be under 2MB.");
            return;
        }

        setError("");
        const imageURL = URL.createObjectURL(file);
        setImage(imageURL);
    };

    const handleSubmit = () => {
        if (!image || !name || !description) {
            setError("Please fill in all fields before submitting.");
            return;
        }

        alert(`Character "${name}" submitted successfully!`);
        // Add API call here
    };

    return (
        <div className="character-submission-container">
            <Navbar />
            <motion.div
                className="character-submission-box"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <h2>Submit Your Character</h2>
                <p className="character-description">
                    Got a cool character idea? Turn it into a ghost and bring it to life in <strong>Booh Brawlers</strong>! 👻✨
                    Upload an image of your original (or non-patented) character, and we'll transform it into a battle-ready ghost.
                    As a bonus, you'll receive your very own <strong>NFT reward</strong> of the character!
                    Make sure your <Link to='s'>submission follows the guidelines</Link>—let’s get going! 🚀
                </p>
                <p className='character-description'>
                    Submission Cost: <strong>$24.99</strong>
                </p>

                {/* Name Input */}
                <input 
                    type="text"
                    className="character-input"
                    placeholder="Character Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                {/* Description Input */}
                <textarea 
                    className="character-textarea"
                    placeholder="Describe your character..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                {/* Image Upload */}
                <label className="upload-label">
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    <div>
                        <FaUpload size={20} />
                        <span>Click to upload</span>
                    </div>
                </label>

                {error && <p className="error-message">{error}</p>}

                {image && (
                    <motion.div
                        className="image-preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <img src={image} alt="Character Preview" />
                    </motion.div>
                )}

                {wallet?.publicKey ? (<button 
                    className="submit-button" 
                    onClick={handleSubmit} 
                    disabled={!image || !name || !description}
                >
                    Submit Character
                </button>) : (
                    <div className='mt-4'>
                        <SolConnection />
                    </div>
                    )}
            </motion.div>
            {isModalOpen && <TxModalManager />}
        </div>
    );
};

export default CharacterSubmission;
