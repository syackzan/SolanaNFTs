const axios = require('axios');

async function fetchRollQualityHelper(seedNumber, rollQuality, rarity) {
  if (!seedNumber || !rollQuality || !rarity) {
    throw new Error("Missing required parameters");
  }

  const token = await getBearerToken();

  const buildURL = `https://cloud-code.services.api.unity.com/v1/projects/${process.env.BB_PROJECT_ID}/modules/BoohItemRollQualityModule/RollItemAttributesRemote`;

  const response = await axios.post(
    buildURL,
    {
      params: {
        statsRollSeed: seedNumber,
        rollQuality,
        rarityStr: rarity
      }
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
}

async function getBearerToken() {
    const credentials = Buffer.from(`${process.env.BB_KEY_ID}:${process.env.BB_SECRET_KEY}`).toString('base64');

    const res = await fetch(
        `https://services.api.unity.com/auth/v1/token-exchange?projectId=${process.env.BB_PROJECT_ID}&environmentId=${process.env.BB_ENVIRONMENT_ID}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/json',
            },
        }
    );

    console.log("✅ Bearer Token Fetched!");
    const data = await res.json();

    if (!res.ok) {
        throw new Error(`Failed to get bearer token: ${JSON.stringify(data)}`);
    }

    return data.accessToken;
}

const applyAttributes = (attributes, rolledAttributes) => {
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

const rollSecureRandomInt = () => {
  const min = -2147483648;
  const max = 2147483648;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {fetchRollQualityHelper, rollSecureRandomInt, applyAttributes};