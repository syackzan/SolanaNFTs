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

export const rollSecureRandomInt = () => {
  const min = -2147483648;
  const max = 2147483648;

  const range = max - min + 1;
  const randomBuffer = new Uint32Array(1);
  window.crypto.getRandomValues(randomBuffer);

  const randomFraction = randomBuffer[0] / 0xFFFFFFFF;
  return Math.floor(randomFraction * range) + min;
}

/**
 * Maps rolled attribute fields from Unity to trait_types and applies them.
 *
 * @param {Array<{ trait_type: string, value: string | number }>} attributes - Base metadata attributes.
 * @param {Object} rolledAttributes - Response from Unity's API.
 * @returns {Array} Updated attribute array with applied rolled values.
 */
export const applyAttributes = (attributes, rolledAttributes) => {
  const rolledMap = {
    strengthRolled: "strengthModifier",
    vitalityRolled: "vitalityModifier",
    agilityRolled: "agilityModifier",
    resilienceRolled: "resilienceModifier",
    focusRolled: "focusModifier",
    fearRolled: "fearModifier",
    specialAttackRolled: "specialAttackModifier",
    specialDefenseRolled: "specialDefenseModifier",
    luckRolled: "luckModifier",
    healthRolled: 'health',
    damageRolled: 'damage',
    defenseRolled: 'defense',
    evasionRolled: 'evasion',
    coinMultiplierRolled: 'coinMultiplier',
    criticalStrikeDamageRolled: 'criticalStrikeDamage',
    criticalStrikeChanceRolled: 'criticalStrikeChance',
    focus: 'focus',
    gasReserve: 'gasReserve',
    specialAttack: 'specialAttack',
    specialDefense: 'specialDefense'

    // Add others if needed
  };

  return attributes.map(attr => {
    // Check if there's a rolled version that maps to this trait_type
    const matchedEntry = Object.entries(rolledMap).find(
      ([rolledKey, traitType]) => traitType === attr.trait_type
    );

    if (matchedEntry) {
      const [rolledKey] = matchedEntry;
      if (rolledKey in rolledAttributes) {
        return {
          ...attr,
          value: rolledAttributes[rolledKey].toString(), // keep consistent as string
        };
      }
    }

    // If not rolled, leave unchanged
    return attr;
  });
};