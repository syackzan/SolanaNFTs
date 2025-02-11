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
    return false;
  }
};

export const checkIfAdmin = async (walletAddress) => {
  try {
      
      const response = await fetch(`${URI_SERVER}/api/user/role`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();
      if (response.ok) {
          return data.isAdmin; // true or false
      } else {
          console.error("Error:", data.error);
          return false;
      }
  } catch (error) {
      console.error("Failed to check admin role:", error.message);
      return false;
  }
};

export const voteForNFT = async (nftId, walletAddress) => {
    try {
        const response = await fetch('/api/nft/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nftId, voterAddress: walletAddress }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(`Thank you for voting! Total votes: ${data.votes}`);
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Error while voting:", error);
    }
};