export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const isSolanaWalletApp = () => {
    if (typeof window === "undefined") return false;

    const userAgent = navigator.userAgent.toLowerCase();

    // Detects if the user is on a mobile device
    const isMobile = /android|iphone|ipad|ipod/i.test(userAgent);

    // Detects if the user is using a Solana wallet app (only on mobile)
    return isMobile && (
        userAgent.includes("phantom") ||
        userAgent.includes("solflare") ||
        userAgent.includes("sollet") ||
        userAgent.includes("slope")
    );
};

// Utility function to capitalize the first letter of a string
export const capitalizeFirstLetter = (string) => {
    if (!string) return ""; // Handle empty or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
};