// nftFilter.js

/**
 * Filters an array of NFTs based on provided criteria.
 *
 * @param {Array} nfts - The array of NFTs to filter.
 * @param {Object} filters - The filter criteria.
 * @param {string} [filters.type] - The type to filter by (e.g., "weapon", "armor").
 * @param {string} [filters.subtype] - The subtype to filter by.
 * @param {string} [filters.rarity] - The rarity to filter by (e.g., "common", "rare").
 * @returns {Array} - The filtered array of NFTs.
 */
export const filterNFTs = (nfts, filters) => {
    return nfts.filter((nft) => {
        // Check type
        if (
            filters.type &&
            filters.type !== "all" && // Skip filtering if "all" is selected
            !nft.attributes.some(
                (attr) => attr.trait_type === "type" && attr.value === filters.type
            )
        ) {
            return false;
        }

        // Check subtype
        if (
            filters.subtype &&
            filters.subtype !== "all" && // Skip filtering if "all" is selected
            !nft.attributes.some(
                (attr) => attr.trait_type === "subType" && attr.value === filters.subtype
            )
        ) {
            return false;
        }

        // Check rarity
        if (
            filters.rarity &&
            filters.rarity !== "all" && // Skip filtering if "all" is selected
            !nft.attributes.some(
                (attr) => attr.trait_type === "rarity" && attr.value === filters.rarity
            )
        ) {
            return false;
        }

        // Check creator
        if (
            filters.creator &&
            filters.creator !== "all" && // Skip filtering if "all" is selected
            nft.storeInfo.creator !== filters.creator
        ) {
            return false;
        }

        return true; // Include the NFT if all filters pass
    });
};
  
  /**
   * Combines multiple filter options to create complex filtering logic.
   * For example, you can pass multiple types, subtypes, or rarities.
   *
   * @param {Array} nfts - The array of NFTs to filter.
   * @param {Object} filters - The filter criteria.
   * @param {Array<string>} [filters.types] - Array of types to filter by.
   * @param {Array<string>} [filters.subtypes] - Array of subtypes to filter by.
   * @param {Array<string>} [filters.rarities] - Array of rarities to filter by.
   * @returns {Array} - The filtered array of NFTs.
   */
  export const advancedFilterNFTs = (nfts, filters) => {
    return nfts.filter((nft) => {
      // Check types (if provided)
      if (filters.types && filters.types.length > 0 && !filters.types.includes(nft.type)) {
        return false;
      }
  
      // Check subtypes (if provided)
      if (filters.subtypes && filters.subtypes.length > 0 && !filters.subtypes.includes(nft.subtype)) {
        return false;
      }
  
      // Check rarities (if provided)
      if (filters.rarities && filters.rarities.length > 0 && !filters.rarities.includes(nft.rarity)) {
        return false;
      }
  
      return true; // Include the NFT if all filters pass
    });
  };
  
  /** Example Usage
   * Import the function and use it to filter your NFT array.
   *
   * import { filterNFTs, advancedFilterNFTs } from './nftFilter';
   *
   * const nfts = [
   *   { type: 'weapon', subtype: 'sword', rarity: 'rare' },
   *   { type: 'armor', subtype: 'shield', rarity: 'common' },
   *   { type: 'weapon', subtype: 'bow', rarity: 'legendary' },
   * ];
   *
   * // Simple filter
   * const filtered = filterNFTs(nfts, { type: 'weapon', rarity: 'rare' });
   * console.log(filtered);
   *
   * // Advanced filter
   * const advancedFiltered = advancedFilterNFTs(nfts, {
   *   types: ['weapon', 'armor'],
   *   rarities: ['rare', 'legendary'],
   * });
   * console.log(advancedFiltered);
   */

  // Function to sort NFTs by rarity
  export const sortNFTsByRarity = (nfts) => {
    const rarityOptions = [
        'common',
        'uncommon',
        'rare',
        'epic',
        'legendary'
    ];

    // Create a map for rarity ranks
    const rarityRank = rarityOptions.reduce((map, rarity, index) => {
        map[rarity] = index;
        return map;
    }, {});

    return nfts.sort((a, b) => {
        const rarityA = a.attributes.find(attr => attr.trait_type === 'rarity')?.value || 'unknown';
        const rarityB = b.attributes.find(attr => attr.trait_type === 'rarity')?.value || 'unknown';

        // Handle missing or invalid rarity values
        const rankA = rarityRank[rarityA] !== undefined ? rarityRank[rarityA] : rarityOptions.length;
        const rankB = rarityRank[rarityB] !== undefined ? rarityRank[rarityB] : rarityOptions.length;

        return rankA - rankB;
    });
};