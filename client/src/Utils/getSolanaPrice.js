const fetch = require('node-fetch');

// Replace with your QuickNode HTTP URL
const QUICKNODE_URL = import.meta.env.VITE_SOLANA_NODE;

const getSolanaPrice = async () => {
    const response = await fetch(QUICKNODE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            method: "getTokenPrice",
            params: {
                address: "So11111111111111111111111111111111111111112", // SOL address
            },
        }),
    });

    const data = await response.json();
    console.log("Current SOL Price:", data.result.price);
};

getSolanaPrice();