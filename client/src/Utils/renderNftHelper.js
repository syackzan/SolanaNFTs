import { stats, combinedTraits } from "../config/gameConfig";

//Add "dodge" to talents, since this exists on old metadata
//But has sense been converted to "evasion"
stats.push("dodge");

const traitLabels = {
  health: "HEALTH",
  damage: "DAMAGE",
  defense: "DEFENSE",
  evasion: "EVASION",
  dodge: "EVASION",
  coinMultiplier: "COIN BOOST",
  criticalStrikeDamage: "CRIT DAMAGE",
  specialAttack: "SPECIAL ATK",
  specialDefense: "SPECIAL DEF",
  focus: "FOCUS",
  gasReserve: "GAS RESERVE",
  strength: "STRENGTH"
};

export function getTraitRows(nft) {
  if (!nft?.attributes) return [];

  const stats = Object.fromEntries(
    combinedTraits.map(trait => {
      const value = nft.attributes.find(attr => attr.trait_type === trait)?.value || 0;
      return [trait, value];
    })
  );

  const displayTraits = combinedTraits
    .filter(trait => stats[trait] > 0)
    .map(trait => ({
      label: traitLabels[trait] || trait.toUpperCase(),
      value: `+${stats[trait]}%`
    }));

  // Group into rows of 2
  const rows = [];
  for (let i = 0; i < displayTraits.length; i += 2) {
    rows.push(displayTraits.slice(i, i + 2));
  }

  return rows;
}

/**
 * Accepts an `attributes` array and returns trait rows for rendering.
 * @param {Array} attributes - The NFT attributes array
 * @returns {Array<Array<{ label: string, value: string }>>}
 */
export function getTraitRowsFromAttributes(attributes = []) {
  const stats = Object.fromEntries(
    combinedTraits.map(trait => {
      const value = attributes.find(attr => attr.trait_type === trait)?.value || 0;
      return [trait, value];
    })
  );

  const displayTraits = combinedTraits
    .filter(trait => stats[trait] > 0)
    .map(trait => ({
      label: traitLabels[trait] || trait.toUpperCase(),
      value: stats.includes(trait) ? `+${stats[trait]}%` : `+${stats[trait]}`
    }));

  const rows = [];
  for (let i = 0; i < displayTraits.length; i += 2) {
    rows.push(displayTraits.slice(i, i + 2));
  }

  return rows;
}