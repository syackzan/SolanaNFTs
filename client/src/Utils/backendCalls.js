import axios from "axios";

import { URI_SERVER } from "../config/config";

/**
 * Fetch metadata for a given NFT ID.
 * @param {string} nftId - The ID of the NFT.
 * @returns {Promise<object>} Resolves with the NFT metadata.
 */


export const fetchSingleNftMetadata = async (nftId) => {
  try {
    const response = await axios.get(`${URI_SERVER}/api/nft/getnftmetadata/${nftId}`); // Fetch metadata by ID
    return response.data; // Return the metadata
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    throw new Error("Failed to fetch NFT metadata.");
  }
};