import axios from "axios";
import { URI_SERVER } from "../config/config";

const API_KEY = import.meta.env.VITE_SERVE_KEY;

/**
 * Fetch all NFT concepts from the database.
 * @returns {Promise<object[]>} Resolves with an array of NFT concepts.
 * @throws {Error} Throws an error if the request fails.
 */
export const fetchAllNftConcepts = async () => {
    try {
        const response = await axios.get(`${URI_SERVER}/api/nft/concepts`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all NFT concepts:", error.response?.data || error.message);
        throw new Error(`Failed to fetch all NFT concepts: ${error.response?.data?.message || error.message}`);
    }
};

/**
 * Fetch metadata for a specific NFT concept by ID.
 * @param {string} nftId - The ID of the NFT concept.
 * @returns {Promise<object>} Resolves with the NFT metadata.
 * @throws {Error} Throws an error if the request fails.
 */
export const fetchSingleNftMetadata = async (nftId) => {
    try {
        const response = await axios.get(`${URI_SERVER}/api/nft/concepts/${nftId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching NFT metadata:", error.response?.data || error.message);
        throw new Error(`Failed to fetch NFT metadata: ${error.response?.data?.message || error.message}`);
    }
};

/**
 * Add a new NFT concept to the database.
 * @param {object} metadataForDB - The NFT concept metadata.
 * @returns {Promise<object>} Resolves with the created NFT concept.
 * @throws {Error} Throws an error if the request fails.
 */
export const addNftConcept = async (metadataForDB) => {
    try {
        const response = await axios.post(`${URI_SERVER}/api/nft/concepts`, metadataForDB, {
            headers: { "x-api-key": API_KEY }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to add NFT concept:", error.response?.data || error.message);
        throw new Error(`Failed to add NFT concept: ${error.response?.data?.message || error.message}`);
    }
};

/**
 * Update an existing NFT concept.
 * @param {object} updates - Updated NFT concept data.
 * @returns {Promise<object>} Resolves with the updated NFT concept.
 * @throws {Error} Throws an error if the request fails.
 */
export const updateNftConcept = async (updates) => {
    try {
        const response = await axios.patch(
            `${URI_SERVER}/api/nft/concepts/${updates._id}`,
            updates,
            {
                headers: { "x-api-key": API_KEY }
            });
        return response.data;
    } catch (error) {
        console.error("Error updating NFT concept:", error.response?.data || error.message);
        throw new Error(`Error updating NFT concept: ${error.response?.data?.message || error.message}`);
    }
};

/**
 * Save the metadata URI for an NFT concept.
 * @param {string} nftId - The ID of the NFT concept.
 * @param {string} metadataUri - The metadata URI to store.
 * @returns {Promise<object>} Resolves with the updated NFT concept.
 * @throws {Error} Throws an error if the request fails.
 */
export const saveMetadataUri = async (nftId, metadataUri) => {
    try {
        const response = await axios.patch(
            `${URI_SERVER}/api/nft/concepts/${nftId}/metadata`,
            { metadataUri },
            { headers: { "x-api-key": API_KEY } }
        );
        return response.data;
    } catch (error) {
        console.error("Error storing metadata URI:", error.response?.data || error.message);
        throw new Error(`Error storing metadata URI: ${error.response?.data?.message || error.message}`);
    }
};

/**
 * Delete an NFT concept by ID.
 * @param {string} id - The ID of the NFT concept.
 * @returns {Promise<object>} Resolves with the deletion confirmation.
 * @throws {Error} Throws an error if the request fails.
 */
export const deleteNftConcept = async (id) => {
    try {
        const response = await axios.delete(`${URI_SERVER}/api/nft/concepts/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting NFT concept:", error.response?.data || error.message);
        throw new Error(`Error deleting NFT concept: ${error.response?.data?.message || error.message}`);
    }
};

/**
 * Check if a user is an admin based on their wallet address.
 * @param {string} walletAddress - The wallet address to check.
 * @returns {Promise<boolean>} Resolves with `true` if admin, otherwise `false`.
 */
export const checkIfAdmin = async (walletAddress) => {
    try {
        const response = await axios.post(`${URI_SERVER}/api/user/role`, { walletAddress }, {
            headers: { "Content-Type": "application/json" }
        });

        return response.data.isAdmin || false;
    } catch (error) {
        console.error("Failed to check admin role:", error.response?.data || error.message);
        throw new Error(`Failed to check admin role: ${error.response?.data?.message || error.message}`);
    }
};

/**
 * Vote for an NFT concept.
 * @param {string} nftId - The ID of the NFT concept.
 * @param {string} walletAddress - The voter's wallet address.
 * @returns {Promise<object>} Resolves with the updated vote count.
 * @throws {Error} Throws an error if the request fails.
 */
export const voteForNFT = async (nftId, walletAddress) => {
    try {
        const response = await axios.post(`${URI_SERVER}/api/nft/concepts/${nftId}/vote`, { voterAddress: walletAddress }, {
            headers: { "Content-Type": "application/json" }
        });

        return response.data;
    } catch (error) {
        console.error("Error while voting:", error.response?.data || error.message);
        throw new Error(`Failed to vote for NFT: ${error.response?.data?.message || error.message}`);
    }
};
