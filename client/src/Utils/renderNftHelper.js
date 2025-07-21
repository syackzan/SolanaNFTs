import { stats, statModifiers, combinedTraits } from "../config/gameConfig";

//Add "dodge" to talents, since this exists on old metadata
//But has sense been converted to "evasion"
stats.push("dodge");

const traitLabels = {
  health: "Health",
  damage: "Damage",
  defense: "Defense",
  evasion: "Evasion",
  dodge: "Evasion",
  coinMultiplier: "Coin Boost",
  criticalStrikeDamage: "Crit Damage",
  specialAttack: "Special Atk",
  specialDefense: "Special Def",
  focus: "Focus",
  gasReserve: "Gas Reserve",
  strength: "Strength",
  strengthModifier: "Strength",
  vitalityModifier:  "Vitality",
  agilityModifier:  "Agility",
  resilienceModifier:  "Resilience",
  focusModifier: "Focus",
  fearModifier: "Fear",
  specialAttackModifier: "Special Atk",
  specialDefenseModifier: "Special Def",
  luckModifier: "Luck"
};

const traitContext = {
  health: "boost",
  damage: "boost",
  defense: "boost",
  evasion: "boost",
  dodge: "boost",
  coinMultiplier: "boost",
  criticalStrikeDamage: "boost",
  specialAttack: "boost",
  specialDefense: "boost",
  focus: "boost",
  gasReserve: "boost",
  strength: "modifier",
  strengthModifier: "modifier",
  vitalityModifier:  "modifier",
  agilityModifier:  "modifier",
  resilienceModifier:  "modifier",
  focusModifier: "modifier",
  fearModifier: "modifier",
  specialAttackModifier: "modifier",
  specialDefenseModifier: "modifier",
  luckModifier: "modifier"
}

export function getTraitRows(nft) {
  if (!nft?.attributes) return [];

  const entryStats = Object.fromEntries(
    combinedTraits.map(trait => {
      const value = nft.attributes.find(attr => attr.trait_type === trait)?.value || 0;
      return [trait, value];
    })
  );

  const displayTraits = combinedTraits
    .filter(trait => entryStats[trait] > 0)
    .map(trait => ({
      label: traitLabels[trait] || trait.toUpperCase(),
      value: statModifiers.includes(trait) ? `+${entryStats[trait]}` : `+${entryStats[trait]}%`,
      context: traitContext[trait] || null
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
  const entryStats = Object.fromEntries(
    combinedTraits.map(trait => {
      const value = attributes.find(attr => attr.trait_type === trait)?.value || 0;
      return [trait, value];
    })
  );

  const displayTraits = combinedTraits
    .filter(trait => entryStats[trait] > 0)
    .map(trait => ({
      label: traitLabels[trait] || trait.toUpperCase(),
      value: statModifiers.includes(trait) ? `+${entryStats[trait]}` : `+${entryStats[trait]}%`,
      context: traitContext[trait] || null
    }));

  const rows = [];
  for (let i = 0; i < displayTraits.length; i += 2) {
    rows.push(displayTraits.slice(i, i + 2));
  }

  return rows;
}