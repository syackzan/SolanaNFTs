import { URI_SERVER } from "./config";

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
