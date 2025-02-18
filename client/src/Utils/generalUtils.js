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

export const duplicateData = (data, index, times) => {

    console.log('Duplicate Data');
    if (!data || data.length <= index) {
        console.error("Invalid data array or index out of bounds");
        return [];
    }

    // Get the item at the specified index
    const itemToDuplicate = data[index];

    console.log(itemToDuplicate)

    // Duplicate it `times` number of times
    const newArray = Array(times).fill({ ...itemToDuplicate });

    return newArray;
};

//Function to shorten long address strings
export const shortenAddress = (address, chars = 4) => {
    if (!address) return '';
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};
