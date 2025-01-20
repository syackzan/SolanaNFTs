import { IS_MAINNET } from "../config";

export const fetchNFTsUtils = async (ownerAddress) => {
    try {
      const wallet = 'B8autx5b8RH4po9XPshCiPc2buyApDpG2nmmCmvJXrn5';
  
      const body = {
        method: "qn_fetchNFTs", // QuickNode's method for fetching NFTs
        params: [wallet, []], // Wallet address and any filters (e.g., collections)
        id: 1, // Unique ID for this request
        jsonrpc: "2.0", // JSON-RPC version
      };
  
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };

      const solanaNode = IS_MAINNET ? import.meta.env.VITE_SOLANA_NODE : import.meta.env.VITE_SOLANA_NODE_DEVNET
  
      const response = await fetch(solanaNode, options);
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();

      // const collection = data.result.assets.filter((nft) => nft.tokenAddress === "8FnXjSmuZBEcnvB9fceHoMBjMpFQgtXjhmVisBATXCyV");
  
      if (data.error) {
        throw new Error(`QuickNode Error: ${data.error.message}`);
      }
  
      console.log("All NFTs:", data.result);
      // console.log("Collection NFTs:", collection);
      // return collection;
    } catch (error) {
      console.error("Failed to fetch NFTs:", error);
      throw error; // Rethrow error if needed
    }
  };
  